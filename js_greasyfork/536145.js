// ==UserScript==
// @name         Torn: Busting Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1.42
// @description  Shows busting data, recent busts, penalty graph, and a collapsible info bar on jailview.php. Provides bust notifications. Dynamic difficulty with refined custom/level-based zero penalty value (min 500). Enhanced settings UI.
// @author       Elaine [2047176]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536145/Torn%3A%20Busting%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/536145/Torn%3A%20Busting%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & Constants ---
    const SCRIPT_NAME = "Torn: Busting Assistant";
    const SCRIPT_VERSION = "0.1.42"; // Version updated
    const API_KEY_STORAGE = "bustingAssistant_apiKey";
    const ALERT_DROPDOWN_STORAGE = "bustingAssistant_alertDropdownValue";
    const ALERT_ENABLED_STORAGE = "bustingAssistant_alertEnabled";
    const MAX_DIFFICULTY_SLIDER_STORAGE = "bustingAssistant_maxDifficultyValue";
    const INFO_BAR_COLLAPSED_STORAGE = "bustingAssistant_infoBarCollapsed";
    const ALL_TIME_MAX_PENALTY_STORAGE = "bustingAssistant_allTimeMaxPenalty";
    const DYNAMIC_DIFFICULTY_ENABLED_STORAGE = "bustingAssistant_dynamicDifficultyEnabled";
    const DYNAMIC_DIFFICULTY_ZERO_PENALTY_STORAGE = "bustingAssistant_dynamicDifficultyZeroPenalty";
    const DYNAMIC_DIFFICULTY_USE_CUSTOM_ZERO_PENALTY_STORAGE = "bustingAssistant_dynamicDifficultyUseCustomZeroPenalty";
    const API_UPDATE_INTERVAL_STORAGE = "bustingAssistant_apiUpdateInterval";
    const NOTIFICATION_COOLDOWN_END_STORAGE = "bustingAssistant_notificationCooldownEnd";
    const P_ZERO = 1000;

    const LOG_ACTUAL_MIN = 100;
    const LOG_ACTUAL_MAX = 1000000;
    const DYNAMIC_DIFFICULTY_FLOOR = 500;
    const SLIDER_VISUAL_MIN = 0;
    const SLIDER_VISUAL_MAX = 100;

    console.log(`[${SCRIPT_NAME}] v${SCRIPT_VERSION} loaded on ${window.location.href}`);

    // --- Modal & Info Bar Elements ---
    let modal = null;
    let modalOverlay = null;
    let modalContentElement = null;

    let apiSettingsModal = null;
    let apiSettingsModalOverlay = null;
    let apiSettingsModalContentElement = null;
    let isApiKeyCurrentlyVisible = false;

    let infoBarElement = null;
    let infoBarCollapsibleContent = null;
    let infoBarHeader = null;
    let jailListDebounceTimer;
    let difficultySliderDebounceTimer;
    let initialListObserver = null;
    let dynamicDifficultyZeroPenaltyDebounceTimer;
    let apiDataUpdateIntervalId = null;


    // --- Helper function to parse jail time string ---
    function parseJailTime(timeString) {
        let totalMinutes = 0;
        if (!timeString) return totalMinutes;
        const hourMatch = timeString.match(/(\d+)h/);
        const minMatch = timeString.match(/(\d+)m/);
        if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60;
        if (minMatch) totalMinutes += parseInt(minMatch[1], 10);
        return totalMinutes;
    }

    // --- Helper functions for logarithmic slider ---
    function logValueToSliderPosition(value) {
        const minp = SLIDER_VISUAL_MIN;
        const maxp = SLIDER_VISUAL_MAX;
        const minv = Math.log(LOG_ACTUAL_MIN);
        const maxv = Math.log(LOG_ACTUAL_MAX);
        if (value <= LOG_ACTUAL_MIN) return minp;
        if (value >= LOG_ACTUAL_MAX) return maxp;
        const scale = (maxv - minv) / (maxp - minp);
        return minp + (Math.log(value) - minv) / scale;
    }

    function sliderPositionToLogValue(position) {
        const minp = SLIDER_VISUAL_MIN;
        const maxp = SLIDER_VISUAL_MAX;
        const minv = Math.log(LOG_ACTUAL_MIN);
        const maxv = Math.log(LOG_ACTUAL_MAX);
        const scale = (maxv - minv) / (maxp - minp);
        let value = Math.exp(minv + scale * (position - minp));
        return Math.max(LOG_ACTUAL_MIN, Math.min(LOG_ACTUAL_MAX, value));
    }


    // --- Styling ---
    function addCustomStyles() {
        GM_addStyle(`
            /* Button Styles */
            .busting-data-button, .settings-button, .reset-api-key-button, #further-settings-save-api-key-button, .refresh-list-button, .ba-notification-button {
                background-color: #673AB7 !important; background-image: none !important; border: none !important;
                color: #FFFFFF !important; padding: 0 10px !important; text-align: center !important;
                text-decoration: none !important; display: inline-flex !important; align-items: center !important;
                justify-content: center !important; font-size: 11px !important;
                font-family: 'Roboto', 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
                font-weight: 500 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important;
                cursor: pointer !important; border-radius: 3px !important; height: 28px !important;
                line-height: 28px !important; min-width: 100px !important; box-sizing: border-box !important;
                box-shadow: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2) !important;
                outline: none !important; position: relative !important; visibility: visible !important; opacity: 1 !important;
                transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
                margin: 0 5px;
            }
            .busting-data-button:hover, .settings-button:hover, .reset-api-key-button:hover, #further-settings-save-api-key-button:hover, .refresh-list-button:hover, .ba-notification-button:hover {
                background-color: #5E35B1 !important;
                box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12), 0 2px 1px -1px rgba(0,0,0,0.2) !important;
            }
            .busting-data-button:active, .settings-button:active, .reset-api-key-button:active, #further-settings-save-api-key-button:active, .refresh-list-button:active, .ba-notification-button:active {
                background-color: #512DA8 !important;
                box-shadow: 0 3px 3px -2px rgba(0,0,0,0.2), 0 3px 4px 0 rgba(0,0,0,0.14), 0 1px 8px 0 rgba(0,0,0,0.12) !important;
                transform: translateY(0px) !important;
            }
            .settings-button {
                margin-right: 15px !important;
                margin-left: 0 !important;
            }
            .busting-info-bar .busting-data-button {
                 margin-left: 0 !important; margin-right: 10px !important;
            }
            .reset-api-key-button {
                background-color: #c0392b !important;
                font-size: 10px !important;
                height: 22px !important;
                line-height: 22px !important;
                padding: 0 8px !important;
                margin-left: 10px !important;
                min-width: auto !important;
            }
            .reset-api-key-button:hover {
                background-color: #a93226 !important;
            }
            .reset-api-key-button:disabled {
                background-color: #7f8c8d !important;
                cursor: not-allowed !important;
                opacity: 0.7 !important;
            }
            #further-settings-save-api-key-button {
                 margin-top: 5px;
                 min-width: auto !important;
                 height: 28px !important;
                 line-height: 28px !important;
            }
            .ba-notification-button-later {
                background-color: #7f8c8d !important;
            }
            .ba-notification-button-later:hover {
                background-color: #95a5a6 !important;
            }


            /* Info Bar Styles */
            .busting-info-bar {
                display: flex !important;
                flex-direction: column;
                padding: 0 !important;
                background-color: #2c2c2c !important;
                border: 1px solid #444 !important;
                border-radius: 4px !important;
                margin-bottom: 10px !important;
                font-size: 12px !important;
                color: #c1c1c1 !important;
                box-sizing: border-box !important;
            }
            #info-bar-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 8px 10px;
                cursor: pointer;
                font-weight: bold;
                border-bottom: 1px solid #383838;
                box-sizing: border-box;
            }
            #info-bar-header.collapsed {
                 border-bottom: none;
            }
            #info-bar-header .info-bar-title {
                color: #efefef;
            }
            #info-bar-header .toggle-arrow svg {
                width: 16px;
                height: 16px;
                fill: #c1c1c1;
                transition: transform 0.2s ease-in-out;
            }
            #info-bar-header.collapsed .toggle-arrow svg {
                transform: rotate(-90deg);
            }
            #info-bar-collapsible-content {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                width: 100%;
                padding: 8px 10px;
                box-sizing: border-box;
            }
            #info-bar-collapsible-content.content-collapsed {
                display: none !important;
            }

            .busting-info-bar .info-item {
                margin-right: 10px; padding: 3px 6px; background-color: #383838;
                border-radius: 3px; white-space: nowrap; margin-top: 2px; margin-bottom: 2px;
            }
            .busting-info-bar .info-item strong { color: #ffffff; }
            .busting-info-bar .info-item .value { color: #ffcc66; font-weight: bold; }

            .info-bar-controls-wrapper {
                display: flex;
                flex-basis: 100%;
                align-items: center;
                margin-top: 8px;
                flex-wrap: wrap;
            }

            .alert-setting-item-modal {
                display: flex !important;
                align-items: center !important;
                white-space: nowrap;
            }
            .alert-setting-item-modal input[type="checkbox"] { margin-right: 5px; vertical-align: middle; }
            .alert-setting-item-modal select {
                background-color: #444; color: #f0f0f0; border: 1px solid #555;
                border-radius: 3px; padding: 2px 4px; font-size: 11px; margin: 0 5px;
            }
            .alert-setting-item-modal label { font-size: 12px; vertical-align: middle; }
            .alert-setting-item-modal span { margin-left: 5px; }


            .difficulty-slider-item {
                display: inline-flex;
                align-items: center;
                padding: 3px 6px;
                background-color: #383838;
                border-radius: 3px;
                white-space: nowrap;
                margin-top: 2px;
                margin-bottom: 2px;
                margin-right: 15px;
            }
            .difficulty-slider-item label {
                font-size: 12px;
                margin-right: 5px;
            }
            .difficulty-slider-item input[type="range"] {
                width: 120px;
                margin: 0 5px;
                vertical-align: middle;
                -webkit-appearance: none;
                appearance: none;
                height: 8px;
                background: #555;
                border-radius: 4px;
                outline: none;
            }
            .difficulty-slider-item input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                background: #673AB7;
                cursor: pointer;
                border-radius: 50%;
                border: 1px solid #512DA8;
            }
            .difficulty-slider-item input[type="range"]::-moz-range-thumb {
                width: 14px;
                height: 14px;
                background: #673AB7;
                cursor: pointer;
                border-radius: 50%;
                border: 1px solid #512DA8;
            }
             .difficulty-slider-item input[type="range"]::-ms-thumb {
                width: 16px;
                height: 16px;
                background: #673AB7;
                cursor: pointer;
                border-radius: 50%;
                border: 1px solid #512DA8;
            }
            .difficulty-slider-item input[type="range"]::-webkit-slider-runnable-track {
                height: 8px;
                background: #4a4a4a;
                border-radius: 4px;
            }
            .difficulty-slider-item input[type="range"]::-moz-range-track {
                height: 8px;
                background: #4a4a4a;
                border-radius: 4px;
            }
            .difficulty-slider-item input[type="range"]::-ms-track {
                height: 8px;
                background: #4a4a4a;
                border-radius: 4px;
                color: transparent;
                border: none;
            }
            .difficulty-slider-item input[type="range"]::-ms-fill-lower {
                background: #7E57C2;
                border-radius: 4px;
            }
            .difficulty-slider-item .slider-value {
                min-width: 65px;
                text-align: right;
                color: #ffcc66;
                font-weight: bold;
                font-size: 11px;
            }

            /* Modal Styles (Shared) */
            .busting-modal-overlay, .api-settings-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.75); z-index: 10000; display: none; }
            .busting-modal, .api-settings-modal { position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); background-color: #333; color: #f0f0f0; padding: 20px; border: 1px solid #555; width: 90%; max-width: 700px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); z-index: 10001; display: none; border-radius: 6px; }
            .busting-modal-header, .api-settings-modal-header { padding-bottom: 12px; margin-bottom: 15px; border-bottom: 1px solid #444; font-size: 1.4em; font-weight: 600; color: #ffffff; display: flex; justify-content: space-between; align-items: center; }
            .busting-modal-content, .api-settings-modal-content { max-height: 80vh; overflow-y: auto; font-size: 14px; padding-right: 10px; }
            .busting-modal-close, .api-settings-modal-close { color: #bbbbbb; font-size: 30px; font-weight: bold; cursor: pointer; line-height: 0.7; }
            .busting-modal-close:hover, .api-settings-modal-close:hover,
            .busting-modal-close:focus, .api-settings-modal-close:focus { color: #ffffff; text-decoration: none; }

            /* Specific to Busting Data Modal's API Key Prompt */
            .api-key-prompt { padding: 10px; text-align: center; }
            .api-key-prompt p { margin-bottom: 10px; }
            .api-key-prompt input[type="text"] { padding: 8px; border-radius: 3px; border: 1px solid #555; background-color: #444; color: #f0f0f0; width: 70%; margin-right: 10px; }
            .api-key-prompt button { padding: 8px 15px; border-radius: 3px; border: none; background-color: #673AB7; color: white; cursor: pointer; }
            .api-key-prompt button:hover { background-color: #5E35B1; }

            /* Bust Log & Graph in Busting Data Modal */
            .bust-log-details, .penalty-graph-details { border: 1px solid #444; border-radius: 4px; margin-top: 15px; }
            .bust-log-details summary, .penalty-graph-details summary { padding: 10px; background-color: #3a3a3a; cursor: pointer; font-weight: bold; border-radius: 3px 3px 0 0; }
            .bust-log-details summary:hover, .penalty-graph-details summary:hover { background-color: #424242; }
            .bust-log-list { list-style-type: none; padding: 0; margin: 0; }
            .bust-log-list li { padding: 8px 10px; border-bottom: 1px solid #404040; font-size: 0.9em; display: flex; justify-content: space-between; flex-wrap: wrap; }
            .bust-log-list li:last-child { border-bottom: none; }
            .bust-log-list .bust-info { flex-grow: 1; }
            .bust-log-list .bust-time-elapsed { color: #999; font-size: 0.85em; margin-left: 10px; }
            .bust-log-list .bust-target { color: #67b7e2; }
            .bust-log-list .bust-penalty { color: #ffcc66; font-size: 0.9em; margin-left: 15px; white-space: nowrap; }
            .penalty-graph-container { padding: 15px; background-color: #2a2a2a; border-radius: 0 0 3px 3px;}
            .penalty-graph-svg { width: 100%; height: 250px; background-color: #2f2f2f; border-radius: 3px; }
            .penalty-graph-svg .axis { stroke: #777; stroke-width: 1; }
            .penalty-graph-svg .axis-label { fill: #aaa; font-size: 10px; }
            .penalty-graph-svg .penalty-line { stroke: #67b7e2; stroke-width: 2; fill: none; }
            .penalty-graph-svg .grid-line { stroke: #444; stroke-width: 0.5; }

            /* API Settings Modal Content */
            .api-settings-modal-content .api-key-display-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
            .api-settings-modal-content .api-key-display-container p { margin-bottom: 0; }
            .api-settings-modal-content strong { color: #ffcc66; word-break: break-all; }
            .api-settings-modal-content .api-key-input-area { text-align: center; margin-top: 10px;}
            .api-settings-modal-content .api-key-input-area input[type="text"] {
                padding: 6px; border-radius: 3px; border: 1px solid #555; background-color: #444;
                color: #f0f0f0; width: 60%; margin-right: 5px;
            }
            .api-settings-modal-content .api-key-input-area button {
                padding: 6px 12px; font-size: 11px; height: auto;
            }
            .setting-item-box {
                border: 1px solid #555;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 3px;
                background-color: #3f3f3f;
            }
            .setting-subsection {
                margin-left: 20px;
                margin-top: 8px;
            }
            .text-input-disabled, .text-input-disabled label, .text-input-disabled input[type="number"] {
                opacity: 0.5;
                color: #aaa !important; /* Ensure label text is also grayed out */
            }
             #dynamic-difficulty-zero-penalty-input:disabled {
                background-color: #505050 !important; /* Darker background when disabled */
                cursor: not-allowed;
            }
            .dynamic-difficulty-setting, .api-interval-setting, .alert-setting-item-modal { display: flex; align-items: center; flex-wrap: wrap; }
            .dynamic-difficulty-setting label, .api-interval-setting label, .alert-setting-item-modal label { margin-right: 5px; white-space: nowrap;}
            .dynamic-difficulty-setting input[type="checkbox"] { margin-right: 10px; }
            .dynamic-difficulty-setting input[type="number"], .api-interval-setting select, .alert-setting-item-modal select {
                width: 80px; padding: 4px; border-radius: 3px; border: 1px solid #555;
                background-color: #444; color: #f0f0f0; margin-left: 5px;
            }
            .api-interval-setting span, .alert-setting-item-modal span { margin-left: 5px; }
            .alert-setting-item-modal input[type="checkbox"] { margin-right: 5px;}
            #toggle-api-key-visibility-button {
                background: none !important; border: none !important; box-shadow: none !important;
                padding: 0 5px !important; height: 20px !important; min-width: auto !important;
                margin-left: 8px;
            }
            #toggle-api-key-visibility-button svg { width: 16px; height: 16px; fill: #ccc; }
            #toggle-api-key-visibility-button:hover svg { fill: #fff; }


            .user-info-list-wrap li > .info-wrap > .reason {
                 color: #ffcc66;
                 font-weight: bold;
            }
            .ba-refresh-wrapper-style {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                padding: 5px 0;
            }
            .refresh-list-button {
                /* margin-right: 10px; /* Removed for flush right */
            }

            /* Notification Styles */
            .ba-notification-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding-top: 20px;
            }
            .ba-notification-box {
                background-color: #333;
                color: #f0f0f0;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                text-align: center;
                max-width: 400px;
                border: 1px solid #555;
            }
            .ba-notification-message {
                font-size: 1.1em;
                margin-bottom: 15px;
            }
            .ba-notification-button-container {
                margin-top: 10px;
                display: flex;
                justify-content: center;
            }
            .ba-notification-button {
                min-width: 100px !important;
                margin: 0 5px;
            }
        `);
    }

    // --- API Key Management ---
    function getApiKey() { return GM_getValue(API_KEY_STORAGE, null); }
    function saveApiKey(apiKey) { GM_setValue(API_KEY_STORAGE, apiKey); }

    // --- API Calls ---
    async function fetchTornTimestamp(apiKey) {
        const url = `https://api.torn.com/torn/?selections=timestamp&key=${apiKey}&comment=${SCRIPT_NAME}_timestamp`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, timeout: 10000,
                onload: (r) => { try { const d = JSON.parse(r.responseText); if (d.error) reject(new Error(d.error.error || "Error fetching timestamp")); else if (d.timestamp && typeof d.timestamp === 'number') resolve(d.timestamp); else reject(new Error("Timestamp not found or invalid in API response")); } catch (e) { console.error(`[${SCRIPT_NAME}] Error parsing timestamp API data:`, e, r.responseText); reject(new Error("Error parsing timestamp API data.")); } },
                onerror: (e) => { console.error(`[${SCRIPT_NAME}] Network error fetching timestamp:`, e); reject(new Error("Network error fetching timestamp.")); },
                ontimeout: () => { console.error(`[${SCRIPT_NAME}] Timestamp API request timed out.`); reject(new Error("Timestamp API request timed out.")); }
            });
        });
    }
    async function fetchRecentBusts(apiKey) {
        const url = `https://api.torn.com/user/?selections=log&log=5360&key=${apiKey}&comment=${SCRIPT_NAME}_busts`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, timeout: 15000,
                onload: (r) => { try { const d = JSON.parse(r.responseText); if (d.error) reject(new Error(d.error.error || "Unknown API error fetching busts")); else resolve(d.log || {}); } catch (e) { reject(new Error("Error parsing bust log API data.")); } },
                onerror: () => reject(new Error("Network error fetching bust log.")), ontimeout: () => reject(new Error("Bust log API request timed out."))
            });
        });
    }
    async function fetchPlayerProfile(apiKey) {
        const url = `https://api.torn.com/user/?selections=profile&key=${apiKey}&comment=${SCRIPT_NAME}_level`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url, timeout: 10000,
                onload: (r) => {
                    try {
                        const d = JSON.parse(r.responseText);
                        if (d.error) {
                            reject(new Error(d.error.error || "Error fetching player profile"));
                        } else if (d.level && typeof d.level === 'number') {
                            resolve(d.level);
                        } else {
                            reject(new Error("Player level not found or invalid in API response"));
                        }
                    } catch (e) {
                        console.error(`[${SCRIPT_NAME}] Error parsing player profile API data:`, e, r.responseText);
                        reject(new Error("Error parsing player profile API data."));
                    }
                },
                onerror: (e) => { console.error(`[${SCRIPT_NAME}] Network error fetching player profile:`, e); reject(new Error("Network error fetching player profile.")); },
                ontimeout: () => { console.error(`[${SCRIPT_NAME}] Player profile API request timed out.`); reject(new Error("Player profile API request timed out.")); }
            });
        });
    }


    // --- Penalty Calculation ---
    function calculateIndividualPenalty(bustTimestamp, currentServerTimestamp) {
        const P0 = P_ZERO;
        const timeElapsedSeconds = currentServerTimestamp - bustTimestamp;
        if (timeElapsedSeconds < 0) return P0;
        const timeElapsedHours = timeElapsedSeconds / 3600;
        if (timeElapsedHours > 72) return 0;
        const penalty = P0 / (1 + 0.1 * timeElapsedHours);
        return Math.round(penalty);
    }

    // --- Graph Generation ---
    function generatePenaltyGraphData(busts, currentServerTimestamp) {
        const graphDataPoints = [];
        const hoursInWindow = 72;
        const timeStepSeconds = 15;
        const timeStepHours = timeStepSeconds / 3600;
        let maxObservedPenaltyInGraph = 0;

        if (typeof currentServerTimestamp !== 'number' || isNaN(currentServerTimestamp)) {
            return { points: [], maxObservedPenalty: 0 };
        }
        const bustEntries = (typeof busts === 'object' && busts !== null) ? Object.values(busts) : [];
        for (let h = 0; h <= hoursInWindow; h += timeStepHours) {
            const pointInTime = (currentServerTimestamp - (hoursInWindow * 3600)) + (h * 3600);
            let totalPenaltyAtPoint = 0;
            for (const bust of bustEntries) {
                if (bust && typeof bust.timestamp === 'number' && bust.timestamp <= pointInTime) {
                    const ageOfBustAtPointHours = (pointInTime - bust.timestamp) / 3600;
                    if (ageOfBustAtPointHours >= 0 && ageOfBustAtPointHours <= 72) {
                        totalPenaltyAtPoint += P_ZERO / (1 + 0.1 * ageOfBustAtPointHours);
                    }
                }
            }
            const roundedPenalty = Math.round(totalPenaltyAtPoint);
            graphDataPoints.push({ time: h, penalty: roundedPenalty });
            if (roundedPenalty > maxObservedPenaltyInGraph) maxObservedPenaltyInGraph = roundedPenalty;
        }
        return { points: graphDataPoints, maxObservedPenalty: maxObservedPenaltyInGraph };
    }

    function renderPenaltyGraph(graphDataPoints) {
        const container = document.createElement('div');
        container.className = 'penalty-graph-container';
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('class', 'penalty-graph-svg');
        const svgWidth = 580; const svgHeight = 250;
        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        if (!graphDataPoints || graphDataPoints.length === 0) {
            const noDataText = document.createElementNS(svgNS, "text");
            noDataText.setAttribute('x', svgWidth / 2); noDataText.setAttribute('y', svgHeight / 2);
            noDataText.setAttribute('fill', '#aaa'); noDataText.setAttribute('text-anchor', 'middle');
            noDataText.textContent = "Not enough data for graph.";
            svg.appendChild(noDataText); container.appendChild(svg); return container;
        }
        const padding = { top: 20, right: 30, bottom: 40, left: 50 };
        const chartWidth = svgWidth - padding.left - padding.right;
        const chartHeight = svgHeight - padding.top - padding.bottom;
        const maxPenaltyOnGraph = Math.max(...graphDataPoints.map(p => p.penalty), 0) || P_ZERO;
        const xScale = chartWidth / 72;
        const yScale = chartHeight / (maxPenaltyOnGraph > 0 ? maxPenaltyOnGraph : P_ZERO);
        const xAxis = document.createElementNS(svgNS, "line");
        xAxis.setAttribute('x1', padding.left); xAxis.setAttribute('y1', padding.top + chartHeight);
        xAxis.setAttribute('x2', padding.left + chartWidth); xAxis.setAttribute('y2', padding.top + chartHeight);
        xAxis.setAttribute('class', 'axis'); svg.appendChild(xAxis);
        for (let i = 0; i <= 72; i += 12) {
            const x = padding.left + i * xScale;
            const label = document.createElementNS(svgNS, "text");
            label.setAttribute('x', x); label.setAttribute('y', padding.top + chartHeight + 15);
            label.setAttribute('class', 'axis-label'); label.setAttribute('text-anchor', 'middle');
            if (i === 0) label.textContent = "72h ago"; else if (i === 72) label.textContent = "Now"; else label.textContent = `${72-i}h ago`;
            svg.appendChild(label);
        }
        const yAxis = document.createElementNS(svgNS, "line");
        yAxis.setAttribute('x1', padding.left); yAxis.setAttribute('y1', padding.top);
        yAxis.setAttribute('x2', padding.left); yAxis.setAttribute('y2', padding.top + chartHeight);
        yAxis.setAttribute('class', 'axis'); svg.appendChild(yAxis);
        for (let i = 0; i <= 5; i++) {
            const penaltyVal = Math.round((maxPenaltyOnGraph / 5) * i);
            const y = padding.top + chartHeight - (penaltyVal * yScale);
            const label = document.createElementNS(svgNS, "text");
            label.setAttribute('x', padding.left - 8); label.setAttribute('y', y + 3);
            label.setAttribute('class', 'axis-label'); label.setAttribute('text-anchor', 'end');
            label.textContent = penaltyVal; svg.appendChild(label);
            const gridLine = document.createElementNS(svgNS, "line");
            gridLine.setAttribute('x1', padding.left); gridLine.setAttribute('y1', y);
            gridLine.setAttribute('x2', padding.left + chartWidth); gridLine.setAttribute('y2', y);
            gridLine.setAttribute('class', 'grid-line'); svg.appendChild(gridLine);
        }
        const points = graphDataPoints.map(p => `${padding.left + p.time * xScale},${padding.top + chartHeight - p.penalty * yScale}`).join(' ');
        const polyline = document.createElementNS(svgNS, "polyline");
        polyline.setAttribute('points', points); polyline.setAttribute('class', 'penalty-line');
        svg.appendChild(polyline);
        container.appendChild(svg);
        return container;
    }

    // --- Modal Content Update ---
    function displayApiKeyPrompt() {
        if (!modalContentElement) return;
        modalContentElement.innerHTML = `
            <div class="api-key-prompt">
                <p>Please enter your Torn API key to fetch bust data.</p>
                <p>(Requires access to "Public data" and "Log access")</p>
                <input type="text" id="busting-api-key-input" placeholder="16-character API Key">
                <button id="busting-save-api-key">Save & Load</button>
                <p style="font-size:0.8em; margin-top:15px;">You can find your API key under <a href="https://www.torn.com/preferences.php#tab=api" target="_blank" style="color:#67b7e2;">Settings -> API Key</a>.</p>
            </div>
        `;
        document.getElementById('busting-save-api-key').addEventListener('click', async () => {
            const inputKey = document.getElementById('busting-api-key-input').value.trim();
            if (inputKey.length === 16) {
                saveApiKey(inputKey);
                modalContentElement.innerHTML = '<p>API Key saved. Loading data...</p>';
                await loadAndDisplayBusts(false);
            } else {
                alert("Invalid API Key. It must be 16 characters long.");
            }
        });
    }
    function formatTimeElapsed(bustTimestamp, currentServerTimestamp) {
        const secondsElapsed = currentServerTimestamp - bustTimestamp;
        if (secondsElapsed < 0) return "in the future";
        const hours = Math.floor(secondsElapsed / 3600);
        const minutes = Math.floor((secondsElapsed % 3600) / 60);
        let result = "";
        if (hours > 0) result += `${hours}h `;
        result += `${minutes}m ago`;
        return result;
    }

    async function loadAndDisplayBusts(updateInfoBarOnly = false) {
        const onJailView = window.location.href.includes("jailview.php");
        const apiKey = getApiKey();

        if (!apiKey) {
            if (onJailView) {
                if (!updateInfoBarOnly && modalContentElement) displayApiKeyPrompt();
                await updateInfoBar("API Key needed", "N/A", "N/A", "N/A", GM_getValue(ALL_TIME_MAX_PENALTY_STORAGE, 'N/A'));
            }
            checkAndShowNotification(0);
            return;
        }

        if (onJailView && !updateInfoBarOnly && modalContentElement) {
            modalContentElement.innerHTML = '<p>Loading recent bust data (last 72 hours)...</p>';
        }

        let currentServerTimestamp;
        let logData = {};
        let graphDataResult = { points: [], maxObservedPenalty: 0 };
        let currentAllTimeMaxPenalty = GM_getValue(ALL_TIME_MAX_PENALTY_STORAGE, 0);

        try {
            currentServerTimestamp = await fetchTornTimestamp(apiKey);
            if (typeof currentServerTimestamp !== 'number' || isNaN(currentServerTimestamp)) {
                throw new Error("Failed to get a valid server timestamp.");
            }

            logData = await fetchRecentBusts(apiKey);
            if (typeof logData !== 'object' || logData === null) {
                logData = {};
            }

            const seventyTwoHoursAgo = currentServerTimestamp - (72 * 60 * 60);
            let bustCountForModalList = 0;
            let totalCurrentPenaltyFromFormula = 0;
            const sortedLogEntries = Object.values(logData).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0) );

            for (const entry of sortedLogEntries) {
                if (entry && typeof entry.timestamp === 'number' && entry.timestamp >= seventyTwoHoursAgo) {
                    totalCurrentPenaltyFromFormula += calculateIndividualPenalty(entry.timestamp, currentServerTimestamp);
                    if (!updateInfoBarOnly && onJailView) bustCountForModalList++;
                }
            }

            const tempGraphData = generatePenaltyGraphData(logData, currentServerTimestamp);
            if (typeof tempGraphData === 'object' && tempGraphData !== null &&
                typeof tempGraphData.maxObservedPenalty === 'number' && Array.isArray(tempGraphData.points)) {
                graphDataResult = tempGraphData;
            } else {
                graphDataResult = { points: [], maxObservedPenalty: 0 };
            }

            const maxPenaltyLast72h = graphDataResult.maxObservedPenalty;

            if (maxPenaltyLast72h > currentAllTimeMaxPenalty) {
                currentAllTimeMaxPenalty = maxPenaltyLast72h;
                GM_setValue(ALL_TIME_MAX_PENALTY_STORAGE, currentAllTimeMaxPenalty);
            }

            const bustsToMax = P_ZERO > 0 ? Math.max(0, Math.floor((maxPenaltyLast72h - totalCurrentPenaltyFromFormula) / P_ZERO)) : 0;

            if (onJailView) {
                 await updateInfoBar(totalCurrentPenaltyFromFormula, maxPenaltyLast72h, bustsToMax, currentAllTimeMaxPenalty);
            } else {
                const dynamicEnabled = GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false);
                if (dynamicEnabled) {
                    let zeroPenaltyDifficulty;
                    const useCustomZero = GM_getValue(DYNAMIC_DIFFICULTY_USE_CUSTOM_ZERO_PENALTY_STORAGE, false);
                    if (useCustomZero) {
                        zeroPenaltyDifficulty = parseInt(GM_getValue(DYNAMIC_DIFFICULTY_ZERO_PENALTY_STORAGE, 60000), 10);
                    } else {
                        try {
                            const playerLevel = await fetchPlayerProfile(apiKey);
                            zeroPenaltyDifficulty = playerLevel * 600;
                        } catch (e) {
                            console.warn(`[${SCRIPT_NAME}] Could not fetch player level for dynamic difficulty, using default 60000. Error: ${e.message}`);
                            zeroPenaltyDifficulty = 60000;
                        }
                    }

                    let calculatedDynamicDifficulty = zeroPenaltyDifficulty;
                    const numCurrentPenalty = typeof totalCurrentPenaltyFromFormula === 'number' ? totalCurrentPenaltyFromFormula : 0;
                    const numAllTimeMaxPenalty = typeof currentAllTimeMaxPenalty === 'number' && currentAllTimeMaxPenalty > 0 ? currentAllTimeMaxPenalty : P_ZERO;
                    const penaltyThresholdForMinDifficulty = numAllTimeMaxPenalty - 1000;

                    if (numCurrentPenalty >= penaltyThresholdForMinDifficulty && penaltyThresholdForMinDifficulty > 0) {
                        calculatedDynamicDifficulty = DYNAMIC_DIFFICULTY_FLOOR;
                    } else if (penaltyThresholdForMinDifficulty > 0) {
                        const difficultyDrop = zeroPenaltyDifficulty - DYNAMIC_DIFFICULTY_FLOOR;
                        const penaltyRatio = Math.min(1, Math.max(0, numCurrentPenalty) / penaltyThresholdForMinDifficulty);
                        calculatedDynamicDifficulty = zeroPenaltyDifficulty - (penaltyRatio * difficultyDrop);
                    } else {
                         calculatedDynamicDifficulty = (numCurrentPenalty > 0) ? DYNAMIC_DIFFICULTY_FLOOR : zeroPenaltyDifficulty;
                    }
                    let effectiveMaxDifficulty = Math.round(Math.max(DYNAMIC_DIFFICULTY_FLOOR, Math.min(calculatedDynamicDifficulty, zeroPenaltyDifficulty)));
                    GM_setValue(MAX_DIFFICULTY_SLIDER_STORAGE, effectiveMaxDifficulty);
                }
            }
            checkAndShowNotification(bustsToMax);

            if (onJailView && !updateInfoBarOnly && modalContentElement) {
                let listHtml = '<ul class="bust-log-list">';
                let actualBustsInList = 0;
                 sortedLogEntries.forEach(entry => {
                    if (entry && typeof entry.timestamp === 'number' && entry.timestamp >= seventyTwoHoursAgo) {
                        actualBustsInList++;
                        const titleMatch = entry.title ? entry.title.match(/You busted <a href="XID=\d+">([^<]+)<\/a> out of jail\./) : null;
                        const targetName = titleMatch ? titleMatch[1] : "Unknown Target";
                        const remainingPenalty = calculateIndividualPenalty(entry.timestamp, currentServerTimestamp);
                        const timeElapsedStr = formatTimeElapsed(entry.timestamp, currentServerTimestamp);
                        listHtml += `<li>
                                        <span class="bust-info">Busted <strong class="bust-target">${targetName}</strong> <span class="bust-time-elapsed">(${timeElapsedStr})</span></span>
                                        <span class="bust-penalty">Penalty: ${remainingPenalty}</span>
                                     </li>`;
                    }
                });
                listHtml += '</ul>';
                const summaryText = `Recent Busts (Last 72h) - ${actualBustsInList} found. Total Calculated Penalty (now): ${totalCurrentPenaltyFromFormula}`;
                let finalHtml = `<details class="bust-log-details"><summary>${summaryText}</summary>${actualBustsInList > 0 ? listHtml : '<p style="padding:10px;">No busts found in the last 72 hours.</p>'}</details>`;
                const graphElement = renderPenaltyGraph(graphDataResult.points);
                const graphDetails = document.createElement('details');
                graphDetails.className = 'penalty-graph-details';
                const graphSummary = document.createElement('summary');
                graphSummary.textContent = `Total Penalty Over Last 72 Hours (Max: ${maxPenaltyLast72h})`;
                graphDetails.appendChild(graphSummary);
                graphDetails.appendChild(graphElement);
                finalHtml += graphDetails.outerHTML;
                modalContentElement.innerHTML = finalHtml;
            }
        } catch (error) {
            console.error(`[${SCRIPT_NAME}] Outer catch in loadAndDisplayBusts:`, error.message || error);
            if (onJailView) {
                if (!updateInfoBarOnly && modalContentElement) {
                    modalContentElement.innerHTML = `<p style="color: #ff6b6b;">Error loading bust data: ${error.message || error}</p><p style="margin-top:10px;">Please check your API key or try again later.</p>`;
                    if (!apiKey) setTimeout(displayApiKeyPrompt, 3000);
                }
                await updateInfoBar("Error", "Error", "Error", GM_getValue(ALL_TIME_MAX_PENALTY_STORAGE, 'Error'));
            }
            checkAndShowNotification(0);
        }
    }

    // --- Notification Functions ---
    function showBustNotification() {
        if (document.getElementById('ba-notification-overlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'ba-notification-overlay';
        overlay.className = 'ba-notification-overlay';

        const box = document.createElement('div');
        box.className = 'ba-notification-box';

        const message = document.createElement('p');
        message.className = 'ba-notification-message';
        message.textContent = "It's time to bust someone out of jail!";
        box.appendChild(message);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'ba-notification-button-container';

        const visitButton = document.createElement('button');
        visitButton.textContent = 'Visit Jail';
        visitButton.className = 'ba-notification-button ba-notification-button-visit';
        visitButton.onclick = () => {
            const cooldownEndTime = Date.now() + 5 * 60 * 1000;
            GM_setValue(NOTIFICATION_COOLDOWN_END_STORAGE, cooldownEndTime);
            closeBustNotification();
            window.open('https://www.torn.com/jailview.php#', '_blank');
        };
        buttonContainer.appendChild(visitButton);

        const laterButton = document.createElement('button');
        laterButton.textContent = 'Later';
        laterButton.className = 'ba-notification-button ba-notification-button-later';
        laterButton.onclick = () => {
            const cooldownEndTime = Date.now() + 30 * 60 * 1000;
            GM_setValue(NOTIFICATION_COOLDOWN_END_STORAGE, cooldownEndTime);
            closeBustNotification();
        };
        buttonContainer.appendChild(laterButton);

        box.appendChild(buttonContainer);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    function closeBustNotification() {
        const overlay = document.getElementById('ba-notification-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    function checkAndShowNotification(currentBustsToMax) {
        if (window.location.href.includes("jailview.php")) {
            return;
        }

        const cooldownEndTime = GM_getValue(NOTIFICATION_COOLDOWN_END_STORAGE, 0);

        if (Date.now() < cooldownEndTime) {
            return;
        }

        const alertEnabled = GM_getValue(ALERT_ENABLED_STORAGE, false);
        const alertThreshold = parseInt(GM_getValue(ALERT_DROPDOWN_STORAGE, 1), 10);

        if (alertEnabled && typeof currentBustsToMax === 'number' && currentBustsToMax >= alertThreshold) {
            if (!document.getElementById('ba-notification-overlay')) {
                showBustNotification();
            }
        } else {
            if (document.getElementById('ba-notification-overlay')) {
                 closeBustNotification();
            }
        }
    }


    // --- Info Bar Functions ---
    function createInfoBar() {
        const onJailView = window.location.href.includes("jailview.php");
        if (!onJailView) {
            return;
        }

        if (document.getElementById('busting-info-bar-container')) {
            infoBarElement = document.getElementById('busting-info-bar-container');
            infoBarCollapsibleContent = document.getElementById('info-bar-collapsible-content');
            infoBarHeader = document.getElementById('info-bar-header');
            const difficultySlider = infoBarElement.querySelector('#max-difficulty-slider');
             if (difficultySlider && !difficultySlider.dataset.listenerAttached) {
                 const difficultyValueDisplay = infoBarElement.querySelector('#max-difficulty-value-display');
                 difficultySlider.addEventListener('input', (event) => {
                    clearTimeout(difficultySliderDebounceTimer);
                    const sliderPos = parseInt(event.target.value);
                    const actualDifficulty = Math.round(sliderPositionToLogValue(sliderPos));
                    if(difficultyValueDisplay) difficultyValueDisplay.textContent = actualDifficulty.toLocaleString();

                    difficultySliderDebounceTimer = setTimeout(() => {
                        GM_setValue(MAX_DIFFICULTY_SLIDER_STORAGE, actualDifficulty);
                        const isDynamicEnabled = GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false);
                        if (!isDynamicEnabled) {
                            console.log(`[${SCRIPT_NAME}] Max difficulty slider changed (manual), re-enhancing list. Actual value: ${actualDifficulty}`);
                            enhanceJailListPage();
                        }
                    }, 250);
                });
                difficultySlider.dataset.listenerAttached = 'true';
            }
            if (infoBarHeader && !infoBarHeader.dataset.listenerAttached) {
                const toggleArrow = infoBarHeader.querySelector('.toggle-arrow');
                infoBarHeader.addEventListener('click', () => {
                    const currentlyCollapsed = infoBarCollapsibleContent.classList.toggle('content-collapsed');
                    infoBarHeader.classList.toggle('collapsed', currentlyCollapsed);
                    GM_setValue(INFO_BAR_COLLAPSED_STORAGE, currentlyCollapsed);
                    if (toggleArrow) {
                        if (currentlyCollapsed) {
                            toggleArrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;
                        } else {
                            toggleArrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
                        }
                    }
                });
                infoBarHeader.dataset.listenerAttached = 'true';
            }
            const isDynamicEnabled = GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false);
            const sliderInput = infoBarElement.querySelector('#max-difficulty-slider');
            if (sliderInput) sliderInput.style.display = isDynamicEnabled ? 'none' : '';

            return;
        }
        const userListTitleAnchor = document.querySelector('.userlist-wrapper .users-list-title');
        if (!userListTitleAnchor) {
            console.warn(`[${SCRIPT_NAME}] '.users-list-title' not found. Info bar not created.`);
            return;
        }
        infoBarElement = document.createElement('div');
        infoBarElement.id = 'busting-info-bar-container';
        infoBarElement.className = 'busting-info-bar';

        infoBarHeader = document.createElement('div');
        infoBarHeader.id = 'info-bar-header';
        const headerTitle = document.createElement('span');
        headerTitle.className = 'info-bar-title';
        headerTitle.textContent = 'Busting Assistant';
        infoBarHeader.appendChild(headerTitle);
        const toggleArrow = document.createElement('span');
        toggleArrow.className = 'toggle-arrow';
        toggleArrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
        infoBarHeader.appendChild(toggleArrow);
        infoBarElement.appendChild(infoBarHeader);

        infoBarCollapsibleContent = document.createElement('div');
        infoBarCollapsibleContent.id = 'info-bar-collapsible-content';
        infoBarElement.appendChild(infoBarCollapsibleContent);

        const bustingDataButton = document.createElement('button');
        bustingDataButton.id = 'busting-data-header-button';
        bustingDataButton.className = 'busting-data-button';
        bustingDataButton.textContent = 'Busting Data';
        bustingDataButton.onclick = openModal;
        infoBarCollapsibleContent.appendChild(bustingDataButton);

        const createSpan = (id, labelTextStart, valueText = '...', labelTextEnd = "", suffixId = null) => {
            const span = document.createElement('span');
            span.className = 'info-item';
            span.appendChild(document.createTextNode(labelTextStart));
            const strong = document.createElement('strong');
            strong.id = id;
            strong.className = 'value';
            strong.textContent = valueText;
            span.appendChild(strong);
            if (suffixId) {
                const suffixSpan = document.createElement('span');
                suffixSpan.id = suffixId;
                suffixSpan.textContent = labelTextEnd;
                span.appendChild(suffixSpan);
            } else if (labelTextEnd) {
                span.appendChild(document.createTextNode(labelTextEnd));
            }
            return span;
        };

        infoBarCollapsibleContent.appendChild(createSpan('current-penalty-value', 'Current Penalty: '));
        infoBarCollapsibleContent.appendChild(createSpan('max-penalty-value', 'Max Penalty (72h): '));
        infoBarCollapsibleContent.appendChild(createSpan('busts-to-max-value', '', '...', ' busts possible', 'busts-to-max-suffix'));
        infoBarCollapsibleContent.appendChild(createSpan('all-time-max-penalty-value', 'Max Penalty (all time): ', GM_getValue(ALL_TIME_MAX_PENALTY_STORAGE, 'N/A')));


        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'info-bar-controls-wrapper';

        const settingsButton = document.createElement('button');
        settingsButton.id = 'settings-info-bar-button';
        settingsButton.className = 'busting-data-button settings-button';
        settingsButton.textContent = 'Settings';
        settingsButton.onclick = openApiSettingsModal;
        controlsWrapper.appendChild(settingsButton);


        const difficultySliderContainer = document.createElement('div');
        difficultySliderContainer.className = 'difficulty-slider-item';
        const difficultyLabel = document.createElement('label');
        difficultyLabel.htmlFor = 'max-difficulty-slider';
        difficultyLabel.textContent = 'Max Difficulty: ';
        difficultySliderContainer.appendChild(difficultyLabel);

        const difficultySlider = document.createElement('input');
        difficultySlider.type = 'range';
        difficultySlider.id = 'max-difficulty-slider';
        difficultySlider.min = SLIDER_VISUAL_MIN.toString();
        difficultySlider.max = SLIDER_VISUAL_MAX.toString();
        difficultySlider.step = '1';

        const storedActualDifficulty = GM_getValue(MAX_DIFFICULTY_SLIDER_STORAGE, LOG_ACTUAL_MAX);
        difficultySlider.value = logValueToSliderPosition(storedActualDifficulty).toString();
        difficultySliderContainer.appendChild(difficultySlider);

        const difficultyValueDisplay = document.createElement('span');
        difficultyValueDisplay.id = 'max-difficulty-value-display';
        difficultyValueDisplay.className = 'slider-value';
        difficultyValueDisplay.textContent = Math.round(storedActualDifficulty).toLocaleString();
        difficultySliderContainer.appendChild(difficultyValueDisplay);

        const isDynamicEnabled = GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false);
        difficultySlider.style.display = isDynamicEnabled ? 'none' : '';


        difficultySlider.addEventListener('input', (event) => {
            clearTimeout(difficultySliderDebounceTimer);
            const sliderPos = parseInt(event.target.value);
            const actualDifficulty = Math.round(sliderPositionToLogValue(sliderPos));
            difficultyValueDisplay.textContent = actualDifficulty.toLocaleString();

            difficultySliderDebounceTimer = setTimeout(() => {
                GM_setValue(MAX_DIFFICULTY_SLIDER_STORAGE, actualDifficulty);
                const currentDynamicEnabled = GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false);
                if (!currentDynamicEnabled) {
                    console.log(`[${SCRIPT_NAME}] Max difficulty slider changed (manual), re-enhancing list. Actual value: ${actualDifficulty}`);
                    enhanceJailListPage();
                }
            }, 250);
        });
        difficultySlider.dataset.listenerAttached = 'true';
        controlsWrapper.appendChild(difficultySliderContainer);
        infoBarCollapsibleContent.appendChild(controlsWrapper);


        const isCollapsed = GM_getValue(INFO_BAR_COLLAPSED_STORAGE, false);
        if (isCollapsed) {
            infoBarCollapsibleContent.classList.add('content-collapsed');
            infoBarHeader.classList.add('collapsed');
            toggleArrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;
        }

        infoBarHeader.addEventListener('click', () => {
            const currentlyCollapsed = infoBarCollapsibleContent.classList.toggle('content-collapsed');
            infoBarHeader.classList.toggle('collapsed', currentlyCollapsed);
            GM_setValue(INFO_BAR_COLLAPSED_STORAGE, currentlyCollapsed);
            if (toggleArrow) {
                if (currentlyCollapsed) {
                    toggleArrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;
                } else {
                    toggleArrow.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
                }
            }
        });
        infoBarHeader.dataset.listenerAttached = 'true';

        userListTitleAnchor.parentNode.insertBefore(infoBarElement, userListTitleAnchor);
        console.log(`[${SCRIPT_NAME}] Info bar created with collapsible header.`);
    }

    async function updateInfoBar(currentPenalty, maxPenalty, bustsToMax, allTimeMaxPenalty) {
        const onJailView = window.location.href.includes("jailview.php");
        const apiKey = getApiKey();

        const dynamicEnabled = GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false);
        let effectiveMaxDifficulty;

        if (dynamicEnabled) {
            let zeroPenaltyDifficulty;
            const useCustomZero = GM_getValue(DYNAMIC_DIFFICULTY_USE_CUSTOM_ZERO_PENALTY_STORAGE, false);

            if (useCustomZero) {
                zeroPenaltyDifficulty = parseInt(GM_getValue(DYNAMIC_DIFFICULTY_ZERO_PENALTY_STORAGE, 60000), 10);
            } else {
                if (apiKey) {
                    try {
                        const playerLevel = await fetchPlayerProfile(apiKey);
                        zeroPenaltyDifficulty = playerLevel * 600;
                    } catch (e) {
                        console.warn(`[${SCRIPT_NAME}] Could not fetch player level for dynamic difficulty, using default 60000. Error: ${e.message}`);
                        zeroPenaltyDifficulty = 60000;
                    }
                } else {
                     console.warn(`[${SCRIPT_NAME}] API key not set, using default 60000 for dynamic difficulty zero point.`);
                     zeroPenaltyDifficulty = 60000;
                }
            }

            let calculatedDynamicDifficulty = zeroPenaltyDifficulty;
            const numCurrentPenalty = typeof currentPenalty === 'number' ? currentPenalty : 0;
            const numAllTimeMaxPenalty = typeof allTimeMaxPenalty === 'number' && allTimeMaxPenalty > 0 ? allTimeMaxPenalty : P_ZERO;
            const penaltyThresholdForMinDifficulty = numAllTimeMaxPenalty - 1000;

            if (numCurrentPenalty >= penaltyThresholdForMinDifficulty && penaltyThresholdForMinDifficulty > 0) {
                calculatedDynamicDifficulty = DYNAMIC_DIFFICULTY_FLOOR;
            } else if (penaltyThresholdForMinDifficulty > 0) {
                const difficultyDrop = zeroPenaltyDifficulty - DYNAMIC_DIFFICULTY_FLOOR;
                const penaltyRatio = Math.min(1, Math.max(0, numCurrentPenalty) / penaltyThresholdForMinDifficulty);
                calculatedDynamicDifficulty = zeroPenaltyDifficulty - (penaltyRatio * difficultyDrop);
            } else {
                 calculatedDynamicDifficulty = (numCurrentPenalty > 0) ? DYNAMIC_DIFFICULTY_FLOOR : zeroPenaltyDifficulty;
            }
            effectiveMaxDifficulty = Math.round(Math.max(DYNAMIC_DIFFICULTY_FLOOR, Math.min(calculatedDynamicDifficulty, zeroPenaltyDifficulty)));
            GM_setValue(MAX_DIFFICULTY_SLIDER_STORAGE, effectiveMaxDifficulty);
        } else {
            effectiveMaxDifficulty = GM_getValue(MAX_DIFFICULTY_SLIDER_STORAGE, LOG_ACTUAL_MAX);
        }

        if (!onJailView || !infoBarCollapsibleContent) {
            return;
        }

        const currentPVal = infoBarCollapsibleContent.querySelector('#current-penalty-value');
        const maxPVal = infoBarCollapsibleContent.querySelector('#max-penalty-value');
        const bustsVal = infoBarCollapsibleContent.querySelector('#busts-to-max-value');
        const bustsSuffix = infoBarCollapsibleContent.querySelector('#busts-to-max-suffix');
        const allTimeMaxPVal = infoBarCollapsibleContent.querySelector('#all-time-max-penalty-value');
        const difficultyValueDisplay = infoBarCollapsibleContent.querySelector('#max-difficulty-value-display');
        const difficultySliderInput = infoBarCollapsibleContent.querySelector('#max-difficulty-slider');

        if (currentPVal) currentPVal.textContent = (typeof currentPenalty === 'number' || typeof currentPenalty === 'string') ? currentPenalty : 'N/A';
        if (maxPVal) maxPVal.textContent = (typeof maxPenalty === 'number' || typeof maxPenalty === 'string') ? maxPenalty : 'N/A';
        if (bustsVal) bustsVal.textContent = (typeof bustsToMax === 'number' || typeof bustsToMax === 'string') ? bustsToMax : 'N/A';
        if (bustsSuffix) {
            if (typeof bustsToMax === 'number' && bustsToMax === 1) {
                bustsSuffix.textContent = ' bust possible';
            } else {
                bustsSuffix.textContent = ' busts possible';
            }
        }
        if (allTimeMaxPVal) allTimeMaxPVal.textContent = (typeof allTimeMaxPenalty === 'number' || typeof allTimeMaxPenalty === 'string') ? allTimeMaxPenalty : 'N/A';

        if (dynamicEnabled) {
            if (difficultySliderInput) difficultySliderInput.style.display = 'none';
            if (difficultyValueDisplay) difficultyValueDisplay.textContent = effectiveMaxDifficulty.toLocaleString();
            if(onJailView) enhanceJailListPage();
        } else {
            if (difficultySliderInput) difficultySliderInput.style.display = '';
            if (difficultyValueDisplay) difficultyValueDisplay.textContent = Math.round(effectiveMaxDifficulty).toLocaleString();
            if (difficultySliderInput) difficultySliderInput.value = logValueToSliderPosition(effectiveMaxDifficulty).toString();
        }
    }

    // --- Modal Functions (Busting Data) ---
    function createModal() {
        if (document.getElementById('busting-data-modal')) return;
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'busting-data-modal-overlay';
        modalOverlay.className = 'busting-modal-overlay';
        modalOverlay.addEventListener('click', closeModal);
        document.body.appendChild(modalOverlay);
        modal = document.createElement('div');
        modal.id = 'busting-data-modal';
        modal.className = 'busting-modal';
        const modalHeader = document.createElement('div');
        modalHeader.className = 'busting-modal-header';
        const closeButton = document.createElement('span');
        closeButton.className = 'busting-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = closeModal;
        const headerText = document.createElement('span');
        headerText.textContent = 'Busting Data';
        modalHeader.appendChild(headerText);
        modalHeader.appendChild(closeButton);
        modalContentElement = document.createElement('div');
        modalContentElement.className = 'busting-modal-content';
        modal.appendChild(modalHeader);
        modal.appendChild(modalContentElement);
        document.body.appendChild(modal);
    }
    async function openModal() {
        console.log(`[${SCRIPT_NAME}] openModal called.`);
        if (!modal) createModal();
        if (modalOverlay) modalOverlay.style.display = 'block';
        if (modal) modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        await loadAndDisplayBusts(false);
    }
    function closeModal() {
        if (modalOverlay) modalOverlay.style.display = 'none';
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (modalContentElement) modalContentElement.innerHTML = '';
    }

    // --- API Settings Modal Functions ---
    function createApiSettingsModal() {
        if (document.getElementById('api-settings-modal')) return;
        apiSettingsModalOverlay = document.createElement('div');
        apiSettingsModalOverlay.id = 'api-settings-modal-overlay';
        apiSettingsModalOverlay.className = 'api-settings-modal-overlay';
        apiSettingsModalOverlay.addEventListener('click', closeApiSettingsModal);
        document.body.appendChild(apiSettingsModalOverlay);

        apiSettingsModal = document.createElement('div');
        apiSettingsModal.id = 'api-settings-modal';
        apiSettingsModal.className = 'api-settings-modal';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'api-settings-modal-header';
        const closeButton = document.createElement('span');
        closeButton.className = 'api-settings-modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = closeApiSettingsModal;
        const headerText = document.createElement('span');
        headerText.textContent = 'Further Settings';
        modalHeader.appendChild(headerText);
        modalHeader.appendChild(closeButton);

        apiSettingsModalContentElement = document.createElement('div');
        apiSettingsModalContentElement.className = 'api-settings-modal-content';
        apiSettingsModal.appendChild(modalHeader);
        apiSettingsModal.appendChild(apiSettingsModalContentElement);
        document.body.appendChild(apiSettingsModal);
    }

    async function updateInfoBarAndList() {
        const onJailView = window.location.href.includes("jailview.php");
        if (onJailView && infoBarCollapsibleContent) {
            const currentPenalty = parseFloat(infoBarCollapsibleContent.querySelector('#current-penalty-value')?.textContent) || 0;
            const allTimeMaxPenalty = parseFloat(infoBarCollapsibleContent.querySelector('#all-time-max-penalty-value')?.textContent) || GM_getValue(ALL_TIME_MAX_PENALTY_STORAGE, 0);
            const bustsToMax = parseInt(infoBarCollapsibleContent.querySelector('#busts-to-max-value')?.textContent) || 0;
            const max72h = parseFloat(infoBarCollapsibleContent.querySelector('#max-penalty-value')?.textContent) || 0;
            await updateInfoBar(currentPenalty, max72h, bustsToMax, allTimeMaxPenalty);
        } else if (onJailView) {
            await loadAndDisplayBusts(true);
        }
        if (onJailView) {
            enhanceJailListPage();
        }
    }


    async function openApiSettingsModal() {
        if (!apiSettingsModal) createApiSettingsModal();
        if (apiSettingsModalOverlay) apiSettingsModalOverlay.style.display = 'block';
        if (apiSettingsModal) apiSettingsModal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        apiSettingsModalContentElement.innerHTML = '';

        // API Key Section
        const apiKeySection = document.createElement('div');
        apiKeySection.className = 'setting-item-box';
        const currentApiKey = getApiKey();
        const apiKeyDisplayId = 'api-key-value-display-in-settings';
        const apiKeyToggleId = 'toggle-api-key-visibility-button';

        if (!currentApiKey) {
            const promptContainer = document.createElement('div');
            promptContainer.className = 'api-key-input-area';
            promptContainer.innerHTML = `
                <p>API Key is not set. Please enter your Torn API key:</p>
                <p>(Requires access to "Public data" and "Log access")</p>
                <input type="text" id="further-settings-api-key-input" placeholder="16-character API Key" style="width: 70%; margin-right: 10px;">
                <button id="further-settings-save-api-key-button">Save Key</button>
                <p style="font-size:0.8em; margin-top:15px;">You can find your API key under <a href="https://www.torn.com/preferences.php#tab=api" target="_blank" style="color:#67b7e2;">Settings -> API Key</a>.</p>
            `;
            apiKeySection.appendChild(promptContainer);

            const saveButton = promptContainer.querySelector('#further-settings-save-api-key-button');
            const inputField = promptContainer.querySelector('#further-settings-api-key-input');

            saveButton.addEventListener('click', async () => {
                const newKey = inputField.value.trim();
                if (newKey.length === 16) {
                    saveApiKey(newKey);
                    await startApiUpdates();
                    openApiSettingsModal();
                } else {
                    alert("Invalid API Key. It must be 16 characters long.");
                }
            });
        } else {
            const displayContainer = document.createElement('div');
            displayContainer.className = 'api-key-display-container';

            const keyTextContainer = document.createElement('p');
            keyTextContainer.innerHTML = `Current API Key: <span id="${apiKeyDisplayId}" style="margin-right: 5px;">${'*'.repeat(16)}</span>`;

            const toggleButton = document.createElement('button');
            toggleButton.id = apiKeyToggleId;
            toggleButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
            toggleButton.className = 'reset-api-key-button';
            toggleButton.style.background = '#555 !important';
            toggleButton.style.minWidth = 'auto';
            toggleButton.style.padding = '0 5px';

            isApiKeyCurrentlyVisible = false;
            toggleButton.onclick = () => {
                isApiKeyCurrentlyVisible = !isApiKeyCurrentlyVisible;
                const keySpan = document.getElementById(apiKeyDisplayId);
                if (keySpan) {
                    keySpan.textContent = isApiKeyCurrentlyVisible ? currentApiKey : '*'.repeat(16);
                }
                toggleButton.innerHTML = isApiKeyCurrentlyVisible ?
                    `<svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75C20.27 7.61 16 4.5 12 4.5c-1.77 0-3.39.57-4.74 1.52l2.22 2.22C10.14 8.05 11.03 7.5 12 7.5zm-1.07 5.53L15.47 17c-1.26 1.51-2.89 2.7-4.75 3.44C7.61 21.27 4.5 17 4.5 12c0-1.77.57-3.39 1.52-4.74l2.22 2.22C8.05 10.14 7.5 11.03 7.5 12c0 .34.08.66.23.95L10.93 12.53zm12.28 8.71L1.39 4.22 2.81 2.81l20 20-1.42 1.42z"/></svg>`
                    : `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
            };

            keyTextContainer.appendChild(toggleButton);
            displayContainer.appendChild(keyTextContainer);

            const resetButton = document.createElement('button');
            resetButton.textContent = 'Reset';
            resetButton.className = 'reset-api-key-button';
            resetButton.onclick = () => {
                if (confirm("Are you sure you want to reset your API key?")) {
                    saveApiKey("");
                    startApiUpdates();
                    openApiSettingsModal();
                }
            };
            displayContainer.appendChild(resetButton);
            apiKeySection.appendChild(displayContainer);
        }
        apiSettingsModalContentElement.appendChild(apiKeySection);

        // Alert Settings Section
        const alertSettingsSection = document.createElement('div');
        alertSettingsSection.className = 'setting-item-box';
        alertSettingsSection.style.marginTop = "10px";

        const alertSettingContainer = document.createElement('div');
        alertSettingContainer.className = 'alert-setting-item-modal';

        const alertCheckbox = document.createElement('input');
        alertCheckbox.type = 'checkbox';
        alertCheckbox.id = 'bust-alert-checkbox-modal';
        alertCheckbox.checked = GM_getValue(ALERT_ENABLED_STORAGE, false);

        const alertLabel = document.createElement('label');
        alertLabel.htmlFor = 'bust-alert-checkbox-modal';
        alertLabel.textContent = 'Alert at ';

        const alertSelect = document.createElement('select');
        alertSelect.id = 'bust-alert-dropdown-modal';
        for (let i = 1; i <= 5; i++) {
            const option = document.createElement('option');
            option.value = i; option.textContent = i;
            alertSelect.appendChild(option);
        }
        alertSelect.value = GM_getValue(ALERT_DROPDOWN_STORAGE, 1);

        const alertLabelEnd = document.createElement('span');
        alertLabelEnd.textContent = ' bust possible';

        alertSettingContainer.appendChild(alertCheckbox);
        alertSettingContainer.appendChild(alertLabel);
        alertSettingContainer.appendChild(alertSelect);
        alertSettingContainer.appendChild(alertLabelEnd);
        alertSettingsSection.appendChild(alertSettingContainer);
        apiSettingsModalContentElement.appendChild(alertSettingsSection);


        // Dynamic Difficulty Filter Section
        const dynamicDifficultySection = document.createElement('div');
        dynamicDifficultySection.className = 'setting-item-box';
        dynamicDifficultySection.style.marginTop = "10px";

        const dynamicSettingContainer = document.createElement('div');
        dynamicSettingContainer.className = 'dynamic-difficulty-setting';

        const dynamicCheckbox = document.createElement('input');
        dynamicCheckbox.type = 'checkbox';
        dynamicCheckbox.id = 'dynamic-difficulty-filter-checkbox';
        dynamicCheckbox.checked = GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false);

        const dynamicLabel = document.createElement('label');
        dynamicLabel.htmlFor = 'dynamic-difficulty-filter-checkbox';
        dynamicLabel.textContent = 'Dynamic Difficulty Filter';

        dynamicSettingContainer.appendChild(dynamicCheckbox);
        dynamicSettingContainer.appendChild(dynamicLabel);
        dynamicDifficultySection.appendChild(dynamicSettingContainer);

        // Container for "Set Custom Max Difficulty At Zero Penalty" and its input field
        const customZeroPenaltyOuterContainer = document.createElement('div');
        customZeroPenaltyOuterContainer.className = 'setting-subsection'; // For indentation

        const customZeroPenaltyLine = document.createElement('div'); // This will be the flex row
        customZeroPenaltyLine.className = 'dynamic-difficulty-setting';
        customZeroPenaltyLine.style.marginTop = '8px';


        const customZeroPenaltyCheckbox = document.createElement('input');
        customZeroPenaltyCheckbox.type = 'checkbox';
        customZeroPenaltyCheckbox.id = 'dynamic-difficulty-custom-zero-penalty-checkbox';
        customZeroPenaltyCheckbox.checked = GM_getValue(DYNAMIC_DIFFICULTY_USE_CUSTOM_ZERO_PENALTY_STORAGE, false);

        const customZeroPenaltyLabel = document.createElement('label');
        customZeroPenaltyLabel.htmlFor = 'dynamic-difficulty-custom-zero-penalty-checkbox';
        customZeroPenaltyLabel.id = 'dynamic-difficulty-custom-label'; // Added ID for styling when disabled
        customZeroPenaltyLabel.textContent = 'Set Custom Max Difficulty At Zero Penalty:';

        const zeroPenaltyInput = document.createElement('input');
        zeroPenaltyInput.type = 'number';
        zeroPenaltyInput.id = 'dynamic-difficulty-zero-penalty-input';
        zeroPenaltyInput.value = GM_getValue(DYNAMIC_DIFFICULTY_ZERO_PENALTY_STORAGE, 60000);
        zeroPenaltyInput.min = DYNAMIC_DIFFICULTY_FLOOR.toString();
        zeroPenaltyInput.step = "100";

        customZeroPenaltyLine.appendChild(customZeroPenaltyCheckbox);
        customZeroPenaltyLine.appendChild(customZeroPenaltyLabel);
        customZeroPenaltyLine.appendChild(zeroPenaltyInput); // Input field directly after the label
        customZeroPenaltyOuterContainer.appendChild(customZeroPenaltyLine);
        dynamicDifficultySection.appendChild(customZeroPenaltyOuterContainer);
        apiSettingsModalContentElement.appendChild(dynamicDifficultySection);

        // Initial state for the custom zero penalty input
        const toggleCustomZeroPenaltyInput = (enabled) => {
            zeroPenaltyInput.disabled = !enabled;
            const labelElement = document.getElementById('dynamic-difficulty-custom-label'); // Get the label
            if (enabled) {
                if(labelElement) labelElement.classList.remove('text-input-disabled');
                zeroPenaltyInput.classList.remove('text-input-disabled');
            } else {
                if(labelElement) labelElement.classList.add('text-input-disabled');
                zeroPenaltyInput.classList.add('text-input-disabled');
            }
        };
        toggleCustomZeroPenaltyInput(customZeroPenaltyCheckbox.checked);


        // API Update Interval Section
        const apiIntervalSection = document.createElement('div');
        apiIntervalSection.className = 'setting-item-box';
        apiIntervalSection.style.marginTop = "10px";

        const apiIntervalContainer = document.createElement('div');
        apiIntervalContainer.className = 'api-interval-setting';

        const apiIntervalLabel = document.createElement('label');
        apiIntervalLabel.htmlFor = 'api-update-interval-dropdown';
        apiIntervalLabel.textContent = 'API update intervall:';

        const apiIntervalDropdown = document.createElement('select');
        apiIntervalDropdown.id = 'api-update-interval-dropdown';
        const intervalOptions = [30, 45, 60, 90, 120, 300, 600];
        intervalOptions.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            apiIntervalDropdown.appendChild(option);
        });
        apiIntervalDropdown.value = GM_getValue(API_UPDATE_INTERVAL_STORAGE, 60000) / 1000;

        const apiIntervalSuffix = document.createElement('span');
        apiIntervalSuffix.textContent = 'seconds';

        apiIntervalContainer.appendChild(apiIntervalLabel);
        apiIntervalContainer.appendChild(apiIntervalDropdown);
        apiIntervalContainer.appendChild(apiIntervalSuffix);
        apiIntervalSection.appendChild(apiIntervalContainer);
        apiSettingsModalContentElement.appendChild(apiIntervalSection);

        // Event Listeners for new settings in modal
        alertCheckbox.addEventListener('change', () => {
            GM_setValue(ALERT_ENABLED_STORAGE, alertCheckbox.checked);
            const currentBustsToMax = parseInt(document.getElementById('busts-to-max-value')?.textContent || '0', 10);
            checkAndShowNotification(currentBustsToMax);
        });
        alertSelect.addEventListener('change', () => {
            GM_setValue(ALERT_DROPDOWN_STORAGE, parseInt(alertSelect.value, 10));
            const currentBustsToMax = parseInt(document.getElementById('busts-to-max-value')?.textContent || '0', 10);
            checkAndShowNotification(currentBustsToMax);
        });

        dynamicCheckbox.addEventListener('change', async () => {
            GM_setValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, dynamicCheckbox.checked);
            await updateInfoBarAndList();
            createInfoBar();
        });

        customZeroPenaltyCheckbox.addEventListener('change', async () => {
            const isChecked = customZeroPenaltyCheckbox.checked;
            GM_setValue(DYNAMIC_DIFFICULTY_USE_CUSTOM_ZERO_PENALTY_STORAGE, isChecked);
            toggleCustomZeroPenaltyInput(isChecked);
            if (GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false)) {
                 await updateInfoBarAndList();
            }
        });


        zeroPenaltyInput.addEventListener('input', () => {
            clearTimeout(dynamicDifficultyZeroPenaltyDebounceTimer);
            dynamicDifficultyZeroPenaltyDebounceTimer = setTimeout(async () => {
                let val = parseInt(zeroPenaltyInput.value, 10);
                if (isNaN(val) || val < DYNAMIC_DIFFICULTY_FLOOR) val = DYNAMIC_DIFFICULTY_FLOOR;
                if (val > LOG_ACTUAL_MAX) val = LOG_ACTUAL_MAX;
                zeroPenaltyInput.value = val;
                GM_setValue(DYNAMIC_DIFFICULTY_ZERO_PENALTY_STORAGE, val);
                if (GM_getValue(DYNAMIC_DIFFICULTY_ENABLED_STORAGE, false) && GM_getValue(DYNAMIC_DIFFICULTY_USE_CUSTOM_ZERO_PENALTY_STORAGE, false)) {
                    await updateInfoBarAndList();
                }
            }, 350);
        });

        apiIntervalDropdown.addEventListener('change', () => {
            const newIntervalSeconds = parseInt(apiIntervalDropdown.value, 10);
            const newIntervalMs = newIntervalSeconds * 1000;
            GM_setValue(API_UPDATE_INTERVAL_STORAGE, newIntervalMs);

            if (apiDataUpdateIntervalId) {
                clearInterval(apiDataUpdateIntervalId);
            }
            const apiKey = getApiKey();
            if (apiKey) {
                apiDataUpdateIntervalId = setInterval(() => {
                    console.log(`[${SCRIPT_NAME}] setInterval (new interval: ${newIntervalSeconds}s): Calling loadAndDisplayBusts(true) for info bar/modal.`);
                    loadAndDisplayBusts(true).catch(error => {
                        console.error(`[${SCRIPT_NAME}] Error in scheduled loadAndDisplayBusts(true) from setInterval:`, error);
                        updateInfoBar("Error", "Error", "Error", GM_getValue(ALL_TIME_MAX_PENALTY_STORAGE, 'Error'));
                    });
                }, newIntervalMs);
            }
             console.log(`[${SCRIPT_NAME}] API update interval changed to ${newIntervalSeconds} seconds.`);
        });


        const futureSettingsPlaceholder = document.createElement('p');
        futureSettingsPlaceholder.textContent = 'Future settings will appear here.';
        futureSettingsPlaceholder.style.marginTop = '15px';
        futureSettingsPlaceholder.style.fontSize = '0.9em';
        apiSettingsModalContentElement.appendChild(futureSettingsPlaceholder);
    }

    function closeApiSettingsModal() {
        if (apiSettingsModalOverlay) apiSettingsModalOverlay.style.display = 'none';
        if (apiSettingsModal) apiSettingsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (apiSettingsModalContentElement) apiSettingsModalContentElement.innerHTML = '';
    }


    // --- Jail List Text Modification & Sorting Functions ---
    function enhanceJailListPage() {
        const userListTitle = document.querySelector('.userlist-wrapper .users-list-title');
        const userListContainer = document.querySelector('ul.user-info-list-wrap.users-list');

        if (!userListTitle || !userListContainer) {
            console.warn(`[${SCRIPT_NAME}] Jail list title or container not found for enhancement.`);
            return;
        }
        userListContainer.style.pointerEvents = 'none';

        const reasonHeader = userListTitle.querySelector('.reason.title-divider');
        if (reasonHeader && reasonHeader.textContent.trim() !== 'Difficulty') {
            reasonHeader.textContent = 'Difficulty';
        }

        const maxDifficultyFromSlider = GM_getValue(MAX_DIFFICULTY_SLIDER_STORAGE, LOG_ACTUAL_MAX);
        const playersData = [];
        const playerRows = userListContainer.querySelectorAll(':scope > li');

        playerRows.forEach(row => {
            if (!row.querySelector('span.info-wrap')) {
                 if (!row.classList.contains('tt-hidden')) { row.style.display = '';} else {row.style.display = 'none';}
                return;
            }
            if (!row.classList.contains('tt-hidden')) {
                 row.style.display = '';
            } else {
                 row.style.display = 'none';
            }

            const levelEl = row.querySelector('.info-wrap .level');
            const timeEl = row.querySelector('.info-wrap .time');
            const reasonEl = row.querySelector('.info-wrap .reason');

            let difficulty = 0;

            if (levelEl && timeEl && reasonEl && levelEl.textContent && timeEl.textContent) {
                const levelText = levelEl.textContent.match(/\d+/);
                const levelVal = levelText ? parseInt(levelText[0], 10) : 0;
                const timeInMinutes = parseJailTime(timeEl.textContent);
                difficulty = levelVal * (timeInMinutes + 180);

                reasonEl.innerHTML = '';
                reasonEl.appendChild(document.createTextNode(difficulty));
            } else if (reasonEl) {
                reasonEl.innerHTML = '';
            }

            if (row.classList.contains('tt-hidden') || (difficulty > 0 && difficulty > maxDifficultyFromSlider) ) {
                row.style.display = 'none';
            }
            playersData.push({ element: row, difficulty: difficulty });
        });

        playersData.sort((a, b) => a.difficulty - b.difficulty);

        let visibleRows = 0;
        playersData.forEach(pData => {
            userListContainer.appendChild(pData.element);
            if (pData.element.style.display !== 'none') {
                visibleRows++;
            }
        });

        const existingRefreshButtonContainer = document.getElementById('ba-refresh-button-wrapper');
        if (existingRefreshButtonContainer) {
            existingRefreshButtonContainer.remove();
        }

        if (visibleRows === 0 && Array.from(playerRows).filter(r => r.querySelector('span.info-wrap')).length > 0) {
            const refreshButtonWrapper = document.createElement('div');
            refreshButtonWrapper.id = 'ba-refresh-button-wrapper';
            refreshButtonWrapper.className = 'ba-refresh-wrapper-style';

            const refreshButton = document.createElement('button');
            refreshButton.textContent = 'Refresh Page';
            refreshButton.className = 'refresh-list-button';
            refreshButton.onclick = () => location.reload();

            refreshButtonWrapper.appendChild(refreshButton);

            if (userListTitle && userListTitle.parentNode) {
                userListTitle.parentNode.insertBefore(refreshButtonWrapper, userListContainer);
            }
        }

        const ttFilter = document.getElementById('jailFilter');
        if (ttFilter && visibleRows === 0 && Array.from(playerRows).filter(r => r.querySelector('span.info-wrap')).length > 0) {
            ttFilter.style.display = '';
        }

        userListContainer.style.pointerEvents = '';
    }

    // --- Click Listener for Jail List Updates ---
    let lastClickTime = 0;
    function handleDocumentClick(event) {
        const now = Date.now();
        if (now - lastClickTime < 300) {
            return;
        }
        lastClickTime = now;

        const target = event.target;
        if (target.closest('.pagination-wrap a') ||
            target.closest('#jailFilter input') ||
            target.closest('#jailFilter select') ||
            target.closest('.tt-quick-refresh') ||
            target.closest('.remove-filter.right')
           ) {
            clearTimeout(jailListDebounceTimer);
            jailListDebounceTimer = setTimeout(() => {
                console.log(`[${SCRIPT_NAME}] Jail list potentially changed by user action, re-enhancing list.`);
                enhanceJailListPage();
            }, 750);
        }
    }


    // --- Initialization ---
    function init() {
        console.log(`[${SCRIPT_NAME}] Initializing...`);
        const onJailView = window.location.href.includes("jailview.php");

        addCustomStyles();
        createApiSettingsModal();

        if (onJailView) {
            createModal();
            createInfoBar();

            const targetNode = document.querySelector('#mainContainer');
            if (targetNode) {
                initialListObserver = new MutationObserver((mutationsList, observer) => {
                    const jailList = document.querySelector('ul.user-info-list-wrap.users-list');
                    if (jailList && jailList.querySelector('li span.info-wrap')) {
                        console.log(`[${SCRIPT_NAME}] Jail list detected by observer, enhancing.`);
                        observer.disconnect();
                        enhanceJailListPage();
                        document.addEventListener('click', handleDocumentClick, true);
                        console.log(`[${SCRIPT_NAME}] Click listener for jail list updates activated.`);
                        startApiUpdates();
                    }
                });
                initialListObserver.observe(targetNode, { childList: true, subtree: true });
            } else {
                console.warn(`[${SCRIPT_NAME}] Target node for observer not found on jailview. Using setTimeout fallback.`);
                setTimeout(() => {
                    enhanceJailListPage();
                    document.addEventListener('click', handleDocumentClick, true);
                    startApiUpdates();
                }, 500);
            }
        } else {
            console.log(`[${SCRIPT_NAME}] Not on jailview.php. Setting up API updates for notifications only.`);
            startApiUpdates();
        }
        console.log(`[${SCRIPT_NAME}] Initialization setup complete.`);
    }

    async function startApiUpdates() {
        await loadAndDisplayBusts(true);
        const apiKey = getApiKey();
        if (apiKey) {
            if (apiDataUpdateIntervalId) {
                clearInterval(apiDataUpdateIntervalId);
            }
            const updateIntervalMs = GM_getValue(API_UPDATE_INTERVAL_STORAGE, 60000);
            console.log(`[${SCRIPT_NAME}] Setting API update interval to ${updateIntervalMs / 1000} seconds.`);
            apiDataUpdateIntervalId = setInterval(() => {
                console.log(`[${SCRIPT_NAME}] setInterval: Calling loadAndDisplayBusts(true).`);
                loadAndDisplayBusts(true).catch(error => {
                    console.error(`[${SCRIPT_NAME}] Error in scheduled loadAndDisplayBusts(true) from setInterval:`, error);
                     if (window.location.href.includes("jailview.php")) {
                        updateInfoBar("Error", "Error", "Error", GM_getValue(ALL_TIME_MAX_PENALTY_STORAGE, 'Error'));
                    }
                });
            }, updateIntervalMs);
        }
    }


    // --- Script Entry Point ---
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
        window.addEventListener('load', () => {
            const onJailView = window.location.href.includes("jailview.php");
            if (onJailView && !document.getElementById('busting-info-bar-container')) {
                 if (!infoBarElement) init();
            } else if (!onJailView && !apiDataUpdateIntervalId) {
                if (!document.getElementById('api-settings-modal')) {
                   init();
                }
            }
        });
    }

})();
