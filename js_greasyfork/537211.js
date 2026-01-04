// ==UserScript==
// @name         Einsatz Endzeit-Anzeige (Panel-Version, sehr kompakt, mit Position speichern) - Modifiziert V8
// @namespace    HendrikStaufenbiel
// @version      1.9.20
// @description  Zeigt bei Verbands-Einsätzen das früheste Zufahrts-Ende. Eigene Einsätze: Endzeit wird bei Freigabe (panel-success) basierend auf dem Freigabezeitpunkt einmalig berechnet & gespeichert. Anzeige eigener Endzeiten steuerbar. Präzisere Credit-Summe. Endzeit auch im Alarmfenster.
// @author       Hendrik (Modifiziert durch KI)
// @match        https://www.leitstellenspiel.de/
// @match        https://www.leitstellenspiel.de/missions/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537211/Einsatz%20Endzeit-Anzeige%20%28Panel-Version%2C%20sehr%20kompakt%2C%20mit%20Position%20speichern%29%20-%20Modifiziert%20V8.user.js
// @updateURL https://update.greasyfork.org/scripts/537211/Einsatz%20Endzeit-Anzeige%20%28Panel-Version%2C%20sehr%20kompakt%2C%20mit%20Position%20speichern%29%20-%20Modifiziert%20V8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Loggen des Skriptstarts und der Version
    console.log(`Einsatz Endzeit-Anzeige: Skript gestartet (Version ${GM_info.script.version})`);

    // Verhindert, dass das Skript mehrfach ausgeführt wird
    if (window.hasRunEinsatzEndzeitScriptVerband) return;
    window.hasRunEinsatzEndzeitScriptVerband = true;

    // Schlüssel für die Speicherung im localStorage
    const STORAGE_KEY_IGNORED = 'chaos_ignored_einsaetze_verband';
    const CHAOS_MODE_KEY = 'chaos_mode_activated';
    const OWN_MISSIONS_SHOW_KEY = 'show_own_missions_over_10k';
    const POSITION_KEY = 'einsatz_endzeit_panel_position';
    const OWN_MISSION_FIXED_END_TIMES_KEY = 'own_mission_fixed_end_times_v4';
    const ALLIANCE_MISSION_DATA_KEY = 'alliance_mission_data'; // NEU: Schlüssel für Verbandseinsatzdaten

    // Laden der gespeicherten Daten
    const ignoredEinsaetze = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY_IGNORED) || '[]'));
    let chaosMode = JSON.parse(localStorage.getItem(CHAOS_MODE_KEY) || 'false');
    let showOwnMissionsEndTime = JSON.parse(localStorage.getItem(OWN_MISSIONS_SHOW_KEY) || 'false');
    const eingeklappteMissionen = new Set(); // Diese Variable scheint im bereitgestellten Skript ungenutzt zu sein, wird aber zur Konsistenz beibehalten.
    let ownMissionFixedEndTimes = JSON.parse(localStorage.getItem(OWN_MISSION_FIXED_END_TIMES_KEY) || '{}');
    let allianceMissionData = JSON.parse(localStorage.getItem(ALLIANCE_MISSION_DATA_KEY) || '{}'); // NEU: Laden der Verbandseinsatzdaten

    // Globale Variablen für die Panel-Anzeige
    let einsatzMitFruehestemEnde = null;
    let creditDisplayGlobal = null;

    // Hilfsfunktionen zum Speichern und Laden von Daten aus dem localStorage
    function saveIgnored() { localStorage.setItem(STORAGE_KEY_IGNORED, JSON.stringify([...ignoredEinsaetze])); }
    function saveChaosMode() { localStorage.setItem(CHAOS_MODE_KEY, JSON.stringify(chaosMode)); }
    function saveShowOwnMissionsEndTimeSetting() { localStorage.setItem(OWN_MISSIONS_SHOW_KEY, JSON.stringify(showOwnMissionsEndTime)); }
    function savePanelPosition(left, top) { localStorage.setItem(POSITION_KEY, JSON.stringify({ left, top })); }
    function saveOwnMissionFixedEndTimes() { localStorage.setItem(OWN_MISSION_FIXED_END_TIMES_KEY, JSON.stringify(ownMissionFixedEndTimes)); }
    function saveAllianceMissionData() {
        localStorage.setItem(ALLIANCE_MISSION_DATA_KEY, JSON.stringify(allianceMissionData));
        // console.log("LocalStorage: Verbandseinsatzdaten gespeichert:", allianceMissionData); // Reduziertes Log
    }
    function loadPanelPosition() { const pos = localStorage.getItem(POSITION_KEY); return pos ? JSON.parse(pos) : null; }

    // Formatiert einen Unix-Timestamp in einen HH:MM-String
    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Berechnet den Zeit-Offset basierend auf den durchschnittlichen Credits und dem Chaos-Modus
    function calculateOffset(avgCredits, isOwnMissionCalculation = false) {
        if (isOwnMissionCalculation) {
            // Logik für eigene Einsätze
            if (chaosMode) { return avgCredits > 5000 ? 5400 : 1800; } // 90 min / 30 min
            else { return avgCredits <= 4999 ? 3600 : 10800; } // 60 min / 180 min
        } else {
            // Logik für Verbandseinsätze
            return chaosMode ? (avgCredits <= 4999 ? 1800 : 5400) : (avgCredits <= 4999 ? 3600 : 10800); // 30 min / 90 min (Chaos) oder 60 min / 180 min (Normal)
        }
    }

    // Verarbeitet und speichert die Endzeit für eigene Einsätze, wenn sie 'panel-success' werden
    function processAndStoreOwnMissionEndTime(missionDataNode, useCurrentTimeAsBase) {
        if (!missionDataNode) { console.warn("processAndStoreOwnMissionEndTime aufgerufen mit undefiniertem missionDataNode"); return; }
        const missionId = missionDataNode.getAttribute('mission_id');
        // Nur verarbeiten, wenn missionId existiert, noch nicht gespeichert ist und keine gelöschte Mission ist
        if (!missionId || ownMissionFixedEndTimes[missionId] || missionDataNode.classList.contains('mission_deleted')) { return; }

        const sortableRaw = missionDataNode.getAttribute('data-sortable-by');
        if (!sortableRaw) { console.warn(`Eigene Mission ${missionId} (auf ${missionDataNode.id}) hat kein data-sortable-by.`); return; }

        try {
            const sortableData = JSON.parse(sortableRaw.replace(/&quot;/g, '"'));
            const avgCredits = sortableData.average_credits;
            // 'age' ist hier bereits der Unix-Timestamp des Einsatz-Eingangs
            const initialGenerationTimestamp = Number(sortableData.age); // Explizite Umwandlung zu Number

            const offset = calculateOffset(avgCredits, true); // Offset für eigene Mission berechnen
            const endTimestamp = initialGenerationTimestamp + offset; // Korrigierte Endzeitberechnung

            ownMissionFixedEndTimes[missionId] = endTimestamp; // Die berechnete Endzeit speichern
            saveOwnMissionFixedEndTimes();
            // console.log(`EIGENE MISSION ${missionId}: Endzeit ${formatTime(endTimestamp)} gespeichert (Basis: ${formatTime(initialGenerationTimestamp)}, Offset: ${offset/60}min).`); // Reduziertes Log
            addEndTimes(); // Seitenleisten-Anzeige aktualisieren
            addEndTimeToMissionContent(); // Alarmfenster-Anzeige aktualisieren
        } catch (err) { console.error(`Fehler beim Verarbeiten der eigenen Mission ${missionId}:`, err, missionDataNode); }
    }

    // Verarbeitet die Einsatzliste (Seitenleiste) für Verbandseinsätze und eigene Einsätze
    function verarbeiteEinsatzliste(container, isOwn = false) {
        if (!container) return { fruehesteZeit: Infinity, eintrag: null, gesamtCredits: 0 };
        let fruehesteZeit = Infinity;
        let fruehesterEintrag = null;
        let gesamtCreditsInListe = 0;

        container.querySelectorAll('.missionSideBarEntry').forEach(entry => {
            const missionId = entry.getAttribute('mission_id');
            if (!missionId || ignoredEinsaetze.has(missionId)) return; // Überspringen, wenn keine ID oder ignoriert

            const isDeleted = entry.classList.contains('mission_deleted');
            if (isDeleted) {
                // Wenn eine Mission gelöscht wird, die feste Endzeit aus dem Speicher entfernen
                if (isOwn && ownMissionFixedEndTimes[missionId]) {
                    delete ownMissionFixedEndTimes[missionId];
                    saveOwnMissionFixedEndTimes();
                }
                // Auch aus dem Verbandseinsatz-Cache entfernen, falls vorhanden
                if (!isOwn && allianceMissionData[missionId]) {
                    delete allianceMissionData[missionId];
                    saveAllianceMissionData(); // Speichern nach dem Löschen
                }

                // Auch die Anzeige aus der Panel-Überschrift entfernen, falls vorhanden
                const panelHeading = entry.querySelector(`div[id="mission_panel_heading_${missionId}"]`);
                if(panelHeading){ const zeitAnzeige = panelHeading.querySelector('.endzeit-anzeige'); if (zeitAnzeige) zeitAnzeige.remove(); }
                return;
            }

            const sortableRaw = entry.getAttribute('data-sortable-by');
            if (!sortableRaw) return; // Überspringen, wenn keine sortierbaren Daten vorhanden sind

            try {
                const sortableData = JSON.parse(sortableRaw.replace(/&quot;/g, '"'));
                const avgCredits = sortableData.average_credits;
                // 'age' ist hier bereits der Unix-Timestamp des Einsatz-Eingangs
                const initialGenerationTimestamp = Number(sortableData.age); // Explizite Umwandlung zu Number

                let currentEndTimestamp;
                let shouldDisplayTime = false;

                if (isOwn) {
                    // Für eigene Einsätze die gespeicherte feste Endzeit verwenden, falls verfügbar
                    const innerPanel = entry.querySelector(`div[id="mission_panel_${missionId}"]`);
                    if (ownMissionFixedEndTimes[missionId]) {
                        gesamtCreditsInListe += avgCredits;
                        if (showOwnMissionsEndTime) { // Nur anzeigen, wenn die Einstellung dies zulässt
                            currentEndTimestamp = ownMissionFixedEndTimes[missionId];
                            shouldDisplayTime = true;
                        }
                    } else if (innerPanel && innerPanel.classList.contains('panel-success')) {
                        // Wenn eigene Mission 'panel-success' ist, aber noch nicht gespeichert, verarbeiten und speichern
                        processAndStoreOwnMissionEndTime(entry, true); // Dies wird die Endzeit berechnen und speichern
                        if (ownMissionFixedEndTimes[missionId]) { // Nach dem Speichern erneut prüfen
                           gesamtCreditsInListe += avgCredits;
                           if (showOwnMissionsEndTime) {
                               currentEndTimestamp = ownMissionFixedEndTimes[missionId];
                               shouldDisplayTime = true;
                           }
                        }
                    }
                } else { // Verbandseinsatz
                    const offset = calculateOffset(avgCredits, false); // Offset für Verbandseinsatz berechnen
                    currentEndTimestamp = initialGenerationTimestamp + offset; // Korrigierte Endzeitberechnung
                    shouldDisplayTime = true;
                    gesamtCreditsInListe += avgCredits;

                    // Daten für Verbandseinsatz im temporären Speicher ablegen, wenn auf der Hauptseite
                    if (window.location.pathname === '/') {
                        const storedMission = allianceMissionData[missionId];
                        // Prüfen, ob Mission bereits im Cache und aktuell ist
                        const isCached = storedMission && storedMission.genTime === initialGenerationTimestamp;

                        // console.log(`DEBUG (Caching): Mission ID: ${missionId}`); // Reduziertes Log
                        // if (storedMission) { // Reduziertes Log
                        //     console.log(`DEBUG (Caching): Stored genTime: ${storedMission.genTime} (Type: ${typeof storedMission.genTime})`); // Reduziertes Log
                        // } else { // Reduziertes Log
                        //     console.log(`DEBUG (Caching): No stored mission found.`); // Reduziertes Log
                        // }
                        // console.log(`DEBUG (Caching): Current initialGenerationTimestamp: ${initialGenerationTimestamp} (Type: ${typeof initialGenerationTimestamp})`); // Reduziertes Log
                        // console.log(`DEBUG (Caching): Is cached: ${isCached}`); // Reduziertes Log


                        if (!isCached) {
                            allianceMissionData[missionId] = {
                                avgCredits: avgCredits,
                                genTime: initialGenerationTimestamp // Speichern des initialen Generation-Timestamps
                            };
                            // console.log(`DEBUG (Caching): Storing/Updating alliance mission ${missionId} in cache. New genTime: ${initialGenerationTimestamp}`); // Reduziertes Log
                        } else {
                            // console.log(`DEBUG (Caching): Alliance mission ${missionId} already in cache and up-to-date. Skipping write.`); // Reduziertes Log
                        }
                    }
                }

                const panelHeading = entry.querySelector(`div[id="mission_panel_heading_${missionId}"]`);
                if (panelHeading) {
                    let zeitAnzeige = panelHeading.querySelector('.endzeit-anzeige');
                    if (shouldDisplayTime && currentEndTimestamp) {
                        // Früheste Endzeit für das Panel aktualisieren
                        if (currentEndTimestamp < fruehesteZeit) {
                            fruehesteZeit = currentEndTimestamp;
                            fruehesterEintrag = entry;
                        }
                        // Endzeit-Anzeige in der Seitenleiste erstellen oder aktualisieren
                        if (!zeitAnzeige) {
                            zeitAnzeige = document.createElement('div');
                            zeitAnzeige.className = 'endzeit-anzeige';
                            Object.assign(zeitAnzeige.style, {
                                marginLeft: '8px', fontSize: 'smaller', color: 'white', backgroundColor: '#ff0000',
                                padding: '2px 6px', borderRadius: '4px', display: 'inline-block',
                                boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)'
                            });
                            // Klick-Listener hinzufügen, um die Mission auszublenden und zu ignorieren
                            zeitAnzeige.addEventListener('click', (e) => {
                                e.stopPropagation();
                                zeitAnzeige.style.display = 'none';
                                ignoredEinsaetze.add(missionId);
                                saveIgnored();
                                addEndTimes(); // Endzeiten nach dem Ignorieren neu bewerten
                            });
                            panelHeading.appendChild(zeitAnzeige);
                        }
                        zeitAnzeige.textContent = `Ende: ${formatTime(currentEndTimestamp)}`;
                        zeitAnzeige.style.display = 'inline-block';
                    } else {
                        if (zeitAnzeige) zeitAnzeige.style.display = 'none'; // Ausblenden, falls nicht zutreffend
                    }
                }
            } catch (err) { console.error('Fehler in verarbeiteEinsatzliste:', err, entry); }
        });

        // Verbandseinsatzdaten speichern, wenn auf der Hauptseite und Änderungen vorgenommen wurden
        // Da wir direkt in allianceMissionData schreiben und die isCached-Prüfung haben,
        // speichern wir hier nur einmal am Ende des Durchlaufs, wenn wir auf der Hauptseite sind.
        if (!isOwn && window.location.pathname === '/') {
            saveAllianceMissionData(); // Speichert alle aktualisierten oder neuen Einträge
        }

        return { fruehesteZeit: Infinity, eintrag: null, gesamtCredits: gesamtCreditsInListe }; // Gesamtcredits immer zurückgeben, frühesteZeit und Eintrag nur für Seitenleiste relevant
    }

    // Hauptfunktion zum Aktualisieren der Endzeiten im Seitenleisten-Panel
    function addEndTimes() {
        // Diese Funktion wird nur auf der Hauptseite aufgerufen
        if (window.location.pathname !== '/') {
            return;
        }

        const allianceContainer = document.querySelector('#mission_list_alliance');
        const ownContainer = document.querySelector('#mission_list');

        const allianceResult = verarbeiteEinsatzliste(allianceContainer, false);
        const ownResult = verarbeiteEinsatzliste(ownContainer, true);

        let nextEndTimeToShow = Infinity;
        let creditsForPanelDisplay = 0;
        einsatzMitFruehestemEnde = null; // Reset für jeden Durchlauf

        // Finden der frühesten Endzeit für das Panel aus beiden Listen
        const allMissionEntries = document.querySelectorAll('.missionSideBarEntry');
        allMissionEntries.forEach(entry => {
            const missionId = entry.getAttribute('mission_id');
            if (!missionId || ignoredEinsaetze.has(missionId)) return;

            const sortableRaw = entry.getAttribute('data-sortable-by');
            if (!sortableRaw) return;

            try {
                const sortableData = JSON.parse(sortableRaw.replace(/&quot;/g, '"'));
                const avgCredits = sortableData.average_credits;
                // 'age' ist hier bereits der Unix-Timestamp des Einsatz-Eingangs
                const initialGenerationTimestamp = Number(sortableData.age); // Explizite Umwandlung zu Number

                const isOwn = entry.closest('#mission_list') !== null; // Prüfen, ob es eine eigene Mission ist

                let currentEndTimestamp;
                if (isOwn) {
                    if (ownMissionFixedEndTimes[missionId]) {
                        currentEndTimestamp = ownMissionFixedEndTimes[missionId];
                    } else {
                        currentEndTimestamp = initialGenerationTimestamp + calculateOffset(avgCredits, true); // Korrigierte Endzeitberechnung
                    }
                } else {
                    currentEndTimestamp = initialGenerationTimestamp + calculateOffset(avgCredits, false); // Korrigierte Endzeitberechnung
                }

                if (currentEndTimestamp < nextEndTimeToShow) {
                    nextEndTimeToShow = currentEndTimestamp;
                    einsatzMitFruehestemEnde = entry;
                }
                creditsForPanelDisplay += avgCredits;

            } catch (err) {
                console.error('Fehler beim Aktualisieren des Panels in addEndTimes:', err, entry);
            }
        });


        if (nextEndTimeToShow < Infinity) {
            updatePanel(formatTime(nextEndTimeToShow), creditsForPanelDisplay);
        } else {
            updatePanel("N/A", creditsForPanelDisplay);
        }
    }

    // Aktualisiert das verschiebbare Panel mit der nächsten Endzeit und den Gesamt-Credits
    function updatePanel(zeit, credits) {
        const btnNextEnd = document.getElementById('btnNextEnd');
        if (btnNextEnd) btnNextEnd.textContent = `Nächste Endzeit: ${zeit}`;
        if (creditDisplayGlobal) {
            creditDisplayGlobal.title = `Summe Credits (Verband + Eigene, wenn AN): ${credits.toLocaleString()} Cr`;
        }
    }

    // Erstellt das verschiebbare Panel für die Endzeitanzeige und Steuerelemente
    function createDraggablePanel() {
        const panel = document.createElement('div');
        panel.id = 'endzeit-panel';
        const pos = loadPanelPosition();
        Object.assign(panel.style, {
            position: 'absolute', top: `${pos?.top ?? 100}px`, left: `${pos?.left ?? 100}px`,
            zIndex: '5000', background: '#1e1e1e', color: '#fff', padding: '4px 6px',
            borderRadius: '6px', border: '2px solid #555', boxShadow: '0 0 6px rgba(0,0,0,0.5)',
            cursor: 'move', userSelect: 'none', display: 'flex', alignItems: 'center',
            gap: '6px', whiteSpace: 'nowrap', fontSize: '11px', fontWeight: '600'
        });
        panel.innerHTML = `
            <button id="btnNextEnd" title="Zur nächsten Endzeit springen">Nächste Endzeit: N/A</button>
            <button id="btnResetIgnored" title="Ignorierte Einsätze zurücksetzen">↺</button>
            <button id="btnToggleChaos" title="Chaostage an/aus">Chaostage: ${chaosMode ? 'AN' : 'AUS'}</button>
            <button id="btnToggleOwnMissions" title="Anzeige eigener Endzeiten an/aus">Eigene: ${showOwnMissionsEndTime ? 'AN' : 'AUS'}</button>
            <div id="creditDisplayPanel" title="Summe Credits (Verband + Eigene, wenn AN)" style="background:#2980b9; width:16px; height:16px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:bold; font-size:11px; cursor: default; user-select:none;">ⓘ</div>`;
        document.body.appendChild(panel);
        creditDisplayGlobal = document.getElementById('creditDisplayPanel');

        // Schaltflächen stylen
        const btnNextEnd = document.getElementById('btnNextEnd');
        Object.assign(btnNextEnd.style, { backgroundColor: '#888888', color: '#ff0000', border: 'none', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 4px rgba(255,0,0,0.6)', fontSize: '11px' });

        const btnResetIgnored = document.getElementById('btnResetIgnored');
        Object.assign(btnResetIgnored.style, { backgroundColor: '#666', color: '#fff', border: 'none', padding: '3px 7px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', lineHeight: '1', boxShadow: '0 0 4px rgba(255,255,255,0.4)', userSelect: 'none' });

        const btnToggleChaos = document.getElementById('btnToggleChaos');
        const updateChaosButtonStyles = () => {
            btnToggleChaos.style.backgroundColor = chaosMode ? '#e74c3c' : '#27ae60';
            btnToggleChaos.style.color = '#fff';
            btnToggleChaos.style.boxShadow = chaosMode ? '0 0 6px rgba(231,76,60,0.8)' : '0 0 6px rgba(39,174,96,0.8)';
        };
        updateChaosButtonStyles();
        Object.assign(btnToggleChaos.style, { border: 'none', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' });

        const btnToggleOwnMissions = document.getElementById('btnToggleOwnMissions');
        const updateOwnMissionsButtonStyles = () => {
            if (showOwnMissionsEndTime) {
                btnToggleOwnMissions.style.backgroundColor = '#27ae60';
                btnToggleOwnMissions.style.color = '#fff';
                btnToggleOwnMissions.style.boxShadow = '0 0 6px rgba(39,174,96,0.8)';
            } else {
                btnToggleOwnMissions.style.backgroundColor = '#e74c3c';
                btnToggleOwnMissions.style.color = '#fff';
                btnToggleOwnMissions.style.boxShadow = '0 0 6px rgba(231,76,60,0.8)';
            }
        };
        updateOwnMissionsButtonStyles();
        Object.assign(btnToggleOwnMissions.style, { border: 'none', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' });

        // Funktionalität zum Ziehen des Panels
        let isDragging = false, offsetX, offsetY;
        panel.addEventListener('mousedown', (e) => {
            // Verhindert das Ziehen beim Klicken auf Schaltflächen oder das Info-Symbol
            if (e.target.tagName === 'BUTTON' || e.target.id === 'creditDisplayPanel') return;
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            e.preventDefault(); // Verhindert Textauswahl etc.
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                savePanelPosition(panel.getBoundingClientRect().left, panel.getBoundingClientRect().top);
            }
        });

        // Event-Listener für Schaltflächen
        btnNextEnd.addEventListener('click', () => {
            if (einsatzMitFruehestemEnde) {
                einsatzMitFruehestemEnde.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const panelHeading = einsatzMitFruehestemEnde.querySelector(`div[id^="mission_panel_heading_"]`);
                if(panelHeading){
                    const endzeitAnzeige = panelHeading.querySelector('.endzeit-anzeige');
                    if (endzeitAnzeige) {
                        endzeitAnzeige.classList.add('blink-animation');
                        setTimeout(() => endzeitAnzeige.classList.remove('blink-animation'), 5000);
                    }
                }
            }
        });
        btnResetIgnored.addEventListener('click', () => { ignoredEinsaetze.clear(); saveIgnored(); addEndTimes(); });
        btnToggleChaos.addEventListener('click', () => {
            chaosMode = !chaosMode;
            btnToggleChaos.textContent = `Chaostage: ${chaosMode ? 'AN' : 'AUS'}`;
            updateChaosButtonStyles();
            saveChaosMode();
            addEndTimes(); // Endzeiten für Seitenleiste neu bewerten
            addEndTimeToMissionContent(); // Endzeiten für Alarmfenster neu bewerten
        });
        btnToggleOwnMissions.addEventListener('click', () => {
            showOwnMissionsEndTime = !showOwnMissionsEndTime;
            btnToggleOwnMissions.textContent = `Eigene: ${showOwnMissionsEndTime ? 'AN' : 'AUS'}`;
            updateOwnMissionsButtonStyles();
            saveShowOwnMissionsEndTimeSetting();
            addEndTimes(); // Endzeiten für Seitenleiste neu bewerten
            addEndTimeToMissionContent(); // Endzeiten für Alarmfenster neu bewerten
        });
    }

    // --- NEUE FUNKTIONALITÄT FÜR DAS ALARMFENSTER ---

    // Fügt die Endzeitanzeige im Missionsinhalt (Alarmfenster) hinzu oder aktualisiert sie
    function addEndTimeToMissionContent() {
        // Diese Funktion wird nur auf Missionsdetailseiten aufgerufen
        if (!window.location.pathname.startsWith('/missions/')) {
            return;
        }

        // console.log("addEndTimeToMissionContent: Funktion aufgerufen."); // Reduziertes Log

        const missionH1Element = document.getElementById('missionH1');
        if (!missionH1Element) {
            // console.log("addEndTimeToMissionContent: Element #missionH1 nicht gefunden. Alarmfenster nicht geöffnet oder noch nicht geladen."); // Reduziertes Log
            return;
        }

        const missionRepliesElement = document.getElementById('mission_replies');
        if (!missionRepliesElement) {
            console.warn("addEndTimeToMissionContent: Element #mission_replies nicht gefunden. Kann Endzeit nicht einfügen.");
            return;
        }
        const insertionPoint = missionRepliesElement; // Wir fügen davor ein.
        const missionContentContainer = missionRepliesElement.parentNode; // Der Container, der die Anzeige enthält

        // console.log("addEndTimeToMissionContent: missionRepliesElement gefunden. Einfügepunkt ist vor diesem Element."); // Reduziertes Log

        // Missions-ID aus der URL oder dem Element extrahieren
        let missionId = window.location.pathname.split('/')[2];
        if (!missionId) {
            const missionIdInput = document.getElementById('mission_reply_mission_id');
            if (missionIdInput) {
                missionId = missionIdInput.value;
            } else {
                const missionIdLink = missionH1Element.querySelector('a[href*="mission_id="]');
                if (missionIdLink) {
                    const hrefMatch = missionIdLink.href.match(/mission_id=(\d+)/);
                    if (hrefMatch && hrefMatch[1]) {
                        missionId = hrefMatch[1];
                        // console.log(`addEndTimeToMissionContent: Missions-ID aus missionH1 <a>-Tag extrahiert: ${missionId}`); // Reduziertes Log
                    }
                }
            }
        }
        if (!missionId) {
            console.warn("addEndTimeToMissionContent: Missions-ID für Alarmfenster konnte nicht ermittelt werden.");
            return;
        }
        // console.log(`addEndTimeToMissionContent: Missions-ID: ${missionId}`); // Reduziertes Log

        // Bestimmen, ob es sich um eine eigene Mission oder eine Verbandsmission handelt
        const isOwnMission = document.querySelector(`#mission_list .missionSideBarEntry[mission_id="${missionId}"]`) !== null;
        // console.log(`addEndTimeToMissionContent: Ist eigene Mission: ${isOwnMission}`); // Reduziertes Log

        let currentEndTimestamp = null;
        let initialGenerationTimestampForDisplay = null; // Für die Anzeige der genTime
        let shouldDisplay = true;

        if (isOwnMission) {
            if (ownMissionFixedEndTimes[missionId]) {
                currentEndTimestamp = ownMissionFixedEndTimes[missionId];
                // console.log(`addEndTimeToMissionContent: Eigene Mission, Endzeit aus Speicher: ${formatTime(currentEndTimestamp)}`); // Reduziertes Log
                // Für eigene Missionen haben wir den initialGenerationTimestamp nicht direkt im Speicher,
                // da er zum Zeitpunkt der Freigabe berechnet und dann nur die Endzeit gespeichert wird.
                // Wenn wir ihn hier anzeigen wollen, müssten wir ihn aus dem data-sortable-by des Seitenleisten-Eintrags holen.
                // Da der Request sich auf Verbandseinsätze bezog, lassen wir es hier erstmal weg oder holen es bei Bedarf.
            } else {
                // console.log(`addEndTimeToMissionContent: Eigene Mission ${missionId} nicht in festem Speicher gefunden. Keine Anzeige.`); // Reduziertes Log
                shouldDisplay = false; // Keine Anzeige, wenn nicht im Speicher
            }
            shouldDisplay = shouldDisplay && showOwnMissionsEndTime; // Zusätzlich von Einstellung abhängig
            // console.log(`addEndTimeToMissionContent: Anzeige eigene Missionen aktiviert: ${showOwnMissionsEndTime}, Soll angezeigt werden: ${shouldDisplay}`); // Reduziertes Log

        } else { // Verbandseinsatz
            const storedAllianceMission = allianceMissionData[missionId];
            if (storedAllianceMission && storedAllianceMission.avgCredits && storedAllianceMission.genTime) {
                const avgCreditsFromData = storedAllianceMission.avgCredits;
                const initialGenerationTimestampFromData = Number(storedAllianceMission.genTime); // Explizite Umwandlung zu Number
                initialGenerationTimestampForDisplay = initialGenerationTimestampFromData; // Für die Anzeige speichern

                // console.log(`addEndTimeToMissionContent: Verbandseinsatz, Daten aus localStorage: avgCredits=${avgCreditsFromData}, genTime (Unix): ${initialGenerationTimestampFromData} (${formatTime(initialGenerationTimestampFromData)})`); // Reduziertes Log

                const offset = calculateOffset(avgCreditsFromData, false);
                currentEndTimestamp = initialGenerationTimestampFromData + offset; // Korrekte Berechnung: Startzeit + Offset
                // console.log(`addEndTimeToMissionContent: Verbandseinsatz, Endzeit aus localStorage-Daten berechnet: ${formatTime(currentEndTimestamp)}`); // Reduziertes Log
                shouldDisplay = true;

            } else {
                // console.log(`addEndTimeToMissionContent: Verbandseinsatz ${missionId} nicht in localStorage gefunden. Keine Anzeige.`); // Reduziertes Log
                shouldDisplay = false; // Keine Anzeige, wenn nicht im Speicher
            }
        }

        if (shouldDisplay && currentEndTimestamp) {
            let endzeitAnzeige = missionContentContainer.querySelector('.endzeit-alarmfenster-anzeige');
            if (!endzeitAnzeige) {
                endzeitAnzeige = document.createElement('div');
                endzeitAnzeige.className = 'endzeit-alarmfenster-anzeige';
                Object.assign(endzeitAnzeige.style, {
                    marginTop: '10px', marginBottom: '10px', padding: '8px 12px',
                    backgroundColor: '#2c3e50', // Dezenterer dunkler Hintergrund
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: 'bold', // Fett bleibt für Lesbarkeit
                    fontSize: '1.1em',
                    textAlign: 'left', // Links-bündig
                    boxShadow: 'none', // Kein Schatten
                    border: 'none' // Kein Rand
                });
                // console.log("addEndTimeToMissionContent: Neues Endzeit-Anzeige-Element erstellt."); // Reduziertes Log

                insertionPoint.parentNode.insertBefore(endzeitAnzeige, insertionPoint);
                // console.log("addEndTimeToMissionContent: Endzeit-Anzeige erfolgreich vor #mission_replies eingefügt."); // Reduziertes Log

            }
            let displayText = `Voraussichtliches Einsatz-Ende: ${formatTime(currentEndTimestamp)}`;
            if (initialGenerationTimestampForDisplay) {
                displayText += ` (Eingang: ${formatTime(initialGenerationTimestampForDisplay)})`;
            }
            endzeitAnzeige.textContent = displayText;
            endzeitAnzeige.style.display = 'block';
            // console.log(`addEndTimeToMissionContent: Endzeit-Anzeige aktualisiert: ${endzeitAnzeige.textContent}`); // Reduziertes Log
        } else {
            let endzeitAnzeige = missionContentContainer.querySelector('.endzeit-alarmfenster-anzeige');
            if (endzeitAnzeige) {
                endzeitAnzeige.style.display = 'none';
                // console.log("addEndTimeToMissionContent: Endzeit-Anzeige ausgeblendet."); // Reduziertes Log
            }
        }
    }

    // --- INITIALISIERUNG ---

    // CSS für die Blink-Animation hinzufügen (bereits im Originalskript vorhanden)
    const style = document.createElement('style');
    style.textContent = `@keyframes blink { 0% { background-color: yellow; color: black; } 50% { background-color: red; color: white; } 100% { background-color: yellow; color: black; } } .blink-animation { animation: blink 1s linear 5; }`;
    document.head.appendChild(style);

    // Observer für die eigene Missionsliste (Seitenleiste), um 'panel-success' für die Speicherung der Endzeiten zu erkennen
    const missionListOwn = document.getElementById('mission_list');
    if (missionListOwn) {
        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const changedElement = mutation.target;
                    // Prüfen, ob sich ein Missionspanel in 'panel-success' geändert hat
                    if (changedElement.id && changedElement.id.startsWith('mission_panel_') &&
                        changedElement.classList.contains('panel-success') &&
                        (!mutation.oldValue || !mutation.oldValue.includes('panel-success'))) {
                        const missionDataNode = changedElement.parentNode;
                        if (missionDataNode && missionDataNode.classList.contains('missionSideBarEntry')) {
                            processAndStoreOwnMissionEndTime(missionDataNode, true);
                        }
                    }
                }
            }
        });
        observer.observe(missionListOwn, { attributes: true, attributeOldValue: true, subtree: true, attributeFilter: ['class'] });
    }

    // Observer für den Alarmfenster-Inhalt (zielt auf missionH1)
    const missionContentObserver = new MutationObserver((mutations, observer) => {
        clearTimeout(window._missionContentUpdateTimeout);
        window._missionContentUpdateTimeout = setTimeout(() => {
            addEndTimeToMissionContent();
            // NEU: Observer nach dem ersten erfolgreichen Aufruf trennen
            observer.disconnect();
            console.log("initMissionContentObserver: Observer für Alarmfenster getrennt (Endzeit einmalig angezeigt).");
        }, 100);
    });

    // Initialisierung des Alarmfenster-Observers (sucht nach missionH1 und hängt den Observer an)
    function initMissionContentObserver() {
        // Diese Funktion wird nur auf Missionsdetailseiten aufgerufen
        if (!window.location.pathname.startsWith('/missions/')) {
            // console.log("initMissionContentObserver: Nicht auf einer Missionsdetailseite, überspringe Initialisierung."); // Reduziertes Log
            return;
        }
        console.log("initMissionContentObserver: Start der Initialisierung für Alarmfenster-Beobachtung.");

        const findAndObserveMissionContent = (attempts = 0) => {
            const missionH1Element = document.getElementById('missionH1');
            const missionRepliesElement = document.getElementById('mission_replies');

            if (missionH1Element && missionRepliesElement) { // Beide Elemente müssen vorhanden sein
                console.log(`initMissionContentObserver: #missionH1 und #mission_replies gefunden nach ${attempts} Versuchen. Observer wird angehängt.`);
                // Beobachtet Änderungen im Alarmfenster, ausgehend vom Elternelement von mission_replies
                const targetElementForObserver = missionRepliesElement.parentNode;
                if (targetElementForObserver) {
                    // Hängen Sie den Observer an und lassen Sie ihn einmalig auslösen, dann wird er getrennt.
                    missionContentObserver.observe(targetElementForObserver, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-sortable-by', 'mission_id', 'class'] });
                    // Der erste Aufruf von addEndTimeToMissionContent() erfolgt durch den Observer selbst
                    // nach der setTimeout-Verzögerung, was das Entprellen sicherstellt.
                } else {
                    console.warn("initMissionContentObserver: Kein geeignetes Elternelement für #mission_replies gefunden, um den Observer anzuhängen.");
                }
            } else if (attempts < 30) { // Maximal 30 Versuche (ca. 6 Sekunden)
                // console.log(`initMissionContentObserver: #missionH1 oder #mission_replies noch nicht im DOM (Versuch ${attempts + 1}). Erneuter Versuch in 200ms.`); // Reduziertes Log
                setTimeout(() => findAndObserveMissionContent(attempts + 1), 200);
            } else {
                console.warn("initMissionContentObserver: #missionH1 oder #mission_replies nach mehreren Versuchen nicht gefunden. Beobachtung abgebrochen.");
            }
        };

        // Starten des Suchprozesses
        findAndObserveMissionContent();
    }


    // Erste Setup-Aufrufe, abhängig von der aktuellen Seite
    if (window.location.pathname === '/') {
        createDraggablePanel();
        setInterval(addEndTimes, 2000); // Endzeiten der Seitenleiste alle 2 Sekunden aktualisieren
        addEndTimes(); // Erster Aufruf für Seitenleiste
    } else if (window.location.pathname.startsWith('/missions/')) {
        initMissionContentObserver(); // Startet die Beobachtung des Alarmfensters
        // Das Panel wird auf Missionsseiten standardmäßig nicht angezeigt, da es für die Übersicht gedacht ist.
        // Wenn es auch hier angezeigt werden soll, müsste createDraggablePanel() hier auch aufgerufen werden.
    }
})();
