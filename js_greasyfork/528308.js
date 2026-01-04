// ==UserScript==
// @name         Bazaars in Item Market
// @namespace    http://tampermonkey.net/
// @version      4.9
// @description  name if it fucking works on tornpda you lil shit
// @author       Weav3r
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/bazaar.php*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      weav3r.dev
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528308/Bazaars%20in%20Item%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/528308/Bazaars%20in%20Item%20Market.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    const PDA = {
        isDetected: false,
        handlers: {},

        async detect() {
            try {
                if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
                    const response = await window.flutter_inappwebview.callHandler('isTornPDA');
                    this.isDetected = response && response.isTornPDA;
                    if (this.isDetected) {
                        this.setupHandlers();
                    }
                } else if (navigator.userAgent && navigator.userAgent.includes('TornPDA')) {
                    this.isDetected = true;
                    this.setupHandlers();
                }
            } catch (e) {
                this.isDetected = false;
            }
            return this.isDetected;
        },

        setupHandlers() {
            this.handlers.httpGet = async (url, headers = {}) => {
                try {
                    const response = await window.flutter_inappwebview.callHandler('PDA_httpGet', url, headers);
                    return {
                        responseText: response.responseText,
                        status: response.status,
                        statusText: response.statusText,
                        responseHeaders: response.responseHeaders
                    };
                } catch (error) {
                    throw new Error(`PDA HTTP GET failed: ${error}`);
                }
            };

            this.handlers.httpPost = async (url, headers = {}, body = '') => {
                try {
                    const response = await window.flutter_inappwebview.callHandler('PDA_httpPost', url, headers, body);
                    return {
                        responseText: response.responseText,
                        status: response.status,
                        statusText: response.statusText,
                        responseHeaders: response.responseHeaders
                    };
                } catch (error) {
                    throw new Error(`PDA HTTP POST failed: ${error}`);
                }
            };

            this.handlers.evaluate = async (code) => {
                try {
                    await window.flutter_inappwebview.callHandler('PDA_evaluateJavascript', code);
                } catch (error) {
                    throw new Error(`PDA JS evaluation failed: ${error}`);
                }
            };
        },

        async httpRequest(options) {
            if (this.isDetected && options.method === 'GET') {
                const response = await this.handlers.httpGet(options.url, options.headers || {});
                return {
                    responseText: response.responseText,
                    status: response.status,
                    readyState: 4,
                    response: response.responseText
                };
            } else if (this.isDetected && options.method === 'POST') {
                const response = await this.handlers.httpPost(options.url, options.headers || {}, options.data || '');
                return {
                    responseText: response.responseText,
                    status: response.status,
                    readyState: 4,
                    response: response.responseText
                };
            } else {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        ...options,
                        onload: resolve,
                        onerror: reject
                    });
                });
            }
        }
    };

    // PDA detection will be awaited in init() function

    const CONFIG = {
        CACHE_DURATION: 30000,
        ITEMS_PER_PAGE: 3,
        DEFAULT_SORT: 'price-asc',
        DEFAULT_MIN_QTY: 0,
        SHOW_MARKET_COMPARISON: true,
        BAZAAR_CLICK_BEHAVIOR: 'new-tab',
        SELECTORS: {
            DESKTOP_LIST: '.sellerListWrapper___PN32N .sellerList___kgAh_',
            MOBILE_LIST: '.sellerList___e4C9_',
            MOBILE_HEADER: '.itemsHeader___ZTO9r',
            MOBILE_ROW: '.rowWrapper___OrFGK'
        },
        MOBILE_BREAKPOINT: 784
    };

    const loadSettings = () => {
        const saved = localStorage.getItem('bazaarListingsSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                return { ...CONFIG, ...settings };
            } catch (e) {
                console.error('[Bazaar Listings] Failed to parse saved settings:', e);
                // Clear corrupted settings
                localStorage.removeItem('bazaarListingsSettings');
            }
        }
        return CONFIG;
    };

    const saveSettings = (settings) => {
        localStorage.setItem('bazaarListingsSettings', JSON.stringify(settings));
        Object.assign(CONFIG, settings);
    };

    Object.assign(CONFIG, loadSettings());

    const state = {
        originalFetch: null,
        currentDisplay: null,
        apiCache: new Map(),
        currentItemID: null,
        // Track container lifecycle without observers
        containerRefs: new WeakMap()
    };

    const injectStyles = () => {
        const styles = `
            :root {
                --base-font-size: clamp(12px, 1vw, 14px);
                --small-font-size: clamp(11px, 0.9vw, 12px);
                --tiny-font-size: clamp(10px, 0.8vw, 11px);
                --large-font-size: clamp(13px, 1.1vw, 15px);
                --title-font-size: clamp(14px, 1.2vw, 16px);

                --spacing-xs: clamp(3px, 0.3vw, 3px);
                --spacing-sm: clamp(5px, 0.5vw, 6px);
                --spacing-md: clamp(8px, 0.8vw, 10px);
                --spacing-lg: clamp(12px, 1.2vw, 16px);

                --bazaar-bg: #f5f5f5;
                --bazaar-card-bg: white;
                --bazaar-card-border: #ddd;
                --bazaar-card-shadow: rgba(0,0,0,0.06);
                --bazaar-card-shadow-hover: rgba(0,0,0,0.10);
                --bazaar-text-primary: #222;
                --bazaar-text-secondary: #666;
                --bazaar-text-tertiary: #888;
                --bazaar-price-color: #0070e0;
                --bazaar-nav-bg: #333;
                --bazaar-nav-bg-hover: #555;
                --bazaar-nav-disabled: #ccc;
                --bazaar-border-light: #eee;
                --bazaar-input-border: #ddd;
                --bazaar-error-color: #cc0000;
                --bazaar-qty-color: #444;
                --bazaar-container-border: #d0d0d0;
                --bazaar-container-bg: rgba(248, 249, 250, 0.6);
                --bazaar-container-shadow: rgba(0,0,0,0.08);
            }

            body.dark-mode {
                --bazaar-bg: #1a1a1a;
                --bazaar-card-bg: #2a2a2a;
                --bazaar-card-border: #444;
                --bazaar-card-shadow: rgba(0,0,0,0.3);
                --bazaar-card-shadow-hover: rgba(0,0,0,0.5);
                --bazaar-text-primary: #e8e8e8;
                --bazaar-text-secondary: #aaa;
                --bazaar-text-tertiary: #888;
                --bazaar-price-color: #4da6ff;
                --bazaar-nav-bg: #444;
                --bazaar-nav-bg-hover: #666;
                --bazaar-nav-disabled: #333;
                --bazaar-border-light: #3a3a3a;
                --bazaar-input-border: #555;
                --bazaar-error-color: #ff6666;
                --bazaar-qty-color: #ccc;
                --bazaar-container-border: #555;
                --bazaar-container-bg: rgba(35, 35, 35, 0.8);
                --bazaar-container-shadow: rgba(0,0,0,0.4);
            }
            .bazaar-container {
                display: block;
                list-style: none;
                margin-bottom: var(--spacing-md);
                padding: clamp(12px, 1.5vw, 16px);
                border: 2px solid var(--bazaar-container-border);
                border-radius: clamp(6px, 1vw, 8px);
                background: var(--bazaar-container-bg);
                box-shadow: 0 2px 4px var(--bazaar-container-shadow);
            }

            /* When container is a child of sellerListWrapper */
            .sellerListWrapper___PN32N > .bazaar-container {
                margin-bottom: var(--spacing-lg);
                width: 100%;
                box-sizing: border-box;
            }

            .itemsHeader___ZTO9r + .bazaar-container {
                margin-top: var(--spacing-md);
                margin-bottom: var(--spacing-md);
            }

            .bazaar-controls {
                display: flex;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm);
                background: var(--bazaar-bg);
                border-radius: clamp(3px, 0.5vw, 4px);
                margin-bottom: var(--spacing-md);
                align-items: center;
                border: 1px solid var(--bazaar-border-light);
            }

            .bazaar-filter {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                margin-right: var(--spacing-md);
            }

            .bazaar-filter label {
                font-size: var(--small-font-size);
                color: var(--bazaar-text-secondary);
            }

                            .bazaar-filter input {
                    width: clamp(55px, 8vw, 65px);
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border: 1px solid var(--bazaar-input-border);
                    border-radius: clamp(2px, 0.4vw, 3px);
                    font-size: var(--small-font-size);
                    background: var(--bazaar-card-bg);
                    color: var(--bazaar-text-primary);
                }

            .bazaar-sort-buttons {
                display: flex;
                gap: var(--spacing-xs);
                align-items: center;
            }

            .bazaar-sort-label {
                font-size: var(--small-font-size);
                color: var(--bazaar-text-secondary);
                margin-right: var(--spacing-xs);
            }

            .bazaar-sort-btn {
                padding: var(--spacing-xs) var(--spacing-md);
                border: 1px solid var(--bazaar-input-border);
                background: var(--bazaar-card-bg);
                color: var(--bazaar-text-primary);
                border-radius: clamp(2px, 0.4vw, 3px);
                font-size: var(--small-font-size);
                cursor: pointer;
                transition: all 0.15s;
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                                    min-width: clamp(50px, 7vw, 55px);
            }

            .bazaar-sort-btn:hover {
                background: var(--bazaar-bg);
            }

            .bazaar-sort-btn[data-state="asc"],
            .bazaar-sort-btn[data-state="desc"] {
                background: var(--bazaar-nav-bg);
                color: white;
                border-color: var(--bazaar-nav-bg);
            }

            .bazaar-sort-btn[data-state="asc"]:hover,
            .bazaar-sort-btn[data-state="desc"]:hover {
                background: var(--bazaar-nav-bg-hover);
                border-color: var(--bazaar-nav-bg-hover);
            }

            .sort-arrow {
                font-size: var(--tiny-font-size);
                opacity: 0.8;
            }

            /* Touch indicator for mobile */
            @media (pointer: coarse) {
                .bazaar-display::after {
                    content: '';
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40px;
                    height: 4px;
                    background: var(--bazaar-nav-disabled);
                    border-radius: 2px;
                    opacity: 0.5;
                    transition: opacity 0.3s;
                }

                .bazaar-container:hover .bazaar-display::after {
                    opacity: 0.8;
                }
            }

            @media (max-width: 784px) {
                :root {
                    --base-font-size: clamp(12px, 2vw, 13px);
                    --small-font-size: clamp(11px, 1.7vw, 12px);
                    --tiny-font-size: clamp(10px, 1.5vw, 11px);
                    --large-font-size: clamp(13px, 2vw, 14px);
                    --title-font-size: clamp(14px, 2.2vw, 15px);
                }

                .bazaar-container {
                    margin: var(--spacing-sm) 0;
                    padding: max(var(--spacing-md), 12px);
                }

                .bazaar-controls {
                    flex-direction: column;
                    gap: var(--spacing-md);
                    padding: var(--spacing-sm);
                }

                .bazaar-filter {
                    width: auto;
                    max-width: fit-content;
                    justify-content: flex-start;
                    align-items: baseline;
                    gap: var(--spacing-xs);
                    margin-right: var(--spacing-md);
                }
                .bazaar-filter input {
                    margin-right: 0;
                }

                .bazaar-sort-buttons {
                    width: 100%;
                    justify-content: space-between;
                    gap: var(--spacing-xs);
                }

                .bazaar-sort-label {
                    display: none;
                }

                .bazaar-sort-btn {
                    flex: 1;
                    padding: var(--spacing-sm) var(--spacing-sm);
                    min-width: auto;
                }

                .bazaar-display {
                    margin-top: var(--spacing-sm);
                }

                .bazaar-nav {
                    width: clamp(24px, 4vw, 28px);
                    min-height: clamp(40px, 8vw, 50px);
                    font-size: clamp(14px, 3vw, 18px);
                    border-radius: clamp(5px, 1.2vw, 8px);
                }

                .bazaar-cards-wrapper {
                    gap: var(--spacing-xs);
                }

                .bazaar-cards-wrapper.multi-row {
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--spacing-xs);
                }

                .bazaar-card {
                    padding: var(--spacing-sm) var(--spacing-sm);
                }

                .bazaar-card-info {
                    align-items: center;
                    margin-bottom: var(--spacing-xs);
                }

                .bazaar-card-price,
                .bazaar-card-qty {
                    width: 100%;
                    text-align: center;
                }

                .bazaar-card-name {
                    text-align: center;
                    margin-bottom: var(--spacing-sm);
                }

                .bazaar-card-bottom {
                    padding-top: var(--spacing-xs);
                }

                .rowWrapper___OrFGK .bazaar-container {
                    height: auto !important;
                    opacity: 1 !important;
                    transform: none !important;
                    position: relative;
                }

                div.bazaar-container {
                    width: 100%;
                    box-sizing: border-box;
                }
            }

            .bazaar-display {
                display: grid;
                grid-template-columns: clamp(26px, 3vw, 30px) 1fr clamp(26px, 3vw, 30px);
                align-items: stretch;
                width: 100%;
                max-width: 100%;
                overflow: hidden;
                box-sizing: border-box;
                background: none;
                padding: var(--spacing-sm);
                gap: var(--spacing-sm);
                position: relative;
                touch-action: pan-y;
            }

            .bazaar-nav {
                grid-row: 1;
                z-index: 2;
                opacity: 0.9;
                background: var(--bazaar-nav-bg);
                color: white;
                border: none;
                border-radius: clamp(6px, 1vw, 10px);
                width: 100%;
                height: 100%;
                min-height: clamp(50px, 6vw, 55px);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: clamp(14px, 2.5vw, 20px);
                transition: background 0.2s;
                padding: 0;
            }

            .bazaar-nav.prev { grid-column: 1; justify-self: stretch; }
            .bazaar-nav.next { grid-column: 3; justify-self: stretch; }

            .bazaar-nav:hover:not(:disabled) {
                background: var(--bazaar-nav-bg-hover);
                opacity: 1;
            }

            .bazaar-nav:disabled {
                background: var(--bazaar-nav-disabled);
                cursor: not-allowed;
                opacity: 0.6;
            }

            .bazaar-pagination-info {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-md);
                margin-top: var(--spacing-sm);
                margin-bottom: var(--spacing-sm);
                font-size: var(--small-font-size);
                color: var(--bazaar-text-secondary);
            }

            .bazaar-nav-first,
            .bazaar-nav-last {
                background: var(--bazaar-nav-bg);
                color: white;
                border: none;
                border-radius: clamp(3px, 0.5vw, 4px);
                padding: var(--spacing-xs) var(--spacing-md);
                cursor: pointer;
                font-size: var(--small-font-size);
                transition: all 0.2s;
                opacity: 0.9;
            }

            .bazaar-nav-first:hover:not(:disabled),
            .bazaar-nav-last:hover:not(:disabled) {
                background: var(--bazaar-nav-bg-hover);
                opacity: 1;
            }

            .bazaar-nav-first:disabled,
            .bazaar-nav-last:disabled {
                background: var(--bazaar-nav-disabled);
                cursor: not-allowed;
                opacity: 0.6;
            }

            .bazaar-page-info {
                font-weight: 500;
            }

            .current-page, .total-pages {
                font-weight: bold;
                color: var(--bazaar-text-primary);
            }

            .bazaar-cards-wrapper {
                grid-column: 2;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                gap: var(--spacing-xs);
                justify-content: center;
                align-items: stretch;
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                transition: transform 0.2s ease-out;
            }

            .bazaar-display.swiping .bazaar-cards-wrapper {
                transition: none;
            }

            .bazaar-cards-wrapper.multi-row {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--spacing-sm);
            }

            .bazaar-cards-wrapper.multi-row .bazaar-card {
                max-width: none;
                width: 100%;
            }

            .bazaar-error, .bazaar-empty {
                padding: var(--spacing-lg);
                text-align: center;
                font-size: var(--base-font-size);
            }

            .bazaar-error {
                color: var(--bazaar-error-color);
            }

            .bazaar-empty {
                color: var(--bazaar-text-secondary);
            }

            .bazaar-card {
                flex: 1 1 0;
                min-width: 0;
                max-width: 100%;
                margin: 0 1px;
                background: var(--bazaar-card-bg);
                border: 1px solid var(--bazaar-card-border);
                border-radius: clamp(4px, 0.8vw, 5px);
                padding: clamp(10px, 1vw, 12px) clamp(8px, 0.8vw, 10px);
                box-shadow: 0 1px 2px var(--bazaar-card-shadow);
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: default;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                word-break: break-word;
                overflow-wrap: anywhere;
            }

            .bazaar-card:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 6px var(--bazaar-card-shadow-hover);
            }

            .bazaar-card > div { margin-bottom: var(--spacing-xs); }

            .bazaar-card-name {
                font-weight: bold;
                font-size: var(--large-font-size);
                line-height: 1.2;
                font-family: sans-serif;
                color: var(--bazaar-text-primary);
                margin-bottom: var(--spacing-sm);
                letter-spacing: 0.1px;
                word-break: break-word;
                overflow-wrap: anywhere;
                min-width: 0;
            }

            .bazaar-settings-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(5px);
            }

            .bazaar-settings-modal.show {
                display: flex;
            }

            .bazaar-settings-content {
                background: var(--settings-bg);
                border-radius: clamp(6px, 1vw, 8px);
                max-width: min(600px, 90vw);
                width: 90%;
                max-height: 85vh;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                position: relative;
                display: flex;
                flex-direction: column;
            }

            :root {
                --settings-bg: #ffffff;
                --settings-header-bg: #f8f9fa;
                --settings-border: #dee2e6;
                --settings-text: #212529;
                --settings-text-secondary: #6c757d;
                --settings-tab-active: #0066cc;
                --settings-tab-hover: #f8f9fa;
                --settings-input-bg: #ffffff;
                --settings-input-border: #ced4da;
                --settings-button-primary: #28a745;
                --settings-button-secondary: #6c757d;
                --settings-credits-bg: #f8f9fa;
                --settings-link: #0066cc;
            }

            body.dark-mode {
                --settings-bg: #2b2b2b;
                --settings-header-bg: #1f1f1f;
                --settings-border: #444444;
                --settings-text: #e8e8e8;
                --settings-text-secondary: #aaaaaa;
                --settings-tab-active: #4da6ff;
                --settings-tab-hover: #3a3a3a;
                --settings-input-bg: #3a3a3a;
                --settings-input-border: #555555;
                --settings-button-primary: #28a745;
                --settings-button-secondary: #6c757d;
                --settings-credits-bg: #1f1f1f;
                --settings-link: #4da6ff;
            }

            .bazaar-settings-header {
                background: var(--settings-header-bg);
                padding: clamp(12px, 2vw, 20px) clamp(16px, 2.5vw, 24px);
                border-bottom: 1px solid var(--settings-border);
                position: relative;
            }

            .bazaar-settings-title {
                font-size: clamp(16px, 2vw, 20px);
                font-weight: 600;
                color: var(--settings-text);
                margin: 0;
                padding-right: 40px;
            }

            .bazaar-settings-body {
                flex: 1;
                overflow-y: auto;
                padding: clamp(16px, 2vw, 24px);
            }

            .bazaar-settings-body::-webkit-scrollbar {
                width: 8px;
            }

            .bazaar-settings-body::-webkit-scrollbar-track {
                background: var(--settings-bg);
            }

            .bazaar-settings-body::-webkit-scrollbar-thumb {
                background: var(--settings-border);
                border-radius: 4px;
            }

            .bazaar-settings-body::-webkit-scrollbar-thumb:hover {
                background: var(--settings-text-secondary);
            }

            .bazaar-settings-section {
                margin-bottom: clamp(16px, 2vw, 24px);
            }

            .bazaar-settings-section-title {
                font-size: clamp(14px, 1.5vw, 16px);
                font-weight: 600;
                color: var(--settings-text);
                margin-bottom: clamp(12px, 1.5vw, 16px);
            }

            .bazaar-settings-field {
                margin-bottom: clamp(12px, 1.5vw, 16px);
            }

            .bazaar-settings-field-label {
                display: block;
                font-size: clamp(12px, 1.2vw, 14px);
                font-weight: 500;
                color: var(--settings-text);
                margin-bottom: 4px;
            }

            .bazaar-settings-field-description {
                font-size: clamp(10px, 1vw, 12px);
                color: var(--settings-text-secondary);
                margin-bottom: 8px;
                line-height: 1.4;
            }

            .bazaar-settings-input,
            .bazaar-settings-select {
                padding: clamp(6px, 0.8vw, 8px) clamp(8px, 1vw, 12px);
                border: 1px solid var(--settings-input-border);
                border-radius: 4px;
                background: var(--settings-input-bg);
                color: var(--settings-text);
                font-size: clamp(12px, 1.2vw, 14px);
                transition: all 0.2s;
            }

            .bazaar-settings-input[type="number"] {
                width: 120px;
            }

            .bazaar-settings-select {
                width: auto;
                min-width: 200px;
                max-width: 300px;
            }

            .bazaar-settings-input:focus,
            .bazaar-settings-select:focus {
                outline: none;
                border-color: var(--settings-tab-active);
                box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
            }

            body.dark-mode .bazaar-settings-input:focus,
            body.dark-mode .bazaar-settings-select:focus {
                box-shadow: 0 0 0 3px rgba(77, 166, 255, 0.2);
            }

            .bazaar-settings-toggle-field {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 0;
            }

            .bazaar-settings-toggle-info {
                flex: 1;
                margin-right: 16px;
            }

            .bazaar-toggle-switch {
                position: relative;
                width: 48px;
                height: 24px;
                background: var(--settings-input-border);
                border-radius: 12px;
                cursor: pointer;
                transition: background 0.3s;
                flex-shrink: 0;
            }

            .bazaar-toggle-switch.active {
                background: var(--settings-button-primary);
            }

            .bazaar-toggle-slider {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .bazaar-toggle-switch.active .bazaar-toggle-slider {
                transform: translateX(24px);
            }

            .bazaar-settings-actions {
                display: flex;
                gap: clamp(8px, 1vw, 12px);
                justify-content: flex-end;
                padding: clamp(12px, 1.5vw, 16px) clamp(16px, 2vw, 24px);
                border-top: 1px solid var(--settings-border);
                background: var(--settings-header-bg);
            }

            .bazaar-settings-btn {
                padding: clamp(8px, 1vw, 10px) clamp(16px, 1.5vw, 20px);
                border: none;
                border-radius: 4px;
                font-size: clamp(12px, 1.2vw, 14px);
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .bazaar-settings-btn-primary {
                background: var(--settings-button-primary);
                color: white;
            }

            .bazaar-settings-btn-primary:hover {
                background: #218838;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
            }

            .bazaar-settings-btn-secondary {
                background: var(--settings-button-secondary);
                color: white;
            }

            .bazaar-settings-btn-secondary:hover {
                background: #5a6268;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
            }

            .bazaar-settings-credits {
                background: var(--settings-credits-bg);
                padding: clamp(12px, 1.5vw, 16px) clamp(16px, 2vw, 24px);
                border-top: 1px solid var(--settings-border);
                text-align: center;
                font-size: clamp(10px, 1vw, 12px);
                color: var(--settings-text-secondary);
                line-height: 1.6;
            }

            .bazaar-settings-credits a {
                color: var(--settings-link);
                text-decoration: none;
                font-weight: 500;
                transition: opacity 0.2s;
            }

            .bazaar-settings-credits a:hover {
                opacity: 0.8;
                text-decoration: underline;
            }

            .bazaar-settings-credits-divider {
                margin: 0 8px;
                color: var(--settings-text-secondary);
            }

            .bazaar-settings-close {
                position: absolute;
                top: 20px;
                right: 24px;
                background: none;
                border: none;
                font-size: 24px;
                color: var(--settings-text-secondary);
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .bazaar-settings-close:hover {
                background: var(--settings-tab-hover);
                color: var(--settings-text);
            }

            .bazaar-card-name a {
                color: #0066cc;
                text-decoration: none;
                transition: opacity 0.2s;
            }

            .bazaar-card-name a:visited {
                color: #800080 !important;
            }

            .bazaar-card-name a:hover {
                opacity: 0.8;
                text-decoration: underline;
            }

            body.dark-mode .bazaar-card-name a {
                color: #4da6ff;
            }

            body.dark-mode .bazaar-card-name a:visited {
                color: #b366ff !important;
            }

            .bazaar-card-info {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
                margin-bottom: var(--spacing-sm);
                min-width: 0;
                word-break: break-word;
                overflow-wrap: anywhere;
            }

            .bazaar-card-price,
            .bazaar-card-qty {
                font-weight: 500;
                font-size: var(--large-font-size);
                line-height: 1.1;
                font-family: sans-serif;
                color: var(--bazaar-text-primary);
            }

            .bazaar-card-bottom {
                display: flex;
                justify-content: center;
                align-items: center;
                border-top: 1px solid var(--bazaar-border-light);
                padding-top: var(--spacing-xs);
                margin-top: auto;
                font-size: var(--small-font-size);
                color: var(--bazaar-text-secondary);
            }

            .bazaar-card-time {
                color: var(--bazaar-text-tertiary);
                font-size: var(--tiny-font-size);
            }

            .bazaar-price-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
                min-width: 0;
                word-break: break-word;
                overflow-wrap: anywhere;
                width: 100%;
                text-align: center;
            }

            .bazaar-market-diff {
                display: block;
                text-align: center;
                margin: 0 auto;
                word-break: break-word;
                overflow-wrap: anywhere;
                min-width: 0;
            }

            .bazaar-market-diff.positive {
                color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
            }

            .bazaar-market-diff.negative {
                color: #22c55e;
                background: rgba(34, 197, 94, 0.1);
            }

            .bazaar-market-diff:hover {
                transform: scale(1.05);
            }

            body.dark-mode .bazaar-market-diff.positive {
                color: #f87171;
                background: rgba(248, 113, 113, 0.15);
            }

            body.dark-mode .bazaar-market-diff.negative {
                color: #4ade80;
                background: rgba(74, 222, 128, 0.15);
            }

            .bazaar-footer {
                margin-top: var(--spacing-sm);
                padding-top: var(--spacing-sm);
                border-top: 1px solid var(--bazaar-border-light);
                font-size: var(--base-font-size);
                color: var(--bazaar-text-secondary);
                line-height: 1.4;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: var(--spacing-xs);
            }

            .bazaar-footer-stats,
            .bazaar-footer-stat,
            .bazaar-footer-link,
            .bazaar-footer-separator {
                font-size: var(--base-font-size);
            }

            .bazaar-footer-link-text-full {
                display: inline;
            }

            .bazaar-footer-link-text-short {
                display: none;
            }

            @media (max-width: 600px) {
                .bazaar-footer-link-text-full {
                    display: none;
                }

                .bazaar-footer-link-text-short {
                    display: inline;
                }

                .bazaar-footer-stat-label {
                    display: none;
                }
            }

            .bazaar-footer-link {
                color: #0066cc !important;
                text-decoration: none;
                transition: opacity 0.2s;
            }

            .bazaar-footer-link:hover {
                opacity: 0.8;
                text-decoration: underline;
            }

            .bazaar-footer-link:visited {
                color: #0066cc !important;
            }

            body.dark-mode .bazaar-footer-link {
                color: #4da6ff !important;
            }

            body.dark-mode .bazaar-footer-link:visited {
                color: #4da6ff !important;
            }
        `;

        GM_addStyle(styles);
    };

    const utils = {
        getRelativeTime(timestamp) {
            // Validate timestamp
            if (!timestamp || isNaN(timestamp)) {
                return 'Unknown time';
            }

        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;

            const intervals = [
                { unit: 'day', seconds: 86400 },
                { unit: 'hour', seconds: 3600 },
                { unit: 'minute', seconds: 60 },
                { unit: 'second', seconds: 1 }
            ];

            for (const { unit, seconds } of intervals) {
                const value = Math.floor(diff / seconds);
                if (value >= 1) {
                    return `Checked ${value} ${unit}${value !== 1 ? 's' : ''} ago`;
        }
    }

            return 'just now';
        },

        parseItemID(body) {
        if (!body) return null;

            const parseValue = (data) => {
                if (data instanceof FormData) return data.get('itemID');
                if (data instanceof URLSearchParams) return data.get('itemID');
                if (typeof data === 'string') return new URLSearchParams(data).get('itemID');
                return null;
            };

            return parseValue(body);
        },

        isMobile() {
            return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        },

        createBazaarUrl(listing, itemID) {
            // Validate required fields
            if (!listing || !listing.player_id || !itemID) {
                console.error('Invalid listing data for URL creation');
                return '#';
            }

            return `https://www.torn.com/bazaar.php?userId=${listing.player_id}&itemID=${itemID}&price=${listing.price || 0}&qty=${listing.quantity || 0}#/`;
        }
    };

    const dom = {
        createContainer() {
            const containerHtml = `
                    <div class="bazaar-controls">
                        <div class="bazaar-filter">
                            <label>Min:</label>
                            <input type="number" class="min-qty" min="0" placeholder="0">
                        </div>
                        <div class="bazaar-sort-buttons">
                            <span class="bazaar-sort-label">Sort:</span>
                            <button class="bazaar-sort-btn" data-category="price" data-state="asc">
                                <span class="sort-text">Price</span>
                                <span class="sort-arrow">↑</span>
                            </button>
                            <button class="bazaar-sort-btn" data-category="qty" data-state="none">
                                <span class="sort-text">Qty</span>
                                <span class="sort-arrow"></span>
                            </button>
                            <button class="bazaar-sort-btn" data-category="time" data-state="none">
                                <span class="sort-text">Time</span>
                                <span class="sort-arrow"></span>
                            </button>
                        </div>
                    </div>
                    <div class="bazaar-display">
                        <button class="bazaar-nav prev" disabled>‹</button>
                        <div class="bazaar-cards-wrapper"></div>
                        <button class="bazaar-nav next" disabled>›</button>
                    </div>
                    <div class="bazaar-pagination-info">
                        <button class="bazaar-nav-first" title="Go to first page">««</button>
                        <span class="bazaar-page-info">Page <span class="current-page">1</span> of <span class="total-pages">1</span></span>
                        <button class="bazaar-nav-last" title="Go to last page">»»</button>
                    </div>
                    <div class="bazaar-footer">
                        <div class="bazaar-footer-stats"></div>
                        <span class="bazaar-footer-separator">•</span>
                        <a href="https://weav3r.dev/" target="_blank" class="bazaar-footer-link">
                            <span class="bazaar-footer-link-text-full">Register your bazaar at weav3r.dev</span>
                            <span class="bazaar-footer-link-text-short">Register @ weav3r.dev</span>
                        </a>
                    </div>
            `;

            return $('<li>').addClass('bazaar-container').html(containerHtml);
        },

        createBazaarCard(listing, itemID, marketPrice) {
            const url = utils.createBazaarUrl(listing, itemID);

            let linkAttrs = '';
            switch (CONFIG.BAZAAR_CLICK_BEHAVIOR) {
                case 'same-tab':
                    linkAttrs = '';
                    break;
                case 'new-window':
                    linkAttrs = 'target="_blank" onclick="window.open(this.href, \'_blank\', \'width=800,height=600\'); return false;"';
                    break;
                case 'new-tab':
                default:
                    linkAttrs = 'target="_blank"';
                    break;
            }

            let marketComparisonHtml = '';
            if (CONFIG.SHOW_MARKET_COMPARISON && marketPrice) {
                const diff = listing.price - marketPrice;
                const percentDiff = ((diff / marketPrice) * 100).toFixed(1);
                const isAboveMarket = diff > 0;
                const sign = isAboveMarket ? '+' : '';
                const className = isAboveMarket ? 'positive' : 'negative';

                marketComparisonHtml = `
                    <span class="bazaar-market-diff ${className}">
                        ${sign}${percentDiff}%
                    </span>
                `;
            }

            return `
                <div class="bazaar-card">
                    <div class="bazaar-card-name">
                        <a href="${url}" ${linkAttrs}>${listing.player_name}</a>
                    </div>
                    <div class="bazaar-card-info">
                        <div class="bazaar-price-wrapper">
                            <div class="bazaar-card-price">$${listing.price.toLocaleString()}</div>
                            ${marketComparisonHtml}
                        </div>
                        <div class="bazaar-card-qty">Qty: ${listing.quantity}</div>
                    </div>
                    <div class="bazaar-card-bottom">
                        <span class="bazaar-card-time">${utils.getRelativeTime(listing.last_checked)}</span>
                    </div>
                </div>
            `;
        },

        findSellerList() {
            return $(CONFIG.SELECTORS.DESKTOP_LIST).length ?
                   $(CONFIG.SELECTORS.DESKTOP_LIST) :
                   $(CONFIG.SELECTORS.MOBILE_LIST);
        },

        insertContainer($sellerList, $container) {
            try {
                if (utils.isMobile()) {
                    const $itemsHeader = $(CONFIG.SELECTORS.MOBILE_HEADER);
                    const sellerListEl = document.querySelector(CONFIG.SELECTORS.MOBILE_LIST);
                    if ($itemsHeader.length) {
                        const existing = $itemsHeader.next('.bazaar-container');
                        if (existing.length) {
                            existing.remove();
                        }

                        const $mobileContainer = $('<div>')
                            .addClass('bazaar-container')
                            .html($container.html());

                        requestAnimationFrame(() => {
                            $itemsHeader.after($mobileContainer);

                            // Setup observer after DOM update
                            requestAnimationFrame(() => {
                                if (sellerListEl && $mobileContainer[0]) {
                                    // Watch only the parent of sellerList for removal
                                    const parentToObserve = sellerListEl.parentElement;
                                    if (parentToObserve) {
                                        const observer = new MutationObserver((mutations) => {
                                            // Check if our element was removed
                                            for (const mutation of mutations) {
                                                if (mutation.type === 'childList') {
                                                    for (const removed of mutation.removedNodes) {
                                                        if (removed === sellerListEl || removed.contains?.(sellerListEl)) {
                                                            $mobileContainer.remove();
                                                            observer.disconnect();
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        });

                                        // Only observe direct children of the parent
                                        observer.observe(parentToObserve, {
                                            childList: true,
                                            subtree: false  // Don't observe entire subtree
                                        });

                                        // Store observer reference for cleanup
                                        $mobileContainer.data('observer', observer);
                                    }
                                }
                            });
                        });
                        return $mobileContainer;
                    } else {
                        const $firstRow = $sellerList.find(CONFIG.SELECTORS.MOBILE_ROW).first();
                        if ($firstRow.length) {
                            $firstRow.after($container);
                        } else {
                            $sellerList.prepend($container);
                        }
                        // Use queueMicrotask for next tick execution
                        queueMicrotask(() => {
                            if (sellerListEl && $container[0]) {
                                // Watch only the parent of sellerList for removal
                                const parentToObserve = sellerListEl.parentElement;
                                if (parentToObserve) {
                                    const observer = new MutationObserver((mutations) => {
                                        // Check if our element was removed
                                        for (const mutation of mutations) {
                                            if (mutation.type === 'childList') {
                                                for (const removed of mutation.removedNodes) {
                                                    if (removed === sellerListEl || removed.contains?.(sellerListEl)) {
                                                        $container.remove();
                                                        observer.disconnect();
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                    });

                                    // Only observe direct children of the parent
                                    observer.observe(parentToObserve, {
                                        childList: true,
                                        subtree: false  // Don't observe entire subtree
                                    });

                                    // Store observer reference for cleanup
                                    $container.data('observer', observer);
                                }
                            }
                        });
                    }
                } else {
                    // For desktop, find the sellerListWrapper and insert as first child
                    const $sellerListWrapper = $sellerList.closest('.sellerListWrapper___PN32N');
                    if ($sellerListWrapper.length) {
                        // Insert before the sellerList (which contains the sellerRows)
                        $sellerListWrapper.prepend($container);
                    } else {
                        // Fallback to original behavior if wrapper not found
                        $sellerList.prepend($container);
                    }
                }
                return $container;
            } catch (error) {
                console.error('Error inserting bazaar container:', error);
                return $container;
            }
        }
    };

    class ListingController {
        constructor($container, itemID) {
            this.$container = $container;
            this.itemID = itemID;
            this.$cardsWrapper = $container.find('.bazaar-cards-wrapper');
            this.$prevBtn = $container.find('.bazaar-nav.prev');
            this.$nextBtn = $container.find('.bazaar-nav.next');
            this.$firstBtn = $container.find('.bazaar-nav-first');
            this.$lastBtn = $container.find('.bazaar-nav-last');
            this.$currentPage = $container.find('.current-page');
            this.$totalPages = $container.find('.total-pages');
            this.$minQty = $container.find('.min-qty');
            this.$sortButtons = $container.find('.bazaar-sort-btn');
            this.$footerStats = $container.find('.bazaar-footer-stats');

            this.allListings = [];
            this.itemData = null;
            this.currentPage = 0;
            this.currentSort = CONFIG.DEFAULT_SORT;

            $container.data('controller', this);

            if (CONFIG.DEFAULT_MIN_QTY && CONFIG.DEFAULT_MIN_QTY > 0) {
                this.$minQty.val(CONFIG.DEFAULT_MIN_QTY);
            }

            this.setInitialSortState();

            this.setupEventHandlers();
            this.loadData();
        }

        cleanup() {
            // Remove swipe event listeners
            if (this.swipeArea && this.touchStartHandler && this.touchEndHandler) {
                this.swipeArea.removeEventListener('touchstart', this.touchStartHandler);
                this.swipeArea.removeEventListener('touchend', this.touchEndHandler);
            }
        }

        setInitialSortState() {
            // Validate DEFAULT_SORT format
            if (!CONFIG.DEFAULT_SORT || !CONFIG.DEFAULT_SORT.includes('-')) {
                console.warn('Invalid DEFAULT_SORT format, using default');
                CONFIG.DEFAULT_SORT = 'price-asc';
            }

            const [category, direction] = CONFIG.DEFAULT_SORT.split('-');

            this.$sortButtons.each(function() {
                $(this).data('state', 'none').attr('data-state', 'none')
                    .find('.sort-arrow').text('');
            });

            const $defaultBtn = this.$sortButtons.filter(`[data-category="${category}"]`);
            if ($defaultBtn.length) {
                const arrow = direction === 'asc' ? '↑' : '↓';
                $defaultBtn.data('state', direction).attr('data-state', direction)
                    .find('.sort-arrow').text(arrow);
            }
        }

        setupEventHandlers() {
            this.$minQty.on('input', () => {
                this.currentPage = 0;
                this.displayListings();
            });

            this.$sortButtons.on('click', (e) => {
                const $btn = $(e.currentTarget);
                this.handleSort($btn);
            });

            this.$prevBtn.on('click', () => this.navigate(-1));
            this.$nextBtn.on('click', () => this.navigate(1));
            this.$firstBtn.on('click', () => this.goToFirstPage());
            this.$lastBtn.on('click', () => this.goToLastPage());

            this.setupSwipeGestures();
        }

        handleSort($btn) {
                const category = $btn.data('category');
                const currentState = $btn.data('state');

            this.$sortButtons.not($btn).each(function() {
                $(this).data('state', 'none').attr('data-state', 'none')
                    .find('.sort-arrow').text('');
                });

            const states = ['none', 'asc', 'desc'];
            const arrows = ['', '↑', '↓'];
            const currentIndex = states.indexOf(currentState);
            const newIndex = (currentIndex + 1) % states.length;
            const newState = states[newIndex];

                $btn.data('state', newState).attr('data-state', newState);
            $btn.find('.sort-arrow').text(arrows[newIndex]);

            this.currentSort = newState !== 'none' ?
                `${category}-${newState}` : CONFIG.DEFAULT_SORT;

            this.currentPage = 0;
            this.displayListings();
        }

        navigate(direction) {
            const filtered = this.getFilteredListings();
            const maxPage = Math.ceil(filtered.length / CONFIG.ITEMS_PER_PAGE) - 1;

            this.currentPage = Math.max(0, Math.min(maxPage, this.currentPage + direction));
            this.displayListings();
        }

        goToFirstPage() {
            this.currentPage = 0;
            this.displayListings();
        }

        goToLastPage() {
            const filtered = this.getFilteredListings();
            const maxPage = Math.max(0, Math.ceil(filtered.length / CONFIG.ITEMS_PER_PAGE) - 1);
            this.currentPage = maxPage;
            this.displayListings();
        }

        setupSwipeGestures() {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;
            const minSwipeDistance = 50;
            const maxVerticalDistance = 100;

            const swipeArea = this.$container.find('.bazaar-display')[0];

            if (!swipeArea) return;

            // Store handlers for cleanup
            this.touchStartHandler = (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            };

            this.touchEndHandler = (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                this.handleSwipe();
            };

            swipeArea.addEventListener('touchstart', this.touchStartHandler, { passive: true });
            swipeArea.addEventListener('touchend', this.touchEndHandler, { passive: true });

            // Store swipeArea reference for cleanup
            this.swipeArea = swipeArea;

            const handleSwipe = () => {
                const horizontalDistance = touchEndX - touchStartX;
                const verticalDistance = Math.abs(touchEndY - touchStartY);

                if (Math.abs(horizontalDistance) > minSwipeDistance && verticalDistance < maxVerticalDistance) {
                    if (horizontalDistance > 0) {
                        this.navigate(-1);
                    } else {
                        this.navigate(1);
                    }
                }
            };

            this.handleSwipe = handleSwipe;
        }

        async loadData() {
            const cacheKey = `item_${this.itemID}`;
            const cached = state.apiCache.get(cacheKey);
            const now = Date.now();

            if (cached && (now - cached.timestamp) < CONFIG.CACHE_DURATION) {
                this.allListings = cached.listings || [];
                this.itemData = cached.itemData || null;
                this.updateFooter();
                this.displayListings();
                return;
        }

            try {
                const data = await this.fetchData();
                this.allListings = data.listings || [];
                this.itemData = data;

                state.apiCache.set(cacheKey, {
                    listings: this.allListings,
                    itemData: data,
                    timestamp: now
                });

                this.updateFooter();
                this.displayListings();
            } catch (error) {
                this.showError('Error loading data');
            }
        }

        async fetchData() {
            try {
                // Validate and encode itemID
                if (!this.itemID || isNaN(parseInt(this.itemID))) {
                    throw new Error('Invalid item ID');
                }

                const encodedItemID = encodeURIComponent(this.itemID);
                const response = await PDA.httpRequest({
                    method: 'GET',
                    url: `https://weav3r.dev/api/marketplace/${encodedItemID}`,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // Validate response structure
                        if (!data || typeof data !== 'object') {
                            throw new Error('Invalid response format');
                        }
                        return data;
                    } catch (parseError) {
                        console.error('Failed to parse API response:', parseError);
                        throw new Error('Invalid JSON response from API');
                    }
                } else {
                    throw new Error(`API returned status ${response.status}`);
                }
            } catch (error) {
                console.error('Failed to fetch bazaar data:', error);
                throw error;
            }
        }

        getFilteredListings() {
            const minQty = parseInt(this.$minQty.val()) || 0;

            let filtered = this.allListings.filter(listing => listing.quantity >= minQty);

            const [category, direction] = this.currentSort.split('-');
            const multiplier = direction === 'desc' ? -1 : 1;

            const sortFunctions = {
                price: (a, b) => (a.price - b.price) * multiplier,
                qty: (a, b) => (a.quantity - b.quantity) * multiplier,
                time: (a, b) => (a.last_checked - b.last_checked) * multiplier
            };

            if (sortFunctions[category]) {
                filtered.sort(sortFunctions[category]);
                }

            return filtered;
        }

        displayListings() {
            const filtered = this.getFilteredListings();
            const start = this.currentPage * CONFIG.ITEMS_PER_PAGE;
            const pageItems = filtered.slice(start, start + CONFIG.ITEMS_PER_PAGE);
            const totalPages = Math.max(1, Math.ceil(filtered.length / CONFIG.ITEMS_PER_PAGE));

            this.$cardsWrapper.empty();

            if (CONFIG.ITEMS_PER_PAGE > 4) {
                this.$cardsWrapper.addClass('multi-row');
            } else {
                this.$cardsWrapper.removeClass('multi-row');
            }

            if (pageItems.length > 0) {
                const marketPrice = this.itemData?.market_price || null;
                const cards = pageItems.map(listing =>
                    dom.createBazaarCard(listing, this.itemID, marketPrice)
                ).join('');
                this.$cardsWrapper.html(cards);
            } else if (filtered.length === 0) {
                this.showEmpty();
            }

            const hasNext = start + CONFIG.ITEMS_PER_PAGE < filtered.length;
            const maxPage = Math.max(0, totalPages - 1);
            this.$prevBtn.prop('disabled', this.currentPage === 0);
            this.$nextBtn.prop('disabled', !hasNext);
            this.$firstBtn.prop('disabled', this.currentPage === 0);
            this.$lastBtn.prop('disabled', this.currentPage === maxPage);

            this.$currentPage.text(this.currentPage + 1);
            this.$totalPages.text(totalPages);
        }

        showError(message) {
            this.$cardsWrapper.html(`<div class="bazaar-error">${message}</div>`);
        }

        showEmpty() {
            this.$cardsWrapper.html('<div class="bazaar-empty">No bazaar listings found</div>');
        }

        updateFooter() {
            if (!this.itemData) return;

            const itemName = this.itemData.item_name || 'Unknown Item';
            const marketPrice = this.itemData.market_price;

            let statsHtml = `
                <span class="bazaar-footer-stat"><strong>${itemName}</strong> [${this.itemID}]</span>
            `;

            if (marketPrice) {
                statsHtml += `<span class="bazaar-footer-stat"><span class="bazaar-footer-stat-label">Market: </span><strong>$${marketPrice.toLocaleString()}</strong></span>`;
            }

            this.$footerStats.html(statsHtml);
        }
    }

    // Improved debounce using requestIdleCallback
    let pendingDisplayCall = null;
    let lastInterceptedItemID = null;
    let lastInterceptedTime = 0;

    function interceptFetch() {
        try {
            const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            state.originalFetch = targetWindow.fetch;

            if (!state.originalFetch) {
                console.error('[Bazaar Listings] fetch function not found');
                return;
            }

            targetWindow.fetch = async function(...args) {
                const [resource, config] = args;

                // Handle both string URLs and Request objects
                const url = typeof resource === 'string' ? resource :
                           (resource && resource.url ? resource.url : '');

                if (url.includes('page.php?sid=iMarket&step=getListing')) {
                    const itemID = utils.parseItemID(config?.body);

                    if (itemID) {
                        const now = Date.now();

                        // Skip if we just processed this item very recently
                        if (lastInterceptedItemID === itemID && (now - lastInterceptedTime) < 50) {
                            return state.originalFetch.apply(this, args);
                        }

                        lastInterceptedItemID = itemID;
                        lastInterceptedTime = now;

                        const response = await state.originalFetch.apply(this, args);

                        // Cancel any pending display call
                        if (pendingDisplayCall) {
                            cancelIdleCallback(pendingDisplayCall);
                            pendingDisplayCall = null;
                        }

                        // Use requestIdleCallback for better performance
                        pendingDisplayCall = requestIdleCallback(() => {
                            // Double-check we haven't processed this in the meantime
                            if (state.currentItemID !== itemID || !state.currentDisplay || !state.currentDisplay.parent().length) {
                                displayItemID(itemID);
                            }
                            pendingDisplayCall = null;
                        }, { timeout: 150 });

                        return response;
                    }
                }

                return state.originalFetch.apply(this, args);
            };

        } catch (error) {
            console.error('[Bazaar Listings] Error intercepting fetch:', error);
        }
    }

    let containerCreationInProgress = false;
    let containerCreationQueue = [];
    let lastProcessedItemID = null;
    let lastProcessedTime = 0;

    function displayItemID(itemID) {
        // Deduplicate rapid calls for the same item
        const now = Date.now();
        if (lastProcessedItemID === itemID && (now - lastProcessedTime) < 100) {
            return;
        }

        if (containerCreationInProgress) {
            // Queue this request if not already queued
            if (!containerCreationQueue.includes(itemID)) {
                containerCreationQueue.push(itemID);
            }
            return;
        }

        // Check if we already have a valid container for this item
        if (state.currentItemID === itemID && state.currentDisplay && state.currentDisplay.parent().length) {
            // Verify the container is still in the DOM and visible
            const existingContainers = $('.bazaar-container:visible');
            if (existingContainers.length === 1 && existingContainers[0] === state.currentDisplay[0]) {
                return;
            }
        }

        containerCreationInProgress = true;
        lastProcessedItemID = itemID;
        lastProcessedTime = now;

        try {
            state.currentItemID = itemID;

            // More aggressive cleanup - remove ALL bazaar containers
            $('.bazaar-container').each(function() {
                const controller = $(this).data('controller');
                if (controller) {
                    // Call cleanup method if available
                    if (typeof controller.cleanup === 'function') {
                        controller.cleanup();
                    }
                    $(this).removeData('controller');
                }

                // Disconnect any stored observers
                const observer = $(this).data('observer');
                if (observer) {
                    observer.disconnect();
                    $(this).removeData('observer');
                }

                $(this).remove();
            });

            // Additional cleanup for any stragglers
            $('[class*="bazaar-container"]').remove();
            $('.rowWrapper___OrFGK .bazaar-container, .itemsHeader___ZTO9r + .bazaar-container, .itemsHeader___ZTO9r + div.bazaar-container, .sellerListWrapper___PN32N > .bazaar-container').remove();

            state.currentDisplay = null;

            const $sellerList = dom.findSellerList();

            if (!$sellerList.length) {
                if (!state.retryCount) state.retryCount = 0;
                state.retryCount++;

                if (state.retryCount < 5) {
                    // Use exponential backoff with requestIdleCallback
                    const backoffTime = Math.min(100 * Math.pow(2, state.retryCount - 1), 2000);

                    requestIdleCallback(() => {
                        containerCreationInProgress = false;
                        if (!state.currentDisplay && state.currentItemID === itemID) {
                            displayItemID(itemID);
                        }
                    }, { timeout: backoffTime });
                } else {
                    console.error('Could not find seller list after 5 attempts');
                    state.retryCount = 0;
                    containerCreationInProgress = false;
                }
                return;
            }

            state.retryCount = 0;

            // Final check before creating - ensure no containers exist
            const existingContainers = $('.bazaar-container');
            if (existingContainers.length > 0) {
                // Remove all existing containers before creating new one
                existingContainers.each(function() {
                    const controller = $(this).data('controller');
                    if (controller && typeof controller.cleanup === 'function') {
                        controller.cleanup();
                    }
                    $(this).remove();
                });
            }

            const $container = dom.createContainer();
            state.currentDisplay = dom.insertContainer($sellerList, $container);

            // Immediate verification after insertion
            requestAnimationFrame(() => {
                const containerCount = $('.bazaar-container').length;
                if (containerCount > 1) {
                    // Keep only the newest container (state.currentDisplay)
                    $('.bazaar-container').each(function() {
                        if (this !== state.currentDisplay[0]) {
                            const controller = $(this).data('controller');
                            if (controller && typeof controller.cleanup === 'function') {
                                controller.cleanup();
                            }
                            $(this).remove();
                        }
                    });
                }
            });

            new ListingController(state.currentDisplay, itemID);

        } finally {
            // Use queueMicrotask for immediate async execution
            queueMicrotask(() => {
                containerCreationInProgress = false;

                // Process queued requests
                if (containerCreationQueue.length > 0) {
                    const nextItemID = containerCreationQueue.shift();
                    requestIdleCallback(() => displayItemID(nextItemID));
                }
            });
        }
    }

    const bazaar = {
        parseUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                itemID: urlParams.get('itemID'),
                expectedPrice: parseInt(urlParams.get('price')),
                expectedQty: parseInt(urlParams.get('qty'))
            };
        },

        findItemInBazaar(itemID) {
            const selectors = [
                `[data-item="${itemID}"]`,
                `[data-itemid="${itemID}"]`,
                `.item___GYCYJ:has(img[src*="/items/${itemID}/"])`,
                `.item___khvF6:has(img[src*="/items/${itemID}/"])`
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) return element;
            }

            return null;
        },

        scrollToItem(element) {
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const targetScroll = window.pageYOffset + elementCenter - viewportHeight / 2;

            window.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth'
            });
        },

        highlightItem(element) {
            // Store original styles
            const originalStyles = element.getAttribute('style') || '';
            element.setAttribute('data-original-styles', originalStyles);

            // Apply highlight styles without using +=
            element.style.outline = '3px solid #FFD700';
            element.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)';
            element.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
            element.style.position = 'relative';
            element.style.zIndex = '100';
            element.style.animation = 'bazaar-pulse 2s ease-in-out infinite';

            // Add important flag through setProperty
            const importantProps = ['outline', 'boxShadow', 'backgroundColor', 'position', 'zIndex', 'animation'];
            importantProps.forEach(prop => {
                const value = element.style[prop];
                if (value) {
                    element.style.setProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase(), value, 'important');
                }
            });
        },

        extractItemPrice(element) {
            const priceSelectors = [
                '.price___dJqda',
                '.price',
                '[class*="price"]',
                'p:nth-child(2)'
            ];

            for (const selector of priceSelectors) {
                const priceElement = element.querySelector(selector);
                if (priceElement) {
                    const priceText = priceElement.textContent;
                    const price = parseInt(priceText.replace(/[$,]/g, ''));
                    if (!isNaN(price)) return price;
                }
            }

            return null;
        },

        extractItemQty(element) {
            const qtySelectors = [
                '.amountValue___cSVqO',
                '.amount___K8sOQ',
                '[class*="amount"]'
            ];

            for (const selector of qtySelectors) {
                const qtyElement = element.querySelector(selector);
                if (qtyElement) {
                    const qtyText = qtyElement.textContent;
                    const qty = parseInt(qtyText.replace(/[^\d]/g, ''));
                    if (!isNaN(qty)) return qty;
                }
            }

            return null;
        },

        showToast(message, type = 'warning') {
            const toast = document.createElement('div');
            toast.className = 'bazaar-toast';
            const bgColor = type === 'error' ? '#ff4444' : type === 'warning' ? '#ff9944' : '#44bb44';

            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                z-index: 2147483647;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: bazaar-toast-slide 0.3s ease-out;
                max-width: 400px;
                line-height: 1.4;
            `;

            toast.innerHTML = message;
            document.body.appendChild(toast);

            // Use Animation API instead of setTimeout
            const showDuration = 5000;
            const fadeDuration = 300;

            toast.animate([
                { opacity: 1, transform: 'translateX(0)' }
            ], {
                duration: showDuration,
                fill: 'forwards'
            }).finished.then(() => {
                return toast.animate([
                    { opacity: 1, transform: 'translateX(0)' },
                    { opacity: 0, transform: 'translateX(100px)' }
                ], {
                    duration: fadeDuration,
                    fill: 'forwards'
                }).finished;
            }).then(() => {
                toast.remove();
            });
        },

        showPriceWarning(actualPrice, expectedPrice, element) {
            const difference = actualPrice - expectedPrice;
            const percentDiff = ((difference / expectedPrice) * 100).toFixed(1);
            const isHigher = difference > 0;

            const message = `⚠️ Price ${isHigher ? 'increased' : 'decreased'} by $${Math.abs(difference).toLocaleString()} (${isHigher ? '+' : ''}${percentDiff}%)`;

            const warningDiv = document.createElement('div');
            warningDiv.className = 'bazaar-price-warning';
            warningDiv.style.cssText = `
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                background: ${isHigher ? '#ff4444' : '#ff9944'};
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                z-index: 1000;
                white-space: nowrap;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                animation: bazaar-warning-bounce 0.5s ease-out;
            `;

            warningDiv.innerHTML = message;
            element.style.position = 'relative';
            element.appendChild(warningDiv);
        },

        addAnimationStyles() {
            if (!document.querySelector('#bazaar-highlight-styles')) {
                const style = document.createElement('style');
                style.id = 'bazaar-highlight-styles';
                style.textContent = `
                    @keyframes bazaar-pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.02); }
                    }

                    @keyframes bazaar-warning-bounce {
                        0% { transform: translateX(-50%) translateY(-10px); opacity: 0; }
                        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
                    }

                    @keyframes bazaar-toast-slide {
                        0% { transform: translateX(400px); opacity: 0; }
                        100% { transform: translateX(0); opacity: 1; }
                    }

                    @keyframes bazaar-toast-fade {
                        0% { opacity: 1; transform: translateX(0); }
                        100% { opacity: 0; transform: translateX(100px); }
                    }

                    .bazaar-price-warning::after {
                        content: '';
                        position: absolute;
                        bottom: -6px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-top: 6px solid inherit;
                    }
                `;
                document.head.appendChild(style);
            }
        },

        init() {
            if (!window.location.pathname.includes('bazaar.php')) return;

            const params = this.parseUrlParams();
            if (!params.itemID || !params.expectedPrice) return;

            this.addAnimationStyles();

            let attempts = 0;
            const maxAttempts = 10;

            const attemptHighlight = () => {
                if (attempts >= maxAttempts) {
                    this.showToast('❌ Item not found in this bazaar! It may have been sold or removed.', 'error');
                    return;
                }

                attempts++;

                try {
                    const itemElement = this.findItemInBazaar(params.itemID);

                    if (itemElement) {
                        requestAnimationFrame(() => {
                            this.scrollToItem(itemElement);
                            this.highlightItem(itemElement);

                            const actualPrice = this.extractItemPrice(itemElement);
                            if (actualPrice && actualPrice !== params.expectedPrice) {
                                this.showPriceWarning(actualPrice, params.expectedPrice, itemElement);
                            }
                        });
                    } else {
                        // Use requestIdleCallback for better performance
                        const delay = utils.isMobile() ? 1000 : 500;
                        requestIdleCallback(attemptHighlight, { timeout: delay });
                    }
                } catch (error) {
                    console.error('Error in bazaar highlight:', error);
                    this.showToast('❌ An error occurred while highlighting the item.', 'error');
                }
            };

            // Start with requestIdleCallback
            requestIdleCallback(attemptHighlight, {
                timeout: utils.isMobile() ? 500 : 100
            });
        }
    };

    const settings = {
        createModal() {
            const modalHtml = `
                <div class="bazaar-settings-modal" id="bazaarSettingsModal">
                    <div class="bazaar-settings-content">
                        <div class="bazaar-settings-header">
                            <h1 class="bazaar-settings-title">Bazaar Listings Settings</h1>
                            <button class="bazaar-settings-close">&times;</button>
                        </div>

                        <div class="bazaar-settings-body">
                                <div class="bazaar-settings-section">
                                    <h2 class="bazaar-settings-section-title">Display Settings</h2>

                                    <div class="bazaar-settings-field">
                                        <label class="bazaar-settings-field-label">Items Per Page</label>
                                        <p class="bazaar-settings-field-description">Number of bazaar listings to show per page</p>
                                <input type="number" class="bazaar-settings-input" id="itemsPerPage" min="1" max="10" value="${CONFIG.ITEMS_PER_PAGE}">
                            </div>

                                    <div class="bazaar-settings-field">
                                        <label class="bazaar-settings-field-label">Default Sort</label>
                                        <p class="bazaar-settings-field-description">Choose how listings are sorted: Price, Quantity, Profit, or Last Updated</p>
                                <select class="bazaar-settings-select" id="defaultSort">
                                    <option value="price-asc" ${CONFIG.DEFAULT_SORT === 'price-asc' ? 'selected' : ''}>Price (Low to High)</option>
                                    <option value="price-desc" ${CONFIG.DEFAULT_SORT === 'price-desc' ? 'selected' : ''}>Price (High to Low)</option>
                                    <option value="qty-asc" ${CONFIG.DEFAULT_SORT === 'qty-asc' ? 'selected' : ''}>Quantity (Low to High)</option>
                                    <option value="qty-desc" ${CONFIG.DEFAULT_SORT === 'qty-desc' ? 'selected' : ''}>Quantity (High to Low)</option>
                                    <option value="time-asc" ${CONFIG.DEFAULT_SORT === 'time-asc' ? 'selected' : ''}>Time (Oldest First)</option>
                                    <option value="time-desc" ${CONFIG.DEFAULT_SORT === 'time-desc' ? 'selected' : ''}>Time (Newest First)</option>
                                </select>
                            </div>

                                    <div class="bazaar-settings-field">
                                        <label class="bazaar-settings-field-label">Default Minimum Quantity</label>
                                        <p class="bazaar-settings-field-description">Default minimum quantity filter value</p>
                                <input type="number" class="bazaar-settings-input" id="defaultMinQty" min="0" value="${CONFIG.DEFAULT_MIN_QTY || 0}">
                                    </div>
                            </div>

                                <div class="bazaar-settings-section">
                                    <h2 class="bazaar-settings-section-title">Features</h2>

                                    <div class="bazaar-settings-toggle-field">
                                        <div class="bazaar-settings-toggle-info">
                                            <div class="bazaar-settings-field-label">Show Market Price Comparison</div>
                                            <div class="bazaar-settings-field-description">Display price difference from market average</div>
                                </div>
                                    <div class="bazaar-toggle-switch ${CONFIG.SHOW_MARKET_COMPARISON ? 'active' : ''}" id="marketComparisonToggle">
                                        <div class="bazaar-toggle-slider"></div>
                                    </div>
                                </div>
                            </div>

                                <div class="bazaar-settings-section">
                                    <h2 class="bazaar-settings-section-title">Behavior</h2>

                                    <div class="bazaar-settings-field">
                                        <label class="bazaar-settings-field-label">Bazaar Link Behavior</label>
                                        <p class="bazaar-settings-field-description">How bazaar links should open when clicked</p>
                                <select class="bazaar-settings-select" id="clickBehavior">
                                    <option value="same-tab" ${CONFIG.BAZAAR_CLICK_BEHAVIOR === 'same-tab' ? 'selected' : ''}>Same Tab</option>
                                    <option value="new-tab" ${CONFIG.BAZAAR_CLICK_BEHAVIOR === 'new-tab' ? 'selected' : ''}>New Tab</option>
                                    <option value="new-window" ${CONFIG.BAZAAR_CLICK_BEHAVIOR === 'new-window' ? 'selected' : ''}>New Window</option>
                                </select>
                                    </div>
                            </div>
                        </div>

                        <div class="bazaar-settings-actions">
                            <button class="bazaar-settings-btn bazaar-settings-btn-secondary" id="cancelSettingsBtn">Cancel</button>
                            <button class="bazaar-settings-btn bazaar-settings-btn-primary" id="saveSettingsBtn">Save</button>
                        </div>

                        <div class="bazaar-settings-credits">
                            Created by <a href="https://www.torn.com/profiles.php?XID=1185324" target="_blank">Weav3r [1185324]</a>
                            <span class="bazaar-settings-credits-divider">•</span>
                            Data sourced from <a href="https://weav3r.dev" target="_blank">weav3r.dev</a>
                        </div>
                    </div>
                </div>
            `;

            $('body').append(modalHtml);

            $('.bazaar-settings-close, #cancelSettingsBtn').on('click', () => {
                $('#bazaarSettingsModal').removeClass('show');
            });

            $('#saveSettingsBtn').on('click', () => {
                this.save();
            });

            $('#marketComparisonToggle').on('click', function() {
                $(this).toggleClass('active');
            });

            $('#bazaarSettingsModal').on('click', function(e) {
                if (e.target === this) {
                    $(this).removeClass('show');
                }
            });
        },

        injectSettingsButton() {
            if (document.querySelector('#bazaarSettingsBtn')) {
                return;
            }

            const settingsMenu = document.querySelector('.settings-menu');
            if (!settingsMenu) {
                const altMenu = document.querySelector('ul[class*="settings-menu"]') ||
                               document.querySelector('[class*="settingsMenu"]') ||
                               document.querySelector('ul.settings-menu');
                if (altMenu) {
                    settings.injectButtonIntoMenu(altMenu);
                }
                return;
            }

            this.injectButtonIntoMenu(settingsMenu);
        },

        injectButtonIntoMenu(settingsMenu) {
            const settingsButton = document.createElement('li');
            settingsButton.className = 'link';
            settingsButton.id = 'bazaarSettingsBtn';
            settingsButton.innerHTML = `
                <a href="#" class="bazaar-settings-link">
                    <div class="icon-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt" filter="" fill="currentColor" stroke="transparent" stroke-width="0" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                        </svg>
                    </div>
                    <span class="link-text">Bazaar Settings</span>
                </a>
            `;

            settingsButton.querySelector('.bazaar-settings-link').addEventListener('click', (e) => {
                e.preventDefault();
                const modal = document.getElementById('bazaarSettingsModal');
                if (modal) {
                    modal.classList.add('show');
                } else {
                    console.error('Bazaar settings modal not found');
                    this.createModal();
                    // Use requestAnimationFrame for more reliable DOM timing
                    requestAnimationFrame(() => {
                        const modal = document.getElementById('bazaarSettingsModal');
                        if (modal) {
                            modal.classList.add('show');
                        } else {
                            console.error('Failed to create settings modal');
                        }
                    });
                }
            });

            const logoutItem = Array.from(settingsMenu.querySelectorAll('a')).find(a =>
                a.href && a.href.includes('logout.php'))?.parentElement;

            if (logoutItem) {
                settingsMenu.insertBefore(settingsButton, logoutItem);
            } else {
                settingsMenu.appendChild(settingsButton);
            }
        },

        save() {
            const newSettings = {
                ITEMS_PER_PAGE: parseInt($('#itemsPerPage').val()) || 3,
                DEFAULT_SORT: $('#defaultSort').val() || 'price-asc',
                DEFAULT_MIN_QTY: parseInt($('#defaultMinQty').val()) || 0,
                SHOW_MARKET_COMPARISON: $('#marketComparisonToggle').hasClass('active'),
                BAZAAR_CLICK_BEHAVIOR: $('#clickBehavior').val() || 'new-tab'
            };

            const mergedSettings = { ...CONFIG, ...newSettings };
            saveSettings(mergedSettings);

            $('#bazaarSettingsModal').removeClass('show');
            this.showToast('Settings saved successfully!', 'success');

            if (state.currentDisplay) {
                const controller = state.currentDisplay.data('controller');
                if (controller) {
                    controller.currentSort = CONFIG.DEFAULT_SORT;
                    controller.displayListings();
                }
            }
        },

        showToast(message, type = 'success') {
            const toast = $('<div>').addClass('bazaar-settings-toast').css({
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                zIndex: 10001,
                fontSize: '14px',
                fontWeight: '500',
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'all 0.3s'
            }).text(message);

            $('body').append(toast);

            // Use requestAnimationFrame for initial animation
            requestAnimationFrame(() => {
                toast.css({
                    opacity: 1,
                    transform: 'translateY(0)'
                });

                // Use Animation API for fade out
                const showDuration = 3000;
                const fadeDuration = 300;

                toast[0].animate([
                    { opacity: 1, transform: 'translateY(0)' }
                ], {
                    duration: showDuration,
                    fill: 'forwards'
                }).finished.then(() => {
                    return toast[0].animate([
                        { opacity: 1, transform: 'translateY(0)' },
                        { opacity: 0, transform: 'translateY(20px)' }
                    ], {
                        duration: fadeDuration,
                        fill: 'forwards'
                    }).finished;
                }).then(() => {
                    toast.remove();
                });
            });
        }
    };

    async function init() {
        try {

            injectStyles();

            await PDA.detect();

            if (PDA.isDetected) {
                $('body').attr('data-torn-pda', 'true');
            }

            const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            if (typeof targetWindow.fetch !== 'undefined') {
                interceptFetch();
            } else {
            }

            settings.createModal();

            // Use event delegation instead of MutationObserver for settings menu
            const injectWhenReady = () => {
                if (document.querySelector('.settings-menu') ||
                    document.querySelector('ul[class*="settings-menu"]') ||
                    document.querySelector('[class*="settingsMenu"]')) {
                    settings.injectSettingsButton();
                    return true;
                }
                return false;
            };

            if (!injectWhenReady()) {
                // Instead of MutationObserver, use a more efficient approach
                // Check periodically during page load, then stop
                let checkCount = 0;
                const maxChecks = 20;

                const checkForMenu = () => {
                    if (checkCount >= maxChecks) {
                        console.warn('[Bazaar Listings] Settings menu not found after maximum attempts');
                        return;
                    }

                    checkCount++;

                    if (injectWhenReady()) {
                        return;
                    }

                    // Use requestIdleCallback for non-blocking checks
                    requestIdleCallback(checkForMenu, { timeout: 500 });
                };

                // Start checking when DOM is ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        requestIdleCallback(checkForMenu);
                    });
                } else {
                    requestIdleCallback(checkForMenu);
                }
            }

            if (window.location.pathname.includes('bazaar.php')) {
                bazaar.init();
            }

            // Periodic cleanup to handle any edge cases with duplicate containers
            setInterval(() => {
                const containers = $('.bazaar-container:visible');
                if (containers.length > 1) {
                    console.warn('[Bazaar Listings] Multiple containers detected, cleaning up...');

                    // Keep only the most recent container (state.currentDisplay)
                    containers.each(function() {
                        if (state.currentDisplay && this !== state.currentDisplay[0]) {
                            const controller = $(this).data('controller');
                            if (controller && typeof controller.cleanup === 'function') {
                                controller.cleanup();
                            }
                            $(this).remove();
                        }
                    });

                    // If state.currentDisplay is not valid, keep the first container
                    if (!state.currentDisplay || !state.currentDisplay.parent().length) {
                        const remainingContainers = $('.bazaar-container:visible');
                        if (remainingContainers.length > 1) {
                            remainingContainers.slice(1).remove();
                        }
                    }
                }
            }, 2000); // Check every 2 seconds

        } catch (error) {
            console.error('Error initializing:', error);
        }
    }

    if (navigator.userAgent && navigator.userAgent.includes('TornPDA')) {
        // Use requestIdleCallback for TornPDA to ensure page is ready
        requestIdleCallback(init, { timeout: 500 });
    } else {
        init();
    }

})(jQuery);