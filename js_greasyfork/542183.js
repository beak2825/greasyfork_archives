// ==UserScript==
// @name         BJ's Torn Market Highlighter (PDA Only)
// @namespace    http://tampermonkey.net/
// @version      5.0-pda
// @description  Highlights items by replacing the 'Buy' button text with the profit. Optimized for Torn PDA.
// @author       BazookaJoe
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/imarket.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/542183/BJ%27s%20Torn%20Market%20Highlighter%20%28PDA%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542183/BJ%27s%20Torn%20Market%20Highlighter%20%28PDA%20Only%29.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use strict';

    // --- 1. PDA-ONLY SETUP ---
    console.log("[BJ's Market Highlighter] Running in PDA-Only mode.");

    function saveData(key, value) { localStorage.setItem(key, value); }
    function loadData(key, defaultValue) { return localStorage.getItem(key) ?? defaultValue; }
    function addStyle(css) { const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style); }
    function makeApiRequest(url) {
        return fetch(url).then(response => {
            if (!response.ok) throw new Error("Network response was not ok.");
            return response.json();
        }).then(data => {
            if (data.error) throw new Error(data.error.error);
            return data;
        });
    }

    // --- 2. CONFIGURATION & STATE ---
    const RENDER_DEBOUNCE = 500;
    const REFRESH_INTERVAL = 15 * 60 * 1000;
    const STORAGE_KEYS = {
        API_KEY: 'BJsMarketHighlighter_pda_apiKey_v2',
        MARKET_DATA_CACHE: 'BJsMarketHighlighter_pda_cache_v2',
        THRESHOLDS: 'BJsMarketHighlighter_pda_thresholds_v2',
        ENABLED: 'BJsMarketHighlighter_pda_enabled_v2'
    };
    const DEFAULT_THRESHOLDS = { tier6: 150000, tier5: 50000, tier4: 25000, tier3: 10000, tier2: 5000, tier1: 1000 };
    let apiKey, isEnabled, cachedMarketData, highlightThresholds, renderTimeout;


    // --- 3. STYLES & CORE LOGIC ---
    function setStyles() {
        addStyle(`
            /* Base item styling to allow highlighting */
            div[class*="itemTile___"], ul[class*="items-list___"] > li { transition: background-color 0.3s; }

            /* Panel and Button Styles (Compact for PDA) */
            #tmh-floating-container { position: fixed; top: 100px; right: -230px; width: 210px; z-index: 999; background-color: #333; padding: 10px; border: 1px solid #555; border-right: none; border-top-left-radius: 10px; border-bottom-left-radius: 10px; color: white; transition: right 0.3s ease; box-shadow: -2px 2px 10px rgba(0,0,0,0.5); }
            #tmh-floating-container.expanded { right: 0; }
            #tmh-toggle-button { position: fixed; top: 100px; right: 0; width: 30px; height: 40px; background-color: #333; color: white; border: 1px solid #555; border-right: none; border-top-left-radius: 8px; border-bottom-left-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; z-index: 1000; user-select: none; }
            #tmh-floating-container h3 { font-size: 1.1em; margin: 0 0 10px 0; text-align: center; border-bottom: 1px solid #555; padding-bottom: 8px;}
            #tmh-floating-container button { padding: 6px 10px; font-size: 0.85em; width: 100%; border: none; border-radius: 3px; cursor: pointer; font-weight: bold; margin-top: 5px; }
            .tmh-save-btn { background-color: #4CAF50; color: white; }
            .tmh-refresh-btn { background-color: #007bff; color: white; }
            #tmh-floating-container label { font-size: 0.8em; margin-bottom: 3px; font-weight: bold; display: block; }
            #tmh-floating-container input[type="text"], #tmh-floating-container input[type="number"] { padding: 5px; font-size: 0.9em; margin-bottom: 8px; width: calc(100% - 12px); background-color: #222; color: #eee; border: 1px solid #555; border-radius: 3px; }
            .tmh-section { margin-bottom: 15px; }
            .tmh-threshold-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .tmh-threshold-grid label { margin-bottom: 2px; }
            .tmh-threshold-grid input { width: calc(100% - 10px); margin-bottom: 0; }
            .tmh-threshold-item-6 { color: #FFD700; }
            .tmh-threshold-item-5, .tmh-threshold-item-4, .tmh-threshold-item-3, .tmh-threshold-item-2, .tmh-threshold-item-1 { color: #4CAF50; }
            .tmh-switch { position: relative; display: inline-block; width: 44px; height: 24px; } .tmh-switch input { opacity: 0; width: 0; height: 0; }
            .tmh-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
            .tmh-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .tmh-slider { background-color: #4CAF50; }
            input:checked + .tmh-slider:before { transform: translateX(20px); }

            /* Highlighting Styles */
            .tmh-profit-1 { background-color: rgba(76, 175, 80, 0.25) !important; } .tmh-profit-2 { background-color: rgba(76, 175, 80, 0.45) !important; }
            .tmh-profit-3 { background-color: rgba(76, 175, 80, 0.65) !important; } .tmh-profit-4 { background-color: rgba(76, 175, 80, 0.85) !important; }
            .tmh-profit-5 { background-color: #4CAF50 !important; } .tmh-profit-6 { background-color: #FFD700 !important; color: #333 !important; }
        `);
    }

    function fetchAllItemMarketValues(isAuto = false) {
        apiKey = loadData(STORAGE_KEYS.API_KEY, "");
        if (!apiKey) {
            if (!isAuto) alert("Please set your Torn API key first.");
            return;
        }
        const refreshBtn = $('#tmh-refresh-mv-btn');
        if (refreshBtn.length && !isAuto) refreshBtn.text('Refreshing...');

        makeApiRequest(`https://api.torn.com/torn/?selections=items&key=${apiKey}`)
            .then(data => {
                if (data.items) {
                    cachedMarketData = {};
                    for (const id in data.items) cachedMarketData[id] = data.items[id].market_value;
                    saveData(STORAGE_KEYS.MARKET_DATA_CACHE, JSON.stringify(cachedMarketData));
                    if (!isAuto) alert("Market values refreshed successfully!");
                    debouncedProcessItems();
                }
            })
            .catch(error => { if (!isAuto) alert(`API Error: ${error.message}`); })
            .finally(() => { if (refreshBtn.length) refreshBtn.text('Refresh Market Values'); });
    }

    function processAllItems() {
        const itemElements = $('div[class*="itemTile___"], ul[class*="items-list___"] > li');
        if (itemElements.length === 0) return;

        itemElements.each(function() {
            const itemElement = $(this);
            // Reset previous state
            itemElement.removeClass('tmh-profit-1 tmh-profit-2 tmh-profit-3 tmh-profit-4 tmh-profit-5 tmh-profit-6');
            const buyButtonTextSpan = itemElement.find('button[class*="actionButton___"] span[class*="title___"]');
            if (buyButtonTextSpan.data('original-text')) {
                buyButtonTextSpan.text(buyButtonTextSpan.data('original-text')).css('color', '');
            }

            if (!isEnabled) return;

            try {
                const idMatch = itemElement.find('img.torn-item').attr('src')?.match(/\/images\/items\/(\d+)\//);
                const itemId = idMatch ? idMatch[1] : null;
                const priceElement = itemElement.find('div[class*="price___"] > span');
                const price = priceElement.length ? parseFloat(priceElement.text().replace(/[$,]/g, '')) : null;

                if (!itemId || price === null || !cachedMarketData[itemId]) return;

                const marketValue = cachedMarketData[itemId];
                const potentialProfit = Math.round(marketValue - price);

                // --- PDA FEATURE: Update the Buy button text ---
                if (buyButtonTextSpan.length) {
                    if (!buyButtonTextSpan.data('original-text')) {
                        buyButtonTextSpan.data('original-text', buyButtonTextSpan.text());
                    }
                    const profitPrefix = potentialProfit >= 0 ? '+' : '';
                    buyButtonTextSpan.text(`${profitPrefix}$${potentialProfit.toLocaleString()}`);

                    if (potentialProfit > 0) {
                        buyButtonTextSpan.css('color', '#50C878'); // Profit green
                    } else {
                        buyButtonTextSpan.css('color', '#E57373'); // Loss red
                    }
                }

                // Also apply background highlight
                let highlightClass = '';
                if (potentialProfit >= highlightThresholds.tier6) highlightClass = 'tmh-profit-6';
                else if (potentialProfit >= highlightThresholds.tier5) highlightClass = 'tmh-profit-5';
                else if (potentialProfit >= highlightThresholds.tier4) highlightClass = 'tmh-profit-4';
                else if (potentialProfit >= highlightThresholds.tier3) highlightClass = 'tmh-profit-3';
                else if (potentialProfit >= highlightThresholds.tier2) highlightClass = 'tmh-profit-2';
                else if (potentialProfit >= highlightThresholds.tier1) highlightClass = 'tmh-profit-1';
                if (highlightClass) itemElement.addClass(highlightClass);

            } catch (e) {}
        });
    }

    const debouncedProcessItems = () => { clearTimeout(renderTimeout); renderTimeout = setTimeout(processAllItems, RENDER_DEBOUNCE); };

    function createFloatingUI() {
        if ($('#tmh-floating-container').length) return;
        const container = $(`
            <div id="tmh-floating-container">
                <h3>Market Highlighter</h3>
                <div class="tmh-section" id="tmh-api-section">
                    <label for="tmh-api-key-input">Torn API Key:</label>
                    <input type="text" id="tmh-api-key-input" placeholder="Enter your 16-character key">
                    <button id="tmh-save-api-btn" class="tmh-save-btn">Save Key</button>
                </div>
                <div class="tmh-section" style="display: flex; justify-content: space-between; align-items: center;">
                    <label style="margin-bottom: 0;">Enable Highlights:</label>
                    <label class="tmh-switch"><input type="checkbox" id="tmh-enabled-toggle"><span class="tmh-slider"></span></label>
                </div>
                <div class="tmh-section"><button id="tmh-refresh-mv-btn" class="tmh-refresh-btn">Refresh Market Values</button></div>
                <div class="tmh-section">
                    <h3>Highlight Thresholds ($ Profit)</h3>
                    <div class="tmh-threshold-grid">
                        <div class="tmh-threshold-item-6"><label for="tmh-tier-6">Gold ≥</label><input type="number" id="tmh-tier-6"></div>
                        <div class="tmh-threshold-item-5"><label for="tmh-tier-5">Bright ≥</label><input type="number" id="tmh-tier-5"></div>
                        <div class="tmh-threshold-item-4"><label for="tmh-tier-4">Green ≥</label><input type="number" id="tmh-tier-4"></div>
                        <div class="tmh-threshold-item-3"><label for="tmh-tier-3">Medium ≥</label><input type="number" id="tmh-tier-3"></div>
                        <div class="tmh-threshold-item-2"><label for="tmh-tier-2">Light ≥</label><input type="number" id="tmh-tier-2"></div>
                        <div class="tmh-threshold-item-1"><label for="tmh-tier-1">Faint ≥</label><input type="number" id="tmh-tier-1"></div>
                    </div>
                    <button id="tmh-save-thresholds" class="tmh-save-btn">Save Thresholds</button>
                </div>
            </div>
        `).appendTo('body');

        const toggleButton = $('<div id="tmh-toggle-button">MH</div>').appendTo('body');
        toggleButton.on('click', () => container.toggleClass('expanded'));

        $('#tmh-api-key-input').val(apiKey);
        for (let i = 1; i <= 6; i++) { $(`#tmh-tier-${i}`).val(highlightThresholds[`tier${i}`]); }
        $('#tmh-enabled-toggle').prop('checked', isEnabled);

        $('#tmh-save-api-btn').on('click', () => {
            const newApiKey = $('#tmh-api-key-input').val().trim();
            if (newApiKey.length === 16) {
                apiKey = newApiKey;
                saveData(STORAGE_KEYS.API_KEY, apiKey);
                alert('API Key Saved!');
                fetchAllItemMarketValues();
            } else {
                alert('Please enter a valid 16-character API key.');
            }
        });

        $('#tmh-refresh-mv-btn').on('click', () => fetchAllItemMarketValues(false));
        $('#tmh-save-thresholds').on('click', () => { const newThresholds = {}; for (let i = 1; i <= 6; i++) { const val = parseInt($(`#tmh-tier-${i}`).val(), 10); if (!isNaN(val)) newThresholds[`tier${i}`] = val; } highlightThresholds = newThresholds; saveData(STORAGE_KEYS.THRESHOLDS, JSON.stringify(newThresholds)); alert("Highlight thresholds saved!"); debouncedProcessItems(); });
        $('#tmh-enabled-toggle').on('change', function() { isEnabled = $(this).is(':checked'); saveData(STORAGE_KEYS.ENABLED, JSON.stringify(isEnabled)); debouncedProcessItems(); });
    }

    function initialize() {
        apiKey = loadData(STORAGE_KEYS.API_KEY, "");
        isEnabled = JSON.parse(loadData(STORAGE_KEYS.ENABLED, true));
        cachedMarketData = JSON.parse(loadData(STORAGE_KEYS.MARKET_DATA_CACHE, "{}"));
        highlightThresholds = JSON.parse(loadData(STORAGE_KEYS.THRESHOLDS, JSON.stringify(DEFAULT_THRESHOLDS)));

        setStyles();
        createFloatingUI();
        if (apiKey) {
            fetchAllItemMarketValues(true);
            setInterval(() => fetchAllItemMarketValues(true), REFRESH_INTERVAL);
        }

        const targetNode = document.getElementById('react-root');
        if (targetNode) {
            const mainObserver = new MutationObserver(debouncedProcessItems);
            mainObserver.observe(targetNode, { childList: true, subtree: true });
        }
        window.addEventListener('hashchange', debouncedProcessItems);
    }

    $(document).ready(initialize);

})();