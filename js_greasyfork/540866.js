// ==UserScript==
// @name         Custom Race Filter
// @version      0.0.33
// @description  Adds filtering and sorting. Fixed unstable sort issue with a permanent ID tie-breaker.
// @author       Elaine [2047176]
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        none
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/540866/Custom%20Race%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/540866/Custom%20Race%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("CRF: Running v0.0.33 - Implemented stable sort.");

    // --- Constants & State ---
    const TRACKS = ["Speedway", "Parkland", "Withdrawal", "Industrial", "Vector", "Mudpit", "Seaside", "Two Islands", "Docks", "Commerce", "Sewage", "Meltdown", "Uptown", "Hammerhead", "Convict"];
    const STORAGE_PREFIX = 'crf_';
    const ui = { collapsibleBox: null, style: null };
    let sortState = { key: 'none', direction: 'asc' };
    let idCounter = 0; // Counter for stable sort IDs

    const STORAGE_KEYS = {
        HIDE_PW: `${STORAGE_PREFIX}hide_passworded`,
        ONLY_ANY: `${STORAGE_PREFIX}only_any_car`,
        FEE_ENABLED: `${STORAGE_PREFIX}fee_filter_enabled`,
        FEE_MIN: `${STORAGE_PREFIX}fee_min`,
        FEE_MAX: `${STORAGE_PREFIX}fee_max`,
        HIDE_FULL: `${STORAGE_PREFIX}hide_full_races`,
        LAPS_ENABLED: `${STORAGE_PREFIX}laps_filter_enabled`,
        LAPS_MIN: `${STORAGE_PREFIX}laps_min`,
        LAPS_MAX: `${STORAGE_PREFIX}laps_max`,
        TIME_ENABLED: `${STORAGE_PREFIX}time_filter_enabled`,
        TIME_H: `${STORAGE_PREFIX}time_h`,
        TIME_M: `${STORAGE_PREFIX}time_m`,
        TRACK_FILTER_ENABLED: `${STORAGE_PREFIX}track_filter_enabled`,
        TRACK_CHECKBOX_PREFIX: `${STORAGE_PREFIX}track_`
    };

    function parseTimeToMinutes(timeText) {
        if (timeText === 'waiting') return Infinity;
        const hMatch = timeText.match(/(\d+)\s*h/);
        const mMatch = timeText.match(/(\d+)\s*m/);
        return ((hMatch ? parseInt(hMatch[1], 10) : 0) * 60) + (mMatch ? parseInt(mMatch[1], 10) : 0);
    }

    /**
     * Sorts the race list based on the global sortState object.
     */
    function sortRaces() {
        if (sortState.key === 'none') return;
        const raceList = document.querySelector('.events-list');
        if (!raceList) return;

        const raceItems = Array.from(raceList.children);

        raceItems.sort((a, b) => {
            let valA, valB;

            if (sortState.key === 'startTime') {
                const timeTextA = a.querySelector('.startTime')?.textContent.trim().toLowerCase() || 'waiting';
                const timeTextB = b.querySelector('.startTime')?.textContent.trim().toLowerCase() || 'waiting';
                valA = parseTimeToMinutes(timeTextA);
                valB = parseTimeToMinutes(timeTextB);
            }

            // Primary sort criteria
            if (valA < valB) return -1;
            if (valA > valB) return 1;

            // --- STABILITY FIX: If primary values are equal, use the permanent data-crf-id as a tie-breaker ---
            const idA = parseInt(a.dataset.crfId, 10);
            const idB = parseInt(b.dataset.crfId, 10);
            return idA - idB;
        });

        if (sortState.direction === 'desc') {
            raceItems.reverse();
        }

        // Re-append the sorted elements to the DOM
        raceItems.forEach(item => raceList.appendChild(item));
    }

    /**
     * Applies all active filters to the race list, then sorts it.
     */
    function applyFiltersAndSort() {
        const raceItems = document.querySelectorAll('.events-list > li');
        if (raceItems.length === 0) return;

        // --- STABILITY ID ---
        // Ensure every race item has a unique, persistent ID for stable sorting.
        raceItems.forEach(item => {
            if (!item.dataset.crfId) {
                item.dataset.crfId = idCounter++;
            }
        });

        // (Filter logic remains the same as previous version)
        const hidePassworded = document.getElementById('crf-hide-passworded')?.checked;
        const onlyAnyCar = document.getElementById('crf-only-any')?.checked;
        const hideFull = document.getElementById('crf-hide-full')?.checked;
        const feeFilterEnabled = document.getElementById('crf-fee-enabled')?.checked;
        const lapsFilterEnabled = document.getElementById('crf-laps-enabled')?.checked;
        const timeFilterEnabled = document.getElementById('crf-time-enabled')?.checked;
        const trackFilterEnabled = document.getElementById('crf-track-filter-enabled')?.checked;

        const minFee = parseFloat(document.getElementById('crf-min-fee')?.value) || 0;
        const maxFee = document.getElementById('crf-max-fee')?.value !== '' ? parseFloat(document.getElementById('crf-max-fee')?.value) : Infinity;
        const minLaps = parseFloat(document.getElementById('crf-min-laps')?.value) || 0;
        const maxLaps = document.getElementById('crf-max-laps')?.value !== '' ? parseFloat(document.getElementById('crf-max-laps')?.value) : Infinity;
        const maxTimeH = parseFloat(document.getElementById('crf-max-time-h')?.value) || 0;
        const maxTimeM = parseFloat(document.getElementById('crf-max-time-m')?.value) || 0;
        const maxTotalMinutes = (maxTimeH * 60) + maxTimeM;

        const allowedTracks = new Set();
        if (trackFilterEnabled) {
            TRACKS.forEach(track => {
                const trackId = `crf-track-${track.toLowerCase().replace(/\s/g, '-')}`;
                if (document.getElementById(trackId)?.checked) allowedTracks.add(track);
            });
        }

        raceItems.forEach(item => {
            let shouldBeVisible = true;
            if (hidePassworded && !!item.querySelector('.password.protected')) shouldBeVisible = false;
            if (shouldBeVisible && onlyAnyCar) {
                const carText = item.querySelector('li.car > span.d-hide')?.textContent.trim().toLowerCase() || '';
                if (carText !== 'any class' && carText !== 'any car') shouldBeVisible = false;
            }
            if (shouldBeVisible && feeFilterEnabled) {
                const feeText = item.querySelector('li.fee')?.textContent.trim() || '$0';
                const feeValue = parseFloat(feeText.replace(/[^0-9.]/g, ''));
                if (feeValue < minFee || feeValue > maxFee) shouldBeVisible = false;
            }
            if (shouldBeVisible && hideFull) {
                const driversElement = item.querySelector('li.drivers');
                let driversText = '';
                driversElement?.childNodes.forEach(node => {
                    if (node.nodeType === 3 && node.textContent.includes('/')) driversText = node.textContent.trim();
                });
                if (driversText) {
                    const parts = driversText.split('/').map(s => parseInt(s.trim(), 10));
                    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] >= parts[1]) {
                        shouldBeVisible = false;
                    }
                }
            }
            if (shouldBeVisible && lapsFilterEnabled) {
                const lapsText = item.querySelector('li.track span.laps')?.textContent.trim() || '';
                const lapCount = parseInt(lapsText.replace(/\D/g, ''), 10);
                if (!isNaN(lapCount) && (lapCount < minLaps || lapCount > maxLaps)) shouldBeVisible = false;
            }
            if (shouldBeVisible && timeFilterEnabled) {
                const timeText = item.querySelector('li.startTime')?.textContent.trim().toLowerCase() || '';
                if (timeText !== 'waiting') {
                    const raceTotalMinutes = parseTimeToMinutes(timeText);
                    if (raceTotalMinutes > maxTotalMinutes) shouldBeVisible = false;
                }
            }
            if (shouldBeVisible && trackFilterEnabled) {
                const trackText = item.querySelector('li.track')?.firstChild.textContent.trim();
                if (trackText && !allowedTracks.has(trackText)) shouldBeVisible = false;
            }
            item.style.display = shouldBeVisible ? '' : 'none';
        });

        sortRaces();
    }

    function createUI() {
        if (ui.style) return;
        console.log("CRF: Creating permanent UI elements.");

        const css = `
            .crf-container { margin: 10px 0; }
            .crf-header { background: #333; color: #fff; padding: 8px 10px; font-weight: bold; border-top-left-radius: 5px; border-top-right-radius: 5px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border: 1px solid #444;}
            .crf-content { padding: 15px; display: none; }
            .crf-content.visible { display: block; }
            .crf-header.open { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
            .crf-header .arrow { transition: transform 0.3s; font-size: 16px; }
            .crf-header.open .arrow { transform: rotate(180deg); }
            .crf-options { display: flex; flex-direction: column; gap: 12px; }
            .crf-options label, .crf-filter-row { display: flex; align-items: center; font-size: 14px; color: #ddd !important; }
            .crf-options label > input[type="checkbox"] { margin-right: 8px; }
            .crf-options input[type="checkbox"] { height: 16px; width: 16px; accent-color: #555; }
            .crf-inputs-group { display: flex; gap: 5px; align-items: center; margin-left: auto; }
            .crf-inputs-group input[type="number"] { width: 70px; padding: 4px; background-color: #eee; border: 1px solid #999; border-radius: 3px; color: #333; }
            .crf-fee-inputs input[type="number"] { width: 100px; }
            .crf-inputs-group input:disabled { background-color: #ccc; cursor: not-allowed; }
            .crf-track-filter { position: relative; }
            #crf-track-dropdown { display: none; position: absolute; background-color: #333; min-width: 220px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.4); z-index: 10; border-radius: 5px; padding: 10px; margin-top: 5px; border: 1px solid #555; }
            #crf-track-dropdown label { display: block; padding: 5px; border-radius: 3px; cursor: pointer; }
            #crf-track-dropdown label:hover { background-color: #555; }
            .custom-events-wrap .title > li[data-sortable] { cursor: pointer; }
            .custom-events-wrap .title > li[data-sortable]:hover { text-decoration: underline; }
        `;
        ui.style = document.createElement("style");
        ui.style.textContent = css;
        document.head.appendChild(ui.style);

        let trackCheckboxesHTML = TRACKS.map(track => {
            const trackId = `crf-track-${track.toLowerCase().replace(/\s/g, '-')}`;
            return `<label><input type="checkbox" id="${trackId}"> ${track}</label>`;
        }).join('');

        ui.collapsibleBox = document.createElement('div');
        ui.collapsibleBox.className = 'crf-container';
        ui.collapsibleBox.innerHTML = `
            <div class="crf-header title-black"><span>Filter & Sort</span><span class="arrow">▼</span></div>
            <div class="crf-content cont-black">
                <div class="crf-options">
                    <label><input type="checkbox" id="crf-hide-passworded"> Hide Races with Passwords</label>
                    <label><input type="checkbox" id="crf-only-any"> Only "Any Car"</label>
                    <label><input type="checkbox" id="crf-hide-full"> Hide Full Races</label>
                    <div class="crf-filter-row crf-track-filter">
                        <label for="crf-track-filter-enabled"><input type="checkbox" id="crf-track-filter-enabled"> Track Filter</label>
                        <div class="crf-inputs-group"><button id="crf-track-select-btn" class="torn-btn">Select Tracks</button></div>
                        <div id="crf-track-dropdown">${trackCheckboxesHTML}</div>
                    </div>
                    <div class="crf-filter-row">
                        <label for="crf-time-enabled"><input type="checkbox" id="crf-time-enabled"> Start Time Lower Than</label>
                        <div class="crf-inputs-group"><input type="number" id="crf-max-time-h" placeholder="h" min="0"><input type="number" id="crf-max-time-m" placeholder="m" min="0" max="59"></div>
                    </div>
                    <div class="crf-filter-row">
                        <label for="crf-laps-enabled"><input type="checkbox" id="crf-laps-enabled"> Lap Count</label>
                        <div class="crf-inputs-group"><input type="number" id="crf-min-laps" placeholder="Min" min="0"><input type="number" id="crf-max-laps" placeholder="Max" min="0"></div>
                    </div>
                    <div class="crf-filter-row">
                        <label for="crf-fee-enabled"><input type="checkbox" id="crf-fee-enabled"> Join Fee</label>
                        <div class="crf-inputs-group crf-fee-inputs"><input type="number" id="crf-min-fee" placeholder="Min" min="0"><input type="number" id="crf-max-fee" placeholder="Max" min="0"></div>
                    </div>
                </div>
            </div>
        `;

        const header = ui.collapsibleBox.querySelector('.crf-header');
        const content = ui.collapsibleBox.querySelector('.crf-content');
        header.addEventListener('click', () => { header.classList.toggle('open'); content.classList.toggle('visible'); });

        const trackSelectBtn = ui.collapsibleBox.querySelector('#crf-track-select-btn');
        const trackDropdown = ui.collapsibleBox.querySelector('#crf-track-dropdown');
        trackSelectBtn.addEventListener('click', (e) => { e.stopPropagation(); trackDropdown.style.display = trackDropdown.style.display === 'block' ? 'none' : 'block'; });
        document.addEventListener('click', (e) => { if (!trackDropdown.contains(e.target) && e.target !== trackSelectBtn) trackDropdown.style.display = 'none'; });

        const controls = [
            { id: 'crf-hide-passworded', key: STORAGE_KEYS.HIDE_PW, type: 'checkbox' },
            { id: 'crf-only-any', key: STORAGE_KEYS.ONLY_ANY, type: 'checkbox' },
            { id: 'crf-hide-full', key: STORAGE_KEYS.HIDE_FULL, type: 'checkbox' },
            { id: 'crf-fee-enabled', key: STORAGE_KEYS.FEE_ENABLED, type: 'checkbox', group: ['crf-min-fee', 'crf-max-fee'] },
            { id: 'crf-min-fee', key: STORAGE_KEYS.FEE_MIN, type: 'input' },
            { id: 'crf-max-fee', key: STORAGE_KEYS.FEE_MAX, type: 'input' },
            { id: 'crf-laps-enabled', key: STORAGE_KEYS.LAPS_ENABLED, type: 'checkbox', group: ['crf-min-laps', 'crf-max-laps'] },
            { id: 'crf-min-laps', key: STORAGE_KEYS.LAPS_MIN, type: 'input' },
            { id: 'crf-max-laps', key: STORAGE_KEYS.LAPS_MAX, type: 'input' },
            { id: 'crf-time-enabled', key: STORAGE_KEYS.TIME_ENABLED, type: 'checkbox', group: ['crf-max-time-h', 'crf-max-time-m'] },
            { id: 'crf-max-time-h', key: STORAGE_KEYS.TIME_H, type: 'input' },
            { id: 'crf-max-time-m', key: STORAGE_KEYS.TIME_M, type: 'input' },
            { id: 'crf-track-filter-enabled', key: STORAGE_KEYS.TRACK_FILTER_ENABLED, type: 'checkbox', group: ['crf-track-select-btn'] }
        ];

        controls.forEach(control => {
            const el = ui.collapsibleBox.querySelector(`#${control.id}`);
            const toggleInputs = () => {
                if (!control.group) return;
                const isDisabled = !el.checked;
                control.group.forEach(inputId => ui.collapsibleBox.querySelector(`#${inputId}`).disabled = isDisabled);
            };

            if (control.type === 'checkbox') {
                el.checked = localStorage.getItem(control.key) === 'true';
                el.addEventListener('change', () => {
                    localStorage.setItem(control.key, el.checked);
                    toggleInputs();
                    applyFiltersAndSort();
                });
                toggleInputs();
            } else {
                el.value = localStorage.getItem(control.key) || '';
                el.addEventListener('input', () => { localStorage.setItem(control.key, el.value); applyFiltersAndSort(); });
            }
        });

        TRACKS.forEach(track => {
            const trackId = `crf-track-${track.toLowerCase().replace(/\s/g, '-')}`;
            const trackKey = `${STORAGE_KEYS.TRACK_CHECKBOX_PREFIX}${track}`;
            const checkbox = ui.collapsibleBox.querySelector(`#${trackId}`);
            checkbox.checked = localStorage.getItem(trackKey) !== 'false';
            checkbox.addEventListener('change', () => { localStorage.setItem(trackKey, checkbox.checked); applyFiltersAndSort(); });
        });
    }

    function setupSortingHeaders() {
        const raceListContainer = document.querySelector('.custom-events-wrap');
        if (!raceListContainer || raceListContainer.dataset.sortingReady) return;
        const startTimeHeader = raceListContainer.querySelector('.title .startTime');
        if (startTimeHeader) {
            startTimeHeader.setAttribute('data-sortable', 'startTime');
            startTimeHeader.addEventListener('click', handleSortClick);
            raceListContainer.dataset.sortingReady = 'true';
        }
    }

    function handleSortClick(event) {
        const key = event.currentTarget.dataset.sortable;
        if (!key) return;
        if (sortState.key === key) {
            sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortState.key = key;
            sortState.direction = 'asc';
        }
        sortRaces();
    }

    function mainLoop() {
        const activeTabLink = document.querySelector('.racing-main-wrap ul.categories li.active a.btn-action-tab');
        const onCustomRaceTab = activeTabLink && activeTabLink.getAttribute('tab-value') === 'customrace';
        const boxIsInDom = !!document.querySelector('.crf-container');

        if (onCustomRaceTab) {
            const anchorElement = document.querySelector('.content-title.m-bottom10');
            if (anchorElement && !boxIsInDom) {
                anchorElement.after(ui.collapsibleBox);
            }
            setupSortingHeaders();
            applyFiltersAndSort();
        } else {
            if (boxIsInDom) {
                ui.collapsibleBox.remove();
            }
        }
    }

    window.addEventListener('load', () => {
        console.log("CRF: Window loaded. Initializing script v0.0.33.");
        createUI();
        setInterval(mainLoop, 250);
    });

})();
