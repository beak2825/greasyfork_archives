// ==UserScript==
// @name         [LSS] Erweiterungen Schnellbau & Einsatzbereitschaft
// @namespace    leitstellenspiel-scripts
// @version      1.2.0
// @description  Ermöglicht den Ausbau von Erweiterungen sowie das Umschalten der Einsatzbereitschaft. Interaktion für den Ausbau wurde auf einzelne Elemente verbessert.
// @author       Gemini & Community
// @match        https://*.leitstellenspiel.de/buildings/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538751/%5BLSS%5D%20Erweiterungen%20Schnellbau%20%20Einsatzbereitschaft.user.js
// @updateURL https://update.greasyfork.org/scripts/538751/%5BLSS%5D%20Erweiterungen%20Schnellbau%20%20Einsatzbereitschaft.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[Erweiterungen Schnellbau & Einsatzbereitschaft] Skript v2.2.0 wird geladen...');

    // #region KONFIGURATION & DATEN
    const STORAGE_KEY = 'extension_builder_presets_final_v2';
    const LSSM_TABLE_ID = 'lssmv4-extendedBuilding-expansions-table';
    const SELECTED_OUTLINE_COLOR = '#FFA500'; // Orange

    const manualExtensions = {
        '0_normal': [ { id: 0, name: 'Rettungsdienst' }, { id: 1, name: '1. AB-Stellplatz' }, { id: 2, name: '2. AB-Stellplatz' }, { id: 3, name: '3. AB-Stellplatz' }, { id: 4, name: '4. AB-Stellplatz' }, { id: 5, name: '5. AB-Stellplatz' }, { id: 6, name: 'Wasserrettung' }, { id: 7, name: '6. AB-Stellplatz' }, { id: 8, name: 'Flughafenfeuerwehr' }, { id: 9, name: 'Großwache' }, { id: 10, name: '7. AB-Stellplatz' }, { id: 11, name: '8. AB-Stellplatz' }, { id: 12, name: '9. AB-Stellplatz' }, { id: 13, name: 'Werkfeuerwehr' }, { id: 14, name: 'Netzersatzanlage 50' }, { id: 15, name: 'Netzersatzanlage 200' }, { id: 16, name: 'Großlüfter' }, { id: 17, name: '10. AB-Stellplatz' }, { id: 18, name: 'Drohneneinheit' }, { id: 19, name: 'Verpflegungsdienst' }, { id: 20, name: '1. Anhänger-Stellplatz' }, { id: 21, name: '2. Anhänger-Stellplatz' }, { id: 22, name: '3. Anhänger-Stellplatz' }, { id: 23, name: '4. Anhänger-Stellplatz' }, { id: 24, name: '5. Anhänger-Stellplatz' }, { id: 25, name: 'Bahnrettung' }, { id: 26, name: '11. AB-Stellplatz' }, { id: 27, name: '12. AB-Stellplatz' } ],
        '0_small': [ { id: 0, name: 'Rettungsdienst' }, { id: 1, name: '1. AB-Stellplatz' }, { id: 2, name: '2. AB-Stellplatz' }, { id: 6, name: 'Wasserrettung' }, { id: 8, name: 'Flughafenfeuerwehr' }, { id: 13, name: 'Werkfeuerwehr' }, { id: 14, name: 'Netzersatzanlage 50' }, { id: 16, name: 'Großlüfter' }, { id: 18, name: 'Drohneneinheit' }, { id: 19, name: 'Verpflegungsdienst' }, { id: 20, name: '1. Anhänger-Stellplatz' }, { id: 21, name: '2. Anhänger-Stellplatz' }, { id: 25, name: 'Bahnrettung' } ],
        '1_normal': [{ id: 0, name: 'Weiterer Klassenraum' }, { id: 1, name: 'Weiterer Klassenraum' }, { id: 2, name: 'Weiterer Klassenraum' }],
        '2_normal': [{ id: 0, name: 'Großwache' }],
        '2_small': [{ id: 0, name: 'Großwache' }],
        '3_normal': [{ id: 0, name: 'Weiterer Klassenraum' }, { id: 1, name: 'Weiterer Klassenraum' }, { id: 2, name: 'Weiterer Klassenraum' }],
        '4_normal': [{ id: 0, name: 'Allgemeine Innere' }, { id: 1, name: 'Allgemeine Chirurgie' }, { id: 2, name: 'Gynäkologie' }, { id: 3, name: 'Urologie' }, { id: 4, name: 'Unfallchirurgie' }, { id: 5, name: 'Neurologie' }, { id: 6, name: 'Neurochirurgie' }, { id: 7, name: 'Kardiologie' }, { id: 8, name: 'Kardiochirurgie' }, { id: 9, name: 'Großkrankenhaus' }],
        '5_normal': [{ id: 0, name: 'Windenrettung' }],
        '6_normal': [ { id: 0, name: '1. Zelle' }, { id: 1, name: '2. Zelle' }, { id: 2, name: '3. Zelle' }, { id: 3, name: '4. Zelle' }, { id: 4, name: '5. Zelle' }, { id: 5, name: '6. Zelle' }, { id: 6, name: '7. Zelle' }, { id: 7, name: '8. Zelle' }, { id: 8, name: '9. Zelle' }, { id: 9, name: '10. Zelle' }, { id: 10, name: 'Diensthundestaffel' }, { id: 11, name: 'Kriminalpolizei' }, { id: 12, name: 'Dienstgruppenleitung' }, { id: 13, name: 'Motorradstaffel' }, { id: 14, name: 'Großwache' }, { id: 15, name: 'Großgewahrsam' } ],
        '6_small': [ { id: 0, name: '1. Zelle' }, { id: 1, name: '2. Zelle' }, { id: 10, name: 'Diensthundestaffel' }, { id: 11, name: 'Kriminalpolizei' }, { id: 12, name: 'Dienstgruppenleitung' }, { id: 13, name: 'Motorradstaffel' } ],
        '8_normal': [{ id: 0, name: 'Weiterer Klassenraum' }, { id: 1, name: 'Weiterer Klassenraum' }, { id: 2, name: 'Weiterer Klassenraum' }],
        '9_normal': [{ id: 0, name: '1. TZ: Bergung/Notinstandsetzung' }, { id: 1, name: '1. TZ: Zugtrupp' }, { id: 2, name: 'Fachgruppe Räumen' }, { id: 3, name: 'Fachgruppe Wassergefahren' }, { id: 4, name: '2. TZ: Bergungsgruppe' }, { id: 5, name: '2. TZ: Bergung/Notinstandsetzung' }, { id: 6, name: '2. TZ: Zugtrupp' }, { id: 7, name: 'Fachgruppe Ortung' }, { id: 8, name: 'Fachgruppe Wasserschaden/Pumpen' }, { id: 9, name: 'Fachgruppe Schwere Bergung' }, { id: 10, name: 'Fachgruppe Elektroversorgung' }, { id: 11, name: 'Ortsverband-Mannschaftstransportwagen' }, { id: 12, name: 'Trupp Unbemannte Luftfahrtsysteme' }, { id: 13, name: 'Fachzug Führung und Kommunikation' }],
        '10_normal': [{ id: 0, name: 'Weiterer Klassenraum' }, { id: 1, name: 'Weiterer Klassenraum' }, { id: 2, name: 'Weiterer Klassenraum' }],
        '11_normal': [ { id: 0, name: '2. Zug der 1. Hundertschaft' }, { id: 1, name: '3. Zug der 1. Hundertschaft' }, { id: 2, name: 'Gefangenenkraftwagen' }, { id: 3, name: 'Wasserwerfer' }, { id: 4, name: 'SEK: 1. Zug' }, { id: 5, name: 'SEK: 2. Zug' }, { id: 6, name: 'MEK: 1. Zug' }, { id: 7, name: 'MEK: 2. Zug' }, { id: 8, name: 'Diensthundestaffel' }, { id: 9, name: 'Reiterstaffel' }, { id: 10, 'name': 'Lautsprecherkraftwagen' } ],
        '12_normal': [{ id: 0, name: 'Führung' }, { id: 1, name: 'Sanitätsdienst' }, { id: 2, name: 'Wasserrettung' }, { id: 3, name: 'Rettungshundestaffel' }, { id: 4, name: 'SEG-Drohne' }, { id: 5, name: 'Betreuungs- und Verpflegungsdienst' }],
        '13_normal': [{ id: 0, name: 'Außenlastbehälter' }, { id: 1, name: 'Windenrettung' }],
        '17_normal': [{ id: 0, name: 'SEK: 1. Zug' }, { id: 1, name: 'SEK: 2. Zug' }, { id: 2, name: 'MEK: 1. Zug' }, { id: 3, name: 'MEK: 2. Zug' }, { id: 4, name: 'Diensthundestaffel' }],
        '24_normal': [{ id: 0, name: 'Zusätzlicher Reiter' }, { id: 1, name: 'Zusätzlicher Reiter' }, { id: 2, name: 'Zusätzlicher Reiter' }, { id: 3, name: 'Zusätzlicher Reiter' }, { id: 4, name: 'Zusätzlicher Reiter' }],
        '25_normal': [{ id: 0, name: 'Höhenrettung' }, { id: 1, name: 'Drohneneinheit' }, { id: 2, name: 'Rettungshundestaffel' }, { id: 3, name: 'Rettungsdienst' }],
        '27_normal': [{ id: 0, name: 'Weiterer Klassenraum' }, { id: 1, name: 'Weiterer Klassenraum' }, { id: 2, name: 'Weiterer Klassenraum' }],
    };
    // #endregion

    // #region Hilfsfunktionen
    const SCRIPT_PREFIX = '[Erweiterungen Schnellbau & EB]';
    let buildingDataCache = null;

    function log(message) { console.log(`${SCRIPT_PREFIX} ${message}`); }
    function error(message) { console.error(`${SCRIPT_PREFIX} ${message}`); }

    function getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }

    function getBuildingInfo() {
        const h1 = document.querySelector("h1[building_type]");
        if (!h1) return null;
        const buildingId = window.location.pathname.split("/")[2];
        const buildingTypeId = parseInt(h1.getAttribute('building_type'), 10);
        const isSmallStation = !!document.querySelector("a[href$='small_expand']");
        const buildingTypeKey = `${buildingTypeId}_${isSmallStation ? 'small' : 'normal'}`;
        return { buildingId, buildingTypeId, buildingTypeKey };
    }

    async function getBuildingData(buildingId) {
        if (buildingDataCache && buildingDataCache.id == buildingId) return buildingDataCache;
        try {
            const response = await fetch('/api/buildings');
            if (!response.ok) throw new Error(`API-Antwort nicht ok: ${response.status}`);
            const buildings = await response.json();
            buildingDataCache = buildings.find(b => b.id == buildingId);
            return buildingDataCache;
        } catch (e) {
            error(`Fehler beim Abrufen der Gebäudedaten via API: ${e.message}`);
            return null;
        }
    }

    function loadSelections() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    }

    function saveSelection(buildingTypeKey, selectedIds) {
        const selections = loadSelections();
        selections[buildingTypeKey] = selectedIds;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    }
    // #endregion

    // #region UI-Erstellung & Modifikation
    function injectCustomCss() {
        const css = `
            .label-build-clickable, .extension-readiness-toggle {
                cursor: pointer;
            }
            .label-build-clickable:hover, .extension-readiness-toggle:hover {
                outline: 2px solid #888 !important;
                outline-offset: 1px;
            }
            .label.extension-selected {
                outline: 2px solid ${SELECTED_OUTLINE_COLOR} !important;
                outline-offset: 1px;
            }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    async function setupUI() {
        const buildingInfo = getBuildingInfo();
        if (!buildingInfo) return;

        const possibleExtensions = manualExtensions[buildingInfo.buildingTypeKey];
        if (!possibleExtensions) return;

        const buildingData = await getBuildingData(buildingInfo.buildingId);
        if (!buildingData) return;

        makeTableInteractive(buildingInfo, possibleExtensions, buildingData);
    }

    function makeTableInteractive(buildingInfo, possibleExtensions, buildingData) {
        const lssmTable = document.getElementById(LSSM_TABLE_ID);
        if (!lssmTable || document.getElementById('extension-builder-button-container')) return;
        log("LSS-Manager Tabelle gefunden. Mache Tabelle interaktiv...");

        const builtExtensionIds = buildingData.extensions.map(ext => ext.type_id);

        const getGroupedIds = (namePart) => possibleExtensions.filter(e => e.name.includes(namePart)).map(e => e.id).sort((a,b)=>a-b);
        const unbuiltAbIds = getGroupedIds('AB-Stellplatz').filter(id => !builtExtensionIds.includes(id));
        const unbuiltAnhaengerIds = getGroupedIds('Anhänger-Stellplatz').filter(id => !builtExtensionIds.includes(id));
        const unbuiltKlassenraumIds = getGroupedIds('Klassenraum').filter(id => !builtExtensionIds.includes(id));
        let abCounter = 0, anhaengerCounter = 0, klassenraumCounter = 0;

        const getBuiltGroupedQueues = (apiCaption) => {
            const relevantExts = buildingData.extensions.filter(ext => ext.caption === apiCaption);
            return {
                enabled: relevantExts.filter(ext => ext.enabled).map(ext => ext.type_id).sort((a, b) => a - b),
                disabled: relevantExts.filter(ext => !ext.enabled).map(ext => ext.type_id).sort((a, b) => a - b)
            };
        };
        const builtQueues = { ab: getBuiltGroupedQueues("Abrollbehälter-Stellplatz"), anhaenger: getBuiltGroupedQueues("Anhänger-Stellplatz"), klassenraum: getBuiltGroupedQueues("Weiterer Klassenraum") };
        const builtCounters = { ab: { enabled: 0, disabled: 0 }, anhaenger: { enabled: 0, disabled: 0 }, klassenraum: { enabled: 0, disabled: 0 } };

        lssmTable.querySelectorAll('tbody > tr').forEach(row => {
            const nameCell = row.cells[0];
            const statusCell = row.cells[1];
            if (!nameCell || !statusCell) return;

            const extensionName = nameCell.textContent.trim();
            const statusSpans = statusCell.querySelectorAll('span.label');

            statusSpans.forEach(span => {
                let extensionId = -1;
                const spanText = span.textContent;

                if (spanText.includes('Noch nicht gebaut')) {
                    const singlePossible = possibleExtensions.find(e => e.name === extensionName);
                    if (singlePossible && !builtExtensionIds.includes(singlePossible.id)) {
                        extensionId = singlePossible.id;
                    } else if (extensionName === 'Abrollbehälter-Stellplatz') {
                        extensionId = unbuiltAbIds[abCounter++];
                    } else if (extensionName === 'Anhänger-Stellplatz') {
                        extensionId = unbuiltAnhaengerIds[anhaengerCounter++];
                    } else if (extensionName === 'Weiterer Klassenraum') {
                        extensionId = unbuiltKlassenraumIds[klassenraumCounter++];
                    }
                    if (typeof extensionId !== 'undefined' && extensionId !== -1) {
                        span.dataset.extensionId = extensionId;
                        span.classList.add('label-build-clickable'); // FIX: Interaktion auf das einzelne Label anwenden
                    }
                } else if (spanText.includes('Einsatzbereit') || spanText.includes('Nicht einsatzbereit')) {
                    span.classList.add('extension-readiness-toggle');
                    const singleBuilt = buildingData.extensions.find(e => e.caption === extensionName);
                    if (singleBuilt) {
                        extensionId = singleBuilt.type_id;
                    } else {
                        const isEnabled = spanText.includes('Einsatzbereit');
                        const stateKey = isEnabled ? 'enabled' : 'disabled';
                        let queue, counter;
                        if (extensionName === 'Abrollbehälter-Stellplatz') { queue = builtQueues.ab; counter = builtCounters.ab; }
                        else if (extensionName === 'Anhänger-Stellplatz') { queue = builtQueues.anhaenger; counter = builtCounters.anhaenger; }
                        else if (extensionName === 'Weiterer Klassenraum') { queue = builtQueues.klassenraum; counter = builtCounters.klassenraum; }
                        if (queue && counter) {
                            extensionId = queue[stateKey][counter[stateKey]++];
                        }
                    }
                    if (typeof extensionId !== 'undefined' && extensionId !== -1) {
                         span.dataset.extensionId = extensionId;
                    }
                }
            });
        });

        // Ein zentraler Event-Listener für alle Klicks in der Tabelle
        lssmTable.addEventListener('click', async (e) => {
            const targetSpan = e.target.closest('span.label');
            if (!targetSpan) return;

            // Logik für das Umschalten der Einsatzbereitschaft
            if (targetSpan.classList.contains('extension-readiness-toggle')) {
                e.stopPropagation();
                const extensionId = targetSpan.dataset.extensionId;
                const buildingId = getBuildingInfo()?.buildingId;
                if (extensionId && buildingId) {
                    targetSpan.textContent = 'Schalte um...';
                    await toggleExtensionReadiness(buildingId, extensionId);
                }
                return;
            }

            // Logik für die Auswahl zum Bauen
            if (targetSpan.classList.contains('label-build-clickable')) {
                targetSpan.classList.toggle('extension-selected');
                updateAndSaveSelectionState(getBuildingInfo()?.buildingTypeKey);
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'extension-builder-button-container';
        buttonContainer.style.paddingTop = '5px';
        buttonContainer.innerHTML = `<button id="build-extensions-btn" class="btn btn-primary"><span class="glyphicon glyphicon-wrench"></span> Ausgewählte Erweiterungen bauen</button><div id="build-status" style="margin-top: 5px; font-weight: bold;"></div>`;

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.gap = '20px';
        lssmTable.parentNode.insertBefore(wrapper, lssmTable);
        wrapper.appendChild(lssmTable);
        wrapper.appendChild(buttonContainer);

        buttonContainer.querySelector('#build-extensions-btn').addEventListener('click', () => handleBuildButtonClick(getBuildingInfo()?.buildingId));

        // Gespeicherte Auswahl wiederherstellen
        const selections = loadSelections();
        const savedSelection = selections[getBuildingInfo()?.buildingTypeKey] || [];
        lssmTable.querySelectorAll('span.label[data-extension-id]').forEach(el => {
            if (el.classList.contains('label-build-clickable')) {
                const id = parseInt(el.dataset.extensionId, 10);
                if(savedSelection.includes(id)) {
                    el.classList.add('extension-selected');
                }
            }
        });
        log("UI erfolgreich integriert.");
    }

    function updateAndSaveSelectionState(buildingTypeKey) {
        if (!buildingTypeKey) return;
        const selectedIds = [];
        document.querySelectorAll('.extension-selected[data-extension-id]').forEach(el => {
            selectedIds.push(parseInt(el.dataset.extensionId, 10));
        });
        saveSelection(buildingTypeKey, selectedIds);
    }
    // #endregion

    // #region Aktionen (Bauen & Umschalten)
    async function toggleExtensionReadiness(buildingId, extensionId) {
        log(`Schalte Einsatzbereitschaft für Erweiterung ${extensionId} in Gebäude ${buildingId} um.`);
        const csrfToken = getCSRFToken();
        if (!csrfToken) { error("CSRF-Token nicht gefunden!"); return; }

        const toggleUrl = `/buildings/${buildingId}/extension_ready/${extensionId}/${buildingId}`;
        try {
            const response = await fetch(toggleUrl, { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } });
            if (!response.ok) throw new Error(`Server-Fehler: ${response.status}`);
            log("Umschalten erfolgreich. Lade Seite neu...");
            setTimeout(() => location.reload(), 250);
        } catch(err) {
            error(`Fehler beim Umschalten der Bereitschaft: ${err.message}`);
            setTimeout(() => location.reload(), 500);
        }
    }

    async function handleBuildButtonClick(buildingId) {
        if (!buildingId) return;
        const buildBtn = document.getElementById('build-extensions-btn');
        const statusSpan = document.getElementById('build-status');
        const selectedElements = document.querySelectorAll('.extension-selected[data-extension-id]');

        if (selectedElements.length === 0) { alert("Bitte wähle zuerst mindestens eine Erweiterung aus."); return; }

        buildBtn.disabled = true;
        const totalToBuild = selectedElements.length;
        statusSpan.textContent = `Starte Bau von ${totalToBuild} Erweiterung(en)...`;

        const extensionIdsToBuild = Array.from(selectedElements).map(el => parseInt(el.dataset.extensionId, 10));

        for (let i = 0; i < extensionIdsToBuild.length; i++) {
            const id = extensionIdsToBuild[i];
            const name = manualExtensions[getBuildingInfo().buildingTypeKey].find(e => e.id === id)?.name || `ID ${id}`;
            statusSpan.textContent = `Baue ${i + 1}/${totalToBuild}: ${name}...`;
            try {
                await buildExtension(buildingId, id);
            } catch (err) {
                statusSpan.textContent = `Fehler beim Bau von ${name}.`;
                error(`Fehler: ${err.message}`);
                alert(`Ein Fehler ist aufgetreten. Details siehe Konsole (F12).`);
                buildBtn.disabled = false;
                return;
            }
        }
        statusSpan.textContent = "Alle Aufträge erledigt. Lade Seite neu...";
        setTimeout(() => location.reload(), 1000);
    }

    async function buildExtension(buildingId, extensionId) {
        const csrfToken = getCSRFToken();
        if (!csrfToken) throw new Error("CSRF-Token nicht gefunden!");
        const buildUrl = `/buildings/${buildingId}/extension/credits/${extensionId}`;
        const response = await fetch(buildUrl, { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } });
        if (!response.ok) throw new Error(`Server-Fehler: ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    // #endregion

    // #region Hauptfunktion
    function initialize() {
        injectCustomCss();
        const observer = new MutationObserver((mutations, obs) => {
             if (document.getElementById(LSSM_TABLE_ID)) {
                 obs.disconnect();
                 setupUI();
             }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    initialize();
    // #endregion

})();