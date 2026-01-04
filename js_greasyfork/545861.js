// ==UserScript==
// @name         LSS Grafikset-Manager
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  Fügt einen Button im Spielermenü hinzu, um ausgewählten Wachen (filterbar nach Name, Typ, Leitstelle & Grafikset-Name) ein Grafikset zuzuweisen. Robusteres Laden der Set-Liste.
// @author       Gemini & User-Input
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545861/LSS%20Grafikset-Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/545861/LSS%20Grafikset-Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CACHES & KONSTANTEN ---
    let buildingsCache = [];
    let graphicSetsCache = [];
    let leitstellenCache = [];

    const LEITSTELLEN_TYPES = [7]; // Nur Gebäudetyp 7 ist eine Leitstelle

    const BUILDING_TYPE_MAP = {
        0: "Feuerwache", 1: "Feuerwehrschule", 2: "Rettungswache", 3: "Rettungsschule", 4: "Krankenhaus",
        5: "Rettungshubschrauber-Station", 6: "Polizeiwache", 7: "Leitstelle", 8: "Polizeischule", 9: "THW",
        10: "THW Bundesschule", 11: "Bereitschaftspolizei", 12: "Schnelleinsatzgruppe (SEG)", 13: "Polizeihubschrauberstation",
        14: "Bereitstellungsraum", 15: "Wasserrettung", 17: "Polizei-Sondereinheiten", 18: "Feuerwache (Kleinwache)",
        19: "Polizeiwache (Kleinwache)", 20: "Rettungswache (Kleinwache)", 21: "Rettungshundestaffel",
        24: "Reiterstaffel", 25: "Bergrettungswache", 26: "Seenotrettungswache", 27: "Schule für Seefahrt und Seenotrettung",
        28: "Hubschrauberstation (Seenotrettung)"
    };

    // --- HILFSFUNKTIONEN ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- DATENABRUF ---
    async function fetchBuildings() {
        if (buildingsCache.length > 0) return;
        const response = await fetch('/api/buildings');
        if (!response.ok) throw new Error("Wachenliste konnte nicht geladen werden.");
        buildingsCache = await response.json();
    }

    function extractLeitstellenFromCache() {
        if (leitstellenCache.length > 0) return leitstellenCache;

        const leitstellenMap = new Map();
        const allLeitstellenBuildings = buildingsCache.filter(b => LEITSTELLEN_TYPES.includes(b.building_type));

        for (const lst of allLeitstellenBuildings) {
            leitstellenMap.set(lst.id, lst.caption);
        }
        const usedLeitstellenIds = [...new Set(buildingsCache.map(b => b.leitstelle_building_id).filter(id => id))];
        const leitstellen = usedLeitstellenIds.map(id => ({
            id: id,
            name: leitstellenMap.get(id) || `Unbekannte LST (${id})`
        }));

        leitstellen.sort((a, b) => a.name.localeCompare(b.name));
        leitstellenCache = leitstellen;
        return leitstellenCache;
    }


    async function fetchAndParseGraphicSets() {
        if (graphicSetsCache.length > 0) return graphicSetsCache;
        if (buildingsCache.length === 0) await fetchBuildings();
        if (buildingsCache.length === 0) throw new Error("Du besitzt keine Gebäude, um die Grafikset-Liste auszulesen.");

        console.log("Starte Suche nach einer geeigneten Wache zum Auslesen der Grafiksets...");
        for (const building of buildingsCache) {
            try {
                const response = await fetch(`/buildings/${building.id}/edit`);
                if (!response.ok) {
                    console.log(`Versuch bei Wache ${building.id} (${building.caption}) fehlgeschlagen (Status: ${response.status}). Versuche nächste...`);
                    continue;
                }

                const htmlText = await response.text();
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                const setLinks = doc.querySelectorAll('a.graphic_set_change');

                if (setLinks.length > 1) { // Mehr als nur "-Keine-"
                    console.log(`Erfolgreich! Grafiksets von Wache ${building.id} (${building.caption}) ausgelesen.`);
                    const sets = Array.from(setLinks)
                        .map(a => ({ id: a.getAttribute('vehicle_graphic_set_id'), name: a.getAttribute('caption') }))
                        .filter(s => s.id !== "");

                    sets.sort((a, b) => a.name.localeCompare(b.name));
                    graphicSetsCache = sets;
                    return graphicSetsCache;
                } else {
                     console.log(`Wache ${building.id} (${building.caption}) hat keine Grafikset-Liste. Versuche nächste...`);
                }
            } catch (error) {
                console.error(`Fehler bei Wache ${building.id} (${building.caption}):`, error);
            }
        }

        // Wenn die Schleife durchläuft, ohne etwas zu finden
        throw new Error("Konnte bei keiner deiner Wachen eine Grafikset-Liste finden.");
    }

    // --- UI-LOGIK ---
    function populateBuildingList() {
        const nameFilter = document.getElementById('lss-gsa-filter-name').value.toLowerCase();
        const typeFilter = document.getElementById('lss-gsa-filter-type').value;
        const lstFilter = document.getElementById('lss-gsa-filter-lst').value;
        const buildingList = document.getElementById('lss-gsa-building-list');

        let filteredBuildings = buildingsCache.filter(b => !LEITSTELLEN_TYPES.includes(b.building_type));

        if (nameFilter) {
            filteredBuildings = filteredBuildings.filter(b => b.caption.toLowerCase().includes(nameFilter));
        }
        if (typeFilter !== 'all') {
            filteredBuildings = filteredBuildings.filter(b => b.building_type == typeFilter);
        }
        if (lstFilter !== 'all') {
            filteredBuildings = filteredBuildings.filter(b => b.leitstelle_building_id == lstFilter);
        }

        buildingList.innerHTML = filteredBuildings.map(b => `
            <div>
                <input type="checkbox" id="building_${b.id}" value="${b.id}" data-name="${b.caption.replace(/"/g, '&quot;')}">
                <label for="building_${b.id}">${b.caption}</label>
            </div>
        `).join('') || '<div style="text-align: center; color: #888;">Keine Wachen für diesen Filter gefunden.</div>';
    }

    function populateGraphicSetList() {
        const setFilter = document.getElementById('lss-gsa-filter-set').value.toLowerCase();
        const setSelect = document.getElementById('lss-gsa-set-select');
        const filteredSets = graphicSetsCache.filter(s => s.name.toLowerCase().includes(setFilter));

        setSelect.innerHTML = '<option value="">-- Bitte Grafikset wählen --</option>' + filteredSets
            .map(s => `<option value="${s.id}">${s.name}</option>`)
            .join('');
    }

    async function openModal() {
        const modal = document.getElementById('lss-gsa-modal');
        const buildingList = document.getElementById('lss-gsa-building-list');
        const setSelect = document.getElementById('lss-gsa-set-select');
        const typeFilterSelect = document.getElementById('lss-gsa-filter-type');
        const lstFilterSelect = document.getElementById('lss-gsa-filter-lst');
        const log = document.getElementById('lss-gsa-log');
        const statusDiv = document.getElementById('lss-gsa-status');


        modal.style.display = 'flex';
        log.innerHTML = '';
        statusDiv.innerText = 'Lade Daten...';
        buildingList.innerHTML = '';
        setSelect.innerHTML = '<option>...</option>';
        typeFilterSelect.innerHTML = '<option>...</option>';
        lstFilterSelect.innerHTML = '<option>...</option>';
        document.getElementById('lss-gsa-filter-name').value = '';
        document.getElementById('lss-gsa-filter-set').value = '';


        try {
            statusDiv.innerText = 'Lade Gebäudeliste...';
            await fetchBuildings();

            statusDiv.innerText = 'Lade Grafiksets...';
            const graphicSetsPromise = fetchAndParseGraphicSets();

            const leitstellen = extractLeitstellenFromCache();
            await graphicSetsPromise;

            statusDiv.innerText = 'Filter und Listen werden erstellt...';

            const usedTypes = [...new Set(buildingsCache.map(b => b.building_type).filter(t => !LEITSTELLEN_TYPES.includes(t)))];
            typeFilterSelect.innerHTML = '<option value="all">-- Alle Typen --</option>' + usedTypes
                .map(typeId => ({ id: typeId, name: BUILDING_TYPE_MAP[typeId] || `Typ ${typeId}` }))
                .sort((a,b) => a.name.localeCompare(b.name))
                .map(type => `<option value="${type.id}">${type.name}</option>`)
                .join('');

            lstFilterSelect.innerHTML = '<option value="all">-- Alle Leitstellen --</option>' + leitstellen
                .map(lst => `<option value="${lst.id}">${lst.name}</option>`)
                .join('');

            populateGraphicSetList();
            populateBuildingList();
            statusDiv.innerText = 'Bereit.';

        } catch (error) {
            statusDiv.innerHTML = `<span style="color: red;">Fehler: ${error.message}</span>`;
            console.error("Fehler im Grafikset-Manager:", error);
        }
    }

    function closeModal() {
        document.getElementById('lss-gsa-modal').style.display = 'none';
    }


    // --- KERNPROZESS ---
    async function startUpdateProcess() {
        const log = document.getElementById('lss-gsa-log');
        const assignBtn = document.getElementById('lss-gsa-assign-btn');
        const closeBtn = document.getElementById('lss-gsa-close-btn');

        log.innerHTML = '';
        assignBtn.disabled = true;
        closeBtn.disabled = true;

        const selectedSetId = document.getElementById('lss-gsa-set-select').value;
        const checkedBuildings = Array.from(document.querySelectorAll('#lss-gsa-building-list input[type="checkbox"]:checked'))
            .map(cb => ({ id: cb.value, name: cb.dataset.name }));

        if (!selectedSetId) {
            log.innerHTML = '<span style="color: red;">Fehler: Kein Grafikset ausgewählt.</span>';
        } else if (checkedBuildings.length === 0) {
            log.innerHTML = '<span style="color: red;">Fehler: Keine Wachen ausgewählt.</span>';
        } else {
            let count = 0, successCount = 0, errorCount = 0;
            log.innerHTML = `Starte Zuweisung für ${checkedBuildings.length} Wachen...\n`;

            for (const building of checkedBuildings) {
                count++;
                log.innerHTML += `(${count}/${checkedBuildings.length}) >> Bearbeite "${building.name}"...\n`;
                log.scrollTop = log.scrollHeight;

                try {
                    const editResponse = await fetch(`/buildings/${building.id}/edit`);
                    if (!editResponse.ok) throw new Error(`Edit-Seite nicht erreichbar (Status: ${editResponse.status})`);
                    const editText = await editResponse.text();
                    const doc = new DOMParser().parseFromString(editText, 'text/html');
                    const form = doc.querySelector(`form#edit_building_${building.id}`);
                    if (!form) throw new Error("Formular auf der Edit-Seite nicht gefunden.");

                    const formData = new FormData(form);
                    formData.set('building[vehicle_graphic_id]', selectedSetId);

                    const updateResponse = await fetch(`/buildings/${building.id}`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (updateResponse.ok) {
                        successCount++;
                         log.innerHTML += `   - ✅ Erfolgreich gespeichert.\n`;
                    } else {
                        throw new Error(`Speichern fehlgeschlagen (Status: ${updateResponse.status})`);
                    }
                } catch (e) {
                    errorCount++;
                    log.innerHTML += `<span style="color: red;">   - ❌ Fehler: ${e.message}</span>\n`;
                }
                log.scrollTop = log.scrollHeight;
                await sleep(1000);
            }
            log.innerHTML += `\n🎉 Fertig! ${successCount} erfolgreich, ${errorCount} fehlerhaft.\nBitte die Seite neu laden, um Änderungen zu sehen.`;
            log.scrollTop = log.scrollHeight;
        }

        assignBtn.disabled = false;
        closeBtn.disabled = false;
    }


    // --- UI-ERSTELLUNG UND INITIALISIERUNG ---
    function setupUI() {
        const styles = `
            #lss-gsa-modal { display: none; justify-content: center; align-items: center; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); }
            #lss-gsa-content { background-color: #f4f4f4; color: #333; padding: 20px; border-radius: 5px; width: 90%; max-width: 800px; height: 90%; max-height: 700px; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
            #lss-gsa-content h2 { margin-top: 0; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            #lss-gsa-status { font-style: italic; color: #555; height: 20px; }
            #lss-gsa-filters { display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 5px 10px; align-items: center; margin-bottom: 10px; font-size: 12px; }
            #lss-gsa-filters label { font-weight: bold; }
            #lss-gsa-filters select, #lss-gsa-filters input { padding: 4px; width: 100%; box-sizing: border-box; }
            #lss-gsa-building-list { border: 1px solid #ccc; background: white; padding: 10px; overflow-y: auto; flex-grow: 1; margin: 10px 0; font-size: 13px; }
            #lss-gsa-building-list div { display: flex; align-items: center; padding: 2px 0; }
            #lss-gsa-building-list input { margin-right: 8px; }
            #lss-gsa-controls { display: flex; gap: 10px; align-items: center; }
            #lss-gsa-set-select { flex-grow: 1; padding: 5px; }
            #lss-gsa-log { background-color: #222; color: #eee; font-family: monospace; font-size: 12px; padding: 10px; border-radius: 3px; height: 120px; overflow-y: auto; white-space: pre-wrap; margin: 10px 0; }
            #lss-gsa-footer { margin-top: auto; text-align: right; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const modalHTML = `
            <div id="lss-gsa-modal">
                <div id="lss-gsa-content">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h2>Grafikset-Manager</h2>
                        <div id="lss-gsa-status"></div>
                    </div>
                    <div id="lss-gsa-filters">
                        <label for="lss-gsa-filter-name">Filter Wachenname:</label>
                        <input type="text" id="lss-gsa-filter-name" placeholder="Namensteil eingeben...">
                        <label for="lss-gsa-filter-type">Filter Wachentyp:</label>
                        <select id="lss-gsa-filter-type"></select>
                        <label for="lss-gsa-filter-lst">Filter Leitstelle:</label>
                        <select id="lss-gsa-filter-lst"></select>
                    </div>
                    <div>
                        <input type="checkbox" id="lss-gsa-select-all">
                        <label for="lss-gsa-select-all"><strong>Alle angezeigten Wachen auswählen / abwählen</strong></label>
                    </div>
                    <div id="lss-gsa-building-list"></div>
                    <div id="lss-gsa-filters" style="grid-template-columns: auto 1fr;">
                         <label for="lss-gsa-filter-set">Filter Grafikset:</label>
                         <input type="text" id="lss-gsa-filter-set" placeholder="Namensteil eingeben...">
                    </div>
                    <div id="lss-gsa-controls">
                        <select id="lss-gsa-set-select" size="5" style="width:100%"></select>
                    </div>
                     <div id="lss-gsa-footer">
                        <button id="lss-gsa-assign-btn" class="btn btn-success">Ausgewähltes Set zuweisen</button>
                        <button id="lss-gsa-close-btn" class="btn btn-danger">Schließen</button>
                    </div>
                    <pre id="lss-gsa-log"></pre>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Event Listeners
        document.getElementById('lss-gsa-assign-btn').addEventListener('click', startUpdateProcess);
        document.getElementById('lss-gsa-close-btn').addEventListener('click', closeModal);
        document.getElementById('lss-gsa-modal').addEventListener('click', (e) => e.target.id === 'lss-gsa-modal' && closeModal());
        document.getElementById('lss-gsa-select-all').addEventListener('change', (e) => {
            document.querySelectorAll('#lss-gsa-building-list input[type="checkbox"]').forEach(cb => cb.checked = e.target.checked);
        });
        document.getElementById('lss-gsa-filter-name').addEventListener('input', populateBuildingList);
        document.getElementById('lss-gsa-filter-type').addEventListener('change', populateBuildingList);
        document.getElementById('lss-gsa-filter-lst').addEventListener('change', populateBuildingList);
        document.getElementById('lss-gsa-filter-set').addEventListener('input', populateGraphicSetList);
    }

    function createMenuButton() {
        const anchorElement = document.getElementById('graphic_packs');
        if (!anchorElement) {
            console.error("Grafikset-Manager: Konnte den Menüpunkt 'Grafikset' nicht finden, um den Button anzuhängen.");
            return;
        }

        const newLi = document.createElement('li');
        newLi.setAttribute('role', 'presentation');

        const newA = document.createElement('a');
        newA.href = "#";
        // Verwenden eines anderen, passenderen Icons (Glyphicon)
        newA.innerHTML = `<span class="glyphicon glyphicon-wrench" aria-hidden="true"></span> Grafikset-Manager`;
        newA.style.cursor = "pointer";
        newLi.appendChild(newA);

        newLi.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });

        anchorElement.insertAdjacentElement('afterend', newLi);
    }

    // --- Skriptstart ---
    setupUI();
    createMenuButton();

})();