// ==UserScript==
// @name         [LSS] Prüfe auf Verbandsmitgliedschaft (Hintergrund, konsolidiert & streng gefiltert)
// @namespace    http://tampermonkey.net/
// @version      0.91
// @description  Fügt Buttons, Fortschrittsbalken und Ergebnis-Popup hinzu. Nur Allianz 24 ist "ok", alle anderen Fälle sind "auffällig". Das Skript kann gestoppt werden. Ergebnisse bleiben persistent bis zum neuen Scan.
// @author       Masklin
// @license      MIT
// @match        https://www.leitstellenspiel.de/alliance_threads/*
// @grant        GM_xmlhttpRequest
// @connect      leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/539336/%5BLSS%5D%20Pr%C3%BCfe%20auf%20Verbandsmitgliedschaft%20%28Hintergrund%2C%20konsolidiert%20%20streng%20gefiltert%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539336/%5BLSS%5D%20Pr%C3%BCfe%20auf%20Verbandsmitgliedschaft%20%28Hintergrund%2C%20konsolidiert%20%20streng%20gefiltert%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Konstanten für localStorage-Schlüssel
    // Wichtiger Hinweis: Die Schlüssel wurden erneut geändert, um sicherzustellen,
    // dass keine alten, korrupten Daten aus früheren Skriptversionen geladen werden.
    const LS_KEY_PREFIX = 'lss_alliance_checker_profil_pruefung_fix_';
    const LS_KEY_FORUM_PARSING_ACTIVE = LS_KEY_PREFIX + 'forum_parsing_active';
    const LS_KEY_PROFILE_CHECKING_ACTIVE = LS_KEY_PREFIX + 'profile_checking_active';
    const LS_KEY_COLLECTED_FORUM_LINKS = LS_KEY_PREFIX + 'collected_forum_links';
    const LS_KEY_PROFILE_CHECK_RESULTS = LS_KEY_PREFIX + 'profile_check_results';
    const LS_KEY_PROFILE_CHECK_QUEUE = LS_KEY_PREFIX + 'profile_check_queue';
    const LS_KEY_CURRENT_FORUM_PAGE = LS_KEY_PREFIX + 'current_forum_page';
    const LS_KEY_CURRENT_PROFILE_INDEX = LS_KEY_PREFIX + 'current_profile_index';
    const LS_KEY_STOP_REQUESTED = LS_KEY_PREFIX + 'stop_requested';
    const LS_KEY_TOTAL_FORUM_PAGES = LS_KEY_PREFIX + 'total_forum_pages';
    const LS_KEY_IS_CURRENT_PAGE_ONLY_SCAN_TEMP = LS_KEY_PREFIX + 'is_current_page_only_temp'; // Temporärer Schlüssel für den aktuellen Scan

    const THREAD_ID_REGEX = /\/alliance_threads\/(\d+)/;

    // ----- KONFIGURATION DER VERBÄNDE -----
    const OK_ALLIANCE_ID = '24';
    const OK_ALLIANCE_LINK_PART = `/alliances/${OK_ALLIANCE_ID}`;
    const OK_ALLIANCE_NAME = 'FLORIAN HAMBURG';

    // ------------------------------------

    const REQUEST_DELAY = 100; // 100 Millisekunden

    // Globale Variable für die Thread ID, einmalig beim Start erfasst
    let currentThreadId = null;
    // Globale Variable für die geschätzte Gesamtanzahl der Forenseiten
    let estimatedTotalForumPages = 1;

    // Referenzen zu den DOM-Elementen
    let processButton = null;
    let stopButton = null;
    let currentPageOnlyCheckbox = null;
    let statusDiv = null; // Separate Statuszeile
    let progressBar = null; // Separate Fortschrittsleiste

    let resultModal = null;
    let resultModalContent = null;
    let resultModalCloseButton = null;

    // --- Aggressive Initialbereinigung des localStorage beim Skriptladen ---
    // Dies ist der entscheidende Teil, um sicherzustellen, dass das Skript
    // NICHT automatisch startet und die Buttons korrekt angezeigt werden.
    // Alle "aktiven" Flags und Stop-Anfragen werden beim Laden entfernt.
    console.log('[LSS] Skriptstart: Aggressives Zurücksetzen relevanter localStorage-Flags.');
    localStorage.removeItem(LS_KEY_FORUM_PARSING_ACTIVE);
    localStorage.removeItem(LS_KEY_PROFILE_CHECKING_ACTIVE);
    localStorage.removeItem(LS_KEY_STOP_REQUESTED);
    // Temporäre Daten für einen potenziell abgestürzten Scan werden auch entfernt
    localStorage.removeItem(LS_KEY_COLLECTED_FORUM_LINKS);
    localStorage.removeItem(LS_KEY_PROFILE_CHECK_QUEUE);
    localStorage.removeItem(LS_KEY_CURRENT_FORUM_PAGE);
    localStorage.removeItem(LS_KEY_CURRENT_PROFILE_INDEX);
    localStorage.removeItem(LS_KEY_TOTAL_FORUM_PAGES);
    localStorage.removeItem(LS_KEY_IS_CURRENT_PAGE_ONLY_SCAN_TEMP); // Auch dieses Flag bereinigen

    // currentThreadId wird frühzeitig gesetzt, da es für persistente Ergebnisse und Links benötigt wird
    currentThreadId = getThreadIdFromUrl();

    /**
     * Führt eine initiale Überprüfung auf gespeicherte Ergebnisse durch.
     * Aktivitäts-Flags werden hier nicht mehr manipuliert, da dies global geschieht.
     */
    function initialCheckForPersistentResults() {
        // console.log('[LSS] initialCheckForPersistentResults: Prüfe auf vorhandene Scan-Ergebnisse.');
        const storedResults = localStorage.getItem(LS_KEY_PROFILE_CHECK_RESULTS);

        if (storedResults && Object.keys(JSON.parse(storedResults)).length > 0) {
            console.log('[LSS] initialCheckForPersistentResults: Vorherige Scan-Ergebnisse im localStorage gefunden.');
            // Anzeige der Ergebnisse erfolgt in updateButtonStates nach UI-Erstellung
        } else {
            // console.log('[LSS] initialCheckForPersistentResults: Keine persistenten Ergebnisse gefunden.');
            // LS_KEY_PROFILE_CHECK_RESULTS bleibt hier intakt, wenn es leer ist.
        }
    }


    /**
     * Fügt die Start/Fortschritts- und Stop-Buttons sowie das Ergebnis-Modal zur Seite hinzu.
     * Diese Funktion sollte nur einmal aufgerufen werden, wenn das DOM bereit ist.
     */
    function addUIElements() {
        const paginationUl = document.querySelector('ul.pagination.pagination');
        if (paginationUl) {
            // Container für Buttons und Checkbox
            const uiContainer = document.createElement('div');
            uiContainer.style.marginTop = '10px';
            uiContainer.style.marginBottom = '10px';
            uiContainer.style.display = 'flex';
            uiContainer.style.flexDirection = 'column'; // Buttons und Checkbox untereinander
            uiContainer.style.gap = '10px'; // Abstand zwischen Elementen

            // Button-Gruppe
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group'; // LSS-Stil
            buttonGroup.style.display = 'flex';
            buttonGroup.style.justifyContent = 'center'; // Zentriert die Buttons
            buttonGroup.style.gap = '5px'; // Abstand zwischen den Buttons

            // Hauptbutton (Start)
            processButton = document.createElement('a');
            processButton.href = '#';
            processButton.id = 'lss-profile-parser-process-button';
            processButton.classList.add('btn', 'btn-info', 'btn-sm');
            processButton.style.minWidth = '250px';    // Mindestbreite
            processButton.textContent = 'Mitgliedschaften Prüfen'; // Initialer Text
            processButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Startet nur, wenn der Button nicht deaktiviert ist
                if (!processButton.disabled) {
                    startOverallProcess();
                }
            });
            buttonGroup.appendChild(processButton);

            // Stop-Button
            stopButton = document.createElement('a');
            stopButton.href = '#';
            stopButton.textContent = 'Stoppen';
            stopButton.id = 'lss-profile-parser-stop-button';
            stopButton.classList.add('btn', 'btn-danger', 'btn-sm');
            stopButton.style.minWidth = '100px';
            stopButton.style.display = 'none'; // Standardmäßig ausgeblendet
            stopButton.addEventListener('click', (e) => {
                e.preventDefault();
                stopParsing();
            });
            buttonGroup.appendChild(stopButton);

            uiContainer.appendChild(buttonGroup); // Button-Gruppe zum Container hinzufügen

            // Checkbox für "Nur aktuelle Seite prüfen"
            const checkboxDiv = document.createElement('div');
            checkboxDiv.style.textAlign = 'center';
            checkboxDiv.style.marginTop = '5px';

            currentPageOnlyCheckbox = document.createElement('input');
            currentPageOnlyCheckbox.type = 'checkbox';
            currentPageOnlyCheckbox.id = 'lss-check-current-page-only';
            currentPageOnlyCheckbox.style.marginRight = '5px';

            const checkboxLabel = document.createElement('label');
            checkboxLabel.htmlFor = 'lss-check-current-page-only';
            checkboxLabel.textContent = 'Nur aktuelle Seite prüfen';
            checkboxLabel.style.cursor = 'pointer'; // Zeigt an, dass es klickbar ist

            checkboxDiv.appendChild(currentPageOnlyCheckbox);
            checkboxDiv.appendChild(checkboxLabel);
            uiContainer.appendChild(checkboxDiv); // Checkbox-Div zum Container hinzufügen
            
            // Statuszeile
            statusDiv = document.createElement('div');
            statusDiv.id = 'lss-status-display';
            statusDiv.style.marginTop = '10px';
            statusDiv.style.padding = '8px';
            statusDiv.style.border = '1px solid #ddd';
            statusDiv.style.borderRadius = '4px';
            statusDiv.style.backgroundColor = '#f9f9f9';
            statusDiv.style.textAlign = 'center';
            statusDiv.textContent = 'Bereit für die Prüfung.'; // Initialer Status
            uiContainer.appendChild(statusDiv);

            // Fortschrittsbalken (separat)
            progressBar = document.createElement('div');
            progressBar.id = 'lss-progress-bar';
            progressBar.style.cssText = `
                width: 0%;
                height: 20px;
                background-color: #4CAF50;
                text-align: center;
                line-height: 20px;
                color: white;
                border-radius: 4px;
                margin-top: 5px;
                transition: width 0.5s ease-in-out;
                opacity: 0; /* Standardmäßig unsichtbar */
            `;
            statusDiv.appendChild(progressBar); // Fortschrittsbalken ist Teil der Statuszeile


            // Fügt den gesamten UI-Container nach dem Paginierungs-UL ein
            paginationUl.parentNode.insertBefore(uiContainer, paginationUl.nextSibling);

            // Ergebnis-Modal (HTML-Struktur und Styling)
            resultModal = document.createElement('div');
            resultModal.id = 'lss-result-modal';
            resultModal.style.cssText = `
                display: none; /* Versteckt das Modal standardmäßig */
                position: fixed;
                z-index: 1000; /* Über allem anderen */
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4); /* Schwarzer, semi-transparenter Hintergrund */
                padding-top: 60px;
            `;

            resultModalContent = document.createElement('div');
            resultModalContent.style.cssText = `
                background-color: #fefefe;
                margin: 5% auto; /* 5% von oben und unten, zentriert horizontal */
                padding: 20px;
                border: 1px solid #888;
                width: 90%; /* Responsive Breite */
                max-width: 600px; /* Maximale Breite für größere Bildschirme */
                border-radius: 8px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
                position: relative;
            `;

            resultModalCloseButton = document.createElement('span');
            resultModalCloseButton.innerHTML = '&times;'; // "X" Symbol
            resultModalCloseButton.style.cssText = `
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            `;
            resultModalCloseButton.addEventListener('click', () => { resultModal.style.display = 'none'; });

            // Schliessen durch Klick ausserhalb des Modals
            resultModal.addEventListener('click', (event) => {
                if (event.target === resultModal) {
                    resultModal.style.display = 'none';
                }
            });

            const modalTitle = document.createElement('h3');
            modalTitle.textContent = 'Ergebnisse der Verbandsprüfung';
            modalTitle.style.marginBottom = '15px';
            modalTitle.style.borderBottom = '1px solid #eee';
            modalTitle.style.paddingBottom = '10px';


            const modalBody = document.createElement('div');
            modalBody.id = 'lss-modal-body';
            modalBody.style.maxHeight = '400px'; // Scrollbar, wenn Inhalt zu lang
            modalBody.style.overflowY = 'auto';


            resultModalContent.appendChild(resultModalCloseButton);
            resultModalContent.appendChild(modalTitle);
            modalBody.innerHTML = '<p>Lade Ergebnisse...</p>'; // Placeholder
            resultModalContent.appendChild(modalBody); 
            resultModal.appendChild(resultModalContent);
            document.body.appendChild(resultModal);


            console.log('[LSS] addUIElements: UI-Elemente erfolgreich dem DOM hinzugefügt.');
            // Initialen Zustand der Buttons und Statuszeile aktualisieren, nachdem sie definitiv im DOM sind.
            setTimeout(updateButtonStates, 50); 
        } else {
            console.warn('[LSS] addUIElements: Das Paginierungs-UL-Element wurde nicht gefunden. UI-Elemente können nicht platziert werden.');
        }
    }

    /**
     * Aktualisiert den Zustand (aktiv/deaktiviert, Text) der Buttons und des Fortschrittsbalkens
     * basierend auf den localStorage-Flags. Diese Funktion sollte nur aufgerufen werden,
     * wenn die UI-Elemente bereits im DOM sind.
     */
    function updateButtonStates() {
        // Diese Flags sollten durch die aggressive Initialbereinigung beim Skriptladen immer false sein,
        // es sei denn, ein Scan wurde *aktiv* gestartet.
        const isForumParsingActive = localStorage.getItem(LS_KEY_FORUM_PARSING_ACTIVE) === 'true';
        const isProfileCheckingActive = localStorage.getItem(LS_KEY_PROFILE_CHECKING_ACTIVE) === 'true';
        const isStopRequested = localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true'; // Muss abgefragt werden für den Stop-Zustand

        // Sicherheitsprüfung, ob UI-Elemente wirklich schon existieren.
        if (!processButton || !statusDiv || !progressBar || !stopButton || !currentPageOnlyCheckbox) {
            console.warn("updateButtonStates: UI-Elemente noch nicht vollständig verfügbar. Erneuter Versuch in 100ms.");
            setTimeout(updateButtonStates, 100); // Erneuter Versuch
            return; 
        }

        // console.log(`[DEBUG_BUTTON_STATE] Update States: Active Forum: ${isForumParsingActive}, Active Profile: ${isProfileCheckingActive}, Stop Requested: ${isStopRequested}`);


        if (isForumParsingActive || isProfileCheckingActive) {
            // Zustand: Prozess läuft
            processButton.disabled = true; // Start-Button deaktivieren
            stopButton.style.display = 'inline-block'; // Stop-Button anzeigen
            currentPageOnlyCheckbox.disabled = true; // Checkbox deaktivieren
            progressBar.style.opacity = '1'; // Fortschrittsbalken sichtbar machen
            // console.log(`[DEBUG_BUTTON_STATE] Result: Process running. ProcessBtn Disabled: ${processButton.disabled}, StopBtn Display: ${stopButton.style.display}`);
        } else {
            // Zustand: Initial, Prozess regulär abgeschlossen oder manuell gestoppt
            if (isStopRequested) {
                // Wenn manuell gestoppt wurde, zeige dies an
                statusDiv.textContent = 'Vorgang gestoppt.';
                localStorage.removeItem(LS_KEY_STOP_REQUESTED); // Flag zurücksetzen, nachdem Status angezeigt wurde
            } else {
                statusDiv.textContent = 'Bereit für die Prüfung.'; // Initialer Text für Statuszeile
            }
            
            processButton.disabled = false; // Start-Button aktivieren
            stopButton.style.display = 'none'; // Stop-Button verstecken
            progressBar.style.width = '0%'; // Balken zurücksetzen
            progressBar.style.opacity = '0'; // Unsichtbar machen
            currentPageOnlyCheckbox.disabled = false; // Checkbox aktivieren

            // console.log(`[DEBUG_BUTTON_STATE] Result: Initial/Completed. ProcessBtn Disabled: ${processButton.disabled}, StopBtn Display: ${stopButton.style.display}`);

            // Wenn persistente Ergebnisse vorhanden sind und das Modal NICHT bereits sichtbar ist, zeige es an.
            const storedResults = localStorage.getItem(LS_KEY_PROFILE_CHECK_RESULTS);
            if (storedResults && Object.keys(JSON.parse(storedResults)).length > 0 && resultModal.style.display === 'none') {
                console.log('[LSS] updateButtonStates: Lade und zeige persistente Ergebnisse an.');
                displayFinalResultsAndCleanUp(false, true); // Zweiter Parameter signalisiert "persistente Anzeige"
            }
        }
    }

    /**
     * Aktualisiert den Fortschrittsbalken mit Prozent und Phasenname.
     * @param {number} current Aktueller Wert in der aktuellen Phase.
     * @param {number} total Maximalwert für die aktuelle Phase.
     * @param {string} phaseName Name der aktuellen Phase (z.B. "Forum-Seiten erfassen", "Profile prüfen").
     */
    function updateProgressBar(current, total, phaseName) {
        if (progressBar && statusDiv) { // Prüfung auf Verfügbarkeit der Elemente
            let percentage = 0;
            if (total > 0) {
                percentage = Math.round((current / total) * 100);
            }
            // Text des StatusDivs aktualisieren
            statusDiv.textContent = `${phaseName}: ${percentage}%`;
            // Fortschrittsbalken aktualisieren
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${percentage}%`; // Text im Balken selbst
            if (progressBar.style.opacity !== '1') { // Sicherstellen, dass er sichtbar ist, wenn er aktualisiert wird
                progressBar.style.opacity = '1';
            }
        }
    }

    /**
     * Extrahiert die aktuelle Seitenummer aus der URL.
     * @returns {number} Die aktuelle Seitenummer oder 1, wenn nicht gefunden.
     */
    function getCurrentPageNumberFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        const pageNum = parseInt(page, 10);
        return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
    }


    /**
     * Startet den gesamten Prozess der Link-Erfassung und Profilprüfung.
     */
    function startOverallProcess() {
        // Bereinige alte Ergebnisse IMMER, wenn ein neuer Scan gestartet wird
        console.log('[LSS] Neuer Scan gestartet. Bereinige alte Ergebnisse aus localStorage.');
        localStorage.removeItem(LS_KEY_COLLECTED_FORUM_LINKS);
        localStorage.removeItem(LS_KEY_PROFILE_CHECK_RESULTS); // ALTE ERGEBNISSE LÖSCHEN
        localStorage.removeItem(LS_KEY_PROFILE_CHECK_QUEUE);
        localStorage.removeItem(LS_KEY_CURRENT_FORUM_PAGE);
        localStorage.removeItem(LS_KEY_CURRENT_PROFILE_INDEX);
        localStorage.removeItem(LS_KEY_TOTAL_FORUM_PAGES);
        localStorage.setItem(LS_KEY_STOP_REQUESTED, 'false'); // Sicherstellen, dass das Stop-Flag zurückgesetzt ist

        // Zustand der "Nur aktuelle Seite prüfen" Checkbox einmalig erfassen und TEMPORÄR speichern
        const isCurrentPageOnlyScanForThisRun = currentPageOnlyCheckbox.checked;
        localStorage.setItem(LS_KEY_IS_CURRENT_PAGE_ONLY_SCAN_TEMP, isCurrentPageOnlyScanForThisRun.toString());
        console.log(`[LSS] Scan-Typ: 'Nur aktuelle Seite prüfen' ist ${isCurrentPageOnlyScanForThisRun ? 'aktiviert' : 'deaktiviert'}.`);


        // currentThreadId sollte bereits gesetzt sein, hier nur eine Sicherheitsprüfung
        if (!currentThreadId) {
            currentThreadId = getThreadIdFromUrl();
            if (!currentThreadId) {
                console.error('[LSS] Prüfe auf Verbandsmitgliedschaft: Thread ID konnte nicht aus der URL ermittelt werden. Prozess abgebrochen.');
                statusDiv.textContent = 'Fehler: Thread ID nicht gefunden.';
                return;
            }
        }

        console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Starte gesamten Prozess...');
        localStorage.setItem(LS_KEY_FORUM_PARSING_ACTIVE, 'true');
        
        updateButtonStates(); // Aktualisiert den Zustand der Buttons

        // Bestimme die Startseite und den Fortschrittsbalken-Text basierend auf der erfassten Checkbox
        let startPageNum = 1;
        let phase1Text = 'Forum-Seiten erfassen';

        if (isCurrentPageOnlyScanForThisRun) { // Nutze den lokal erfassten Wert
            startPageNum = getCurrentPageNumberFromUrl();
            phase1Text = 'Aktuelle Seite erfassen';
            estimatedTotalForumPages = 1; // Für Fortschrittsbalken, wenn nur eine Seite geprüft wird
            localStorage.setItem(LS_KEY_TOTAL_FORUM_PAGES, estimatedTotalForumPages.toString());
        } else {
             // Wenn nicht "nur aktuelle Seite", ermittle die Gesamtseitenanzahl vom DOM
             const paginationUl = document.querySelector('ul.pagination.pagination');
             if (paginationUl) {
                 const firstPageDoc = new DOMParser().parseFromString(document.documentElement.outerHTML, 'text/html');
                 estimatedTotalForumPages = extractTotalForumPages(firstPageDoc);
                 console.log(`[LSS] Gesamtanzahl der Forenseiten aus DOM: ${estimatedTotalForumPages}`);
                 localStorage.setItem(LS_KEY_TOTAL_FORUM_PAGES, estimatedTotalForumPages.toString());
             } else {
                 console.warn('[LSS] Paginierungs-UL nicht gefunden. Schätze Gesamtseiten auf 1.');
                 estimatedTotalForumPages = 1;
                 localStorage.setItem(LS_KEY_TOTAL_FORUM_PAGES, '1');
             }
        }

        updateProgressBar(0, 1, phase1Text); // Initialer Fortschrittsbalken für Phase 1

        // Startet die erste Phase: Forum-Seiten parsen
        // Übergibt den Scan-Typ als Parameter für konsistente Logik
        requestForumPage(currentThreadId, startPageNum, isCurrentPageOnlyScanForThisRun);
    }

    /**
     * Stoppt den laufenden Parsing-Prozess.
     */
    function stopParsing() {
        console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Stop-Anfrage empfangen. Beende bald...');
        localStorage.setItem(LS_KEY_STOP_REQUESTED, 'true'); // Setzt das Stop-Flag
        updateButtonStates(); // Aktualisiert den Zustand der Buttons
        // displayFinalResultsAndCleanUp() wird aufgerufen, sobald die aktuelle Anfrage abgeschlossen ist
        // und das Stop-Flag geprüft wird.
    }


    /**
     * Extrahiert die Thread-ID aus der aktuellen Fenster-URL.
     * @returns {string|null} Die extrahierte Thread-ID oder null, wenn keine gefunden wird.
     */
    function getThreadIdFromUrl() {
        const match = window.location.pathname.match(THREAD_ID_REGEX);
        return match ? match[1] : null;
    }

    /**
     * Ermittelt die maximale Seitenzahl aus der Paginierung eines HTML-Dokuments.
     * @param {Document} doc Das DOM-Dokument der Seite.
     * @returns {number} Die höchste gefundene Seitenzahl.
     */
    function extractTotalForumPages(doc) {
        let maxPage = 1;
        // Sucht nach allen nummerierten Seitenlinks
        const pageLinks = doc.querySelectorAll('ul.pagination.pagination li a');
        pageLinks.forEach(link => {
            const pageText = link.textContent.trim();
            const pageNum = parseInt(pageText, 10);
            if (!isNaN(pageNum)) {
                maxPage = Math.max(maxPage, pageNum);
            }
        });

        // Überprüft auch den "Letzte"-Link, falls vorhanden, der direkt zur letzten Seite führt
        const lastPageLink = doc.querySelector('li.last a'); // Selektor präzisiert
        if (lastPageLink) {
            const href = lastPageLink.href;
            const match = href.match(/page=(\d+)/);
            if (match && !isNaN(parseInt(match[1], 10))) {
                maxPage = Math.max(maxPage, parseInt(match[1], 10));
            }
        }
        return maxPage;
    }


    // --- Phase 1: Forum-Seiten parsen (Sammeln von Profil-Links) ---

    /**
     * Sendet eine GM_xmlhttpRequest, um eine spezifische Forenseite abzurufen,
     * und übergibt den Inhalt an die Parsing-Funktion.
     * @param {string} threadId Die ID des aktuellen Forums-Threads.
     * @param {number} pageNum Die Nummer der anzufordernden Seite.
     * @param {boolean} isCurrentPageOnly Signalisiert, ob nur die aktuelle Seite gescannt werden soll.
     */
    function requestForumPage(threadId, pageNum, isCurrentPageOnly) { // isCurrentPageOnly als Parameter hinzugefügt
        // Prüft das Stop-Flag, bevor die Anfrage gesendet wird
        if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
            console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Forum-Parsing gestoppt (Anfrage abgebrochen).');
            finishForumParsing(isCurrentPageOnly); // Parameter weitergeben
            return;
        }

        const url = `https://www.leitstellenspiel.de/alliance_threads/${threadId}?page=${pageNum}`;
        // console.log(`[LSS] Prüfe auf Verbandsmitgliedschaft: Fordere Forenseite ${pageNum} an... (${url})`);
        localStorage.setItem(LS_KEY_CURRENT_FORUM_PAGE, pageNum.toString());

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                // Prüft das Stop-Flag nach dem Laden der Antwort
                if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
                    console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Forum-Parsing gestoppt (nach Antwort).');
                    finishForumParsing(isCurrentPageOnly); // Parameter weitergeben
                    return;
                }

                if (response.status === 200) {
                    // isCurrentPageOnly an die nächste Funktion weitergeben
                    processFetchedForumPage(response.responseText, threadId, pageNum, isCurrentPageOnly);
                } else {
                    console.error(`[LSS] Prüfe auf Verbandsmitgliedschaft: Fehler beim Abrufen von Forenseite ${pageNum}. Status: ${response.status}`);
                    finishForumParsing(isCurrentPageOnly); // Parameter weitergeben
                }
            },
            onerror: function(error) {
                if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
                    console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Forum-Parsing gestoppt (nach Fehler).');
                    finishForumParsing(isCurrentPageOnly); // Parameter weitergeben
                    return;
                }
                console.error(`[LSS] Prüfe auf Verbandsmitgliedschaft: Netzwerkfehler beim Abrufen von Forenseite ${pageNum}.`, error);
                finishForumParsing(isCurrentPageOnly); // Parameter weitergeben
            }
        });
    }

    /**
     * Parst den HTML-Inhalt einer abgerufenen Forenseite nach Profil-Links
     * und konsolidiert die gefundenen Links und deren Fundstellen.
     * @param {string} htmlContent Der HTML-Inhalt der Forenseite.
     * @param {string} threadId Die ID des aktuellen Forums-Threads.
     * @param {number} pageNum Die Nummer der aktuell verarbeiteten Seite.
     * @param {boolean} isCurrentPageOnly Signalisiert, ob nur die aktuelle Seite gescannt werden soll.
     */
    function processFetchedForumPage(htmlContent, threadId, pageNum, isCurrentPageOnly) { // isCurrentPageOnly als Parameter hinzugefügt
        if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
            console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Forum-Parsing gestoppt (während Verarbeitung).');
            finishForumParsing(isCurrentPageOnly); // Parameter weitergeben
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Bestimme den Text für den Fortschrittsbalken in Phase 1
        const phase1Text = isCurrentPageOnly ? 'Aktuelle Seite erfassen' : 'Forum-Seiten erfassen';

        // Die estimatedTotalForumPages sollte bereits in startOverallProcess ermittelt worden sein
        let currentTotalPages = parseInt(localStorage.getItem(LS_KEY_TOTAL_FORUM_PAGES) || '1', 10);
        updateProgressBar(pageNum, currentTotalPages, phase1Text);


        let collectedLinksMap = JSON.parse(localStorage.getItem(LS_KEY_COLLECTED_FORUM_LINKS)) || {};

        const profileLinks = doc.querySelectorAll('a[href^="/profile/"]');
        if (profileLinks.length > 0) {
            profileLinks.forEach(link => {
                const profileUrl = link.href;
                const userName = link.textContent.trim();
                let postId = 'N/A';

                let parentPost = link.closest('[id^="post-on-page-"]');
                if (parentPost) {
                    postId = parentPost.id;
                }

                if (!collectedLinksMap[profileUrl]) {
                    collectedLinksMap[profileUrl] = {
                        userName: userName,
                        foundLocations: []
                    };
                }

                const isLocationDuplicate = collectedLinksMap[profileUrl].foundLocations.some(
                    loc => loc.page === pageNum && loc.postId === postId
                );

                if (!isLocationDuplicate) {
                    collectedLinksMap[profileUrl].foundLocations.push({
                        page: pageNum,
                        postId: postId
                    });
                    // console.log(`[Phase 1] Gefunden/Aktualisiert: Profil: "${userName}" (${profileUrl}), Fundstelle: Seite ${pageNum}, Post ${postId}`);
                }
            });
            localStorage.setItem(LS_KEY_COLLECTED_FORUM_LINKS, JSON.stringify(collectedLinksMap));
        } else {
            // console.log(`[Phase 1] Keine Profil-Links auf Forenseite ${pageNum} gefunden.`);
        }

        // --- ENTSCHEIDENDE LOGIK für "Nur aktuelle Seite prüfen" ---
        if (isCurrentPageOnly) { // Nutze den übergebenen Parameter
            console.log('[LSS] "Nur aktuelle Seite prüfen" ist aktiviert. Beende Forum-Parsing nach aktueller Seite.');
            finishForumParsing(isCurrentPageOnly); // Parameter weitergeben, um Profilprüfung zu ermöglichen
        } else {
            const nextButtonDisabled = doc.querySelector('li.next.disabled > span');
            const nextButtonAnchor = doc.querySelector('li.next:not(.disabled) > a[rel="next"]');

            if (nextButtonAnchor && !nextButtonDisabled) {
                // Wenn nicht "nur aktuelle Seite", dann zur nächsten Seite gehen
                setTimeout(() => requestForumPage(threadId, pageNum + 1, isCurrentPageOnly), REQUEST_DELAY); // isCurrentPageOnly weitergeben
            } else {
                console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Ende der Forenseiten erreicht (oder keine weiteren Seiten).');
                finishForumParsing(isCurrentPageOnly); // Parameter weitergeben
            }
        }
    }

    /**
     * Schliesst die erste Phase ab und bereitet die zweite Phase vor.
     * @param {boolean} isCurrentPageOnly Signalisiert, ob nur die aktuelle Seite gescannt wurde.
     */
    function finishForumParsing(isCurrentPageOnly) { // Parameter hinzugefügt
        localStorage.setItem(LS_KEY_FORUM_PARSING_ACTIVE, 'false');
        // Sicherstellen, dass der Fortschrittsbalken für Phase 1 100% erreicht
        let currentTotalPages = parseInt(localStorage.getItem(LS_KEY_TOTAL_FORUM_PAGES) || '1', 10);
        const phase1Text = isCurrentPageOnly ? 'Aktuelle Seite erfasst' : 'Forum-Seiten erfasst';
        updateProgressBar(currentTotalPages, currentTotalPages, phase1Text);


        if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
            displayFinalResultsAndCleanUp(true);
            return;
        }

        const collectedForumLinksMap = JSON.parse(localStorage.getItem(LS_KEY_COLLECTED_FORUM_LINKS)) || {};
        const profileUrls = Object.keys(collectedForumLinksMap);

        if (profileUrls.length === 0) {
            console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Keine Profil-Links im Forum gefunden. Beende den gesamten Prozess.');
            displayFinalResultsAndCleanUp();
            return;
        }
        
        // DIESER BLOCK WURDE HIERHER VERSCHOBEN UND MODIFIZIERT.
        // Die Logik für "Nur aktuelle Seite prüfen" begrenzt das Forum-Parsing, nicht die Profilprüfung.
        // Wenn Links gefunden wurden, sollen diese IMMER geprüft werden.
        localStorage.setItem(LS_KEY_PROFILE_CHECK_QUEUE, JSON.stringify(profileUrls));
        localStorage.setItem(LS_KEY_CURRENT_PROFILE_INDEX, '0');
        localStorage.setItem(LS_KEY_PROFILE_CHECKING_ACTIVE, 'true');
        // Alte Ergebnisse werden beim START eines NEUEN Scans gelöscht, nicht hier
        localStorage.setItem(LS_KEY_PROFILE_CHECK_RESULTS, JSON.stringify({})); 

        updateButtonStates();
        // Fortschrittsbalken für Profilprüfung vorbereiten (Start bei 0% dieser Phase)
        updateProgressBar(0, profileUrls.length, 'Profile prüfen');

        console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Starte Profilprüfung für alle gesammelten Profile...');
        checkNextProfileInQueue();
    }


    // --- Phase 2: Profilseiten parsen und prüfen (Verbandszugehörigkeit) ---

    /**
     * Holt das nächste Profil aus der Warteschlange und fordert dessen Profilseite an.
     */
    function checkNextProfileInQueue() {
        if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
            console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Profilprüfung gestoppt (Warteschlange abgebrochen).');
            displayFinalResultsAndCleanUp(true);
            return;
        }

        const queue = JSON.parse(localStorage.getItem(LS_KEY_PROFILE_CHECK_QUEUE));
        let currentIndex = parseInt(localStorage.getItem(LS_KEY_CURRENT_PROFILE_INDEX), 10);

        // Fortschrittsbalken aktualisieren für Phase 2
        updateProgressBar(currentIndex, queue.length, 'Profile prüfen');

        if (queue && currentIndex < queue.length) {
            const profileUrl = queue[currentIndex];
            requestProfilePage(profileUrl, currentIndex);
        } else {
            console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Alle Profile geprüft.');
            displayFinalResultsAndCleanUp();
        }
    }

    /**
     * Sendet eine GM_xmlhttpRequest, um eine spezifische Profilseite abzurufen.
     */
    function requestProfilePage(profileUrl, index) {
        if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
            console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Profilprüfung gestoppt (Anfrage abgebrochen).');
            displayFinalResultsAndCleanUp(true);
            return;
        }

        // console.log(`[Phase 2] Prüfe Profil (${index + 1}/${JSON.parse(localStorage.getItem(LS_KEY_PROFILE_CHECK_QUEUE)).length}): ${profileUrl}`);

        GM_xmlhttpRequest({
            method: "GET",
            url: profileUrl,
            onload: function(response) {
                if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
                    console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Profilprüfung gestoppt (nach Antwort).');
                    displayFinalResultsAndCleanUp(true);
                    return;
                }

                if (response.status === 200) {
                    processFetchedProfilePage(profileUrl, response.responseText, index);
                } else {
                    console.error(`[Phase 2] Fehler beim Abrufen der Profilseite ${profileUrl}. Status: ${response.status}`);
                    saveProfileCheckResult(profileUrl, 'ERROR', null);
                    let nextIndex = index + 1;
                    localStorage.setItem(LS_KEY_CURRENT_PROFILE_INDEX, nextIndex.toString());
                    setTimeout(() => checkNextProfileInQueue(), REQUEST_DELAY);
                }
            },
            onerror: function(error) {
                if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
                    console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Profilprüfung gestoppt (nach Fehler).');
                    displayFinalResultsAndCleanUp(true);
                    return;
                }
                console.error(`[LSS] Prüfe auf Verbandsmitgliedschaft: Netzwerkfehler beim Abrufen von Forenseite ${pageNum}.`, error);
                saveProfileCheckResult(profileUrl, 'ERROR', null);
                let nextIndex = index + 1;
                localStorage.setItem(LS_KEY_CURRENT_PROFILE_INDEX, nextIndex.toString());
                setTimeout(() => checkNextProfileInQueue(), REQUEST_DELAY);
            }
        });
    }

    /**
     * Parst den HTML-Inhalt einer abgerufenen Profilseite und prüft auf die Verbandszugehörigkeit.
     */
    function processFetchedProfilePage(profileUrl, htmlContent, index) {
        if (localStorage.getItem(LS_KEY_STOP_REQUESTED) === 'true') {
            console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Profilprüfung gestoppt (während Verarbeitung).');
            displayFinalResultsAndCleanUp(true);
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const allAllianceLinks = doc.querySelectorAll('a[href^="/alliances/"]');

        let isOkAllianceFound = false;
        let foundAnyOtherAlliance = false;
        let actualAllianceName = null;

        // console.log(`[DEBUG_CONFIG] OK_ALLIANCE_LINK_PART (Soll): "${OK_ALLIANCE_LINK_PART}"`);

        if (allAllianceLinks.length > 0) {
            for (const link of allAllianceLinks) {
                const href = link.getAttribute('href');
                const name = link.textContent.trim();

                // console.log(`[DEBUG] Gefundener Allianz-Link im Profil ${profileUrl}: href="${href}", name="${name}"`);

                if (href === OK_ALLIANCE_LINK_PART) {
                    isOkAllianceFound = true;
                    actualAllianceName = name;
                    break;
                } else {
                    foundAnyOtherAlliance = true;
                    actualAllianceName = name;
                }
            }
        }

        let status = 'UNKNOWN_STATE';

        if (isOkAllianceFound) {
            status = 'OK_FOUND';
        } else if (foundAnyOtherAlliance) {
            status = 'ATTENTION_REQUIRED_OTHER_ALLIANCE';
        } else {
            status = 'ATTENTION_REQUIRED_NONE_FOUND';
        }
        
        // console.log(`[DEBUG_STATUS] Profil ${profileUrl} finaler Status: ${status}, Allianz: ${actualAllianceName}`);

        saveProfileCheckResult(profileUrl, status, actualAllianceName);

        let nextIndex = index + 1;
        localStorage.setItem(LS_KEY_CURRENT_PROFILE_INDEX, nextIndex.toString());
        setTimeout(() => checkNextProfileInQueue(), REQUEST_DELAY);
    }

    /**
     * Speichert das Ergebnis der Profilprüfung für ein einzelnes Profil im localStorage.
     */
    function saveProfileCheckResult(profileUrl, status, actualAllianceName) {
        let results = JSON.parse(localStorage.getItem(LS_KEY_PROFILE_CHECK_RESULTS)) || {};
        const forumInfo = JSON.parse(localStorage.getItem(LS_KEY_COLLECTED_FORUM_LINKS)) || {}; 
        const currentForumInfo = forumInfo[profileUrl];

        // Speichere alle notwendigen Informationen direkt im Ergebnisobjekt
        results[profileUrl] = {
            userName: currentForumInfo ? currentForumInfo.userName : 'Unbekannt',
            foundInForum: currentForumInfo ? currentForumInfo.foundLocations : [],
            checkStatus: status,
            actualAllianceName: actualAllianceName || 'N/A'
        };
        localStorage.setItem(LS_KEY_PROFILE_CHECK_RESULTS, JSON.stringify(results));
    }


    /**
     * Zeigt die finalen Ergebnisse beider Phasen im Konsolen-Log an und im Modal.
     * @param {boolean} wasStopped Gibt an, ob der Vorgang gestoppt wurde.
     * @param {boolean} isPersistentDisplay True, wenn dies eine Anzeige von persistente Ergebnissen ist (kein Cleanup).
     */
    function displayFinalResultsAndCleanUp(wasStopped = false, isPersistentDisplay = false) {
        console.log('\n--- [LSS] Prüfe auf Verbandsmitgliedschaft: ENDERGEBNISSE ---');

        // Lade die tatsächlich gespeicherten Ergebnisse
        const profileCheckResults = JSON.parse(localStorage.getItem(LS_KEY_PROFILE_CHECK_RESULTS)) || {};
        const collectedForumLinksMap = JSON.parse(localStorage.getItem(LS_KEY_COLLECTED_FORUM_LINKS)) || {};


        // console.log('[DEBUG_RESULTS_LOADED] Profile Check Results from localStorage:', JSON.stringify(profileCheckResults, null, 2));


        const uniqueProfilesCount = Object.keys(collectedForumLinksMap).length;
        const checkedProfilesCount = Object.keys(profileCheckResults).length;

        if (wasStopped) {
            console.warn(`Vorgang wurde vom Benutzer GESTOPPT! (${checkedProfilesCount} von ${uniqueProfilesCount} Profilen geprüft)`);
            if (statusDiv) statusDiv.textContent = `Vorgang gestoppt! ${checkedProfilesCount} von ${uniqueProfilesCount} Profilen geprüft.`;
        } else if (isPersistentDisplay) {
            console.log(`[LSS] Zeige persistente Ergebnisse an. (Geprüfte Profile: ${checkedProfilesCount})`);
            if (statusDiv) statusDiv.textContent = `Letzte Prüfung abgeschlossen. ${checkedProfilesCount} Profile geprüft.`;
        } else { // Regulärer Abschluss eines Scans
            console.log(`\nGesammelte einzigartige Profile aus dem Forum: ${uniqueProfilesCount}`);
            console.log(`Geprüfte Profile: ${checkedProfilesCount}`);
            if (statusDiv) statusDiv.textContent = `Prüfung abgeschlossen! ${checkedProfilesCount} Profile geprüft.`;
        }


        console.log('\n--- Details der Profilprüfungen ---'); // Titel angepasst, um alle anzuzeigen
        let counts = {
            okFound: 0,
            attentionRequiredOtherAlliance: 0,
            attentionRequiredNoneFound: 0,
            error: 0
        };

        const modalBodyElement = document.getElementById('lss-modal-body');
        let ul = null; 
        if (modalBodyElement) {
            modalBodyElement.innerHTML = ''; // Leert den Inhalt des Modals
            ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';
        
            if (wasStopped) {
                const statusMessage = document.createElement('p');
                statusMessage.innerHTML = `Vorgang **gestoppt** nach Prüfung von ${checkedProfilesCount} von ${uniqueProfilesCount} Profilen.`;
                statusMessage.style.fontWeight = 'bold';
                statusMessage.style.color = '#FFA500'; // Orange
                modalBodyElement.appendChild(statusMessage);
            }
        }


        for (const profileUrl in profileCheckResults) {
            const result = profileCheckResults[profileUrl]; 

            // console.log(`[DEBUG_DISPLAY_LOOP] Bearbeite Profil: ${profileUrl}, Status: ${result.checkStatus}`);

            const userName = result.userName; 
            const foundLocations = result.foundInForum;

            let li = null; 
            if (modalBodyElement) { 
                li = document.createElement('li');
                // console.log(`[DEBUG_MODAL_ITEM_CREATE] li-Element erstellt für ${profileUrl}`); 
                li.style.marginBottom = '10px';
                li.style.padding = '8px';
                li.style.border = '1px solid #eee';
                li.style.borderRadius = '5px';
            }

            switch (result.checkStatus) {
                case 'OK_FOUND':
                    counts.okFound++;
                    break;
                case 'ATTENTION_REQUIRED_OTHER_ALLIANCE':
                    counts.attentionRequiredOtherAlliance++;
                    if (li && ul) { 
                        li.style.backgroundColor = '#fff0f0'; 
                        li.innerHTML = `<strong>🚨 AUFFÄLLIG:</strong> ${userName} (<a href="${profileUrl}" target="_blank">${profileUrl}</a>)<br>Zugehörig zu Verband: "${result.actualAllianceName}" (NICHT "${OK_ALLIANCE_NAME}").<br>Fundstelle(n): `;
                        foundLocations.forEach((loc, i) => {
                            const forumLink = document.createElement('a');
                            if (currentThreadId) { 
                                forumLink.href = `/alliance_threads/${currentThreadId}?page=${loc.page}#${loc.postId}`;
                            } else {
                                forumLink.href = '#';
                                console.warn("currentThreadId ist null, genauer Forum-Link konnte nicht erstellt werden.");
                            }
                            forumLink.target = '_blank'; 
                            forumLink.textContent = `Seite ${loc.page}, Post ${loc.postId}`;
                            li.appendChild(forumLink);
                            if (i < foundLocations.length - 1) li.append('; ');
                        });
                        ul.appendChild(li);
                        // console.log(`[DEBUG_MODAL_ITEM_ADDED] ATTENTION_REQUIRED_OTHER_ALLIANCE Element zum Modal hinzugefügt für ${profileUrl}`); 
                    }
                    break;
                case 'ATTENTION_REQUIRED_NONE_FOUND':
                    counts.attentionRequiredNoneFound++;
                     if (li && ul) { 
                        li.style.backgroundColor = '#fff0f0'; 
                        li.innerHTML = `<strong>🚨 AUFFÄLLIG:</strong> ${userName} (<a href="${profileUrl}" target="_blank">${profileUrl}</a>)<br>Keinerlei Verband auf Profilseite gefunden.<br>Fundstelle(n): `;
                        foundLocations.forEach((loc, i) => {
                            const forumLink = document.createElement('a');
                            if (currentThreadId) {
                                forumLink.href = `/alliance_threads/${currentThreadId}?page=${loc.page}#${loc.postId}`;
                            } else {
                                forumLink.href = '#';
                                console.warn("currentThreadId ist null, genauer Forum-Link konnte nicht erstellt werden.");
                            }
                            forumLink.target = '_blank';
                            forumLink.textContent = `Seite ${loc.page}, Post ${loc.postId}`;
                            li.appendChild(forumLink);
                            if (i < foundLocations.length - 1) li.append('; ');
                        });
                        ul.appendChild(li);
                        // console.log(`[DEBUG_MODAL_ITEM_ADDED] ATTENTION_REQUIRED_NONE_FOUND Element zum Modal hinzugefügt für ${profileUrl}`); 
                    }
                    break;
                case 'ERROR':
                    counts.error++;
                    if (li && ul) { 
                        li.style.backgroundColor = '#fff0f0'; 
                        li.innerHTML = `<strong>❗ FEHLER:</strong> ${userName} (<a href="${profileUrl}" target="_blank">${profileUrl}</a>)<br>Fehler beim Abrufen/Parsen des Profils.<br>Fundstelle(n): `;
                        foundLocations.forEach((loc, i) => {
                            const forumLink = document.createElement('a');
                            if (currentThreadId) {
                                forumLink.href = `/alliance_threads/${currentThreadId}?page=${loc.page}#${loc.postId}`;
                            } else {
                                forumLink.href = '#';
                                console.warn("currentThreadId ist null, genauer Forum-Link konnte nicht erstellt werden.");
                            }
                            forumLink.target = '_blank';
                            forumLink.textContent = `Seite ${loc.page}, Post ${loc.postId}`;
                            li.appendChild(forumLink);
                            if (i < foundLocations.length - 1) li.append('; ');
                        });
                        ul.appendChild(li);
                        // console.log(`[DEBUG_MODAL_ITEM_ADDED] ERROR Element zum Modal hinzugefügt für ${profileUrl}`); 
                    }
                    break;
                default:
                    console.warn(`[LSS] Unbekannter Status für Profil ${profileUrl}: ${result.checkStatus}`); 
            }
        }
        if (modalBodyElement && ul) { 
             // console.log(`[DEBUG_MODAL_ELEMENTS] Anzahl der li-Elemente im ul-Container: ${ul.children.length}`);
             if (ul.children.length > 0) {
                modalBodyElement.appendChild(ul);
            } else {
                const noResults = document.createElement('p');
                noResults.textContent = 'Es wurden keine auffälligen Profile gefunden.';
                noResults.style.color = '#555';
                modalBodyElement.appendChild(noResults);
            }
            // Das Modal nur anzeigen, wenn es nicht bereits sichtbar ist, um Rekursion zu vermeiden.
            // Und nur wenn es sich nicht um eine persistente Anzeige handelt, die schon von updateButtonStates behandelt wurde.
            if (!isPersistentDisplay && resultModal.style.display === 'none') {
                resultModal.style.display = 'block'; 
            }
        }


        console.log('\n--- Zusammenfassung der Ergebnisse ---');
        console.log(`Profile, die zu "${OK_ALLIANCE_NAME}" (${OK_ALLIANCE_ID}) gehören (nicht auffällig markiert): ${counts.okFound}`);
        console.log(`🚨 Profile mit ANDEREM Verband (als "${OK_ALLIANCE_NAME}"): ${counts.attentionRequiredOtherAlliance}`);
        console.log(`🚨 Profile OHNE Verband: ${counts.attentionRequiredNoneFound}`);
        console.log(`❗ Profile mit Prüf-Fehler: ${counts.error}`);
        console.log('----------------------------------------------------');

        // WICHTIG: Die Ergebnisse werden hier NICHT mehr aus dem localStorage entfernt,
        // sondern erst beim START eines NEUEN Scans.
        // Nur die temporären Flags für den aktiven Prozess werden hier entfernt.
        if (!isPersistentDisplay) { // Nur nach einem echten Scan-Abschluss die Flags zurücksetzen
            localStorage.removeItem(LS_KEY_FORUM_PARSING_ACTIVE);
            localStorage.removeItem(LS_KEY_PROFILE_CHECKING_ACTIVE);
            localStorage.removeItem(LS_KEY_STOP_REQUESTED); // Sicherstellen, dass dieses Flag auch sauber ist
            localStorage.removeItem(LS_KEY_IS_CURRENT_PAGE_ONLY_SCAN_TEMP); // Auch dieses Flag zurücksetzen
            console.log('[LSS] Prüfe auf Verbandsmitgliedschaft: Vorgang abgeschlossen. Ergebnisse bleiben gespeichert.');
        }

        // Setzt den Button-Status zurück auf "abgeschlossen" oder "startbereit".
        // Dieser Aufruf muss nur erfolgen, wenn die Anzeige nicht aufgrund persistenter Daten erfolgt (da dies bereits
        // von updateButtonStates am Anfang gehandhabt wird).
        if (!isPersistentDisplay) {
            updateButtonStates();
        }
    }

    // Hauptausführungslogik beim Laden der Seite:
    // Führt eine initiale Bereinigung und Zustandsprüfung durch, bevor UI-Elemente hinzugefügt werden.
    initialCheckForPersistentResults(); // Benennung angepasst, da es nur Ergebnisse prüft

    // Stellt sicher, dass das DOM vollständig geladen ist, bevor die UI-Elemente hinzugefügt werden.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addUIElements();
        });
    } else {
        addUIElements();
    }
})();
