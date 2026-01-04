// ==UserScript==
// @name         Torn Race Finder
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Makes it easier to find races that have the most drivers and start pretty soon
// @author       defend [2683949]
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/539243/Torn%20Race%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/539243/Torn%20Race%20Finder.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    // --------------------------------------------------
    // 1. --- STYLES ---
    // --------------------------------------------------
    GM_addStyle(`
        .tcr-standard-highlight { background: rgba(100, 149, 237, 0.25) !important; box-shadow: inset 5px 0 0 0 rgba(100, 149, 237, 0.8) !important; }
        .tcr-priority-highlight { background: rgba(60, 179, 113, 0.25) !important; box-shadow: inset 5px 0 0 0 rgba(46, 139, 87, 0.9) !important; border-radius: 5px; }
        .tcr-collapsible { cursor: pointer; user-select: none; }
        .tcr-collapsible::after { content: ' \\25BE'; float: right; color: #777; margin-right: 8px;}
        .tcr-collapsible.tcr-open::after { content: ' \\25B4'; }
        .tcr-hidden { display: none; }
        .tcr-settings-wrap { display: flex; flex-wrap: wrap; gap: 20px; padding: 20px 15px; }
        .tcr-settings-section { display: flex; flex-direction: column; gap: 6px; }
        .tcr-settings-section h4 { margin: 0 0 5px 0; padding-bottom: 5px; font-size: 14px; border-bottom: 1px solid #444; color: #ccc; }
        .tcr-input-group { display: flex; align-items: center; gap: 6px; }
        .tcr-input-group label { color: #ddd; }
        .tcr-settings-section input[type="number"] { width: 50px; background-color: #333; border: 1px solid #555; color: white; padding: 3px; border-radius: 3px;}
        .tcr-rank-text-tag { font-family: monospace; background-color: rgba(0, 0, 0, 0.5); color: #e0e0e0; padding: 2px 8px; border-radius: 4px; font-size: 11px; letter-spacing: 1px; }
        .tcr-race-hidden { display: none !important; }
    `);

    // --------------------------------------------------
    // 2. --- SETTINGS MANAGEMENT (with URT toggle) ---
    // --------------------------------------------------
    const DEFAULTS = { tracks: ['Speedway', 'Withdrawal', 'Docks'], laps: 100, cars: ['Any car', 'Any class A car'], hideUnmatched: false, urtOnly: false };
    function getSettings() { return GM_getValue('tcrSettings', DEFAULTS); }
    function saveSettings() {
        const tracks = Array.from(document.querySelectorAll('.tcr-track-cb:checked')).map(cb => cb.value);
        const laps = parseInt(document.getElementById('tcr-laps-input').value, 10);
        const cars = Array.from(document.querySelectorAll('.tcr-car-cb:checked')).map(cb => cb.value);
        const hideUnmatched = document.getElementById('tcr-hide-cb').checked;
        const urtOnly = document.getElementById('tcr-urt-cb').checked;
        GM_setValue('tcrSettings', { tracks, laps, cars, hideUnmatched, urtOnly });
        findAndHighlightRaces();
    }

    // --------------------------------------------------
    // 3. --- UI CREATION (with URT toggle) ---
    // --------------------------------------------------
    function createSettingsUI() {
        const anchorElement = document.querySelector('#racingAdditionalContainer .start-race');
        if (!anchorElement || document.querySelector('.tcr-settings-panel')) return;

        const settings = getSettings();
        const uiState = GM_getValue('tcrUiState', 'closed');
        const allTracks = ["Uptown", "Withdrawal", "Docks", "Speedway", "Meltdown", "Two Islands", "Industrial", "Vector", "Mudpit", "Parkland", "Hammerhead", "Sewage", "Underdog", "Stone Park", "Convict", "Commerce"];
        const allCarTypes = ['Any car', 'Any class A car', 'Any class B car', 'Any class C car', 'Any class D car', 'Any class E car'];

        const panel = document.createElement('div');
        panel.className = 'messages-race-wrap tcr-settings-panel';
        panel.innerHTML = `
            <div class="title-black top-round m-top10 tcr-collapsible ${uiState === 'open' ? 'tcr-open' : ''}">Race Finder Settings</div>
            <div class="cont-black bottom-round ${uiState === 'closed' ? 'tcr-hidden' : ''}">
                <div class="tcr-settings-wrap">
                    <div class="tcr-settings-section">
                        <h4>Tracks</h4>
                        <div style="columns: 2; gap: 20px;">${allTracks.map(track => `<div class="tcr-input-group"><input type="checkbox" class="tcr-track-cb" value="${track}" ${settings.tracks.includes(track) ? 'checked' : ''}><label>${track}</label></div>`).join('')}</div>
                    </div>
                    <div class="tcr-settings-section">
                        <h4>Options</h4>
                        <div class="tcr-input-group"><label for="tcr-laps-input">Min Laps:</label><input type="number" id="tcr-laps-input" value="${settings.laps}"></div><br>
                        ${allCarTypes.map(car => `<div class="tcr-input-group"><input type="checkbox" class="tcr-car-cb" value="${car}" ${settings.cars.includes(car) ? 'checked' : ''}><label>${car}</label></div>`).join('')}
                        <br><hr style="width:100%; border-color: #444; margin-top: 10px;">
                        <div class="tcr-input-group"><input type="checkbox" id="tcr-hide-cb" ${settings.hideUnmatched ? 'checked' : ''}><label for="tcr-hide-cb"><b>Hide Unmatched Races</b></label></div>
                        <div class="tcr-input-group"><input type="checkbox" id="tcr-urt-cb" ${settings.urtOnly ? 'checked' : ''}><label for="tcr-urt-cb"><b>Focus: URT Only</b></label></div>
                    </div>
                </div>
            </div>`;
        anchorElement.after(panel);

        const titleElement = panel.querySelector('.tcr-collapsible');
        titleElement.addEventListener('click', () => {
            const content = titleElement.nextElementSibling;
            const isHidden = content.classList.toggle('tcr-hidden');
            titleElement.classList.toggle('tcr-open', !isHidden);
            GM_setValue('tcrUiState', isHidden ? 'closed' : 'open');
        });
        panel.querySelectorAll('input').forEach(el => el.addEventListener('change', saveSettings));
    }

    // --------------------------------------------------
    // 4. --- CORE LOGIC (with URT override) ---
    // --------------------------------------------------
    function findAndHighlightRaces() {
        const SETTINGS = getSettings();
        const raceListItems = document.querySelectorAll('.events-list > li');
        if (!raceListItems.length) return;

        // Cleanup function that runs every time to keep the state clean
        const resetRaceStates = () => {
            document.querySelectorAll('li.name[data-original-name]').forEach(el => {
                el.innerHTML = el.getAttribute('data-original-name');
                el.removeAttribute('data-original-name'); el.removeAttribute('title');
            });
            raceListItems.forEach(el => el.classList.remove('tcr-standard-highlight', 'tcr-priority-highlight', 'tcr-race-hidden'));
        };

        resetRaceStates();

        // --- URT FOCUS MODE ---
        if (SETTINGS.urtOnly) {
            for (const raceLi of raceListItems) {
                const isUrt = raceLi.classList.contains('gold');
                const driversText = raceLi.querySelector('.drivers')?.textContent || '0 / 0';
                const driverParts = driversText.split('/');
                const currentDrivers = parseInt((driverParts[0] || '').replace(/\D/g, ''), 10) || 0;
                const maxDrivers = parseInt(driverParts[1] || '0', 10);
                const isJoinable = !(currentDrivers >= maxDrivers || raceLi.classList.contains('protected') || maxDrivers <= 2);

                if (!isUrt || !isJoinable) {
                    raceLi.classList.add('tcr-race-hidden');
                }
            }
            return; // EXIT here. Do not perform any highlighting or ranking.
        }

        // --- NORMAL MODE ---
        let matchingRaces = [];
        for (const raceLi of raceListItems) {
            let isMatch = false;
            const driversText = raceLi.querySelector('.drivers')?.textContent || '0 / 0';
            const driverParts = driversText.split('/');
            const currentDrivers = parseInt((driverParts[0] || '').replace(/\D/g, ''), 10) || 0;
            const maxDrivers = parseInt(driverParts[1] || '0', 10);

            if (!(currentDrivers >= maxDrivers || maxDrivers <= 2 || raceLi.classList.contains('protected'))) {
                const trackName = raceLi.querySelector('.track')?.childNodes[0]?.nodeValue?.trim() || '';
                const laps = parseInt(raceLi.querySelector('.track .laps')?.textContent?.match(/\d+/)?.[0] || '0', 10);
                const carText = raceLi.querySelector('.car .t-hide')?.textContent?.trim() || '';
                let carRequirementMet = false;
                for (const selectedCar of SETTINGS.cars) {
                    if (carText === selectedCar) { carRequirementMet = true; break; }
                    if (selectedCar.startsWith('Any class')) {
                        if (carText === `Any stock${selectedCar.substring(3)}`) { carRequirementMet = true; break; }
                    }
                }
                if (SETTINGS.tracks.includes(trackName) && laps >= SETTINGS.laps && carRequirementMet) {
                    isMatch = true;
                    const timeInMinutes = parseTimeToMinutes(raceLi.querySelector('.startTime')?.textContent?.trim() || 'waiting');
                    const score = (timeInMinutes === Infinity) ? 0 : (currentDrivers * currentDrivers) / (timeInMinutes + 1);
                    matchingRaces.push({ element: raceLi, score: score });
                }
            }

            if (SETTINGS.hideUnmatched && !isMatch) {
                raceLi.classList.add('tcr-race-hidden');
            }
        }

        if (matchingRaces.length > 0) {
            const sortedRaces = matchingRaces.sort((a, b) => b.score - a.score);
            sortedRaces.forEach((race, index) => {
                if (race.score <= 0) { race.element.classList.add('tcr-standard-highlight'); return; }
                if (index === 0) { race.element.classList.add('tcr-priority-highlight'); } else { race.element.classList.add('tcr-standard-highlight'); }
                if (index === 1 || index === 2) {
                    const nameElement = race.element.querySelector('li.name');
                    if (nameElement && !nameElement.hasAttribute('data-original-name')) {
                        const originalName = nameElement.innerHTML;
                        nameElement.setAttribute('data-original-name', originalName);
                        nameElement.setAttribute('title', `Original Name: ${originalName.replace(/<[^>]*>/g, '')}`);
                        const rankText = `---- ${index === 1 ? '2ND' : '3RD'} BEST ----`;
                        nameElement.innerHTML = `<span class="tcr-rank-text-tag">${rankText}</span>`;
                    }
                }
            });
        }
    }

    // --------------------------------------------------
    // 5. --- HELPERS & INITIALIZATION ---
    // --------------------------------------------------
    function parseTimeToMinutes(timeStr) {
        if (!timeStr || timeStr.toLowerCase() === 'waiting') return Infinity;
        let totalMinutes = 0;
        const h = timeStr.match(/(\d+)\s*h/);
        const m = timeStr.match(/(\d+)\s*m/);
        if (h) totalMinutes += parseInt(h[1], 10) * 60;
        if (m) totalMinutes += parseInt(m[1], 10);
        return totalMinutes;
    }

    setInterval(() => {
        createSettingsUI();
        if (document.querySelector('.custom-events-wrap')) {
            findAndHighlightRaces();
        }
    }, 500);

})();