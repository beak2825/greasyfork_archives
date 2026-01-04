// ==UserScript==
// @name         LSS Massen-Kategorisierer v11 (Mit Löschfunktion)
// @namespace    http://tampermonkey.net/
// @version      2025.08.13.11
// @description  Finale, stabile Version mit festem Mapping und einer Funktion zum Entfernen der gesetzten Kategorien.
// @author       Masklin
// @match        https://www.leitstellenspiel.de/*
// @grant        GM_addStyle
// @connect      www.leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/545740/LSS%20Massen-Kategorisierer%20v11%20%28Mit%20L%C3%B6schfunktion%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545740/LSS%20Massen-Kategorisierer%20v11%20%28Mit%20L%C3%B6schfunktion%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Die von dir bereitgestellte Liste, direkt im Code.
    const vehicleNameMapping = {
        '0': 'LF 20', '1': 'LF 10', '2': 'DLK 23', '3': 'ELW 1', '4': 'RW', '5': 'GW-A', '6': 'LF 8/6', '7': 'LF 20/16',
        '8': 'LF 10/6', '9': 'LF 16-TS', '10': 'GW-Öl', '11': 'GW-L2-Wasser', '12': 'GW-Messtechnik', '13': 'SW 1000',
        '14': 'SW 2000', '15': 'SW 2000-Tr', '16': 'SW Kats', '17': 'TLF 2000', '18': 'TLF 3000', '19': 'TLF 8/8',
        '20': 'TLF 8/18', '21': 'TLF 16/24-Tr', '22': 'TLF 16/25', '23': 'TLF 16/45', '24': 'TLF 20/40',
        '25': 'TLF 20/40-SL', '26': 'TLF 16', '27': 'GW-Gefahrgut', '28': 'RTW', '29': 'NEF', '30': 'HLF 20', '31': 'RTH',
        '32': 'FuStW', '33': 'GW-Höhenrettung', '34': 'ELW 2', '35': 'leBefKw', '36': 'MTW', '37': 'TSF-W', '38': 'KTW',
        '39': 'GKW', '40': 'MTW-TZ', '41': 'MzGW (FGr N)', '42': 'LKW K 9', '43': 'BRmG R', '44': 'Anh DLE', '45': 'MLW 5',
        '46': 'WLF', '47': 'AB-Rüst', '48': 'AB-Atemschutz', '49': 'AB-Öl', '50': 'GruKw', '51': 'FüKW (Polizei)',
        '52': 'GefKw', '53': 'Dekon-P', '54': 'AB-Dekon-P', '55': 'KdoW-LNA', '56': 'KdoW-OrgL', '57': 'FwK',
        '58': 'KTW Typ B', '59': 'ELW 1 (SEG)', '60': 'GW-San', '61': 'Polizeihubschrauber', '62': 'AB-Schlauch',
        '63': 'GW-Taucher', '64': 'GW-Wasserrettung', '65': 'LKW 7 Lkr 19 tm', '66': 'Anh MzB', '67': 'Anh SchlB',
        '68': 'Anh MzAB', '69': 'Tauchkraftwagen', '70': 'MZB', '71': 'AB-MZB', '72': 'WaWe 10', '73': 'GRTW',
        '74': 'NAW', '75': 'FLF', '76': 'Rettungstreppe', '77': 'AB-Gefahrgut', '78': 'AB-Einsatzleitung',
        '79': 'SEK - ZF', '80': 'SEK - MTF', '81': 'MEK - ZF', '82': 'MEK - MTF', '83': 'GW-Werkfeuerwehr',
        '84': 'ULF mit Löscharm', '85': 'TM 50', '86': 'Turbolöscher', '87': 'TLF 4000', '88': 'KLF', '89': 'MLF',
        '90': 'HLF 10', '91': 'Rettungshundefahrzeug', '92': 'Anh Hund', '93': 'MTW-O', '94': 'DHuFüKW',
        '95': 'Polizeimotorrad', '96': 'Außenlastbehälter (allgemein)', '97': 'ITW', '98': 'Zivilstreifenwagen',
        '100': 'MLW 4', '101': 'Anh SwPu', '102': 'Anh 7', '103': 'FuStW (DGL)', '104': 'GW-L1', '105': 'GW-L2',
        '106': 'MTF-L', '107': 'LF-L', '108': 'AB-L', '109': 'MzGW SB', '110': 'NEA50', '111': 'NEA50', '112': 'NEA200',
        '113': 'NEA200', '114': 'GW-Lüfter', '115': 'Anh Lüfter', '116': 'AB-Lüfter', '117': 'AB-Tank',
        '118': 'Kleintankwagen', '119': 'AB-Lösch', '120': 'Tankwagen', '121': 'GTLF', '122': 'LKW 7 Lbw (FGr E)',
        '123': 'LKW 7 Lbw (FGr WP)', '124': 'MTW-OV', '125': 'MTW-Tr UL', '126': 'MTF Drohne', '127': 'GW UAS',
        '128': 'ELW Drohne', '129': 'ELW2 Drohne', '130': 'GW-Bt', '131': 'Bt-Kombi', '132': 'FKH', '133': 'Bt LKW',
        '134': 'Pferdetransporter klein', '135': 'Pferdetransporter groß', '136': 'Anh Pferdetransport',
        '137': 'Zugfahrzeug Pferdetransport', '138': 'GW-Verpflegung', '139': 'GW-Küche', '140': 'MTW-Verpflegung',
        '141': 'FKH', '142': 'AB-Küche', '143': 'Anh Schlauch', '144': 'FüKW (THW)', '145': 'FüKomKW', '146': 'Anh FüLa',
        '147': 'FmKW', '148': 'MTW-FGr K', '149': 'GW-Bergrettung (NEF)', '150': 'GW-Bergrettung',
        '151': 'ELW Bergrettung', '152': 'ATV', '153': 'Hundestaffel (Bergrettung)', '154': 'Schneefahrzeug',
        '155': 'Anh Höhenrettung (Bergrettung)', '156': 'Polizeihubschrauber mit verbauter Winde', '157': 'RTH Winde',
        '158': 'GW-Höhenrettung (Bergrettung)', '159': 'Seenotrettungskreuzer', '160': 'Seenotrettungsboot',
        '161': 'Hubschrauber (Seenotrettung)', '162': 'RW-Schiene', '163': 'HLF Schiene', '164': 'AB-Schiene',
        '165': 'LauKw', '166': 'PTLF 4000', '167': 'SLF', '168': 'Anh Sonderlöschmittel',
        '169': 'AB-Sonderlöschmittel', '170': 'AB-Wasser/Schaum', '171': 'GW TeSi', '172': 'LKW Technik (Notstrom)',
        '173': 'MTW TeSi', '174': 'Anh TeSi', '175': 'NEA50'
    };

    GM_addStyle(`
        #massEditModal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5); }
        .modal-content { background-color: #fefefe; margin: 10% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 500px; border-radius: 5px; }
        .modal-content h2 { margin-top: 0; }
        .modal-close { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
        #massEditForm label { display: block; margin-top: 10px; font-weight: bold; }
        #massEditForm select, #massEditForm input[type="text"] { width: 100%; padding: 8px; margin-top: 5px; border-radius: 3px; border: 1px solid #ccc; }
        #vehicleCount { margin-top: 5px; font-style: italic; color: #555; }
        .button-group { display: flex; justify-content: space-between; margin-top: 20px; }
        .button-group button { color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; flex-grow: 1; margin: 0 5px;}
        .button-group button:disabled { background-color: #aaa; cursor: not-allowed; }
        #updateButton { background-color: #4CAF50; }
        #updateButton:hover { background-color: #45a049; }
        #deleteButton { background-color: #f44336; }
        #deleteButton:hover { background-color: #da190b; }
        #status-container { margin-top: 15px; padding: 10px; background-color: #eee; border-radius: 3px; display: none; }
    `);

    function displayVehicleCount() {
        const selectedName = document.getElementById('vehicleTypeSelect').value;
        const countDisplay = document.getElementById('vehicleCount');
        if (!selectedName || !window.allMyVehicles) {
            countDisplay.textContent = '';
            return;
        }
        const count = window.allMyVehicles.filter(v => v.vehicle_type_name === selectedName).length;
        countDisplay.textContent = `Du besitzt ${count} Fahrzeuge dieses Typs.`;
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'massEditModal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" id="modalClose">&times;</span>
                <h2>Fahrzeugklassen Massen-Editor</h2>
                <form id="massEditForm">
                    <label for="vehicleTypeSelect">1. Fahrzeugtyp auswählen:</label>
                    <select id="vehicleTypeSelect" required></select>
                    <div id="vehicleCount"></div>
                    <label for="vehicleTypeCaption">2. Neue "Eigene Fahrzeugklasse" (zum Setzen):</label>
                    <input type="text" id="vehicleTypeCaption" placeholder="z.B. RTW-Reserve, HLF-Sonder">
                    <div style="margin-top: 15px;">
                        <input type="checkbox" id="ignoreDefaultAao" style="margin-right: 5px;">
                        <label for="ignoreDefaultAao" style="display: inline; font-weight: normal;">Nur die eigene Fahrzeugklasse in der AAO verwenden</label>
                    </div>
                    <div class="button-group">
                        <button type="submit" id="updateButton">Kategorie setzen</button>
                        <button type="button" id="deleteButton">Kategorie entfernen</button>
                    </div>
                </form>
                <div id="status-container">
                    <div id="status-message"></div><progress id="status-progress" value="0" max="100" style="width: 100%;"></progress>
                </div>
            </div>`;
        document.body.appendChild(modal);
        document.getElementById('modalClose').addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (event) => (event.target == modal) && (modal.style.display = 'none'));
        document.getElementById('massEditForm').addEventListener('submit', (e) => { e.preventDefault(); runProcess(false); });
        document.getElementById('deleteButton').addEventListener('click', () => runProcess(true));
        document.getElementById('vehicleTypeSelect').addEventListener('change', displayVehicleCount);
    }

    async function populateVehicleTypes() {
        const select = document.getElementById('vehicleTypeSelect');
        select.innerHTML = '<option value="">Lade deine Fahrzeuge...</option>';
        try {
            const vehiclesResponse = await fetch('https://www.leitstellenspiel.de/api/v2/vehicles');
            if (!vehiclesResponse.ok) throw new Error(`API-Antwort: ${vehiclesResponse.status}`);
            const myVehiclesObject = await vehiclesResponse.json();
            if (!myVehiclesObject.result || !Array.isArray(myVehiclesObject.result)) throw new Error("API-Antwort hat nicht das erwartete Format.");

            const myVehicles = myVehiclesObject.result.map(vehicle => ({
                ...vehicle,
                vehicle_type_name: vehicleNameMapping[vehicle.vehicle_type] || `Unbekannter Typ (${vehicle.vehicle_type})`
            }));
            window.allMyVehicles = myVehicles;

            const ownedTypeNames = [...new Set(myVehicles.map(v => v.vehicle_type_name))].sort();

            select.innerHTML = '<option value="" disabled selected>-- Bitte Typ auswählen --</option>';
            ownedTypeNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        } catch (error) {
            select.innerHTML = '<option value="">Fehler!</option>';
            console.error('Fehler beim Laden der Fahrzeuge:', error);
            alert(`Laden der Fahrzeuge fehlgeschlagen: ${error.message}`);
        }
    }

    async function runProcess(isDelete = false) {
        const selectedName = document.getElementById('vehicleTypeSelect').value;
        const newCaption = isDelete ? "" : document.getElementById('vehicleTypeCaption').value.trim();
        const ignoreDefault = isDelete ? false : document.getElementById('ignoreDefaultAao').checked;

        if (!selectedName) {
            alert('Bitte zuerst einen Fahrzeugtyp auswählen.');
            return;
        }

        if (!isDelete && !newCaption) {
            alert('Bitte eine Kategorie zum Setzen eingeben.');
            return;
        }
        
        const vehiclesToUpdate = window.allMyVehicles.filter(v => v.vehicle_type_name === selectedName);
        const authToken = document.querySelector('meta[name="csrf-token"]').content;

        if (vehiclesToUpdate.length === 0) {
            alert('Keine Fahrzeuge dieses Typs gefunden.');
            return;
        }
        
        const updateButton = document.getElementById('updateButton');
        const deleteButton = document.getElementById('deleteButton');
        const statusContainer = document.getElementById('status-container');
        const statusMessage = document.getElementById('status-message');
        const statusBar = document.getElementById('status-progress');
        updateButton.disabled = true;
        deleteButton.disabled = true;
        const actionText = isDelete ? "entfernt" : "gesetzt";
        statusMessage.textContent = `Starte Prozess...`;
        statusContainer.style.display = 'block';

        const total = vehiclesToUpdate.length;
        for (let i = 0; i < total; i++) {
            const vehicle = vehiclesToUpdate[i];
            statusMessage.textContent = `Aktualisiere Fahrzeug ${i + 1} von ${total}: ${vehicle.caption}...`;
            statusBar.value = ((i + 1) / total) * 100;
            const formData = new FormData();
            formData.append('utf8', '✓');
            formData.append('_method', 'patch');
            formData.append('authenticity_token', authToken);
            formData.append('vehicle[vehicle_type_caption]', newCaption);
            formData.append('vehicle[vehicle_type_ignore_default_aao]', ignoreDefault ? '1' : '0');
            try {
                const response = await fetch(`/vehicles/${vehicle.id}`, { method: 'POST', body: formData });
                if (!response.ok) throw new Error(`Serverantwort ${response.status} für Fzg-ID ${vehicle.id}`);
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                statusMessage.textContent = `Fehler! ${error.message}. Prozess abgebrochen.`;
                updateButton.disabled = false;
                deleteButton.disabled = false;
                return;
            }
        }
        statusMessage.textContent = `Fertig! Die Kategorie wurde für ${total} Fahrzeuge erfolgreich ${actionText}.`;
        updateButton.disabled = false;
        deleteButton.disabled = false;
    }

    function init() {
        createModal();
        const navbar = document.querySelector('#main_navbar .navbar-nav');
        if (navbar) {
            const newLi = document.createElement('li');
            const newLink = document.createElement('a');
            newLink.href = '#';
            newLink.textContent = 'Massen-Editor';
            newLink.onclick = (e) => {
                e.preventDefault();
                document.getElementById('massEditModal').style.display = 'block';
                if (document.getElementById('vehicleTypeSelect').options.length <= 1) {
                    populateVehicleTypes();
                }
            };
            newLi.appendChild(newLink);
            navbar.appendChild(newLi);
        }
    }

    init();
})();