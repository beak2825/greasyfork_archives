// ==UserScript==
// @name         YouTube Filter & Sorter (Compact UI)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  STABLE & FINAL FIX. Live filtering is now reliable. Filter & Sort YouTube with a compact UI. Save your favorite settings as the new default.
// @author       Opita04
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/539802/YouTube%20Filter%20%20Sorter%20%28Compact%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539802/YouTube%20Filter%20%20Sorter%20%28Compact%20UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- --- CONFIGURATION (loaded once at start) --- ---
    let filtersGloballyEnabled = GM_getValue('filtersGloballyEnabled', true);
    const initialValues = {
        viewCount: GM_getValue('viewCountThreshold', 1000), viewType: GM_getValue('viewFilterType', 'greater'),
        ageEnabled: GM_getValue('ageFilterEnabled', false), ageVal: GM_getValue('ageValue', 1), ageUnit: GM_getValue('ageUnit', 'years'), ageType: GM_getValue('ageFilterType', 'newer'),
        durEnabled: GM_getValue('durationFilterEnabled', false), durVal: GM_getValue('durationValue', 10), durUnit: GM_getValue('durationUnit', 'minutes'), durType: GM_getValue('durationFilterType', 'longer'),
        sort: GM_getValue('sortOrder', 'default'), panelVisible: GM_getValue('isPanelVisible', true)
    };

    // --- --- PARSING FUNCTIONS --- ---
    function parseViews(v) { if (!v) return 0; const c = v.toLowerCase().replace(/views|,/g, '').trim(), n = parseFloat(c); if (c.includes('k')) return n * 1e3; if (c.includes('m')) return n * 1e6; if (c.includes('b')) return n * 1e9; return parseInt(c, 10) || 0; }
    function parseAgeToDays(a) { if (!a) return Infinity; const c = a.toLowerCase(), n = parseInt(c.match(/\d+/)) || 0; if (c.includes('year')) return n * 365; if (c.includes('month')) return n * 30; if (c.includes('week')) return n * 7; if (c.includes('day')) return n; if (c.includes('hour') || c.includes('minute') || c.includes('second')) return 0; return Infinity; }
    function parseDurationToSeconds(d) { if (!d) return null; const p = d.trim().split(':').map(Number); if (p.some(isNaN)) return null; let s = 0; if (p.length === 3) s = p[0] * 3600 + p[1] * 60 + p[2]; else if (p.length === 2) s = p[0] * 60 + p[1]; else if (p.length === 1) s = p[0]; return s; }

    // --- --- CORE LOGIC --- ---
    function getVideoElements() { return document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-playlist-video-renderer'); }
    function showAllVideos() { getVideoElements().forEach(v => { if (v.style.display === 'none') v.style.display = ''; }); }

    function filterVideos() {
        const viewCount = parseInt(document.getElementById('view-input').value, 10) || 0;
        const viewType = document.getElementById('view-select').value;
        const ageEnabled = document.getElementById('age-check').checked;
        const ageVal = parseInt(document.getElementById('age-input').value, 10) || 0;
        const ageUnit = document.getElementById('age-unit-select').value;
        const ageType = document.getElementById('age-type-select').value;
        const durEnabled = document.getElementById('duration-check').checked;
        const durVal = parseInt(document.getElementById('duration-input').value, 10) || 0;
        const durUnit = document.getElementById('duration-unit-select').value;
        const durType = document.getElementById('duration-type-select').value;
        const videos = getVideoElements();
        const ageThreshold = ageEnabled ? (ageUnit === 'years' ? ageVal * 365 : (ageUnit === 'months' ? ageVal * 30 : ageVal)) : 0;
        const durationThreshold = durEnabled ? (durUnit === 'hours' ? durVal * 3600 : durVal * 60) : 0;
        videos.forEach(video => {
            const metadata = video.querySelectorAll('#metadata-line span');
            const durationEl = video.querySelector('#time-status.ytd-thumbnail-overlay-time-status-renderer');
            let viewTxt = '', ageTxt = '';
            metadata.forEach(span => { const txt = span.textContent.toLowerCase(); if (txt.includes('view')) viewTxt = txt; else if (txt.includes('ago')) ageTxt = txt; });
            const views = parseViews(viewTxt), ageDays = parseAgeToDays(ageTxt), durationSecs = durationEl ? parseDurationToSeconds(durationEl.textContent) : null;
            let hide = false;
            if (views > 0 && ( (viewType === 'greater' && views < viewCount) || (viewType === 'less' && views > viewCount) )) hide = true;
            if (!hide && ageEnabled && ageDays !== Infinity && ( (ageType === 'newer' && ageDays > ageThreshold) || (ageType === 'older' && ageDays < ageThreshold) )) hide = true;
            if (!hide && durEnabled && durationSecs !== null && ( (durType === 'longer' && durationSecs < durationThreshold) || (durType === 'shorter' && durationSecs > durationThreshold) )) hide = true;
            if (video.style.display !== (hide ? 'none' : '')) video.style.display = hide ? 'none' : '';
        });
    }

    function sortVideos() {
        const selectedOrder = document.getElementById('sort-order-select').value;
        GM_setValue('sortOrder', selectedOrder);
        if (selectedOrder === 'default') return;
        const container = document.querySelector('#contents.ytd-rich-grid-renderer, #contents.ytd-item-section-renderer, #primary #contents');
        if (!container) { console.warn("Filter Script: Could not find video container to sort."); return; }
        const videos = Array.from(container.children).filter(el => el.tagName.match(/YTD-(RICH-ITEM|VIDEO)-RENDERER/));
        const videosData = videos.map(video => {
            const metadata = video.querySelectorAll('#metadata-line span');
            const durationEl = video.querySelector('#time-status.ytd-thumbnail-overlay-time-status-renderer');
            let viewTxt = '', ageTxt = '';
            metadata.forEach(span => { const txt = span.textContent.toLowerCase(); if (txt.includes('view')) viewTxt = txt; else if (txt.includes('ago')) ageTxt = txt; });
            return { element: video, views: parseViews(viewTxt), ageDays: parseAgeToDays(ageTxt), durationSeconds: durationEl ? parseDurationToSeconds(durationEl.textContent) : -1 };
        });
        videosData.sort((a, b) => {
            switch (selectedOrder) {
                case 'views_desc': return b.views - a.views; case 'views_asc': return a.views - b.views;
                case 'age_asc': return a.ageDays - b.ageDays; case 'age_desc': return b.ageDays - a.ageDays;
                case 'duration_desc': return b.durationSeconds - a.durationSeconds; case 'duration_asc': return a.durationSeconds - b.durationSeconds;
                default: return 0;
            }
        });
        videosData.forEach(vid => container.appendChild(vid.element));
    }

    function isFilterablePage() { return !window.location.pathname.startsWith('/watch'); }

    // --- --- UI & MAIN LOOP --- ---
    function createMenu() {
        const container = document.createElement('div'); container.id = 'view-filter-container'; document.body.appendChild(container);
        const quickToggleButton = document.createElement('button'); quickToggleButton.id = 'quick-toggle-filter-btn'; container.appendChild(quickToggleButton);
        function updateQuickToggleButton() { if (filtersGloballyEnabled) { quickToggleButton.textContent = 'Filters On'; quickToggleButton.className = 'filters-on'; } else { quickToggleButton.textContent = 'Filters Off'; quickToggleButton.className = 'filters-off'; } }
        quickToggleButton.addEventListener('click', () => {
            filtersGloballyEnabled = !filtersGloballyEnabled;
            GM_setValue('filtersGloballyEnabled', filtersGloballyEnabled);
            updateQuickToggleButton();
            mainLogic();
        });
        const toggleButton = document.createElement('button'); toggleButton.id = 'view-filter-toggle-btn'; container.appendChild(toggleButton);
        const panel = document.createElement('div'); panel.id = 'view-filter-panel'; container.appendChild(panel);
        panel.innerHTML = `
            <h3>View Count Filter</h3><div class="input-row"><input type="number" id="view-input" value="${initialValues.viewCount}"><select id="view-select"><option value="greater" ${initialValues.viewType === 'greater' ? 'selected' : ''}>Greater Than</option><option value="less" ${initialValues.viewType === 'less' ? 'selected' : ''}>Less Than</option></select></div><hr>
            <h3>Video Age Filter</h3><label class="filter-label"><input type="checkbox" id="age-check" ${initialValues.ageEnabled ? 'checked' : ''}> Enable Age Filter</label><div class="input-row"><input type="number" id="age-input" value="${initialValues.ageVal}"><select id="age-unit-select"><option value="days" ${initialValues.ageUnit === 'days' ? 'selected' : ''}>Days</option><option value="months" ${initialValues.ageUnit === 'months' ? 'selected' : ''}>Months</option><option value="years" ${initialValues.ageUnit === 'years' ? 'selected' : ''}>Years</option></select></div><select id="age-type-select"><option value="newer" ${initialValues.ageType === 'newer' ? 'selected' : ''}>Newer Than</option><option value="older" ${initialValues.ageType === 'older' ? 'selected' : ''}>Older Than</option></select><hr>
            <h3>Video Duration Filter</h3><label class="filter-label"><input type="checkbox" id="duration-check" ${initialValues.durEnabled ? 'checked' : ''}> Enable Duration Filter</label><div class="input-row"><input type="number" id="duration-input" value="${initialValues.durVal}"><select id="duration-unit-select"><option value="minutes" ${initialValues.durUnit === 'minutes' ? 'selected' : ''}>Minutes</option><option value="hours" ${initialValues.durUnit === 'hours' ? 'selected' : ''}>Hours</option></select></div><select id="duration-type-select"><option value="longer" ${initialValues.durType === 'longer' ? 'selected' : ''}>Longer Than</option><option value="shorter" ${initialValues.durType === 'shorter' ? 'selected' : ''}>Shorter Than</option></select><hr>
            <h3>Sort Order</h3><div class="input-row"><select id="sort-order-select"><option value="default" ${initialValues.sort === 'default' ? 'selected' : ''}>Default</option><option value="views_desc" ${initialValues.sort === 'views_desc' ? 'selected' : ''}>Views (High-Low)</option><option value="views_asc" ${initialValues.sort === 'views_asc' ? 'selected' : ''}>Views (Low-High)</option><option value="age_asc" ${initialValues.sort === 'age_asc' ? 'selected' : ''}>Age (New-Old)</option><option value="age_desc" ${initialValues.sort === 'age_desc' ? 'selected' : ''}>Age (Old-New)</option><option value="duration_desc" ${initialValues.sort === 'duration_desc' ? 'selected' : ''}>Duration (Long-Short)</option><option value="duration_asc" ${initialValues.sort === 'duration_asc' ? 'selected' : ''}>Duration (Short-Long)</option></select><button id="sort-now-btn">Sort Now</button></div><hr>
            <button id="save-btn">Save as Default</button>
        `;
        const saveButton = document.getElementById('save-btn');
        document.getElementById('sort-now-btn').addEventListener('click', sortVideos);
        saveButton.addEventListener('click', () => {
            GM_setValue('viewCountThreshold', parseInt(document.getElementById('view-input').value, 10)); GM_setValue('viewFilterType', document.getElementById('view-select').value);
            GM_setValue('ageFilterEnabled', document.getElementById('age-check').checked); GM_setValue('ageValue', parseInt(document.getElementById('age-input').value, 10)); GM_setValue('ageUnit', document.getElementById('age-unit-select').value); GM_setValue('ageFilterType', document.getElementById('age-type-select').value);
            GM_setValue('durationFilterEnabled', document.getElementById('duration-check').checked); GM_setValue('durationValue', parseInt(document.getElementById('duration-input').value, 10)); GM_setValue('durationUnit', document.getElementById('duration-unit-select').value); GM_setValue('durationFilterType', document.getElementById('duration-type-select').value);
            GM_setValue('sortOrder', document.getElementById('sort-order-select').value);
            const originalText = saveButton.textContent; saveButton.textContent = 'Saved!'; saveButton.style.backgroundColor = '#27813a'; saveButton.disabled = true;
            setTimeout(() => { saveButton.textContent = originalText; saveButton.style.backgroundColor = '#3ea6ff'; saveButton.disabled = false; }, 1500);
        });
        let isPanelVisible = initialValues.panelVisible;
        function updatePanelVisibility() { if (isPanelVisible) { panel.style.display = 'block'; toggleButton.textContent = 'Hide Controls'; } else { panel.style.display = 'none'; toggleButton.textContent = 'Show Controls'; } }
        toggleButton.addEventListener('click', () => { isPanelVisible = !isPanelVisible; GM_setValue('isPanelVisible', isPanelVisible); updatePanelVisibility(); });
        updateQuickToggleButton(); updatePanelVisibility();
        // Start the main logic loop ONLY AFTER the menu is created to prevent race conditions
        setInterval(mainLogic, 500);
    }

    function mainLogic() {
        const menuContainer = document.getElementById('view-filter-container');
        if (!menuContainer) return;
        if (isFilterablePage()) {
            if (menuContainer.style.display !== 'flex') menuContainer.style.display = 'flex';
            if (filtersGloballyEnabled) { filterVideos(); } else { showAllVideos(); }
        } else {
            if (menuContainer.style.display !== 'none') menuContainer.style.display = 'none';
            showAllVideos();
        }
    }

    GM_addStyle(`
        #view-filter-container { position: fixed; top: 80px; right: 20px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end; }
        #quick-toggle-filter-btn, #view-filter-toggle-btn { border: 1px solid #3f3f3f; padding: 5px 10px; cursor: pointer; border-radius: 5px; margin-bottom: 5px; order: -1; font-weight: bold; }
        #quick-toggle-filter-btn.filters-on { background-color: #27813a; color: white; }
        #quick-toggle-filter-btn.filters-off { background-color: #555; color: #ddd; }
        #view-filter-toggle-btn { background-color: #0f0f0f; color: white; }
        #view-filter-panel { background-color: #282828; color: white; border: 1px solid #3f3f3f; padding: 15px; border-radius: 8px; width: 220px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
        #view-filter-panel h3 { margin: 10px 0; font-size: 16px; text-align: center; border-bottom: 1px solid #444; padding-bottom: 5px; }
        #view-filter-panel h3:first-of-type { margin-top: 0; }
        #view-filter-panel input, #view-filter-panel select, #view-filter-panel button { display: block; width: 100%; box-sizing: border-box; padding: 8px; border-radius: 4px; border: 1px solid #555; background-color: #1e1e1e; color: white; }
        #view-filter-panel hr { border: none; border-top: 1px solid #444; margin: 20px 0; }
        .filter-label { display: flex; align-items: center; margin-bottom: 10px; }
        .filter-label input[type="checkbox"] { width: auto; margin-right: 10px; }
        .input-row { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
        .input-row > * { margin-bottom: 0 !important; }
        .input-row > input, .input-row > select { flex: 1; }
        #sort-now-btn { flex: 0 1 auto; }
        #save-btn { background-color: #3ea6ff; color: black; font-weight: bold; margin-top: 10px; transition: background-color 0.2s; }
        #sort-now-btn { background-color: #da860a; color: white; font-weight: bold; }
        #save-btn:hover, #sort-now-btn:hover { opacity: 0.9; }
    `);

    // Wait until the page body is ready before creating the menu and starting the loop
    if (document.body) {
        createMenu();
    } else {
        document.addEventListener('DOMContentLoaded', createMenu);
    }
})();