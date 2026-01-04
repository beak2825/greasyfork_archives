// ==UserScript==
// @name         LSS Lehrgangs-Link-Sammler (Robuster mit Observer)
// @namespace    http://tampermonkey.net/
// @version      1.41 // Version erhöht, um Icons mit kompletter Neuerstellung zu fixen
// @description  Sammelt Links zu Lehrgängen mit 10 freien Plätzen auf Leitstellenspiel.de und ruft deren Abbruch-URLs im Hintergrund auf, mit Fortschrittsanzeige und Einzel-Abbrechfunktion.
// @author       Dein Name
// @match        https://www.leitstellenspiel.de/buildings/*
// @match        https://leitstellenspiel.de/buildings/*
// @match        https://missionchief.com/buildings/*
// @match        https://www.missionchief.com/buildings/*
// @match        https://missionchief.co.uk/buildings/*
// @match        https://www.missionchief.co.uk/buildings/*
// @match        https://leitstellenspiel.com/buildings/*
// @match        https://www.leitstellenspiel.com/buildings/*
// @exclude      *://*/*missions*
// @exclude      *://*/*vehicles*
// @exclude      *://*/*patient*
// @exclude      *://*/*alliance*
// @exclude      *://*/*profile*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_info
// @grant        GM_addStyle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/541272/LSS%20Lehrgangs-Link-Sammler%20%28Robuster%20mit%20Observer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541272/LSS%20Lehrgangs-Link-Sammler%20%28Robuster%20mit%20Observer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Konfiguration ---
    const STORAGE_KEY_COLLECTED_LINKS = 'leitstellenspiel_collected_schooling_links';
    const TARGET_FREE_SLOTS = '10'; // Der Wert für 'freie Plätze', nach dem gesucht wird
    const UI_PANEL_ID = 'lss-schooling-crawler-control-panel'; // Eindeutige ID für das Panel
    const STORAGE_KEY_INITIATE_FULL_PROCESS = 'lss_initiate_full_schooling_process'; // Neuer Schlüssel für den Status

    // --- Globale Variablen ---
    let collectedLinks = [];
    let uiPanel = null; // Speichert eine Referenz auf das erstellte UI-Panel
    let progressBar = null; // Referenz auf den Fortschrittsbalken
    let progressText = null; // Referenz auf den Text im Fortschrittsbalken

    // --- Hilfsfunktionen zum Laden und Speichern der Links ---
    async function loadCollectedLinks() {
        const storedLinks = await GM_getValue(STORAGE_KEY_COLLECTED_LINKS, '[]');
        try {
            collectedLinks = JSON.parse(storedLinks);
            collectedLinks = Array.from(new Set(collectedLinks)); // Duplikate entfernen
        } catch (e) {
            collectedLinks = [];
        }
    }

    async function saveCollectedLinks() {
        await GM_setValue(STORAGE_KEY_COLLECTED_LINKS, JSON.stringify(Array.from(new Set(collectedLinks))));
    }

    /**
     * Setzt den Fortschrittsbalken zurück und zeigt ihn an.
     * @param {number} totalCalls Die Gesamtzahl der Anrufe.
     */
    function resetProgressBar(totalCalls) {
        if (!progressBar || !progressText) {
            return;
        }
        progressBar.style.width = '0%';
        progressBar.classList.remove('progress-bar-success', 'progress-bar-danger');
        progressBar.classList.add('active', 'progress-bar-striped'); // Animation starten
        progressText.textContent = `Vorbereitung... (0/${totalCalls})`;
        uiPanel.querySelector('.progress').style.display = 'block'; // Fortschrittsbalken anzeigen
    }

    /**
     * Aktualisiert den Fortschrittsbalken.
     * @param {number} currentCalls Die aktuelle Anzahl der abgeschlossenen Anrufe.
     * @param {number} totalCalls Die Gesamtzahl der Anrufe.
     */
    function updateProgressBar(currentCalls, totalCalls) {
        if (!progressBar || !progressText) return;

        const percentage = totalCalls > 0 ? (currentCalls / totalCalls) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `Fortschritt: ${currentCalls}/${totalCalls}`;

        if (currentCalls === totalCalls) {
            progressBar.classList.remove('active', 'progress-bar-striped'); // Animation stoppen
            if (progressBar.getAttribute('data-has-failed') === 'true') {
                 progressBar.classList.add('progress-bar-danger'); // Rot bei Fehlern
            } else {
                 progressBar.classList.add('progress-bar-success'); // Grün bei Erfolg
            }
        }
    }

    /**
     * Führt den Abbruch eines einzelnen Lehrgangs über GM_xmlhttpRequest aus.
     * @param {string} schoolingId Die ID des Lehrgangs.
     * @param {HTMLElement} rowElement Die Tabellenzeile, die aktualisiert werden soll.
     * @returns {Promise<boolean>} Resolves true on success, false on failure.
     */
    async function cancelSingleSchooling(schoolingId, rowElement) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.leitstellenspiel.de/schoolings/${schoolingId}/education/cancel`,
                onload: function(response) {
                    if (response.status === 200) {
                        if (rowElement) {
                            rowElement.style.backgroundColor = '#dff0d8'; // Hellgrün für Erfolg
                            const button = rowElement.querySelector('.lss-cancel-single-btn');
                            if (button) {
                                button.textContent = 'Abgebrochen!';
                                button.disabled = true;
                                button.classList.remove('btn-danger');
                                button.classList.add('btn-success');
                            }
                        }
                        GM_notification({
                            title: 'LSS Lehrgang abgebrochen',
                            text: `Lehrgang ${schoolingId} wurde erfolgreich abgebrochen.`,
                            timeout: 3000
                        });
                        resolve(true);
                    } else {
                        if (rowElement) {
                            rowElement.style.backgroundColor = '#f2dede'; // Hellrot für Fehler
                            const button = rowElement.querySelector('.lss-cancel-single-btn');
                            if (button) {
                                button.textContent = 'Fehler!';
                                button.disabled = true;
                            }
                        }
                        GM_notification({
                            title: 'LSS Abbruchfehler',
                            text: `Fehler beim Abbruch von Lehrgang ${schoolingId}. Status: ${response.status}`,
                            timeout: 5000
                        });
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    if (rowElement) {
                        rowElement.style.backgroundColor = '#f2dede'; // Hellrot für Fehler
                        const button = rowElement.querySelector('.lss-cancel-single-btn');
                        if (button) {
                            button.textContent = 'Netzwerkfehler!';
                            button.disabled = true;
                        }
                    }
                    GM_notification({
                        title: 'LSS Abbruchfehler',
                        text: `Netzwerkfehler beim Abbruch von Lehrgang ${schoolingId}.`,
                        timeout: 5000
                    });
                    resolve(false);
                }
            });
        });
    }

    /**
     * Fügt Einzel-Abbrechen- und bedingt "Direkt fertigstellen"-Buttons zu den Lehrgangszeilen hinzu.
     * Diese Funktion wird vom MutationObserver aufgerufen, sobald die Tabellen im DOM sind.
     */
    function addSingleCancelAndFinishButtons() {
        const schoolingTabContent = document.getElementById('tab_schooling');
        if (!schoolingTabContent || !schoolingTabContent.classList.contains('active')) {
            return;
        }

        const schoolingTables = schoolingTabContent.querySelectorAll('.building_schooling_table');
        if (schoolingTables.length === 0) {
            return;
        }

        schoolingTables.forEach(table => {
            // CSS für feste Tabellenbreite und Spaltenverteilung hinzufügen
            // Dies sollte nur einmal pro Tabelle passieren
            if (!table.classList.contains('lss-fixed-layout-applied')) {
                const tableStyle = `
                    .building_schooling_table {
                        table-layout: fixed !important;
                        width: 100% !important;
                    }
                    .building_schooling_table th,
                    .building_schooling_table td {
                        white-space: normal !important;
                        word-wrap: break-word !important;
                        vertical-align: middle !important;
                    }
                    .building_schooling_table th:nth-child(1),
                    .building_schooling_table td:nth-child(1) {
                        width: 28% !important;
                    }
                    .building_schooling_table th:nth-child(2),
                    .building_schooling_table td:nth-child(2) {
                        width: 10% !important;
                        text-align: center !important;
                    }
                    .building_schooling_table th:nth-child(3),
                    .building_schooling_table td:nth-child(3) {
                        width: 10% !important;
                        text-align: center !important;
                    }
                    .building_schooling_table th:nth-child(4),
                    .building_schooling_table td:nth-child(4) {
                        width: 22% !important;
                    }
                    .building_schooling_table th.lss-action-header,
                    .building_schooling_table td.lss-action-cell {
                        width: 30% !important;
                    }
                    .building_schooling_table td.lss-action-cell {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        height: 100% !important;
                    }
                    /* H3 Container als Flexbox, um Buttons nebeneinander zu halten */
                    h3 {
                        display: flex !important;
                        align-items: center !important;
                        flex-wrap: wrap !important;
                    }
                    /* Styling für den Wrapper der Header-Buttons */
                    .lss-header-buttons-wrapper {
                        display: inline-flex !important;
                        align-items: center !important;
                        flex-wrap: wrap !important;
                        margin-left: 10px !important;
                        float: none !important;
                        position: static !important;
                        left: auto !important;
                        right: auto !important;
                        margin-right: 0 !important;
                    }
                    /* Styling für die einzelnen Header-Buttons */
                    .lss-school-header-button {
                        margin-left: 10px !important;
                        vertical-align: middle !important;
                        white-space: nowrap !important;
                        float: none !important;
                        position: static !important;
                        left: auto !important;
                        right: auto !important;
                        margin-right: 0 !important;
                        order: unset !important;
                    }
                    /* Aggressive Neutralisierung von float-left/right auf allen Buttons und Links in Headern */
                    .panel-heading > .btn, .panel-heading > a.btn {
                        float: none !important;
                        position: static !important;
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        left: auto !important;
                        right: auto !important;
                        display: none !important;
                    }
                    /* Sicherstellen, dass img-Tags in h3 immer sichtbar und korrekt ausgerichtet sind */
                    h3 img {
                        display: inline-block !important;
                        vertical-align: middle !important;
                        margin-right: 5px !important; /* Kleiner Abstand zum Text */
                        width: auto !important; /* Originalbreite beibehalten */
                        height: auto !important; /* Originalhöhe beibehalten */
                        max-width: 25px !important; /* Beispiel max-Größe, falls zu groß */
                        max-height: 25px !important;
                    }
                `;
                GM_addStyle(tableStyle);
                table.classList.add('lss-fixed-layout-applied');
            }

            // 1. Prüfen und "Aktion"-Überschrift hinzufügen, falls noch nicht vorhanden
            let headerRow = table.querySelector('thead tr');
            if (headerRow && !headerRow.querySelector('.lss-action-header')) {
                let th = document.createElement('th');
                th.textContent = 'Aktion';
                th.classList.add('lss-action-header'); // Klasse zur Identifizierung
                headerRow.appendChild(th);
            }

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                // Prüfen, ob die Aktionszelle und die Buttons nicht bereits hinzugefügt wurden
                if (row.querySelector('.lss-action-cell')) {
                    return; // Überspringen, wenn bereits verarbeitet
                }

                const cells = row.querySelectorAll('td');
                // Stellen Sie sicher, dass genügend Zellen vorhanden sind, bevor Sie zugreifen
                if (cells.length < 4) {
                    return;
                }

                const freeSlotsCell = cells[2];
                const linkCell = cells[0];
                const originalDurationCell = cells[3];

                let originalFinishButton = null;
                if (originalDurationCell) {
                    originalFinishButton = originalDurationCell.querySelector('a.btn-success[href*="/education/finish"]');
                    if (originalFinishButton) {
                        originalFinishButton.remove();
                    }
                }

                const actionCell = document.createElement('td');
                actionCell.classList.add('lss-action-cell');

                if (freeSlotsCell && freeSlotsCell.getAttribute('sortvalue') === TARGET_FREE_SLOTS) {
                    const linkElement = linkCell.querySelector('a');
                    if (linkElement && linkElement.href) {
                        const fullUrl = new URL(linkElement.href, window.location.href).href;
                        const match = fullUrl.match(/\/schoolings\/(\d+)/);
                        if (match && match[1]) {
                            const schoolingId = match[1];

                            const cancelButton = document.createElement('button');
                            cancelButton.textContent = 'Abbrechen';
                            cancelButton.classList.add('btn', 'btn-xs', 'btn-danger', 'lss-cancel-single-btn');
                            cancelButton.style.width = '100%';
                            cancelButton.style.marginBottom = '3px';

                            cancelButton.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                cancelButton.disabled = true;
                                cancelButton.textContent = 'Wird abgebrochen...';

                                await cancelSingleSchooling(schoolingId, row);
                                setTimeout(() => {
                                    const baseUrl = window.location.origin + window.location.pathname;
                                    const targetUrl = baseUrl + '#tab_schooling';
                                    if (window.location.href === targetUrl) {
                                        window.location.reload();
                                    } else {
                                        window.location.href = targetUrl;
                                    }
                                }, 1000);
                            });
                            actionCell.appendChild(cancelButton);
                        }
                    }
                }

                if (originalFinishButton && freeSlotsCell && freeSlotsCell.getAttribute('sortvalue') !== TARGET_FREE_SLOTS) {
                    const finishLink = originalFinishButton.href;
                    const finishButton = document.createElement('button');
                    finishButton.textContent = 'Direkt fertigstellen';
                    finishButton.classList.add('btn', 'btn-xs', 'btn-success', 'lss-finish-single-btn');
                    finishButton.style.width = '100%';

                    finishButton.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (confirm('Möchtest Du diesen Lehrgang wirklich sofort mit Coins fertigstellen?')) {
                            finishButton.disabled = true;
                            finishButton.textContent = 'Wird fertiggestellt...';
                            window.location.href = finishLink;
                        }
                    });
                    actionCell.appendChild(finishButton);
                }

                row.appendChild(actionCell);
            });
        });
    }

    /**
     * Sammelt Links von der aktuellen Seite basierend auf den Kriterien.
     * @param {HTMLElement} [specificTableElement] Optional: Die spezifische HTML-Tabelle, aus der Links gesammelt werden sollen.
     */
    async function collectLinksOnly(specificTableElement = null) {
        const currentLinks = [];
        let targetTables = [];

        if (specificTableElement) {
            targetTables.push(specificTableElement);
        } else {
            const schoolingTabContent = document.getElementById('tab_schooling');
            if (!schoolingTabContent || !schoolingTabContent.classList.contains('active')) {
                return [];
            }
            targetTables = schoolingTabContent.querySelectorAll('.building_schooling_table');
        }

        if (targetTables.length === 0) {
            return [];
        }

        targetTables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const freeSlotsCell = cells[2];
                    const linkCell = cells[0];

                    if (freeSlotsCell.getAttribute('sortvalue') === TARGET_FREE_SLOTS) {
                        const linkElement = linkCell.querySelector('a');
                        if (linkElement && linkElement.href) {
                            const fullUrl = new URL(linkElement.href, window.location.href).href;
                            if (!currentLinks.includes(fullUrl)) {
                                currentLinks.push(fullUrl);
                            }
                        }
                    }
                }
            });
        });
        return currentLinks;
    }


    /**
     * Ruft alle gesammelten Links mit /education/cancel über GM_xmlhttpRequest auf.
     * @param {string[]} [linksToProcess] Optional: Eine spezifische Liste von Links zum Abbrechen.
     */
    async function callCancelSchoolingLinks(linksToProcess = collectedLinks) {
        const links = linksToProcess.length > 0 ? linksToProcess : collectedLinks;

        if (links.length === 0) {
            GM_notification({
                title: 'LSS Lehrgangs-Sammler',
                text: 'Keine Links zum Aufrufen vorhanden.',
                timeout: 3000,
                image: 'https://leitstellenspiel.de/images/building_fireschool.png'
            });
            return;
        }

        if (!confirm(`Möchtest du wirklich ${links.length} Lehrgangs-Links im Hintergrund aufrufen, um sie abzubrechen? Dies kann viele Anfragen verursachen.\n\nEs gibt jetzt auch Einzel-Abbrechen-Buttons direkt in den Lehrgangszeilen, wenn der Tab geladen ist!`)) {
            await GM_setValue(STORAGE_KEY_INITIATE_FULL_PROCESS, false);
            return;
        }

        let callsCompleted = 0;
        let callsFailed = 0;
        const totalCalls = links.length;

        if (!progressBar || !progressText) {
             createUIPanel();
        }
        resetProgressBar(totalCalls);
        progressBar.setAttribute('data-has-failed', 'false');

        const rowsToUpdate = new Map();
        const schoolingTabContent = document.getElementById('tab_schooling');
        if (schoolingTabContent) {
            schoolingTabContent.querySelectorAll('.building_schooling_table tbody tr').forEach(row => {
                const linkCell = row.cells[0];
                if (linkCell) {
                    const linkElement = linkCell.querySelector('a');
                    if (linkElement && linkElement.href) {
                        const fullUrl = new URL(linkElement.href, window.location.href).href;
                        rowsToUpdate.set(fullUrl, row);
                    }
                }
            });
        }


        for (const originalLink of links) {
            const match = originalLink.match(/\/schoolings\/(\d+)/);
            if (match && match[1]) {
                const schoolingId = match[1];
                const cancelUrl = `https://www.leitstellenspiel.de/schoolings/${schoolingId}/education/cancel`;
                const rowElement = rowsToUpdate.get(originalLink);

                if (rowElement && rowElement.querySelector('.lss-cancel-single-btn')?.disabled) {
                    callsCompleted++;
                    updateProgressBar(callsCompleted + callsFailed, totalCalls);
                    await new Promise(resolve => setTimeout(resolve, 10));
                    continue;
                }

                await new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: cancelUrl,
                        onload: function(response) {
                            if (response.status === 200) {
                                callsCompleted++;
                                if (rowElement) {
                                    rowElement.style.backgroundColor = '#dff0d8';
                                    const button = rowElement.querySelector('.lss-cancel-single-btn');
                                    if (button) {
                                        button.textContent = 'Abgebrochen!';
                                        button.disabled = true;
                                        button.classList.remove('btn-danger');
                                        button.classList.add('btn-success');
                                    }
                                }
                            } else {
                                callsFailed++;
                                progressBar.setAttribute('data-has-failed', 'true');
                                if (rowElement) {
                                    rowElement.style.backgroundColor = '#f2dede';
                                    const button = rowElement.querySelector('.lss-cancel-single-btn');
                                    if (button) {
                                        button.textContent = 'Fehler!';
                                        button.disabled = true;
                                    }
                                }
                            }
                            updateProgressBar(callsCompleted + callsFailed, totalCalls);
                            resolve();
                        },
                        onerror: function(error) {
                            callsFailed++;
                            progressBar.setAttribute('data-has-failed', 'true');
                            if (rowElement) {
                                rowElement.style.backgroundColor = '#f2dede';
                                const button = rowElement.querySelector('.lss-cancel-single-btn');
                                if (button) {
                                    button.textContent = 'Netzwerkfehler!';
                                    button.disabled = true;
                                }
                            }
                            updateProgressBar(callsCompleted + callsFailed, totalCalls);
                            resolve();
                        }
                    });
                });

                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                callsFailed++;
                progressBar.setAttribute('data-has-failed', 'true');
                updateProgressBar(callsCompleted + callsFailed, totalCalls);
            }
        }

        GM_notification({
            title: 'LSS Lehrgangs-Sammler',
            text: `Hintergrundaufrufe abgeschlossen. Erfolgreich: ${callsCompleted}, Fehlgeschlagen: ${callsFailed}.`,
            timeout: 7000,
            image: 'https://leitstellenspiel.de/images/building_fireschool.png'
        });

        await GM_setValue(STORAGE_KEY_INITIATE_FULL_PROCESS, false);

        setTimeout(() => {
            if (uiPanel && uiPanel.querySelector('.progress')) {
                uiPanel.querySelector('.progress').style.display = 'none';
            }
            const baseUrl = window.location.origin + window.location.pathname;
            const targetUrl = baseUrl + '#tab_schooling';
            if (window.location.href === targetUrl) {
                window.location.reload();
            } else {
                window.location.href = targetUrl;
            }
        }, 5000);
    }

    /**
     * Startet den gesamten Prozess (Reload -> Sammeln -> Abbrechen)
     */
    async function initiateFullSchoolingProcess() {
        await GM_setValue(STORAGE_KEY_INITIATE_FULL_PROCESS, true);
        GM_notification({
            title: 'LSS Lehrgangs-Sammler',
            text: 'Starte Neu-Laden der Seite und anschließenden globalen Abbruch...',
            timeout: 4000,
            image: 'https://leitstellenspiel.de/images/building_fireschool.png'
        });
        const baseUrl = window.location.origin + window.location.pathname;
        const targetUrl = baseUrl + '#tab_schooling';
        window.location.href = targetUrl;
    }


    /**
     * Erstellt das UI-Panel einmalig.
     */
    function createUIPanel() {
        if (uiPanel) return;

        uiPanel = document.createElement('div');
        uiPanel.id = UI_PANEL_ID;
        uiPanel.style.marginTop = '10px';
        uiPanel.style.marginBottom = '20px';
        uiPanel.style.padding = '15px';
        uiPanel.style.border = '1px solid #ccc';
        uiPanel.style.borderRadius = '5px';
        uiPanel.style.backgroundColor = '#f9f9f9';
        uiPanel.innerHTML = `
            <button id="collectAndCancelBtn" class="btn btn-warning" style="width: 100%; padding: 10px; font-size: 1.1em; margin-bottom: 10px;">Alle offenen Lehrgänge abbrechen</button>
            <div class="progress" style="height: 25px; margin-bottom: 10px; display: none;">
                <div id="lssProgressBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                    <span id="lssProgressText">Vorbereitung...</span>
                </div>
            </div>

        `;

        progressBar = uiPanel.querySelector('#lssProgressBar');
        progressText = uiPanel.querySelector('#lssProgressText');
        uiPanel.querySelector('#collectAndCancelBtn').addEventListener('click', initiateFullSchoolingProcess);
    }

    /**
     * Platziert das UI-Panel.
     */
    function placeUIPanel() {
        const tabsUl = document.getElementById('tabs');
        const tabContentArea = document.querySelector('.tab-content');

        if (tabsUl && tabContentArea) {
            if (!uiPanel) {
                createUIPanel();
            }

            if (tabsUl.nextElementSibling !== uiPanel) {
                tabsUl.parentNode.insertBefore(uiPanel, tabsUl.nextElementSibling);
            }

            const schoolingTab = document.getElementById('tab_schooling');
            if (schoolingTab && schoolingTab.classList.contains('active')) {
                 uiPanel.style.display = 'block';
            } else {
                 uiPanel.style.display = 'none';
                 if (uiPanel.querySelector('.progress')) {
                     uiPanel.querySelector('.progress').style.display = 'none';
                 }
            }
        }
    }

    /**
     * Findet und manipuliert die Header-Buttons ("Neuen Lehrgang starten", "Alle Lehrgänge abbrechen").
     */
    async function addSchoolHeaderButtons() {
        setTimeout(async () => {
            const schoolHeadings = document.querySelectorAll('h3');
            for (const heading of schoolHeadings) {
                if (heading.dataset.lssProcessedHeader) {
                    continue;
                }
                heading.dataset.lssProcessedHeader = 'true';

                const schoolNameLink = heading.querySelector('a[href^="/buildings/"]');
                if (!schoolNameLink) {
                    continue;
                }

                // --- Originalen "Neuen Lehrgang starten"-Button finden und REMOVEN ---
                const schoolId = schoolNameLink.href.match(/\/buildings\/(\d+)/)[1];
                let newStartButtonHref = null;

                const allCandidateButtons = document.querySelectorAll(`.btn[href*="/buildings/${schoolId}"]`);
                for (const btn of allCandidateButtons) {
                    if ((btn.textContent.includes('Neuen Lehrgang starten') || btn.textContent.includes('Start new schooling')) &&
                        !btn.classList.contains('lss-school-header-button')) {
                        newStartButtonHref = btn.href;
                        btn.remove();
                        break;
                    }
                }

                let newStartButton = null;
                if (newStartButtonHref) {
                    newStartButton = document.createElement('a');
                    newStartButton.href = newStartButtonHref;
                    newStartButton.textContent = 'Neuen Lehrgang starten';
                    newStartButton.classList.add('btn', 'btn-sm', 'btn-success', 'lss-school-header-button');
                }


                // --- "Alle Lehrgänge abbrechen"-Button bedingt hinzufügen ---
                let cancelAllSchoolingsButton = null;

                let schoolTable = null;
                let isSchoolEmptyMessagePresent = false;

                let nextElement = heading.nextElementSibling;
                while(nextElement) {
                    if (nextElement.classList.contains('alert') && (nextElement.textContent.includes('Derzeit ist kein Lehrgang offen.') || nextElement.textContent.includes('No schoolings currently running'))) {
                        isSchoolEmptyMessagePresent = true;
                    }
                    if (nextElement.matches('table.building_schooling_table')) {
                        schoolTable = nextElement;
                        break;
                    }
                    if (nextElement.querySelector('table.building_schooling_table')) {
                        schoolTable = nextElement.querySelector('table.building_schooling_table');
                        break;
                    }
                    nextElement = nextElement.nextElementSibling;
                }

                let abbrechbareLehrgaengeExist = false;
                if (schoolTable) {
                    const linksForThisSchool = await collectLinksOnly(schoolTable);
                    abbrechbareLehrgaengeExist = linksForThisSchool.length > 0;
                }

                if (abbrechbareLehrgaengeExist && !isSchoolEmptyMessagePresent) {
                    cancelAllSchoolingsButton = document.createElement('button');
                    cancelAllSchoolingsButton.textContent = 'offene Lehrgänge abbrechen';
                    cancelAllSchoolingsButton.classList.add('btn', 'btn-sm', 'btn-danger', 'lss-school-header-button');

                    cancelAllSchoolingsButton.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        const currentLinksForThisSchool = await collectLinksOnly(schoolTable);

                        if (currentLinksForThisSchool.length === 0) {
                            GM_notification({
                                title: 'LSS Lehrgangs-Sammler',
                                text: `Keine Lehrgänge mit ${TARGET_FREE_SLOTS} freien Plätzen in dieser Schule zum Abbrechen gefunden.`,
                                timeout: 5000
                            });
                            return;
                        }

                        if (!confirm(`Möchtest du wirklich ${currentLinksForThisSchool.length} Lehrgänge in dieser Schule (ID: ${schoolId}) im Hintergrund abbrechen?`)) {
                            return;
                        }

                        cancelAllSchoolingsButton.disabled = true;
                        cancelAllSchoolingsButton.textContent = 'Abbrechen läuft...';

                        await callCancelSchoolingLinks(currentLinksForThisSchool);
                    });
                }


                // --- H3-Inhalt neu aufbauen ---
                // Den gesamten Inhalt des h3 leeren
                heading.innerHTML = '';

                // Original-Img-Element finden (breitere Suche, da es nicht immer direkt vor dem Link ist)
                let originalImgElement = heading.querySelector('img'); // Versucht, es direkt im h3 zu finden
                if (!originalImgElement) { // Falls nicht im h3, suche im Elternelement
                    const parentOfHeading = heading.parentElement;
                    if (parentOfHeading) {
                        originalImgElement = parentOfHeading.querySelector('img[alt*="Building"]'); // Suchen nach einem img mit Building-Alt-Text
                    }
                }

                // Füge Bild hinzu, wenn gefunden
                if (originalImgElement) {
                    heading.appendChild(originalImgElement.cloneNode(true)); // Klonen und anhängen
                }
                heading.appendChild(schoolNameLink.cloneNode(true)); // Schulnamen-Link klonen und anhängen

                // Erstelle einen Wrapper für unsere Buttons
                const buttonsWrapper = document.createElement('span');
                buttonsWrapper.classList.add('lss-header-buttons-wrapper');
                heading.appendChild(buttonsWrapper);

                // Füge die Buttons in der gewünschten Reihenfolge in den Wrapper ein
                if (newStartButton) {
                    buttonsWrapper.appendChild(newStartButton);
                }
                if (cancelAllSchoolingsButton) {
                    buttonsWrapper.appendChild(cancelAllSchoolingsButton);
                }
            }
        }, 500); // 500ms Verzögerung
    }


    // --- Skript-Start und Beobachtung des Tab-Wechsels / Inhaltsänderung ---
    if (window.top === window.self && window.location.pathname.startsWith('/buildings/')) {
        window.addEventListener('load', async function() {
            createUIPanel();

            const tabContentContainer = document.querySelector('.tab-content');
            const navTabsList = document.getElementById('tabs');

            if (tabContentContainer && navTabsList) {
                const mainObserver = new MutationObserver(async (mutationsList, observer) => {
                    let schoolingTabActive = false;
                    let schoolingTableReady = false;

                    const schoolingTabContent = document.getElementById('tab_schooling');
                    if (schoolingTabContent && schoolingTabContent.classList.contains('active')) {
                        schoolingTabActive = true;
                        if (schoolingTabContent.querySelector('table.building_schooling_table')) {
                            schoolingTableReady = true;
                        }
                    }

                    if (schoolingTabActive) {
                        placeUIPanel();
                    } else {
                        if (uiPanel) {
                            uiPanel.style.display = 'none';
                            if (uiPanel.querySelector('.progress')) {
                                uiPanel.querySelector('.progress').style.display = 'none';
                            }
                        }
                    }

                    await addSchoolHeaderButtons();

                    if (schoolingTableReady) {
                        setTimeout(addSingleCancelAndFinishButtons, 200);

                        const shouldInitiateFullProcess = await GM_getValue(STORAGE_KEY_INITIATE_FULL_PROCESS, false);
                        if (shouldInitiateFullProcess) {
                            await GM_setValue(STORAGE_KEY_INITIATE_FULL_PROCESS, false);

                            collectedLinks = await collectLinksOnly();
                            if (collectedLinks.length > 0) {
                                await callCancelSchoolingLinks();
                            } else {
                                GM_notification({
                                    title: 'LSS Lehrgangs-Sammler',
                                    text: 'Keine Links zum Abbrechen gefunden nach Reload.',
                                    timeout: 3000,
                                    image: 'https://leitstellenspiel.de/images/building_fireschool.png'
                                });
                                if (uiPanel && uiPanel.querySelector('.progress')) {
                                    uiPanel.querySelector('.progress').style.display = 'none';
                                }
                            }
                        }
                    }
                });

                mainObserver.observe(tabContentContainer, { attributes: true, childList: true, subtree: true });

                // Initialer Check beim Laden der Seite
                placeUIPanel();
                await addSchoolHeaderButtons();
                const initialSchoolingTab = document.getElementById('tab_schooling');
                if (initialSchoolingTab && initialSchoolingTab.classList.contains('active') && initialSchoolingTab.querySelector('table.building_schooling_table')) {
                    setTimeout(addSingleCancelAndFinishButtons, 200);

                    const shouldInitiateFullProcess = await GM_getValue(STORAGE_KEY_INITIATE_FULL_PROCESS, false);
                    if (shouldInitiateFullProcess) {
                        await GM_setValue(STORAGE_KEY_INITIATE_FULL_PROCESS, false);

                        collectedLinks = await collectLinksOnly();
                        if (collectedLinks.length > 0) {
                            await callCancelSchoolingLinks();
                        } else {
                            GM_notification({
                                title: 'LSS Lehrgangs-Sammler',
                                text: 'Keine Links zum Abbrechen gefunden beim initialen Start.',
                                timeout: 3000,
                                image: 'https://leitstellenspiel.de/images/building_fireschool.png'
                            });
                             if (uiPanel && uiPanel.querySelector('.progress')) {
                                uiPanel.querySelector('.progress').style.display = 'none';
                            }
                        }
                    }
                }


                navTabsList.querySelectorAll('a[data-toggle="tab"]').forEach(tabLink => {
                    tabLink.addEventListener('click', async (e) => {
                        const targetId = e.target.getAttribute('aria-controls');
                        if (targetId === 'tab_schooling') {
                            placeUIPanel();
                        } else {
                            if (uiPanel) {
                                uiPanel.style.display = 'none';
                                if (uiPanel.querySelector('.progress')) {
                                    uiPanel.querySelector('.progress').style.display = 'none';
                                }
                            }
                        }
                    });
                });

            } else {
            }
        });
    }
})();