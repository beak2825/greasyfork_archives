// ==UserScript==
// @name         SugarCube Variable Editor
// @namespace    lander_scripts
// @version      3.9.70
// @description  GUI to edit, freeze, and view SugarCube variables with favorites, local storage, and inline editing.
// @author       Lander
// @match        file:///*
// @icon         https://cdn-icons-png.flaticon.com/512/2774/2774028.png
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538151/SugarCube%20Variable%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/538151/SugarCube%20Variable%20Editor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Debugging Setup ---
    const DEBUG_KEY = 'scve_debug_enabled';
    let isDebugEnabled = GM_getValue(DEBUG_KEY, false);

    // Define log colors for different types
    const LOG_COLORS = {
        group: { prefix: '📂[SCVE GROUP]', color: '#00DDFF' },
        debug: { prefix: '[SCVE DEBUG]', color: '#81D4FA' },
        info:  { prefix: '[SCVE INFO]',  color: '#7CB342' },
        warn:  { prefix: '[SCVE WARN]',  color: '#FFEB3B' },
        error: { prefix: '[SCVE ERROR]', color: '#FF5252' } // Errors are always logged
    };

    /**
     * Centralized logging function.
     * Logs messages to the console based on type and debug mode.
     * @param {string} type - The type of log ('group', 'debug', 'info', 'warn', 'error').
     * @param {string} message - The log message.
     * @param {...any} args - Additional arguments to pass to console.log/error.
     */
    function debugLog(type, message, ...args) {
        const logStyle = LOG_COLORS[type] || LOG_COLORS.debug; // Default to debug if type is unknown

        if (isDebugEnabled) {
            // Errors are always logged to console.error
            if (type === 'warn') {
                console.warn(`%c${logStyle.prefix}%c ${message}`, `color: ${logStyle.color}; font-weight: bold;`, 'color: unset;', ...args);
            }
            if (type === 'group') {
                console.group(`%c------- ${logStyle.prefix}%c ${message}`, `color: ${logStyle.color}; font-weight: bold;`, 'color: unset;', ...args);
            }
            else {
                console.info(`%c${logStyle.prefix}%c ${message}`, `color: ${logStyle.color}; font-weight: bold;`, 'color: unset;', ...args);
            }

        }else if(type === 'error') {
            // Errors are always logged to console.error
            console.error(`%c${logStyle.prefix}%c ${message}`, `color: ${logStyle.color}; font-weight: bold;`, 'color: unset;', ...args);
        }
    }

    // Helper functions for specific log types to make calls cleaner
    function logGroupEnd(){console.groupEnd();}
    function logGroup(message, ...args) {debugLog('group', message, ...args);}
    function logDebug(message, ...args) {debugLog('debug', message, ...args);}
    function  logInfo(message, ...args) {debugLog('info',  message, ...args);}
    function  logWarn(message, ...args) {debugLog('warn',  message, ...args);}
    function logError(message, ...args) {debugLog('error', message, ...args);}

    logDebug("Script initialized. Debugging is currently:", isDebugEnabled);

    // Global state for frozen variables (paths and their last frozen value)
    const STORAGE_KEY_FAVS = 'sugarcube_variable_editor_favs';
    const STORAGE_KEY_FROZEN = 'sugarcube_variable_editor_frozen';
    const STORAGE_KEY_FROZEN_CACHED = 'sugarcube_variable_editor_frozen_cached';
    const STORAGE_KEY_TRACKED = 'sugarcube_variable_editor_tracked';
    const STORAGE_KEY_NUM_FORMAT_STYLE = 'scve_num_format_style';

    const frozenPaths = new Set();
    const frozenVarsCache = JSON.parse(localStorage.getItem(STORAGE_KEY_FROZEN_CACHED)) || {};

    let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY_FAVS) || '[]');
    let loadedFrozenData = JSON.parse(localStorage.getItem(STORAGE_KEY_FROZEN) || '[]');

    if (Array.isArray(loadedFrozenData)) {
        loadedFrozenData.forEach(path => frozenPaths.add(path));
    } else if (typeof loadedFrozenData === 'object' && loadedFrozenData !== null) {
        Object.keys(loadedFrozenData).forEach(path => frozenPaths.add(path));
    }

    let trackedPaths = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY_TRACKED) || '[]'));
    let numberFormattingStyle = GM_getValue(STORAGE_KEY_NUM_FORMAT_STYLE, 'en-US');

    logDebug("Loaded data from localStorage.\n⭐Favorites:", favorites,
             "\n\n❄️Frozen Paths:", Array.from(frozenPaths),
             "\n\n❄️Frozen Vars Cache:", frozenVarsCache,
             "\n\n🔎Tracked:", trackedPaths,
             "\n\n🔢Number format:", numberFormattingStyle
            );

    function saveFavorites() {
        localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
        logDebug("Favorites saved:", favorites);
    }

    function saveFrozenPaths() {
        localStorage.setItem(STORAGE_KEY_FROZEN, JSON.stringify(Array.from(frozenPaths)));
        localStorage.setItem(STORAGE_KEY_FROZEN_CACHED, JSON.stringify(frozenVarsCache));
        logDebug("Frozen paths saved:", Array.from(frozenPaths), "Frozen Vars Cache saved:", frozenVarsCache);
    }

    function saveTrackedState() {
        localStorage.setItem(STORAGE_KEY_TRACKED, JSON.stringify(Array.from(trackedPaths)));
        logDebug("Tracked state saved:", Array.from(trackedPaths));
    }

    function saveNumberFormattingSettings() {
        GM_setValue(STORAGE_KEY_NUM_FORMAT_STYLE, numberFormattingStyle);
        logDebug("Number formatting style saved:", numberFormattingStyle);
    }

    /**
     * Parses a string value into its appropriate JavaScript type (JSON, null, undefined, or original string).
     * @param {string} val - The value to parse.
     * @returns {any} The parsed value.
     */
    function parseValue(val) {
        if (typeof val !== 'string') {
            return val;
        }
        if (val === "undefined") {
            return undefined;
        }
        if (val === "null") {
            return null;
        }
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }

    /**
     * Converts a JavaScript value to a displayable string format.
     * Handles undefined, null, functions, numbers with formatting, and JSON stringification.
     * @param {any} value - The value to stringify.
     * @returns {string} The string representation of the value.
     */
    function stringifyForDisplay(value) {
        if (value === undefined) {
            return "undefined";
        }
        if (value === null) {
            return "null";
        }
        if (typeof value === 'function') {
            return "[Function]";
        }
        if (typeof value === 'number' && numberFormattingStyle !== 'none') {
            return formatNumber(value, numberFormattingStyle);
        }
        try {
            return JSON.stringify(value);
        } catch (e) {
            return `[Complex Object / Cannot Display: ${e.message}]`;
        }
    }

    /**
     * Formats a number based on the specified style.
     * @param {number} num The number to format.
     * @param {string} style The formatting style (e.g., 'en-US', 'de-DE', 'fr-FR', or 'none').
     * @returns {string} The formatted number string.
     */
    function formatNumber(num, style) {
        if (typeof num !== 'number' || isNaN(num) || style === 'none') {
            return String(num); // Return as string without formatting
        }

        const options = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2, // Allow up to 2 decimal places
            useGrouping: true // Enable thousands separators
        };

        return new Intl.NumberFormat(style, options).format(num);
    }

    /**
     * Safely gets the value of a variable path by traversing step-by-step.
     * @param {string} path - The variable path to access.
     * @returns {any} The value at the path, or undefined if any part is inaccessible.
     */
    function safeGetVariableValue(path) {
        if (typeof path !== 'string') {
            try {
                return path;
            } catch {
                return undefined;
            }
        }

        // Handle string paths using try-catch
        try {
            if (path === '') return undefined;

            // Use eval to safely access the variable
            return eval(`(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).${path}`);
        } catch {
            return undefined;
        }
    }

    // --- Freezing Logic (No Proxy) ---
    let uiElementsReady = false; // Flag for when UI elements are confirmed in DOM
    let hasInitialRenderOccurred = false; // Flag to ensure renderVars is called only once for initial display

    // Monitors for changes in frozen variables and reverts them
    let freezeMonitorIntervalId = null;

    /**
     * Starts the interval that periodically checks and reverts frozen variable values.
     * If no variables are frozen, the monitor will stop itself.
     */
    function startFreezeMonitor() {
        if (freezeMonitorIntervalId) {
            clearInterval(freezeMonitorIntervalId);
        }
        logDebug("Starting freeze monitor interval.");
        freezeMonitorIntervalId = setInterval(() => {
            if (frozenPaths.size === 0) {
                // If nothing is frozen, we can stop the monitor to save resources.
                clearInterval(freezeMonitorIntervalId);
                freezeMonitorIntervalId = null;
                logDebug("Freeze Monitor: No variables frozen, stopping monitor.");
                return;
            }

            for (const path of frozenPaths) {
                if (!(path in frozenVarsCache)) { // Should not happen if addFreeze works correctly
                    logError(`Freeze Monitor: Path "${path}" is frozen but not in cache. Removing.`);
                    removeFreeze(path);
                    continue;
                }

                try {
                    const currentValue = safeGetVariableValue(path);

                    // Path is currently undefined - skip but keep frozen
                    if (currentValue === undefined) {
                        logDebug(`Freeze Monitor: Path "${path}" not ready. Waiting...`);
                        continue; //continue statement is used within looping constructs (like for, while, and do...while loops) to skip the current iteration proceed directly to the next iteration.
                    }

                    const cachedValue = frozenVarsCache[path];

                    // Deep comparison for objects/arrays
                    let valuesMatch = false;
                    try {
                        valuesMatch = JSON.stringify(currentValue) === JSON.stringify(cachedValue);
                    } catch (e) {
                        // If stringify fails (e.g., circular structure), assume different or handle specially
                        valuesMatch = currentValue === cachedValue; // Fallback to shallow comparison
                    }

                    if (!valuesMatch) {
                        logDebug(`Freeze Monitor: Variable "${path}" changed from "${stringifyForDisplay(cachedValue)}" to "${stringifyForDisplay(currentValue)}". ↻Reverting!`);

                        try {
                            // Verify parent path exists before setting
                            const parentPath = path.substring(0, path.lastIndexOf('.'));
                            if (safeGetVariableValue(parentPath) !== undefined) {
                                unsafeWindow.eval(`${path} = ${JSON.stringify(cachedValue)};`);
                            } else {
                                logDebug(`Freeze Monitor: Parent "${parentPath}" not ready. Deferring revert.`);
                            }
                        } catch (e) {
                            logDebug(`Freeze Monitor: Could not revert "${path}". Error: ${e.message}. Will retry.`);
                        }
                    }
                } catch (e) {
                    logDebug(`Freeze Monitor: Error checking "${path}". Keeping frozen.`, e);
                }
            }
        }, 500); // Check every 500ms
    }

    /**
     * Adds a variable path to the frozen list and caches its current value.
     * @param {string} path - The variable path to freeze.
     * @param {any} value - The value to freeze the variable to.
     */
    function addFreeze(path, value) {
        frozenPaths.add(path);
        frozenVarsCache[path] = value;
        saveFrozenPaths();
        logDebug(`addFreeze: Freeze added for "${path}" with value:`, value);
        startFreezeMonitor(); // Ensure monitor is running if something is frozen
    }

    /**
     * Removes a variable path from the frozen list and its cached value.
     * @param {string} path - The variable path to unfreeze.
     */
    function removeFreeze(path) {
        frozenPaths.delete(path);
        delete frozenVarsCache[path];
        saveFrozenPaths();
        logDebug(`removeFreeze: Freeze removed for "${path}".`);
        // Monitor will stop itself if frozenPaths becomes empty
    }

    // --- UI Element References ---
    let scveStyleEl = null;
    let scveToggleEl = null;
    let scvePanelEl = null;
    let scveTrackerEl = null;
    let scveOptionsOverlayEl = null;

    let uiCreationIntervalId = null;

    /**
     * Calls renderVars() only once, when both SugarCube variables and UI elements are confirmed ready.
     */
    function checkAndPerformInitialRender() {
        if (uiElementsReady && !hasInitialRenderOccurred) {
            logDebug("checkAndPerformInitialRender: UI elements are ready. Performing initial render.");
            renderVars();
            hasInitialRenderOccurred = true;
        }
    }

    /**
     * Creates and attaches the UI elements to the DOM.
     * Handles re-creation if elements are missing or detached.
     * @returns {boolean} True if UI was successfully created/found and event listeners set up, false otherwise.
     */
    function createUI() {
        if (!document.body || document.readyState === 'loading') {
            return false;
        }

        const currentToggle = document.getElementById('scve-toggle');
        const isToggleAttached = currentToggle && document.body.contains(currentToggle);
        const needsRecreation = !currentToggle || !isToggleAttached || !scveToggleEl;

        if (!needsRecreation) {
            setupUIEventListeners();
            uiElementsReady = true; // Ensure flag is set if UI is already there
            checkAndPerformInitialRender(); // Call the checker
            return true;
        }

        logDebug("createUI: UI elements missing, detached, or stale references. Performing cleanup and re-creation.");
        // Clean up any stale references or existing elements
        if (scveStyleEl) { scveStyleEl.remove(); scveStyleEl = null; }
        if (scveToggleEl) { scveToggleEl.remove(); scveToggleEl = null; }
        if (scvePanelEl) { scvePanelEl.remove(); scvePanelEl = null; }
        if (scveTrackerEl) { scveTrackerEl.remove(); scveTrackerEl = null; }
        if (scveOptionsOverlayEl) { scveOptionsOverlayEl.remove(); scveOptionsOverlayEl = null; }

        // Ensure elements are physically removed from DOM if they exist from a prior run
        if (document.getElementById('scve-toggle')) { document.getElementById('scve-toggle').remove(); }
        if (document.getElementById('scve-panel')) { document.getElementById('scve-panel').remove(); }
        if (document.getElementById('scve-tracker')) { document.getElementById('scve-tracker').remove(); }
        if (document.getElementById('scve-options-overlay')) { document.getElementById('scve-options-overlay').remove(); }
        // Also check for existing style tag that might be ours but without the data-scve attribute
        const existingScveStyle = document.head.querySelector('style[data-scve]') || (document.head.querySelector('style:not([data-scve])') && document.head.querySelector('style:not([data-scve])').textContent.includes('#scve-toggle')) ? document.head.querySelector('style:not([data-scve])') : null;
        if (existingScveStyle) { existingScveStyle.remove(); }

        // Create and append style element
        scveStyleEl = document.createElement('style');
        scveStyleEl.setAttribute('data-scve', 'true');
        scveStyleEl.textContent = `#scve-toggle {
    user-select: none;
    position: fixed;
    top: 10px;
    right: 0;
    background: #4442;
    color: #fff;
    padding: 5px;
    border-radius: 5px 0 0 5px;
    cursor: pointer;
    z-index: 10000;
    font-size: 14px;
    transform: scale(0.8)
}
#scve-panel {
    position: fixed;
    right: -380px;
    bottom: 0;
    top: 0;
    width: 350px;
    background: #040813d1;
    backdrop-filter: blur(5px);
    box-shadow: -5px 0 15px black;
    color: #ddd;
    font-family: sans-serif;
    font-size: 13px;
    border-left: 2px solid #555;
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 9999;
    overflow-y: auto;
    transition: right 0.3s ease;
}
#scve-panel.open {
    right: 0;
}
#scve-panel h4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0;
    margin-bottom: 10px;
}
#scve-panel h4 button {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.2em;
    cursor: pointer;
    padding: 0 5px;
    margin-right: 15px;
}
#scve-vars {
    flex-grow: 1;
    overflow-y: auto;
    padding-bottom: 10px;
}
.scve-var {
    user-select: none;
    border-top: 1px solid #444;
    margin-top: 5px;
    padding-top: 12px;
    padding-bottom: 8px;
    overflow-x: hidden
    max-width: calc(100% - 20px);
}
.scve-var b {
    color: #8c6;
}
.scve-var code {
    color: #777;
    display: block;
    cursor: pointer;
    border-bottom: 1px dashed #777;
    display: inline-block;
    min-width: 20px;
}
.scve-var .scve-editable {
    cursor: pointer;
    border-bottom: 1px dashed #777;
    display: inline-block;
    min-width: 20px;
    margin-bottom: 6px;
    text-align: center;
}
.scve-var input[type="text"] {
    width: calc(100% - 10px);
    field-sizing: content;
    margin-bottom: 6px;
    background: #111;
    border: none;
	border-bottom: 1px dashed #777;
    padding: 2px;
}
.scve-var input[type="text"].scve-field-nickname {
	color: rgb(136, 204, 102);
	font-weight: 700;
}
.scve-var input[type="text"].scve-field-path {
	color: #777;
	font-family: monospace,monospace;
  	font-size: 1em;
}
.scve-var input[type="text"].scve-field-value {
  	width: auto;
}
.scve-actions button {
    margin-right: 5px;
    margin-top: 3px;
}
#scve-add-section {
    background: #2a2a40;
    padding: 8px;
    margin-top: 10px;
    border-radius: 5px;
}
#scve-add-section input {
    width: 100%;
    margin: 2px 0;
    background: #111;
    color: #eee;
    border: 1px solid #666;
    padding: 2px;
}
#scve-import-export {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 5px;
}
#scve-import-export button, #scve-import-export label {
    flex: 1;
    background: #333;
    color: #fff;
    padding: 5px;
    text-align: center;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
#scve-import-file {
    display: none;
}
#scve-tracker {
    user-select: none;
    position: fixed;
    top: 0;
    right: 41px;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(20px);
    border-radius: 0 0 4px 4px;
    color: #fff;
    font-size: 12px;
    padding: 4px 10px;
    max-width: 100vw;
    white-space: nowrap;
    overflow-x: auto;
    transition: right 0.3s ease, opacity 0.2s ease-in-out;
    opacity: 0.5;
}
#scve-tracker:hover {
    opacity: 1;
}
#scve-tracker:empty{
    visibility:hidden
}
#scve-vars {
	overflow-x: hidden;
}
.open + #scve-tracker{
    right: 418px;
}

/* --- Options Modal Styling --- */
#scve-options-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 10001;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}
#scve-options-overlay.open {
    opacity: 1;
    visibility: visible;
}
#scve-options-modal {
    background: #2a2a40;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    width: 300px;
    max-width: 90%;
    color: #ddd;
    font-family: sans-serif;
    font-size: 14px;
    position: relative;
}
#scve-options-modal h2 { /* Main Title */
    margin-top: 0;
    color: #8c6;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.5em;
}
#scve-options-modal h5 { /* Section Titles */
    margin-top: 0;
    color: #8c6;
    font-size: .9em; /* Changed font size */
    margin-bottom: 10px;
}
#scve-options-modal .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5em;
    cursor: pointer;
}
#scve-options-modal .option-group {
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #444;
}
#scve-options-modal .option-group:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}
#scve-options-modal label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}
#scve-options-modal input[type="checkbox"] {
    transform: scale(1.2);
}
/* Style for the select dropdown */
#scve-num-format-style {
    width: calc(100% + 2px); /* +2px to account for -1px margin on both sides */
    margin: -1px; /* Changed margin */
    padding: 5px 12px; /* Changed padding */
    background: #1e1e2e;
    color: #eee;
    border: 1px solid #444;
    border-radius: 0; /* Removed border-radius */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292%22%20height%3D%22292%22%3E%3Cpath%20fill%3D%22%23dddddd%22%20d%3D%22M287%2C197.351L146.001%2C56.351L5%2C197.351L19.351%2C211.702L146.001%2C85.053L272.65%2C211.702L287%2C197.351z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 10px top 50%;
    background-size: 12px auto;
    font-size: 1em;
    cursor: pointer;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
}
#scve-num-format-style:focus {
    outline: none;
    border-color: #8c6;
    box-shadow: 0 0 0 2px #8c66;
}
`;
        document.head.appendChild(scveStyleEl);

        // Create and append toggle button
        scveToggleEl = document.createElement('div');
        scveToggleEl.id = 'scve-toggle';
        scveToggleEl.textContent = '◀';
        document.body.appendChild(scveToggleEl);

        // Create and append panel
        scvePanelEl = document.createElement('div');
        scvePanelEl.id = 'scve-panel';
        scvePanelEl.innerHTML = `
            <h4>
                🧊 SugarCube Variable Editor
                <button id="scve-options-button" title="Options">⚙️</button>
            </h4>
            <div id="scve-vars"></div>
            <div id="scve-add-section">
                <h5 style="font-size: 16px; margin: 4px 0;">➕ Add Variable</h5>
                <input id="scve-nick" placeholder="Nickname">
                <input id="scve-path" placeholder="Variable path">
                <button id="scve-add">Add</button>
            </div>
            <div id="scve-import-export">
                <label for="scve-import-file">Import</label>
                <button id="scve-export">Export</button>
                <input type="file" id="scve-import-file">
            </div>
        `;
        document.body.appendChild(scvePanelEl);

        // Create and append tracker
        scveTrackerEl = document.createElement('div');
        scveTrackerEl.id = 'scve-tracker';
        document.body.appendChild(scveTrackerEl);

        // Create and append options overlay (modal)
        scveOptionsOverlayEl = document.createElement('div');
        scveOptionsOverlayEl.id = 'scve-options-overlay';
        scveOptionsOverlayEl.innerHTML = `
            <div id="scve-options-modal">
                <button class="close-button" id="scve-options-close">&times;</button>
                <h2 style="font-size: 1.5em;">OPTIONS</h2>
                <div class="option-group">
                    <h5>Debug Logging</h5>
                    <label>
                        <input type="checkbox" id="scve-debug-toggle">
                        Enable Debug Logging
                    </label>
                </div>
                <div class="option-group">
                    <h5>Number Formatting (Tracker)</h5>
                    <select id="scve-num-format-style">
                        <option value="none">⊘ No Formatting</option>
                        <option value="en-US">123,456.78 &#8195; 🇺🇸 / 🇬🇧</option>
                        <option value="de-DE">123.456,78 &#8195; 🇩🇪 / 🇪🇸 / 🇵🇹 / 🇧🇷</option>
                        <option value="fr-FR">123 456,78 &#8195; 🇫🇷 / 🇨🇭</option>
                    </select>
                </div>
            </div>
        `;
        document.body.appendChild(scveOptionsOverlayEl);

        // Final check to ensure elements are in DOM
        const finalCheckToggle = document.getElementById('scve-toggle');
        const finalCheckPanel = document.getElementById('scve-panel');

        if (finalCheckToggle && document.body.contains(finalCheckToggle) &&
            finalCheckPanel && document.body.contains(finalCheckPanel)) {
            logDebug("createUI: All UI elements successfully verified in DOM after creation. UI creation complete.");
            setupUIEventListeners();
            uiElementsReady = true; // Set flag when UI is ready
            checkAndPerformInitialRender(); // Call the checker
            return true;
        } else {
            logDebug("createUI: UI elements NOT successfully verified in DOM after creation. Will retry creation.");
            if (finalCheckToggle) finalCheckToggle._hasSCVEListeners = false; // Reset listener flag to force re-setup
            uiElementsReady = false; // Ensure flag is false if creation failed
            return false;
        }
    }

    /**
     * Sets up all event listeners for the UI elements.
     * Prevents duplicate listeners if called multiple times.
     */
    function setupUIEventListeners() {
        const toggle = scveToggleEl;
        const panel = scvePanelEl;
        const optionsOverlay = scveOptionsOverlayEl;
        const optionsButton = document.getElementById('scve-options-button');
        const optionsCloseButton = document.getElementById('scve-options-close');
        const debugToggleCheckbox = document.getElementById('scve-debug-toggle');
        const addVariableButton = document.getElementById('scve-add');
        const exportButton = document.getElementById('scve-export');
        const importFile = document.getElementById('scve-import-file');
        const nickInput = document.getElementById('scve-nick');
        const pathInput = document.getElementById('scve-path');
        const numFormatStyleSelect = document.getElementById('scve-num-format-style');

        // Basic sanity check for core UI elements
        if (!toggle || !panel || !optionsOverlay) {
            logError("setupUIEventListeners: Core UI elements are missing. Cannot set up listeners.");
            return;
        }

        // Prevent attaching duplicate listeners if already set up
        if (toggle._hasSCVEListeners === true) {
            logDebug("setupUIEventListeners: Listeners already attached, skipping re-attachment.");
            return;
        }

        toggle._hasSCVEListeners = true; // Mark that listeners have been attached
        logDebug("setupUIEventListeners: Attaching new UI event listeners to new/re-attached elements.");

        // Toggle button for panel visibility
        if (toggle) toggle.addEventListener('click', () => {
            const isOpen = panel.classList.toggle('open');
            toggle.textContent = isOpen ? '▶' : '◀';
            logDebug(`UI: Panel ${isOpen ? 'opened' : 'closed'}.`);
        });

        // Options button to open modal
        if (optionsButton) optionsButton.addEventListener('click', () => {
            optionsOverlay.classList.add('open');
            if (debugToggleCheckbox) debugToggleCheckbox.checked = isDebugEnabled;
            if (numFormatStyleSelect) numFormatStyleSelect.value = numberFormattingStyle;
            logDebug("UI: Options button clicked. Opening options modal.");
        });

        // Close options modal button
        if (optionsCloseButton) optionsCloseButton.addEventListener('click', () => {
            optionsOverlay.classList.remove('open');
            logDebug("UI: Options close button clicked. Closing options modal.");
        });

        // Close options modal when clicking outside
        if (optionsOverlay) optionsOverlay.addEventListener('click', (e) => {
            if (e.target === optionsOverlay) {
                optionsOverlay.classList.remove('open');
                logDebug("UI: Clicked outside options modal. Closing.");
            }
        });

        // Debug logging toggle checkbox
        if (debugToggleCheckbox) {
            debugToggleCheckbox.checked = isDebugEnabled;
            debugToggleCheckbox.addEventListener('change', (e) => {
                isDebugEnabled = e.target.checked;
                GM_setValue(DEBUG_KEY, isDebugEnabled);
                logInfo(`Debug logging ${isDebugEnabled ? 'ENABLED' : 'DISABLED'}.`);
            });
        }

        // Number formatting style select dropdown
        if (numFormatStyleSelect) {
            numFormatStyleSelect.addEventListener('change', (e) => {
                numberFormattingStyle = e.target.value;
                saveNumberFormattingSettings();
                updateTracker();
                renderVars();
                logDebug(`UI: Number formatting style changed to "${numberFormattingStyle}".`);
            });
        }

        // Add variable button
        if (addVariableButton) addVariableButton.addEventListener('click', () => {
            const nick = nickInput.value.trim();
            const path = pathInput.value.trim();
            if (nick && path) {
                favorites.push({ nick, path });
                saveFavorites();
                renderVars();
                nickInput.value = '';
                pathInput.value = '';
                logDebug(`UI: Added new variable "${nick}" with path "${path}".`);
            } else {
                alert('Nickname and path cannot be empty.'); // Use a custom modal in future
                logDebug("UI: Add variable failed, nickname or path empty.");
            }
        });

        // Export data button
        if (exportButton) exportButton.addEventListener('click', () => {
            logDebug("UI: Export button clicked.");
            const exportData = {
                favorites: favorites,
                frozenPaths: Array.from(frozenPaths),
                frozenVarsCache: frozenVarsCache,
                trackedPaths: Array.from(trackedPaths),
                numberFormatting: {
                    style: numberFormattingStyle
                }
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sugarcube_vars.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            logDebug("UI: Export initiated.");
        });

        // Import file input handler
        if (importFile) importFile.addEventListener('change', (e) => {
            logDebug("UI: Import file selected.");
            const file = e.target.files[0];
            if (!file) {
                logDebug("UI: No file selected for import.");
                return;
            }
            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data && Array.isArray(data.favorites)) {
                        logDebug("UI: Imported data structure seems valid.");
                        // Clear existing frozen state and cache
                        frozenPaths.clear();
                        for (const key in frozenVarsCache) {
                            delete frozenVarsCache[key];
                        }

                        // Update with imported data
                        favorites = data.favorites;
                        if (Array.isArray(data.frozenPaths)) {
                            data.frozenPaths.forEach(path => frozenPaths.add(path));
                        } else if (typeof data.frozenPaths === 'object' && data.frozenPaths !== null) {
                             Object.keys(data.frozenPaths).forEach(path => frozenPaths.add(path));
                        }
                        trackedPaths = new Set(data.trackedPaths || []);

                        if (data.numberFormatting && data.numberFormatting.style) {
                            numberFormattingStyle = data.numberFormatting.style;
                        }

                        Object.keys(frozenVarsCache).forEach(key => { //clears current cache of frozen variables
                            delete frozenVarsCache[key];
                        });
                        if (data.frozenVarsCache) {
                            Object.assign(frozenVarsCache, data.frozenVarsCache); // repopulates cache
                        }

                        // Save updated states to localStorage
                        saveFavorites();
                        saveFrozenPaths();
                        saveTrackedState();
                        saveNumberFormattingSettings();

                        startFreezeMonitor(); // Re-apply freezes with new data
                        renderVars(); // Draws ui again
                        alert('Data imported successfully!'); // Use custom modal in future
                        logDebug("UI: Data imported and freezes re-applied.");
                    } else {
                        alert('Invalid file format. Expected an object with "favorites" array.'); // Use custom modal in future
                        logDebug("UI: Invalid file format for import.");
                    }
                } catch (err) {
                    alert('Error parsing file: ' + err.message); // Use custom modal in future
                    logError("UI: Error parsing imported file:", err);
                }
                e.target.value = ''; // Clear file input
            };
            reader.readAsText(file);
        });
        logDebug("setupUIEventListeners: All UI event listeners set up.");
    }

    /**
     * Performs late initialization tasks after the DOM is ready.
     * Starts UI creation interval, tracker update interval, and hooks into SugarCube events.
     */
    function init() {
        logDebug("init: Function called. Starting UI creation interval.");

        if (uiCreationIntervalId) {
            clearInterval(uiCreationIntervalId);
            logDebug("init: Cleared existing UI creation interval.");
        }
        // Attempt to create UI periodically until successful
        uiCreationIntervalId = setInterval(() => {
            const uiSuccessfullyCreated = createUI();
            if (uiSuccessfullyCreated) {
                // If UI is successfully created/found, stop interval.
                // Initial render will be triggered by checkAndPerformInitialRender.
                clearInterval(uiCreationIntervalId);
                logDebug("init: UI creation interval stopping as UI is ready.");
            }
        }, 200);

        // Update tracker periodically
        setInterval(updateTracker, 1000);

        checkAndPerformInitialRender(); // Call the checker
        startFreezeMonitor(); // Start the freeze monitor

        // Hook into SugarCube events if jQuery is available
        if (typeof jQuery !== 'undefined') {
            $(document).on(':passageend', function () {
                logInfo(":passageend event detected. Initiating re-application of frozen variables and UI render.");
                startFreezeMonitor();
            });
            logDebug("init: SugarCube's :passageend event listener hooked via jQuery.");
        } else {
            logError("init: jQuery not found, SugarCube's :passageend event listener not hooked.");
        }
    }

    /**
     * Renders or re-renders the list of favorite variables in the UI panel.
     * Dynamically creates elements for each favorite variable, including display, editing, and action buttons.
     */
    function renderVars() {
        logDebug("renderVars: Starting variable rendering.");
        const container = document.getElementById('scve-vars');
        if (!container) {
            logError("UI container #scve-vars not found during renderVars. Cannot render variables.");
            return;
        }
        container.innerHTML = ''; // Clear existing content

        if (favorites.length === 0) {
            const noVarsMessage = document.createElement('p');
            noVarsMessage.style.textAlign = 'center';
            noVarsMessage.style.color = '#aaa';
            noVarsMessage.textContent = 'No variables added yet. Add some using the inputs below!';
            container.appendChild(noVarsMessage);
            logDebug("renderVars: No variables to render. Displaying message.");
            return;
        }

        favorites.forEach((fav, i) => {
            const div = document.createElement('div');
            div.className = 'scve-var';

            let value = safeGetVariableValue(fav.path);

            // Nickname display and inline editing
            const nicknameDisplay = document.createElement('b');
            nicknameDisplay.className = 'scve-editable';
            nicknameDisplay.textContent = fav.nick;
            nicknameDisplay.style.color = '#8c6';
            nicknameDisplay.addEventListener('click', () => {
                logDebug(`UI: Clicked nickname "${fav.nick}" for editing.`);
                const input = document.createElement('input');
                input.className = 'scve-field-nickname';
                input.type  = 'text';
                input.value = fav.nick;
                input.style.width = 'calc(100% - 20px)';
                input.addEventListener('blur', () => {
                    logDebug(`UI: Nickname edit blur. New value: ${input.value.trim()}`);
                    fav.nick = input.value.trim();
                    saveFavorites();
                    renderVars();
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        logDebug("UI: Nickname edit Enter key pressed.");
                        input.blur();
                    }
                });
                nicknameDisplay.replaceWith(input);
                input.focus();
            });
            div.appendChild(nicknameDisplay);
            div.appendChild(document.createElement('br'));

            // Path display and inline editing
            const pathCode = document.createElement('code');
            pathCode.className = 'scve-editable';
            pathCode.textContent = fav.path;
            pathCode.addEventListener('click', () => {
                logDebug(`UI: Clicked path "${fav.path}" for editing.`);
                const oldPath = fav.path;
                const input = document.createElement('input');
                input.className = 'scve-field-path';
                input.type  = 'text';
                input.value = fav.path;
                input.style.width = 'calc(100% - 20px)';
                input.addEventListener('blur', () => {
                    logDebug(`UI: Path edit blur. Old: "${oldPath}", New: "${input.value.trim()}"`);
                    const newPath = input.value.trim();
                    if (newPath && newPath !== oldPath) {
                        fav.path = newPath;
                        if (frozenPaths.has(oldPath)) {
                            removeFreeze(oldPath); // If path changed, unfreeze old path
                        }
                        if (trackedPaths.has(oldPath)) {
                            trackedPaths.delete(oldPath); // Untrack old path
                            saveTrackedState();
                        }
                        saveFavorites();
                        renderVars();
                        logDebug(`UI: Path updated from "${oldPath}" to "${newPath}".`);
                    } else {
                        renderVars(); // Revert UI if no change or cancelled
                        logDebug("UI: Path edit cancelled or no change.");
                    }
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        logDebug("UI: Path edit Enter key pressed.");
                        input.blur();
                    }
                });
                pathCode.replaceWith(input);
                input.focus();
            });
            div.appendChild(pathCode);
            div.appendChild(document.createElement('br'));

            // Value display and inline editing
            const valueLabel = document.createElement('label');
            valueLabel.textContent = 'Value: ';
            div.appendChild(valueLabel);

            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'scve-editable';
            // Display formatted number if applicable, otherwise stringify
            valueDisplay.textContent = typeof value === 'number' && numberFormattingStyle !== 'none' ? formatNumber(value, numberFormattingStyle) : stringifyForDisplay(value);

            valueDisplay.addEventListener('click', () => {
                logDebug(`UI: Clicked value for "${fav.path}" for editing.`);
                if (frozenPaths.has(fav.path)) {
                    alert('Cannot edit a frozen variable directly. Unfreeze it first.'); // Use custom modal in future
                    logDebug(`UI: Blocked attempt to edit frozen variable "${fav.path}".`);
                    return;
                }

                const input = document.createElement('input');
                input.className = 'scve-field-value';
                input.type = 'text';
                try {
                    input.value = stringifyForDisplay(safeGetVariableValue(fav.path)); // Populate input with current value
                } catch {
                    input.value = '[UI: Error reading value]';
                }

                input.addEventListener('blur', () => {
                    logDebug(`UI: Value edit blur for "${fav.path}". New value string: "${input.value}"`);
                    try {
                        const parsedVal = parseValue(input.value);
                        // Directly assign value in page context
                        unsafeWindow.eval(`${fav.path} = ${JSON.stringify(parsedVal)};`);
                        logDebug(`UI: Successfully updated value for "${fav.path}" to:`, parsedVal);
                    } catch (e) {
                        alert('Update failed: ' + e.message + '. Ensure path is valid and value type is compatible.'); // Use custom modal in future
                        logError('UI: Update failed for path:', fav.path, 'Error:', e);
                    }
                    renderVars(); // Re-render to show updated value
                });
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        logDebug("UI: Value edit Enter key pressed.");
                        input.blur();
                    }
                });
                valueDisplay.replaceWith(input); // Replace span with input for editing
                input.focus();
            });
            div.appendChild(valueDisplay);
            div.appendChild(document.createElement('br')); // Line break after value

            // Freeze status indicator
            if (frozenPaths.has(fav.path)) {
                const isPathAvailable = safeGetVariableValue(fav.path) !== undefined;
                const statusText = isPathAvailable ? "❄️ Frozen" : "❄️ Waiting...";

                const statusEl = document.createElement('span');
                statusEl.textContent = statusText;
                statusEl.className = 'scve-frozen-status';
                statusEl.style.color = isPathAvailable ? '#0af' : '#aaa';
                div.appendChild(statusEl);
            }

            // Real-time value update interval
            setTimeout(() => { // Use setTimeout to prevent blocking initial render
                 setInterval(() => {
                    const isInputActive = valueDisplay.parentNode && document.activeElement === valueDisplay.nextElementSibling;

                    if (!frozenPaths.has(fav.path) && !isInputActive) {
                        try {
                            const currentVal = safeGetVariableValue(fav.path);
                            const displayVal = typeof currentVal === 'number' && numberFormattingStyle !== 'none' ? formatNumber(currentVal, numberFormattingStyle) : stringifyForDisplay(currentVal);
                            if (valueDisplay.textContent !== displayVal) {
                                valueDisplay.textContent = displayVal;
                                logDebug(`UI: Real-time update for "${fav.path}". Value changed to:`, currentVal);
                            }
                        } catch (e) {
                            if (valueDisplay.textContent !== '[Error accessing path]') {
                                valueDisplay.textContent = '[Error accessing path]';
                            }
                        }
                    } else if (frozenPaths.has(fav.path) && valueDisplay.textContent !== (typeof frozenVarsCache[fav.path] === 'number' && numberFormattingStyle !== 'none' ? formatNumber(frozenVarsCache[fav.path], numberFormattingStyle) : stringifyForDisplay(frozenVarsCache[fav.path]))) {
                        // If frozen, display the cached frozen value
                        valueDisplay.textContent = typeof frozenVarsCache[fav.path] === 'number' && numberFormattingStyle !== 'none' ? formatNumber(frozenVarsCache[fav.path], numberFormattingStyle) : stringifyForDisplay(frozenVarsCache[fav.path]);
                        logDebug(`UI: Displaying cached frozen value for "${fav.path}":`, frozenVarsCache[fav.path]);
                    }
                }, 1000); // Check every 1000ms (1 second)
            }, 0);

            // Action buttons
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'scve-actions';

            const freezeButton = document.createElement('button');
            freezeButton.textContent = '❄️';
            freezeButton.style = frozenPaths.has(fav.path) ? '' : 'filter: grayscale(1);';
            freezeButton.title = 'Freze/Unfreze value';
            freezeButton.addEventListener('click', () => {
                logDebug(`UI: Freeze/Unfreeze button clicked for "${fav.path}". Currently frozen: ${frozenPaths.has(fav.path)}`);

                const path = fav.path;
                if (frozenPaths.has(path)) {
                    removeFreeze(path);
                } else {
                    try {
                        const currentVal = safeGetVariableValue(path);
                        addFreeze(path, currentVal);
                    } catch (e) {
                        alert('Failed to get variable value for freezing: ' + e.message); // Use custom modal in future
                        logError(`UI: Failed to get value for freezing "${path}":`, e);
                    }
                }
                renderVars(); // Re-render to update button state
            });
            actionsDiv.appendChild(freezeButton);

            const trackButton = document.createElement('button');
            trackButton.textContent = '🔎';
            trackButton.style = trackedPaths.has(fav.path) ? '' : 'filter: grayscale(1);';
            trackButton.title = 'Track value on top bar';
            trackButton.addEventListener('click', () => {
                logDebug(`UI: Track/Untrack button clicked for "${fav.path}". Currently tracked: ${trackedPaths.has(fav.path)}`);
                if (trackedPaths.has(fav.path)) {
                    trackedPaths.delete(fav.path);
                    logDebug(`UI: Untracked "${fav.path}".`);
                } else {
                    trackedPaths.add(fav.path);
                    logDebug(`UI: Tracked "${fav.path}".`);
                }
                saveTrackedState();
                updateTracker();
                renderVars(); // To update button text
            });
            actionsDiv.appendChild(trackButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.title = 'Delete - Attention, irreversible ⚠️';
            deleteButton.addEventListener('click', () => {
                logDebug(`UI: Delete button clicked for "${fav.nick}" (${fav.path}).`);
                // IMPORTANT: Use a custom modal instead of confirm() in real applications for better UI/UX.
                // For this script, sticking to alert/confirm for simplicity as per original.
                if (confirm(`Are you sure you want to delete "${fav.nick}" variable?`)) {
                    logDebug(`UI: Deleting "${fav.path}".`);
                    if (frozenPaths.has(fav.path)) {
                        removeFreeze(fav.path); // Also unfreeze if deleted
                    }
                    if (trackedPaths.has(fav.path)) {
                        trackedPaths.delete(fav.path); // Also untrack if deleted
                        saveTrackedState();
                    }
                    favorites.splice(i, 1); // Remove from favorites array
                    saveFavorites();
                    renderVars(); // Re-render the list
                    logDebug(`UI: "${fav.path}" deleted.`);
                } else {
                    logDebug(`UI: Deletion of "${fav.path}" cancelled.`);
                }
            });
            actionsDiv.appendChild(deleteButton);

            div.appendChild(actionsDiv);
            container.appendChild(div);
        });
        updateTracker(); // Ensure tracker updates immediately after rendering vars
        logDebug("renderVars: Variable rendering complete.");
    }

    /**
     * Updates the content of the real-time variable tracker display.
     * Shows the nickname and current/frozen value of tracked variables.
     */
    function updateTracker() {
        const parts = [];
        for (const fav of favorites) {
            if (trackedPaths.has(fav.path)) {
                const val = stringifyForDisplay(frozenPaths.has(fav.path) ? frozenVarsCache[fav.path] : safeGetVariableValue(fav.path));
                const color = frozenPaths.has(fav.path) ? 'color:#0af;' : '';

                parts.push(`<span title='${fav.path}'><span style='${color}'>${fav.nick}</span>: ${val}</span>`);
            }
        }
        const trackerEl = scveTrackerEl;
        if (trackerEl) {
            trackerEl.innerHTML = parts.join('  ');
        }
    }

    $(document).ready(() => {
        init();
    });
})();