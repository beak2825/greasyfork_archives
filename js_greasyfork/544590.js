// ==UserScript==
// @name         Leitstellenspiel: Fahrzeuglisten-Filter (V34.0 - Das finale Design)
// @namespace    https://github.com/Masklin/leitstellenspiel-skripte
// @version      34.0.0
// @description  Finale Version mit überarbeitetem, integriertem UI-Design für eine saubere Optik und perfekte vertikale Ausrichtung.
// @author       Masklin (Entwicklung nach User-Vorgabe durch Gemini)
// @match        https://www.leitstellenspiel.de/buildings/*
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544590/Leitstellenspiel%3A%20Fahrzeuglisten-Filter%20%28V340%20-%20Das%20finale%20Design%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544590/Leitstellenspiel%3A%20Fahrzeuglisten-Filter%20%28V340%20-%20Das%20finale%20Design%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* CSS überarbeitet für finales, integriertes Layout */
        .tablesorter-headerRow > th { border-bottom: none !important; }
        .tampermonkey-control-row > th { padding: 4px 10px !important; border-bottom: 1px solid #ddd; }
        .filter-control-panel { display: flex; justify-content: flex-end; align-items: center; font-size: 12px; }
        .reset-all-filters { margin-right: 15px; color: #007bff; text-decoration: none; font-weight: bold; cursor: pointer; }
        .reset-all-filters:hover { text-decoration: underline; }
        .filter-counter { white-space: nowrap; }
        .tampermonkey-filter-row > th { vertical-align: middle !important; }
        .stacked-filters .custom-select-wrapper, .stacked-filters .text-filter-container { display: block; }
        .stacked-filters .custom-select-wrapper:not(:last-child) { margin-bottom: 5px; }
        .custom-select-wrapper { position: relative; font-size: 12px; }
        .custom-select-trigger { padding: 5px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #000; }
        .custom-options-container { display: none; position: absolute; border: 1px solid #ccc; background: #fff; z-index: 1000; max-height: 300px; overflow-y: auto; box-sizing: border-box; width: 250px; }
        .custom-option { padding: 4px 8px; cursor: pointer; user-select: none; border-bottom: 1px solid #f0f0f0; color: #000; }
        .custom-option:hover { background: #f2f2f2; }
        .custom-option.selected { border-left: 3px solid #007bff; font-weight: bold; padding-left: 5px; background-color: rgba(0, 123, 255, 0.1); }
        .custom-option.exclusive { border-left: 3px solid #dc3545; font-weight: bold; padding-left: 5px; background-color: rgba(220, 53, 69, 0.1); }
        .custom-option-clear { font-weight: bold; text-align: center; }
        .fms-select-wrapper { width: 100%; box-sizing: border-box; }
        .fms-options-grid { width: 130px; padding: 5px; }
        .fms-grid-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
        .fms-grid-option { padding: 4px; border: 1px solid #ddd; border-radius: 4px; text-align: center; }
        .fms-grid-option.selected { border-color: #007bff; box-shadow: inset 0 1px 4px rgba(0, 123, 255, 0.4); }
        .fms-grid-option.exclusive { border-color: #dc3545; box-shadow: inset 0 1px 4px rgba(220, 53, 69, 0.4); }
        .fms-grid-clear { grid-column: 1 / -1; margin-bottom: 5px; }
        .fms-color-box { display: inline-block; width: 10px; height: 10px; border-radius: 3px; border: 1px solid rgba(0,0,0,0.2); vertical-align: middle; }
        .text-filter-container { display: flex; align-items: center; }
        .text-filter-container input { flex-grow: 1; }
        .not-filter-btn { flex-shrink: 0; width: 25px; height: 25px; margin-left: 4px; border: 1px solid #ccc; border-radius: 4px; background-color: #f8f9fa; font-weight: bold; cursor: pointer; }
        .not-filter-btn.active { background-color: #dc3545; color: white; border-color: #dc3545; }
        .fms-bg-1{background-color:#c0c0c0}.fms-bg-2{background-color:#28a745}.fms-bg-3{background-color:#ffc107}.fms-bg-4{background-color:#dc3545}.fms-bg-5{background-color:#007bff}.fms-bg-6{background-color:#343a40}.fms-bg-7{background-color:#fd7e14}.fms-bg-8,.fms-bg-9{background-color:#6f42c1}
        #tampermonkey-filter-row input[type="text"] { background-color: #fff; color: #000; border: 1px solid #ccc; border-radius: 4px; padding: 4px; box-sizing: border-box; }
        .dark .custom-select-trigger, .dark .not-filter-btn { background: #2d2d2d; color: #fff; border-color: #555; }
        .dark .custom-options-container { background: #2d2d2d; border-color: #555; }
        .dark .custom-option { color: #fff; border-bottom-color: #444; }
        .dark .custom-option:hover { background: #4a4a4a; }
        .dark .custom-option.selected { background-color: rgba(0, 123, 255, 0.2); }
        .dark .custom-option.exclusive { background-color: rgba(220, 53, 69, 0.2); }
        .dark .fms-grid-option { border-color: #555; color: #fff; }
        .dark .not-filter-btn.active { background-color: #dc3545; color: white; border-color: #dc3545; }
        .dark #tampermonkey-filter-row input[type="text"] { background-color: #2d2d2d; color: #fff; border-color: #555; }
        .dark .reset-all-filters { color: #58a6ff; }
        .dark .tampermonkey-control-row > th { border-bottom-color: #555; }
    `);

    const CACHE_KEY = 'lss_vehicleTypeID_MapCache_v2';
    const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

    let vehicleTypeCache = {};
    const pendingFetches = {};
    const fmsClassMap = { "1": "fms-bg-1", "2": "fms-bg-2", "3": "fms-bg-3", "4": "fms-bg-4", "5": "fms-bg-5", "6": "fms-bg-6", "7": "fms-bg-7", "8": "fms-bg-8", "9": "fms-bg-9" };

    function loadCache() {try {const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {vehicleTypeCache = cachedData.map;} else {vehicleTypeCache = {};}} catch (e) {vehicleTypeCache = {};}}
    function saveCache() {try {localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), map: vehicleTypeCache }));} catch (e) {console.error("Filter-Skript: Fehler beim Speichern des Caches.", e);}}
    async function fetchAndLearn(typeId, vehicleUrl) {try {const response = await fetch(vehicleUrl);const text = await response.text();const parser = new DOMParser();const doc = parser.parseFromString(text, 'text/html');const typeElement = doc.querySelector('#vehicle-attr-type a');const vehicleName = typeElement ? typeElement.textContent.trim() : 'Unbekannt';vehicleTypeCache[typeId] = vehicleName;saveCache();} catch (e) {vehicleTypeCache[typeId] = 'Fehler';saveCache();}delete pendingFetches[typeId];}

    async function getRowData(row, columnIndexMap) {
        const tableId = row.closest('table').id;
        if (tableId === 'vehicle_show_table_all') {
            const data = {
                name: row.getAttribute('vehicle_caption')?.toLowerCase() || '',
                type: row.getAttribute('vehicle_type') || '',
                building: row.getAttribute('building') || '',
                fms: row.querySelector('.building_list_fms')?.textContent.trim() || '',
            };
            row.dataset.vehicleData = JSON.stringify(data);
            return;
        }
        const nameCell = row.children[columnIndexMap.name];
        const data = {
            name: nameCell ? nameCell.textContent.trim().toLowerCase() : '',
            fms: (row.querySelector('.building_list_fms')?.textContent.trim() || (columnIndexMap.fms !== undefined && row.children[columnIndexMap.fms] ? row.children[columnIndexMap.fms].textContent.trim() : '')) || '',
            building: columnIndexMap.building !== undefined && row.children[columnIndexMap.building] ? row.children[columnIndexMap.building].textContent.trim() : '',
            type: columnIndexMap.type !== undefined && row.children[columnIndexMap.type] ? row.children[columnIndexMap.type].textContent.trim() : '',
            einsatz: columnIndexMap.einsatz !== undefined && row.children[columnIndexMap.einsatz] ? row.children[columnIndexMap.einsatz].textContent.trim() : '',
            owner: columnIndexMap.owner !== undefined && row.children[columnIndexMap.owner] ? row.children[columnIndexMap.owner].textContent.trim() : ''
        };
        if (!data.type) {
            const img = row.querySelector('img.vehicle_image_reload[vehicle_type_id], a[vehicle_type_id], [vehicle_type_id]');
            if (img) {
                const typeId = img.getAttribute('vehicle_type_id');
                if (vehicleTypeCache[typeId]) { data.type = vehicleTypeCache[typeId]; }
                else {
                    if (pendingFetches[typeId]) { await pendingFetches[typeId]; }
                    else {
                        const vehicleLink = nameCell ? nameCell.querySelector('a[href*="/vehicles/"]') : null;
                        if (vehicleLink) {
                            const vehicleUrl = vehicleLink.getAttribute('href');
                            pendingFetches[typeId] = fetchAndLearn(typeId, vehicleUrl);
                            await pendingFetches[typeId];
                        }
                    }
                    data.type = vehicleTypeCache[typeId] || 'Fehler';
                }
            }
        }
        row.dataset.vehicleData = JSON.stringify(data);
    }

    function updateCounter(table) {const controlRow=document.getElementById(`tampermonkey-control-row-${table.id}`);if(!controlRow)return;const counterSpan=controlRow.querySelector('.filter-counter');if(!counterSpan)return;const totalRows=table.querySelectorAll('tbody tr').length;const visibleRows=Array.from(table.querySelectorAll('tbody tr')).filter(row=>!row.style.display||row.style.display!=='none').length;counterSpan.textContent=`${visibleRows} / ${totalRows} Fzg.`;}
    async function applyFilters(table, columnIndexMap) {const rows = Array.from(table.querySelectorAll('tbody tr'));await Promise.all(rows.map(row => getRowData(row, columnIndexMap)));updateTypeOptionsUI(table);filterRowsUI(table);updateCounter(table);}
    function filterRowsUI(table) {const filters={};table.querySelector(`.tampermonkey-filter-row`)?.querySelectorAll('[data-key]').forEach(el=>{const key=el.dataset.key;if(['type','fms'].includes(key)){try{filters[key]=JSON.parse(el.dataset.values||'{"inclusive":[],"exclusive":[]}')}catch{filters[key]={inclusive:[],exclusive:[]}}}else{const mode=el.dataset.mode||'inclusive';const values=(el.querySelector('input')?.value||'').toLowerCase().split(',').map(v=>v.trim()).filter(Boolean);filters[key]={inclusive:mode==='inclusive'?values:[],exclusive:mode==='exclusive'?values:[]}}});table.querySelectorAll('tbody tr').forEach(row=>{const data=JSON.parse(row.dataset.vehicleData||'{}');let isVisible=true;for(const key in filters){if(!isVisible)break;const filter=filters[key];const cellValue=(data[key]||'').toLowerCase();if(filter.inclusive&&filter.inclusive.length>0){const inclusiveLower=filter.inclusive.map(v=>v.toLowerCase());if(['name','building','einsatz','owner'].includes(key)){if(!inclusiveLower.some(val=>cellValue.includes(val)))isVisible=false}else{if(!inclusiveLower.includes(cellValue))isVisible=false}}if(filter.exclusive&&filter.exclusive.length>0){const exclusiveLower=filter.exclusive.map(v=>v.toLowerCase());if(['name','building','einsatz','owner'].includes(key)){if(exclusiveLower.some(val=>cellValue.includes(val)))isVisible=false}else{if(exclusiveLower.includes(cellValue))isVisible=false}}}row.style.display=isVisible?'':'none'});}
    function updateTypeOptionsUI(table) {const typeWrapper=table.querySelector('[data-key="type"]');if(!typeWrapper)return;const container=typeWrapper.querySelector('.custom-options-container');if(!container)return;const availableTypes=new Set();table.querySelectorAll('tbody tr').forEach(row=>{const data=JSON.parse(row.dataset.vehicleData||'{}');if(data.type)availableTypes.add(data.type);});const sortedTypes=Array.from(availableTypes).sort();let currentSelection;try{currentSelection=JSON.parse(typeWrapper.dataset.values||'{}');}catch{currentSelection={};}const inclusive=new Set(currentSelection.inclusive||[]);const exclusive=new Set(currentSelection.exclusive||[]);container.innerHTML='';const clear=document.createElement('div');clear.className='custom-option custom-option-clear';clear.textContent='Auswahl aufheben';container.appendChild(clear);sortedTypes.forEach(type=>{const option=document.createElement('div');option.className='custom-option';option.dataset.value=type;option.textContent=type;if(inclusive.has(type))option.classList.add('selected');if(exclusive.has(type))option.classList.add('exclusive');container.appendChild(option);});}

    function createControl(key, table, columnIndexMap) {
        const placeholderMap = { name: 'Fahrzeug', fms: 'FMS', type: 'Typ', building: 'Wache', einsatz: 'Einsatz', owner: 'Besitzer' };
        const placeholder = placeholderMap[key] || key.toUpperCase();
        if (['type', 'fms'].includes(key)) {
            const { wrapper, optionsContainer } = buildCustomMultiSelect({ key, placeholder, isFms: key === 'fms' });
            optionsContainer.addEventListener('click', async e => {
                const option = e.target.closest('.custom-option, .fms-grid-option');
                if (!option) return;
                if (option.classList.contains('custom-option-clear') || option.classList.contains('fms-grid-clear')) {
                    optionsContainer.querySelectorAll('.selected, .exclusive').forEach(el => el.classList.remove('selected', 'exclusive'));
                } else {
                    if (option.classList.contains('selected')) { option.classList.remove('selected'); option.classList.add('exclusive'); }
                    else if (option.classList.contains('exclusive')) { option.classList.remove('exclusive'); }
                    else { option.classList.add('selected'); }
                }
                const inclusiveValues = Array.from(optionsContainer.querySelectorAll('.selected')).map(el => el.dataset.value);
                const exclusiveValues = Array.from(optionsContainer.querySelectorAll('.exclusive')).map(el => el.dataset.value);
                wrapper.dataset.values = JSON.stringify({ inclusive: inclusiveValues, exclusive: exclusiveValues });
                await applyFilters(table, columnIndexMap);
            });
            if (key === 'fms') setupFmsOptions(optionsContainer);
            return wrapper;
        } else {
            const container = document.createElement('div');
            container.className = 'text-filter-container';
            container.dataset.key = key;
            container.dataset.mode = 'inclusive';
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `${placeholder} filtern...`;
            input.style.width = '100%';
            input.addEventListener('keyup', () => applyFilters(table, columnIndexMap));
            const notButton = document.createElement('button');
            notButton.className = 'not-filter-btn';
            notButton.textContent = '!';
            notButton.title = "Filtermodus umschalten (enthält / enthält nicht)";
            notButton.addEventListener('click', () => {
                const newMode = container.dataset.mode === 'inclusive' ? 'exclusive' : 'inclusive';
                container.dataset.mode = newMode;
                notButton.classList.toggle('active', newMode === 'exclusive');
                applyFilters(table, columnIndexMap);
            });
            container.appendChild(input);
            container.appendChild(notButton);
            return container;
        }
    }

    function setupFmsOptions(container) {const grid=document.createElement('div');grid.className='fms-grid-container';container.appendChild(grid);const clear=document.createElement('div');clear.className='custom-option fms-grid-option fms-grid-clear';clear.textContent='Aufheben';grid.appendChild(clear);for(let fms=1;fms<=9;fms++){const option=document.createElement('div');option.className='custom-option fms-grid-option';option.dataset.value=fms;option.innerHTML=`<span class="fms-color-box ${fmsClassMap[fms]}"></span> ${fms}`;grid.appendChild(option)}}
    function buildCustomMultiSelect(config){const wrapper=document.createElement('div');wrapper.className=`custom-select-wrapper ${config.isFms?'fms-select-wrapper':''}`;wrapper.dataset.key=config.key;wrapper.dataset.values='{"inclusive":[],"exclusive":[]}';const trigger=document.createElement('div');trigger.className='custom-select-trigger';trigger.textContent=config.placeholder;wrapper.appendChild(trigger);const optionsContainer=document.createElement('div');optionsContainer.className=`custom-options-container ${config.isFms?'fms-options-grid':''}`;wrapper.appendChild(optionsContainer);trigger.addEventListener('click',e=>{e.stopPropagation();document.querySelectorAll('.custom-options-container').forEach(c=>{if(c!==optionsContainer)c.style.display='none'});optionsContainer.style.display=optionsContainer.style.display==='block'?'none':'block'});return{wrapper,optionsContainer}}

    async function buildOrRebuildFilters(table) {
        const tableId = table.id;
        const filterRowId = `tampermonkey-filter-row-${tableId}`;
        const controlRowId = `tampermonkey-control-row-${tableId}`;

        document.getElementById(filterRowId)?.remove();
        document.getElementById(controlRowId)?.remove();

        const mainHeaderRow = table.querySelector('thead tr.tablesorter-headerRow');
        if (!mainHeaderRow) return;

        const localColumnIndexMap = {};
        Array.from(mainHeaderRow.children).forEach((th, index) => {
            const text = th.textContent.trim();
            if (['Fahrzeugtyp'].includes(text)) localColumnIndexMap.type = index;
            if (['Name', 'Fahrzeug'].includes(text)) localColumnIndexMap.name = index;
            if (th.querySelector('.building_list_fms')) localColumnIndexMap.fms = 1;
            if (text === 'FMS') localColumnIndexMap.fms = index;
            if (['Gebäude', 'Wache'].includes(text)) localColumnIndexMap.building = index;
            if (text === 'Aktueller Einsatz') localColumnIndexMap.einsatz = index;
            if (text === 'Besitzer') localColumnIndexMap.owner = index;
        });

        const columnCount = mainHeaderRow.children.length;
        const thead = mainHeaderRow.parentElement;

        const controlRow = document.createElement('tr');
        controlRow.id = controlRowId;
        controlRow.classList.add('tampermonkey-control-row');
        const controlCell = document.createElement('th');
        controlCell.setAttribute('colspan', columnCount);
        controlRow.appendChild(controlCell);

        const controlPanel = document.createElement('div');
        controlPanel.className = 'filter-control-panel';
        const resetButton = document.createElement('a');
        resetButton.classList.add('reset-all-filters');
        resetButton.textContent = '⟲ Zurücksetzen';
        resetButton.href = '#';
        resetButton.addEventListener('click', async e => {
            e.preventDefault();
            table.querySelectorAll('.tampermonkey-filter-row [data-key]').forEach(control => {
                if (control.classList.contains('custom-select-wrapper')) {
                    control.dataset.values = '{"inclusive":[],"exclusive":[]}';
                    control.querySelectorAll('.selected, .exclusive').forEach(opt => opt.classList.remove('selected', 'exclusive'));
                } else if (control.classList.contains('text-filter-container')) {
                    control.querySelector('input').value = '';
                    control.dataset.mode = 'inclusive';
                    control.querySelector('.not-filter-btn').classList.remove('active');
                }
            });
            await applyFilters(table, localColumnIndexMap);
        });
        const counterSpan = document.createElement('span');
        counterSpan.className = 'filter-counter';
        controlPanel.appendChild(resetButton);
        controlPanel.appendChild(counterSpan);
        controlCell.appendChild(controlPanel);

        const filterRow = document.createElement('tr');
        filterRow.id = filterRowId;
        filterRow.classList.add('tampermonkey-filter-row');
        Array.from(mainHeaderRow.children).forEach(() => filterRow.appendChild(document.createElement('th')));

        if (table.id === 'vehicle_table') {
            const typeIndex = localColumnIndexMap.type === undefined ? 0 : localColumnIndexMap.type;
            if (filterRow.children[typeIndex]) filterRow.children[typeIndex].appendChild(createControl('type', table, localColumnIndexMap));
            ['name', 'fms', 'building', 'einsatz'].forEach(key => {
                const index = localColumnIndexMap[key];
                if (index !== undefined && filterRow.children[index]) filterRow.children[index].appendChild(createControl(key, table, localColumnIndexMap));
            });
        } else {
            const firstCell = filterRow.firstElementChild;
            firstCell.classList.add('stacked-filters');
            if (table.id === 'vehicle_show_table_all') {
                firstCell.setAttribute('colspan', '2');
                if (filterRow.children[1]) filterRow.children[1].style.display = 'none';
            }
            firstCell.appendChild(createControl('type', table, localColumnIndexMap));
            firstCell.appendChild(createControl('fms', table, localColumnIndexMap));
            ['name', 'building', 'owner'].forEach(key => {
                const index = localColumnIndexMap[key];
                if (index !== undefined && filterRow.children[index]) filterRow.children[index].appendChild(createControl(key, table, localColumnIndexMap));
            });
        }

        mainHeaderRow.insertAdjacentElement('afterend', filterRow);
        mainHeaderRow.insertAdjacentElement('afterend', controlRow);

        await applyFilters(table, localColumnIndexMap);
    }

    loadCache();
    setInterval(async () => {
        document.querySelectorAll('#vehicle_table, #mission_vehicle_driving, #mission_vehicle_at_mission, #vehicle_show_table_all').forEach(table => {
            if (table && table.querySelector('thead tr.tablesorter-headerRow')) {
                const mainHeaderRow = table.querySelector('thead tr.tablesorter-headerRow');
                const filterRow = document.getElementById(`tampermonkey-filter-row-${table.id}`);
                if (!filterRow || mainHeaderRow.children.length !== filterRow.children.length) {
                    buildOrRebuildFilters(table);
                }
            }
        });
    }, 500);

    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-options-container').forEach(c => c.style.display = 'none');
    });

})();