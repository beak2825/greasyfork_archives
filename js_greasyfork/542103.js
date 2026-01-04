// ==UserScript==
// @name         BJ's Torn Market Highlighter PDA + PC
// @namespace    http://tampermonkey.net/
// @version      8.7
// @description  Highlights items on the market. Corrected initialization to ensure UI always loads.
// @author       BazookaJoe
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/imarket.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/542103/BJ%27s%20Torn%20Market%20Highlighter%20PDA%20%2B%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/542103/BJ%27s%20Torn%20Market%20Highlighter%20PDA%20%2B%20PC.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use strict';

    // --- 1. UNIVERSAL COMPATIBILITY LAYER ---
    const isStandardEnv = (typeof GM_getValue !== 'undefined' && typeof GM !== 'undefined');
    console.log(`[BJ's Market Highlighter] Running in ${isStandardEnv ? 'Standard (Tampermonkey)' : 'PDA'} mode.`);

    function saveData(key, value) { isStandardEnv ? GM_setValue(key, value) : localStorage.setItem(key, value); }
    function loadData(key, defaultValue) { const value = isStandardEnv ? GM_getValue(key) : localStorage.getItem(key); return value === null || typeof value === 'undefined' ? defaultValue : value; }
    function addGlobalStyle(css) { if (isStandardEnv) { GM_addStyle(css); } else { const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style); } }
    function makeApiRequest(url) {
        return new Promise((resolve, reject) => {
            if (isStandardEnv) {
                GM.xmlHttpRequest({
                    method: "GET", url: url,
                    onload: res => { try { const data = JSON.parse(res.responseText); if (data.error) reject(new Error(data.error.error)); else resolve(data); } catch (e) { reject(e); } },
                    onerror: err => reject(err)
                });
            } else {
                fetch(url)
                    .then(response => { if (!response.ok) throw new Error("Network response was not ok."); return response.json(); })
                    .then(data => { if (data.error) reject(new Error(data.error.error)); else resolve(data); })
                    .catch(error => reject(error));
            }
        });
    }

    // --- 2. CONFIGURATION & STATE ---
    const RENDER_DEBOUNCE = 500;
    const REFRESH_INTERVAL = 15 * 60 * 1000;
    const STORAGE_KEYS = {
        API_KEY: `BJsMarketHighlighter_${isStandardEnv ? 'tm' : 'pda'}_apiKey_v1`,
        MARKET_DATA_CACHE: `BJsMarketHighlighter_${isStandardEnv ? 'tm' : 'pda'}_cache_v1`,
        THRESHOLDS: `BJsMarketHighlighter_${isStandardEnv ? 'tm' : 'pda'}_thresholds_v1`,
        ENABLED: `BJsMarketHighlighter_${isStandardEnv ? 'tm' : 'pda'}_enabled_v1`
    };
    const DEFAULT_THRESHOLDS = { tier6: 150000, tier5: 50000, tier4: 25000, tier3: 10000, tier2: 5000, tier1: 1000 };
    let apiKey, isEnabled, cachedMarketData, highlightThresholds, renderTimeout;

    // --- 3. STYLES & CORE LOGIC ---
    function setStyles() {
        const desktopStyles = `
            #tmh-floating-container { top: 150px; right: -300px; width: 280px; padding: 15px; }
            #tmh-toggle-button { top: 150px; width: 35px; height: 50px; font-size: 16px; }
            #tmh-floating-container h3 { margin: 0 0 15px 0; padding-bottom: 10px; }
            #tmh-floating-container button { padding: 8px 12px; }
            #tmh-floating-container label { font-size: 0.9em; }
            #tmh-floating-container input[type="text"], #tmh-floating-container input[type="number"] { padding: 8px; }
            .tmh-switch { width: 60px; height: 34px; }
            .tmh-slider:before { height: 26px; width: 26px; left: 4px; bottom: 4px; }
            input:checked + .tmh-slider:before { transform: translateX(26px); }
        `;

        const pdaStyles = `
            #tmh-floating-container { top: 100px; right: -230px; width: 210px; padding: 10px; }
            #tmh-toggle-button { top: 100px; width: 30px; height: 40px; font-size: 14px; }
            #tmh-floating-container h3 { font-size: 1.1em; margin: 0 0 10px 0; padding-bottom: 8px;}
            #tmh-floating-container button { padding: 6px 10px; font-size: 0.85em; }
            #tmh-floating-container label { font-size: 0.8em; margin-bottom: 3px; }
            #tmh-floating-container input[type="text"], #tmh-floating-container input[type="number"] { padding: 5px; font-size: 0.9em; margin-bottom: 8px; }
            .tmh-switch { width: 44px; height: 24px; }
            .tmh-slider:before { height: 18px; width: 18px; left: 3px; bottom: 3px; }
            input:checked + .tmh-slider:before { transform: translateX(20px); }
        `;

        const commonStyles = `
            div[class*="itemTile___"], ul[class*="items-list___"] > li { position: relative !important; }
            #tmh-floating-container { position: fixed; z-index: 999; background-color: #333; border: 1px solid #555; border-right: none; border-top-left-radius: 10px; border-bottom-left-radius: 10px; color: white; transition: right 0.3s ease; box-shadow: -2px 2px 10px rgba(0,0,0,0.5); }
            #tmh-floating-container.expanded { right: 0; }
            #tmh-toggle-button { position: fixed; background-color: #333; color: white; border: 1px solid #555; border-right: none; border-top-left-radius: 8px; border-bottom-left-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; z-index: 1000; user-select: none; transition: background-color 0.2s; }
            #tmh-toggle-button:hover { background-color: #555; }
            #tmh-floating-container h3 { text-align: center; border-bottom: 1px solid #555; }
            #tmh-floating-container .tmh-section { margin-bottom: 15px; }
            #tmh-floating-container button { width: 100%; border: none; border-radius: 3px; cursor: pointer; font-weight: bold; margin-top: 5px; }
            .tmh-save-btn { background-color: #4CAF50; color: white; }
            .tmh-refresh-btn { background-color: #007bff; color: white; }
            #tmh-floating-container label { font-weight: bold; margin-bottom: 5px; display: block; }
            #tmh-floating-container input[type="text"], #tmh-floating-container input[type="number"] { width: calc(100% - 12px); background-color: #222; color: #eee; border: 1px solid #555; border-radius: 3px; }
            .tmh-threshold-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .tmh-threshold-grid label { margin-bottom: 2px; }
            .tmh-threshold-grid input { width: calc(100% - 10px); margin-bottom: 0; }
            .tmh-threshold-item-6 { color: #FFD700; }
            .tmh-threshold-item-5, .tmh-threshold-item-4, .tmh-threshold-item-3, .tmh-threshold-item-2, .tmh-threshold-item-1 { color: #4CAF50; }
            .tmh-profit-1 { background-color: rgba(76, 175, 80, 0.25) !important; } .tmh-profit-2 { background-color: rgba(76, 175, 80, 0.45) !important; }
            .tmh-profit-3 { background-color: rgba(76, 175, 80, 0.65) !important; } .tmh-profit-4 { background-color: rgba(76, 175, 80, 0.85) !important; }
            .tmh-profit-5 { background-color: #4CAF50 !important; } .tmh-profit-6 { background-color: #FFD700 !important; color: #333 !important; }
            .tmh-profit-tag { position: absolute; top: 5px; right: 5px; background-color: rgba(40, 167, 69, 0.85); color: white; padding: 3px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; text-shadow: 1px 1px 1px rgba(0,0,0,0.6); pointer-events: none; z-index: 2; }
            .tmh-profit-tag.negative { background-color: rgba(220, 53, 69, 0.85); }
            .tmh-profit-6 div[class*="priceAndTotal___"] > span, .tmh-profit-6 div[class*="price___"] > span { color: #000 !important; }
            .tmh-switch input { opacity: 0; width: 0; height: 0; }
            .tmh-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
            .tmh-slider:before { position: absolute; content: ""; background-color: white; transition: .4s; border-radius: 50%; }
        `;
        addGlobalStyle((isStandardEnv ? desktopStyles : pdaStyles) + commonStyles);
    }

    function fetchAllItemMarketValues(isAuto = false) {
        apiKey = ENV.load(STORAGE_KEYS.API_KEY, "");
        if (!apiKey) {
            if (!isAuto) alert("Please set your Torn API key first.");
            return;
        }
        const refreshBtn = document.querySelector('#tmh-refresh-mv-btn');
        if (refreshBtn && !isAuto) refreshBtn.textContent = 'Refreshing...';

        ENV.request(`https://api.torn.com/torn/?selections=items&key=${apiKey}`)
            .then(data => {
                if (data.items) {
                    cachedMarketData = {};
                    for (const id in data.items) cachedMarketData[id] = data.items[id].market_value;
                    ENV.save(STORAGE_KEYS.MARKET_DATA_CACHE, JSON.stringify(cachedMarketData));
                    if (!isAuto) alert("Market values refreshed successfully!");
                    debouncedProcessItems();
                }
            })
            .catch(error => { if (!isAuto) alert(`API Error: ${error.message}`); })
            .finally(() => { if (refreshBtn && !isAuto) refreshBtn.textContent = 'Refresh Market Values'; });
    }

    function processAllItems() {
        const itemElements = document.querySelectorAll('div[class*="itemTile___"], ul[class*="items-list___"] > li');
        itemElements.forEach(el => {
            for (let i = 1; i <= 6; i++) { el.classList.remove(`tmh-profit-${i}`); }
            el.querySelector('.tmh-profit-tag')?.remove();
        });

        if (!isEnabled) return;

        itemElements.forEach(itemElement => {
            try {
                const idMatch = itemElement.querySelector('img.torn-item')?.src.match(/\/images\/items\/(\d+)\//);
                const itemId = idMatch ? idMatch[1] : null;
                const priceElement = itemElement.querySelector('div[class*="priceAndTotal___"] > span:first-child, div[class*="price___"] > span');
                const price = priceElement ? parseFloat(priceElement.textContent.replace(/[$,]/g, '')) : null;
                if (!itemId || price === null || !cachedMarketData[itemId]) return;
                const marketValue = cachedMarketData[itemId];
                const potentialProfit = Math.round(marketValue - price);

                let highlightClass = '';
                if (potentialProfit >= highlightThresholds.tier6) highlightClass = 'tmh-profit-6';
                else if (potentialProfit >= highlightThresholds.tier5) highlightClass = 'tmh-profit-5';
                else if (potentialProfit >= highlightThresholds.tier4) highlightClass = 'tmh-profit-4';
                else if (potentialProfit >= highlightThresholds.tier3) highlightClass = 'tmh-profit-3';
                else if (potentialProfit >= highlightThresholds.tier2) highlightClass = 'tmh-profit-2';
                else if (potentialProfit >= highlightThresholds.tier1) highlightClass = 'tmh-profit-1';
                if (highlightClass) itemElement.classList.add(highlightClass);

                const profitTag = document.createElement('div');
                profitTag.className = 'tmh-profit-tag';
                profitTag.textContent = `$${potentialProfit.toLocaleString()}`;
                if (potentialProfit < 0) profitTag.classList.add('negative');
                itemElement.appendChild(profitTag);
            } catch (e) {}
        });
    }

    const debouncedProcessItems = () => { clearTimeout(renderTimeout); renderTimeout = setTimeout(processAllItems, RENDER_DEBOUNCE); };

    function createFloatingUI() {
        if (document.getElementById('tmh-floating-container')) return;
        const container = document.createElement('div'); container.id = 'tmh-floating-container';
        container.innerHTML = `<h3>Market Highlighter</h3><div class="tmh-section" id="tmh-api-section"><label for="tmh-api-key-input">Torn API Key:</label><input type="text" id="tmh-api-key-input" placeholder="Enter your 16-character key"><button id="tmh-save-api-btn" class="tmh-save-btn">Save Key</button></div><div class="tmh-section" style="display: flex; justify-content: space-between; align-items: center;"><label style="margin-bottom: 0;">Enable Highlights:</label><label class="tmh-switch"><input type="checkbox" id="tmh-enabled-toggle"><span class="tmh-slider"></span></label></div><div class="tmh-section"><button id="tmh-refresh-mv-btn" class="tmh-refresh-btn">Refresh Market Values</button></div><div class="tmh-section"><h3>Highlight Thresholds ($ Profit)</h3><div class="tmh-threshold-grid"><div class="tmh-threshold-item-6"><label for="tmh-tier-6">Gold ≥</label><input type="number" id="tmh-tier-6"></div><div class="tmh-threshold-item-5"><label for="tmh-tier-5">Bright ≥</label><input type="number" id="tmh-tier-5"></div><div class="tmh-threshold-item-4"><label for="tmh-tier-4">Green ≥</label><input type="number" id="tmh-tier-4"></div><div class="tmh-threshold-item-3"><label for="tmh-tier-3">Medium ≥</label><input type="number" id="tmh-tier-3"></div><div class="tmh-threshold-item-2"><label for="tmh-tier-2">Light ≥</label><input type="number" id="tmh-tier-2"></div><div class="tmh-threshold-item-1"><label for="tmh-tier-1">Faint ≥</label><input type="number" id="tmh-tier-1"></div></div><button id="tmh-save-thresholds" class="tmh-save-btn">Save Thresholds</button></div>`;
        const toggleButton = document.createElement('div'); toggleButton.id = 'tmh-toggle-button'; toggleButton.textContent = 'MH';
        toggleButton.addEventListener('click', () => { container.classList.toggle('expanded'); });
        document.body.appendChild(container); document.body.appendChild(toggleButton);

        const apiKeyInput = container.querySelector('#tmh-api-key-input');
        apiKeyInput.value = apiKey;
        for (let i = 1; i <= 6; i++) { container.querySelector(`#tmh-tier-${i}`).value = highlightThresholds[`tier${i}`]; }

        container.querySelector('#tmh-save-api-btn').addEventListener('click', () => {
            const newApiKey = apiKeyInput.value.trim();
            if (newApiKey.length === 16) {
                apiKey = newApiKey;
                ENV.save(STORAGE_KEYS.API_KEY, apiKey);
                alert('API Key Saved!');
                fetchAllItemMarketValues();
            } else {
                alert('Please enter a valid 16-character API key.');
            }
        });

        container.querySelector('#tmh-refresh-mv-btn').addEventListener('click', () => fetchAllItemMarketValues(false));
        container.querySelector('#tmh-save-thresholds').addEventListener('click', () => {
            const newThresholds = {};
            for (let i = 1; i <= 6; i++) { const val = parseInt(container.querySelector(`#tmh-tier-${i}`).value, 10); if (!isNaN(val)) newThresholds[`tier${i}`] = val; }
            highlightThresholds = newThresholds;
            ENV.save(STORAGE_KEYS.THRESHOLDS, JSON.stringify(newThresholds));
            alert("Highlight thresholds saved!"); debouncedProcessItems();
        });

        const enabledToggle = container.querySelector('#tmh-enabled-toggle');
        enabledToggle.checked = isEnabled;
        enabledToggle.addEventListener('change', () => { isEnabled = enabledToggle.checked; ENV.save(STORAGE_KEYS.ENABLED, JSON.stringify(isEnabled)); debouncedProcessItems(); });
    }

    function initialize() {
        apiKey = ENV.load(STORAGE_KEYS.API_KEY, "");
        isEnabled = JSON.parse(ENV.load(STORAGE_KEYS.ENABLED, true));
        cachedMarketData = JSON.parse(ENV.load(STORAGE_KEYS.MARKET_DATA_CACHE, "{}"));
        highlightThresholds = JSON.parse(ENV.load(STORAGE_KEYS.THRESHOLDS, JSON.stringify(DEFAULT_THRESHOLDS)));

        setStyles();
        createFloatingUI();
        if (apiKey) {
            fetchAllItemMarketValues(true);
            setInterval(() => fetchAllItemMarketValues(true), REFRESH_INTERVAL);
        }
        const mainObserver = new MutationObserver(debouncedProcessItems);
        const targetNode = document.getElementById('react-root');
        if (targetNode) mainObserver.observe(targetNode, { childList: true, subtree: true });
        window.addEventListener('hashchange', debouncedProcessItems);
        debouncedProcessItems();
    }

    // *** THIS IS THE FIX ***
    // Replace the faulty bootstrap observer with the reliable $(document).ready() from the OC script.
    $(document).ready(initialize);

})();