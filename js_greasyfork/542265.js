// ==UserScript==
// @name         [LSS] Gebäudegrafik-Manager
// @namespace    BAHendrik
// @version      1.6
// @description  Ermöglicht das massenhafte Hochladen einer individuellen Gebäudegrafik für alle Gebäude eines bestimmten Typs. Mit Bildvergleich.
// @author       BAHendrik & AI
// @license      MIT
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542265/%5BLSS%5D%20Geb%C3%A4udegrafik-Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/542265/%5BLSS%5D%20Geb%C3%A4udegrafik-Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let allBuildingsData = [];
    let newImageFileName = null;
    const placeholder_image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const buildingTypeMapping = {
        0: 'Feuerwache', 1: 'Feuerwehrschule', 2: 'Rettungswache', 3: 'Rettungsschule',
        4: 'Krankenhaus', 5: 'Rettungshubschrauber-Station', 6: 'Polizeiwache', 7: 'Leitstelle',
        8: 'Polizeischule', 9: 'THW', 10: 'THW Bundesschule', 11: 'Bereitschaftspolizei',
        12: 'Schnelleinsatzgruppe (SEG)', 13: 'Polizeihubschrauberstation', 14: 'Bereitstellungsraum',
        15: 'Wasserrettung', 16: 'Verbandszellen', 17: 'Polizei-Sondereinheiten',
        18: 'Feuerwache (Kleinwache)', 19: 'Polizeiwache (Kleinwache)', 20: 'Rettungswache (Kleinwache)',
        21: 'Rettungshundestaffel', 22: 'Großer Komplex', 23: 'Kleiner Komplex', 24: 'Reiterstaffel',
        25: 'Bergrettungswache', 26: 'Seenotrettungswache', 27: 'Schule für Seefahrt und Seenotrettung',
        28: 'Hubschrauberstation (Seenotrettung)',
    };

    function addMenuButton() {
        const menu = document.querySelector('#menu_profile + .dropdown-menu');
        if (!menu) return;
        const newLi = document.createElement('li');
        newLi.innerHTML = `<a href="#" id="open-graphic-manager"><span class="glyphicon glyphicon-picture"></span> Gebäudegrafik-Manager</a>`;
        menu.appendChild(newLi);
        document.getElementById('open-graphic-manager').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('graphic-manager-modal').style.display = 'flex';
            if (allBuildingsData.length === 0) populateBuildingTypes();
        });
    }

    function createUI() {
        const modal = document.createElement('div');
        modal.id = 'graphic-manager-modal';
        modal.style.cssText = `
            display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%;
            overflow: auto; background-color: rgba(0,0,0,0.5); align-items: center; justify-content: center;
        `;
        modal.innerHTML = `
            <div id="graphic-manager-content" style="background-color: #fefefe; color: #000; padding: 20px; border: 1px solid #888; width: 80%; max-width: 600px; border-radius: 8px;">
                <span id="graphic-manager-close" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                <h2>Gebäudegrafik-Manager</h2>
                <hr>
                <div class="form-group">
                    <label>1. Gebäudetyp auswählen:</label>
                    <select id="building-type-select" class="form-control"></select>
                </div>
                <div class="form-group">
                    <label>2. NEUE PNG-Grafik auswählen:</label>
                    <input type="file" id="image-file-input" class="form-control" accept=".png">
                </div>
                <div class="form-group" style="text-align: center;">
                    <img id="image-preview" src="" alt="Bildvorschau" style="display: none; max-width: 100%; max-height: 150px; margin-top: 10px; border: 1px solid #ddd; padding: 4px; border-radius: 4px;">
                </div>
                <div class="form-group">
                    <label>3. Zu aktualisierende Gebäude:</label>
                    <div class="form-group">
                        <input type="text" id="building-search-input" class="form-control" placeholder="Wachen durchsuchen...">
                    </div>
                     <div class="d-flex justify-content-between" style="padding: 5px; border-bottom: 1px solid #ccc; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            <input type="checkbox" id="select-all-checkbox" checked>
                            <label for="select-all-checkbox" style="font-weight: bold; margin-left: 5px;">Alle auswählen / abwählen</label>
                        </span>
                        <button id="compare-images-button" class="btn btn-default btn-xs" disabled>Gleiche Bilder abwählen</button>
                    </div>
                    <div id="affected-buildings-list" style="height: 200px; overflow-y: scroll; background-color: #f0f0f0; border: 1px solid #ccc; padding: 10px; border-radius: 4px; font-size: 0.9em;">
                        Bitte einen Gebäudetyp auswählen...
                    </div>
                </div>
                <button id="start-upload-button" class="btn btn-success" style="width: 100%; margin-top: 15px;">4. Upload für ausgewählte Wachen starten</button>
                <hr>
                <h4>Fortschritt:</h4>
                <div id="progress-log" style="height: 100px; overflow-y: scroll; background-color: #333; color: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 4px; font-family: monospace; white-space: pre-wrap;"></div>
            </div>
        `;
        document.body.appendChild(modal);
        setupEventListeners();
    }

    function setupEventListeners() {
        document.getElementById('graphic-manager-close').addEventListener('click', () => document.getElementById('graphic-manager-modal').style.display = 'none');
        document.getElementById('start-upload-button').addEventListener('click', startProcess);
        document.getElementById('building-type-select').addEventListener('change', updateAffectedBuildingsList);
        document.getElementById('image-file-input').addEventListener('change', updateImagePreview);
        document.getElementById('select-all-checkbox').addEventListener('change', toggleAllCheckboxes);
        document.getElementById('affected-buildings-list').addEventListener('change', syncSelectAllCheckbox);
        document.getElementById('building-search-input').addEventListener('input', filterBuildingList);
        document.getElementById('compare-images-button').addEventListener('click', compareAndDeselect);
    }

    async function populateBuildingTypes() {
        logProgress('Lade Gebäudeliste...');
        const select = document.getElementById('building-type-select');
        select.innerHTML = '<option>Lade...</option>';
        try {
            const response = await fetch('/api/buildings');
            if (!response.ok) throw new Error(`Server antwortete mit Status ${response.status}`);
            allBuildingsData = await response.json();
            if (!Array.isArray(allBuildingsData)) throw new Error("API-Antwort ist kein gültiges Array.");
            const uniqueBuildingTypes = [...new Set(allBuildingsData.map(b => b.building_type))].sort((a, b) => a - b);
            select.innerHTML = '';
            uniqueBuildingTypes.forEach(typeId => {
                const isSmall = allBuildingsData.find(b => b.building_type === typeId)?.small_building;
                let typeKey = typeId;
                if (typeId === 0 && isSmall) typeKey = 18; if (typeId === 6 && isSmall) typeKey = 19; if (typeId === 2 && isSmall) typeKey = 20;
                const name = buildingTypeMapping[typeKey] || `Unbekannter Typ (${typeId})`;
                const option = document.createElement('option'); option.value = typeId; option.textContent = name; select.appendChild(option);
            });
            logProgress('Bereit.');
            updateAffectedBuildingsList();
        } catch (error) {
            logProgress('FEHLER beim Laden der Gebäude: ' + error.message);
            select.innerHTML = '<option>Fehler beim Laden!</option>';
        }
    }

    function updateAffectedBuildingsList() {
        const listDiv = document.getElementById('affected-buildings-list');
        const searchInput = document.getElementById('building-search-input');
        const selectedTypeId = parseInt(document.getElementById('building-type-select').value, 10);
        searchInput.value = '';
        if (isNaN(selectedTypeId)) { listDiv.textContent = 'Bitte einen Gebäudetyp auswählen...'; return; }

        // GEÄNDERT: Fügt eine Sortierung nach dem Gebäudenamen hinzu
        const filteredBuildings = allBuildingsData
            .filter(b => b.building_type === selectedTypeId)
            .sort((a, b) => a.caption.toLowerCase().localeCompare(b.caption.toLowerCase()));

        if (filteredBuildings.length === 0) { listDiv.innerHTML = 'Keine Gebäude dieses Typs gefunden.'; }
        else {
            listDiv.innerHTML = filteredBuildings.map(b => {
                const imageUrl = b.custom_icon_url || placeholder_image;
                return `
                    <div class="building-list-item" style="display: flex; align-items: center; padding: 4px 0; border-bottom: 1px solid #e0e0e0;">
                        <input type="checkbox" class="building-checkbox" data-building-id="${b.id}" id="building-${b.id}" checked style="margin-right: 10px;">
                        <img class="current-building-graphic" src="${imageUrl}" style="width: 40px; height: 40px; margin-right: 10px; border: 1px solid #ccc; background-color: #fff;">
                        <label for="building-${b.id}" style="font-weight: normal;">${b.caption}</label>
                    </div>
                `;
            }).join('');
        }
        document.getElementById('select-all-checkbox').checked = true;
    }

    function filterBuildingList(event) {
        const searchTerm = event.target.value.toLowerCase();
        document.querySelectorAll('.building-list-item').forEach(item => {
            const buildingName = item.querySelector('label').textContent.toLowerCase();
            item.style.display = buildingName.includes(searchTerm) ? 'flex' : 'none';
        });
    }

    function toggleAllCheckboxes(event) {
        document.querySelectorAll('.building-checkbox').forEach(checkbox => checkbox.checked = event.target.checked);
    }

    function syncSelectAllCheckbox(event) {
        if (event.target.matches('.building-checkbox')) {
            document.getElementById('select-all-checkbox').checked = [...document.querySelectorAll('.building-checkbox')].every(checkbox => checkbox.checked);
        }
    }

    function updateImagePreview(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('image-preview');
        const compareBtn = document.getElementById('compare-images-button');
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                newImageFileName = file.name;
                preview.style.display = 'block';
                compareBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = ''; newImageFileName = null;
            preview.style.display = 'none';
            compareBtn.disabled = true;
        }
    }

    function compareAndDeselect() {
        if (!newImageFileName) return alert("Bitte zuerst eine neue Grafik auswählen.");
        const compareBtn = document.getElementById('compare-images-button');
        compareBtn.disabled = true;
        compareBtn.textContent = 'Vergleiche...';
        logProgress("Starte Dateinamen-Vergleich...");
        let deselectedCount = 0;
        document.querySelectorAll('.building-list-item').forEach(item => {
            const checkbox = item.querySelector('.building-checkbox');
            const currentImgElement = item.querySelector('.current-building-graphic');
            if (item.style.display !== 'none' && checkbox.checked) {
                const buildingName = item.querySelector('label').textContent;
                const currentImgUrl = currentImgElement.src;
                if (currentImgUrl && currentImgUrl.includes(newImageFileName)) {
                    checkbox.checked = false;
                    deselectedCount++;
                    logProgress(`"${buildingName}": Bildname ist identisch. Abgewählt.`);
                }
            }
        });
        logProgress(`Vergleich abgeschlossen. ${deselectedCount} Gebäude abgewählt.`);
        compareBtn.disabled = false;
        compareBtn.textContent = 'Gleiche Bilder abwählen';
        syncSelectAllCheckbox({target: document.querySelector('.building-checkbox')});
    }

    async function startProcess() {
        const startButton = document.getElementById('start-upload-button');
        const selectedFile = document.getElementById('image-file-input').files[0];
        const selectedCheckboxes = document.querySelectorAll('.building-checkbox:checked');
        const selectedBuildingIds = [...selectedCheckboxes].map(cb => parseInt(cb.dataset.buildingId, 10));
        const delay = 100;

        if (selectedBuildingIds.length === 0) return alert('Bitte mindestens ein Gebäude auswählen.');
        if (!selectedFile) return alert('Bitte eine gültige .png-Datei auswählen.');

        startButton.disabled = true;
        startButton.textContent = 'Arbeite...';
        logProgress('Prozess gestartet...');
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            if (!csrfToken) throw new Error('Authentifizierungs-Token nicht gefunden.');
            const buildingsToUpdate = allBuildingsData.filter(b => selectedBuildingIds.includes(b.id));

            for (let i = 0; i < buildingsToUpdate.length; i++) {
                const building = buildingsToUpdate[i];
                logProgress(`[${i + 1}/${buildingsToUpdate.length}] Bearbeite "${building.caption}"...`);
                const formData = new FormData();
                formData.append('authenticity_token', csrfToken);
                formData.append('_method', 'put');
                formData.append('building[image]', selectedFile, selectedFile.name);

                try {
                    const response = await fetch(`/buildings/${building.id}`, { method: 'POST', body: formData });
                    if (!response.ok) {
                        logProgress(`FEHLER bei "${building.caption}" (Status: ${response.status})`);
                    } else {
                        logProgress(`ERFOLG bei "${building.caption}".`);
                    }
                } catch (error) {
                    logProgress(`NETZWERKFEHLER bei "${building.caption}": ${error.message}`);
                }
                if (i < buildingsToUpdate.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            logProgress('\nAlle Aufgaben erledigt!');
            alert('Der Prozess wurde für alle ausgewählten Gebäude abgeschlossen!');
        } catch (error) {
            logProgress('Ein unerwarteter Fehler ist aufgetreten: ' + error.message);
            alert('Ein Fehler ist aufgetreten. Siehe Log im Manager-Fenster für Details.');
        } finally {
            startButton.disabled = false;
            startButton.textContent = '4. Upload für ausgewählte Wachen starten';
        }
    }

    function logProgress(message) {
        const logDiv = document.getElementById('progress-log');
        const timestamp = new Date().toLocaleTimeString();
        logDiv.innerHTML += `[${timestamp}] ${message}\n`;
        logDiv.scrollTop = logDiv.scrollHeight;
    }
    
    createUI();
    addMenuButton();

})();