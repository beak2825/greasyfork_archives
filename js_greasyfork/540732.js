// ==UserScript==
// @name         Bazaars in Item Market Developed by Byte Core Vault(based on TornW3B's bazaar script)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Displays bazaar listings in Item Market 
// @author       Mr_Awaken[3255504]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @connect      byte-core-vault.onrender.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540732/Bazaars%20in%20Item%20Market%20Developed%20by%20Byte%20Core%20Vault%28based%20on%20TornW3B%27s%20bazaar%20script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540732/Bazaars%20in%20Item%20Market%20Developed%20by%20Byte%20Core%20Vault%28based%20on%20TornW3B%27s%20bazaar%20script%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (typeof GM_setValue === 'undefined' && typeof GM !== 'undefined') {
        const GM_getValue = function(key, defaultValue) {
            let value;
            try {
                value = localStorage.getItem('GMcompat_' + key);
                if (value !== null) {
                    return JSON.parse(value);
                }

                GM.getValue(key, defaultValue).then(val => {
                    if (val !== undefined) {
                        localStorage.setItem('GMcompat_' + key, JSON.stringify(val));
                    }
                });

                return defaultValue;
            } catch (e) {
                console.error('Error in GM_getValue compatibility:', e);
                return defaultValue;
            }
        };

        const GM_setValue = function(key, value) {
            try {
                // Store in both localStorage and GM.setValue
                localStorage.setItem('GMcompat_' + key, JSON.stringify(value));
                GM.setValue(key, value);
            } catch (e) {
                console.error('Error in GM_setValue compatibility:', e);
            }
        };

        const GM_deleteValue = function(key) {
            try {
                localStorage.removeItem('GMcompat_' + key);
                GM.deleteValue(key);
            } catch (e) {
                console.error('Error in GM_deleteValue compatibility:', e);
            }
        };

        const GM_listValues = function() {
            // This is an approximation - we can only list keys with our prefix
            const keys = [];
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('GMcompat_')) {
                        keys.push(key.substring(9)); // Remove the prefix
                    }
                }
            } catch (e) {
                console.error('Error in GM_listValues compatibility:', e);
            }
            return keys;
        };

        window.GM_getValue = GM_getValue;
        window.GM_setValue = GM_setValue;
        window.GM_deleteValue = GM_deleteValue;
        window.GM_listValues = GM_listValues;
    }

    const CACHE_DURATION_MS = 60000,
          CARD_WIDTH = 180;

    let currentSortKey = "price",
        currentSortOrder = "asc",
        allListings = [],
        currentDarkMode = document.body.classList.contains('dark-mode'),
        currentItemName = "",
        displayMode = "percentage",
        isMobileView = false;

    const scriptSettings = {
        defaultSort: "price",
        defaultOrder: "asc",
        apiKey: "",
        listingFee: parseFloat(GM_getValue("bytecoreListingFee") || "0"),
        defaultDisplayMode: "percentage",
        linkBehavior: GM_getValue("bytecoreLinkBehavior") || "new_tab"
    };

    // Missing functions - add these back
    let cachedItemsData = null;
    function getByteCoreStoredItems() {
        if (cachedItemsData === null) {
            try {
                cachedItemsData = JSON.parse(GM_getValue("bytecoreItems") || "{}");
            } catch (e) {
                cachedItemsData = {};
                console.error("Stored items got funky:", e);
            }
        }
        return cachedItemsData;
    }

    // Add alias for consistency
    function getStoredItems() {
        return getByteCoreStoredItems();
    }

    function getByteCoreCache(itemId) {
        try {
            const key = "bytecoreCache_" + itemId,
                  cached = GM_getValue(key);
            if (cached) {
                const payload = JSON.parse(cached);
                if (Date.now() - payload.timestamp < CACHE_DURATION_MS) return payload.data;
            }
        } catch (e) {}
        return null;
    }

    function setByteCoreCache(itemId, data) {
        try {
            GM_setValue("bytecoreCache_" + itemId, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (e) {}
    }

    // Add aliases for consistency
    function getCache(itemId) {
        return getByteCoreCache(itemId);
    }

    function setCache(itemId, data) {
        return setByteCoreCache(itemId, data);
    }

    const updateStyles = () => {
        let styleEl = document.getElementById('bazaar-enhanced-styles');

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'bazaar-enhanced-styles';
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = `
            .bytecore-profit-tooltip {
                position: fixed;
                background: ${currentDarkMode ? '#333' : '#fff'};
                color: ${currentDarkMode ? '#fff' : '#333'};
                border: 1px solid ${currentDarkMode ? '#555' : '#ddd'};
                padding: 10px 14px;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                z-index: 99999;
                min-width: 200px;
                max-width: 280px;
                width: auto;
                pointer-events: none;
                transition: opacity 0.2s ease;
                font-size: 13px;
                line-height: 1.4;
            }

            @media (max-width: 768px) {
                .bytecore-profit-tooltip {
                    font-size: 12px;
                    max-width: 260px;
                    padding: 8px 12px;
                }
            }
        `;
    };

    updateStyles();

    const darkModeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const newDarkMode = document.body.classList.contains('dark-mode');
                if (newDarkMode !== currentDarkMode) {
                    currentDarkMode = newDarkMode;
                    updateStyles();
                }
            }
        });
    });
    darkModeObserver.observe(document.body, { attributes: true });

    function checkMobileView() {
        isMobileView = window.innerWidth < 784;
        return isMobileView;
    }
    checkMobileView();
    window.addEventListener('resize', function() {
        checkMobileView();
        processMobileSellerList();
    });

    function loadByteCoreSettings() {
        try {
            const saved = GM_getValue("bytecoreSettings");
            if (saved) {
                const parsedSettings = JSON.parse(saved);

                Object.assign(scriptSettings, parsedSettings);

                if (parsedSettings.defaultSort) {
                    currentSortKey = parsedSettings.defaultSort;
                }
                if (parsedSettings.defaultOrder) {
                    currentSortOrder = parsedSettings.defaultOrder;
                }
                if (parsedSettings.defaultDisplayMode) {
                    displayMode = parsedSettings.defaultDisplayMode;
                }
            }
        } catch (e) {
            console.error("Oops, settings failed to load:", e);
        }
    }

    function saveByteCoreSettings() {
        try {
            GM_setValue("bytecoreSettings", JSON.stringify(scriptSettings));
            GM_setValue("bytecoreApiKey", scriptSettings.apiKey || "");
            GM_setValue("bytecoreDefaultSort", scriptSettings.defaultSort || "price");
            GM_setValue("bytecoreDefaultOrder", scriptSettings.defaultOrder || "asc");
            GM_setValue("bytecoreListingFee", scriptSettings.listingFee || 0);
            GM_setValue("bytecoreDefaultDisplayMode", scriptSettings.defaultDisplayMode || "percentage");
            GM_setValue("bytecoreLinkBehavior", scriptSettings.linkBehavior || "new_tab");
        } catch (e) {
            console.error("Settings save hiccup:", e);
        }
    }

    // Add alias for consistency
    function saveSettings() {
        return saveByteCoreSettings();
    }

    loadByteCoreSettings();

    const style = document.createElement("style");
    style.textContent = `
        .bytecore-button {
            padding: 3px 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #fff;
            color: #000;
            cursor: pointer;
            font-size: 12px;
            margin-left: 4px;
        }
        .dark-mode .bytecore-button {
            border: 1px solid #444;
            background-color: #1a1a1a;
            color: #fff;
        }
        .bytecore-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
        }
        .bytecore-info-container {
            font-size: 13px;
            border-radius: 8px;
            margin: 8px 0;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
            color: #1a365d;
            border: 2px solid #3182ce;
            box-sizing: border-box;
            width: 100%;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(49, 130, 206, 0.15);
        }
        .dark-mode .bytecore-info-container {
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            color: #e2e8f0;
            border: 2px solid #4299e1;
            box-shadow: 0 4px 12px rgba(66, 153, 225, 0.25);
        }
        .bytecore-info-header {
            font-size: 18px;
            font-weight: 600;
            color: #2b6cb0;
            text-align: center;
            padding: 8px 0;
            border-bottom: 2px solid #3182ce;
            margin-bottom: 5px;
        }
        .dark-mode .bytecore-info-header {
            color: #63b3ed;
            border-bottom-color: #4299e1;
        }
        .bytecore-sort-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            border: none;
            color: white;
            box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
            flex-wrap: nowrap;
            overflow-x: auto;
        }
        .dark-mode .bytecore-sort-controls {
            background: linear-gradient(135deg, #4c51bf 0%, #553c9a 100%);
            box-shadow: 0 3px 8px rgba(76, 81, 191, 0.4);
        }
        @media (max-width: 768px) {
            .bytecore-sort-controls {
                padding: 10px;
                gap: 6px;
            }
            .bytecore-sort-controls > * {
                flex-shrink: 0;
            }
        }
        .bytecore-sort-select {
            padding: 6px 28px 6px 12px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 6px;
            background: rgba(255,255,255,0.9) url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGw1IDYgNS02eiIgZmlsbD0iIzQ5NTFiZiIvPjwvc3ZnPg==") no-repeat right 10px center;
            background-size: 12px 7px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;
            color: #4c51bf;
            font-weight: 500;
            min-width: 80px;
            flex-shrink: 0;
        }
        .bytecore-profit-tooltip {
            position: fixed;
            background: #fff;
            color: #333;
            border: 1px solid #ddd;
            padding: 8px 12px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            z-index: 99999;
            min-width: 200px;
            max-width: 280px;
            width: auto;
            pointer-events: none;
            transition: opacity 0.2s ease;
        }
        .dark-mode .bytecore-profit-tooltip {
            background: #333;
            color: #fff;
            border: 1px solid #555;
        }
        .dark-mode .bytecore-sort-select {
            border: 2px solid rgba(255,255,255,0.2);
            background: rgba(45, 55, 72, 0.9) url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGw1IDYgNS02eiIgZmlsbD0iIzYzYjNlZCIvPjwvc3ZnPg==") no-repeat right 10px center;
            color: #e2e8f0;
            background-size: 12px 7px;
        }
        .bytecore-sort-select:focus {
            outline: none;
            border-color: #63b3ed;
            box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.3);
        }
        .bytecore-min-qty {
            background-color: rgba(255,255,255,0.9);
            color: #4c51bf;
            font-size: 12px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 6px;
            padding: 6px 8px;
            width: 50px !important;
            min-width: 50px;
            flex-shrink: 0;
            font-weight: 500;
        }
        .dark-mode .bytecore-min-qty {
            border: 2px solid rgba(255,255,255,0.2);
            background-color: rgba(45, 55, 72, 0.9);
            color: #e2e8f0;
        }
        .bytecore-min-qty:focus {
            outline: none;
            border-color: #63b3ed !important;
            box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.3);
        }
        .bytecore-button {
            padding: 6px 12px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 6px;
            background: rgba(255,255,255,0.9);
            color: #4c51bf;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .dark-mode .bytecore-button {
            border: 2px solid rgba(255,255,255,0.2);
            background: rgba(45, 55, 72, 0.9);
            color: #e2e8f0;
        }
        .bytecore-table-container {
            width: 100%;
            overflow-x: auto;
            border-radius: 6px;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 900px;
            margin: 0 auto;
        }
        .dark-mode .bytecore-table-container {
            background: #2d3748;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .bytecore-listings-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            min-width: 650px;
        }
        .bytecore-table-header {
            background-color: #4a90e2;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
        }
        .dark-mode .bytecore-table-header {
            background-color: #3182ce;
        }
        .bytecore-table-header th {
            padding: 18px 20px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            white-space: nowrap;
            font-size: 13px;
        }
        .dark-mode .bytecore-table-header th {
            border-bottom-color: #4a5568;
        }
        .bytecore-table-row {
            border-bottom: 1px solid #ddd;
            transition: background-color 0.2s ease;
        }
        .bytecore-table-row:nth-child(even) {
            background-color: #f9f9f9;
        }
        .bytecore-table-row:hover {
            background-color: #f1f1f1;
        }
        .dark-mode .bytecore-table-row {
            border-bottom-color: #4a5568;
        }
        .dark-mode .bytecore-table-row:nth-child(even) {
            background-color: #374151;
        }
        .dark-mode .bytecore-table-row:hover {
            background-color: #4a5568;
        }
        .bytecore-table-row td {
            padding: 18px 20px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            vertical-align: middle;
            font-size: 14px;
            color: #1a202c;
        }
        .dark-mode .bytecore-table-row td {
            border-bottom-color: #4a5568;
            color: #f7fafc;
        }
        .dark-mode .bytecore-table-row td[style*="color: #065f46"] {
            color: #10b981 !important;
        }
        .dark-mode .bytecore-table-row td[style*="color: #1e40af"] {
            color: #60a5fa !important;
        }
        .dark-mode .bytecore-table-row td[style*="color: #b45309"] {
            color: #f59e0b !important;
        }
        .dark-mode .bytecore-table-row td[style*="color: #374151"] {
            color: #d1d5db !important;
        }
        .bytecore-view-all-container {
            margin-top: 10px;
        }
        @media (max-width: 768px) {
            .bytecore-table-container {
                max-width: 100%;
                margin: 0;
            }
            .bytecore-listings-table {
                font-size: 13px;
                min-width: 600px;
            }
            .bytecore-table-header th {
                padding: 15px 10px;
                font-size: 12px;
            }
            .bytecore-table-row td {
                padding: 15px 10px;
                font-size: 13px;
            }
        }
        .bytecore-settings-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
        }
        .bytecore-settings-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 2px solid #cbd5e0;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .dark-mode .bytecore-settings-card {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            border-color: #718096;
        }
        .bytecore-settings-card h3 {
            margin: 0 0 15px 0;
            color: #2d3748;
            font-size: 16px;
            font-weight: 600;
        }
        .dark-mode .bytecore-settings-card h3 {
            color: #e2e8f0;
        }
        .bytecore-settings-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        .bytecore-settings-row label {
            font-weight: 500;
            color: #4a5568;
            min-width: 120px;
        }
        .dark-mode .bytecore-settings-row label {
            color: #cbd5e0;
        }
        .bytecore-modern-select {
            padding: 8px 12px;
            border: 2px solid #cbd5e0;
            border-radius: 8px;
            background: white;
            color: #2d3748;
            font-weight: 500;
            min-width: 150px;
        }
        .dark-mode .bytecore-modern-select {
            background: #4a5568;
            border-color: #718096;
            color: #e2e8f0;
        }
        .bytecore-modern-input {
            padding: 8px 12px;
            border: 2px solid #cbd5e0;
            border-radius: 8px;
            background: white;
            color: #2d3748;
            font-weight: 500;
            min-width: 80px;
        }
        .dark-mode .bytecore-modern-input {
            background: #4a5568;
            border-color: #718096;
            color: #e2e8f0;
        }
        .bytecore-refresh-btn {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
        }
        .bytecore-tools-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 20px;
        }
        .bytecore-tool-card {
            background: rgba(66, 153, 225, 0.1);
            border: 1px solid #4299e1;
            border-radius: 8px;
            padding: 15px;
        }
        .bytecore-tool-card h4 {
            margin: 0 0 8px 0;
            color: #2b6cb0;
            font-size: 14px;
        }
        .bytecore-tool-card p {
            margin: 0;
            font-size: 12px;
            color: #4a5568;
        }
        .dark-mode .bytecore-tool-card {
            background: rgba(66, 153, 225, 0.2);
        }
        .dark-mode .bytecore-tool-card h4 {
            color: #63b3ed;
        }
        .dark-mode .bytecore-tool-card p {
            color: #cbd5e0;
        }
        .bytecore-settings-modal {
            background-color: #fff;
            border-radius: 8px;
            padding: 24px;
            width: 500px;
            max-width: 95vw;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            position: relative;
            z-index: 100000;
            font-family: 'Arial', sans-serif;
        }
        .dark-mode .bytecore-settings-modal {
            background-color: #2a2a2a;
            color: #e0e0e0;
            border: 1px solid #444;
        }
        .bytecore-settings-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
        }
        .dark-mode .bytecore-settings-title {
            color: #fff;
        }
        .bytecore-tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
            padding-bottom: 0;
            flex-wrap: wrap;
        }
        .dark-mode .bytecore-tabs {
            border-bottom: 1px solid #444;
        }
        .bytecore-tab {
            padding: 10px 16px;
            cursor: pointer;
            margin-right: 5px;
            margin-bottom: 5px;
            border: 1px solid transparent;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            font-weight: normal;
            background-color: #f5f5f5;
            color: #555;
            position: relative;
            bottom: -1px;
        }
        .dark-mode .bytecore-tab {
            background-color: #333;
            color: #ccc;
        }
        .bytecore-tab.active {
            background-color: #fff;
            color: #333;
            border-color: #ddd;
            font-weight: bold;
            padding-bottom: 11px;
        }
        .dark-mode .bytecore-tab.active {
            background-color: #2a2a2a;
            color: #fff;
            border-color: #444;
        }
        .bytecore-tab-content {
            display: none;
        }
        .bytecore-tab-content.active {
            display: block;
        }
        .bytecore-settings-group {
            margin-bottom: 20px;
        }
        .bytecore-settings-item {
            margin-bottom: 18px;
        }
        .bytecore-settings-item label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 14px;
        }
        .bytecore-settings-item input[type="text"],
        .bytecore-settings-item select,
        .bytecore-number-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            background-color: #fff;
            color: #333;
            max-width: 200px;
        }
        .dark-mode .bytecore-settings-item input[type="text"],
        .dark-mode .bytecore-settings-item select,
        .dark-mode .bytecore-number-input {
            border: 1px solid #444;
            background-color: #222;
            color: #e0e0e0;
        }
        .bytecore-settings-item select {
            max-width: 200px;
        }
        .bytecore-number-input {
            -moz-appearance: textfield;
            appearance: textfield;
            width: 60px !important;
        }
        .bytecore-number-input::-webkit-outer-spin-button,
        .bytecore-number-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .bytecore-api-note {
            font-size: 12px;
            margin-top: 6px;
            color: #666;
            line-height: 1.4;
        }
        .dark-mode .bytecore-api-note {
            color: #aaa;
        }
        .bytecore-script-item {
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eee;
        }
        .dark-mode .bytecore-script-item {
            border-bottom: 1px solid #333;
        }
        .bytecore-script-item:last-child {
            border-bottom: none;
        }
        .bytecore-script-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }
        .bytecore-script-desc {
            margin-bottom: 8px;
            line-height: 1.4;
            color: #555;
        }
        .dark-mode .bytecore-script-desc {
            color: #bbb;
        }
        .bytecore-script-link {
            display: inline-block;
            margin-top: 5px;
            color: #2196F3;
            text-decoration: none;
        }
        .bytecore-script-link:hover {
            text-decoration: underline;
        }
        .bytecore-changelog {
            margin-bottom: 20px;
        }
        .bytecore-changelog-version {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 15px;
        }
        .bytecore-changelog-date {
            font-style: italic;
            color: #666;
            font-size: 13px;
            margin-bottom: 5px;
        }
        .dark-mode .bytecore-changelog-date {
            color: #aaa;
        }
        .bytecore-changelog-list {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .bytecore-changelog-item {
            margin-bottom: 5px;
            line-height: 1.4;
        }
        .bytecore-credits {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .dark-mode .bytecore-credits {
            border-top: 1px solid #444;
        }
        .bytecore-credits h3 {
            font-size: 16px;
            margin-bottom: 10px;
        }
        .bytecore-credits p {
            line-height: 1.4;
            margin-bottom: 8px;        }
        .bytecore-provider {
            font-weight: bold;
        }
        .bytecore-settings-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 30px;
        }
        .bytecore-settings-save,
        .bytecore-settings-cancel {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            font-weight: bold;
        }
        .bytecore-settings-save {
            background-color: #4CAF50;
            color: white;
        }
        .bytecore-settings-save:hover {
            background-color: #45a049;
        }
        .bytecore-settings-cancel {
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
        }
        .dark-mode .bytecore-settings-cancel {
            background-color: #333;
            color: #e0e0e0;
            border: 1px solid #444;
        }
        .bytecore-settings-cancel:hover {
            background-color: #e9e9e9;
        }
        .dark-mode .bytecore-settings-cancel:hover {
            background-color: #444 !important;
            border-color: #555 !important;
        }
        .bytecore-settings-footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-align: center;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .dark-mode .bytecore-settings-footer {
            color: #999;
            border-top: 1px solid #444;
        }
        .bytecore-settings-footer a {
            color: #2196F3;
            text-decoration: none;
        }
        .bytecore-settings-footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .bytecore-settings-modal {
                padding: 16px;
                width: 100%;
                max-width: 100%;
                border-radius: 0;
                max-height: 100vh;
            }
            .bytecore-settings-title {
                font-size: 18px;
                margin-bottom: 16px;
            }
            .bytecore-tab {
                padding: 8px 12px;
                font-size: 14px;
            }
            .bytecore-settings-item label {
                font-size: 13px;
            }
            .bytecore-settings-item input[type="text"],
            .bytecore-settings-item select,
            .bytecore-number-input {
                padding: 6px 10px;
                font-size: 13px;
                max-width: 100%;
            }
            .bytecore-settings-item {
                margin-bottom: 14px;
            }
            .bytecore-settings-save,
            .bytecore-settings-cancel {
                padding: 6px 12px;
                font-size: 13px;
            }
            .bytecore-api-note {
                font-size: 11px;
            }
            .bytecore-settings-buttons {
                margin-top: 20px;
            }
            .bytecore-settings-footer {
                font-size: 11px;
            }
        }
    `;
    document.head.appendChild(style);

    function fetchJSON(url, callback) {
        let retryCount = 0;
        const MAX_RETRIES = 2;
        const TIMEOUT_MS = 10000;
        const RETRY_DELAY_MS = 2000;

        function makeRequest(options) {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                return GM_xmlhttpRequest(options);
            } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined') {
                return GM.xmlHttpRequest(options);
            } else {
                console.error('Neither GM_xmlhttpRequest nor GM.xmlHttpRequest are available');
                options.onerror && options.onerror(new Error('XMLHttpRequest API not available'));
                return null;
            }
        }

        function attemptFetch() {
            let timeoutId = setTimeout(() => {
                console.warn(`Request to ${url} timed out, ${retryCount < MAX_RETRIES ? 'retrying...' : 'giving up.'}`);
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    setTimeout(attemptFetch, RETRY_DELAY_MS);
                } else {
                    callback(null);
                }
            }, TIMEOUT_MS);

            makeRequest({
                method: 'GET',
                url,
                timeout: TIMEOUT_MS,
                onload: res => {
                    clearTimeout(timeoutId);
                    try {
                        if (res.status >= 200 && res.status < 300) {
                            callback(JSON.parse(res.responseText));
                        } else {
                            console.warn(`Request to ${url} failed with status ${res.status}`);
                            if (retryCount < MAX_RETRIES) {
                                retryCount++;
                                setTimeout(attemptFetch, RETRY_DELAY_MS);
                            } else {
                                callback(null);
                            }
                        }
                    } catch (e) {
                        console.error(`Error parsing response from ${url}:`, e);
                        callback(null);
                    }
                },
                onerror: (error) => {
                    clearTimeout(timeoutId);
                    console.warn(`Request to ${url} failed:`, error);
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        setTimeout(attemptFetch, RETRY_DELAY_MS);
                    } else {
                        callback(null);
                    }
                },
                ontimeout: () => {
                    clearTimeout(timeoutId);
                    console.warn(`Request to ${url} timed out natively`);
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        setTimeout(attemptFetch, RETRY_DELAY_MS);
                    } else {
                        callback(null);
                    }
                }
            });
        }
        attemptFetch();
    }

    function getRelativeTime(ts) {
        const diffSec = Math.floor((Date.now() - ts * 1000) / 1000);
        if (diffSec < 60) return diffSec + 's ago';
        if (diffSec < 3600) return Math.floor(diffSec / 60) + 'm ago';
        if (diffSec < 86400) return Math.floor(diffSec / 3600) + 'h ago';
        return Math.floor(diffSec / 86400) + 'd ago';
    }

    const svgTemplates = {
        rightArrow: `<svg viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5-45.3 0l192 192z"/></svg>`,
        leftArrow: `<svg viewBox="0 0 320 512"><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`,
        warningIcon: `<path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>`,
        infoIcon: `<path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>`
    };

    function createListingRow(listing, index) {
        const row = document.createElement('tr');
        row.className = 'bytecore-table-row';
        row.dataset.index = index;
        const listingKey = listing.player_id + '-' + listing.price + '-' + listing.quantity;
        row.dataset.listingKey = listingKey;
        row.dataset.quantity = listing.quantity;

        let profileVisitedColor = '#3182ce';
        try {
            const key = `visited_profile_${listing.player_id}`;
            const data = JSON.parse(GM_getValue(key));
            if (data && data.lastClicked) {
                profileVisitedColor = '#805ad5';
            }
        } catch (e) {}

        const displayName = listing.player_name || listing.player_id;

        // Profile link for username
        const profileLink = scriptSettings.linkBehavior === "new_tab" 
            ? `<a href="https://www.torn.com/profiles.php?XID=${listing.player_id}" target="_blank" style="color: ${profileVisitedColor}; text-decoration: none; font-weight: 500;">${displayName}</a>`
            : scriptSettings.linkBehavior === "new_window"
            ? `<a href="https://www.torn.com/profiles.php?XID=${listing.player_id}" target="_blank" onclick="window.open(this.href, '_blank', 'width=800,height=600'); return false;" style="color: ${profileVisitedColor}; text-decoration: none; font-weight: 500;">${displayName}</a>`
            : `<a href="https://www.torn.com/profiles.php?XID=${listing.player_id}" style="color: ${profileVisitedColor}; text-decoration: none; font-weight: 500;">${displayName}</a>`;

        // Bazaar link button
        const bazaarLink = scriptSettings.linkBehavior === "new_tab" 
            ? `<a href="https://www.torn.com/bazaar.php?userId=${listing.player_id}&itemId=${listing.item_id}&highlight=1#/" target="_blank" style="background: #4299e1; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500; display: inline-block; margin: 4px 0; min-width: 90px; text-align: center;">View Bazaar</a>`
            : scriptSettings.linkBehavior === "new_window"
            ? `<a href="https://www.torn.com/bazaar.php?userId=${listing.player_id}&itemId=${listing.item_id}&highlight=1#/" target="_blank" onclick="window.open(this.href, '_blank', 'width=800,height=600'); return false;" style="background: #4299e1; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500; display: inline-block; margin: 4px 0; min-width: 90px; text-align: center;">View Bazaar</a>`
            : `<a href="https://www.torn.com/bazaar.php?userId=${listing.player_id}&itemId=${listing.item_id}&highlight=1#/" style="background: #4299e1; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500; display: inline-block; margin: 4px 0; min-width: 90px; text-align: center;">View Bazaar</a>`;

        // Get market value from listing if available
        let marketValue = '';
        if (listing.marketPrice || listing.market_price) {
            const price = listing.marketPrice || listing.market_price;
            marketValue = `$${price.toLocaleString()}`;
        } else {
            // Try to get from stored items
            const stored = getStoredItems();
            const match = Object.values(stored).find(item =>
                item.name && item.name.toLowerCase() === currentItemName.toLowerCase());
            if (match && match.market_value) {
                marketValue = `$${Number(match.market_value).toLocaleString()}`;
            } else {
                const priceComparison = getPriceComparisonHtml(listing.price, listing.quantity);
                marketValue = priceComparison || 'N/A';
            }
        }

        const relativeTime = getRelativeTime(listing.updated);
        const formattedPrice = `$${listing.price.toLocaleString()}`;
        const formattedQuantity = listing.quantity.toLocaleString();
        const totalCost = listing.price * listing.quantity;

        // Calculate profit/loss for display under unit price
        let profitLossDisplay = '';
        try {
            const stored = getStoredItems();
            const match = Object.values(stored).find(item =>
                item.name && item.name.toLowerCase() === currentItemName.toLowerCase());
            if (match && match.market_value) {
                const marketValue = Number(match.market_value);
                const listingFee = scriptSettings.listingFee || 0;
                const feePerItem = Math.ceil(marketValue * (listingFee / 100));
                const netRevenuePerItem = marketValue - feePerItem;
                const profitPerItem = netRevenuePerItem - listing.price;

                let color, text;
                if (profitPerItem > 0) {
                    color = '#10b981'; // Green for profit
                    text = `+$${profitPerItem.toLocaleString()}`;
                } else if (profitPerItem < 0) {
                    color = '#ef4444'; // Red for loss
                    text = `-$${Math.abs(profitPerItem).toLocaleString()}`;
                } else {
                    color = '#6b7280'; // Gray for break-even
                    text = '$0';
                }

                profitLossDisplay = `<div style="font-size: 10px; color: ${color}; font-weight: 600; margin-top: 2px;">${text}</div>`;
            }
        } catch (e) {
            console.error("Profit/loss display error:", e);
        }

        row.innerHTML = `
            <td style="text-align: left; padding-left: 15px;">${profileLink}</td>
            <td style="font-weight: 700; color: #065f46; font-size: 15px;">
                ${formattedPrice}
                ${profitLossDisplay}
            </td>
            <td style="font-weight: 600; color: #1e40af;">${formattedQuantity}</td>
            <td style="font-weight: 600; color: #b45309; font-size: 15px;">$${totalCost.toLocaleString()}</td>
            <td style="font-size: 12px; color: #374151;">${marketValue}</td>
            <td style="padding: 12px 20px;">${bazaarLink}</td>
            <td style="font-size: 12px; color: #6b7280; padding-right: 15px;">${relativeTime}</td>
        `;

        // Add click tracking for profile link
        const profileLinkEl = row.querySelector('a[href*="profiles.php"]');
        if (profileLinkEl) {
            profileLinkEl.addEventListener('click', () => {
                const key = `visited_profile_${listing.player_id}`;
                GM_setValue(key, JSON.stringify({ lastClicked: Date.now() }));
                profileLinkEl.style.color = '#805ad5';
            });
        }

        return row;
    }

    function getPriceComparisonHtml(listingPrice, quantity) {
        try {
            const stored = getStoredItems();
            const match = Object.values(stored).find(item =>
                item.name && item.name.toLowerCase() === currentItemName.toLowerCase());
            if (match && match.market_value) {
                const marketValue = Number(match.market_value),
                      percentDiff = ((listingPrice / marketValue) - 1) * 100,
                      listingFee = scriptSettings.listingFee || 0,
                      // Calculate per single item
                      feePerItem = Math.ceil(marketValue * (listingFee / 100)),
                      netRevenuePerItem = marketValue - feePerItem,
                      profitPerItem = netRevenuePerItem - listingPrice,
                      minResellPrice = Math.ceil(listingPrice / (1 - (listingFee / 100)));

                let color, text;
                const absProfit = Math.abs(profitPerItem);
                let abbrevValue = profitPerItem < 0 ? '-' : '';
                if (absProfit >= 1000000) {
                    abbrevValue += '$' + (absProfit / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
                } else if (absProfit >= 1000) {
                    abbrevValue += '$' + (absProfit / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                } else {
                    abbrevValue += '$' + absProfit;
                }
                if (profitPerItem > 0) {
                    color = currentDarkMode ? '#7fff7f' : '#006400';
                    text = displayMode === "percentage" ? `(${percentDiff.toFixed(1)}%)` : `(${abbrevValue})`;
                } else if (profitPerItem < 0) {
                    color = currentDarkMode ? '#ff7f7f' : '#8b0000';
                    text = displayMode === "percentage" ? `(+${percentDiff.toFixed(1)}%)` : `(${abbrevValue})`;
                } else {
                    color = currentDarkMode ? '#cccccc' : '#666666';
                    text = displayMode === "percentage" ? `(0%)` : `($0)`;
                }

                // Tooltip shows per-item calculation
                const tooltipContent = `
                    <div style="font-weight:bold; font-size:13px; margin-bottom:6px; text-align:center;">
                        ${profitPerItem >= 0 ? 'PROFIT' : 'LOSS'} PER ITEM: ${profitPerItem >= 0 ? '$' : '-$'}${Math.abs(profitPerItem).toLocaleString()}
                    </div>
                    <hr style="margin: 4px 0; border-color: ${currentDarkMode ? '#444' : '#ddd'}">
                    <div>Purchase Price: $${listingPrice.toLocaleString()}</div>
                    <div>Market Value: $${marketValue.toLocaleString()}</div>
                    ${listingFee > 0 ? `<div>Sale Fee (${listingFee}%): $${feePerItem.toLocaleString()}</div>` : ''}
                    <div>Net Revenue: $${netRevenuePerItem.toLocaleString()}</div>
                    ${listingFee > 0 ? `<div style="margin-top:6px; font-weight:bold;">Min. Resell Price: $${minResellPrice.toLocaleString()}</div>` : ''}
                `;
                const span = document.createElement('span');
                span.style.fontWeight = 'bold';
                span.style.fontSize = '10px';
                span.style.padding = '0 4px';
                span.style.borderRadius = '2px';
                span.style.color = color;
                span.style.cursor = 'help';
                span.style.whiteSpace = 'nowrap';
                span.textContent = text;
                span.className = 'bytecore-price-comparison';
                span.setAttribute('data-tooltip', tooltipContent);
                return span.outerHTML;
            }
        } catch (e) {
            console.error("Price comparison error:", e);
        }
        return '';
    }

    function renderTableRows(infoContainer) {
        const tableContainer = infoContainer.querySelector('.bytecore-table-container');
        if (!tableContainer || !infoContainer.isConnected) return;
        try {
            const minQtyInput = infoContainer.querySelector('.bytecore-min-qty');
            const minQty = minQtyInput && minQtyInput.value ? parseInt(minQtyInput.value, 10) : 0;
            if (!infoContainer.originalListings && allListings && allListings.length > 0) {
                infoContainer.originalListings = [...allListings];
            }
            if ((!allListings || allListings.length === 0) && infoContainer.originalListings) {
                allListings = [...infoContainer.originalListings];
            }
            const filteredListings = minQty > 0 ? allListings.filter(listing => listing.quantity >= minQty) : allListings;
            const tbody = tableContainer.querySelector('tbody');

            if (!tbody) return;

            if (filteredListings.length === 0 && allListings.length > 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #666; padding: 30px;">No listings found with quantity â‰¥ ${minQty}. Try a lower value.</td></tr>`;
                return;
            }

            tbody.innerHTML = '';

            // Show only top 3 listings initially
            const isExpanded = tableContainer.dataset.expanded === 'true';
            const listingsToShow = isExpanded ? filteredListings : filteredListings.slice(0, 3);

            listingsToShow.forEach((listing, index) => {
                const row = createListingRow(listing, index);
                tbody.appendChild(row);
            });

            // Show/hide view all button
            const viewAllContainer = infoContainer.querySelector('.bytecore-view-all-container');
            if (viewAllContainer) {
                const btn = viewAllContainer.querySelector('.bytecore-view-all-btn');
                if (filteredListings.length > 3) {
                    viewAllContainer.style.display = 'block';
                    if (btn) {
                        if (isExpanded) {
                            btn.textContent = 'Show Less';
                        } else {
                            btn.textContent = `View All ${filteredListings.length} Listings`;
                        }
                        // Ensure button is clickable
                        btn.style.pointerEvents = 'auto';
                        btn.disabled = false;
                    }
                } else {
                    viewAllContainer.style.display = 'none';
                    // Reset expanded state when there are few listings
                    if (tableContainer) {
                        tableContainer.dataset.expanded = 'false';
                    }
                }
            }

            // Update footer count
            const footerNote = infoContainer.querySelector('.bytecore-listing-footnote');
            if (footerNote) {
                footerNote.textContent = `Displaying ${filteredListings.length} listings available`;
            }
        } catch (error) {
            console.error("Error rendering table rows:", error);
        }
    }

    function createInfoContainer(itemName, itemId) {
        const container = document.createElement('div');
        container.className = 'bytecore-info-container';
        container.dataset.itemid = itemId;
        currentItemName = itemName;
        const header = document.createElement('div');
        header.className = 'bytecore-info-header';
        let marketValueText = "";
        try {
            const stored = getStoredItems();
            const match = Object.values(stored).find(item =>
                item.name && item.name.toLowerCase() === itemName.toLowerCase());
            if (match && match.market_value) {
                marketValueText = `Market Value: $${Number(match.market_value).toLocaleString()}`;
            }
        } catch (e) {
            console.error("Header market value error:", e);
        }
        header.textContent = `Bazaar Listings for ${itemName} (ID: ${itemId})`;
        if (marketValueText) {
            const span = document.createElement('span');
            span.style.marginLeft = '8px';
            span.style.fontSize = '14px';
            span.style.fontWeight = 'normal';
            span.style.color = currentDarkMode ? '#aaa' : '#666';
            span.textContent = `â€¢ ${marketValueText}`;
            header.appendChild(span);
        }
        container.appendChild(header);
        currentSortOrder = getSortOrderForKey(currentSortKey);
        const sortControls = document.createElement('div');
        sortControls.className = 'bytecore-sort-controls';
        sortControls.innerHTML = `
            <span style="white-space: nowrap;">Sort by:</span>
            <select class="bytecore-sort-select">
                <option value="price" ${currentSortKey === "price" ? "selected" : ""}>Price</option>
                <option value="quantity" ${currentSortKey === "quantity" ? "selected" : ""}>Quantity</option>
                <option value="profit" ${currentSortKey === "profit" ? "selected" : ""}>Profit</option>
                <option value="updated" ${currentSortKey === "updated" ? "selected" : ""}>Last Updated</option>
            </select>
            <button class="bytecore-button bytecore-order-toggle">
                ${currentSortOrder === "asc" ? "Asc" : "Desc"}
            </button>
            <button class="bytecore-button bytecore-display-toggle" title="Toggle between percentage difference and total profit">
                ${displayMode === "percentage" ? "%" : "$"}
            </button>
            <span style="white-space: nowrap;">Min Qty:</span>
            <input type="number" class="bytecore-min-qty" min="0" placeholder="">
        `;
        container.appendChild(sortControls);
        const tableContainer = document.createElement('div');
        tableContainer.className = 'bytecore-table-container';

        const table = document.createElement('table');
        table.className = 'bytecore-listings-table';

        const thead = document.createElement('thead');
        thead.className = 'bytecore-table-header';
        thead.innerHTML = `
            <tr>
                <th>Player</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Cost</th>
                <th>Market Value</th>
                <th>View Bazaar</th>
                <th>Updated</th>
            </tr>
        `;

        const tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);

        // Add View All button
        const viewAllContainer = document.createElement('div');
        viewAllContainer.className = 'bytecore-view-all-container';
        viewAllContainer.style.display = 'none';
        
        const viewAllBtn = document.createElement('button');
        viewAllBtn.className = 'bytecore-view-all-btn';
        viewAllBtn.style.cssText = 'width: 100%; padding: 10px; margin-top: 10px; background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%); color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;';
        viewAllBtn.textContent = 'View All Listings';
        
        // Add direct event listener to the button for better reliability
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const container = this.closest('.bytecore-info-container');
            if (!container || !container.isConnected) return;
            
            const tableContainer = container.querySelector('.bytecore-table-container');
            if (!tableContainer) return;
            
            const isExpanded = tableContainer.dataset.expanded === 'true';
            
            if (isExpanded) {
                tableContainer.dataset.expanded = 'false';
                tableContainer.style.maxHeight = '';
                tableContainer.style.overflowY = '';
                this.textContent = `View All ${allListings.length} Listings`;
            } else {
                tableContainer.dataset.expanded = 'true';
                tableContainer.style.maxHeight = '400px';
                tableContainer.style.overflowY = 'auto';
                this.textContent = 'Show Less';
            }
            
            setTimeout(() => {
                renderTableRows(container);
            }, 10);
        });
        
        viewAllContainer.appendChild(viewAllBtn);

        container.appendChild(tableContainer);
        container.appendChild(viewAllContainer);
        const footerContainer = document.createElement('div');
        footerContainer.className = 'bytecore-footer-container';
        footerContainer.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid #cbd5e0;';

        const footnote = document.createElement('div');
        footnote.className = 'bytecore-listing-footnote';
        footnote.style.cssText = 'font-size: 11px; color: #6b7280; font-weight: 500;';
        footnote.textContent = `Displaying listings available`;
        footerContainer.appendChild(footnote);

        // Add registration link to footer
        const registrationLink = document.createElement('div');
        registrationLink.style.cssText = 'font-size:11px; color:#3182ce; margin-left:auto; font-weight: 500;';
        registrationLink.innerHTML = `<a href="https://byte-core-vault.onrender.com/" target="_blank" style="color:#3182ce; text-decoration:none; padding: 4px 8px; border: 1px solid #3182ce; border-radius: 4px; background: rgba(49, 130, 206, 0.1);">Register on Byte-Core</a>`;
        if (currentDarkMode) {
            registrationLink.style.color = '#63b3ed';
            registrationLink.querySelector('a').style.color = '#63b3ed';
            registrationLink.querySelector('a').style.borderColor = '#63b3ed';
            registrationLink.querySelector('a').style.background = 'rgba(99, 179, 237, 0.2)';
        }
        footerContainer.appendChild(registrationLink);
        container.appendChild(footerContainer);
        return container;
    }

    function sortListings(listings) {
        return listings.slice().sort((a, b) => {
            let diff;
            if (currentSortKey === "profit") {
                try {
                    const stored = getStoredItems();
                    const match = Object.values(stored).find(item =>
                        item.name && item.name.toLowerCase() === currentItemName.toLowerCase());
                    if (match && match.market_value) {
                        const marketValue = Number(match.market_value),
                              fee = scriptSettings.listingFee || 0,
                              // Calculate profit per single item
                              aFeePerItem = Math.ceil(marketValue * (fee / 100)),
                              bFeePerItem = Math.ceil(marketValue * (fee / 100)),
                              aProfitPerItem = (marketValue - aFeePerItem) - a.price,
                              bProfitPerItem = (marketValue - bFeePerItem) - b.price;
                        diff = aProfitPerItem - bProfitPerItem;
                    } else {
                        diff = a.price - b.price;
                    }
                } catch (e) {
                    console.error("Profit sort error:", e);
                    diff = a.price - b.price;
                }
            } else {
                diff = currentSortKey === "price" ? a.price - b.price :
                      currentSortKey === "quantity" ? a.quantity - b.quantity :
                      a.updated - b.updated;
            }
            return currentSortOrder === "asc" ? diff : -diff;
        });
    }

    function updateInfoContainer(wrapper, itemId, itemName) {
        if (wrapper.hasAttribute('data-has-bytecore-info')) return;
        let infoContainer = document.querySelector(`.bytecore-info-container[data-itemid="${itemId}"]`);
        if (!infoContainer) {
            infoContainer = createInfoContainer(itemName, itemId);
            // Insert after any existing bazaar containers to avoid conflicts
            const existingBazaarContainer = wrapper.querySelector('.bazaar-info-container');
            if (existingBazaarContainer) {
                existingBazaarContainer.parentNode.insertBefore(infoContainer, existingBazaarContainer.nextSibling);
            } else {
                wrapper.insertBefore(infoContainer, wrapper.firstChild);
            }
            wrapper.setAttribute('data-has-bytecore-info', 'true');
        } else if (!wrapper.contains(infoContainer)) {
            infoContainer = createInfoContainer(itemName, itemId);
            const existingBazaarContainer = wrapper.querySelector('.bazaar-info-container');
            if (existingBazaarContainer) {
                existingBazaarContainer.parentNode.insertBefore(infoContainer, existingBazaarContainer.nextSibling);
            } else {
                wrapper.insertBefore(infoContainer, wrapper.firstChild);
            }
            wrapper.setAttribute('data-has-bytecore-info', 'true');
        } else {
            const header = infoContainer.querySelector('.bytecore-info-header');
            if (header) {
                header.textContent = `Bazaar Listings for ${itemName} (ID: ${itemId})`;
            }
        }
        const tableContainer = infoContainer.querySelector('.bytecore-table-container');
        const countElement = infoContainer.querySelector('.bytecore-listings-count');
        const updateListingsCount = (text) => {
            if (countElement) {
                countElement.textContent = text;
            }
        };
        const showEmptyState = (isError) => {
            if (tableContainer) {
                const tbody = tableContainer.querySelector('tbody');
                if (tbody) {
                    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">${isError ? 'API Error - Check back later' : 'No listings available'}</td></tr>`;
                }
            }
            updateListingsCount(isError ? 'API Error - Check back later' : 'No listings available');
        };
        if (tableContainer) {
            const tbody = tableContainer.querySelector('tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">Loading bazaar listings...</td></tr>';
            }
        }
        const cachedData = getCache(itemId);
        if (cachedData) {
            allListings = sortListings(cachedData.listings);
            if (allListings.length === 0) {
                showEmptyState(false);
            } else {
                renderTableRows(infoContainer);
            }
            return;
        }
        let listings = [], apiErrors = false;
        let requestTimeout = setTimeout(() => {
            console.warn('Bazaar listings request timed out');
            showEmptyState(true);
        }, 15000);

        fetchJSON(`https://byte-core-vault.onrender.com/api/fast-bazaar/${itemId}`, data => {
            clearTimeout(requestTimeout);
            if (!data || !data.listings) {
                showEmptyState(true);
                return;
            }
            listings = data.listings.map(listing => ({
                item_id: listing.itemId,
                player_id: listing.playerId,
                player_name: listing.playerName,
                quantity: listing.quantity,
                price: listing.pricePerUnit,
                marketPrice: listing.marketPrice,
                updated: Math.floor(new Date(listing.lastUpdated).getTime() / 1000)
            }));
            setCache(itemId, { listings });
            if (listings.length === 0) {
                showEmptyState(false);
            } else {
                allListings = sortListings(listings);
                renderTableRows(infoContainer);
            }
        });
    }

    function renderMessageInContainer(container, isApiError) {
        container.innerHTML = '';
        const messageContainer = document.createElement('div');
        messageContainer.style.cssText = 'display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center; width:100%; height:70px;';
        const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        iconSvg.setAttribute("viewBox", "0 0 512 512");
        iconSvg.setAttribute("width", "24");
        iconSvg.setAttribute("height", "24");
        iconSvg.style.marginBottom = "10px";
        const textDiv = document.createElement('div');
        if (isApiError) {
            iconSvg.innerHTML = svgTemplates.infoIcon;
            textDiv.innerHTML = "API Error<br><span style='font-size: 12px; color: #666;'>Please try again later</span>";
            textDiv.style.cssText = currentDarkMode ? 'color:#aaa;' : 'color:#333;';
        } else {
            iconSvg.innerHTML = svgTemplates.infoIcon;
            textDiv.textContent = "No bazaar listings available for this item.";
        }
        messageContainer.appendChild(iconSvg);
        messageContainer.appendChild(textDiv);
        container.appendChild(messageContainer);
    }

    function processSellerWrapper(wrapper) {
        if (!wrapper || wrapper.classList.contains('bytecore-info-container') || wrapper.hasAttribute('data-bytecore-processed')) return;
        const existingContainer = wrapper.querySelector(':scope > .bytecore-info-container');
        if (existingContainer) return;
        const itemTile = wrapper.previousElementSibling;
        if (!itemTile) return;
        const nameEl = itemTile.querySelector('.name___ukdHN'),
              btn = itemTile.querySelector('button[aria-controls^="wai-itemInfo-"]');
        if (nameEl && btn) {
            const itemName = nameEl.textContent.trim();
            const idParts = btn.getAttribute('aria-controls').split('-');
            const itemId = idParts[idParts.length - 1];
            wrapper.setAttribute('data-bytecore-processed', 'true');
            updateInfoContainer(wrapper, itemId, itemName);
        }
    }

    function processMobileSellerList() {
        if (!checkMobileView()) return;
        const sellerList = document.querySelector('ul.sellerList___e4C9_, ul[class*="sellerList"]');
        if (!sellerList) {
            const existing = document.querySelector('.bytecore-info-container');
            if (existing && !document.contains(existing.parentNode)) {
                existing.remove();
            }
            return;
        }
        if (sellerList.hasAttribute('data-has-bytecore-container')) {
            return;
        }
        const headerEl = document.querySelector('.itemsHeader___ZTO9r .title___ruNCT, [class*="itemsHeader"] [class*="title"]');
        const itemName = headerEl ? headerEl.textContent.trim() : "Unknown";
        const btn = document.querySelector('.itemsHeader___ZTO9r button[aria-controls^="wai-itemInfo-"], [class*="itemsHeader"] button[aria-controls^="wai-itemInfo-"]');
        let itemId = "unknown";
        if (btn) {
            const parts = btn.getAttribute('aria-controls').split('-');
            itemId = parts.length > 2 ? parts[parts.length - 2] : parts[parts.length - 1];
        }
        const existingContainer = document.querySelector(`.bytecore-info-container[data-itemid="${itemId}"]`);
        if (existingContainer) {
            if (existingContainer.parentNode !== sellerList.parentNode ||
                existingContainer.nextSibling !== sellerList) {
                sellerList.parentNode.insertBefore(existingContainer, sellerList);
            }
            return;
        }
        const infoContainer = createInfoContainer(itemName, itemId);
        // Insert after any existing bazaar containers
        const existingBazaarContainer = sellerList.parentNode.querySelector('.bazaar-info-container');
        if (existingBazaarContainer) {
            sellerList.parentNode.insertBefore(infoContainer, existingBazaarContainer.nextSibling);
        } else {
            sellerList.parentNode.insertBefore(infoContainer, sellerList);
        }
        sellerList.setAttribute('data-has-bytecore-container', 'true');
        updateInfoContainer(infoContainer, itemId, itemName);
    }

    function processAllSellerWrappers(root = document.body) {
        if (checkMobileView()) return;
        const sellerWrappers = root.querySelectorAll('[class*="sellerListWrapper"]');
        sellerWrappers.forEach(wrapper => processSellerWrapper(wrapper));
    }
    processAllSellerWrappers();
    processMobileSellerList();

    const observeTarget = document.querySelector('#root') || document.body;
    let isProcessing = false;
    const observer = new MutationObserver(mutations => {
        if (isProcessing) return;
        let needsProcessing = false;
        mutations.forEach(mutation => {
            const isOurMutation = Array.from(mutation.addedNodes).some(node =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.classList.contains('bytecore-info-container') ||
                 node.querySelector('.bytecore-info-container'))
            );
            if (isOurMutation) return;
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    needsProcessing = true;
                }
            });
            mutation.removedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE &&
                    (node.matches('ul.sellerList___e4C9_') || node.matches('ul[class*="sellerList"]')) &&
                    checkMobileView()) {
                    const container = document.querySelector('.bytecore-info-container');
                    if (container) container.remove();
                }
            });
        });
        if (needsProcessing) {
            if (observer.processingTimeout) {
                clearTimeout(observer.processingTimeout);
            }
            observer.processingTimeout = setTimeout(() => {
                try {
                    isProcessing = true;
                    if (checkMobileView()) {
                        processMobileSellerList();
                    } else {
                        processAllSellerWrappers();
                    }
                } finally {
                    isProcessing = false;
                    observer.processingTimeout = null;
                }
            }, 100);
        }
    });
    observer.observe(observeTarget, { childList: true, subtree: true });
    const bodyObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                currentDarkMode = document.body.classList.contains('dark-mode');
            }
        });
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    if (window.location.href.includes("bazaar.php")) {
        function scrollToTargetItem() {
            const params = new URLSearchParams(window.location.search);
            const targetItemId = params.get("itemId"), highlight = params.get("highlight");
            if (!targetItemId || highlight !== "1") return;
            function removeHighlightParam() {
                params.delete("highlight");
                history.replaceState({}, "", window.location.pathname + "?" + params.toString() + window.location.hash);
            }
            function showToast(message) {
                const toast = document.createElement('div');
                toast.textContent = message;
                toast.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background-color:rgba(0,0,0,0.7); color:white; padding:10px 20px; border-radius:5px; z-index:100000; font-size:14px;';
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.remove();
                }, 3000);
            }
            function findItemCard() {
                const img = document.querySelector(`img[src*="/images/items/${targetItemId}/"]`);
                return img ? img.closest('.item___GYCYJ') : null;
            }
            const scrollInterval = setInterval(() => {
                const card = findItemCard();
                if (card) {
                    clearInterval(scrollInterval);
                    removeHighlightParam();
                    card.classList.add("green-outline", "pop-flash");
                    card.scrollIntoView({ behavior: "smooth", block: "center" });
                    setTimeout(() => {
                        card.classList.remove("pop-flash");
                    }, 800);
                } else {
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                        showToast("Item not found on this page.");
                        removeHighlightParam();
                        clearInterval(scrollInterval);
                    } else {
                        window.scrollBy({ top: 300, behavior: 'auto' });
                    }
                }
            }, 50);
        }
        function waitForItems() {
            const container = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
            if (container && container.childElementCount > 0) {
                scrollToTargetItem();
            } else {
                setTimeout(waitForItems, 500);
            }
        }
        waitForItems();
    }

    function dailyCleanup() {
        const lastCleanup = GM_getValue("lastDailyCleanup"),
              oneDay = 24 * 60 * 60 * 1000,
              now = Date.now();
        if (!lastCleanup || (now - parseInt(lastCleanup, 10)) > oneDay) {
            const sevenDays = 7 * 24 * 60 * 60 * 1000;

            let keys = [];
            try {
                if (typeof GM_listValues === 'function') {
                    keys = GM_listValues();
                }
                if (keys.length === 0) {
                    const checkKey = (prefix) => {
                        let i = 0;
                        while (true) {
                            const testKey = `${prefix}${i}`;
                            const value = GM_getValue(testKey);
                            if (value === undefined) break;
                            keys.push(testKey);
                            i++;
                        }
                    };

                    ['visited_', 'bytecoreCache_'].forEach(prefix => {
                        for (let id = 1; id <= 1000; id++) {
                            const key = `${prefix}${id}`;
                            const value = GM_getValue(key);
                            if (value !== undefined) {
                                keys.push(key);
                            }
                        }
                    });
                }
            } catch (e) {
                console.error("Error listing storage keys:", e);
            }

            keys.forEach(key => {
                if (key && (key.startsWith("visited_") || key.startsWith("bytecoreCache_"))) {
                    try {
                        const val = JSON.parse(GM_getValue(key));
                        let ts = null;
                        if (key.startsWith("visited_") && val && val.lastClickedUpdated) {
                            ts = val.lastClickedUpdated;
                        } else if (key.startsWith("bytecoreCache_") && val && val.timestamp) {
                            ts = val.timestamp;
                        } else {
                            GM_deleteValue(key);
                        }
                        if (ts !== null && (now - ts) > sevenDays) {
                            GM_deleteValue(key);
                        }
                    } catch (e) {
                        GM_deleteValue(key);
                    }
                }
            });

            GM_setValue("lastDailyCleanup", now.toString());
        }
    }
    dailyCleanup();

    document.body.addEventListener('click', event => {
        const container = event.target.closest('.bytecore-info-container');
        if (!container) return;
        if (event.target.matches('.bytecore-order-toggle')) {
            currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
            event.target.textContent = currentSortOrder === "asc" ? "Asc" : "Desc";
            performSort(container);
        }
        if (event.target.matches('.bytecore-display-toggle')) {
            displayMode = displayMode === "percentage" ? "profit" : "percentage";
            event.target.textContent = displayMode === "percentage" ? "%" : "$";
            scriptSettings.defaultDisplayMode = displayMode;
            saveSettings();

            const allContainers = document.querySelectorAll('.bytecore-info-container');
            allContainers.forEach(container => {
                renderTableRows(container);
            });

            return;
        }

        if (event.target.matches('.bytecore-view-all-btn')) {
            event.preventDefault();
            event.stopPropagation();
            
            const container = event.target.closest('.bytecore-info-container');
            if (!container || !container.isConnected) {
                console.warn('Container not found or disconnected, skipping view all action');
                return;
            }
            
            const tableContainer = container.querySelector('.bytecore-table-container');
            if (!tableContainer) {
                console.warn('Table container not found, skipping view all action');
                return;
            }
            
            const isExpanded = tableContainer.dataset.expanded === 'true';

            if (isExpanded) {
                // Collapse to top 3
                tableContainer.dataset.expanded = 'false';
                tableContainer.style.maxHeight = '';
                tableContainer.style.overflowY = '';
            } else {
                // Expand to show all
                tableContainer.dataset.expanded = 'true';
                tableContainer.style.maxHeight = '400px';
                tableContainer.style.overflowY = 'auto';
            }

            // Force a small delay to ensure DOM is ready
            setTimeout(() => {
                renderTableRows(container);
            }, 10);
            return;
        }
    });

    document.body.addEventListener('input', event => {
        const container = event.target.closest('.bytecore-info-container');
        if (!container) return;
        if (event.target.matches('.bytecore-min-qty')) {
            clearTimeout(event.target.debounceTimer);
            event.target.debounceTimer = setTimeout(() => {
                if (!allListings || allListings.length === 0) {
                    const itemId = container.getAttribute('data-itemid');
                    if (itemId) {
                        const cachedData = getCache(itemId);
                        if (cachedData && cachedData.listings && cachedData.listings.length > 0) {
                            allListings = sortListings(cachedData.listings);
                        }
                    }
                }
                renderTableRows(container);
            }, 300);
        }
    });

    document.body.addEventListener('change', event => {
        const container = event.target.closest('.bytecore-info-container');
        if (!container) return;
        if (event.target.matches('.bytecore-sort-select')) {
            const newSortKey = event.target.value;
            if (newSortKey !== currentSortKey) {
                currentSortKey = newSortKey;
                currentSortOrder = getSortOrderForKey(currentSortKey);
                const orderToggle = container.querySelector('.bytecore-order-toggle');
                if (orderToggle) {
                    orderToggle.textContent = currentSortOrder === "asc" ? "Asc" : "Desc";
                }
            } else {
                currentSortKey = newSortKey;
            }
            performSort(container);
        }
    });

    function performSort(container) {
        allListings = sortListings(allListings);
        const tableContainer = container.querySelector('.bytecore-table-container');
        if (tableContainer) {
            renderTableRows(container);
        }
    }

    function addSettingsMenuItem() {
        const menu = document.querySelector('.settings-menu');
        if (!menu || document.querySelector('.bytecore-settings-button')) return;
        const li = document.createElement('li');
        li.className = 'link bytecore-settings-button';
        const a = document.createElement('a');
        a.href = '#';
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon-wrapper';
        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('class', 'default');
        svgIcon.setAttribute('fill', '#fff');
        svgIcon.setAttribute('stroke', 'transparent');
        svgIcon.setAttribute('stroke-width', '0');
        svgIcon.setAttribute('width', '16');
        svgIcon.setAttribute('height', '16');
        svgIcon.setAttribute('viewBox', '0 0 640 512');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M36.8 192l566.3 0c20.3 0 36.8-16.5 36.8-36.8c0-7.3-2.2-14.4-6.2-20.4L558.2 21.4C549.3 8 534.4 0 518.3 0L121.7 0c-16 0-31 8-39.9 21.4L6.2 134.7c-4 6.1-6.2 13.2-6.2 20.4C0 175.5 16.5 192 36.8 192zM64 224l0 160 0 80c0 26.5 21.5 48 48 48l224 0c26.5 0 48-21.5 48-48l0-80 0-160-64 0 0 160-192 0 0-160-64 0zm448 0l0 256c0 17.7 14.3 32 32 32s32-14.3 32-32l0-256-64 0z');
        const span = document.createElement('span');
        span.textContent = 'Byte-Core Settings';
        svgIcon.appendChild(path);
        iconDiv.appendChild(svgIcon);
        a.appendChild(iconDiv);
        a.appendChild(span);
        li.appendChild(a);
        a.addEventListener('click', e => {
            e.preventDefault();
            document.body.click();
            openSettingsModal();
        });
        const logoutButton = menu.querySelector('li.logout');
        if (logoutButton) {
            menu.insertBefore(li, logoutButton);
        } else {
            menu.appendChild(li);
        }
    }

    function openSettingsModal() {
        const overlay = document.createElement("div");
        overlay.className = "bytecore-modal-overlay";
        const modal = document.createElement("div");
        modal.className = "bytecore-settings-modal";
        modal.innerHTML = `
            <div class="bytecore-settings-title">âš™ï¸ Byte Core Vault Configuration</div>
            <div class="bytecore-tabs">
                <div class="bytecore-tab active" data-tab="settings">ðŸ”§ Configuration</div>
            </div>
            <div class="bytecore-tab-content active" id="tab-settings" style="max-height: 350px; overflow-y: auto;">
                <div class="bytecore-settings-grid">
                    <div class="bytecore-settings-card">
                        <h3>ðŸ”‘ API Authentication</h3>
                        <div class="bytecore-input-group">
                            <input type="text" id="bytecore-api-key" value="${scriptSettings.apiKey || ''}" placeholder="Enter your Torn API key" class="bytecore-modern-input" style="flex-grow: 1;">
                            <button class="bytecore-refresh-btn" id="refresh-market-data">ðŸ”„ Sync</button>
                        </div>
                        <div id="refresh-status" style="margin-top: 5px; font-size: 12px; display: none;"></div>
                        <p class="bytecore-help-text">Enable market comparison by providing your API key. Data remains private.</p>
                    </div>
                    <div class="bytecore-settings-card">
                        <h3>ðŸ“Š Display Preferences</h3>
                        <div class="bytecore-settings-row">
                            <label>Sort Method:</label>
                            <select id="bytecore-default-sort" class="bytecore-modern-select">
                                <option value="price" ${scriptSettings.defaultSort === 'price' ? 'selected' : ''}>ðŸ’° Price</option>
                                <option value="quantity" ${scriptSettings.defaultSort === 'quantity' ? 'selected' : ''}>ðŸ“¦ Quantity</option>
                                <option value="profit" ${scriptSettings.defaultSort === 'profit' ? 'selected' : ''}>ðŸ“ˆ Profit</option>
                                <option value="updated" ${scriptSettings.defaultSort === 'updated' ? 'selected' : ''}>ðŸ•’ Updated</option>
                            </select>
                        </div>
                        <div class="bytecore-settings-row">
                            <label>Sort Direction:</label>
                            <select id="bytecore-default-order" class="bytecore-modern-select">
                                <option value="asc" ${scriptSettings.defaultOrder === 'asc' ? 'selected' : ''}>â¬†ï¸ Low to High</option>
                                <option value="desc" ${scriptSettings.defaultOrder === 'desc' ? 'selected' : ''}>â¬‡ï¸ High to Low</option>
                            </select>
                        </div>
                    </div>
                    <div class="bytecore-settings-card">
                        <h3>ðŸ’¼ Trading Settings</h3>
                        <div class="bytecore-settings-row">
                            <label>Listing Fee (%):</label>
                            <input type="number" id="bytecore-listing-fee" class="bytecore-modern-input" value="${scriptSettings.listingFee || 0}" min="0" max="100" step="1">
                        </div>
                        <div class="bytecore-settings-row">
                            <label>Profit Display:</label>
                            <select id="bytecore-default-display" class="bytecore-modern-select">
                                <option value="percentage" ${scriptSettings.defaultDisplayMode === 'percentage' ? 'selected' : ''}>ðŸ“ˆ Percentage</option>
                                <option value="profit" ${scriptSettings.defaultDisplayMode === 'profit' ? 'selected' : ''}>ðŸ’µ Dollar Value</option>
                            </select>
                        </div>
                        <div class="bytecore-settings-row">
                            <label>Link Behavior:</label>
                            <select id="bytecore-link-behavior" class="bytecore-modern-select">
                                <option value="new_tab" ${scriptSettings.linkBehavior === 'new_tab' ? 'selected' : ''}>ðŸ”— New Tab</option>
                                <option value="new_window" ${scriptSettings.linkBehavior === 'new_window' ? 'selected' : ''}>ðŸ–¼ï¸ New Window</option>
                                <option value="same_tab" ${scriptSettings.linkBehavior === 'same_tab' ? 'selected' : ''}>ðŸ“„ Same Tab</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bytecore-settings-buttons">
                <button class="bytecore-settings-save">Save Configuration</button>
                <button class="bytecore-settings-cancel">Cancel</button>
            </div>
            <div class="bytecore-settings-footer">
                Developed by <a href="https://www.torn.com/profiles.php?XID=3255504" target="_blank">Mr_Awaken [3255504]</a>
            </div>
        `;
        overlay.appendChild(modal);
        const tabs = modal.querySelectorAll('.bytecore-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                modal.querySelectorAll('.bytecore-tab-content').forEach(content => content.classList.remove('active'));
                document.getElementById(`tab-${this.getAttribute('data-tab')}`).classList.add('active');
            });
        });
        modal.querySelector('.bytecore-settings-save').addEventListener('click', () => {
            saveSettingsFromModal(modal);
            overlay.remove();
        });
        modal.querySelector('.bytecore-settings-cancel').addEventListener('click', () => {
            overlay.remove();
        });
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.remove();
        });
        document.body.appendChild(overlay);
    }

    function saveSettingsFromModal(modal) {
        const oldLinkBehavior = scriptSettings.linkBehavior;
        scriptSettings.apiKey = modal.querySelector('#bytecore-api-key').value.trim();
        scriptSettings.defaultSort = modal.querySelector('#bytecore-default-sort').value;
        scriptSettings.defaultOrder = modal.querySelector('#bytecore-default-order').value;
        scriptSettings.listingFee = Math.round(parseFloat(modal.querySelector('#bytecore-listing-fee').value) || 0);
        scriptSettings.defaultDisplayMode = modal.querySelector('#bytecore-default-display').value;
        scriptSettings.linkBehavior = modal.querySelector('#bytecore-link-behavior').value;

        if (scriptSettings.listingFee < 0) scriptSettings.listingFee = 0;
        if (scriptSettings.listingFee > 100) scriptSettings.listingFee = 100;
        currentSortKey = scriptSettings.defaultSort;
        currentSortOrder = scriptSettings.defaultOrder;
        displayMode = scriptSettings.defaultDisplayMode;
        saveSettings();
        document.querySelectorAll('.bytecore-info-container').forEach(container => {
            const sortSelect = container.querySelector('.bytecore-sort-select');
            if (sortSelect) sortSelect.value = currentSortKey;
            const orderToggle = container.querySelector('.bytecore-order-toggle');
            if (orderToggle) orderToggle.textContent = currentSortOrder === "asc" ? "Asc" : "Desc";
            const displayToggle = container.querySelector('.bytecore-display-toggle');
            if (displayToggle) displayToggle.textContent = displayMode === "percentage" ? "%" : "$";
            if (oldLinkBehavior !== scriptSettings.linkBehavior) {
                renderTableRows(container);
            } else {
                performSort(container);
            }
        });
        if (scriptSettings.apiKey) {
            fetchTornItems(true);
        }
    }

    function fetchTornItems(forceRefresh = false) {
        const stored = GM_getValue("tornrpgItems"),
              lastUpdated = GM_getValue("tornrpgLastUpdate") || 0,
              now = Date.now(),
              oneDayMs = 24 * 60 * 60 * 1000,
              lastUTC = new Date(parseInt(lastUpdated)).toISOString().split('T')[0],
              todayUTC = new Date().toISOString().split('T')[0],
              lastHour = Math.floor(parseInt(lastUpdated) / (60 * 60 * 1000)),
              currentHour = Math.floor(now / (60 * 60 * 1000));

        const needsRefresh = forceRefresh ||
                             lastUTC < todayUTC ||
                             (now - lastUpdated) >= oneDayMs ||
                             (lastHour < currentHour && (currentHour - lastHour) >= 1);

        if (scriptSettings.apiKey && (!stored || needsRefresh)) {
            const refreshStatus = document.getElementById('refresh-status');
            if (refreshStatus) {
                refreshStatus.style.display = 'block';
                refreshStatus.textContent = 'Fetching market values...';
                refreshStatus.style.color = currentDarkMode ? '#aaa' : '#666';
            }

            return fetch(`https://api.torn.com/torn/?key=${scriptSettings.apiKey}&selections=items&comment=wBazaars`)
                .then(r => r.json())
                .then(data => {
                    if (!data.items) {
                        console.error("Failed to fetch Torn items. Check your API key or rate limit.");
                        if (refreshStatus) {
                            refreshStatus.textContent = data.error ? `Error: ${data.error.error}` : 'Failed to fetch market values. Check your API key.';
                            refreshStatus.style.color = '#cc0000';
                            setTimeout(() => {
                                refreshStatus.style.display = 'none';
                            }, 5000);
                        }
                        return false;
                    }

                    cachedItemsData = null;

                    const filtered = {};
                    for (let [id, item] of Object.entries(data.items)) {
                        if (item.tradeable) {
                            filtered[id] = { name: item.name, market_value: item.market_value };
                        }
                    }
                    GM_setValue("tornrpgItems", JSON.stringify(filtered));
                    GM_setValue("tornrpgLastUpdate", now.toString());

                    if (refreshStatus) {
                        refreshStatus.textContent = `Market values updated successfully! (${todayUTC})`;
                        refreshStatus.style.color = '#009900';
                        setTimeout(() => {
                            refreshStatus.style.display = 'none';
                        }, 3000);
                    }

                    document.querySelectorAll('.bytecore-info-container').forEach(container => {
                        if (container.isConnected) {
                            renderTableRows(container);
                        }
                    });

                    return true;
                })
                .catch(err => {
                    console.error("Error fetching Torn items:", err);
                    if (refreshStatus) {
                        refreshStatus.textContent = `Error: ${err.message || 'Failed to fetch market values'}`;
                        refreshStatus.style.color = '#cc0000';
                        setTimeout(() => {
                            refreshStatus.style.display = 'none';
                        }, 5000);
                    }
                    return false;
                });
        }
        return Promise.resolve(false);
    }

    document.body.addEventListener('click', event => {
        if (event.target.id === 'refresh-market-data' || event.target.closest('#refresh-market-data')) {
            event.preventDefault();
            const apiKeyInput = document.getElementById('bytecore-api-key');
            const refreshStatus = document.getElementById('refresh-status');

            if (!apiKeyInput || !apiKeyInput.value.trim()) {
                if (refreshStatus) {
                    refreshStatus.style.display = 'block';
                    refreshStatus.textContent = 'Please enter an API key first.';
                    refreshStatus.style.color = '#cc0000';
                    setTimeout(() => {
                        refreshStatus.style.display = 'none';
                    }, 3000);
                }
                return;
            }

            scriptSettings.apiKey = apiKeyInput.value.trim();
            fetchTornItems(true);
        }
    });

    function observeUserMenu() {
        const menuObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('settings-menu')) {
                            addSettingsMenuItem();
                            break;
                        }
                    }
                }
            });
        });
        menuObserver.observe(document.body, { childList: true, subtree: true });
        if (document.querySelector('.settings-menu')) {
            addSettingsMenuItem();
        }
    }
    observeUserMenu();

    function getSortOrderForKey(key) {
        return key === "price" ? "asc" : "desc";
    }

    function cleanupResources() {
        if (observer) {
            observer.disconnect();
        }
        if (bodyObserver) {
            bodyObserver.disconnect();
        }
    }
    window.addEventListener('beforeunload', cleanupResources);
})();