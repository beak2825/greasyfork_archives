// ==UserScript==
// @name         LSS - Feuerwehrleute per Regler auswählen
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Fügt ein UI-Element zur Personalauswahl hinzu und zeigt die Gesamtpersonalstärke pro Status an.
// @author       Hendrik & Gemini
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546582/LSS%20-%20Feuerwehrleute%20per%20Regler%20ausw%C3%A4hlen.user.js
// @updateURL https://update.greasyfork.org/scripts/546582/LSS%20-%20Feuerwehrleute%20per%20Regler%20ausw%C3%A4hlen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- KONFIGURATION ---
    const MAX_RELOAD_ATTEMPTS = 15;
    const RELOAD_WAIT_MS = 2000;
    const STORAGE_KEY = 'lss_personnel_slider_value';

    // --- DATEN-MAPPINGS ---
    const PERSONNEL_TO_VEHICLE_MAPPING = {
        'Feuerwehrleute': {
            'HLF 20': 9, 'HLF 10': 9, 'LF 20': 9, 'LF 10': 9, 'DLK 23': 3, 'LF 8/6': 9,
            'LF 20/16': 9, 'LF 10/6': 9, 'LF 16-TS': 9, 'TLF 2000': 3, 'TLF 3000': 3,
            'TLF 8/8': 3, 'TLF 8/18': 3, 'TLF 16/24-Tr': 3, 'TLF 16/25': 6, 'TLF 16/45': 3,
            'TLF 20/40': 3, 'TLF 20/40-SL': 3, 'TLF 16': 3, 'GW-A': 3, 'RW': 3, 'TSF-W': 6,
            'KLF': 6, 'MLF': 6, 'MTW': 9, 'GW-Messtechnik': 3, 'GW-Gefahrgut': 3, 'GW-Öl': 3,
            'FLF': 3, 'ULF mit Löscharm': 3, 'TLF 4000': 3, 'PTLF 4000': 2, 'SLF': 2, 'GTLF': 3,
            'MTF Drohne': 5, 'AB-Einsatzleitung': 0, 'Rettungstreppe': 2, 'GW-Bergrettung': 6,
            'GW-L2-Wasser': 3, 'SW 1000': 3, 'SW 2000': 6, 'SW 2000-Tr': 3, 'SW Kats': 3,
            'FwK': 2, 'Dekon-P': 6, 'GW-Höhenrettung': 9, 'GW-Taucher': 2, 'GW-Wasserrettung': 6,
            'GW-Werkfeuerwehr': 9, 'TM 50': 3, 'Turbolöscher': 3, 'MTF-L': 6, 'GW-L1': 6,
            'GW-L2': 6, 'GW-Lüfter': 2, 'HLF Schiene': 9, 'RW-Schiene': 3
        }
    };

    const LSS_VEHICLE_TYPE_DEFINITIONS = [
        { id: '0', name: 'LF 20' }, { id: '1', name: 'LF 10' }, { id: '2', name: 'DLK 23' }, { id: '3', name: 'ELW 1' },
        { id: '4', name: 'RW' }, { id: '5', name: 'GW-A' }, { id: '6', name: 'LF 8/6' },
        { id: '7', name: 'LF 20/16' }, { id: '8', name: 'LF 10/6' }, { id: '9', name: 'LF 16-TS' },
        { id: '10', name: 'GW-Öl' }, { id: '11', name: 'GW-L2-Wasser' }, { id: '12', name: 'GW-Messtechnik' },
        { id: '13', name: 'SW 1000' }, { id: '14', name: 'SW 2000' }, { id: '15', name: 'SW 2000-Tr' },
        { id: '16', name: 'SW Kats' }, { id: '17', name: 'TLF 2000' }, { id: '18', name: 'TLF 3000' },
        { id: '19', name: 'TLF 8/8' }, { id: '20', name: 'TLF 8/18' }, { id: '21', name: 'TLF 16/24-Tr' },
        { id: '22', name: 'TLF 16/25' }, { id: '23', name: 'TLF 16/45' }, { id: '24', name: 'TLF 20/40' },
        { id: '25', name: 'TLF 20/40-SL' }, { id: '26', name: 'TLF 16' }, { id: '27', name: 'GW-Gefahrgut' },
        { id: '30', name: 'HLF 20' }, { id: '32', name: 'FuStW' }, { id: '33', name: 'GW-Höhenrettung' },
        { id: '36', name: 'MTW' }, { id: '37', name: 'TSF-W' }, { id: '53', name: 'Dekon-P' },
        { id: '57', name: 'FwK' },{ id: '75', name: 'FLF' }, { id: '76', name: 'Rettungstreppe' },
        { id: '83', name: 'GW-Werkfeuerwehr' }, { id: '84', name: 'ULF mit Löscharm' }, { id: '85', name: 'TM 50' },
        { id: '86', name: 'Turbolöscher' }, { id: '87', name: 'TLF 4000' }, { id: '88', name: 'KLF' },
        { id: '89', name: 'MLF' }, { id: '90', name: 'HLF 10' }, { id: '103', name: 'FuStW (DGL)' },
        { id: '104', name: 'GW-L1' }, { id: '105', name: 'GW-L2' }, { id: '106', name: 'MTF-L' },
        { id: '107', name: 'LF-L' }, { id: '114', name: 'GW-Lüfter' }, { id: '121', name: 'GTLF' },
        { id: '126', name: 'MTF Drohne' }, { id: '150', name: 'GW-Bergrettung' }, { id: '162', name: 'RW-Schiene' },
        { id: '163', name: 'HLF Schiene' }, { id: '166', name: 'PTLF 4000' }, { id: '167', name: 'SLF' }
    ];

    const VEHICLE_ID_BY_SHORT_NAME = {};
    LSS_VEHICLE_TYPE_DEFINITIONS.forEach(def => { VEHICLE_ID_BY_SHORT_NAME[def.name] = def.id; });

    const VEHICLE_CREW_CAPABILITIES = {};
    const firefighterVehicles = PERSONNEL_TO_VEHICLE_MAPPING.Feuerwehrleute;
    for (const shortName in firefighterVehicles) {
        const typeId = VEHICLE_ID_BY_SHORT_NAME[shortName];
        const crewCount = firefighterVehicles[shortName];
        if (typeId !== undefined && crewCount >= 0) {
            VEHICLE_CREW_CAPABILITIES[typeId] = crewCount;
        }
    }

    // --- HILFSFUNKTIONEN ---
    const AVERAGE_SPEED_KMH = 65;
    const SECONDS_PER_HOUR = 3600;
    const METERS_PER_KILOMETER = 1000;
    function parseDistance(text) {
        if (typeof text !== 'string' || !text.trim()) return Infinity;
        let n = text.replace(',', '.').toLowerCase().trim(), m;
        m = n.match(/(\d+)\s*min\.?\s*(\d+)\s*sek\.?/); if (m) return parseInt(m[1],10)*60+parseInt(m[2],10);
        m = n.match(/^(\d+)\s*sek\.?$/); if (m) return parseInt(m[1],10);
        m = n.match(/^(\d+)\s*min\.?$/); if (m) return parseInt(m[1],10)*60;
        m = n.match(/(\d+(\.\d+)?)\s*km/); if (m) return (parseFloat(m[1])/AVERAGE_SPEED_KMH)*SECONDS_PER_HOUR;
        m = n.match(/(\d+(\.\d+)?)\s*m/); if (m) return ((parseFloat(m[1])/METERS_PER_KILOMETER)/AVERAGE_SPEED_KMH)*SECONDS_PER_HOUR;
        return Infinity;
    }

    // --- KERNFUNKTIONALITÄT: Personalauswahl ---
    async function selectFirefighters() {
        const numberInput = document.getElementById('personnel_number_input');
        const targetAmount = parseInt(numberInput.value, 10);
        const statusLabel = document.getElementById('personnel_status_label');
        const button = document.getElementById('select_personnel_button');

        button.innerHTML = '...';
        button.classList.add('disabled');
        statusLabel.textContent = `Suche...`;

        document.querySelectorAll('input.vehicle_checkbox:checked').forEach(cb => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        });

        let currentAmount = 0;
        const selectedCheckboxes = new Set();

        for (let attempt = 0; attempt <= MAX_RELOAD_ATTEMPTS; attempt++) {
            const availableVehicles = Array.from(document.querySelectorAll('tr.vehicle_select_table_tr'))
                .map(row => {
                    const checkbox = row.querySelector('input[type="checkbox"].vehicle_checkbox');
                    if (!checkbox || selectedCheckboxes.has(checkbox)) return null;
                    const vehicleTypeId = row.querySelector('td[vehicle_type_id]')?.getAttribute('vehicle_type_id');
                    if (VEHICLE_CREW_CAPABILITIES[vehicleTypeId] === undefined) return null;
                    const crewCount = VEHICLE_CREW_CAPABILITIES[vehicleTypeId];
                    const distance = parseDistance(row.querySelector('td[id^="vehicle_sort_"]')?.textContent);
                    return { checkbox, crewCount, distance };
                })
                .filter(Boolean)
                .sort((a, b) => a.distance - b.distance);

            for (const vehicle of availableVehicles) {
                if (currentAmount >= targetAmount) break;
                if (!vehicle.checkbox.checked) {
                    vehicle.checkbox.checked = true;
                    vehicle.checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    currentAmount += vehicle.crewCount;
                }
                selectedCheckboxes.add(vehicle.checkbox);
            }

            statusLabel.textContent = `${currentAmount}/${targetAmount}`;

            if (currentAmount >= targetAmount) break;

            if (attempt < MAX_RELOAD_ATTEMPTS) {
                const reloadButton = document.querySelector('a.missing_vehicles_load');
                if (reloadButton) {
                    reloadButton.click();
                    await new Promise(resolve => setTimeout(resolve, RELOAD_WAIT_MS));
                } else {
                    break;
                }
            }
        }
        statusLabel.textContent = `✅ ${currentAmount}`;
        button.innerHTML = 'Wählen';
        button.classList.remove('disabled');
    }

    // --- KERNFUNKTIONALITÄT: Personalzähler ---
    function updateAndDisplayPersonnelCount(tableId, personnelColumnIndex, labelText) {
        const table = document.getElementById(tableId);
        if (!table) return;

        let totalPersonnel = 0;
        const rows = table.querySelectorAll('tbody > tr');
        rows.forEach(row => {
            const cell = row.cells[personnelColumnIndex];
            if (cell) {
                totalPersonnel += parseInt(cell.textContent.trim(), 10) || 0;
            }
        });

        const counterId = `personnel_count_${tableId}`;
        let counterElement = document.getElementById(counterId);

        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.id = counterId;
            counterElement.className = 'personnel-counter';
            table.parentNode.insertBefore(counterElement, table);
        }

        counterElement.innerHTML = `🧑‍🚒 ${labelText}: <strong>${totalPersonnel}</strong>`;
    }

    function initPersonnelCounters() {
        const tablesToWatch = [
            { id: 'mission_vehicle_driving', col: 4, label: 'Personal unterwegs' },
            { id: 'mission_vehicle_at_mission', col: 3, label: 'Personal vor Ort' }
        ];

        tablesToWatch.forEach(t => updateAndDisplayPersonnelCount(t.id, t.col, t.label));

        const observer = new MutationObserver(mutations => {
            tablesToWatch.forEach(t => updateAndDisplayPersonnelCount(t.id, t.col, t.label));
        });

        tablesToWatch.forEach(t => {
            const tableBody = document.querySelector(`#${t.id} > tbody`);
            if (tableBody) {
                observer.observe(tableBody, { childList: true });
            }
        });
    }

    // --- UI ERSTELLEN ---
    function addPersonnelSelectorUI() {
        if (document.getElementById('personnel_selector_container')) return;
        const referenceNode = document.getElementById('navbar-alarm-spacer');
        if (!referenceNode) return;

        const styles = `
            #personnel_selector_container {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background-color: var(--background-color-card, #f8f9fa);
                padding: 4px 8px;
                border-radius: 5px;
                border: 1px solid var(--border-color, #dee2e6);
                margin-left: 10px;
                height: 30px;
                z-index: 9999;
            }
            body.dark #personnel_selector_container {
                 background-color: var(--background-color-card, #2c3034);
                 border: 1px solid var(--border-color, #495057);
            }
            #personnel_icon { font-size: 1.3em; cursor: help; }
            #personnel_slider {
                height: 10px;
                margin: 0;
            }
            #personnel_number_input {
                width: 50px; /* Feste Breite, die für große Zahlen ausreicht */
                border: 1px solid var(--border-color, #ced4da);
                background-color: var(--background-color, #fff);
                color: var(--text-color, #000);
                border-radius: 4px;
                text-align: center;
                font-size: 12px;
                padding: 2px 4px;
            }
            #personnel_number_input::-webkit-inner-spin-button,
            #personnel_number_input::-webkit-outer-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            body.dark #personnel_number_input {
                 background-color: var(--background-color, #343a40);
                 border: 1px solid var(--border-color, #6c757d);
                 color: var(--text-color, #f8f9fa);
            }
            #personnel_status_label {
                font-weight: bold;
                color: #28a745;
                font-size: 12px;
                text-align: right;
                margin-left: 5px;
            }
            .personnel-counter {
                padding: 5px;
                margin-bottom: 5px;
                font-size: 1.1em;
                background-color: var(--background-color-card, #f8f9fa);
                border: 1px solid var(--border-color, #dee2e6);
                border-radius: 4px;
            }
            body.dark .personnel-counter {
                 background-color: var(--background-color-card, #2c3034);
                 border: 1px solid var(--border-color, #495057);
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const container = document.createElement('div');
        container.id = 'personnel_selector_container';
        container.classList.add('flex-row', 'flex-nowrap', 'hidden-xs');
        container.innerHTML = `
            <span id="personnel_icon" title="Gewünschte Anzahl Feuerwehrleute einstellen">🧑‍🚒</span>
            <input type="range" id="personnel_slider" min="0" max="5000" step="1" value="9">
            <input type="number" id="personnel_number_input" min="0" step="1" value="9">
            <a id="select_personnel_button" class="btn btn-primary btn-xs">Wählen</a>
            <span id="personnel_status_label"></span>
        `;
        referenceNode.parentNode.insertBefore(container, referenceNode);

        const slider = document.getElementById('personnel_slider');
        const numberInput = document.getElementById('personnel_number_input');
        const button = document.getElementById('select_personnel_button');

        function syncAndSave(value) {
            const numValue = parseInt(value, 10) || 0;
            if (numValue > parseInt(slider.max, 10)) {
                slider.max = numValue;
            }
            slider.value = numValue;
            numberInput.value = numValue;
            localStorage.setItem(STORAGE_KEY, numValue);
        }

        slider.addEventListener('input', () => {
            syncAndSave(slider.value);
        });
        numberInput.addEventListener('input', () => {
            syncAndSave(numberInput.value);
        });
        button.addEventListener('click', selectFirefighters);

        const savedValue = localStorage.getItem(STORAGE_KEY);
        if (savedValue) {
            syncAndSave(savedValue);
        }
    }

    // --- INITIALISIERUNG ---
    const mainObserver = new MutationObserver((mutations, obs) => {
        const placementTarget = document.getElementById('navbar-alarm-spacer');
        if (placementTarget) {
            addPersonnelSelectorUI();
            initPersonnelCounters();
            obs.disconnect();
        }
    });
    mainObserver.observe(document.body, { childList: true, subtree: true });

})();