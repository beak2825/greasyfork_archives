// ==UserScript==
// @name         Bazaars in Item Market powered by TornPal and IronNerd ALPHA
// @namespace    http://tampermonkey.net/
// @version      2.49b
// @description  Displays bazaar listings with sorting controls via TornPal & IronNerd
// @author       Weav3r
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
// @connect      tornpal.com
// @connect      www.ironnerd.me
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528488/Bazaars%20in%20Item%20Market%20powered%20by%20TornPal%20and%20IronNerd%20ALPHA.user.js
// @updateURL https://update.greasyfork.org/scripts/528488/Bazaars%20in%20Item%20Market%20powered%20by%20TornPal%20and%20IronNerd%20ALPHA.meta.js
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
        listingFee: parseFloat(GM_getValue("bazaarListingFee") || "0"),
        defaultDisplayMode: "percentage",
        linkBehavior: GM_getValue("bazaarLinkBehavior") || "new_tab"
    };

    const updateStyles = () => {
        let styleEl = document.getElementById('bazaar-enhanced-styles');

        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'bazaar-enhanced-styles';
            document.head.appendChild(styleEl);
        }

        styleEl.textContent = `
            .bazaar-profit-tooltip {
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
                .bazaar-profit-tooltip {
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

    function loadSettings() {
        try {
            const saved = GM_getValue("bazaarsSettings");
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

    function saveSettings() {
        try {
            GM_setValue("bazaarsSettings", JSON.stringify(scriptSettings));
            GM_setValue("bazaarApiKey", scriptSettings.apiKey || "");
            GM_setValue("bazaarDefaultSort", scriptSettings.defaultSort || "price");
            GM_setValue("bazaarDefaultOrder", scriptSettings.defaultOrder || "asc");
            GM_setValue("bazaarListingFee", scriptSettings.listingFee || 0);
            GM_setValue("bazaarDefaultDisplayMode", scriptSettings.defaultDisplayMode || "percentage");
            GM_setValue("bazaarLinkBehavior", scriptSettings.linkBehavior || "new_tab");
        } catch (e) {
            console.error("Settings save hiccup:", e);
        }
    }
    loadSettings();

    const style = document.createElement("style");
    style.textContent = `
        .bazaar-button {
            padding: 3px 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #fff;
            color: #000;
            cursor: pointer;
            font-size: 12px;
            margin-left: 4px;
        }
        .dark-mode .bazaar-button {
            border: 1px solid #444;
            background-color: #1a1a1a;
            color: #fff;
        }
        .bazaar-modal-overlay {
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
        .bazaar-info-container {
            font-size: 13px;
            border-radius: 4px;
            margin: 5px 0;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            background-color: #f9f9f9;
            color: #000;
            border: 1px solid #ccc;
            box-sizing: border-box;
            width: 100%;
            overflow: hidden;
        }
        .dark-mode .bazaar-info-container {
            background-color: #2f2f2f;
            color: #ccc;
            border: 1px solid #444;
        }
        .bazaar-info-header {
            font-size: 16px;
            font-weight: bold;
            color: #000;
        }
        .dark-mode .bazaar-info-header {
            color: #fff;
        }
        .bazaar-sort-controls {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            padding: 5px;
            background-color: #eee;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        .dark-mode .bazaar-sort-controls {
            background-color: #333;
            border: 1px solid #444;
        }
        .bazaar-sort-select {
            padding: 3px 24px 3px 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #fff url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGw1IDYgNS02eiIgZmlsbD0iIzY2NiIvPjwvc3ZnPg==") no-repeat right 8px center;
            background-size: 10px 6px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            cursor: pointer;
        }
        .bazaar-profit-tooltip {
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
        .dark-mode .bazaar-profit-tooltip {
            background: #333;
            color: #fff;
            border: 1px solid #555;
        }
        .dark-mode .bazaar-sort-select {
            border: 1px solid #444;
            background-color: #1a1a1a;
            color: #fff;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGw1IDYgNS02eiIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==");
        }
        .bazaar-sort-select:focus {
            outline: none;
            border-color: #0078d7;
            box-shadow: 0 0 0 1px #0078d7;
        }
        .bazaar-min-qty {
            background-color: #fff;
            color: #000;
            font-size: 12px;
        }
        .dark-mode .bazaar-min-qty {
            border: 1px solid #444 !important;
            background-color: #1a1a1a;
            color: #fff;
        }
        .bazaar-min-qty:focus {
            outline: none;
            border-color: #0078d7 !important;
            box-shadow: 0 0 0 1px #0078d7;
        }
        .bazaar-scroll-container {
            position: relative;
            display: flex;
            align-items: stretch;
            width: 100%;
            box-sizing: border-box;
        }
        .bazaar-scroll-wrapper {
            flex: 1;
            overflow-x: auto;
            overflow-y: hidden;
            height: 100px;
            white-space: nowrap;
            padding-bottom: 3px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin: 0 auto;
            max-width: calc(100% - 30px);
            position: relative;
        }
        .dark-mode .bazaar-scroll-wrapper {
            border: 1px solid #444;
        }
        .bazaar-scroll-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 12px;
            flex-shrink: 0;
            flex-grow: 0;
            cursor: pointer;
            background-color: transparent;
            border: none;
            opacity: 0.5;
            transition: opacity 0.2s ease;
            margin: 0 1px;
            z-index: 2;
            position: relative;
        }
        .bazaar-scroll-arrow:hover {
            opacity: 0.9;
            background-color: transparent;
        }
        .dark-mode .bazaar-scroll-arrow {
            background-color: transparent;
            border: none;
        }
        .bazaar-scroll-arrow svg {
            width: 18px !important;
            height: 18px !important;
            color: #888;
        }
        .dark-mode .bazaar-scroll-arrow svg {
            color: #777;
        }
        .bazaar-scroll-arrow.left {
            padding-left: 10px;
            margin-left: -10px;
        }
        .bazaar-scroll-arrow.right {
            padding-right: 10px;
            margin-right: -10px;
        }
        .bazaar-scroll-wrapper::-webkit-scrollbar {
            height: 8px;
        }
        .bazaar-scroll-wrapper::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .bazaar-scroll-wrapper::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        .bazaar-scroll-wrapper::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        .dark-mode .bazaar-scroll-wrapper::-webkit-scrollbar-track {
            background: #333;
        }
        .dark-mode .bazaar-scroll-wrapper::-webkit-scrollbar-thumb {
            background: #555;
        }
        .dark-mode .bazaar-scroll-wrapper::-webkit-scrollbar-thumb:hover {
            background: #777;
        }
        .bazaar-card-container {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
        }
        .bazaar-listing-card {
            position: absolute;
            min-width: 140px;
            max-width: 200px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 4px;
            padding: 8px;
            font-size: clamp(12px, 1vw, 14px);
            box-sizing: border-box;
            overflow: hidden;
            background-color: #fff;
            color: #000;
            border: 1px solid #ccc;
            top: 50%;
            transform: translateY(-50%);
            word-break: break-word;
            height: auto;
            /* Added transition for position, opacity and scale */
            transition: left 0.5s ease, opacity 0.5s ease, transform 0.5s ease;
        }
        .dark-mode .bazaar-listing-card {
            background-color: #1a1a1a;
            color: #fff;
            border: 1px solid #444;
        }
        /* Fade-in/out classes for animations */
        .fade-in {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
        }
        .fade-out {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
        }
        .bazaar-listing-footnote {
            font-size: 11px;
            text-align: right;
            color: #555;
        }
        .dark-mode .bazaar-listing-footnote {
            color: #aaa;
        }
        .bazaar-listing-source {
            font-size: 10px;
            text-align: right;
            color: #555;
        }
        .dark-mode .bazaar-listing-source {
            color: #aaa;
        }
        .bazaar-footer-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 5px;
            font-size: 10px;
        }
        .bazaar-powered-by span {
            color: #999;
        }
        .dark-mode .bazaar-powered-by span {
            color: #666;
        }
        .bazaar-powered-by a {
            text-decoration: underline;
            color: #555;
        }
        .dark-mode .bazaar-powered-by a {
            color: #aaa;
        }
        @keyframes popAndFlash {
            0%   { transform: scale(1); background-color: rgba(0,255,0,0.6); }
            50%  { transform: scale(1.05); }
            100% { transform: scale(1); background-color: inherit; }
        }
        .pop-flash {
            animation: popAndFlash 0.8s ease-in-out forwards;
        }
        .green-outline {
            border: 3px solid green !important;
        }
        .bazaar-settings-modal {
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
        .dark-mode .bazaar-settings-modal {
            background-color: #2a2a2a;
            color: #e0e0e0;
            border: 1px solid #444;
        }
        .bazaar-settings-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
        }
        .dark-mode .bazaar-settings-title {
            color: #fff;
        }
        .bazaar-tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
            padding-bottom: 0;
            flex-wrap: wrap;
        }
        .dark-mode .bazaar-tabs {
            border-bottom: 1px solid #444;
        }
        .bazaar-tab {
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
        .dark-mode .bazaar-tab {
            background-color: #333;
            color: #ccc;
        }
        .bazaar-tab.active {
            background-color: #fff;
            color: #333;
            border-color: #ddd;
            font-weight: bold;
            padding-bottom: 11px;
        }
        .dark-mode .bazaar-tab.active {
            background-color: #2a2a2a;
            color: #fff;
            border-color: #444;
        }
        .bazaar-tab-content {
            display: none;
        }
        .bazaar-tab-content.active {
            display: block;
        }
        .bazaar-settings-group {
            margin-bottom: 20px;
        }
        .bazaar-settings-item {
            margin-bottom: 18px;
        }
        .bazaar-settings-item label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 14px;
        }
        .bazaar-settings-item input[type="text"],
        .bazaar-settings-item select,
        .bazaar-number-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            background-color: #fff;
            color: #333;
            max-width: 200px;
        }
        .dark-mode .bazaar-settings-item input[type="text"],
        .dark-mode .bazaar-settings-item select,
        .dark-mode .bazaar-number-input {
            border: 1px solid #444;
            background-color: #222;
            color: #e0e0e0;
        }
        .bazaar-settings-item select {
            max-width: 200px;
        }
        .bazaar-number-input {
            -moz-appearance: textfield;
            appearance: textfield;
            width: 60px !important;
        }
        .bazaar-number-input::-webkit-outer-spin-button,
        .bazaar-number-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .bazaar-api-note {
            font-size: 12px;
            margin-top: 6px;
            color: #666;
            line-height: 1.4;
        }
        .dark-mode .bazaar-api-note {
            color: #aaa;
        }
        .bazaar-script-item {
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #eee;
        }
        .dark-mode .bazaar-script-item {
            border-bottom: 1px solid #333;
        }
        .bazaar-script-item:last-child {
            border-bottom: none;
        }
        .bazaar-script-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }
        .bazaar-script-desc {
            margin-bottom: 8px;
            line-height: 1.4;
            color: #555;
        }
        .dark-mode .bazaar-script-desc {
            color: #bbb;
        }
        .bazaar-script-link {
            display: inline-block;
            margin-top: 5px;
            color: #2196F3;
            text-decoration: none;
        }
        .bazaar-script-link:hover {
            text-decoration: underline;
        }
        .bazaar-changelog {
            margin-bottom: 20px;
        }
        .bazaar-changelog-version {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 15px;
        }
        .bazaar-changelog-date {
            font-style: italic;
            color: #666;
            font-size: 13px;
            margin-bottom: 5px;
        }
        .dark-mode .bazaar-changelog-date {
            color: #aaa;
        }
        .bazaar-changelog-list {
            margin-left: 20px;
            margin-bottom: 15px;
        }
        .bazaar-changelog-item {
            margin-bottom: 5px;
            line-height: 1.4;
        }
        .bazaar-credits {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .dark-mode .bazaar-credits {
            border-top: 1px solid #444;
        }
        .bazaar-credits h3 {
            font-size: 16px;
            margin-bottom: 10px;
        }
        .bazaar-credits p {
            line-height: 1.4;
            margin-bottom: 8px;
        }
        .bazaar-provider {
            font-weight: bold;
        }
        .bazaar-settings-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 30px;
        }
        .bazaar-settings-save,
        .bazaar-settings-cancel {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            font-weight: bold;
        }
        .bazaar-settings-save {
            background-color: #4CAF50;
            color: white;
        }
        .bazaar-settings-save:hover {
            background-color: #45a049;
        }
        .bazaar-settings-cancel {
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
        }
        .dark-mode .bazaar-settings-cancel {
            background-color: #333;
            color: #e0e0e0;
            border: 1px solid #444;
        }
        .bazaar-settings-cancel:hover {
            background-color: #e9e9e9;
        }
        .dark-mode .bazaar-settings-cancel:hover {
            background-color: #444 !important;
            border-color: #555 !important;
        }
        .bazaar-settings-footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-align: center;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .dark-mode .bazaar-settings-footer {
            color: #999;
            border-top: 1px solid #444;
        }
        .bazaar-settings-footer a {
            color: #2196F3;
            text-decoration: none;
        }
        .bazaar-settings-footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .bazaar-settings-modal {
                padding: 16px;
                width: 100%;
                max-width: 100%;
                border-radius: 0;
                max-height: 100vh;
            }
            .bazaar-settings-title {
                font-size: 18px;
                margin-bottom: 16px;
            }
            .bazaar-tab {
                padding: 8px 12px;
                font-size: 14px;
            }
            .bazaar-settings-item label {
                font-size: 13px;
            }
            .bazaar-settings-item input[type="text"],
            .bazaar-settings-item select,
            .bazaar-number-input {
                padding: 6px 10px;
                font-size: 13px;
                max-width: 100%;
            }
            .bazaar-settings-item {
                margin-bottom: 14px;
            }
            .bazaar-settings-save,
            .bazaar-settings-cancel {
                padding: 6px 12px;
                font-size: 13px;
            }
            .bazaar-api-note {
                font-size: 11px;
            }
            .bazaar-settings-buttons {
                margin-top: 20px;
            }
            .bazaar-settings-footer {
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
            // First, check if we're running in Torn PDA
            if (typeof window.flutter_inappwebview !== 'undefined') {
                // Try to detect Torn PDA environment
                return window.flutter_inappwebview.callHandler('isTornPDA')
                    .then(response => {
                        if (response && response.isTornPDA) {
                            // We're in Torn PDA, use its HTTP handlers
                            return window.flutter_inappwebview.callHandler('PDA_httpGet', options.url, options.headers || {})
                                .then(response => {
                                    // Convert Torn PDA response to match GM_xmlhttpRequest format
                                    if (options.onload) {
                                        options.onload({
                                            status: response.status,
                                            responseText: response.responseText,
                                            statusText: response.statusText
                                        });
                                    }
                                })
                                .catch(error => {
                                    if (options.onerror) {
                                        options.onerror(error);
                                    }
                                });
                        } else {
                            // Fallback to standard methods if not in Torn PDA
                            return handleStandardRequest(options);
                        }
                    })
                    .catch(() => {
                        // If isTornPDA handler fails, fallback to standard methods
                        return handleStandardRequest(options);
                    });
            } else {
                // Not in Torn PDA environment, use standard methods
                return handleStandardRequest(options);
            }
        }

        function handleStandardRequest(options) {
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

    let cachedItemsData = null;
    function getStoredItems() {
        if (cachedItemsData === null) {
            try {
                cachedItemsData = JSON.parse(GM_getValue("tornItems") || "{}");
            } catch (e) {
                cachedItemsData = {};
                console.error("Stored items got funky:", e);
            }
        }
        return cachedItemsData;
    }

    function getCache(itemId) {
        try {
            const key = "tornBazaarCache_" + itemId,
                  cached = GM_getValue(key);
            if (cached) {
                const payload = JSON.parse(cached);
                if (Date.now() - payload.timestamp < CACHE_DURATION_MS) return payload.data;
            }
        } catch (e) {}
        return null;
    }

    function setCache(itemId, data) {
        try {
            GM_setValue("tornBazaarCache_" + itemId, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (e) {}
    }

    function getRelativeTime(ts) {
        const diffSec = Math.floor((Date.now() - ts * 1000) / 1000);
        if (diffSec < 60) return diffSec + 's ago';
        if (diffSec < 3600) return Math.floor(diffSec / 60) + 'm ago';
        if (diffSec < 86400) return Math.floor(diffSec / 3600) + 'h ago';
        return Math.floor(diffSec / 86400) + 'd ago';
    }

    const svgTemplates = {
        rightArrow: `<svg viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`,
        leftArrow: `<svg viewBox="0 0 320 512"><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`,
        warningIcon: `<path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>`,
        infoIcon: `<path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>`
    };

    function createListingCard(listing, index) {
        const card = document.createElement('div');
        card.className = 'bazaar-listing-card';
        card.dataset.index = index;
        const listingKey = listing.player_id + '-' + listing.price + '-' + listing.quantity;
        card.dataset.listingKey = listingKey;
        card.dataset.quantity = listing.quantity;
        card.style.position = "absolute";
        card.style.left = (index * CARD_WIDTH) + "px";
        card.style.width = CARD_WIDTH + "px";

        let visitedColor = '#00aaff';
        try {
            const key = `visited_${listing.item_id}_${listing.player_id}`;
            const data = JSON.parse(GM_getValue(key));
            if (data && data.lastClickedUpdated >= listing.updated) {
                visitedColor = 'purple';
            }
        } catch (e) {}

        const displayName = listing.player_name ? listing.player_name : `ID: ${listing.player_id}`;
        card.innerHTML = `
            <div>
                <div style="display:flex; align-items:center; gap:5px; margin-bottom:6px; flex-wrap:wrap">
                    <a href="https://www.torn.com/bazaar.php?userId=${listing.player_id}&itemId=${listing.item_id}&highlight=1#/"
                       data-visited-key="visited_${listing.item_id}_${listing.player_id}"
                       data-updated="${listing.updated}"
                       ${scriptSettings.linkBehavior === 'new_tab' ? 'target="_blank" rel="noopener noreferrer"' : ''}
                       style="font-weight:bold; color:${visitedColor}; text-decoration:underline;">
                       Player: ${displayName}
                    </a>
                </div>
                <div>
                    <div style="margin-bottom:2px">
                        <strong>Price:</strong> <span style="word-break:break-all;">$${listing.price.toLocaleString()}</span>
                    </div>
                    <div style="display:flex; align-items:center">
                        <strong>Qty:</strong> <span style="margin-left:4px">${listing.quantity}</span>
                        <span style="margin-left:auto">${getPriceComparisonHtml(listing.price, listing.quantity)}</span>
                    </div>
                </div>
            </div>
            <div style="margin-top:6px">
                <div class="bazaar-listing-footnote">Updated: ${getRelativeTime(listing.updated)}</div>
                <div class="bazaar-listing-source">Source: ${listing.source === "ironnerd" ? "IronNerd" : (listing.source === "bazaar" ? "TornPal" : listing.source)}</div>
            </div>
        `;

        const playerLink = card.querySelector('a');
        playerLink.addEventListener('click', (e) => {
            GM_setValue(playerLink.dataset.visitedKey, JSON.stringify({ lastClickedUpdated: listing.updated }));
            playerLink.style.color = 'purple';
            const behavior = scriptSettings.linkBehavior || 'new_tab';
            if (behavior !== 'same_tab') {
                e.preventDefault();
                if (behavior === 'new_window') {
                    window.open(playerLink.href, '_blank', 'noopener,noreferrer,width=1200,height=800');
                } else {
                    window.open(playerLink.href, '_blank', 'noopener,noreferrer');
                }
            }
        });

        const priceComparison = card.querySelector('.bazaar-price-comparison');
        if (priceComparison) {
            const tooltip = document.createElement('div');
            tooltip.className = 'bazaar-profit-tooltip';
            tooltip.style.display = 'none';
            tooltip.style.opacity = '0';
            tooltip.innerHTML = priceComparison.getAttribute('data-tooltip');

            priceComparison.addEventListener('mouseenter', e => {
                document.body.appendChild(tooltip);
                tooltip.style.display = 'block';

                // Position initially to measure size
                tooltip.style.left = '0';
                tooltip.style.top = '0';

                // Get dimensions after adding to DOM
                const rect = e.target.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();

                // Calculate optimal position
                let left = rect.left;
                let top = rect.bottom + 5;

                // Check horizontal overflow
                if (left + tooltipRect.width > window.innerWidth) {
                    left = Math.max(5, window.innerWidth - tooltipRect.width - 5);
                }

                // Check vertical overflow and place above if needed
                if (top + tooltipRect.height > window.innerHeight) {
                    top = Math.max(5, rect.top - tooltipRect.height - 5);
                }

                // Apply final position
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';

                // Fade in
                requestAnimationFrame(() => {
                    tooltip.style.opacity = '1';
                });
            });

            priceComparison.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                // Remove after transition
                setTimeout(() => {
                    if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
                }, 200);
            });
        }

        return card;
    }

    function getPriceComparisonHtml(listingPrice, quantity) {
        try {
            const stored = getStoredItems();
            const match = Object.values(stored).find(item =>
                item.name && item.name.toLowerCase() === currentItemName.toLowerCase());
            if (match && match.market_value) {
                const marketValue = Number(match.market_value),
                      priceDiff = listingPrice - marketValue,
                      percentDiff = ((listingPrice / marketValue) - 1) * 100,
                      listingFee = scriptSettings.listingFee || 0,
                      totalCost = listingPrice * quantity,
                      potentialRevenue = marketValue * quantity,
                      feeAmount = Math.ceil(potentialRevenue * (listingFee / 100)),
                      potentialProfit = potentialRevenue - totalCost - feeAmount,
                      minResellPrice = Math.ceil(listingPrice / (1 - (listingFee / 100)));

                let color, text;
                const absProfit = Math.abs(potentialProfit);
                let abbrevValue = potentialProfit < 0 ? '-' : '';
                if (absProfit >= 1000000) {
                    abbrevValue += '$' + (absProfit / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
                } else if (absProfit >= 1000) {
                    abbrevValue += '$' + (absProfit / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                } else {
                    abbrevValue += '$' + absProfit;
                }
                if (potentialProfit > 0) {
                    color = currentDarkMode ? '#7fff7f' : '#006400';
                    text = displayMode === "percentage" ? `(${percentDiff.toFixed(1)}%)` : `(${abbrevValue})`;
                } else if (potentialProfit < 0) {
                    color = currentDarkMode ? '#ff7f7f' : '#8b0000';
                    text = displayMode === "percentage" ? `(+${percentDiff.toFixed(1)}%)` : `(${abbrevValue})`;
                } else {
                    color = currentDarkMode ? '#cccccc' : '#666666';
                    text = displayMode === "percentage" ? `(0%)` : `($0)`;
                }

                // Improved tooltip content focusing only on key information
                const tooltipContent = `
                    <div style="font-weight:bold; font-size:13px; margin-bottom:6px; text-align:center;">
                        ${potentialProfit >= 0 ? 'PROFIT' : 'LOSS'}: ${potentialProfit >= 0 ? '$' : '-$'}${Math.abs(potentialProfit).toLocaleString()}
                    </div>
                    <hr style="margin: 4px 0; border-color: ${currentDarkMode ? '#444' : '#ddd'}">
                    <div>Total Cost: $${totalCost.toLocaleString()} (${quantity} item${quantity > 1 ? 's' : ''})</div>
                    ${listingFee > 0 ? `<div>Resale Fee: ${listingFee}% ($${feeAmount.toLocaleString()})</div>` : ''}
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
                span.className = 'bazaar-price-comparison';
                span.setAttribute('data-tooltip', tooltipContent);
                return span.outerHTML;
            }
        } catch (e) {
            console.error("Price comparison error:", e);
        }
        return '';
    }

    function renderVirtualCards(infoContainer) {
        const cardContainer = infoContainer.querySelector('.bazaar-card-container'),
              scrollWrapper = infoContainer.querySelector('.bazaar-scroll-wrapper');
        if (!cardContainer || !scrollWrapper || !infoContainer.isConnected) return;
        try {
            const minQtyInput = infoContainer.querySelector('.bazaar-min-qty');
            const minQty = minQtyInput && minQtyInput.value ? parseInt(minQtyInput.value, 10) : 0;
            if (!infoContainer.originalListings && allListings && allListings.length > 0) {
                infoContainer.originalListings = [...allListings];
            }
            if ((!allListings || allListings.length === 0) && infoContainer.originalListings) {
                allListings = [...infoContainer.originalListings];
            }
            const filteredListings = minQty > 0 ? allListings.filter(listing => listing.quantity >= minQty) : allListings;
            if (filteredListings.length === 0 && allListings.length > 0) {
                cardContainer.innerHTML = '';
                const messageContainer = document.createElement('div');
                messageContainer.style.cssText = 'display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center; width:100%; height:70px;';
                const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                iconSvg.setAttribute("viewBox", "0 0 512 512");
                iconSvg.setAttribute("width", "24");
                iconSvg.setAttribute("height", "24");
                iconSvg.style.marginBottom = "10px";
                iconSvg.innerHTML = svgTemplates.infoIcon;
                const textDiv = document.createElement('div');
                textDiv.textContent = `No listings found with quantity ≥ ${minQty}. Try a lower value.`;
                messageContainer.appendChild(iconSvg);
                messageContainer.appendChild(textDiv);
                cardContainer.appendChild(messageContainer);
                const countElement = infoContainer.querySelector('.bazaar-listings-count');
                if (countElement) {
                    countElement.textContent = `No listings match minimum quantity of ${minQty} (from ${allListings.length} total listings)`;
                }
                return;
            }

            if (cardContainer.style.width !== (filteredListings.length * CARD_WIDTH) + "px") {
                cardContainer.style.width = (filteredListings.length * CARD_WIDTH) + "px";
            }

            const scrollLeft = scrollWrapper.scrollLeft,
                  containerWidth = scrollWrapper.clientWidth;
            const visibleCards = Math.ceil(containerWidth / CARD_WIDTH),
                  buffer = Math.max(2, Math.floor(visibleCards / 3));
            const totalItems = filteredListings.length;

            if (infoContainer.lastRenderScrollLeft !== undefined &&
                Math.abs(infoContainer.lastRenderScrollLeft - scrollLeft) < CARD_WIDTH * 0.3) {

            }
            infoContainer.lastRenderScrollLeft = scrollLeft;

            let startIndex = Math.max(0, Math.floor(scrollLeft / CARD_WIDTH) - buffer),
                endIndex = Math.min(totalItems, Math.ceil((scrollLeft + containerWidth) / CARD_WIDTH) + buffer);

            const newVisible = {};
            for (let i = startIndex; i < endIndex; i++) {
                const listing = filteredListings[i];
                const key = listing.player_id + '-' + listing.price + '-' + listing.quantity;
                newVisible[key] = i;
            }
            Array.from(cardContainer.children).forEach(card => {
                if (!card.classList.contains('bazaar-listing-card')) return;
                const key = card.dataset.listingKey;
                if (key in newVisible) {
                    const newIndex = newVisible[key];
                    card.dataset.index = newIndex;
                    card.style.left = (newIndex * CARD_WIDTH) + "px";
                    delete newVisible[key];
                } else {
                    card.classList.add('fade-out');
                    card.addEventListener('transitionend', () => card.remove(), { once: true });
                }
            });
            const fragment = document.createDocumentFragment();
            for (const key in newVisible) {
                const newIndex = newVisible[key];
                const listing = filteredListings[newIndex];
                const newCard = createListingCard(listing, newIndex);
                newCard.classList.add('fade-in');
                fragment.appendChild(newCard);
                requestAnimationFrame(() => {
                    newCard.classList.remove('fade-in');
                });
            }
            if (fragment.childElementCount > 0) {
                cardContainer.appendChild(fragment);
            }
            const totalQuantity = filteredListings.reduce((sum, listing) => sum + listing.quantity, 0);
            const countElement = infoContainer.querySelector('.bazaar-listings-count');
            if (countElement) {
                if (minQty > 0 && filteredListings.length < allListings.length) {
                    countElement.textContent = `Showing ${filteredListings.length} of ${allListings.length} bazaars (${totalQuantity.toLocaleString()} items total, min qty: ${minQty})`;
                } else {
                    countElement.textContent = `Showing bazaars ${startIndex + 1}-${endIndex} of ${totalItems} (${totalQuantity.toLocaleString()} items total)`;
                }
            }
        } catch (error) {
            console.error("Error rendering virtual cards:", error);
        }
    }

    function createInfoContainer(itemName, itemId) {
        const container = document.createElement('div');
        container.className = 'bazaar-info-container';
        container.dataset.itemid = itemId;
        currentItemName = itemName;
        const header = document.createElement('div');
        header.className = 'bazaar-info-header';
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
            span.textContent = `• ${marketValueText}`;
            header.appendChild(span);
        }
        container.appendChild(header);
        currentSortOrder = getSortOrderForKey(currentSortKey);
        const sortControls = document.createElement('div');
        sortControls.className = 'bazaar-sort-controls';
        sortControls.innerHTML = `
            <span>Sort by:</span>
            <select class="bazaar-sort-select">
                <option value="price" ${currentSortKey === "price" ? "selected" : ""}>Price</option>
                <option value="quantity" ${currentSortKey === "quantity" ? "selected" : ""}>Quantity</option>
                <option value="profit" ${currentSortKey === "profit" ? "selected" : ""}>Profit</option>
                <option value="updated" ${currentSortKey === "updated" ? "selected" : ""}>Last Updated</option>
            </select>
            <button class="bazaar-button bazaar-order-toggle">
                ${currentSortOrder === "asc" ? "Asc" : "Desc"}
            </button>
            <button class="bazaar-button bazaar-display-toggle" title="Toggle between percentage difference and total profit">
                ${displayMode === "percentage" ? "%" : "$"}
            </button>
            <span style="margin-left: 8px;">Min Qty:</span>
            <input type="number" class="bazaar-min-qty" style="width: 60px; padding: 3px; border: 1px solid #ccc; border-radius: 4px;" min="0" placeholder="">
        `;
        container.appendChild(sortControls);
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'bazaar-scroll-container';
        function createScrollArrow(direction) {
            const arrow = document.createElement('div');
            arrow.className = `bazaar-scroll-arrow ${direction}`;
            arrow.innerHTML = svgTemplates[direction === 'left' ? 'leftArrow' : 'rightArrow'];
            let isScrolling = false,
                scrollAnimationId = null,
                startTime = 0,
                isClickAction = false;
            const ACTION_THRESHOLD = 200;
            function smoothScroll() {
                if (!isScrolling) return;
                scrollWrapper.scrollLeft += (direction === 'left' ? -1.5 : 1.5);
                scrollAnimationId = requestAnimationFrame(smoothScroll);
            }
            function startScrolling(e) {
                e.preventDefault();
                startTime = Date.now();
                isClickAction = false;
                setTimeout(() => {
                    if (startTime && Date.now() - startTime >= ACTION_THRESHOLD) {
                        isScrolling = true;
                        smoothScroll();
                    }
                }, ACTION_THRESHOLD);
            }
            function stopScrolling() {
                const holdDuration = Date.now() - startTime;
                isScrolling = false;
                if (scrollAnimationId) {
                    cancelAnimationFrame(scrollAnimationId);
                    scrollAnimationId = null;
                }
                if (holdDuration < ACTION_THRESHOLD && !isClickAction) {
                    isClickAction = true;
                    scrollWrapper.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
                }
                startTime = 0;
            }
            arrow.addEventListener('mousedown', startScrolling);
            arrow.addEventListener('mouseup', stopScrolling);
            arrow.addEventListener('mouseleave', stopScrolling);
            arrow.addEventListener('touchstart', startScrolling, { passive: false });
            arrow.addEventListener('touchend', stopScrolling);
            arrow.addEventListener('touchcancel', stopScrolling);
            return arrow;
        }
        scrollContainer.appendChild(createScrollArrow('left'));
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'bazaar-scroll-wrapper';
        const cardContainer = document.createElement('div');
        cardContainer.className = 'bazaar-card-container';
        scrollWrapper.appendChild(cardContainer);
        scrollContainer.appendChild(scrollWrapper);
        scrollContainer.appendChild(createScrollArrow('right'));
        scrollWrapper.addEventListener('scroll', () => {
            if (!scrollWrapper.isScrolling) {
                scrollWrapper.isScrolling = true;
                requestAnimationFrame(function checkScroll() {
                    renderVirtualCards(container);
                    if (scrollWrapper.lastKnownScrollLeft === scrollWrapper.scrollLeft) {
                        renderVirtualCards(container);
                        scrollWrapper.isScrolling = false;
                    } else {
                        scrollWrapper.lastKnownScrollLeft = scrollWrapper.scrollLeft;
                        requestAnimationFrame(checkScroll);
                    }
                });
            }
        });
        container.appendChild(scrollContainer);
        const footerContainer = document.createElement('div');
        footerContainer.className = 'bazaar-footer-container';
        const listingsCount = document.createElement('div');
        listingsCount.className = 'bazaar-listings-count';
        listingsCount.textContent = 'Loading...';
        footerContainer.appendChild(listingsCount);
        const poweredBy = document.createElement('div');
        poweredBy.className = 'bazaar-powered-by';
        poweredBy.innerHTML = `
            <span>Powered by </span>
            <a href="https://tornpal.com/login?ref=1853324" target="_blank">TornPal</a>
            <span> &amp; </span>
            <a href="https://ironnerd.me/" target="_blank">IronNerd</a>
        `;
        footerContainer.appendChild(poweredBy);
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
                              aProfit = (marketValue * a.quantity) - (a.price * a.quantity) - Math.ceil((marketValue * a.quantity) * (fee / 100)),
                              bProfit = (marketValue * b.quantity) - (b.price * b.quantity) - Math.ceil((marketValue * b.quantity) * (fee / 100));
                        diff = aProfit - bProfit;
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
        if (wrapper.hasAttribute('data-has-bazaar-info')) return;
        let infoContainer = document.querySelector(`.bazaar-info-container[data-itemid="${itemId}"]`);
        if (!infoContainer) {
            infoContainer = createInfoContainer(itemName, itemId);
            wrapper.insertBefore(infoContainer, wrapper.firstChild);
            wrapper.setAttribute('data-has-bazaar-info', 'true');
        } else if (!wrapper.contains(infoContainer)) {
            infoContainer = createInfoContainer(itemName, itemId);
            wrapper.insertBefore(infoContainer, wrapper.firstChild);
            wrapper.setAttribute('data-has-bazaar-info', 'true');
        } else {
            const header = infoContainer.querySelector('.bazaar-info-header');
            if (header) {
                header.textContent = `Bazaar Listings for ${itemName} (ID: ${itemId})`;
            }
        }
        const cardContainer = infoContainer.querySelector('.bazaar-card-container');
        const countElement = infoContainer.querySelector('.bazaar-listings-count');
        const updateListingsCount = (text) => {
            if (countElement) {
                countElement.textContent = text;
            }
        };
        const showEmptyState = (isError) => {
            if (cardContainer) {
                cardContainer.innerHTML = '';
                cardContainer.style.width = '';
                renderMessageInContainer(cardContainer, isError);
            }
            updateListingsCount(isError ? 'API Error - Check back later' : 'No listings available');
        };
        if (cardContainer) {
            cardContainer.innerHTML = '<div style="padding:10px; text-align:center; width:100%;">Loading bazaar listings...</div>';
        }
        const cachedData = getCache(itemId);
        if (cachedData) {
            allListings = sortListings(cachedData.listings);
            if (allListings.length === 0) {
                showEmptyState(false);
            } else {
                renderVirtualCards(infoContainer);
            }
            return;
        }
        let listings = [], responses = 0, apiErrors = false;
        let requestTimeout = setTimeout(() => {
            console.warn('Bazaar listings request timed out');
            if (responses < 2) {
                showEmptyState(true);
                responses = 2;
            }
        }, 15000);
        function processResponse(newListings, error) {
            if (error) {
                apiErrors = true;
            }
            if (Array.isArray(newListings)) {
                newListings.forEach(newItem => {
                    const normalized = newItem.user_id !== undefined ? {
                        item_id: newItem.item_id,
                        player_id: newItem.user_id,
                        quantity: newItem.quantity,
                        price: newItem.price,
                        updated: newItem.last_updated,
                        source: "ironnerd",
                        player_name: newItem.player_name || null
                    } : newItem;
                    const duplicate = listings.find(item =>
                        item.player_id === normalized.player_id &&
                        item.price === normalized.price &&
                        item.quantity === normalized.quantity
                    );
                    if (duplicate) {
                        duplicate.source = duplicate.source === normalized.source ?
                            duplicate.source : "TornPal & IronNerd";
                        if (!duplicate.player_name && normalized.player_name) {
                            duplicate.player_name = normalized.player_name;
                        }
                    } else {
                        listings.push(normalized);
                    }
                });
            }
            responses++;
            if (responses === 2) {
                clearTimeout(requestTimeout);
                setCache(itemId, { listings });
                if (listings.length === 0) {
                    showEmptyState(apiErrors);
                } else {
                    allListings = sortListings(listings);
                    renderVirtualCards(infoContainer);
                }
            }
        }
        fetchJSON(`https://tornpal.com/api/v1/markets/clist/${itemId}?comment=wBazaarMarket`, data => {
            processResponse(data && Array.isArray(data.listings) ? data.listings.filter(l => l.source === "bazaar") : [], data === null);
        });
        fetchJSON(`https://www.ironnerd.me/get_bazaar_items/${itemId}?comment=wBazaarMarket`, data => {
            processResponse(data && Array.isArray(data.bazaar_items) ? data.bazaar_items : [], data === null);
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
            iconSvg.innerHTML = svgTemplates.warningIcon;
            textDiv.textContent = "Unable to load bazaar listings. Please try again later.";
            textDiv.style.cssText = currentDarkMode ? 'color:#ff9999; font-weight:bold;' : 'color:#cc0000; font-weight:bold;';
        } else {
            iconSvg.innerHTML = svgTemplates.infoIcon;
            textDiv.textContent = "No bazaar listings available for this item.";
        }
        messageContainer.appendChild(iconSvg);
        messageContainer.appendChild(textDiv);
        container.appendChild(messageContainer);
    }

    function processSellerWrapper(wrapper) {
        if (!wrapper || wrapper.classList.contains('bazaar-info-container') || wrapper.hasAttribute('data-bazaar-processed')) return;
        const existingContainer = wrapper.querySelector(':scope > .bazaar-info-container');
        if (existingContainer) return;
        const itemTile = wrapper.previousElementSibling;
        if (!itemTile) return;
        const nameEl = itemTile.querySelector('.name___ukdHN'),
              btn = itemTile.querySelector('button[aria-controls^="wai-itemInfo-"]');
        if (nameEl && btn) {
            const itemName = nameEl.textContent.trim();
            const idParts = btn.getAttribute('aria-controls').split('-');
            const itemId = idParts[idParts.length - 1];
            wrapper.setAttribute('data-bazaar-processed', 'true');
            updateInfoContainer(wrapper, itemId, itemName);
        }
    }

    function processMobileSellerList() {
        if (!checkMobileView()) return;
        const sellerList = document.querySelector('ul.sellerList___e4C9_, ul[class*="sellerList"]');
        if (!sellerList) {
            const existing = document.querySelector('.bazaar-info-container');
            if (existing && !document.contains(existing.parentNode)) {
                existing.remove();
            }
            return;
        }
        if (sellerList.hasAttribute('data-has-bazaar-container')) {
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
        const existingContainer = document.querySelector(`.bazaar-info-container[data-itemid="${itemId}"]`);
        if (existingContainer) {
            if (existingContainer.parentNode !== sellerList.parentNode ||
                existingContainer.nextSibling !== sellerList) {
                sellerList.parentNode.insertBefore(existingContainer, sellerList);
            }
            return;
        }
        const infoContainer = createInfoContainer(itemName, itemId);
        sellerList.parentNode.insertBefore(infoContainer, sellerList);
        sellerList.setAttribute('data-has-bazaar-container', 'true');
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
                (node.classList.contains('bazaar-info-container') ||
                 node.querySelector('.bazaar-info-container'))
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
                    const container = document.querySelector('.bazaar-info-container');
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

                    ['visited_', 'tornBazaarCache_'].forEach(prefix => {
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
                if (key && (key.startsWith("visited_") || key.startsWith("tornBazaarCache_"))) {
                    try {
                        const val = JSON.parse(GM_getValue(key));
                        let ts = null;
                        if (key.startsWith("visited_") && val && val.lastClickedUpdated) {
                            ts = val.lastClickedUpdated;
                        } else if (key.startsWith("tornBazaarCache_") && val && val.timestamp) {
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
        const container = event.target.closest('.bazaar-info-container');
        if (!container) return;
        if (event.target.matches('.bazaar-order-toggle')) {
            currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
            event.target.textContent = currentSortOrder === "asc" ? "Asc" : "Desc";
            performSort(container);
        }
        if (event.target.matches('.bazaar-display-toggle')) {
            displayMode = displayMode === "percentage" ? "profit" : "percentage";
            event.target.textContent = displayMode === "percentage" ? "%" : "$";
            scriptSettings.defaultDisplayMode = displayMode;
            saveSettings();

            const allContainers = document.querySelectorAll('.bazaar-info-container');
            allContainers.forEach(container => {
                renderVirtualCards(container);

                const cardContainer = container.querySelector('.bazaar-card-container');
                if (cardContainer) {
                    const scrollWrapper = container.querySelector('.bazaar-scroll-wrapper');
                    const currentScroll = scrollWrapper ? scrollWrapper.scrollLeft : 0;

                    const itemId = container.dataset.itemid;
                    if (itemId) {
                        if (allListings && allListings.length > 0) {
                            cardContainer.innerHTML = '';
                            renderVirtualCards(container);

                            if (scrollWrapper) {
                                scrollWrapper.scrollLeft = currentScroll;
                            }
                        }
                    }
                }
            });

            return;
        }
    });

    document.body.addEventListener('input', event => {
        const container = event.target.closest('.bazaar-info-container');
        if (!container) return;
        if (event.target.matches('.bazaar-min-qty')) {
            clearTimeout(event.target.debounceTimer);
            event.target.debounceTimer = setTimeout(() => {
                const scrollWrapper = container.querySelector('.bazaar-scroll-wrapper');
                if (scrollWrapper) {
                    scrollWrapper.scrollLeft = 0;
                }
                container.lastRenderScrollLeft = undefined;
                if (!allListings || allListings.length === 0) {
                    const itemId = container.getAttribute('data-itemid');
                    if (itemId) {
                        const cachedData = getCache(itemId);
                        if (cachedData && cachedData.listings && cachedData.listings.length > 0) {
                            allListings = sortListings(cachedData.listings);
                        }
                    }
                }
                renderVirtualCards(container);
            }, 300);
        }
    });

    document.body.addEventListener('change', event => {
        const container = event.target.closest('.bazaar-info-container');
        if (!container) return;
        if (event.target.matches('.bazaar-sort-select')) {
            const newSortKey = event.target.value;
            if (newSortKey !== currentSortKey) {
                currentSortKey = newSortKey;
                currentSortOrder = getSortOrderForKey(currentSortKey);
                const orderToggle = container.querySelector('.bazaar-order-toggle');
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
        const cardContainer = container.querySelector('.bazaar-card-container');
        const scrollWrapper = container.querySelector('.bazaar-scroll-wrapper');
        if (cardContainer && scrollWrapper) {
            scrollWrapper.scrollLeft = 0;
            container.lastRenderScrollLeft = undefined;
            renderVirtualCards(container);
        }
    }

    function addSettingsMenuItem() {
        const menu = document.querySelector('.settings-menu');
        if (!menu || document.querySelector('.bazaar-settings-button')) return;
        const li = document.createElement('li');
        li.className = 'link bazaar-settings-button';
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
        span.textContent = 'Bazaar Settings';
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
        overlay.className = "bazaar-modal-overlay";
        const modal = document.createElement("div");
        modal.className = "bazaar-settings-modal";
        modal.innerHTML = `
            <div class="bazaar-settings-title">Bazaar Listings Settings</div>
            <div class="bazaar-tabs">
                <div class="bazaar-tab active" data-tab="settings">Settings</div>
                <div class="bazaar-tab" data-tab="scripts">Other Scripts</div>
            </div>
            <div class="bazaar-tab-content active" id="tab-settings" style="max-height: 350px; overflow-y: auto;">
                <div class="bazaar-settings-group">
                    <div class="bazaar-settings-item">
                        <label for="bazaar-api-key">Torn API Key (Optional)</label>
                        <div style="display: flex; gap: 5px; align-items: center; width: 100%;">
                            <input type="text" id="bazaar-api-key" value="${scriptSettings.apiKey || ''}" placeholder="Enter your API key here" style="flex-grow: 1; max-width: none;">
                            <button class="bazaar-button refresh-market-data" id="refresh-market-data" style="white-space: nowrap; padding: 8px 10px; height: 35px;">Refresh Values</button>
                        </div>
                        <div id="refresh-status" style="margin-top: 5px; font-size: 12px; display: none;"></div>
                        <div class="bazaar-api-note">
                            Providing an API key enables market value comparison. Your key stays local.<br>
                            Alternatively, install <a href="https://greasyfork.org/en/scripts/527925-customizable-bazaar-filler" target="_blank">Bazaar Filler</a>, which works seamlessly with this script (Only ONE API call is made each day!)
                        </div>
                    </div>
                    <div class="bazaar-settings-item">
                        <label for="bazaar-default-sort">Default Sort</label>
                        <select id="bazaar-default-sort">
                            <option value="price" ${scriptSettings.defaultSort === 'price' ? 'selected' : ''}>Price</option>
                            <option value="quantity" ${scriptSettings.defaultSort === 'quantity' ? 'selected' : ''}>Quantity</option>
                            <option value="profit" ${scriptSettings.defaultSort === 'profit' ? 'selected' : ''}>Profit</option>
                            <option value="updated" ${scriptSettings.defaultSort === 'updated' ? 'selected' : ''}>Last Updated</option>
                        </select>
                        <div class="bazaar-api-note">
                            Choose how listings are sorted: Price, Quantity, Profit, or Last Updated.
                        </div>
                    </div>
                    <div class="bazaar-settings-item">
                        <label for="bazaar-default-order">Default Order</label>
                        <select id="bazaar-default-order">
                            <option value="asc" ${scriptSettings.defaultOrder === 'asc' ? 'selected' : ''}>Ascending</option>
                            <option value="desc" ${scriptSettings.defaultOrder === 'desc' ? 'selected' : ''}>Descending</option>
                        </select>
                        <div class="bazaar-api-note">
                            Choose the sorting direction.
                        </div>
                    </div>
                    <div class="bazaar-settings-item">
                        <label for="bazaar-listing-fee">Listing Fee (%)</label>
                        <input type="number" id="bazaar-listing-fee" class="bazaar-number-input" value="${scriptSettings.listingFee || 0}" min="0" max="100" step="1">
                        <div class="bazaar-api-note">
                            Set the fee percentage when listing items. (e.g., 10% fee means $10,000 on $100,000)
                        </div>
                    </div>
                    <div class="bazaar-settings-item">
                        <label for="bazaar-default-display">Default Display Mode</label>
                        <select id="bazaar-default-display">
                            <option value="percentage" ${scriptSettings.defaultDisplayMode === 'percentage' ? 'selected' : ''}>Percentage Difference</option>
                            <option value="profit" ${scriptSettings.defaultDisplayMode === 'profit' ? 'selected' : ''}>Potential Profit</option>
                        </select>
                        <div class="bazaar-api-note">
                            Choose whether to display price comparisons as a percentage or in dollars.
                        </div>
                    </div>
                    <div class="bazaar-settings-item">
                        <label for="bazaar-link-behavior">Bazaar Link Click Behavior</label>
                        <select id="bazaar-link-behavior">
                            <option value="new_tab" ${scriptSettings.linkBehavior === 'new_tab' ? 'selected' : ''}>Open in New Tab</option>
                            <option value="new_window" ${scriptSettings.linkBehavior === 'new_window' ? 'selected' : ''}>Open in New Window</option>
                            <option value="same_tab" ${scriptSettings.linkBehavior === 'same_tab' ? 'selected' : ''}>Open in Same Tab</option>
                        </select>
                        <div class="bazaar-api-note">
                            Choose how bazaar links open when clicked.
                        </div>
                    </div>
                </div>
            </div>
            <div class="bazaar-tab-content" id="tab-scripts" style="max-height: 350px; overflow-y: auto;">
                <div class="bazaar-script-item">
                    <div class="bazaar-script-name">Customizable Bazaar Filler</div>
                    <div class="bazaar-script-desc">Auto-fills bazaar item quantities and prices.</div>
                    <a href="https://greasyfork.org/en/scripts/527925-customizable-bazaar-filler" target="_blank" class="bazaar-script-link">Install from Greasy Fork</a>
                </div>
                <div class="bazaar-script-item">
                    <div class="bazaar-script-name">Torn Item Market Highlighter</div>
                    <div class="bazaar-script-desc">Highlights items based on rules and prices.</div>
                    <a href="https://greasyfork.org/en/scripts/513617-torn-item-market-highlighter" target="_blank" class="bazaar-script-link">Install from Greasy Fork</a>
                </div>
                <div class="bazaar-script-item">
                    <div class="bazaar-script-name">Torn Item Market Max Quantity Calculator</div>
                    <div class="bazaar-script-desc">Calculates the max quantity you can buy.</div>
                    <a href="https://greasyfork.org/en/scripts/513790-torn-item-market-max-quantity-calculator" target="_blank" class="bazaar-script-link">Install from Greasy Fork</a>
                </div>
                <div class="bazaar-script-item">
                    <div class="bazaar-script-name">Enhanced Chat Buttons V2</div>
                    <div class="bazaar-script-desc">Improves chat with extra buttons.</div>
                    <a href="https://greasyfork.org/en/scripts/488294-torn-com-enhanced-chat-buttons-v2" target="_blank" class="bazaar-script-link">Install from Greasy Fork</a>
                </div>
                <div class="bazaar-script-item">
                    <div class="bazaar-script-name">Market Item Locker</div>
                    <div class="bazaar-script-desc">Lock items when listing to avoid accidental sales.</div>
                    <a href="https://greasyfork.org/en/scripts/513784-torn-market-item-locker" target="_blank" class="bazaar-script-link">Install from Greasy Fork</a>
                </div>
                <div class="bazaar-script-item">
                    <div class="bazaar-script-name">Market Quick Remove</div>
                    <div class="bazaar-script-desc">Quickly remove items from your listings.</div>
                    <a href="https://greasyfork.org/en/scripts/515870-torn-market-quick-remove" target="_blank" class="bazaar-script-link">Install from Greasy Fork</a>
                </div>
                <div class="bazaar-script-item">
                    <div class="bazaar-script-name">Trade Chat Timer on Button</div>
                    <div class="bazaar-script-desc">Adds a timer to the trade chat button.</div>
                    <a href="https://greasyfork.org/en/scripts/496284-trade-chat-timer-on-button" target="_blank" class="bazaar-script-link">Install from Greasy Fork</a>
                </div>
            </div>
            <div class="bazaar-settings-buttons">
                <button class="bazaar-settings-save">Save</button>
                <button class="bazaar-settings-cancel">Cancel</button>
            </div>
            <div class="bazaar-settings-footer">
                <p>This script uses data from <a href="https://tornpal.com" target="_blank">TornPal</a> and <a href="https://www.ironnerd.me/torn/" target="_blank">IronNerd</a>.</p>
                <p>Created by <a href="https://www.torn.com/profiles.php?XID=1853324" target="_blank">Weav3r [1853324]</a></p>
            </div>
        `;
        overlay.appendChild(modal);
        const tabs = modal.querySelectorAll('.bazaar-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                modal.querySelectorAll('.bazaar-tab-content').forEach(content => content.classList.remove('active'));
                document.getElementById(`tab-${this.getAttribute('data-tab')}`).classList.add('active');
            });
        });
        modal.querySelector('.bazaar-settings-save').addEventListener('click', () => {
            saveSettingsFromModal(modal);
            overlay.remove();
        });
        modal.querySelector('.bazaar-settings-cancel').addEventListener('click', () => {
            overlay.remove();
        });
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.remove();
        });
        document.body.appendChild(overlay);
    }

    function saveSettingsFromModal(modal) {
        const oldLinkBehavior = scriptSettings.linkBehavior;
        scriptSettings.apiKey = modal.querySelector('#bazaar-api-key').value.trim();
        scriptSettings.defaultSort = modal.querySelector('#bazaar-default-sort').value;
        scriptSettings.defaultOrder = modal.querySelector('#bazaar-default-order').value;
        scriptSettings.listingFee = Math.round(parseFloat(modal.querySelector('#bazaar-listing-fee').value) || 0);
        scriptSettings.defaultDisplayMode = modal.querySelector('#bazaar-default-display').value;
        scriptSettings.linkBehavior = modal.querySelector('#bazaar-link-behavior').value;

        if (scriptSettings.listingFee < 0) scriptSettings.listingFee = 0;
        if (scriptSettings.listingFee > 100) scriptSettings.listingFee = 100;
        currentSortKey = scriptSettings.defaultSort;
        currentSortOrder = scriptSettings.defaultOrder;
        displayMode = scriptSettings.defaultDisplayMode;
        saveSettings();
        document.querySelectorAll('.bazaar-info-container').forEach(container => {
            const sortSelect = container.querySelector('.bazaar-sort-select');
            if (sortSelect) sortSelect.value = currentSortKey;
            const orderToggle = container.querySelector('.bazaar-order-toggle');
            if (orderToggle) orderToggle.textContent = currentSortOrder === "asc" ? "Asc" : "Desc";
            const displayToggle = container.querySelector('.bazaar-display-toggle');
            if (displayToggle) displayToggle.textContent = displayMode === "percentage" ? "%" : "$";
            if (oldLinkBehavior !== scriptSettings.linkBehavior) {
                const cardContainer = container.querySelector('.bazaar-card-container');
                if (cardContainer) {
                    cardContainer.innerHTML = '';
                    container.lastRenderScrollLeft = undefined;
                    renderVirtualCards(container);
                }
            } else {
                performSort(container);
            }
        });
        if (scriptSettings.apiKey) {
            fetchTornItems(true);
        }
    }

    function fetchTornItems(forceRefresh = false) {
        const stored = GM_getValue("tornItems"),
              lastUpdated = GM_getValue("lastTornItemsUpdate") || 0,
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
                    GM_setValue("tornItems", JSON.stringify(filtered));
                    GM_setValue("lastTornItemsUpdate", now.toString());

                    if (refreshStatus) {
                        refreshStatus.textContent = `Market values updated successfully! (${todayUTC})`;
                        refreshStatus.style.color = '#009900';
                        setTimeout(() => {
                            refreshStatus.style.display = 'none';
                        }, 3000);
                    }

                    document.querySelectorAll('.bazaar-info-container').forEach(container => {
                        if (container.isConnected) {
                            const cardContainer = container.querySelector('.bazaar-card-container');
                            if (cardContainer) {
                                cardContainer.innerHTML = '';
                                container.lastRenderScrollLeft = undefined;
                                renderVirtualCards(container);
                            }
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
            const apiKeyInput = document.getElementById('bazaar-api-key');
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
        document.querySelectorAll('.bazaar-scroll-container').forEach(container => {
            const scrollWrapper = container.querySelector('.bazaar-scroll-wrapper');
            if (scrollWrapper && scrollWrapper.isScrolling) {
                cancelAnimationFrame(scrollWrapper.scrollAnimationId);
            }
        });
    }
    window.addEventListener('beforeunload', cleanupResources);

    // Function to detect if running in Torn PDA
    function isTornPDAEnvironment() {
        return new Promise((resolve) => {
            if (typeof window.flutter_inappwebview !== 'undefined') {
                window.flutter_inappwebview.callHandler('isTornPDA')
                    .then(response => {
                        resolve(response && response.isTornPDA);
                    })
                    .catch(() => {
                        resolve(false);
                    });
            } else {
                resolve(false);
            }
        });
    }

    // Function to evaluate JavaScript using appropriate method based on environment
    function evaluateJavaScript(code) {
        return new Promise((resolve, reject) => {
            isTornPDAEnvironment()
                .then(isPDA => {
                    if (isPDA) {
                        // Use Torn PDA's JavaScript evaluation handler
                        window.flutter_inappwebview.callHandler('PDA_evaluateJavascript', code)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        // Use standard eval in non-PDA environments
                        try {
                            // Using Function constructor is slightly safer than direct eval
                            const result = Function('"use strict";' + code)();
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }
                })
                .catch(reject);
        });
    }

    // Create a function to handle API POST requests to TornPal and IronNerd
    function makeAPIPostRequest(url, data, callback) {
        const MAX_RETRIES = 2;
        const TIMEOUT_MS = 10000;
        const RETRY_DELAY_MS = 2000;
        let retryCount = 0;

        function attemptPost() {
            let timeoutId = setTimeout(() => {
                console.warn(`POST request to ${url} timed out, ${retryCount < MAX_RETRIES ? 'retrying...' : 'giving up.'}`);
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    setTimeout(attemptPost, RETRY_DELAY_MS);
                } else {
                    callback(null);
                }
            }, TIMEOUT_MS);

            // Determine if we're in Torn PDA environment
            if (typeof window.flutter_inappwebview !== 'undefined') {
                window.flutter_inappwebview.callHandler('isTornPDA')
                    .then(response => {
                        if (response && response.isTornPDA) {
                            // Use Torn PDA's HTTP POST handler
                            const headers = {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            };

                            const body = typeof data === 'string' ? data : JSON.stringify(data);

                            window.flutter_inappwebview.callHandler('PDA_httpPost', url, headers, body)
                                .then(response => {
                                    clearTimeout(timeoutId);
                                    try {
                                        if (response.status >= 200 && response.status < 300) {
                                            callback(JSON.parse(response.responseText));
                                        } else {
                                            console.warn(`POST request to ${url} failed with status ${response.status}`);
                                            if (retryCount < MAX_RETRIES) {
                                                retryCount++;
                                                setTimeout(attemptPost, RETRY_DELAY_MS);
                                            } else {
                                                callback(null);
                                            }
                                        }
                                    } catch (e) {
                                        console.error(`Error parsing response from ${url}:`, e);
                                        callback(null);
                                    }
                                })
                                .catch(error => {
                                    clearTimeout(timeoutId);
                                    console.warn(`POST request to ${url} failed:`, error);
                                    if (retryCount < MAX_RETRIES) {
                                        retryCount++;
                                        setTimeout(attemptPost, RETRY_DELAY_MS);
                                    } else {
                                        callback(null);
                                    }
                                });
                        } else {
                            // Use standard GM methods
                            useStandardPostMethod();
                        }
                    })
                    .catch(() => {
                        // If handler check fails, use standard methods
                        useStandardPostMethod();
                    });
            } else {
                // Not in Torn PDA, use standard methods
                useStandardPostMethod();
            }

            function useStandardPostMethod() {
                const postFunction = typeof GM_xmlhttpRequest !== 'undefined'
                    ? GM_xmlhttpRequest
                    : (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined'
                        ? GM.xmlHttpRequest
                        : null);

                if (!postFunction) {
                    console.error('Neither GM_xmlhttpRequest nor GM.xmlHttpRequest are available');
                    clearTimeout(timeoutId);
                    callback(null);
                    return;
                }

                postFunction({
                    method: 'POST',
                    url,
                    data: typeof data === 'string' ? data : JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: TIMEOUT_MS,
                    onload: res => {
                        clearTimeout(timeoutId);
                        try {
                            if (res.status >= 200 && res.status < 300) {
                                callback(JSON.parse(res.responseText));
                            } else {
                                console.warn(`POST request to ${url} failed with status ${res.status}`);
                                if (retryCount < MAX_RETRIES) {
                                    retryCount++;
                                    setTimeout(attemptPost, RETRY_DELAY_MS);
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
                        console.warn(`POST request to ${url} failed:`, error);
                        if (retryCount < MAX_RETRIES) {
                            retryCount++;
                            setTimeout(attemptPost, RETRY_DELAY_MS);
                        } else {
                            callback(null);
                        }
                    },
                    ontimeout: () => {
                        clearTimeout(timeoutId);
                        console.warn(`POST request to ${url} timed out natively`);
                        if (retryCount < MAX_RETRIES) {
                            retryCount++;
                            setTimeout(attemptPost, RETRY_DELAY_MS);
                        } else {
                            callback(null);
                        }
                    }
                });
            }
        }

        attemptPost();
    }
})();