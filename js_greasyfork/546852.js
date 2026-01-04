// ==UserScript==
// @name         LSS Fahrzeuglisten Turbo-Lader (Final Polished)
// @namespace    GeminiForHendrik-FinalPolished
// @version      26.4
// @description  Lädt Fahrzeuge blitzschnell, Hotkey- & Mehrfach-Laden-Fix.
// @author       Gemini für Hendrik
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MachDochWasDuWillst
// @downloadURL https://update.greasyfork.org/scripts/546852/LSS%20Fahrzeuglisten%20Turbo-Lader%20%28Final%20Polished%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546852/LSS%20Fahrzeuglisten%20Turbo-Lader%20%28Final%20Polished%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof $ === 'undefined') return;

    const PAGES_TO_FETCH_PER_CLICK = 5;
    let turboLoadInProgress = false;
    let lastLoadedPage = 1;

    // UI-Setup
    GM_addStyle(`
        #turbo-lader-status { padding: 5px; text-align: center; font-size: 12px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9; margin-bottom: 10px; }
        body.dark #turbo-lader-status { background-color: #2c3e50; border-color: #4a627a; }
        #turbo-lader-text { color: #31708f; font-weight: bold; }
        body.dark #turbo-lader-text { color: #4e92b5; }
    `);
    function initUI() {
        if (document.getElementById('turbo-lader-status')) return;
        const uiAnchor = document.getElementById('tabs');
        if (uiAnchor) {
            const statusContainer = document.createElement('div');
            statusContainer.id = 'turbo-lader-status';
            statusContainer.innerHTML = `<span id="turbo-lader-text">Turbo-Lader (v26.4) bereit.</span>`;
            uiAnchor.parentElement.insertBefore(statusContainer, uiAnchor);
        }
    }
    function updateStatus(message) {
        const statusDisplay = document.getElementById('turbo-lader-text');
        if (statusDisplay) statusDisplay.textContent = message;
    }

    async function startTurboLoad(loadButton) {
        if (turboLoadInProgress) return;
        turboLoadInProgress = true;

        if (loadButton) {
            loadButton.textContent = 'Turbo-Download...';
            loadButton.style.pointerEvents = 'none';
        }
        updateStatus(`Phase 1: Lade ${PAGES_TO_FETCH_PER_CLICK} Seiten...`);
        try {
            const baseUrl = loadButton.href;
            const fetchPromises = [];
            const url = new URL(baseUrl);

            if (lastLoadedPage === 1) {
                // Fall 1: ERSTER LADEVORGANG
                fetchPromises.push(fetch(baseUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } }));

                for (let i = 1; i < PAGES_TO_FETCH_PER_CLICK; i++) {
                    const pageToFetch = lastLoadedPage + 1 + i;
                    const offset = pageToFetch - 2; // KORRIGIERTE FORMEL
                    const nextUrl = `${url.origin}${url.pathname}?offset_page=${offset}`;
                    fetchPromises.push(fetch(nextUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } }));
                }
            } else {
                // Fall 2: JEDER FOLGENDE LADEVORGANG
                for (let i = 0; i < PAGES_TO_FETCH_PER_CLICK; i++) {
                    const pageToFetch = lastLoadedPage + 1 + i;
                    const offset = pageToFetch - 2; // KORRIGIERTE FORMEL
                    const nextUrl = `${url.origin}${url.pathname}?offset_page=${offset}`;
                    fetchPromises.push(fetch(nextUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } }));
                }
            }

            const responses = await Promise.all(fetchPromises);
            const fragment = document.createDocumentFragment();
            let newLoadButtonRow = null;
            let vehiclesAdded = 0;
            for(const response of responses) {
                if(response.ok && response.status !== 204) {
                    const htmlText = await response.text();
                    if(htmlText.trim() === "") continue;
                    const tempContainer = document.createElement('tbody');
                    tempContainer.innerHTML = htmlText;
                    const vehicleRows = tempContainer.querySelectorAll('tr:not(#missing_vehicles_load)');
                    vehiclesAdded += vehicleRows.length;
                    vehicleRows.forEach(row => fragment.appendChild(row));
                    const potentialButtonRow = tempContainer.querySelector('tr#missing_vehicles_load');
                    if (potentialButtonRow) newLoadButtonRow = potentialButtonRow;
                }
            }

            updateStatus('Phase 2: Füge Fahrzeuge ein...');
            const vehicleTableBody = document.getElementById('vehicle_show_table_body_all');
            const originalButtonRow = loadButton.closest('tr');

            if (originalButtonRow) originalButtonRow.remove();
            vehicleTableBody.appendChild(fragment);
            if (newLoadButtonRow) vehicleTableBody.appendChild(newLoadButtonRow);

            lastLoadedPage += PAGES_TO_FETCH_PER_CLICK;

            updateStatus(`Fertig! ${vehiclesAdded} Fahrzeuge hinzugefügt. AAO-Update läuft...`);

            setTimeout(() => {
                if (typeof aaoCheckAvailable === 'function') {
                    aaoCheckAvailable();
                    updateStatus(`Fertig! ${vehiclesAdded} Fahrzeuge hinzugefügt. AAOs aktualisiert.`);
                } else {
                    updateStatus("Fehler: Interne AAO-Funktion nicht gefunden!");
                }
            }, 200);
        } catch (error) {
            console.error("[Turbo-Lader] Fehler:", error);
            updateStatus('Ein Fehler ist aufgetreten!');
        } finally {
            turboLoadInProgress = false;
        }
    }

    // Trigger für den Klick
    document.addEventListener('click', function(event) {
        const loadButton = event.target.closest('a.missing_vehicles_load');
        if (loadButton) {
            event.preventDefault();
            event.stopPropagation();
            startTurboLoad(loadButton);
        }
    }, true);
    // Trigger für den Hotkey 'n'
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'n' && !['input', 'textarea'].includes(event.target.tagName.toLowerCase())) {
            const loadButton = document.querySelector('a.missing_vehicles_load');
            if (loadButton && !turboLoadInProgress) {
                event.preventDefault();
                event.stopPropagation();
                startTurboLoad(loadButton);
            }
        }
    }, true);
    initUI();
})();