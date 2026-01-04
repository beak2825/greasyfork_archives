// ==UserScript==
// @name         DSS: Torn Faction Family Buttons (TESTING)
// @namespace    Dsuttz Scripts
// @version      1.47
// @description  Control Panel for Torn Faction Buttons
// @author       You
// @match        https://www.torn.com/factions.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/544439/DSS%3A%20Torn%20Faction%20Family%20Buttons%20%28TESTING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544439/DSS%3A%20Torn%20Faction%20Family%20Buttons%20%28TESTING%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCRIPT_ID = 'TORN_FACTION_FAMILY_BUTTONS_SINGLETON';

    if (checkCloudFlare()) return;

    // Force cleanup on page refresh/reload
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        console.log('[Family Buttons Widget] Page was manually refreshed, forcing cleanup');
        if (window[SCRIPT_ID]) {
            delete window[SCRIPT_ID];
        }
        if (window.tornFactionWidget) {
            try {
                window.tornFactionWidget.cleanup();
            } catch (e) {
                console.warn('Cleanup error:', e);
            }
            delete window.tornFactionWidget;
        }
    }

    if (window[SCRIPT_ID]) {
        console.log('[Family Buttons Widget] Script already running, aborting duplicate instance');
        return;
    }

    window[SCRIPT_ID] = true;

    console.log('[Family Buttons Widget] Script instance claimed, proceeding with initialization');
    console.log('[Family Buttons Widget] Script starting...');


    const CONFIG = {
        API_BASE_URL: 'https://api.torn.com/v2'
    };

    const CONSTANTS = {
        SELECTORS: {
            SKIP_TO_CONTENT: '#skip-to-content',
            CONTENT_WRAPPER: '.content-wrapper',
            API_KEY_INPUT: '#api-key-input',
            FACTION_ID_INPUT: '#faction-id-input',
            FAMILIES_SEARCH: '#families-search-input',
            ASSOCIATES_SEARCH: '#associates-search-input',
            SETTINGS_PANEL: '.settings-panel',
            FACTION_NAME_INPUT: '.faction-name-input',
            FACTION_TYPE_SELECT: '.faction-type-select',
            DELETE_FACTION: '.delete-faction'
        },
        TIMING: {
            DEBOUNCE_SEARCH: 300,
            DEBOUNCE_SAVE: 300,
            DEBOUNCE_CHANGES: 100,
            AUTO_HIDE_ERROR: 5000,
            AUTO_HIDE_NO_RESULTS: 3000
        },
        LIMITS: {
            MIN_SEARCH_LENGTH: 2,
            SEARCH_RESULTS_LIMIT: 10,
            MAX_BUTTONS_PER_ROW: 10
        }
    };

    const styles = `
     .torn-faction-search-widget {
        position: absolute;
       right: 15px;
       top: 15px;
       background: transparent !important;
       border: none !important;
       box-shadow: none !important;
       padding: 0 !important;
       margin: 0 !important;
       z-index: 1000;
       width: 220px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .torn-faction-search-widget form {
        display: flex;
        align-items: center;
        gap: 4px;
        width: 100%;
        position: relative;
    }

    .torn-faction-search-widget .toggle-search {
        background: linear-gradient(135deg, #6a6a6a 0%, #4a4a4a 100%)
        border: 1px solid #777;
        border-radius: 50%;
        padding: 0;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        color: #ccc;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 1);
        overflow: hidden;
        position: relative;
    }

    .torn-faction-search-widget .toggle-search::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    }

    .torn-faction-search-widget .toggle-search:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        color: white;
        border-color: #666;
    }

    .torn-faction-search-widget .toggle-search:hover::before {
        opacity: 1;
    }

    .torn-faction-search-widget .toggle-search:active {
        transform: translateY(0);
    }

    .torn-faction-search-widget .settings-panel {
        position: absolute;
        top: 36px;
        left: 0px;
        background: linear-gradient(145deg, #4a4a4a 0%, #3a3a3a 100%);
        border: 1px solid #555;
        border-radius: 8px;
        z-index: 1001;
        width: 300px;
        height: 420px;
        box-sizing: border-box;
        padding: 0;
        transform: scale(0.8) translateY(-20px);
        transform-origin: top left;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        pointer-events: none;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .torn-faction-search-widget .settings-panel.show {
        transform: scale(1) translateY(0);
        opacity: 1;
        pointer-events: auto;
    }

    .torn-faction-search-widget .settings-tabs {
        display: flex;
        border-bottom: 1px solid #444;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
        width: 100%;
        background: #444;
        height: 50px;
    }

    .torn-faction-search-widget .settings-tab {
        flex: 1;
        background: #444;
        border: none;
        border-right: 1px solid #555;
        padding: 12px 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        font-size: 14px;
        margin: 0;
    }

    .torn-faction-search-widget .settings-tab:last-child {
        border-right: none;
    }

    .torn-faction-search-widget .settings-tab svg {
        width: 20px;
        height: 20px;
    }

    .torn-faction-search-widget .settings-tab::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #4a90e2, #357abd);
        transform: scaleX(0);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .torn-faction-search-widget .settings-tab:hover {
        color: #ccc;
        background: #555;
    }

    .torn-faction-search-widget .settings-tab.active {
        color: white;
        background: #555;
    }

    .torn-faction-search-widget .settings-tab.active::after {
        transform: scaleX(1);
    }

    .torn-faction-search-widget .settings-tab.no-api {
        color: #e74c3c;
    }

    .torn-faction-search-widget .settings-tab.valid-api {
        color: #27ae60;
    }

    .torn-faction-search-widget .settings-tab.hidden {
        display: none;
    }

    .torn-faction-search-widget .settings-content {
        padding: 16px;
        height: calc(420px - 50px - 40px);
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: #555 transparent;
        contain: layout style;
    }

    .torn-faction-search-widget .settings-content::-webkit-scrollbar {
        width: 6px;
    }

    .torn-faction-search-widget .settings-content::-webkit-scrollbar-track {
        background: transparent;
    }

    .torn-faction-search-widget .settings-content::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 3px;
    }

    .torn-faction-search-widget .settings-content::-webkit-scrollbar-thumb:hover {
        background: #666;
    }

    .torn-faction-search-widget .settings-field {
        margin-bottom: 12px;
        position: relative;
        overflow: hidden;
    }

    .torn-faction-search-widget .settings-field.inline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    .torn-faction-search-widget .settings-field.inline label {
        margin-bottom: 0;
        flex: 1;
        font-weight: 500;
    }

    .torn-faction-search-widget .settings-field.inline select {
        flex: 0 0 60px;
        width: 60px;
    }

    .torn-faction-search-widget .settings-field.inline input[type="checkbox"] {
        flex: 0 0 auto;
        cursor: pointer !important;
    }

    .torn-faction-search-widget .settings-field input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #4a90e2;
        cursor: pointer !important;
    }

    .torn-faction-search-widget .settings-info {
        margin-bottom: 16px;
        padding: 12px;
        background: linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(53, 122, 189, 0.1) 100%);
        border-radius: 6px;
        border: 1px solid rgba(74, 144, 226, 0.2);
        position: relative;
        overflow: hidden;
    }

    .torn-faction-search-widget .settings-info::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #4a90e2, #357abd);
    }

    .torn-faction-search-widget .settings-info p {
        margin: 0 0 8px 0;
        color: #ccc;
        font-size: 12px;
        line-height: 1.5;
    }

    .torn-faction-search-widget .settings-info p:last-child {
        margin-bottom: 0;
    }

    .torn-faction-search-widget .settings-info .disclaimer {
        color: #e74c3c;
        font-weight: bold;
    }

    /* Touch device specific styles */
    .torn-faction-search-widget.touch-device .drag-handle::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(74, 144, 226, 0.1);
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .torn-faction-search-widget.touch-device .drag-handle:active::after {
        opacity: 1;
    }

    .torn-faction-search-widget .settings-header {
        margin-bottom: 16px;
        border-bottom: 1px solid #444;
        padding: 10px 12px;
        margin: -16px -16px 16px -16px;
        background: linear-gradient(135deg, #333 0%, #2a2a2a 100%);
    }

    .torn-faction-search-widget .settings-header h3 {
        margin: 0;
        color: white;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
    }

    .torn-faction-search-widget .settings-footer {
        margin-top: 16px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        border: 1px solid #333;
    }

    .torn-faction-search-widget .settings-footer p {
        margin: 0 0 4px 0;
        color: #aaa;
        font-size: 10px;
        line-height: 1.3;
    }

    .torn-faction-search-widget .settings-footer p:last-child {
        margin-bottom: 0;
    }

    .torn-faction-search-widget .settings-footer a {
        color: #4a90e2;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .torn-faction-search-widget .settings-footer a:hover {
        color: #357abd;
    }

    .torn-faction-search-widget .settings-field.search-field {
        overflow: visible;
        margin-top: 16px;
    }

    .torn-faction-search-widget .settings-field label {
        display: block;
        color: #ddd;
        font-size: 11px;
        margin-bottom: 6px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .torn-faction-search-widget .settings-field input,
    .torn-faction-search-widget .settings-field select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #444;
        border-radius: 4px;
        background: #1a1a1a;
        color: white;
        font-size: 11px;
        outline: none;
        box-sizing: border-box;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .torn-faction-search-widget .settings-field input:read-only {
        background: #222;
        color: #888;
        cursor: not-allowed;
    }

    .torn-faction-search-widget .settings-field input:focus,
    .torn-faction-search-widget .settings-field select:focus {
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        background: #222;
    }

    .torn-faction-search-widget .search-input {
        width: 100%;
        height: auto;
        padding: 8px 12px;
        border: 1px solid #444;
        border-radius: 4px;
        background: #1a1a1a;
        color: white;
        font-size: 11px;
        outline: none;
        box-sizing: border-box;
        margin-bottom: 8px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .torn-faction-search-widget .search-input::placeholder {
        color: #666;
    }

    .torn-faction-search-widget .search-input:focus {
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        background: #222;
    }

    .torn-faction-search-widget .dropdown-suggestions {
        background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%) !important;
        border: 1px solid #444 !important;
        border-radius: 4px;
        max-height: 180px;
        overflow-y: auto;
        display: none;
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        right: 0 !important;
        width: auto !important;
        z-index: 10000 !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        margin-top: 4px;
    }

    .torn-faction-search-widget .dropdown-suggestions.show {
        display: block !important;
        visibility: visible !important;
    }

    .torn-faction-search-widget .suggestion-item {
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #333;
        color: white;
        font-size: 11px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s ease;
    }

    .torn-faction-search-widget .suggestion-item:hover,
    .torn-faction-search-widget .suggestion-item.selected {
        background: rgba(74, 144, 226, 0.2);
        border-left: 3px solid #4a90e2;
        padding-left: 9px;
    }

    .torn-faction-search-widget .suggestion-item:last-child {
        border-bottom: none;
    }

    .torn-faction-search-widget .suggestion-faction-name {
        font-weight: 500;
    }

    .torn-faction-search-widget .suggestion-faction-id {
        color: #888;
        font-size: 11px;
    }

    .torn-faction-search-widget .faction-table {
        border: 1px solid #444;
        border-radius: 6px;
        overflow: hidden;
        background: #1a1a1a;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        min-height: 200px; /* Add this line to ensure minimum space */
    }

    .torn-faction-search-widget .faction-table-header {
        background: linear-gradient(135deg, #555 0%, #444 100%);
        display: flex;
        padding: 8px 12px;
        font-size: 11px;
        font-weight: 600;
        color: white;
        border-bottom: 1px solid #444;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .torn-faction-search-widget .settings-separator {
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, #555 20%, #555 80%, transparent 100%);
        margin: 12px 0;
        border: none;
    }

    .torn-faction-search-widget .faction-table-header > div:first-child {
        flex: 2;
        padding-right: 8px;
    }

    .torn-faction-search-widget .faction-table-header > div:last-child {
        width: 32px;
        flex-shrink: 0;
    }

    .torn-faction-search-widget .faction-table-row {
        display: flex;
        padding: 8px 12px;
        font-size: 11px;
        color: white;
        border-bottom: 1px solid #333;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: grab;
        position: relative;
        transform: translateY(0);
        contain: layout;
    }

    .torn-faction-search-widget .faction-table-row:last-child {
        border-bottom: none;
    }

    .torn-faction-search-widget .faction-table-row:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateX(2px);
    }

    .torn-faction-search-widget .faction-table-row.dragging {
        display: none;
    }

    .torn-faction-search-widget .drag-ghost {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        background: linear-gradient(145deg, #4a4a4a 0%, #3a3a3a 100%);
        border: 1px solid #4a90e2;
        border-radius: 4px;
        padding: 8px 12px;
        color: white;
        font-size: 11px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        opacity: 0.95;
        transform: scale(1.02);
        transition: none;
        min-width: 250px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .torn-faction-search-widget .faction-table-row.drag-shift-up {
        transform: translateY(-42px);
    }

    .torn-faction-search-widget .faction-table-row.drag-shift-down {
        transform: translateY(42px);
    }

    .torn-faction-search-widget .faction-table-row.drag-over {
        border-top: 2px solid #4a90e2;
    }

    .torn-faction-search-widget .faction-table-row.drag-over-bottom {
        border-bottom: 2px solid #4a90e2;
    }

    .torn-faction-search-widget .drag-handle {
        padding: 8px;
        margin: -8px -8px -8px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin-right: 8px;
        color: #666;
        cursor: grab;
        transition: color 0.2s ease;
        flex-shrink: 0;
    }

    .torn-faction-search-widget.low-performance-mode * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
    }

    .torn-faction-search-widget .drag-handle:hover {
        color: #4a90e2;
    }

    .torn-faction-search-widget .drag-handle:active {
        cursor: grabbing;
    }

    .torn-faction-search-widget .faction-name {
        flex: 2;
        text-align: left;
        margin-right: 8px;
        font-weight: 500;
    }

    .torn-faction-search-widget .faction-name-input {
        flex: 2;
        margin-right: 8px;
        padding: 3px 6px;
        border: 1px solid #444;
        border-radius: 3px;
        background: #222;
        color: white;
        font-size: 10px;
        outline: none;
    }

    .torn-faction-search-widget .faction-type-select {
        width: 45px;
        flex-shrink: 0;
        margin-right: 8px;
        padding: 3px 4px;
        border: 1px solid #444;
        border-radius: 3px;
        background: #222;
        color: white;
        font-size: 12px;
        outline: none;
        text-align: center;
        cursor: pointer;
    }

    .torn-faction-search-widget .icon-legend {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid #444;
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 12px;
        font-size: 10px;
        color: #ccc;
        text-align: center;
    }

    .torn-faction-search-widget .icon-legend-items {
        display: flex;
        gap: 20px;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

    .torn-faction-search-widget .icon-legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-direction: column;
        text-align: center;
    }

    .torn-faction-search-widget .icon-legend-icon {
        font-size: 14px;
        margin-bottom: 2px;
    }

    .torn-faction-search-widget .no-results-popup {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 11px;
        text-align: center;
        z-index: 10001;
        margin-top: 4px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }

    .torn-faction-search-widget .no-results-popup.show {
        opacity: 1;
        transform: translateY(0);
    }

    .torn-faction-search-widget .no-results-popup::before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-bottom-color: #e74c3c;
    }

    .torn-faction-search-widget .faction-type-select:focus {
        border-color: #4a90e2;
        box-shadow: 0 0 0 1px rgba(74, 144, 226, 0.2);
    }

    .torn-faction-search-widget .faction-type-select option {
        background: #222;
        color: white;
    }

    .torn-faction-search-widget .faction-type-custom {
        width: 45px;
        flex-shrink: 0;
        margin-right: 8px;
        position: relative;
    }

    .torn-faction-search-widget .faction-type-display {
        padding: 3px 4px;
        border: 1px solid #444;
        border-radius: 3px;
        background: #222;
        color: white;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        min-height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .torn-faction-search-widget .faction-type-display:hover {
        border-color: #555;
        background: #2a2a2a;
    }

    .torn-faction-search-widget .faction-type-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #2a2a2a;
        border: 1px solid #555;
        border-radius: 3px;
        z-index: 10002;
        display: none;
        margin-top: 1px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        min-width: 45px;
    }

    .torn-faction-search-widget .faction-type-dropdown.show {
        display: block !important;
        visibility: visible !important;
    }

    .torn-faction-search-widget .faction-type-option {
        padding: 6px 8px;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        border-bottom: 1px solid #444;
        transition: background 0.2s ease;
        position: relative;
        color: white;
        display: block;
        width: 100%;
        box-sizing: border-box;
    }

    .torn-faction-search-widget .faction-type-option:last-child {
        border-bottom: none;
        border-radius: 0 0 3px 3px;
    }

    .torn-faction-search-widget .faction-type-option:first-child {
        border-radius: 3px 3px 0 0;
    }

    .torn-faction-search-widget .faction-type-option:hover {
        background: #3a3a3a;
    }

    .torn-faction-search-widget .faction-type-option.selected {
        background: #4a90e2;
    }

    .torn-faction-search-widget .faction-type-tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        z-index: 10003;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .torn-faction-search-widget .faction-type-tooltip.show {
        opacity: 1;
    }

    .torn-faction-search-widget .faction-type-tooltip::before {
        content: '';
        position: absolute;
        top: 50%;
        right: 100%;
        transform: translateY(-50%);
        border: 5px solid transparent;
        border-right-color: rgba(0, 0, 0, 0.9);
    }

    .torn-faction-search-widget .delete-faction {
        background: none;
        border: none;
        color: #e74c3c !important;
        cursor: pointer;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        border-radius: 3px;
        transition: all 0.2s ease;
    }

    .torn-faction-search-widget .delete-faction svg {
        width: 12px;
        height: 12px;
        fill: #e74c3c !important;
        color: #e74c3c !important;
    }

    .torn-faction-search-widget .delete-faction:hover {
        color: #c0392b !important;
        background: rgba(231, 76, 60, 0.1);
        transform: scale(1.1);
    }

    .torn-faction-search-widget .delete-faction:hover svg {
        fill: #c0392b !important;
        color: #c0392b !important;
    }

    .torn-faction-search-widget .settings-actions {
        display: flex;
        gap: 10px;
        padding: 12px 30px;
        border-top: 1px solid #444;
        background: #222;
        position: sticky;
        bottom: 0;
        border-radius: 0 0 8px 8px;
        justify-content: center;
        height: 40px;
        box-sizing: border-box;
    }

    .torn-faction-search-widget button {
        margin: 0 !important;
    }

    .torn-faction-search-widget .settings-actions button {
        flex: 1;
        padding: 8px 14px;
        border: 1px solid #444;
        border-radius: 4px;
        background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
        color: white;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin: 0 !important;
    }

    .torn-faction-search-widget .settings-actions button:hover {
        background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .torn-faction-search-widget .settings-actions .save-settings {
        background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
        border-color: transparent;
    }

    .torn-faction-search-widget .settings-actions .save-settings:hover {
        background: linear-gradient(135deg, #357abd 0%, #2968a3 100%);
        box-shadow: 0 2px 12px rgba(74, 144, 226, 0.3);
    }

    .torn-faction-search-widget .settings-actions .reset-btn {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        border-color: transparent;
        position: relative;
    }

    .torn-faction-search-widget .settings-actions .reset-btn:hover {
        background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
        box-shadow: 0 2px 12px rgba(231, 76, 60, 0.3);
    }

    .torn-faction-search-widget .reset-confirmation {
        position: absolute;
        bottom: 100%;
        left: 0;
        right: 0;
        background: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 100%);
        border: 1px solid #555;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 8px;
        transform: translateY(20px) scale(0.9);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1002;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .torn-faction-search-widget .reset-confirmation.show {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: auto;
    }

    .torn-faction-search-widget .reset-confirmation p {
        margin: 0 0 16px 0;
        color: #ddd;
        font-size: 13px;
        text-align: center;
        line-height: 1.4;
    }

    .torn-faction-search-widget .reset-confirmation-buttons {
        display: flex;
        gap: 12px;
    }

    .torn-faction-search-widget .reset-confirmation-buttons button {
        flex: 1;
        padding: 10px 16px;
        border: 1px solid #555;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .torn-faction-search-widget .confirm-reset {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        border-color: transparent;
    }

    .torn-faction-search-widget .confirm-reset:hover {
        background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }

    .torn-faction-search-widget .cancel-reset {
        background: linear-gradient(135deg, #555 0%, #444 100%);
        color: white;
        border-color: transparent;
    }

    .torn-faction-search-widget .cancel-reset:hover {
        background: linear-gradient(135deg, #666 0%, #555 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .torn-faction-search-widget .tab-content {
        display: none;
    }

    .torn-faction-search-widget .tab-content.active {
        display: block;
    }

    .torn-faction-search-widget .settings-tab.hidden,
    .torn-faction-search-widget .tab-content.hidden {
        display: none;
    }

    /* Animated collapsible sections */
    .torn-faction-search-widget .collapsible-section {
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-height: 0;
        opacity: 0;
        transform: translateY(-10px);
    }

    .torn-faction-search-widget .collapsible-section.expanded {
        max-height: 1000px;
        opacity: 1;
        transform: translateY(0);
    }

    .torn-faction-search-widget .drag-placeholder {
        height: 40px;
        background: linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(53, 122, 189, 0.1) 100%);
        border: 2px dashed #4a90e2;
        border-radius: 4px;
        margin: 2px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4a90e2;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.2s ease;
    }

    .torn-faction-search-widget .faction-table-row.dragging {
        opacity: 0.3;
        transform: scale(0.95);
        z-index: 1000;
        cursor: grabbing;
        background: rgba(74, 144, 226, 0.05);
        border: 1px dashed #4a90e2;
        border-radius: 4px;
    }

    .torn-faction-search-widget .faction-table-row.drag-over {
        border-top: 3px solid #4a90e2;
        margin-top: 3px;
        position: relative;
    }

    .torn-faction-search-widget .faction-table-row.drag-over::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #4a90e2, #357abd);
        border-radius: 1px;
        box-shadow: 0 0 8px rgba(74, 144, 226, 0.6);
    }

    .torn-faction-search-widget .faction-table-row.drag-over-bottom {
        border-bottom: 3px solid #4a90e2;
        margin-bottom: 3px;
        position: relative;
    }

    .torn-faction-search-widget .faction-table-row.drag-over-bottom::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #4a90e2, #357abd);
        border-radius: 1px;
        box-shadow: 0 0 8px rgba(74, 144, 226, 0.6);
    }

    .torn-faction-search-widget .unsaved-changes-warning {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 280px;
        max-width: calc(100% - 32px);
        background: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 100%);
        border: 1px solid #e74c3c;
        border-radius: 8px;
        padding: 16px;
        transform: translate(-50%, -50%) scale(0.9);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1003;
        box-shadow: 0 8px 24px rgba(231, 76, 60, 0.4);
    }

    .torn-faction-search-widget .unsaved-changes-warning.show {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        pointer-events: auto;
    }

    .torn-faction-search-widget .unsaved-changes-warning h4 {
        margin: 0 0 12px 0;
        color: #e74c3c;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
    }

    .torn-faction-search-widget .unsaved-changes-warning p {
        margin: 0 0 16px 0;
        color: #ddd;
        font-size: 12px;
        text-align: center;
        line-height: 1.4;
    }

    .torn-faction-search-warning-buttons {
        display: flex;
        gap: 12px;
    }

    .torn-faction-search-warning-buttons button {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #555;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    .torn-faction-search-widget .save-and-close-btn {
        background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
        color: white;
        border-color: transparent;
    }

    .torn-faction-search-widget .save-and-close-btn:hover {
        background: linear-gradient(135deg, #357abd 0%, #2968a3 100%);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
    }

    .torn-faction-search-widget .discard-changes-btn {
       background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
        color: white;
        border-color: transparent;
    }

    .torn-faction-search-widget .discard-changes-btn:hover {
        background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
    }

    .torn-faction-search-widget .cancel-close-btn {
        background: linear-gradient(135deg, #555 0%, #444 100%);
        color: white;
        border-color: transparent;
    }

    .torn-faction-search-widget .cancel-close-btn:hover {
        background: linear-gradient(135deg, #666 0%, #555 100%);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .torn-faction-search-widget .faction-id-field {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        margin-bottom: 0;
        transform: translateY(-10px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .torn-faction-search-widget .faction-id-field.show {
        max-height: 60px; /* Adjust based on your field height */
        opacity: 1;
        margin-bottom: 12px;
        transform: translateY(0);
    }

    .torn-faction-search-widget .settings-field select:disabled {
        background: #333 !important;
        color: #888 !important;
        cursor: not-allowed !important;
        opacity: 0.6;
    }

    .torn-faction-search-widget * {
        transition-property: background, border-color, color, transform, box-shadow, opacity;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    .torn-faction-search-widget .settings-tab,
    .torn-faction-search-widget .tab-content {
        will-change: auto;
        transform: translateZ(0); /* Force hardware acceleration */
    }

    .torn-faction-search-widget .settings-tab.active,
    .torn-faction-search-widget .tab-content.active {
        will-change: transform, opacity;
    }

    /* Mobile positioning*/
    @media (max-width: 784px) {
        .torn-faction-search-widget {
            position: absolute !important;
            right: 110px !important;
            top: 0px !important;
            z-index: 9999 !important;
        }
    
        .torn-faction-search-widget .settings-panel {
            width: 320px !important;
            left: -20px !important;
        }

        .torn-faction-search-widget .settings-footer a {
            position: static !important;
            display: inline !important;
            float: none !important;
            clear: none !important;
        }
    }

    /* Desktop positioning*/
    @media (min-width: 785px) {
        .torn-faction-search-widget {
            position: absolute !important;
            right: 475px !important;
            top: 0px !important;
            z-index: 1000 !important;
        }
    }

   `;

    class TornFactionSearchWidget {
        constructor() {
            try {
                this.isFullyInitialized = false; // Add this line
                this.suggestions = [];
                this.selectedSuggestion = -1;
                this.changeCheckTimer = null;
                this.saveFamiliesTimer = null;
                this.saveAssociatesTimer = null;
                this.tabSwitchTimer = null;
                this.debounceTimer = null;
                this.worker = null;
                this.currentSearchType = null;
                this.workerQueue = [];
                this.isWorkerBusy = false;
                this.activeTab = 'settings';
                this.currentUrl = window.location.href;
                this.setupUrlMonitoring();
                this.settings = this.loadSettings();
                this.apiKey = this.settings.apiKey || '';
                this.cachedElements = {};
                this.factionFamilies = this.loadFactionFamilies();
                this.factionAssociates = this.loadFactionAssociates();
                this.buttons = this.loadButtons();
                this.hasUnsavedChanges = false;
                this.originalSettings = null;
                this.originalFamilies = null;
                this.originalAssociates = null;
                this.isFirstTimeOrReset = this.checkFirstTimeOrReset();
                this.handleMobileKeyboard();
                this.detectMobilePerformance();
                this.originalPushState = history.pushState;
                this.originalReplaceState = history.replaceState;
                this.init();
                this.elementPool = {
                    rows: [],
                    maxPoolSize: 50
                };
                this.features = {
                    webWorkers: 'Worker' in window,
                    intersectionObserver: 'IntersectionObserver' in window,
                    performanceObserver: 'PerformanceObserver' in window,
                    requestIdleCallback: 'requestIdleCallback' in window
                };
            } catch (error) {
                console.error('Error in constructor:', error);
                console.error('Error stack:', error.stack);
                throw error;
            }
        }



        handleMobileKeyboard() {
            try {
                if (window.visualViewport) {
                    window.visualViewport.addEventListener('resize', () => {
                        const panel = this.widget && this.widget.querySelector('.settings-panel');
                        if (panel && panel.classList.contains('show')) {
                            const keyboardHeight = window.innerHeight - window.visualViewport.height;
                            if (keyboardHeight > 100) { 
                                panel.style.transform = `translateY(-${keyboardHeight / 2}px) scale(1)`;
                            } else {
                                panel.style.transform = 'scale(1) translateY(0)';
                            }
                        }
                    });
                } else {
                    console.log('visualViewport not available');
                }
            } catch (error) {
                console.error('Error in handleMobileKeyboard:', error);
            }
        }

        setupUrlMonitoring() {
            let lastUrl = window.location.href;
            const checkUrlChange = () => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                    console.log('URL changed from:', lastUrl, 'to:', currentUrl);
                    lastUrl = currentUrl;

                    // Only handle URL changes if fully initialized
                    if (this.isFullyInitialized) {
                        this.handleUrlChange();
                    } else {
                        setTimeout(() => {
                            if (this.isFullyInitialized) {
                                this.handleUrlChange();
                            }
                        }, 100);
                    }
                }
            };

            window.addEventListener('hashchange', () => {
                checkUrlChange();
            });

            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function(...args) {
                originalPushState.apply(history, args);
                setTimeout(checkUrlChange, 0);
            };

            history.replaceState = function(...args) {
                originalReplaceState.apply(history, args);
                setTimeout(checkUrlChange, 0);
            };

            setInterval(checkUrlChange, 1000);
            window.addEventListener('popstate', checkUrlChange);
        }

        handleUrlChange() {
            if (this.shouldShowWidget()) {
                if (!this.widget || !document.contains(this.widget)) {
                    // Clear the widget reference if it's no longer in the DOM
                    if (this.widget && !document.contains(this.widget)) {
                        this.widget = null;
                    }

                    // Ensure CSS is loaded before creating widget
                    this.ensureCSSLoaded().then(() => {
                        this.createWidget();
                        this.clearElementCache();
                        this.refreshElementCache();
                        this.cachedTabElements = {
                            familiesTab: this.widget.querySelector('[data-tab="families"]'),
                            associatesTab: this.widget.querySelector('[data-tab="associates"]'),
                            familiesContent: this.widget.querySelector('#families-content'),
                            associatesContent: this.widget.querySelector('#associates-content'),
                            settingsTab: this.widget.querySelector('[data-tab="settings"]'),
                            settingsContent: this.widget.querySelector('#settings-content'),
                            allTabs: this.widget.querySelectorAll('.settings-tab'),
                            allContents: this.widget.querySelectorAll('.tab-content')
                        };

                        if (this.widget) {
                            this.widget.style.display = '';
                        }
                    }).catch((error) => {
                        console.error('Failed to load CSS:', error);
                    });

                    return; // Exit early since we're handling this asynchronously
                }

                if (this.widget) {
                    this.widget.style.display = '';
                }
            } else {
                if (this.widget && document.contains(this.widget)) {
                    this.widget.remove();
                    this.clearElementCache();
                }
            }

            if (this.buttonInjector) {
                this.buttonInjector.handleChange();
            }
        }

        detectMobilePerformance() {
            try {
                const isLowEnd = navigator.hardwareConcurrency <= 2 ||
                      navigator.deviceMemory <= 2;
                if (isLowEnd) {
                    if (this.widget) {
                        this.widget.style.setProperty('--animation-duration', '0.2s');
                        this.widget.classList.add('low-performance-mode');
                    } else {
                        console.log('Widget not yet created, skipping style optimizations');
                    }
                    this.VIRTUAL_SCROLL_THRESHOLD = 10;
                }
            } catch (error) {
                console.error('Error in detectMobilePerformance:', error);
            }
        }

        isMobileDevice() {return window.innerWidth <= 784;}

        debouncedCheckForChanges() {
            if (this.changeCheckTimer) clearTimeout(this.changeCheckTimer);
            this.changeCheckTimer = setTimeout(() => {
                this.checkForChanges();
            }, CONSTANTS.TIMING.DEBOUNCE_CHANGES);
        }

        getCachedElement(selector) {
            if (!this.cachedElements[selector]) {
                this.cachedElements[selector] = this.widget && this.widget.querySelector(selector) || null;
            }
            return this.cachedElements[selector];
        }

        refreshElementCache(selectors = []) {
            if (selectors.length === 0) {
                Object.keys(this.cachedElements).forEach(selector => {
                    this.cachedElements[selector] = this.widget && this.widget.querySelector(selector) || null;
                });
            } else {
                selectors.forEach(selector => {
                    this.cachedElements[selector] = this.widget && this.widget.querySelector(selector) || null;
                });
            }
        }

        clearElementCache() {this.cachedElements = {};}

        checkFirstTimeOrReset() {
            const saved = GM_getValue('torn-faction-widget-settings', null);
            return !saved || !this.settings.apiKey;
        }

        loadButtons() {
            const saved = GM_getValue('torn-faction-widget-buttons', null);
            return saved ? JSON.parse(saved) : [];
        }

        saveButtons() {
            GM_setValue('torn-faction-widget-buttons', JSON.stringify(this.buttons));
        }

        captureCurrentState() {
            this.originalSettings = JSON.stringify(this.getCurrentFormData());
            this.originalFamilies = JSON.stringify(this.factionFamilies);
            this.originalAssociates = JSON.stringify(this.factionAssociates);
            this.hasUnsavedChanges = false;
        }

        getCurrentFormData() {
            const apiKeyInput = this.getCachedElement(CONSTANTS.SELECTORS.API_KEY_INPUT);
            const familiesButtonsPerRow = this.widget.querySelector('#families-buttons-per-row-select');
            const familiesUrlMatching = this.widget.querySelector('#families-url-matching-checkbox');
            const familiesEnabled = this.widget.querySelector('#families-enabled-checkbox');
            const associatesButtonsPerRow = this.widget.querySelector('#associates-buttons-per-row-select');
            const associatesEnabled = this.widget.querySelector('#associates-enabled-checkbox');
            const effectiveButtonsPerRow = this.isMobileDevice() ? 2 : (familiesButtonsPerRow ? parseInt(familiesButtonsPerRow.value) : 1);

            return {
                apiKey: apiKeyInput ? apiKeyInput.value.trim() : '',
                buttonsPerRow: effectiveButtonsPerRow,
                enableUrlMatching: familiesUrlMatching ? familiesUrlMatching.checked : false,
                familiesEnabled: familiesEnabled ? familiesEnabled.checked : false,
                associatesEnabled: associatesEnabled ? associatesEnabled.checked : false
            };
        }

        checkForChanges() {
            if (!this.originalSettings) return false;

            const currentFormData = this.getCurrentFormData();
            const originalFormData = JSON.parse(this.originalSettings);
            const settingsChanged =
                  currentFormData.apiKey !== originalFormData.apiKey ||
                  currentFormData.buttonsPerRow !== originalFormData.buttonsPerRow ||
                  currentFormData.enableUrlMatching !== originalFormData.enableUrlMatching ||
                  currentFormData.familiesEnabled !== originalFormData.familiesEnabled ||
                  currentFormData.associatesEnabled !== originalFormData.associatesEnabled;

            if (settingsChanged) {
                this.hasUnsavedChanges = true;
                return true;
            }

            const originalFamilies = JSON.parse(this.originalFamilies);
            const originalAssociates = JSON.parse(this.originalAssociates);

            const familiesChanged = this.factionFamilies.length !== originalFamilies.length ||
                  this.factionFamilies.some((faction, index) => {
                      const orig = originalFamilies[index];
                      return !orig || faction.id !== orig.id || faction.displayName !== orig.displayName;
                  });

            const associatesChanged = this.factionAssociates.length !== originalAssociates.length ||
                  this.factionAssociates.some((faction, index) => {
                      const orig = originalAssociates[index];
                      return !orig || faction.id !== orig.id ||
                          faction.displayName !== orig.displayName ||
                          faction.factionType !== orig.factionType;
                  });

            const hasChanges = familiesChanged || associatesChanged;
            this.hasUnsavedChanges = hasChanges;
            return hasChanges;
        }

        showUnsavedChangesWarning() {
            const warning = this.widget.querySelector('.unsaved-changes-warning');
            warning.classList.add('show');
        }

        hideUnsavedChangesWarning() {
            const warning = this.widget.querySelector('.unsaved-changes-warning');
            warning.classList.remove('show');
        }

        shouldShowWidget() {

            try {
                const currentUrl = window.location.href;

                const url = new URL(currentUrl);
                const pathname = url.pathname;
                const searchParams = url.searchParams;
                const hash = url.hash;

                if (pathname !== '/factions.php') {
                    console.log('Not on factions page');
                    return false;
                }

                const step = searchParams.get('step');
                const type = searchParams.get('type');
                const matchesAllowed = step === 'your' && (
                    (type === '1' && hash === '') ||
                    (hash === '#/') ||
                    (hash && hash.startsWith('#/war/')) ||
                    (hash === '#/tab=info')
                );

                if (matchesAllowed) {return true;}

                if (this.settings && this.settings.enableUrlMatching && this.factionFamilies && this.factionFamilies.length > 0) {
                    if (step === 'profile') {
                        const profileId = searchParams.get('ID');
                        const matchesFactionId = this.factionFamilies.some(faction => faction.id === profileId);
                        return matchesFactionId;
                    }
                }
                return false;
            } catch (error) {
                console.error('Error in shouldShowWidget:', error);
                return false;
            }
        }

        loadSettings() {
            const saved = GM_getValue('torn-faction-widget-settings', null);
            return saved ? JSON.parse(saved) : {
                apiKey: '',
                myFactionId: '',
                buttonsPerRow: 1,
                enableUrlMatching: false,
                familiesEnabled: false,
                associatesEnabled: false
            };
        }

        loadFactionFamilies() {
            const saved = GM_getValue('torn-faction-widget-families', null);
            return saved ? JSON.parse(saved) : [];
        }

        loadFactionAssociates() {
            const saved = GM_getValue('torn-faction-widget-associates', null);
            return saved ? JSON.parse(saved) : [];
        }

        saveSettings() {GM_setValue('torn-faction-widget-settings', JSON.stringify(this.settings));}
        saveFactionFamilies() {GM_setValue('torn-faction-widget-families', JSON.stringify(this.factionFamilies));}
        saveFactionAssociates() {GM_setValue('torn-faction-widget-associates', JSON.stringify(this.factionAssociates));}

        init() {
            const currentUrl = window.location.href;
            const isFactionsPage = currentUrl.includes('factions.php');
            if (!isFactionsPage) {return;}
            if (!this.shouldShowWidget()) {return;}

            this.ensureCSSLoaded().then(() => {
                this.createWidget();
                this.createButtonInjector();
                this.updateSettingsButtonColor();
                this.updateTabVisibility();

                setTimeout(() => {
                    if ('ontouchstart' in document.documentElement) {
                        this.attachTouchEvents();
                        this.setupMobileTooltips();
                        this.handleMobileKeyboard();
                        this.detectMobilePerformance();
                    }

                    this.setupWebWorker();
                    this.setupPerformanceMonitoring();
                    this.setupMemoryMonitoring();
                    this.setupIntersectionObserver();
                }, 100);
            }).catch((error) => {
                console.error('[DEBUG] Failed to load CSS:', error);
            });
        }

        async ensureCSSLoaded() {
            return new Promise((resolve, reject) => {
                if (this.isCSSLoaded()) {
                    resolve();
                    return;
                }

                if (!document.querySelector('#torn-faction-widget-styles')) {
                    const style = document.createElement('style');
                    style.id = 'torn-faction-widget-styles';
                    style.textContent = styles;
                    document.head.appendChild(style);
                }

                let attempts = 0;
                const isMobile = window.innerWidth <= 784;
                const maxAttempts = isMobile ? 10 : 20; // Fewer attempts on mobile
                const checkInterval = isMobile ? 100 : 50; // Longer intervals on mobile

                const checkCSS = () => {
                    attempts++;

                    if (this.isCSSLoaded()) {
                        // Reset counter on success
                        this.cssRefreshCount = 0;
                        resolve();
                        return;
                    }

                    if (attempts >= maxAttempts) {
                        console.error('[DEBUG] CSS failed to load after maximum attempts');
                        // On mobile, resolve anyway to prevent blocking
                        if (isMobile) {
                            console.log('[DEBUG] Mobile device - proceeding without CSS verification');
                            resolve();
                        } else {
                            reject(new Error('CSS loading timeout'));
                        }
                        return;
                    }

                    setTimeout(checkCSS, checkInterval);
                };

                setTimeout(checkCSS, checkInterval);
            });
        }

        forceRefreshCSS() {
            // Add safety counter to prevent infinite loops
            if (!this.cssRefreshCount) this.cssRefreshCount = 0;
            this.cssRefreshCount++;

            if (this.cssRefreshCount > 3) {
                console.log('[DEBUG] CSS refresh limit reached, stopping attempts');
                return;
            }

            const existingStyle = document.querySelector('#torn-faction-widget-styles');
            if (existingStyle) {
                existingStyle.remove();
            }

            document.body.offsetHeight;

            const style = document.createElement('style');
            style.id = 'torn-faction-widget-styles';
            style.textContent = styles;
            document.head.appendChild(style);
            document.body.offsetHeight;
        }

        isCSSLoaded() {
            // First check if style element exists
            const styleElement = document.querySelector('#torn-faction-widget-styles');
            if (!styleElement) {
                return false;
            }

            const testElement = document.createElement('div');
            testElement.className = 'torn-faction-search-widget';
            testElement.style.position = 'absolute';
            testElement.style.top = '-9999px';
            testElement.style.visibility = 'hidden';
            document.body.appendChild(testElement);

            const computedStyle = getComputedStyle(testElement);

            // Mobile-friendly CSS detection - check fewer properties
            const hasCorrectPosition = computedStyle.position === 'absolute';
            const hasCustomFont = computedStyle.fontFamily.includes('apple-system') || 
                  computedStyle.fontFamily.includes('BlinkMacSystemFont') ||
                  computedStyle.fontFamily !== 'serif';

            // Less strict on mobile - just check position and basic font loading
            const isMobile = window.innerWidth <= 784;
            const isLoaded = isMobile ? 
                  hasCorrectPosition && hasCustomFont : 
            hasCorrectPosition && computedStyle.zIndex === '1000' && computedStyle.width === '220px';

            document.body.removeChild(testElement);

            // Don't call forceRefreshCSS on mobile if we get stuck
            if (!isLoaded && !isMobile) {
                console.log('[DEBUG] CSS not properly loaded - attempting refresh');
                this.forceRefreshCSS();
            }

            return isLoaded;
        }

        createWidget() {
            // Clear any existing widget reference that's not in the DOM
            if (this.widget && !document.contains(this.widget)) {
                this.widget = null;
                this.clearElementCache();
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.createWidget(), 500);
                });
                return;
            }

            let container = null;
            const desktopSelectors = [
                '.content-wrapper .content-title',
                '.content-wrapper [class*="faction"]',
                '.faction-container',
                '.page-content',
                '.main-content',
                '.content-wrapper',
                'main'
            ];

            const mobileSelectors = [
                '.faction-container',
                '.page-content',
                '.main-container',
                'main'
            ];

            const isMobile = window.innerWidth <= 768;
            const selectors = isMobile ? mobileSelectors.concat(desktopSelectors) : desktopSelectors.concat(mobileSelectors);

            for (const selector of selectors) {
                const potentialContainer = document.querySelector(selector);
                if (potentialContainer) {
                    const style = getComputedStyle(potentialContainer);
                    const isVisible = style.display !== 'none' &&
                          style.visibility !== 'hidden' &&
                          style.opacity !== '0' &&
                          potentialContainer.offsetWidth > 0 &&
                          potentialContainer.offsetHeight > 0;

                    if (isVisible) {
                        container = potentialContainer;
                        break;
                    }
                }
            }

            if (!container) {
                const factionElements = document.querySelectorAll('[class*="faction"], [id*="faction"]');
                for (const factionEl of factionElements) {
                    const style = getComputedStyle(factionEl);
                    const isVisible = style.display !== 'none' &&
                          style.visibility !== 'hidden' &&
                          factionEl.offsetWidth > 0;

                    if (isVisible) {
                        container = factionEl.closest('div') || factionEl.parentElement;
                        break;
                    }
                }
            }

            if (!container) {
                const contentSelectors = [
                    '.content-title',
                    '.content',
                    '[class*="content"]',
                    '[class*="main"]'
                ];

                for (const selector of contentSelectors) {
                    const potentialContainer = document.querySelector(selector);
                    if (potentialContainer) {
                        const style = getComputedStyle(potentialContainer);
                        const isVisible = style.display !== 'none' &&
                              style.visibility !== 'hidden' &&
                              potentialContainer.offsetWidth > 0;

                        if (isVisible) {
                            container = potentialContainer;
                            break;
                        }
                    }
                }
            }

            try {
                const containerStyle = getComputedStyle(container);
                if (containerStyle.position === 'static') {
                    container.style.position = 'relative';
                }
            } catch (error) {
                console.warn('Could not access container style:', error);
            }

            const widget = document.createElement('div');
            widget.className = 'torn-faction-search-widget';
            widget.setAttribute('role', 'search');

            if (container === document.body) {
                widget.style.position = 'fixed';
                widget.style.top = isMobile ? '70px' : '80px';
                widget.style.right = '20px';
                widget.style.zIndex = '9999';
            }

            widget.innerHTML = `
            <form>
                <button type="button" class="toggle-search" aria-label="Toggle settings panel">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 40 40" fill="currentColor">
                        <path d="M638,189.177v-4.354l-4.087-1.023a16.088,16.088,0,0,0-.53-1.987l3.025-2.926-2.176-3.772-4.054,1.158a16.021,16.021,0,0,0-1.451-1.451l1.158-4.054-3.772-2.176-2.926,3.025a16.083,16.083,0,0,0-1.987-.53L620.177,167h-4.354l-1.023,4.087a15.913,15.913,0,0,0-1.987.531l-2.928-3.026-3.77,2.176,1.158,4.055a16.141,16.141,0,0,0-1.451,1.45l-4.054-1.158-2.176,3.77,3.025,2.928a16.088,16.088,0,0,0-.53,1.987L598,184.823v4.354l4.087,1.023a16.274,16.274,0,0,0,.53,1.987l-3.025,2.926,2.176,3.772,4.054-1.158a16.283,16.283,0,0,0,1.451,1.451l-1.158,4.054,3.772,2.176,2.926-3.026a16.089,16.089,0,0,0,1.987.531L615.823,207h4.354l1.023-4.087a16.089,16.089,0,0,0,1.987-.531l2.926,3.026,3.772-2.176-1.158-4.054a16.283,16.283,0,0,0,1.451-1.451l4.054,1.158,2.176-3.772-3.025-2.926a15.74,15.74,0,0,0,.53-1.987Zm-20,4.49A6.667,6.667,0,1,1,624.667,187,6.667,6.667,0,0,1,618,193.667Z" transform="translate(-598 -167)"/>
                    </svg>
                </button>
            </form>
                <div class="settings-panel">
                    <div class="settings-tabs">
                        <button type="button" class="settings-tab active" data-tab="settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 12 16" fill="currentColor">
                                <path d="M10,6.67V4A4,4,0,0,0,2,4V6.67H0V16H12V6.67Zm-6.67,0V4A2.67,2.67,0,0,1,8.67,4V6.67Z"/>
                            </svg>
                        </button>
                        <button type="button" class="settings-tab" data-tab="families">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 36.667 40" fill="currentColor">
                                <path d="M123.415,180.642a35.171,35.171,0,0,1-11.082,18.94,35.168,35.168,0,0,1-11.081-18.94a32.632,32.632,0,0,0,11.081-4.2A32.593,32.593,0,0,0,123.415,180.642Zm7.252-5.975c0,14.3-8.447,26.828-18.334,33.333C102.447,201.495,94,188.972,94,174.667c5.857,0,13.342-1.675,18.333-6.667C117.325,172.992,124.81,174.667,130.667,174.667Zm-3.48,3.156a29.755,29.755,0,0,1-14.854-5.416a29.755,29.755,0,0,1-14.853,5.416c1.1,11.754,8.152,20.989,14.853,26.092C119.035,198.812,126.09,189.577,127.187,177.823Z" transform="translate(-94 -168)"/>
                            </svg>
                        </button>
                        <button type="button" class="settings-tab" data-tab="associates">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 19 17" fill="currentColor">
                                <path d="M13.88,13.06c-2.29-.53-4.43-1-3.39-2.94C13.63,4.18,11.32,1,8,1S2.36,4.3,5.51,10.12c1.07,2-1.15,2.43-3.39,2.94C.13,13.52,0,14.49,0,16.17V17H16v-.83C16,14.49,15.87,13.52,13.88,13.06Z"/>
                                <polygon points="18.5,7.5 16.5,7.5 16.5,5.5 14.5,5.5 14.5,7.5 12.5,7.5 12.5,9.5 14.5,9.5 14.5,11.5 16.5,11.5 16.5,9.5 18.5,9.5"/>
                            </svg>
                        </button>
                    </div>
                    <div class="settings-content">
                        <div class="tab-content active" id="settings-content">
                            <div class="settings-header">
                                <h3>API Settings</h3>
                            </div>
                            <div class="settings-info">
                                <p>Please enter your API key and click save. If it is valid, the additional settings tabs will display.</p>
                                <p><strong><span class="disclaimer">Disclaimer:</span></strong> Your API key is only stored locally on your device and is not logged anywhere else.</p>
                            </div>
                            <div class="settings-field">
                                <label for="api-key-input">API Key (Public)</label>
                                <input type="text" id="api-key-input" value="${this.settings.apiKey}" placeholder="Enter your Torn API key">
                            </div>
                            <div class="settings-field faction-id-field ${this.settings.myFactionId ? 'show' : ''}" id="faction-id-field">
                                <label for="faction-id-input">My Faction ID</label>
                                <input type="text" id="faction-id-input" value="${this.settings.myFactionId}" readonly>
                            </div>
                            <div class="settings-footer">
                                <p>This script was built and is maintained by <a href="https://www.torn.com/profiles.php?XID=1561637" target="_blank" style="color: #4a90e2;">Dsuttz [1561637]</a></p>
                                <p>If there are any issues, please drop me a <a href="https://www.torn.com/messages.php#/p=compose&XID=1561637" target="_blank" style="color: #4a90e2;">message.</a></p>
                                <p>Please feel free to send donations for ongoing support and maintenance.</p>
                            </div>
                        </div>
                        <div class="tab-content" id="families-content">
                            <div class="settings-header">
                                <h3>Faction Family Settings</h3>
                            </div>
                            <div class="settings-field inline">
                                <label for="families-enabled-checkbox">Enabled</label>
                                <input type="checkbox" id="families-enabled-checkbox" ${this.settings.familiesEnabled ? 'checked' : ''}>
                            </div>
                            <div class="collapsible-section ${this.settings.familiesEnabled ? 'expanded' : ''}" id="families-collapsible">
                                <hr class="settings-separator">
                                <div class="settings-field inline">
                                    <label for="families-buttons-per-row-select">Buttons Per Row</label>
                                    <select id="families-buttons-per-row-select" ${this.isMobileDevice() ? 'disabled' : ''}>
                                    ${Array.from({length: 10}, (_, i) => i + 1)
                                        .map(n => `<option value="${n}" ${n === (this.isMobileDevice() ? 2 : this.settings.buttonsPerRow) ? 'selected' : ''}>${n}</option>`)
                                        .join('')}
                                    </select>
                           </div>
                                <hr class="settings-separator">
                                <div class="settings-field inline">
                                    <label for="families-url-matching-checkbox">Enable URL Matching</label>
                                    <input type="checkbox" id="families-url-matching-checkbox" ${this.settings.enableUrlMatching ? 'checked' : ''}>
                                </div>
                                <hr class="settings-separator">
                                <div class="settings-field search-field">
                                    <label for="families-search-input">Faction Search</label>
                                    <input type="text" id="families-search-input" class="search-input" placeholder="Search factions..." autocomplete="off">
                                    <div class="dropdown-suggestions" id="families-suggestions"></div>
                                    <div class="no-results-popup" id="families-no-results">No factions found matching your search</div>
                                </div>
                                <div class="faction-table">
                                    <div class="faction-table-header">
                                        <div>Selected Factions</div>
                                        <div></div>
                                    </div>
                                    <div id="families-table-body">
                                        ${this.renderFactionTable(this.factionFamilies, 'families')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-content" id="associates-content">
                            <div class="settings-header">
                                <h3>Faction Associate Settings</h3>
                            </div>
                            <div class="settings-field inline">
                                <label for="associates-enabled-checkbox">Enabled</label>
                                <input type="checkbox" id="associates-enabled-checkbox" ${this.settings.associatesEnabled ? 'checked' : ''}>
                            </div>
                            <div class="collapsible-section ${this.settings.associatesEnabled ? 'expanded' : ''}" id="associates-collapsible">
                                <hr class="settings-separator">
                                    <div class="settings-field inline">
                                         <label for="associates-buttons-per-row-select">Buttons Per Row</label>
                                         <select id="associates-buttons-per-row-select" ${this.isMobileDevice() ? 'disabled' : ''}>
                                         ${Array.from({length: 10}, (_, i) => i + 1)
                                             .map(n => `<option value="${n}" ${n === (this.isMobileDevice() ? 2 : this.settings.buttonsPerRow) ? 'selected' : ''}>${n}</option>`)
                                             .join('')}
                                         </select>
                                   </div>
                                <hr class="settings-separator">
                                <div class="settings-field search-field">
                                    <label for="associates-search-input">Faction Search</label>
                                    <input type="text" id="associates-search-input" class="search-input" placeholder="Search factions..." autocomplete="off">
                                    <div class="dropdown-suggestions" id="associates-suggestions"></div>
                                    <div class="no-results-popup" id="associates-no-results">No factions found matching your search</div>
                                </div>
                                <div class="icon-legend">
                                    <div class="icon-legend-items">
                                        <div class="icon-legend-item">
                                            <span class="icon-legend-icon">👤</span>
                                            <span>Friends</span>
                                        </div>
                                        <div class="icon-legend-item">
                                            <span class="icon-legend-icon">🏥</span>
                                            <span>Revivers</span>
                                        </div>
                                        <div class="icon-legend-item">
                                            <span class="icon-legend-icon">⚔️</span>
                                            <span>Mercs</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="faction-table">
                                    <div class="faction-table-header">
                                        <div>Selected Factions</div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <div id="associates-table-body">
                                        ${this.renderFactionTable(this.factionAssociates, 'associates')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="settings-actions">
                        <button type="button" class="save-settings">Save</button>
                        <button type="button" class="reset-btn">Reset</button>
                        <div class="reset-confirmation">
                            <p>Are you sure you want to clear all settings? This will reset API settings, faction lists, and preferences.</p>
                            <div class="reset-confirmation-buttons">
                                <button type="button" class="cancel-reset">Cancel</button>
                                <button type="button" class="confirm-reset">Proceed</button>
                            </div>
                        </div>
                    </div>
                    <div class="unsaved-changes-warning">
                       <h4>⚠️ Unsaved Changes</h4>
                       <p>You have unsaved changes. What would you like to do?</p>
                       <div class="torn-faction-search-warning-buttons">
                       <button type="button" class="save-and-close-btn">Save & Close</button>
                       <button type="button" class="discard-changes-btn">Discard Changes</button>
                       <button type="button" class="cancel-close-btn">Cancel</button>
                    </div>
                  </div>
                </div>
            `;

            try {
                container.appendChild(widget);
            } catch (error) {
                console.error('Failed to append widget:', error);
                return;
            }

            this.widget = widget;

            if ('ontouchstart' in window) {
                this.widget.classList.add('touch-device');
                const dragHints = this.widget.querySelectorAll('.drag-handle');
                dragHints.forEach(handle => {
                    handle.title = 'Touch and drag to reorder';
                });
            }

            this.attachEvents();
            this.refreshElementCache();
            this.cachedTabElements = {
                familiesTab: this.widget.querySelector('[data-tab="families"]'),
                associatesTab: this.widget.querySelector('[data-tab="associates"]'),
                familiesContent: this.widget.querySelector('#families-content'),
                associatesContent: this.widget.querySelector('#associates-content'),
                settingsTab: this.widget.querySelector('[data-tab="settings"]'),
                settingsContent: this.widget.querySelector('#settings-content'),
                allTabs: this.widget.querySelectorAll('.settings-tab'),
                allContents: this.widget.querySelectorAll('.tab-content')
            };
        }

        renderFactionTable(factions, type) {
            const rows = [];
            const isAssociates = type === 'associates';
            const dragHandleSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"/></svg>';
            const deleteSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>';
            for (let i = 0; i < factions.length; i++) {
                const faction = factions[i];
                const displayName = faction.displayName || faction.name;
                if (isAssociates) {
                    const factionType = faction.factionType || 'Friend';
                    rows.push(`<div class="faction-table-row" draggable="true" data-index="${i}" data-type="${type}" style="display: flex; align-items: center; padding: 8px 8px; gap: 6px;"><div class="drag-handle" style="width: 16px; min-width: 16px;">${dragHandleSVG}</div><input type="text" class="faction-name-input" value="${displayName}" data-type="${type}" data-index="${i}" placeholder="Faction name" style="flex: 1; min-width: 0;"><select class="faction-type-select" data-type="${type}" data-index="${i}" style="width: 36px; min-width: 36px;"><option value="Friend"${factionType === 'Friend' ? ' selected' : ''}>👤</option><option value="Revive"${factionType === 'Revive' ? ' selected' : ''}>🏥</option><option value="Merc"${factionType === 'Merc' ? ' selected' : ''}>⚔️</option></select><button type="button" class="delete-faction" data-type="${type}" data-index="${i}" style="width: 18px; min-width: 18px;">${deleteSVG}</button></div>`);
                } else {
                    rows.push(`<div class="faction-table-row" draggable="true" data-index="${i}" data-type="${type}"><div class="drag-handle">${dragHandleSVG}</div><input type="text" class="faction-name-input" value="${displayName}" data-type="${type}" data-index="${i}" placeholder="Faction name"><button type="button" class="delete-faction" data-type="${type}" data-index="${i}">${deleteSVG}</button></div>`);
                }
            }

            return rows.join('');
        }


        renderSingleFactionRow(faction, index, type) {
            if (type === 'associates') {
                return `
            <div class="faction-table-row" draggable="true" data-index="${index}" data-type="${type}">
                <div class="drag-handle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"/>
                    </svg>
                </div>
                <input type="text" class="faction-name-input" value="${faction.displayName || faction.name}"
                       data-type="${type}" data-index="${index}" placeholder="Faction name">
                <div style="position: relative;">
                    <select class="faction-type-select" data-type="${type}" data-index="${index}">
                        <option value="Friend" ${(faction.factionType || 'Friend') === 'Friend' ? 'selected' : ''}>👤</option>
                        <option value="Revive" ${(faction.factionType || 'Friend') === 'Revive' ? 'selected' : ''}>🏥</option>
                        <option value="Merc" ${(faction.factionType || 'Friend') === 'Merc' ? 'selected' : ''}>⚔️</option>
                    </select>
                </div>
                <button type="button" class="delete-faction" data-type="${type}" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                    </svg>
                </button>
            </div>
        `;
            } else {
                return `
            <div class="faction-table-row" draggable="true" data-index="${index}" data-type="${type}">
                <div class="drag-handle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"/>
                    </svg>
                </div>
                <input type="text" class="faction-name-input" value="${faction.displayName || faction.name}"
                       data-type="${type}" data-index="${index}" placeholder="Faction name">
                <button type="button" class="delete-faction" data-type="${type}" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                    </svg>
                </button>
            </div>
        `;
            }
        }

        getFactionIcon(factionType) {
            switch(factionType) {
                case 'Friend': return '👤';
                case 'Revive': return '🏥';
                case 'Merc': return '⚔️';
                default: return '👤';
            }
        }

        getTooltipText(factionType) {
            switch(factionType) {
                case 'Friend': return 'Friends';
                case 'Revive': return 'Revivers';
                case 'Merc': return 'Mercs';
                default: return 'Friends';
            }
        }

        setupMobileTooltips() {
            if ('ontouchstart' in window) {
                this.widget.addEventListener('touchstart', (e) => {
                    if (e.target.classList.contains('faction-type-select')) {
                        const tooltipText = this.getTooltipText(e.target.value);
                        this.showTooltip(e.target, tooltipText);
                        setTimeout(() => this.hideTooltip(), 2000);
                    }
                });
            }
        }

        createButtonEntry(name, id, type) {
            const isOwnFaction = id === this.settings.myFactionId;
            const link = isOwnFaction
            ? 'https://www.torn.com/factions.php?step=your&type=1'
            : `https://www.torn.com/factions.php?step=profile&ID=${id}`;
            return { name, link, type };
        }

        attachEvents() {

            const toggleBtn = this.widget.querySelector('.toggle-search');
            const settingsPanel = this.widget.querySelector('.settings-panel');

            const tabButtons = this.widget.querySelectorAll('.settings-tab');
            const apiKeyInput = this.widget.querySelector('#api-key-input');
            const saveBtn = this.widget.querySelector('.save-settings');
            const resetBtn = this.widget.querySelector('.reset-btn');
            const resetConfirmation = this.widget.querySelector('.reset-confirmation');
            const confirmResetBtn = this.widget.querySelector('.confirm-reset');
            const cancelResetBtn = this.widget.querySelector('.cancel-reset');
            const familiesButtonsPerRow = this.widget.querySelector('#families-buttons-per-row-select');
            const associatesButtonsPerRow = this.widget.querySelector('#associates-buttons-per-row-select');
            const familiesUrlMatching = this.widget.querySelector('#families-url-matching-checkbox');

            familiesButtonsPerRow.addEventListener('change', () => {
                this.debouncedCheckForChanges();
                if (this.buttonInjector) {
                    this.buttonInjector.forceRefresh();
                }
            });

            associatesButtonsPerRow.addEventListener('change', () => {
                this.debouncedCheckForChanges();
                if (this.buttonInjector) {
                    this.buttonInjector.forceRefresh();
                }
            });

            familiesUrlMatching.addEventListener('change', () => this.debouncedCheckForChanges());

            this.tooltip = document.createElement('div');
            this.tooltip.className = 'faction-type-tooltip';
            document.body.appendChild(this.tooltip);

            toggleBtn.addEventListener('click', () => {
                this.toggleSettings();
            });

            tabButtons.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabButtons.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    this.debouncedSwitchTab(tab.dataset.tab);
                });
            });

            saveBtn.addEventListener('click', () => {
                this.saveAllSettings();
                if (this.settings.apiKey && this.settings.apiKey.trim()) {
                    this.closeSettings();
                }
                this.updateTabVisibility();
            });

            resetBtn.addEventListener('click', () => {
                this.showResetConfirmation();
            });

            confirmResetBtn.addEventListener('click', () => {
                this.resetSettings();
            });

            cancelResetBtn.addEventListener('click', () => {
                this.hideResetConfirmation();
            });

            const saveAndCloseBtn = this.widget.querySelector('.save-and-close-btn');
            const discardChangesBtn = this.widget.querySelector('.discard-changes-btn');
            const cancelCloseBtn = this.widget.querySelector('.cancel-close-btn');

            saveAndCloseBtn.addEventListener('click', () => {
                this.saveAllSettings();
                this.hideUnsavedChangesWarning();
                this.closeSettings();
                this.captureCurrentState();
            });

            discardChangesBtn.addEventListener('click', () => {
                this.reloadOriginalData();
                this.hideUnsavedChangesWarning();
                this.closeSettings();
                this.captureCurrentState();
            });

            cancelCloseBtn.addEventListener('click', () => {
                this.hideUnsavedChangesWarning();
            });

            this.widget.addEventListener('focus', (e) => {
                if (e.target.classList.contains('faction-name-input')) {
                    setTimeout(() => {
                        const input = e.target;
                        const length = input.value.length;
                        input.setSelectionRange(length, length);
                    }, 0);
                }
            }, true);

            apiKeyInput.addEventListener('input', () => {
                this.validateApiKey(apiKeyInput.value.trim());
                this.debouncedCheckForChanges();
            });

            const familiesSearchInput = this.widget.querySelector('#families-search-input');
            const associatesSearchInput = this.widget.querySelector('#associates-search-input');

            familiesSearchInput.addEventListener('input', () => this.handleSearchInput(familiesSearchInput.value, 'families'));
            familiesSearchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e, 'families'));

            associatesSearchInput.addEventListener('input', () => this.handleSearchInput(associatesSearchInput.value, 'associates'));
            associatesSearchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e, 'associates'));

            familiesSearchInput.addEventListener('focus', () => this.scrollToSearchField('families'));
            associatesSearchInput.addEventListener('focus', () => this.scrollToSearchField('associates'));

            this.widget.addEventListener('input', (e) => {
                if (e.target.classList.contains('faction-name-input')) {
                    requestAnimationFrame(() => {
                        this.updateDisplayName(e.target.dataset.type, parseInt(e.target.dataset.index), e.target.value);
                    });
                }
            }, { passive: true });

            this.widget.addEventListener('change', (e) => {
                if (e.target.classList.contains('faction-type-select')) {
                    this.updateFactionType(e.target.dataset.type, parseInt(e.target.dataset.index), e.target.value);
                }
            }, { passive: true });

            this.widget.addEventListener('mouseenter', (e) => {
                if (e.target.classList.contains('faction-type-select')) {
                    const tooltipText = this.getTooltipText(e.target.value);
                    this.showTooltip(e.target, tooltipText);
                }
            }, true);

            this.widget.addEventListener('mouseleave', (e) => {
                if (e.target.classList.contains('faction-type-select')) {
                    this.hideTooltip();
                }
            }, true);

            this.widget.addEventListener('click', (e) => {
                if (e.target.closest('.delete-faction')) {
                    e.stopPropagation();
                    const btn = e.target.closest('.delete-faction');
                    this.deleteFaction(btn.dataset.type, parseInt(btn.dataset.index));
                }
            });

            document.addEventListener('click', (e) => {
                if (!this.widget.contains(e.target)) {
                    if (settingsPanel.classList.contains('show')) {
                        if (this.checkForChanges()) {
                            this.showUnsavedChangesWarning();
                            return;
                        }
                        this.closeSettings();
                    }
                } else if (!e.target.closest('.faction-type-custom')) {
                }
            });

            this.widget.addEventListener('dragstart', (e) => {
                if (e.target.closest('.faction-table-row')) {
                    this.handleDragStart(e);
                }
            });

            this.widget.addEventListener('dragover', (e) => {
                this.handleDragOver(e);
            });

            this.widget.addEventListener('drop', (e) => {
                this.handleDrop(e);
            });

            this.widget.addEventListener('dragend', (e) => {
                this.handleDragEnd(e);
            });

            this.attachTouchEvents();

            const familiesEnabledCheckbox = this.widget.querySelector('#families-enabled-checkbox');
            const associatesEnabledCheckbox = this.widget.querySelector('#associates-enabled-checkbox');

            familiesEnabledCheckbox.addEventListener('change', () => {
                this.toggleCollapsibleSection('families', familiesEnabledCheckbox.checked);
                this.debouncedCheckForChanges();
            });

            associatesEnabledCheckbox.addEventListener('change', () => {
                this.toggleCollapsibleSection('associates', associatesEnabledCheckbox.checked);
                this.debouncedCheckForChanges();
            });

            window.addEventListener('resize', () => {
                const familiesButtonsPerRow = this.widget.querySelector('#families-buttons-per-row-select');
                const associatesButtonsPerRow = this.widget.querySelector('#associates-buttons-per-row-select');

                if (this.isMobileDevice()) {
                    if (familiesButtonsPerRow) {
                        familiesButtonsPerRow.value = '2';
                        familiesButtonsPerRow.disabled = true;
                    }
                    if (associatesButtonsPerRow) {
                        associatesButtonsPerRow.value = '2';
                        associatesButtonsPerRow.disabled = true;
                    }
                } else {
                    if (familiesButtonsPerRow) {
                        familiesButtonsPerRow.value = this.settings.buttonsPerRow;
                        familiesButtonsPerRow.disabled = false;
                    }
                    if (associatesButtonsPerRow) {
                        associatesButtonsPerRow.value = this.settings.buttonsPerRow;
                        associatesButtonsPerRow.disabled = false;
                    }
                }
            });
        }

        attachTouchEvents() {
            if (!('ontouchstart' in document.documentElement)) return;

            let touchState = {
                startY: 0,
                startX: 0,
                draggedElement: null,
                draggedIndex: null,
                draggedType: null,
                isDragging: false,
                placeholder: null
            };

            this.widget.addEventListener('touchstart', (e) => {
                const dragHandle = e.target.closest('.drag-handle');
                if (!dragHandle) return;

                const row = dragHandle.closest('.faction-table-row');
                if (!row) return;

                const touch = e.touches[0];
                touchState.startY = touch.clientY;
                touchState.startX = touch.clientX;
                touchState.draggedElement = row;
                touchState.draggedIndex = parseInt(row.dataset.index);
                touchState.draggedType = row.dataset.type;
                touchState.isDragging = false;
                row.style.backgroundColor = 'rgba(74, 144, 226, 0.1)';
                row.style.transform = 'scale(1.02)';
                e.preventDefault();

            }, { passive: false });

            this.widget.addEventListener('touchmove', (e) => {
                if (!touchState.draggedElement) return;

                const touch = e.touches[0];
                const deltaY = Math.abs(touch.clientY - touchState.startY);
                const deltaX = Math.abs(touch.clientX - touchState.startX);

                if (!touchState.isDragging && deltaY > 10 && deltaY > deltaX) {
                    touchState.isDragging = true;
                    this.createTouchPlaceholder(touchState);
                    touchState.draggedElement.classList.add('touch-dragging');
                    touchState.draggedElement.style.position = 'fixed';
                    touchState.draggedElement.style.zIndex = '10000';
                    touchState.draggedElement.style.pointerEvents = 'none';
                    touchState.draggedElement.style.width = touchState.draggedElement.offsetWidth + 'px';
                }

                if (touchState.isDragging) {
                    e.preventDefault();
                    touchState.draggedElement.style.left = touch.clientX - 50 + 'px';
                    touchState.draggedElement.style.top = touch.clientY - 20 + 'px';
                    touchState.draggedElement.style.display = 'none';
                    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                    touchState.draggedElement.style.display = 'flex';

                    const targetRow = elementBelow?.closest('.faction-table-row');

                    if (targetRow && targetRow !== touchState.draggedElement &&
                        targetRow.dataset.type === touchState.draggedType &&
                        !targetRow.classList.contains('touch-placeholder')) {

                        this.clearTouchDragClasses();
                        this.moveTouchPlaceholder(touchState, targetRow, touch.clientY);
                    }
                }
            }, { passive: false });

            this.widget.addEventListener('touchend', (e) => {
                if (!touchState.draggedElement) return;

                if (touchState.isDragging) {
                    const touch = e.changedTouches[0];
                    touchState.draggedElement.style.display = 'none';
                    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                    touchState.draggedElement.style.display = 'flex';

                    let dropIndex = this.calculateTouchDropIndex(touchState, elementBelow);

                    if (dropIndex !== null && dropIndex !== touchState.draggedIndex) {
                        this.reorderFaction(touchState.draggedType, touchState.draggedIndex, dropIndex);
                    }
                }

                this.cleanupTouchDrag(touchState);
            });

            this.widget.addEventListener('touchcancel', (e) => {
                if (touchState.draggedElement) {
                    this.cleanupTouchDrag(touchState);
                }
            });
        }

        createTouchPlaceholder(touchState) {
            if (touchState.placeholder) return;

            touchState.placeholder = document.createElement('div');
            touchState.placeholder.className = 'touch-placeholder';
            touchState.placeholder.style.cssText = `
                height: 40px;
                background: linear-gradient(135deg, rgba(74, 144, 226, 0.2) 0%, rgba(53, 122, 189, 0.2) 100%);
                border: 2px dashed #4a90e2;
                border-radius: 4px;
                margin: 2px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #4a90e2;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `;

            touchState.placeholder.textContent = 'Drop here';

            if (touchState.draggedElement && touchState.draggedElement.parentNode) {
                touchState.draggedElement.parentNode.insertBefore(
                    touchState.placeholder,
                    touchState.draggedElement.nextSibling
                );
            }
        }

        moveTouchPlaceholder(touchState, targetRow, touchY) {
            if (!touchState.placeholder || !targetRow) return;

            const rect = targetRow.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            const insertBefore = touchY < midY;

            if (insertBefore) {
                targetRow.parentNode.insertBefore(touchState.placeholder, targetRow);
                targetRow.classList.add('touch-drag-over-top');
            } else {
                targetRow.parentNode.insertBefore(touchState.placeholder, targetRow.nextSibling);
                targetRow.classList.add('touch-drag-over-bottom');
            }
        }

        calculateTouchDropIndex(touchState, elementBelow) {
            if (!touchState.placeholder) return null;

            const tableBody = touchState.placeholder.parentNode;
            const allElements = Array.from(tableBody.children);
            const placeholderIndex = allElements.indexOf(touchState.placeholder);

            let dropIndex = 0;
            for (let i = 0; i < placeholderIndex; i++) {
                if (allElements[i].classList.contains('faction-table-row') &&
                    !allElements[i].classList.contains('touch-placeholder') &&
                    allElements[i] !== touchState.draggedElement) {
                    dropIndex++;
                }
            }

            if (touchState.draggedIndex < dropIndex) {
                dropIndex--;
            }

            return dropIndex;
        }

        clearTouchDragClasses() {
            this.widget.querySelectorAll('.faction-table-row').forEach(row => {
                row.classList.remove('touch-drag-over-top', 'touch-drag-over-bottom');
            });
        }

        cleanupTouchDrag(touchState) {
            if (touchState.draggedElement) {
                touchState.draggedElement.style.backgroundColor = '';
                touchState.draggedElement.style.transform = '';
                touchState.draggedElement.style.position = '';
                touchState.draggedElement.style.zIndex = '';
                touchState.draggedElement.style.pointerEvents = '';
                touchState.draggedElement.style.width = '';
                touchState.draggedElement.style.left = '';
                touchState.draggedElement.style.top = '';
                touchState.draggedElement.style.display = '';
                touchState.draggedElement.classList.remove('touch-dragging');
            }

            if (touchState.placeholder && touchState.placeholder.parentNode) {
                touchState.placeholder.parentNode.removeChild(touchState.placeholder);
            }

            this.clearTouchDragClasses();

            Object.keys(touchState).forEach(key => {
                touchState[key] = key === 'startY' || key === 'startX' ? 0 : null;
            });
        }

        cleanup() {
            try {

                [this.changeCheckTimer, this.saveFamiliesTimer, this.saveAssociatesTimer,
                 this.debounceTimer, this.tabSwitchTimer].forEach(timer => {
                    if (timer) clearTimeout(timer);
                });

                if (this.originalPushState) {
                    history.pushState = this.originalPushState;
                }
                if (this.originalReplaceState) {
                    history.replaceState = this.originalReplaceState;
                }

                if (this.worker) {
                    this.worker.terminate();
                    this.worker = null;
                }
                if (this.intersectionObserver) {
                    this.intersectionObserver.disconnect();
                }

                if (this.buttonInjector) {
                    this.buttonInjector.cleanup();
                    this.buttonInjector = null;
                }

                Object.keys(this).forEach(key => {
                    if (typeof this[key] === 'object' && this[key] !== null) {
                        this[key] = null;
                    }
                });

                delete window[SCRIPT_ID];
            } catch (error) {
                console.error('Error during cleanup:', error);
            }
        }

        debouncedSwitchTab(tabName) {
            if (this.tabSwitchTimer) clearTimeout(this.tabSwitchTimer);
            this.tabSwitchTimer = setTimeout(() => {
                this.switchTab(tabName);
            }, 50);
        }

        batchUIUpdates(updateFunctions) {
            requestAnimationFrame(() => {
                updateFunctions.forEach(fn => fn());
            });
        }

        batchProcessFactions(factions, type, batchSize = 5) {
            const batches = [];
            for (let i = 0; i < factions.length; i += batchSize) {
                batches.push(factions.slice(i, i + batchSize));
            }

            let currentBatch = 0;

            const processBatch = () => {
                if (currentBatch >= batches.length) return;

                const batch = batches[currentBatch];
                const fragment = document.createDocumentFragment();

                batch.forEach((faction, index) => {
                    const actualIndex = currentBatch * batchSize + index;
                    const rowElement = document.createElement('div');
                    rowElement.innerHTML = this.renderSingleFactionRow(faction, actualIndex, type);
                    fragment.appendChild(rowElement.firstChild);
                });

                const tableBody = this.widget.querySelector(`#${type}-table-body`);
                tableBody.appendChild(fragment);

                currentBatch++;

                if (currentBatch < batches.length) {
                    requestAnimationFrame(processBatch);
                }
            };

            const tableBody = this.widget.querySelector(`#${type}-table-body`);
            tableBody.innerHTML = '';
            requestAnimationFrame(processBatch);
        }

        createPooledElement(type, data) {
            let element = this.elementPool.rows.pop();
            if (!element) {
                element = document.createElement('div');
                element.className = 'faction-table-row';
            }

            element.setAttribute('draggable', 'true');
            element.setAttribute('data-index', data.index);
            element.setAttribute('data-type', data.type);
            element.innerHTML = data.html;

            return element;
        }

        returnToPool(element) {
            if (this.elementPool.rows.length < this.elementPool.maxPoolSize) {
                element.removeAttribute('data-index');
                element.removeAttribute('data-type');
                element.innerHTML = '';
                this.elementPool.rows.push(element);
            }
        }

        scrollToSearchField(type) {
            const settingsContent = this.widget.querySelector('.settings-content');
            const searchField = this.widget.querySelector(`#${type}-search-input`);

            if (settingsContent && searchField) {
                const searchFieldRect = searchField.getBoundingClientRect();
                const contentRect = settingsContent.getBoundingClientRect();
                const relativeTop = searchFieldRect.top - contentRect.top + settingsContent.scrollTop;
                const targetScroll = relativeTop - (settingsContent.clientHeight / 3);
                settingsContent.scrollTo({
                    top: Math.max(0, targetScroll),
                    behavior: 'smooth'
                });
            }
        }

        reloadOriginalData() {
            this.settings = this.loadSettings();
            this.factionFamilies = this.loadFactionFamilies();
            this.factionAssociates = this.loadFactionAssociates();
            this.batchUIUpdates([
                () => {
                    this.widget.querySelector('#api-key-input').value = this.settings.apiKey;
                    this.widget.querySelector('#faction-id-input').value = this.settings.myFactionId;
                    this.widget.querySelector('#families-buttons-per-row-select').value = this.settings.buttonsPerRow;
                    this.widget.querySelector('#families-url-matching-checkbox').checked = this.settings.enableUrlMatching;
                    this.widget.querySelector('#families-enabled-checkbox').checked = this.settings.familiesEnabled;
                    this.widget.querySelector('#associates-buttons-per-row-select').value = this.settings.buttonsPerRow;
                    this.widget.querySelector('#associates-enabled-checkbox').checked = this.settings.associatesEnabled;
                },
                () => this.updateFactionTable('families'),
                () => this.updateFactionTable('associates'),
                () => this.toggleCollapsibleSection('families', this.settings.familiesEnabled),
                () => this.toggleCollapsibleSection('associates', this.settings.associatesEnabled)
            ]);
        }

        toggleCollapsibleSection(type, enabled) {
            const section = this.widget.querySelector(`#${type}-collapsible`);
            if (!section) return;

            if (enabled) {
                section.classList.add('expanded');
            } else {
                section.classList.remove('expanded');
            }
        }

        handleDragStart(e) {
            const row = e.target.closest('.faction-table-row');
            if (!row) return;

            this.draggedElement = row;
            this.draggedIndex = parseInt(row.dataset.index);
            this.draggedType = row.dataset.type;

            row.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', row.outerHTML);
            this.createDragPlaceholder();
        }

        handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const row = e.target.closest('.faction-table-row');
            if (!row || row === this.draggedElement || row.classList.contains('drag-placeholder')) return;
            this.clearDragOverClasses();
            const rect = row.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            this.movePlaceholder(row, e.clientY < midY);

            if (e.clientY < midY) {
                row.classList.add('drag-over');
            } else {
                row.classList.add('drag-over-bottom');
            }
        }

        handleDrop(e) {
            e.preventDefault();

            let targetRow = e.target.closest('.faction-table-row');
            let dropIndex;

            if (e.target.closest('.drag-placeholder')) {
                const placeholder = e.target.closest('.drag-placeholder');
                const tableBody = placeholder.parentNode;
                const allElements = Array.from(tableBody.children);
                const placeholderIndex = allElements.indexOf(placeholder);

                dropIndex = 0;
                for (let i = 0; i < placeholderIndex; i++) {
                    if (allElements[i].classList.contains('faction-table-row') && !allElements[i].classList.contains('drag-placeholder')) {
                        dropIndex++;
                    }
                }
            } else if (targetRow && !targetRow.classList.contains('drag-placeholder')) {

                const targetIndex = parseInt(targetRow.dataset.index);
                const targetType = targetRow.dataset.type;

                if (targetType !== this.draggedType) {
                    this.clearDragOverClasses();
                    this.removeDragPlaceholder();
                    return;
                }

                const rect = targetRow.getBoundingClientRect();
                const dropBelow = e.clientY > rect.top + rect.height / 2;

                dropIndex = targetIndex;
                if (dropBelow) {
                    dropIndex = targetIndex + 1;
                }
            } else {
                this.clearDragOverClasses();
                this.removeDragPlaceholder();
                return;
            }

            if (this.draggedIndex < dropIndex) {
                dropIndex--;
            }

            this.reorderFaction(this.draggedType, this.draggedIndex, dropIndex);
            this.clearDragOverClasses();
            this.removeDragPlaceholder();
        }

        handleDragEnd(e) {
            const row = e.target.closest('.faction-table-row');
            if (row) {
                row.classList.remove('dragging');
            }
            this.clearDragOverClasses();
            this.removeDragPlaceholder();
            this.draggedElement = null;
            this.draggedIndex = null;
            this.draggedType = null;
        }

        createDragPlaceholder() {
            if (this.dragPlaceholder) return;

            this.dragPlaceholder = document.createElement('div');
            this.dragPlaceholder.className = 'drag-placeholder';
            this.dragPlaceholder.textContent = 'Drop here';
            if (this.draggedElement && this.draggedElement.parentNode) {
                this.draggedElement.parentNode.insertBefore(this.dragPlaceholder, this.draggedElement.nextSibling);
            }
        }

        movePlaceholder(targetRow, insertBefore) {
            if (!this.dragPlaceholder || !targetRow) return;
            if (insertBefore) {
                targetRow.parentNode.insertBefore(this.dragPlaceholder, targetRow);
            } else {
                targetRow.parentNode.insertBefore(this.dragPlaceholder, targetRow.nextSibling);
            }
        }

        removeDragPlaceholder() {
            if (this.dragPlaceholder && this.dragPlaceholder.parentNode) {
                this.dragPlaceholder.parentNode.removeChild(this.dragPlaceholder);
                this.dragPlaceholder = null;
            }
        }

        clearDragOverClasses() {
            this.widget.querySelectorAll('.faction-table-row').forEach(row => {
                row.classList.remove('drag-over', 'drag-over-bottom');
            });
        }

        reorderFaction(type, fromIndex, toIndex) {
            let factions;

            if (type === 'families') {
                factions = this.factionFamilies;
            } else if (type === 'associates') {
                factions = this.factionAssociates;
            } else {
                return;
            }

            if (fromIndex < 0 || fromIndex >= factions.length || toIndex < 0 || toIndex > factions.length) {
                return;
            }

            if (fromIndex === toIndex) {
                return;
            }

            const [movedFaction] = factions.splice(fromIndex, 1);
            factions.splice(toIndex, 0, movedFaction);

            if (type === 'families') {
                this.saveFactionFamilies();
            } else if (type === 'associates') {
                this.saveFactionAssociates();
            }

            this.updateFactionTable(type);
            this.updateButtonsOrder();
            this.debouncedCheckForChanges();
        }

        updateButtonsOrder() {
            this.buttons = [];

            if (this.settings.familiesEnabled) {
                this.factionFamilies.forEach(faction => {
                    const buttonEntry = this.createButtonEntry(faction.displayName || faction.name, faction.id, 'families');
                    this.buttons.push(buttonEntry);
                });
            }

            if (this.settings.associatesEnabled) {
                this.factionAssociates.forEach(faction => {
                    const buttonEntry = this.createButtonEntry(faction.displayName || faction.name, faction.id, 'associates');
                    this.buttons.push(buttonEntry);
                });
            }

            this.saveButtons();
        }

        showTooltip(element, text) {
            const rect = element.getBoundingClientRect();
            this.tooltip.textContent = text;
            this.tooltip.style.left = (rect.right + 10) + 'px';
            this.tooltip.style.top = (rect.top + rect.height / 2) + 'px';
            this.tooltip.style.transform = 'translateY(-50%)';
            this.tooltip.classList.add('show');
        }

        hideTooltip() {
            this.tooltip.classList.remove('show');
        }

        showResetConfirmation() {
            const resetConfirmation = this.widget.querySelector('.reset-confirmation');
            resetConfirmation.classList.add('show');
        }

        hideResetConfirmation() {
            const resetConfirmation = this.widget.querySelector('.reset-confirmation');
            if (resetConfirmation) {
                resetConfirmation.classList.remove('show');
            } else {
                console.log('Reset confirmation element not found');
            }
        }

        updateFactionType(type, index, factionType) {
            if (type === 'associates') {
                if (this.factionAssociates[index]) {
                    this.factionAssociates[index].factionType = factionType;
                    this.saveFactionAssociates();
                    this.debouncedCheckForChanges();
                }
            }
        }

        updateDisplayName(type, index, displayName) {
            if (type === 'families') {
                if (this.factionFamilies[index] && this.factionFamilies[index].displayName !== displayName) {
                    this.factionFamilies[index].displayName = displayName;
                    this.debouncedSaveFactionFamilies();
                    this.debouncedCheckForChanges();
                }
            } else if (type === 'associates') {
                if (this.factionAssociates[index] && this.factionAssociates[index].displayName !== displayName) {
                    this.factionAssociates[index].displayName = displayName;
                    this.debouncedSaveFactionAssociates();
                    this.debouncedCheckForChanges();
                }
            }
        }

        debouncedSaveFactionFamilies() {
            if (this.saveFamiliesTimer) clearTimeout(this.saveFamiliesTimer);
            this.saveFamiliesTimer = setTimeout(() => {
                this.saveFactionFamilies();
            }, CONSTANTS.TIMING.DEBOUNCE_SAVE);
        }

        debouncedSaveFactionAssociates() {
            if (this.saveAssociatesTimer) clearTimeout(this.saveAssociatesTimer);
            this.saveAssociatesTimer = setTimeout(() => {
                this.saveFactionAssociates();
            }, CONSTANTS.TIMING.DEBOUNCE_SAVE);
        }

        toggleSettings() {
            const settingsPanel = this.widget.querySelector('.settings-panel');
            const isOpen = settingsPanel.classList.contains('show');

            if (isOpen) {
                if (this.checkForChanges()) {
                    this.showUnsavedChangesWarning();
                    return;
                }
                this.closeSettings();
            } else {
                settingsPanel.classList.add('show');
                this.updateTabVisibility();
                const hasValidApi = !!(this.settings.apiKey && this.settings.apiKey.trim()) && !this.isFirstTimeOrReset;
                if (hasValidApi) {
                    this.switchTab('families');
                } else {
                    this.switchTab('settings');
                }
                this.captureCurrentState();
            }
        }

        closeSettings() {
            const settingsPanel = this.widget.querySelector('.settings-panel');
            settingsPanel.classList.remove('show');
            this.closeSuggestions('families');
            this.closeSuggestions('associates');
            this.hideResetConfirmation();
            this.hideUnsavedChangesWarning();
        }

        switchTab(tabName) {
            const tab = this.cachedTabElements.allTabs[0].parentNode.querySelector(`[data-tab="${tabName}"]`);
            if (tab && tab.classList.contains('hidden')) {
                return;
            }

            requestAnimationFrame(() => {
                
                this.activeTab = tabName;
                this.cachedTabElements.allTabs.forEach(tab => {
                    const isActive = tab.dataset.tab === tabName;
                    tab.classList.toggle('active', isActive);
                });

                this.cachedTabElements.allContents.forEach(content => {
                    const isActive = content.id === `${tabName}-content`;
                    content.classList.toggle('active', isActive);
                });
                const settingsContent = document.querySelector('.torn-faction-search-widget .settings-content');
                if (settingsContent) {
                    settingsContent.scrollTop = 0;
                }
            });
        }

        updateTabVisibility() {
            const hasValidApi = !!(this.settings.apiKey && this.settings.apiKey.trim());
            const shouldHideTabs = !hasValidApi || this.isFirstTimeOrReset;

            requestAnimationFrame(() => {
                if (shouldHideTabs) {
                    this.cachedTabElements.familiesTab.classList.add('hidden');
                    this.cachedTabElements.associatesTab.classList.add('hidden');
                    this.cachedTabElements.familiesContent.classList.add('hidden');
                    this.cachedTabElements.associatesContent.classList.add('hidden');
                    this.switchTab('settings');
                } else {
                    this.cachedTabElements.familiesTab.classList.remove('hidden');
                    this.cachedTabElements.associatesTab.classList.remove('hidden');
                    this.cachedTabElements.familiesContent.classList.remove('hidden');
                    this.cachedTabElements.associatesContent.classList.remove('hidden');
                }
            });
        }

        saveAllSettings() {
            const apiKeyInput = this.widget.querySelector('#api-key-input');
            const factionIdInput = this.widget.querySelector('#faction-id-input');
            const familiesButtonsPerRow = this.widget.querySelector('#families-buttons-per-row-select');
            const familiesUrlMatching = this.widget.querySelector('#families-url-matching-checkbox');
            const familiesEnabled = this.widget.querySelector('#families-enabled-checkbox');
            const associatesButtonsPerRow = this.widget.querySelector('#associates-buttons-per-row-select');
            const associatesEnabled = this.widget.querySelector('#associates-enabled-checkbox');

            this.settings = {
                apiKey: apiKeyInput.value.trim(),
                myFactionId: factionIdInput.value.trim(),
                buttonsPerRow: parseInt(familiesButtonsPerRow.value),
                enableUrlMatching: familiesUrlMatching.checked,
                familiesEnabled: familiesEnabled.checked,
                associatesEnabled: associatesEnabled.checked
            };

            this.apiKey = this.settings.apiKey;
            this.saveSettings();
            this.updateSettingsButtonColor();
            this.captureCurrentState();

            console.log('Save completed - triggering button refresh');
            if (this.buttonInjector) {
                console.log('Button injector found, scheduling injection...');
                this.buttonInjector.forceRefresh();
            } else {
                console.log('ERROR: Button injector not found!');
            }
        }

        resetSettings() {
            this.settings = {
                apiKey: '',
                myFactionId: '',
                buttonsPerRow: 1,
                enableUrlMatching: false,
                familiesEnabled: false,
                associatesEnabled: false
            };
            this.factionFamilies = [];
            this.factionAssociates = [];
            this.buttons = [];
            this.apiKey = '';
            this.isFirstTimeOrReset = true;
            this.saveSettings();
            this.saveFactionFamilies();
            this.saveFactionAssociates();
            this.saveButtons();
            this.widget.querySelector('#api-key-input').value = '';
            this.widget.querySelector('#faction-id-input').value = '';
            this.widget.querySelector('#families-buttons-per-row-select').value = '1';
            this.widget.querySelector('#families-url-matching-checkbox').checked = false;
            this.widget.querySelector('#families-enabled-checkbox').checked = false;
            this.widget.querySelector('#associates-buttons-per-row-select').value = '1';
            this.widget.querySelector('#associates-enabled-checkbox').checked = false;
            this.toggleCollapsibleSection('families', false);
            this.toggleCollapsibleSection('associates', false);
            this.updateFactionTable('families');
            this.updateFactionTable('associates');
            this.updateSettingsButtonColor(false);
            this.updateTabVisibility();
            this.switchTab('settings');
            this.updateFactionId('');
            this.hideResetConfirmation();
            this.captureCurrentState();
        }

        async validateApiKey(apiKey) {
            if (!apiKey) {
                this.updateSettingsButtonColor(false);
                this.updateFactionId('');
                this.isFirstTimeOrReset = true;
                this.updateTabVisibility();
                return;
            }

            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/user/timestamp`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'ApiKey ' + apiKey
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.timestamp) {
                        this.updateSettingsButtonColor(true);
                        await this.fetchFactionId(apiKey);
                        this.isFirstTimeOrReset = false;
                        this.settings.apiKey = apiKey;
                        this.apiKey = apiKey;
                        this.saveSettings();
                        this.updateTabVisibility();
                        return;
                    }
                }
            } catch (error) {
                console.error('API validation failed:', error);
            }

            this.updateSettingsButtonColor(false);
            this.updateFactionId('');
            this.isFirstTimeOrReset = true;
            this.updateTabVisibility();
        }

        async fetchFactionId(apiKey) {
            try {
                const response = await fetch(`${CONFIG.API_BASE_URL}/faction/basic`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'ApiKey ' + apiKey
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.basic && data.basic.id) {
                        this.updateFactionId(data.basic.id.toString());
                    }
                }
            } catch (error) {
                console.error('Failed to fetch faction ID:', error);
            }
        }

        updateFactionId(factionId) {
            const factionIdInput = this.widget.querySelector('#faction-id-input');
            const factionIdField = this.widget.querySelector('#faction-id-field');

            if (factionIdInput) {
                factionIdInput.value = factionId;
            }

            if (factionIdField) {
                if (factionId && factionId.trim()) {
                    factionIdField.classList.add('show');
                } else {
                    factionIdField.classList.remove('show');
                }
            }
        }

        updateSettingsButtonColor(hasValidApi = null) {
            const settingsTab = this.widget.querySelector('.settings-tab[data-tab="settings"]');
            if (!settingsTab) return;

            settingsTab.classList.remove('no-api', 'valid-api');

            if (hasValidApi === null) {
                hasValidApi = !!(this.settings.apiKey && this.settings.apiKey.trim());
                if (hasValidApi) {
                    this.validateApiKey(this.settings.apiKey);
                    return;
                }
            }

            if (hasValidApi) {
                settingsTab.classList.add('valid-api');
            } else {
                settingsTab.classList.add('no-api');
            }
        }

        handleSearchInput(value, type) {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);

            this.hideNoResults(type);

            if (value.trim().length > CONSTANTS.LIMITS.MIN_SEARCH_LENGTH && this.apiKey) {
                this.debounceTimer = setTimeout(() => {
                    this.searchFactions(value, type);
                }, CONSTANTS.TIMING.DEBOUNCE_SEARCH);
            } else {
                this.suggestions = [];
                this.closeSuggestions(type);
            }
        }

        async searchFactions(query, type) {
            this.currentSearchType = type;

            try {
                const url = new URL(`${CONFIG.API_BASE_URL}/faction/search`);
                url.searchParams.set('name', query);
                url.searchParams.set('limit', CONSTANTS.LIMITS.SEARCH_RESULTS_LIMIT.toString());

                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'ApiKey ' + this.apiKey
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        this.apiKey = null;
                        this.showSearchError(type, 'API key is invalid or expired');
                        return;
                    } else if (res.status === 403) {
                        this.showSearchError(type, 'API key lacks permission for faction search');
                        return;
                    } else if (res.status === 429) {
                        this.showSearchError(type, 'API rate limit exceeded. Please wait and try again');
                        return;
                    }
                    throw new Error(`API Error: ${res.status}`);
                }

                const data = await res.json();
                const factions = data?.search || [];

                if (factions.length === 0) {
                    this.showNoResults(type);
                    return;
                }

                if (this.worker && factions.length > 10) {
                    this.queueWorkerTask('sortFactions', factions);
                } else {
                    this.suggestions = factions.sort((a, b) => a.name.localeCompare(b.name));
                    this.hideNoResults(type);
                    this.renderSuggestions(type);
                }

            } catch (err) {
                console.error('Search failed:', err);
                this.suggestions = [];
                this.showSearchError(type, 'Search failed. Please check your connection');
            }
        }

        showSearchError(type, message) {
            const noResultsElement = this.widget.querySelector(`#${type}-no-results`);
            if (noResultsElement) {
                noResultsElement.textContent = message;
                noResultsElement.classList.add('show');
                setTimeout(() => {
                    this.hideNoResults(type);
                    noResultsElement.textContent = 'No factions found matching your search';
                }, CONSTANTS.TIMING.AUTO_HIDE_ERROR);
            }
            this.closeSuggestions(type);
        }

        showNoResults(type) {
            const noResultsElement = this.widget.querySelector(`#${type}-no-results`);
            if (noResultsElement) {
                noResultsElement.classList.add('show');
                setTimeout(() => {
                    this.hideNoResults(type);
                }, CONSTANTS.TIMING.AUTO_HIDE_NO_RESULTS);
            }
            this.closeSuggestions(type);
        }

        hideNoResults(type) {
            const noResultsElement = this.widget.querySelector(`#${type}-no-results`);
            if (noResultsElement) {
                noResultsElement.classList.remove('show');
            }
        }

        renderSuggestions(type) {
            const container = this.widget.querySelector(`#${type}-suggestions`);
            if (this.suggestions.length === 0) {
                this.closeSuggestions(type);
                return;
            }

            container.innerHTML = this.suggestions.map((faction, i) => `
                <div class="suggestion-item" data-index="${i}" data-type="${type}">
                    <span class="suggestion-faction-name">${faction.name}</span>
                    <span class="suggestion-faction-id">[${faction.id}]</span>
                </div>
            `).join('');

            container.classList.add('show');
            container.scrollTop = 0;

            container.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.selectFaction(item.querySelector('.suggestion-faction-name').textContent,
                                       item.querySelector('.suggestion-faction-id').textContent.replace(/[\[\]]/g, ''),
                                       type);
                });
            });
        }

        handleSearchKeydown(e, type) {
            const container = this.widget.querySelector(`#${type}-suggestions`);
            if (!container.classList.contains('show')) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedSuggestion = Math.min(this.selectedSuggestion + 1, this.suggestions.length - 1);
                this.updateSelection(type);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedSuggestion = Math.max(this.selectedSuggestion - 1, -1);
                this.updateSelection(type);
            } else if (e.key === 'Enter' && this.selectedSuggestion >= 0) {
                e.preventDefault();
                const faction = this.suggestions[this.selectedSuggestion];
                this.selectFaction(faction.name, faction.id, type);
            } else if (e.key === 'Escape') {
                this.closeSuggestions(type);
            }
        }

        updateSelection(type) {
            const items = this.widget.querySelectorAll(`#${type}-suggestions .suggestion-item`);
            items.forEach((item, i) => {
                item.classList.toggle('selected', i === this.selectedSuggestion);
            });
        }

        selectFaction(name, id, type) {
            const input = this.widget.querySelector(`#${type}-search-input`);
            input.value = '';
            this.closeSuggestions(type);

            if (type === 'families') {
                if (!this.factionFamilies.find(f => f.id === id)) {
                    this.factionFamilies.push({ name, id, displayName: name });
                    this.saveFactionFamilies();
                    this.updateFactionTable('families');
                    const buttonEntry = this.createButtonEntry(name, id, type);
                    this.buttons.push(buttonEntry);
                    this.saveButtons();
                    this.debouncedCheckForChanges();
                }
            } else if (type === 'associates') {
                if (!this.factionAssociates.find(f => f.id === id)) {
                    this.factionAssociates.push({ name, id, displayName: name, factionType: 'Friend' });
                    this.saveFactionAssociates();
                    this.updateFactionTable('associates');
                    const buttonEntry = this.createButtonEntry(name, id, type);
                    this.buttons.push(buttonEntry);
                    this.saveButtons();
                    this.debouncedCheckForChanges();
                }
            }
        }

        deleteFaction(type, index) {
            if (type === 'families') {
                const faction = this.factionFamilies[index];
                this.factionFamilies.splice(index, 1);
                this.saveFactionFamilies();
                this.updateFactionTable('families');
                this.buttons = this.buttons.filter(btn => btn.name !== faction.name || btn.type !== type);
                this.saveButtons();
                this.debouncedCheckForChanges();

            } else if (type === 'associates') {
                const faction = this.factionAssociates[index];
                this.factionAssociates.splice(index, 1);
                this.saveFactionAssociates();
                this.updateFactionTable('associates');
                this.buttons = this.buttons.filter(btn => btn.name !== faction.name || btn.type !== type);
                this.saveButtons();
                this.debouncedCheckForChanges();
            }
        }

        updateFactionTable(type) {
            const tableBody = this.widget.querySelector(`#${type}-table-body`);
            const factions = type === 'families' ? this.factionFamilies : this.factionAssociates;

            if (factions.length > 20) {
                this.renderVirtualizedTable(tableBody, factions, type);
            } else {
                this.renderStandardTable(tableBody, factions, type);
            }
        }

        renderVirtualizedTable(tableBody, factions, type) {
            const ITEM_HEIGHT = 42;
            const VISIBLE_ITEMS = 10;
            const container = tableBody.parentElement;
            if (!container.querySelector('.virtual-scroll-container')) {
                const virtualContainer = document.createElement('div');
                virtualContainer.className = 'virtual-scroll-container';
                virtualContainer.style.cssText = `
                    height: ${VISIBLE_ITEMS * ITEM_HEIGHT}px;
                    overflow-y: auto;
                    position: relative;
                `;

                const virtualContent = document.createElement('div');
                virtualContent.className = 'virtual-content';
                virtualContent.style.height = `${factions.length * ITEM_HEIGHT}px`;
                virtualContainer.appendChild(virtualContent);
                tableBody.appendChild(virtualContainer);
                virtualContainer.addEventListener('scroll', () => {
                    this.renderVisibleItems(virtualContent, factions, type, virtualContainer.scrollTop, ITEM_HEIGHT, VISIBLE_ITEMS);
                });
            }

            const virtualContent = container.querySelector('.virtual-content');
            this.renderVisibleItems(virtualContent, factions, type, 0, ITEM_HEIGHT, VISIBLE_ITEMS);
        }

        renderVisibleItems(container, factions, type, scrollTop, itemHeight, visibleItems) {
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(startIndex + visibleItems + 2, factions.length);

            container.innerHTML = '';

            for (let i = startIndex; i < endIndex; i++) {
                const faction = factions[i];
                const element = document.createElement('div');
                element.style.cssText = `
                    position: absolute;
                    top: ${i * itemHeight}px;
                    width: 100%;
                    height: ${itemHeight}px;
                `;
                element.innerHTML = this.renderSingleFactionRow(faction, i, type);
                container.appendChild(element);
            }
        }

        renderStandardTable(tableBody, factions, type) {
            const fragment = document.createDocumentFragment();
            if (factions.length > 0) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = this.renderFactionTable(factions, type);

                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }
            } else {
                const emptyDiv = document.createElement('div');
                emptyDiv.style.cssText = 'padding: 60px 12px; text-align: center; color: #666; font-size: 11px;';
                emptyDiv.textContent = 'No factions selected. Use the search above to add factions.';
                fragment.appendChild(emptyDiv);
            }

            tableBody.innerHTML = '';
            tableBody.appendChild(fragment);
        }

        closeSuggestions(type) {
            const container = this.widget.querySelector(`#${type}-suggestions`);
            if (container) {
                container.classList.remove('show');
            }
            this.selectedSuggestion = -1;
        }

        setupPerformanceMonitoring() {
            if (window.PerformanceObserver) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 16) { // > 1 frame at 60fps
                            console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
                        }
                    }
                });
                observer.observe({ entryTypes: ['measure'] });
            }
        }

        setupMemoryMonitoring() {
            if (performance.memory) {
                setInterval(() => {
                    const memory = performance.memory;
                    const used = Math.round(memory.usedJSHeapSize / 1048576);
                    const total = Math.round(memory.totalJSHeapSize / 1048576);

                    if (used > 100) {
                        console.warn(`High memory usage detected: ${used}MB/${total}MB`);

                        if (this.elementPool.rows.length > 25) {
                            this.elementPool.rows.length = 10;
                        }
                    }
                }, 30000);
            }
        }

        setupWebWorker() {
            if (window.Worker) {
                const workerScript = `
                    self.onmessage = function(e) {
                    const { id, type, data } = e.data;

                    try {
                        switch(type) {
                            case 'sortFactions':
                                const sorted = data.slice().sort((a, b) => {
                                    // More sophisticated sorting
                                    const nameA = a.name.toLowerCase();
                                    const nameB = b.name.toLowerCase();

                                    // Prioritize exact matches, then starts with, then contains
                                    const query = data.query ? data.query.toLowerCase() : '';
                                    if (query) {
                                        const aExact = nameA === query;
                                        const bExact = nameB === query;
                                        if (aExact && !bExact) return -1;
                                        if (!aExact && bExact) return 1;

                                        const aStarts = nameA.startsWith(query);
                                        const bStarts = nameB.startsWith(query);
                                        if (aStarts && !bStarts) return -1;
                                        if (!aStarts && bStarts) return 1;
                                    }

                                    return nameA.localeCompare(nameB);
                                });

                                self.postMessage({
                                    id,
                                    type: 'sortComplete',
                                    data: sorted
                                });

                        break;

                        case 'filterFactions':
                            const query = data.query.toLowerCase();
                            const filtered = data.factions.filter(faction => {
                                const name = faction.name.toLowerCase();
                                const id = faction.id.toString();

                                // Search in both name and ID
                                return name.includes(query) || id.includes(query);
                            });

                            self.postMessage({
                                id,
                                type: 'filterComplete',
                                data: filtered
                            });

                        break;

                        case 'processLargeDataset':
                            // Handle large faction lists processing
                            const processed = data.factions.map(faction => ({
                                ...faction,
                                searchIndex: faction.name.toLowerCase() + ' ' + faction.id,
                                priority: faction.name.toLowerCase().startsWith(data.query.toLowerCase()) ? 1 : 0
                            }));

                            self.postMessage({
                                id,
                                type: 'processComplete',
                                data: processed
                            });

                        break;

                        case 'validateBulkData':
                            // Validate faction data in bulk
                            const validated = data.factions.filter(faction =>
                                faction &&
                                faction.id &&
                                faction.name &&
                                faction.name.trim().length > 0
                            );

                            self.postMessage({
                                id,
                                type: 'validateComplete',
                                data: validated
                            });

                        break;

                        default:
                            throw new Error('Unknown worker task type: ' + type);
                    }
                } catch (error) {
                    self.postMessage({
                        id,
                        type: 'error',
                        error: error.message
                    });
                }
            };
        `;

                try {

                    this.worker = new Worker(URL.createObjectURL(new Blob([workerScript], { type: 'application/javascript' })));
                    this.worker.onmessage = (e) => {
                        this.handleWorkerMessage(e.data);
                    };

                    this.worker.onerror = (error) => {
                        console.error('Web Worker error:', error);
                        this.isWorkerBusy = false;
                        this.processWorkerQueue();
                    };

                } catch (error) {
                    console.warn('Failed to initialize Web Worker:', error);
                    this.worker = null;
                }
            } else {
                console.warn('Web Workers not supported in this browser');
            }
        }

        handleWorkerMessage(message) {

            const { id, type, data, error } = message;
            const task = this.workerQueue.find(t => t.id === id);
            if (task && task.timeoutId) {
                clearTimeout(task.timeoutId);
            }

            this.isWorkerBusy = false;

            if (error) {
                console.error('Worker task failed:', error);
                this.processWorkerQueue();
                return;
            }

            switch(type) {
                case 'sortComplete':
                    this.suggestions = data;
                    if (this.currentSearchType) {
                        this.renderSuggestions(this.currentSearchType);
                    }
                    break;

                case 'filterComplete':
                    this.handleFilterResults(data);
                    break;

                case 'processComplete':
                    this.handleProcessedData(data);
                    break;

                case 'validateComplete':
                    this.handleValidatedData(data);
                    break;

                default:
                    console.warn('Unknown worker response type:', type);
            }

            this.processWorkerQueue();
        }

        handleFilterResults(filteredData) {
            this.suggestions = filteredData;
            if (this.currentSearchType) {
                if (filteredData.length === 0) {
                    this.showNoResults(this.currentSearchType);
                } else {
                    this.hideNoResults(this.currentSearchType);
                    this.renderSuggestions(this.currentSearchType);
                }
            }
        }

        handleProcessedData(processedData) {
            this.suggestions = processedData.sort((a, b) => b.priority - a.priority);
            if (this.currentSearchType) {
                this.renderSuggestions(this.currentSearchType);
            }
        }

        handleValidatedData(validatedData) {
            console.log(`Validated ${validatedData.length} factions`);
        }

        queueWorkerTask(taskType, taskData) {
            const taskId = Date.now() + Math.random();

            const task = {
                id: taskId,
                type: taskType,
                data: taskData
            };

            if (this.worker && !this.isWorkerBusy) {
                this.executeWorkerTask(task);
            } else {
                this.workerQueue.push(task);
            }

            return taskId;
        }

        executeWorkerTask(task) {
            if (!this.worker) {
                console.warn('Worker not available, falling back to main thread');
                this.fallbackToMainThread(task);
                return;
            }

            const timeoutId = setTimeout(() => {
                console.warn(`Worker task ${task.type} timed out, falling back to main thread`);
                this.isWorkerBusy = false;
                this.fallbackToMainThread(task);
                this.processWorkerQueue();
            }, 5000);

            task.timeoutId = timeoutId;
            this.isWorkerBusy = true;
            this.worker.postMessage(task);
        }

        processWorkerQueue() {
            if (this.workerQueue.length > 0 && !this.isWorkerBusy && this.worker) {
                const nextTask = this.workerQueue.shift();
                this.executeWorkerTask(nextTask);
            }
        }

        fallbackToMainThread(task) {
            switch(task.type) {
                case 'sortFactions': {
                    const sorted = task.data.slice().sort((a, b) => a.name.localeCompare(b.name));
                    this.handleWorkerMessage({
                        id: task.id,
                        type: 'sortComplete',
                        data: sorted
                    });
                    break;
                }

                case 'filterFactions': {
                    const query = task.data.query.toLowerCase();
                    const filtered = task.data.factions.filter(f =>
                                                               f.name.toLowerCase().includes(query) ||
                                                               f.id.toString().includes(query)
                                                              );
                    this.handleWorkerMessage({
                        id: task.id,
                        type: 'filterComplete',
                        data: filtered
                    });
                    break;
                }

                default:
                    console.warn('No fallback available for task type:', task.type);
            }
        }


        setupIntersectionObserver() {
            if (window.IntersectionObserver) {
                this.intersectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const row = entry.target;
                            if (row.dataset.lazy === 'true') {
                                this.loadRowContent(row);
                                this.intersectionObserver.unobserve(row);
                            }
                        }
                    });
                }, {
                    root: this.widget.querySelector('.settings-content'),
                    rootMargin: '50px'
                });
            }
        }

        loadRowContent(row) {
            row.dataset.lazy = 'false';
        }

        createButtonInjector() {
            if (!this.buttonInjector) {
                this.buttonInjector = new ButtonInjector(this);
            }
        }
    }

    // ===== BUTTON INJECTION SYSTEM =====
    class ButtonInjector {
        constructor(widget) {
            this.widget = widget;
            this.isInjecting = false;
            this.lastState = null;
            this.hasInitialized = false;
            this.pendingTimeout = null;
            this.mutationObserver = null;
            this.BREAKPOINT = 784;
            this.SMALL_CONTAINER = 372;
            this.LARGE_CONTAINER = 764;
            this.GAP = 10;

            this.sectionStates = {
                families: true,
                associates: true
            };

            this.familiesSvgMarkup = `
                <svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="26.2"
                    viewBox="0 0 36.667 40"
                    fill="white"
                    style="display:block; vertical-align:middle;">
                    <path d="M123.415,180.642a35.171,35.171,0,0,1-11.082,18.94,35.168,35.168,0,0,1-11.081-18.94a32.632,32.632,0,0,0,11.081-4.2A32.593,32.593,0,0,0,123.415,180.642Zm7.252-5.975c0,14.3-8.447,26.828-18.334,33.333C102.447,201.495,94,188.972,94,174.667c5.857,0,13.342-1.675,18.333-6.667C117.325,172.992,124.81,174.667,130.667,174.667Zm-3.48,3.156a29.755,29.755,0,0,1-14.854-5.416a29.755,29.755,0,0,1-14.853,5.416c1.1,11.754,8.152,20.989,14.853,26.092C119.035,198.812,126.90,189.577,127.187,177.823Z" transform="translate(-94 -168)"/>
                </svg>
            `;

            this.associatesSvgMarkup = `
                <svg xmlns="http://www.w3.org/2000/svg"
                     stroke="transparent"
                     stroke-width="0"
                     width="24"
                     height="26.2"
                     viewBox="-1 0 22 18"
                     fill="white"
                     style="display:block; vertical-align:middle;">
                  <g>
                     <path d="M13.88,13.06c-2.29-.53-4.43-1-3.39-2.94C13.63,4.18,11.32,1,8,1S2.36,4.3,5.51,10.12c1.07,2-1.15,2.43-3.39,2.94C.13,13.52,0,14.49,0,16.17V17H16v-.83C16,14.49,15.87,13.52,13.88,13.06Z"></path>
                     <polygon points="18.5 7.5 16.5 7.5 16.5 5.5 14.5 5.5 14.5 7.5 12.5 7.5 12.5 9.5 14.5 9.5 14.5 11.5 16.5 11.5 16.5 9.5 18.5 9.5 18.5 7.5"></polygon>
                  </g>
               </svg>
            `;

            this.initialize();
        }

        forceRefresh() {
            this.lastState = null;
            this.scheduleInjection(0);
        }

        getButtonsFromWidget() {
            const sections = [];
            const settings = this.widget.settings;
            if (settings.familiesEnabled && this.widget.factionFamilies.length > 0) {
                const familyButtons = [];
                this.widget.factionFamilies.forEach(faction => {
                    const displayName = faction.displayName || faction.name;
                    const isOwnFaction = faction.id === settings.myFactionId;
                    const url = isOwnFaction
                    ? 'https://www.torn.com/factions.php?step=your&type=1'
                    : `https://www.torn.com/factions.php?step=profile&ID=${faction.id}`;
                    familyButtons.push([displayName, url, displayName]);
                });

                sections.push({
                    title: 'Our Faction Family',
                    buttons: familyButtons,
                    type: 'families'
                });
            }

            if (settings.associatesEnabled && this.widget.factionAssociates.length > 0) {
                const associateButtons = [];
                this.widget.factionAssociates.forEach(faction => {
                    const displayName = faction.displayName || faction.name;
                    const isOwnFaction = faction.id === settings.myFactionId;
                    const url = isOwnFaction
                    ? 'https://www.torn.com/factions.php?step=your&type=1'
                    : `https://www.torn.com/factions.php?step=profile&ID=${faction.id}`;
                    const icon = this.getFactionIcon(faction.factionType);
                    const buttonLabel = `${icon} ${displayName}`;
                    associateButtons.push([buttonLabel, url, `${displayName} (${faction.factionType})`]);
                });

                sections.push({
                    title: 'Our Faction Associates',
                    buttons: associateButtons,
                    type: 'associates'
                });
            }

            return sections;
        }

        getFactionIcon(factionType) {
            switch(factionType) {
                case 'Friend': return '👤';
                case 'Revive': return '🏥';
                case 'Merc': return '⚔️';
                default: return '👤';
            }
        }

        shouldShowButtons() {
            try {
                const settings = this.widget.settings;
                const currentUrl = window.location.href;
                const url = new URL(currentUrl);
                const pathname = url.pathname;
                const searchParams = url.searchParams;
                const hash = url.hash;


                if (pathname !== '/factions.php') {
                    return false;
                }

                const step = searchParams.get('step');
                const type = searchParams.get('type');

                const hasFamilies = settings.familiesEnabled && this.widget.factionFamilies.length > 0;
                const hasAssociates = settings.associatesEnabled && this.widget.factionAssociates.length > 0;
                const hasAnyButtons = hasFamilies || hasAssociates;

                if (!hasAnyButtons) {
                    return false;
                }

                const matchesAllowed = step === 'your' && (
                    (type === '1' && hash === '') ||
                    (hash === '#/') ||
                    (hash && hash.startsWith('#/war/')) ||
                    (hash === '#/tab=info')
                );

                if (matchesAllowed) {
                    return true;
                }

                if (settings.enableUrlMatching && settings.familiesEnabled && this.widget.factionFamilies.length > 0) {
                    if (step === 'profile') {
                        const profileId = searchParams.get('ID');
                        const matchesFactionId = this.widget.factionFamilies.some(faction => faction.id === profileId);
                        return matchesFactionId;
                    }
                }

                return false;
            } catch (error) {
                console.error('Error in shouldShowButtons:', error);
                return false;
            }
        }

        getUrlState() {
            const u = new URL(location.href);
            return {
                step: u.searchParams.get('step'),
                type: u.searchParams.get('type'),
                hash: u.hash
            };
        }

        getStateSignature() {
            const state = this.getUrlState();
            const settings = this.widget.settings;

            const familiesButtonsPerRow = this.widget.widget.querySelector('#families-buttons-per-row-select');
            const associatesButtonsPerRow = this.widget.widget.querySelector('#associates-buttons-per-row-select');
            const currentFamiliesButtonsPerRow = familiesButtonsPerRow ? parseInt(familiesButtonsPerRow.value) : settings.buttonsPerRow;
            const currentAssociatesButtonsPerRow = associatesButtonsPerRow ? parseInt(associatesButtonsPerRow.value) : settings.buttonsPerRow;

            return JSON.stringify({
                step: state.step,
                type: state.type,
                hash: state.hash,
                mobile: window.innerWidth <= this.BREAKPOINT,
                shouldShow: this.shouldShowButtons(),
                familiesButtonsPerRow: currentFamiliesButtonsPerRow,
                associatesButtonsPerRow: currentAssociatesButtonsPerRow,
                settingsHash: JSON.stringify({
                    familiesEnabled: settings.familiesEnabled,
                    associatesEnabled: settings.associatesEnabled,
                    buttonsPerRow: settings.buttonsPerRow,
                    familiesCount: this.widget.factionFamilies.length,
                    associatesCount: this.widget.factionAssociates.length,
                    families: this.widget.factionFamilies.map(f => ({
                        id: f.id,
                        displayName: f.displayName || f.name
                    })),
                    associates: this.widget.factionAssociates.map(f => ({
                        id: f.id,
                        displayName: f.displayName || f.name,
                        factionType: f.factionType
                    }))
                })
            });
        }

        waitForElement(selector, timeout = 5000) {
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                const observer = new MutationObserver(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect();
                        resolve(element);
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                setTimeout(() => {
                    observer.disconnect();
                    reject(`Element not found: ${selector}`);
                }, timeout);
            });
        }

        getMountSelector(state, mobile) {
            if (mobile) {
                if (state.step === 'your') {
                    return state.hash && state.hash.includes('tab=info')
                        ? 'div.title-black:nth-of-type(4), hr.m-top10'
                    : 'hr.m-top10:nth-of-type(4), hr.m-top10';
                } else if (state.step === 'profile') {
                    return 'div.title-black:nth-of-type(7), hr.m-top10';
                }
            } else {
                if (state.step === 'your') {
                    return state.hash.startsWith('#/tab=info')
                        ? 'div.title-black:nth-child(4)'
                    : 'hr.m-top10:nth-child(4)';
                } else if (state.step === 'profile') {
                    return 'div.title-black:nth-child(7)';
                }
            }
            return 'div.title-black, hr.m-top10';
        }

        async performInjection() {
            if (this.isInjecting) return;
            this.isInjecting = true;

            try {
                const currentState = this.getStateSignature();
                const parsedState = JSON.parse(currentState);
                if (this.lastState === currentState) {
                    return;
                }
                if (!parsedState.shouldShow) {
                    const existing = document.getElementById('custom-button-wrapper');
                    if (existing) existing.remove();
                    this.lastState = currentState;
                    return;
                }

                const existing = document.getElementById('custom-button-wrapper');
                if (existing) existing.remove();
                const state = this.getUrlState();
                const mobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const vw = window.innerWidth;

                const isMobileLayout = vw <= this.BREAKPOINT;
                const containerW = isMobileLayout ? this.SMALL_CONTAINER : this.LARGE_CONTAINER;
                const familiesButtonsPerRow = this.widget.widget.querySelector('#families-buttons-per-row-select');
                const currentButtonsPerRow = familiesButtonsPerRow ? parseInt(familiesButtonsPerRow.value) : this.widget.settings.buttonsPerRow;
                const titlePadding = isMobileLayout ? 7 : 10;

                const SECTIONS = this.getButtonsFromWidget();
                if (SECTIONS.length === 0) {
                    this.lastState = currentState;
                    return;
                }

                const mountSelector = this.getMountSelector(state, mobile);
                const mountEl = await this.waitForElement(mountSelector);

                const mainWrapper = document.createElement('div');
                mainWrapper.id = 'custom-button-wrapper';
                mainWrapper.style.cssText = `
                    width: 100%;
                    margin: 20px 0 10px 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    opacity: 0;
                    transform: translateY(-5px);
                    transition: opacity 0.15s ease, transform 0.15s ease;
                `;

                SECTIONS.forEach((section, sectionIndex) => {
                    const familiesButtonsPerRow = this.widget.widget.querySelector('#families-buttons-per-row-select');
                    const associatesButtonsPerRow = this.widget.widget.querySelector('#associates-buttons-per-row-select');

                    let currentButtonsPerRow;
                    if (section.type === 'families') {
                        currentButtonsPerRow = this.widget.isMobileDevice() ? 2 : (familiesButtonsPerRow ? parseInt(familiesButtonsPerRow.value) : this.widget.settings.buttonsPerRow);
                    } else if (section.type === 'associates') {
                        currentButtonsPerRow = this.widget.isMobileDevice() ? 2 : (associatesButtonsPerRow ? parseInt(associatesButtonsPerRow.value) : this.widget.settings.buttonsPerRow);
                    } else {
                        currentButtonsPerRow = this.widget.isMobileDevice() ? 2 : this.widget.settings.buttonsPerRow;
                    }

                    const cols = isMobileLayout ? 2 : currentButtonsPerRow;
                    const btnW = Math.floor((containerW - (cols - 1) * this.GAP) / cols);

                    const sectionWrapper = document.createElement('div');
                    sectionWrapper.className = 'button-section-wrapper';
                    sectionWrapper.style.cssText = `
                        width: 100%;
                        margin-bottom: ${sectionIndex === SECTIONS.length - 1 ? '0' : '10px'};
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    `;

                    const titleBar = document.createElement('div');
                    titleBar.className = 'custom-button-title f-msg';
                    titleBar.style.cssText = `
                        width: ${containerW + titlePadding * 2}px;
                        padding: 0 ${titlePadding}px;
                        margin: 0 auto 5px auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        box-sizing: border-box;
                        cursor: pointer;
                        transition: background 0.1s ease;
                        position: relative;
                    `;

                    const toggleIcon = document.createElement('div');
                    toggleIcon.innerHTML = '&#9650;';
                    toggleIcon.style.cssText = `
                        position: absolute;
                        right: 10px;
                        font-size: 14px;
                        transition: transform 0.2s ease;
                        transform: rotate(180deg);
                    `;

                    const sectionSvg = section.type === 'families' ? this.familiesSvgMarkup : this.associatesSvgMarkup;

                    titleBar.innerHTML = `
                        <div style="margin-right:10px;display:flex;align-items:center;width:24px;justify-content:center;">${sectionSvg}</div>
                        <span style="line-height:1;flex-grow:1;text-align:center">${section.title}</span>
                    `;
                    titleBar.appendChild(toggleIcon);

                    const gridContainer = document.createElement('div');
                    gridContainer.className = 'custom-button-injector';
                    gridContainer.style.cssText = `
                        overflow: hidden;
                        max-height: 0;
                        transition: max-height 0.2s ease;
                        width: ${containerW}px;
                        margin: 0 auto;
                        display: flex;
                        flex-wrap: wrap;
                        gap: ${this.GAP}px;
                        justify-content: flex-start;
                    `;

                    let isCollapsed = this.sectionStates[section.type];
                    titleBar.addEventListener('click', () => {
                        isCollapsed = !isCollapsed;
                        this.sectionStates[section.type] = isCollapsed;
                        if (isCollapsed) {
                            gridContainer.style.maxHeight = gridContainer.scrollHeight + 'px';
                            requestAnimationFrame(() => gridContainer.style.maxHeight = '0');
                        } else {
                            gridContainer.style.maxHeight = gridContainer.scrollHeight + 'px';
                        }
                        toggleIcon.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
                    });

                    section.buttons.forEach(([label, url, tooltip]) => {
                        const a = document.createElement('a');
                        a.href = url;
                        a.textContent = label;
                        a.title = tooltip || label;
                        a.className = 'f-msg';
                        a.style.cssText = `
                            flex: 0 0 ${btnW}px;
                            color: white;
                            border-radius: 8px;
                            text-decoration: none;
                            font-weight: bold;
                            cursor: pointer;
                            transition: background 0.1s ease, opacity 0.1s ease;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            height: 50px;
                            font-size: ${label.length > 28 ? '8px' : label.length > 20 ? '12px' : '16px'};
                            padding: 0 !important;
                            margin: 0 !important;
                            box-sizing: border-box !important;
                        `;

                        a.addEventListener('mouseover', () => {
                            a.style.opacity = '0.8';
                            a.style.filter = 'brightness(1.1)';
                        });
                        a.addEventListener('mouseout', () => {
                            a.style.opacity = '1';
                            a.style.filter = 'brightness(1)';
                        });
                        a.addEventListener('click', (e) => {
                            if (url.includes(this.widget.settings.myFactionId)) {
                                e.preventDefault();
                                window.location.href = 'https://www.torn.com/factions.php?step=your&type=1#';
                            }
                        });

                        gridContainer.appendChild(a);
                    });

                    if (!isCollapsed) {
                        requestAnimationFrame(() => {
                            gridContainer.style.maxHeight = gridContainer.scrollHeight + 'px';
                            toggleIcon.style.transform = 'rotate(0deg)';
                        });
                    }

                    sectionWrapper.appendChild(titleBar);
                    sectionWrapper.appendChild(gridContainer);
                    mainWrapper.appendChild(sectionWrapper);
                });

                mountEl.insertAdjacentElement('beforebegin', mainWrapper);

                requestAnimationFrame(() => {
                    mainWrapper.style.opacity = '1';
                    mainWrapper.style.transform = 'translateY(0)';
                });

                this.lastState = currentState;

            } catch (error) {
                console.error('[Injector] Error:', error);
            } finally {
                this.isInjecting = false;
            }
        }

        scheduleInjection(delay = 50) {
            if (this.pendingTimeout) clearTimeout(this.pendingTimeout);
            this.pendingTimeout = setTimeout(() => this.performInjection(), delay);
        }

        handleChange() {
            if (!this.hasInitialized) return;
            this.scheduleInjection(100);
        }

        initialize() {
            if (this.hasInitialized) return;
            this.hasInitialized = true;

            // Set up observers
            let mutationTimeout;
            this.mutationObserver = new MutationObserver(() => {
                if (mutationTimeout) clearTimeout(mutationTimeout);
                mutationTimeout = setTimeout(() => this.handleChange(), 50);
            });

            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            let resizeTimeout;
            let lastMobileState = window.innerWidth <= this.BREAKPOINT;
            window.addEventListener('resize', () => {
                if (resizeTimeout) clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const nowMobile = window.innerWidth <= this.BREAKPOINT;
                    if (nowMobile !== lastMobileState) {
                        lastMobileState = nowMobile;
                        this.scheduleInjection(150);
                    }
                }, 100);
            });

            this.scheduleInjection(100);
        }

        cleanup() {
            if (this.mutationObserver) this.mutationObserver.disconnect();
            if (this.pendingTimeout) clearTimeout(this.pendingTimeout);
            const wrapper = document.getElementById('custom-button-wrapper');
            if (wrapper) wrapper.remove();
        }
    }

    // See if cloudflare is challenging - do I have to wait for page load?
    function checkCloudFlare(clickIt) {
        let active = false;
        if (document.querySelector("#challenge-form")) {
            active = true;
        } else if (location.href.indexOf('recaptcha') > -1) {
            active = true;
        } else if (document.querySelector(".iAmUnderAttack")) {
            active = true;
        } else {
            console.log(GM_info.script.name + " no active Cloudflare challenge detected.");
        }
        if (active == true) {
            console.log(GM_info.script.name + " Cloudflare challenge active!");
            return true;
        }
        return false;
    }

    function init() {
        if (window.tornFactionWidget) {
            console.log('Cleaning up existing widget');
            window.tornFactionWidget.cleanup();
        }

        if (!window[SCRIPT_ID]) {
            console.log('Singleton lock lost, script may have been cleaned up');
            return;
        }

        const initDelay = 500;
        console.log('Waiting', initDelay, 'ms before creating widget...');

        setTimeout(() => {
            try {
                if (!window[SCRIPT_ID]) {
                    console.log('Singleton lock lost during delay, aborting');
                    return;
                }
                window.tornFactionWidget = new TornFactionSearchWidget();
                window.tornFactionWidget.isFullyInitialized = true;

                // Handle any URL changes that might have been deferred during initialization
                setTimeout(() => {
                    if (window.tornFactionWidget && window.tornFactionWidget.isFullyInitialized) {
                        window.tornFactionWidget.handleUrlChange();
                    }
                }, 100);

            } catch (error) {
                console.error('Error creating widget:', error);
            }
        }, initDelay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', () => {
        if (!window.tornFactionWidget) {
            init();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (window.tornFactionWidget) {
            window.tornFactionWidget.cleanup();
        }
        delete window[SCRIPT_ID];
    });

})();