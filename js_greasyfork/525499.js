// ==UserScript==
// @name         Bootlegging Ratio Calculator (Crimes 2.0)
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  A tool that calculates DVD ratios, now with merit tracking
// @author       Mistral [2717731]
// @match        https://www.torn.com/loader.php?sid=crimes
// @match        https://www.torn.com/crimes.php*
// @icon         https://www.torn.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/525499/Bootlegging%20Ratio%20Calculator%20%28Crimes%2020%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525499/Bootlegging%20Ratio%20Calculator%20%28Crimes%2020%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[BootleggingCalc] Script execution started.');

    try {
        GM_addStyle(`
            /* --- Styles are unchanged from your v2.0, so they are omitted here for brevity --- */
            /* --- but they should be included in the actual script --- */
            .torn-calculator-container {
              background: #333333;
              color: #f0f0f0;
              padding: 10px;
              border-radius: 8px;
              margin: 10px 0px;
              border: 1px solid #444;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
              overflow: hidden; /* For collapse transition if added */
            }
            .calculator-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-bottom: 8px;
              margin-bottom: 10px;
              border-bottom: 1px solid #444;
            }
            .calculator-title {
              font-weight: bold;
              font-size: 1.1em;
            }
            #calculatorCollapseToggle {
              background: #555;
              color: white;
              border: none;
              padding: 3px 10px;
              cursor: pointer;
              border-radius: 4px;
              font-size: 1em;
              line-height: 1;
            }
            #calculatorCollapseToggle:hover {
              background: #666;
            }
            .torn-calculator-container.collapsed {
              padding: 5px 10px;
              margin: 10px 0px;
            }
            .torn-calculator-container.collapsed .calculator-header {
              margin-bottom: 0;
              border-bottom: none;
            }
            .torn-calculator-container.collapsed #calculatorMainContent {
              display: none;
            }
            .torn-calculator-inputs {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              color: #e0e0e0;
              margin-bottom: 15px;
            }
            .torn-input-label {
                grid-column: span 2;
                margin-bottom: -5px;
                font-size: 0.9em;
                color: #ccc;
            }
            .ratio-toggle-container {
              position: relative;
              grid-column: span 2;
              display: flex;
              align-items: center;
              gap: 6px;
              flex-wrap: wrap;
              margin-top: 5px;
            }
            .torn-results-table {
              width: 100%;
              border-collapse: separate;
              border-spacing: 5px;
              margin-bottom: 15px;
            }
            .torn-results-table th,
            .torn-results-table td {
              color: #ffffff;
              border-bottom: 2px solid #555;
              padding: 4px;
              text-align: center;
              font-weight: 600;
            }
            .toggle-switch {
              position: relative;
              display: inline-block;
              width: 40px;
              height: 20px;
            }
            .toggle-switch input { opacity: 0; width: 0; height: 0; }
            .toggle-slider {
              position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
              background-color: #555; transition: .4s; border-radius: 20px;
            }
            .toggle-slider:before {
              position: absolute; content: ""; height: 16px; width: 16px;
              left: 2px; bottom: 2px; background-color: #ddd;
              transition: .4s; border-radius: 50%;
            }
            input:checked + .toggle-slider { background-color: #4CAF50; }
            input:checked + .toggle-slider:before { transform: translateX(20px); }

            #tornBaseGenre, #tornTargetAmount {
              padding: 10px 14px;
              background-color: #2a2a2a; color: #ffffff; border: 1px solid #444;
              border-radius: 4px; font-size: 14px; width: 100%; box-sizing: border-box;
            }
            #tornBaseGenre:focus, #tornTargetAmount:focus {
              outline: none; border-color: #4CAF50;
              box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.4);
            }
            .options-button {
              background-color: #444; color: #fff; border: 1px solid #555;
              border-radius: 4px; padding: 4px 20px;
              cursor: pointer; margin-left: auto;
            }
            .options-dropdown {
              display: none; position: absolute; top: 100%; right: 0;
              background-color: #2a2a2a; border: 1px solid #444; border-radius: 4px;
              padding: 10px; margin-top: 4px; color: #fff; z-index: 10;
            }
            .options-dropdown input {
              width: 60px; margin-right: 4px; background-color: #333; color: #fff;
              border: 1px solid #555; padding: 4px; border-radius: 4px; font-size: 14px;
            }
            .options-dropdown label { margin-right: 8px; }
            .hidden { display: none !important; }
            .merit-tracker-toggle-container {
              display: flex;
              align-items: center;
              gap: 6px;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px dashed #555;
            }
            #meritPanelMessage {
              color: #ffc107;
              text-align: center;
              margin-bottom: 5px;
              font-size: 0.9em;
            }
            #tornMeritTable { margin-top: 5px; }
        `);
        console.log('[BootleggingCalc] GM_addStyle applied successfully.');
    } catch (e) {
        console.error('[BootleggingCalc] ERROR in GM_addStyle:', e);
    }

    // Constants
    const MAX_INIT_ATTEMPTS = 20; // Max attempts for initial setup
    const INIT_RETRY_INTERVAL = 500; // Interval between init attempts
    const MERIT_TARGET_SOLD = 10000;

    // State variables loaded from GM storage or default
    let HighStockThreshold, LowStockThreshold, useStoreRatios, calculateByTotalDisks, isCalculatorCollapsed, showMeritTracker;

    // Other state variables
    const BASE_RATIOS = { /* ... Unchanged ... */
        'Action': 10, 'Comedy': 7, 'Drama': 5.5, 'Fantasy': 7,
        'Horror': 3, 'Romance': 3, 'Thriller': 4, 'Sci-Fi': 2
    };
    let stockData = {};
    let initAttempts = 0;
    let mainObserver = null;
    let statsPanelObserver = null;
    let statsPanelContentVisible = false; // Tracks if the stats panel content area is visible

    // Load settings from GM
    function loadSettings() {
        try {
            HighStockThreshold = GM_getValue('HighStockThreshold', 95);
            LowStockThreshold = GM_getValue('LowStockThreshold', 80);
            useStoreRatios = GM_getValue('useStoreRatios', true);
            calculateByTotalDisks = GM_getValue('calculateByTotalDisks', false);
            isCalculatorCollapsed = GM_getValue('isCalculatorCollapsed', false);
            showMeritTracker = GM_getValue('showMeritTracker', false);
            console.log('[BootleggingCalc] Settings loaded:', { HighStockThreshold, LowStockThreshold, useStoreRatios, calculateByTotalDisks, isCalculatorCollapsed, showMeritTracker });
        } catch (e) {
            console.error('[BootleggingCalc] ERROR loading settings:', e);
            // Set defaults if loading fails
            HighStockThreshold = 95; LowStockThreshold = 80; useStoreRatios = true; calculateByTotalDisks = false; isCalculatorCollapsed = false; showMeritTracker = false;
        }
    }
    loadSettings(); // Load settings at the start

    // --- Helper Functions (getAdjustedRatios, extractNumber, parseHumanReadableNumber) ---
    // --- These are largely unchanged from your v2.0, ensure they are correct ---
    function getAdjustedRatios() {
        const ratios = { ...BASE_RATIOS };
        if (!useStoreRatios) ratios.Comedy = 6.25;
        return ratios;
    }
    function extractNumber(text) {
        const match = String(text).replace(/,/g, '').match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }
    function parseHumanReadableNumber(inputStr) {
        if (!inputStr || typeof inputStr !== 'string') {
            const parsedInt = parseInt(inputStr); // Ensure inputStr is converted to string if it's a number
            return isNaN(parsedInt) ? 0 : parsedInt;
        }
        const str = String(inputStr).toLowerCase().trim().replace(/,/g, '');
        if (str === "") return 0;

        const lastChar = str.slice(-1);
        const numPartStr = (lastChar === 'k' || lastChar === 'm' || lastChar === 'b') ? str.slice(0, -1) : str;
        let numPart = parseFloat(numPartStr);

        if (isNaN(numPart)) return 0;

        let result;
        switch (lastChar) {
            case 'k': result = Math.round(numPart * 1000); break;
            case 'm': result = Math.round(numPart * 1000000); break;
            case 'b': result = Math.round(numPart * 1000000000); break;
            default:
                return numPart; // If no k, m, b, it's already the number
        }
        return result;
    }


    // --- Data Parsing Functions (parseStockData, parseMeritData) ---
    // --- Largely unchanged logic, ensure error handling and logging ---
    function parseStockData() {
        console.log('[BootleggingCalc] parseStockData() called.');
        try {
            const genreButtons = document.querySelectorAll('.genreStock___IT7ld');
            const newStockData = {};
            genreButtons.forEach(button => {
                const genre = button.querySelector('.genreName___kBqTz')?.textContent.trim() || '';
                const currentStockText = button.querySelector('.currentStock___Bh9_b')?.textContent || '0';
                const current = parseInt(currentStockText.replace(/,/g, '')) || 0;
                const statusText = button.querySelector('.statusText___fRZso')?.textContent || '';
                let queued = 0;
                if (statusText.includes('queued') || statusText.includes('copying')) {
                     const queueMatch = statusText.match(/(\d+([,\d]*\d*))(?=\s*(queued|copying))/i);
                     if (queueMatch) queued = parseInt(queueMatch[1].replace(/,/g, ''), 10);
                }
                if (genre && BASE_RATIOS.hasOwnProperty(genre)) newStockData[genre] = { current, queued, total: current + queued };
            });
            stockData = newStockData;
            updateCalculations();
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in parseStockData:', e);
        }
    }
    function parseMeritData() {
        if (!showMeritTracker || isCalculatorCollapsed) return;
        try {
            const panelContent = document.querySelector('.statsPanel___q1zkf .panelContent___zLds1');
            const meritPanelMessage = document.getElementById('meritPanelMessage');

            if (!meritPanelMessage) return; // UI not fully ready for merit section

            statsPanelContentVisible = panelContent && !panelContent.classList.contains('hidden___Qw474');

            if (!statsPanelContentVisible) {
                meritPanelMessage.textContent = "Merit: Open crime stats panel to see sold DVD counts.";
                updateMeritTable({}, MERIT_TARGET_SOLD, true);
                return;
            }

            const page2List = Array.from(panelContent.querySelectorAll('ul.ul___N9kIE')).find(ul => ul.getAttribute('aria-label') === 'Page 2' || ul.getAttribute('aria-label') === 'Page 3');
            // Note: In your provided HTML for the *individual* bootlegging page, the sold counts were on Page 3.
            // On the main hub page, they might not exist or be on a different page.
            // This finds either Page 2 or Page 3.

            if (!page2List) {
                meritPanelMessage.textContent = "Merit: Navigate to Page 2 or 3 in stats panel for sold DVD counts.";
                updateMeritTable({}, MERIT_TARGET_SOLD, true);
                return;
            }

            meritPanelMessage.textContent = "";
            const newSoldCounts = {};
            const statItems = page2List.querySelectorAll('li.statistic___YkyjL button');
            statItems.forEach(item => {
                const label = item.getAttribute('aria-label');
                if (label && label.includes("DVDs sold:")) {
                    const parts = label.split(" DVDs sold: ");
                    const genreName = parts[0].trim();
                    const count = parseInt(parts[1].replace(/,/g, ''), 10);
                    if (BASE_RATIOS.hasOwnProperty(genreName) && !isNaN(count)) {
                        newSoldCounts[genreName] = count;
                    }
                }
            });
            updateMeritTable(newSoldCounts, MERIT_TARGET_SOLD, false);
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in parseMeritData:', e);
            if (document.getElementById('meritPanelMessage')) {
                document.getElementById('meritPanelMessage').textContent = "Error parsing merit data. Check console.";
            }
        }
    }


    // --- Calculation Functions (calculateRequirementsByBaseGenre, calculateRequirementsByTotalDisks) ---
    // --- Unchanged ---
    function calculateRequirementsByBaseGenre(baseGenre, targetAmount) {
        const ratios = getAdjustedRatios();
        if (!ratios[baseGenre] || targetAmount <= 0) return null;
        const baseRatio = ratios[baseGenre];
        const multiplier = targetAmount / baseRatio;
        const requirements = {};
        for (const [genre, ratio] of Object.entries(ratios)) {
            const required = Math.ceil(ratio * multiplier);
            const currentTotal = stockData[genre]?.total || 0;
            requirements[genre] = { required, difference: required - currentTotal, current: currentTotal };
        }
        return requirements;
    }
    function calculateRequirementsByTotalDisks(totalDisks) {
        if (totalDisks <= 0) return null;
        const ratios = getAdjustedRatios();
        const sumOfRatios = Object.values(ratios).reduce((sum, ratio) => sum + ratio, 0);
        if (sumOfRatios === 0) return null;

        const requirements = {};
        let calculatedSum = 0;
        const genres = Object.keys(ratios);

        for (let i = 0; i < genres.length; i++) {
            const genre = genres[i];
            const ratio = ratios[genre];
            let required;
            if (i === genres.length - 1) {
                required = totalDisks - calculatedSum;
            } else {
                required = Math.round((ratio / sumOfRatios) * totalDisks);
                calculatedSum += required;
            }
            required = Math.max(0, required);
            const currentTotal = stockData[genre]?.total || 0;
            requirements[genre] = { required, difference: required - currentTotal, current: currentTotal };
        }
        return requirements;
    }


    // --- UI Update Functions (updateResults, updateUIMode, updateCalculations, updateMeritTable) ---
    // --- Unchanged, but ensure elements are checked for existence ---
    function updateResults(requirements) {
        const tbody = document.getElementById('tornResultsBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (!requirements) return;

        Object.entries(requirements).forEach(([genre, data]) => {
            const { difference, required, current } = data;
            const needed = difference;
            const progress = required > 0 ? Math.min(100, (current / required) * 100) : (current > 0 ? 100 : 0);

            let row = document.createElement('tr');
            row.setAttribute('data-genre', genre);
            row.innerHTML = `<td>${genre}</td><td></td><td></td><td></td>`;
            tbody.appendChild(row);

            row.children[1].style.color = needed > 0 ? '#d32f2f' : '#2e7d32';
            row.children[1].textContent = `${needed > 0 ? '+' : ''}${needed.toLocaleString()}`;
            row.children[2].textContent = required.toLocaleString();
            row.children[3].style.color = progress >= HighStockThreshold ? '#2e7d32' :
                (progress >= LowStockThreshold ? '#ff9800' : '#d32f2f');
            row.children[3].textContent = `${progress.toFixed(1)}%`;
        });
    }
    function updateUIMode() {
        try {
            const baseGenreSelect = document.getElementById('tornBaseGenre');
            const targetAmountInput = document.getElementById('tornTargetAmount');
            const targetAmountLabel = document.getElementById('tornTargetAmountLabel');
            if (!baseGenreSelect || !targetAmountInput || !targetAmountLabel) return;

            if (calculateByTotalDisks) {
                baseGenreSelect.classList.add('hidden');
                targetAmountLabel.textContent = 'Total Disks (e.g., 10k, 1.5m):';
                targetAmountInput.placeholder = 'Enter total disks';
            } else {
                baseGenreSelect.classList.remove('hidden');
                targetAmountLabel.textContent = 'Target for Base Genre:';
                targetAmountInput.placeholder = 'Target amount';
            }
            updateCalculations();
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in updateUIMode:', e);
        }
    }
    function updateCalculations() {
        try {
            const targetAmountInputEl = document.getElementById('tornTargetAmount');
            if (!targetAmountInputEl) return;
            const rawTargetAmount = targetAmountInputEl.value;
            let requirements = null;

            if (calculateByTotalDisks) {
                const totalDisks = parseHumanReadableNumber(rawTargetAmount);
                if (totalDisks > 0) requirements = calculateRequirementsByTotalDisks(totalDisks);
            } else {
                const baseGenre = document.getElementById('tornBaseGenre')?.value;
                const targetAmount = parseHumanReadableNumber(rawTargetAmount);
                if (baseGenre && !isNaN(targetAmount) && targetAmount > 0) {
                    requirements = calculateRequirementsByBaseGenre(baseGenre, targetAmount);
                }
            }
            updateResults(requirements);
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in updateCalculations:', e);
        }
    }
    function updateMeritTable(soldCounts, meritTarget, isUnavailable = false) {
        const tbody = document.getElementById('tornMeritTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        Object.keys(BASE_RATIOS).forEach(genre => {
            const row = tbody.insertRow();
            row.setAttribute('data-genre', genre);
            row.insertCell().textContent = genre;

            if (isUnavailable) {
                row.insertCell().textContent = 'N/A';
                row.insertCell().textContent = 'N/A';
                row.insertCell().textContent = 'N/A';
                return;
            }
            const sold = soldCounts[genre] || 0;
            const needed = Math.max(0, meritTarget - sold);
            const progress = sold >= meritTarget ? 100 : (sold / meritTarget) * 100;

            row.insertCell().textContent = sold.toLocaleString();
            row.insertCell().textContent = needed.toLocaleString();
            const progressCell = row.insertCell();
            progressCell.textContent = `${progress.toFixed(1)}%`;
            progressCell.style.color = progress >= 99.9 ? '#2e7d32' : (progress >= 50 ? '#ff9800' : '#d32f2f');
        });
    }


    // --- UI Creation and Event Handling ---
    function createUI() {
        console.log('[BootleggingCalc] createUI() called.');
        try {
            if (document.querySelector('.torn-calculator-container')) {
                console.log('[BootleggingCalc] createUI: Calculator container already exists. Aborting UI recreation.');
                return true; // Indicate UI exists or was just (re)created
            }
            const container = document.createElement('div');
            container.className = 'torn-calculator-container';
            const savedAmount = GM_getValue('targetAmount', '1000'); // Use a sensible default
            container.innerHTML = getContainerHTML(savedAmount);

            // More specific insertion point for Bootlegging page
            const bootleggingCrimeRoot = document.querySelector('.crime-root.bootlegging-root');
            if (bootleggingCrimeRoot) {
                const virtualList = bootleggingCrimeRoot.querySelector('.virtualList___noLef');
                if (virtualList && virtualList.parentNode) {
                    virtualList.parentNode.insertBefore(container, virtualList);
                    console.log('[BootleggingCalc] createUI: UI inserted successfully into bootlegging page.');
                } else {
                     // Fallback if virtualList not found within bootlegging-root, insert at top of bootlegging-root
                    bootleggingCrimeRoot.insertBefore(container, bootleggingCrimeRoot.firstChild);
                    console.warn('[BootleggingCalc] createUI: .virtualList___noLef not found in .bootlegging-root. Inserted at top of .bootlegging-root.');
                }
            } else {
                console.error('[BootleggingCalc] createUI: .bootlegging-root not found. UI not inserted.');
                return false; // Indicate UI creation failed
            }

            addEventListeners(container);
            setCollapsedState(isCalculatorCollapsed, container); // Apply saved/default collapsed state
            updateUIMode(); // Set initial UI mode for inputs
            if (showMeritTracker && !isCalculatorCollapsed) parseMeritData(); // Parse merit data if shown

            console.log('[BootleggingCalc] createUI: Finished setup.');
            return true; // Indicate UI creation success
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in createUI:', e);
            return false; // Indicate UI creation failed
        }
    }

    function getContainerHTML(savedAmount) { /* Unchanged from your v2.0 */
        return `
            <div class="calculator-header">
                <span class="calculator-title">Bootlegging Calc</span>
                <button id="calculatorCollapseToggle" title="Toggle Calculator Visibility">${isCalculatorCollapsed ? '▶' : '▼'}</button>
            </div>
            <div id="calculatorMainContent" style="${isCalculatorCollapsed ? 'display: none;' : ''}">
                <div class="torn-calculator-inputs">
                    <select id="tornBaseGenre" class="${calculateByTotalDisks ? 'hidden' : ''}">
                        ${Object.keys(BASE_RATIOS).map(genre =>
                            `<option value="${genre}" ${genre === 'Action' ? ' selected' : ''}>${genre}</option>`
                        ).join('')}
                    </select>
                    <div>
                        <label for="tornTargetAmount" id="tornTargetAmountLabel" class="torn-input-label">Target for Base Genre:</label>
                        <input type="text" id="tornTargetAmount" placeholder="Target amount" value="${savedAmount}">
                    </div>
                    <div class="ratio-toggle-container">
                        <label class="toggle-switch">
                            <input type="checkbox" id="storeRatioToggle" ${useStoreRatios ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span style="margin-right:10px;">Online Store Ratios?</span>

                        <label class="toggle-switch">
                            <input type="checkbox" id="calcModeToggle" ${calculateByTotalDisks ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Calc by Total Disks?</span>
                        <button class="options-button" id="optionsToggle">Options</button>
                        <div class="options-dropdown" id="optionsDropdown">
                            <div><label for="HighStockInput">Green %</label><input type="number" id="HighStockInput" value="${HighStockThreshold}"></div>
                            <div><label for="LowStockInput">Yellow %</label><input type="number" id="LowStockInput" value="${LowStockThreshold}"></div>
                            <div style="font-size: 12px; color: #ccc; margin-top: 8px;">Minimum % the color of the text changes</div>
                        </div>
                    </div>
                </div>
                <table class="torn-results-table">
                    <thead><tr><th>Genre</th><th>Needed</th><th>Target</th><th>Progress</th></tr></thead>
                    <tbody id="tornResultsBody"></tbody>
                </table>

                <div class="merit-tracker-toggle-container">
                    <label class="toggle-switch">
                        <input type="checkbox" id="meritTrackerToggle" ${showMeritTracker ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span>Show DVD Sold Merit Tracker? (10k each)</span>
                </div>
                <div id="meritTrackerSection" class="${showMeritTracker ? '' : 'hidden'}">
                    <p id="meritPanelMessage" style="color: #ffc107; text-align: center; margin-bottom: 5px; font-size:0.9em;"></p>
                    <table class="torn-results-table" id="tornMeritTable">
                        <thead><tr><th>Genre</th><th>Sold (Merit)</th><th>Still Needed</th><th>Merit Progress</th></tr></thead>
                        <tbody id="tornMeritTableBody"></tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function setCollapsedState(collapsed, containerElement) { /* Unchanged from your v2.0 */
        if (!containerElement) return;
        try {
            const mainContent = containerElement.querySelector('#calculatorMainContent');
            const collapseButton = containerElement.querySelector('#calculatorCollapseToggle');
            isCalculatorCollapsed = collapsed; // Update global state
            GM_setValue('isCalculatorCollapsed', isCalculatorCollapsed);

            if (isCalculatorCollapsed) {
                containerElement.classList.add('collapsed');
                if (mainContent) mainContent.style.display = 'none';
                if (collapseButton) collapseButton.innerHTML = '▶';
            } else {
                containerElement.classList.remove('collapsed');
                if (mainContent) mainContent.style.display = '';
                if (collapseButton) collapseButton.innerHTML = '▼';
                if (showMeritTracker) parseMeritData(); // Refresh merit data when uncollapsing if shown
            }
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in setCollapsedState:', e);
        }
    }

    function addEventListeners(container) { /* Unchanged from your v2.0 - ensure element checks */
        try {
            const collapseButton = container.querySelector('#calculatorCollapseToggle');
            if (collapseButton) { collapseButton.addEventListener('click', () => setCollapsedState(!isCalculatorCollapsed, container)); }
            else console.warn('[BootleggingCalc] #calculatorCollapseToggle not found for event listener.');

            const targetAmountInput = container.querySelector('#tornTargetAmount');
            if (targetAmountInput) {
                targetAmountInput.addEventListener('input', e => { GM_setValue('targetAmount', e.target.value); updateCalculations(); });
                targetAmountInput.addEventListener('change', e => { GM_setValue('targetAmount', e.target.value); updateCalculations(); });
            } else console.warn('[BootleggingCalc] #tornTargetAmount not found for event listener.');

            const storeRatioToggle = container.querySelector('#storeRatioToggle');
            if (storeRatioToggle) { storeRatioToggle.addEventListener('change', e => { useStoreRatios = e.target.checked; GM_setValue('useStoreRatios', useStoreRatios); updateCalculations(); });}
            else console.warn('[BootleggingCalc] #storeRatioToggle not found for event listener.');

            const calcModeToggle = container.querySelector('#calcModeToggle');
            if (calcModeToggle) { calcModeToggle.addEventListener('change', e => { calculateByTotalDisks = e.target.checked; GM_setValue('calculateByTotalDisks', calculateByTotalDisks); updateUIMode(); });}
            else console.warn('[BootleggingCalc] #calcModeToggle not found for event listener.');

            const tornBaseGenre = container.querySelector('#tornBaseGenre');
            if (tornBaseGenre) { tornBaseGenre.addEventListener('change', updateCalculations); }
            else console.warn('[BootleggingCalc] #tornBaseGenre not found for event listener.');

            const optionsToggle = container.querySelector('#optionsToggle');
            const optionsDropdown = container.querySelector('#optionsDropdown');
            if (optionsToggle && optionsDropdown) { optionsToggle.addEventListener('click', () => { optionsDropdown.style.display = optionsDropdown.style.display === 'block' ? 'none' : 'block'; });}
            else console.warn('[BootleggingCalc] #optionsToggle or #optionsDropdown not found for event listener.');

            const HighStockInput = container.querySelector('#HighStockInput');
            const LowStockInput = container.querySelector('#LowStockInput');
            if (HighStockInput && LowStockInput) {
                [HighStockInput, LowStockInput].forEach(input => {
                    input.addEventListener('input', () => {
                        HighStockThreshold = parseInt(container.querySelector('#HighStockInput').value, 10) || 95;
                        LowStockThreshold = parseInt(container.querySelector('#LowStockInput').value, 10) || 80;
                        GM_setValue('HighStockThreshold', HighStockThreshold);
                        GM_setValue('LowStockThreshold', LowStockThreshold);
                        updateCalculations();
                        if (showMeritTracker && !isCalculatorCollapsed) parseMeritData();
                    });
                });
            } else console.warn('[BootleggingCalc] #HighStockInput or #LowStockInput not found for event listener.');

            const meritTrackerToggle = container.querySelector('#meritTrackerToggle');
            const meritTrackerSection = container.querySelector('#meritTrackerSection');
            if (meritTrackerToggle && meritTrackerSection) {
                meritTrackerToggle.addEventListener('change', (e) => {
                    showMeritTracker = e.target.checked;
                    GM_setValue('showMeritTracker', showMeritTracker);
                    if (showMeritTracker) {
                        meritTrackerSection.classList.remove('hidden');
                        parseMeritData();
                    } else {
                        meritTrackerSection.classList.add('hidden');
                    }
                });
            } else console.warn('[BootleggingCalc] #meritTrackerToggle or #meritTrackerSection not found for event listener.');
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in addEventListeners:', e);
        }
    }


    // --- Observers and Initialization ---
    function initializeStatsPanelObserver() { /* Unchanged from your v2.0 */
        try {
            if (statsPanelObserver) statsPanelObserver.disconnect();
            const panelEl = document.querySelector('.statsPanel___q1zkf .panelContent___zLds1');
            if (!panelEl) {
                if (showMeritTracker && !isCalculatorCollapsed) parseMeritData(); // Try one parse if panel not found
                return;
            }
            statsPanelObserver = new MutationObserver(() => {
                if (showMeritTracker && !isCalculatorCollapsed) {
                    setTimeout(parseMeritData, 150); // Debounce/delay
                }
            });
            statsPanelObserver.observe(panelEl, { attributes: true, childList: true, subtree: true });
            if (showMeritTracker && !isCalculatorCollapsed) parseMeritData(); // Initial parse
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in initializeStatsPanelObserver:', e);
        }
    }

    function isBootleggingPageActive() {
        // Check for Bootlegging title and the specific root container for bootlegging
        const bootleggingTitle = document.querySelector('.appHeader___gUnYC.crimes-app-header .heading___dOsMq');
        const bootleggingRoot = document.querySelector('.crime-root.bootlegging-root');
        const onBootleggingPage = bootleggingTitle && bootleggingTitle.textContent === 'Bootlegging' && bootleggingRoot;
        // console.log(`[BootleggingCalc] isBootleggingPageActive: Title found: ${!!bootleggingTitle}, Text: ${bootleggingTitle?.textContent}, Root found: ${!!bootleggingRoot}, Result: ${onBootleggingPage}`);
        return onBootleggingPage;
    }

    function initialize() {
        console.log('[BootleggingCalc] initialize() called. Attempt #' + (initAttempts + 1));
        try {
            // More robust check for being on the actual Bootlegging page
            if (!isBootleggingPageActive()) {
                console.log('[BootleggingCalc] initialize: Not on Bootlegging page. UI will not be created.');
                // If UI exists from a previous navigation, remove it
                const existingUI = document.querySelector('.torn-calculator-container');
                if (existingUI) {
                    existingUI.remove();
                    console.log('[BootleggingCalc] initialize: Removed existing UI as no longer on Bootlegging page.');
                }
                initAttempts = 0; // Reset attempts, wait for navigation to bootlegging
                return false; // Not ready to initialize fully on this page
            }

            console.log('[BootleggingCalc] initialize: On Bootlegging page. Proceeding with setup.');

            if (!document.querySelector('.torn-calculator-container')) { // Only create if not already there
                if (!createUI()) { // createUI now returns true/false
                    console.error("[BootleggingCalc] initialize: createUI failed. Aborting this attempt.");
                    return false; // Indicate failure for this attempt
                }
            } else {
                 console.log("[BootleggingCalc] initialize: UI already present. Applying states.");
                 // Ensure states are applied even if UI was already there (e.g. from a soft navigation)
                 setCollapsedState(isCalculatorCollapsed, document.querySelector('.torn-calculator-container'));
                 updateUIMode();
                 if (showMeritTracker && !isCalculatorCollapsed) parseMeritData();
            }

            parseStockData(); // Always parse stock data if on bootlegging page
            initializeStatsPanelObserver(); // Setup observer for stats panel if on bootlegging page

            // Main observer setup (if not already set or if re-initializing)
            const reactRootContainer = document.getElementById('react-root');
            if (reactRootContainer && !mainObserver) { // Only set up mainObserver once
                mainObserver = new MutationObserver((mutationsList) => {
                    // Check if we are still on the Bootlegging page
                    if (!isBootleggingPageActive()) {
                        const existingUI = document.querySelector('.torn-calculator-container');
                        if (existingUI) {
                            existingUI.remove();
                            console.log('[BootleggingCalc] Main observer: Navigated away from Bootlegging. UI removed.');
                        }
                        // Optionally disconnect this observer if it's too noisy on other pages
                        // or rely on the initialize() check to manage UI presence.
                        return;
                    }

                    // If on Bootlegging page, check if UI needs to be (re)created
                    if (!document.querySelector('.torn-calculator-container')) {
                         console.warn('[BootleggingCalc] Main observer: UI missing on Bootlegging page. Attempting to recreate.');
                         if (createUI()) {
                             parseStockData();
                             initializeStatsPanelObserver();
                         }
                         return; // Stop further processing for this mutation batch
                    }

                    // Debounced stock parsing
                    let stockNeedsReparse = false;
                    for (const mutation of mutationsList) {
                        if (mutation.target.closest('.genreStock___IT7ld') ||
                            mutation.target.classList?.contains('currentStock___Bh9_b') ||
                            (mutation.type === 'childList' && mutation.target.closest('.virtualList___noLef'))) {
                            stockNeedsReparse = true;
                            break;
                        }
                    }
                    if (stockNeedsReparse) {
                        clearTimeout(window.stockParseTimeout);
                        window.stockParseTimeout = setTimeout(parseStockData, 350);
                    }
                });

                mainObserver.observe(reactRootContainer, {
                    childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-label']
                });
                console.log('[BootleggingCalc] initialize: Main MutationObserver set up on #react-root.');
            }
            return true; // Initialization successful for Bootlegging page
        } catch (e) {
            console.error('[BootleggingCalc] ERROR in initialize:', e);
            return false; // Indicate failure
        }
    }

    // Initial call using an interval
    console.log('[BootleggingCalc] Setting up initInterval.');
    const initInterval = setInterval(() => {
        if (initialize()) {
            console.log('[BootleggingCalc] initInterval: Initialization process for Bootlegging page complete or handled. Clearing interval.');
            clearInterval(initInterval);
        } else if (initAttempts >= MAX_INIT_ATTEMPTS) {
            console.warn('[BootleggingCalc] initInterval: Max init attempts reached. Script might not run if not on Bootlegging page or elements never appear.');
            clearInterval(initInterval);
        }
    }, INIT_RETRY_INTERVAL);

    // No need for a separate fallback poller if the mainObserver correctly handles UI disappearance
    // and initialize() handles the page context.

    console.log('[BootleggingCalc] Script execution finished initial setup. Waiting for DOM ready / initInterval.');
})();