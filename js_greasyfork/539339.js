// ==UserScript==
// @name         Grok Feature Flags ORIGINAL DEPRECATED
// @namespace    http://tampermonkey.net/
// @version      2.55
// @description  Lets you turn on new and unreleased features for Grok.com, including boolean and non-boolean flags, with bold styling, gray text for unchanged flags, a hidden button to open flag picker until pi-ghost SVG appears, warning emojis and red text for problematic flags only after toggling, and validation to reset only problematic flags to defaults
// @author       Blankspeaker
// @match        https://grok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539339/Grok%20Feature%20Flags%20ORIGINAL%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/539339/Grok%20Feature%20Flags%20ORIGINAL%20DEPRECATED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug mode toggle
    const DEBUG_MODE = false;

    // Override console methods based on DEBUG_MODE
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    if (!DEBUG_MODE) {
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
    }

    // Restore console methods if DEBUG_MODE is true
    function restoreConsole() {
        if (DEBUG_MODE) {
            console.log = originalConsoleLog;
            console.warn = originalConsoleWarn;
            console.error = originalConsoleError;
        }
    }

    restoreConsole();

    console.log('[GrokFeatureFlags] Script started at', new Date().toISOString());

    try {
        // Cache for local_feature_flags, checkGate results, and defaults
        let flagsCache = null;
        let defaultFlags = null;
        let gateCache = new Map();
        let lastLoggedGates = new Set();
        let extractedFlags = {};

        // Problematic flags
        const problematicFlags = [
            'THINKING_AUTO_OPEN',
            'SHOW_ANON_HELP_LINK',
            'ENABLE_IN_APP_REPORTING',
            'SHOW_X_BADGE',
            'SHOW_FAVORITE_BUTTON'
        ];

        // Detect incognito mode
        function isIncognito() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return false;
            } catch (e) {
                return true;
            }
        }

        // Minimal environment check
        function logEnvironment() {
            console.log('[GrokFeatureFlags] Environment Check: localStorage available:', !isIncognito());
            console.log('[GrokFeatureFlags] Incognito mode detected:', isIncognito());
        }

        // Normalize flags to uppercase and remove duplicates/stale flags
        function normalizeFlags(flags) {
            const normalized = {};
            const seen = new Set();
            Object.keys(flags).forEach((key) => {
                const upperKey = key.toUpperCase();
                if (!seen.has(upperKey)) {
                    normalized[upperKey] = flags[key];
                    seen.add(upperKey);
                }
            });
            return normalized;
        }

        // Update localStorage and refresh cache
        function updateLocalStorage(flags, source = 'unknown') {
            try {
                const normalizedFlags = normalizeFlags(flags);
                localStorage.setItem('local_feature_flags', JSON.stringify(normalizedFlags));
                flagsCache = normalizedFlags;
                gateCache.clear();
                console.log(`[GrokFeatureFlags] local_feature_flags updated from ${source}:`, Object.keys(normalizedFlags).length, 'flags');
            } catch (e) {
                console.error('[GrokFeatureFlags] Failed to update localStorage:', e);
            }
        }

        // Update defaultFlags in localStorage
        function updateDefaultFlagsStorage(flags, source = 'unknown') {
            try {
                const normalizedFlags = normalizeFlags(flags);
                localStorage.setItem('default_feature_flags', JSON.stringify(normalizedFlags));
                defaultFlags = normalizedFlags;
                console.log(`[GrokFeatureFlags] default_feature_flags updated from ${source}:`, Object.keys(normalizedFlags).length, 'flags');
            } catch (e) {
                console.error('[GrokFeatureFlags] Failed to update default_feature_flags:', e);
            }
        }

        // Simulate flag change
        function simulateFlagChange() {
            try {
                const event = new StorageEvent('storage', {
                    key: 'local_feature_flags',
                    newValue: localStorage.getItem('local_feature_flags'),
                });
                window.dispatchEvent(event);
                console.log('[GrokFeatureFlags] Storage event dispatched.');
            } catch (e) {
                console.error('[GrokFeatureFlags] Failed to dispatch storage event:', e);
            }
        }

        // Early Statsig override
        function injectEarlyStatsigOverride() {
            console.log('[GrokFeatureFlags] Injecting early Statsig override...');
            const script = document.createElement('script');
            script.textContent = `
                (function() {
                    try {
                        const mockStatsig = {
                            checkGate: function(gateName) {
                                const flags = JSON.parse(localStorage.getItem('local_feature_flags') || '{}');
                                const flagKey = gateName.toUpperCase();
                                if (flagKey in flags) {
                                    console.log('[GrokFeatureFlags] Early Statsig checkGate using local storage for', gateName, ':', flags[flagKey]);
                                    return flags[flagKey];
                                }
                                return false;
                            }
                        };
                        let statsigClient = mockStatsig;
                        Object.defineProperty(window, 'Statsig', {
                            get: function() {
                                return { getClient: () => statsigClient };
                            },
                            set: function(value) {
                                statsigClient = value ? value.getClient() : mockStatsig;
                            },
                            configurable: true
                        });
                        console.log('[GrokFeatureFlags] Early Statsig override applied.');
                    } catch (e) {
                        console.error('[GrokFeatureFlags] Error in early Statsig override:', e);
                    }
                })();
            `;
            document.head.insertBefore(script, document.head.firstChild);
            console.log('[GrokFeatureFlags] Early Statsig override script injected.');
        }

        // Fallback Function.prototype.apply interceptor
        function setupFunctionInterceptor() {
            console.log('[GrokFeatureFlags] Setting up function interceptor...');
            const originalApply = Function.prototype.apply;
            Function.prototype.apply = function(thisArg, args) {
                try {
                    if (this.name === 'checkGate' && args && args[0]) {
                        const gateName = args[0];
                        const flagKey = gateName.toUpperCase();
                        if (!flagsCache) {
                            flagsCache = JSON.parse(localStorage.getItem('local_feature_flags') || '{}');
                        }
                        if (flagKey in flagsCache) {
                            if (!gateCache.has(gateName)) {
                                gateCache.set(gateName, flagsCache[flagKey]);
                                if (!lastLoggedGates.has(gateName)) {
                                    console.log('[GrokFeatureFlags] Fallback Intercepted checkGate for', gateName, 'returning', flagsCache[flagKey]);
                                    lastLoggedGates.add(gateName);
                                }
                            }
                            return gateCache.get(gateName);
                        }
                        if (!(flagKey in extractedFlags)) {
                            const value = originalApply.call(this, thisArg, args);
                            if (typeof value === 'boolean') {
                                extractedFlags[flagKey] = value;
                                if (!(flagKey in defaultFlags)) {
                                    defaultFlags[flagKey] = value;
                                    updateDefaultFlagsStorage(defaultFlags, 'checkGate');
                                    console.log('[GrokFeatureFlags] Captured flag via checkGate:', gateName, 'value:', value, 'set as default');
                                }
                            }
                            return value;
                        }
                        return originalApply.call(this, thisArg, args);
                    }
                    return originalApply.call(this, thisArg, args);
                } catch (e) {
                    console.error('[GrokFeatureFlags] Error in function interceptor:', e);
                    return originalApply.call(this, thisArg, args);
                }
            };
            console.log('[GrokFeatureFlags] Function interceptor applied.');
        }

        // Statsig interceptors for checkGate
        function setupStatsigInterceptor() {
            console.log('[GrokFeatureFlags] Setting up Statsig interceptor...');
            let originalCheckGate = null;
            let attemptCount = 0;
            const maxAttempts = 1000;

            function waitForStatsig() {
                if (window.Statsig && window.Statsig.getClient && window.Statsig.getClient().checkGate) {
                    const statsigClient = window.Statsig.getClient();
                    originalCheckGate = statsigClient.checkGate;

                    // Intercept checkGate (boolean flags)
                    statsigClient.checkGate = function(gateName) {
                        try {
                            if (!flagsCache) {
                                flagsCache = JSON.parse(localStorage.getItem('local_feature_flags') || '{}');
                            }
                            const flagKey = gateName.toUpperCase();
                            if (flagKey in flagsCache) {
                                if (!lastLoggedGates.has(gateName)) {
                                    console.log('[GrokFeatureFlags] Intercepted checkGate for', gateName, 'returning', flagsCache[flagKey]);
                                    lastLoggedGates.add(gateName);
                                }
                                return flagsCache[flagKey];
                            }
                            if (!(flagKey in extractedFlags)) {
                                const value = originalCheckGate.apply(this, arguments);
                                if (typeof value === 'boolean') {
                                    extractedFlags[flagKey] = value;
                                    if (!(flagKey in defaultFlags)) {
                                        defaultFlags[flagKey] = value;
                                        updateDefaultFlagsStorage(defaultFlags, 'checkGate');
                                        console.log('[GrokFeatureFlags] Captured flag via checkGate:', gateName, 'value:', value, 'set as default');
                                    }
                                }
                                return value;
                            }
                            return originalCheckGate.apply(this, arguments);
                        } catch (e) {
                            console.error('[GrokFeatureFlags] Error in checkGate interceptor:', e);
                            return originalCheckGate.apply(this, arguments);
                        }
                    };

                    console.log('[GrokFeatureFlags] Statsig interceptor applied for checkGate.');
                } else if (attemptCount < maxAttempts) {
                    attemptCount++;
                    setTimeout(waitForStatsig, 50);
                } else {
                    console.error('[GrokFeatureFlags] Failed to apply Statsig interceptor after', maxAttempts, 'attempts.');
                }
            }
            waitForStatsig();
        }

        // Poll for runtime flag object (fallback)
        function pollForFlags() {
            let pollAttempts = 0;
            const maxPollAttempts = 10;
            const pollInterval = setInterval(() => {
                try {
                    if (Object.keys(extractedFlags).length >= 78) {
                        console.log('[GrokFeatureFlags] Extracted flags from source:', Object.keys(extractedFlags));
                        clearInterval(pollInterval);
                        return;
                    }
                    pollAttempts++;
                    console.log('[GrokFeatureFlags] Polling attempt', pollAttempts, 'extracted', Object.keys(extractedFlags).length, 'flags');
                    if (pollAttempts >= maxPollAttempts) {
                        console.warn('[GrokFeatureFlags] Extracted', Object.keys(extractedFlags).length, 'flags after', maxPollAttempts, 'attempts');
                        clearInterval(pollInterval);
                        updateLocalStorage({ ...flagsCache, ...extractedFlags }, 'pollForFlags');
                    }
                } catch (e) {
                    console.error('[GrokFeatureFlags] Error polling for flags:', e);
                    clearInterval(pollInterval);
                }
            }, 500);
        }

        // Debounce function
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        // Compare values for bolding
        function isFlagModified(flagKey, currentValue) {
            const defaultValue = defaultFlags[flagKey] !== undefined ? defaultFlags[flagKey] : false;
            const isModified = currentValue !== defaultValue;
            console.log('[GrokFeatureFlags] Checking if flag modified:', flagKey, 'current:', currentValue, 'default:', defaultValue, 'modified:', isModified);
            return isModified;
        }

        // Check for problematic flag modifications
        function isProblematicFlagCombination(flags) {
            try {
                const modifiedProblematicFlags = problematicFlags.filter(flag => {
                    const currentValue = flags[flag] !== undefined ? flags[flag] : false;
                    const defaultValue = defaultFlags[flag] !== undefined ? defaultFlags[flag] : false;
                    return currentValue !== defaultValue;
                });
                if (modifiedProblematicFlags.length > 0) {
                    console.warn('[GrokFeatureFlags] Modified problematic flags detected:', modifiedProblematicFlags);
                    return true;
                }
                return false;
            } catch (e) {
                console.error('[GrokFeatureFlags] Error checking problematic flag combination:', e);
                return false;
            }
        }

        // Setup flag picker modal
        function setupFlagPicker() {
            console.log('[GrokFeatureFlags] Setting up flag picker modal...');
            // Inline styles for modal, overlay, hidden button, and warning
            const styles = `
                #grok-feature-flags-modal {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10001;
                    background: rgba(32, 34, 37, 0.7);
                    padding: 20px 10px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 600px;
                    box-sizing: border-box;
                    max-height: 80vh;
                    overflow-y: hidden;
                    color: white;
                    aria-label: "Feature Flags Picker";
                    opacity: 0;
                    transition: opacity 0.5s ease-in-out;
                }
                #grok-feature-flags-modal.visible {
                    display: block;
                    opacity: 1;
                }
                #grok-feature-flags-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                    z-index: 10000;
                }
                #grok-feature-flags-overlay.visible {
                    display: block;
                }
                #grok-feature-flags-hidden-button {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    width: 40px;
                    height: 40px;
                    opacity: 0;
                    z-index: 10002;
                    cursor: pointer;
                }
                #grok-feature-flags-warning {
                    display: none;
                    color: #EF4444;
                    font-size: 14px;
                    margin-bottom: 16px;
                    padding: 8px;
                    border: 1px solid #EF4444;
                    border-radius: 4px;
                    background: rgba(239, 68, 68, 0.1);
                }
                #grok-feature-flags-warning.visible {
                    display: block;
                }
                @media (max-width: 768px) {
                    #grok-feature-flags-modal {
                        padding: 15px 5px;
                    }
                    #grok-feature-flags-search,
                    #grok-feature-flags-save,
                    #grok-feature-flags-export,
                    #grok-feature-flags-import,
                    #grok-feature-flags-reset {
                        width: 100%;
                        box-sizing: border-box;
                    }
                }
                #grok-feature-flags-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                #grok-feature-flags-modal-header h2 {
                    font-size: 18px;
                    font-weight: bold;
                }
                #grok-feature-flags-modal-close {
                    color: #EF4444;
                    cursor: pointer;
                    font-size: 18px;
                }
                #grok-feature-flags-modal-close:hover {
                    color: #DC2626;
                }
                #grok-feature-flags-search {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 16px;
                    background: rgba(32, 34, 37, 0.7);
                    border: 1px solid #6B7280;
                    border-radius: 4px;
                    color: white;
                }
                #grok-feature-flags-search::placeholder {
                    color: #9CA3AF;
                }
                #grok-feature-flags-modal-container {
                    max-height: calc(60vh - 120px);
                    overflow-y: auto !important;
                    -webkit-overflow-scrolling: touch;
                    touch-action: pan-y;
                    margin-bottom: 16px;
                    min-height: 100px;
                }
                #grok-feature-flags-modal-container div {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                }
                #grok-feature-flags-modal-container input[type="checkbox"] {
                    margin-right: 8px;
                    width: 16px;
                    height: 16px;
                }
                #grok-feature-flags-modal-container label {
                    font-size: 14px;
                    margin-right: 8px;
                }
                #grok-feature-flags-modal-container .modified {
                    font-weight: bold;
                    color: white;
                }
                #grok-feature-flags-modal-container .default {
                    color: #9CA3AF;
                }
                #grok-feature-flags-modal-container .problematic {
                    color: #EF4444;
                }
                #grok-feature-flags-buttons {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                #grok-feature-flags-save,
                #grok-feature-flags-export,
                #grok-feature-flags-import,
                #grok-feature-flags-reset {
                    background: rgba(32, 34, 37, 0.7);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    flex: 1;
                    min-width: 80px;
                }
                #grok-feature-flags-save:hover,
                #grok-feature-flags-export:hover,
                #grok-feature-flags-import:hover,
                #grok-feature-flags-reset:hover {
                    background: rgba(26, 32, 44, 0.7);
                }
                #grok-feature-flags-import-input {
                    display: none;
                }
                #grok-feature-flags-description {
                    display: none;
                }
                #grok-feature-flags-menu-item:hover {
                    background: #4d4e51;
                }
            `;
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);

            // Create modal
            const modal = document.createElement('div');
            modal.id = 'grok-feature-flags-modal';
            modal.setAttribute('aria-describedby', 'grok-feature-flags-description');
            document.body.appendChild(modal);

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'grok-feature-flags-overlay';
            document.body.appendChild(overlay);

            // Create hidden button
            const hiddenButton = document.createElement('div');
            hiddenButton.id = 'grok-feature-flags-hidden-button';
            document.body.appendChild(hiddenButton);

            // Initialize modal content
            const header = document.createElement('div');
            header.id = 'grok-feature-flags-modal-header';
            const description = document.createElement('div');
            description.id = 'grok-feature-flags-description';
            description.innerText = 'A dialog to toggle boolean feature flags for the Grok application.';
            const warning = document.createElement('div');
            warning.id = 'grok-feature-flags-warning';
            warning.innerText = `Warning: Changes to critical flags (${problematicFlags.join(', ')}) may prevent the page from loading. Saving will reset them to safe defaults.`;
            const searchInput = document.createElement('input');
            searchInput.id = 'grok-feature-flags-search';
            searchInput.type = 'text';
            searchInput.placeholder = 'Search flags...';

            // Render flags with search filter, bolding, text color, and warning for problematic flags
            const renderFlagsDebounced = debounce(function(searchTerm) {
                console.log('[GrokFeatureFlags] Rendering flag picker with search:', searchTerm);
                try {
                    // Initialize modal content if empty
                    if (!modal.querySelector('#grok-feature-flags-modal-container')) {
                        modal.innerHTML = '';
                        modal.appendChild(header);
                        modal.appendChild(description);
                        modal.appendChild(warning);
                        modal.appendChild(searchInput);
                        const container = document.createElement('div');
                        container.id = 'grok-feature-flags-modal-container';
                        container.setAttribute('tabindex', '0');
                        modal.appendChild(container);
                        const buttonsContainer = document.createElement('div');
                        buttonsContainer.id = 'grok-feature-flags-buttons';
                        const saveButton = document.createElement('button');
                        saveButton.id = 'grok-feature-flags-save';
                        saveButton.innerText = 'Save Changes';
                        buttonsContainer.appendChild(saveButton);
                        const exportButton = document.createElement('button');
                        exportButton.id = 'grok-feature-flags-export';
                        exportButton.innerText = 'Export';
                        buttonsContainer.appendChild(exportButton);
                        const importButton = document.createElement('button');
                        importButton.id = 'grok-feature-flags-import';
                        importButton.innerText = 'Import';
                        buttonsContainer.appendChild(importButton);
                        const resetButton = document.createElement('button');
                        resetButton.id = 'grok-feature-flags-reset';
                        resetButton.innerText = 'Reset';
                        buttonsContainer.appendChild(resetButton);
                        const importInput = document.createElement('input');
                        importInput.id = 'grok-feature-flags-import-input';
                        importInput.type = 'file';
                        importInput.accept = '.json';
                        importInput.style.display = 'none';
                        buttonsContainer.appendChild(importInput);
                        modal.appendChild(buttonsContainer);

                        container.addEventListener('touchmove', (e) => {
                            e.stopPropagation();
                        }, { passive: true });
                    }

                    const container = modal.querySelector('#grok-feature-flags-modal-container');
                    container.innerHTML = '';

                    if (Object.keys(extractedFlags).length === 0 && (!flagsCache || Object.keys(flagsCache).length === 0)) {
                        console.warn('[GrokFeatureFlags] No flags available yet, showing loading state');
                        const loading = document.createElement('div');
                        loading.innerText = 'Loading flags...';
                        container.appendChild(loading);
                        header.innerHTML = `<h2>Grok Feature Flags (Total 0)</h2><span id="grok-feature-flags-modal-close">✕</span>`;
                        header.querySelector('#grok-feature-flags-modal-close').addEventListener('click', (e) => {
                            e.preventDefault();
                            modal.classList.remove('visible');
                            overlay.classList.remove('visible');
                        });
                        return;
                    }

                    flagsCache = { ...extractedFlags, ...flagsCache };
                    console.log('[GrokFeatureFlags] flagsCache keys:', Object.keys(flagsCache));

                    const booleanKeys = Object.keys(flagsCache).filter(key => typeof flagsCache[key] === 'boolean');
                    console.log('[GrokFeatureFlags] Boolean flags:', booleanKeys);

                    const filteredBooleanKeys = searchTerm
                        ? booleanKeys.filter((key) => key.toLowerCase().includes(searchTerm.toLowerCase()))
                        : booleanKeys;

                    const totalKeys = filteredBooleanKeys.length;
                    header.innerHTML = `<h2>Grok Feature Flags (Total ${totalKeys})</h2><span id="grok-feature-flags-modal-close">✕</span>`;
                    header.querySelector('#grok-feature-flags-modal-close').addEventListener('click', (e) => {
                        e.preventDefault();
                        modal.classList.remove('visible');
                        overlay.classList.remove('visible');
                    });

                    // Check for problematic flag modifications
                    const isProblematic = isProblematicFlagCombination(flagsCache);
                    warning.classList.toggle('visible', isProblematic);

                    if (totalKeys === 0) {
                        const noFlags = document.createElement('div');
                        noFlags.innerText = searchTerm ? 'No matching flags found' : 'No flags available';
                        container.appendChild(noFlags);
                    } else {
                        // Render boolean flags
                        filteredBooleanKeys.forEach((key) => {
                            const isModified = isFlagModified(key, flagsCache[key]);
                            console.log('[GrokFeatureFlags] Rendering boolean flag:', key, 'value:', flagsCache[key], 'modified:', isModified, 'textColor:', isModified ? 'white' : 'gray');
                            const flagDiv = document.createElement('div');
                            flagDiv.id = `flag-div-${key}`;
                            flagDiv.style.marginBottom = '8px';
                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.checked = flagsCache[key];
                            checkbox.id = `flag-${key}`;
                            flagDiv.appendChild(checkbox);
                            const label = document.createElement('label');
                            label.htmlFor = `flag-${key}`;
                            label.innerText = problematicFlags.includes(key) && isModified ? `⚠️ ${key}` : key;
                            if (isModified) {
                                label.classList.add('modified');
                            } else {
                                label.classList.add('default');
                            }
                            if (problematicFlags.includes(key) && isModified) {
                                label.classList.add('problematic');
                            }
                            flagDiv.appendChild(label);
                            container.appendChild(flagDiv);

                            // Update warning and label on flag change
                            checkbox.addEventListener('change', () => {
                                const tempFlags = { ...flagsCache, [key]: checkbox.checked };
                                const isProblematicNow = isProblematicFlagCombination(tempFlags);
                                warning.classList.toggle('visible', isProblematicNow);
                                const isNowModified = isFlagModified(key, checkbox.checked);
                                label.innerText = problematicFlags.includes(key) && isNowModified ? `⚠️ ${key}` : key;
                                if (isNowModified) {
                                    label.classList.remove('default');
                                    label.classList.add('modified');
                                } else {
                                    label.classList.remove('modified');
                                    label.classList.add('default');
                                }
                                if (problematicFlags.includes(key)) {
                                    if (isNowModified) {
                                        label.classList.add('problematic');
                                    } else {
                                        label.classList.remove('problematic');
                                    }
                                }
                            });
                        });
                    }

                    // Update save button handler
                    const saveButton = modal.querySelector('#grok-feature-flags-save');
                    saveButton.onclick = () => {
                        try {
                            console.log('[GrokFeatureFlags] Save button clicked, processing changes...');
                            const newFlags = { ...flagsCache };
                            // Save boolean flags
                            filteredBooleanKeys.forEach((key) => {
                                const input = document.getElementById(`flag-${key}`);
                                if (input) {
                                    const oldValue = newFlags[key];
                                    newFlags[key] = input.checked;
                                    console.log('[GrokFeatureFlags] Saving boolean flag:', key, 'old value:', oldValue, 'new value:', input.checked);
                                }
                            });
                            // Reset problematic flags if modified
                            if (isProblematicFlagCombination(newFlags)) {
                                console.warn('[GrokFeatureFlags] Modified problematic flags detected, resetting to safe defaults');
                                problematicFlags.forEach(flag => {
                                    if (isFlagModified(flag, newFlags[flag])) {
                                        newFlags[flag] = defaultFlags[flag] !== undefined ? defaultFlags[flag] : false;
                                        console.log('[GrokFeatureFlags] Reset problematic flag:', flag, 'to:', newFlags[flag]);
                                    }
                                });
                            }
                            updateLocalStorage(newFlags, 'saveButton');
                            simulateFlagChange();
                            lastLoggedGates.clear();
                            console.log('[GrokFeatureFlags] Saved flags, reloading page...');
                            setTimeout(() => window.location.reload(), 1000);
                        } catch (e) {
                            console.error('[GrokFeatureFlags] Error in save handler:', e);
                        }
                    };

                    // Export button handler
                    const exportButton = modal.querySelector('#grok-feature-flags-export');
                    exportButton.onclick = () => {
                        try {
                            const json = JSON.stringify(flagsCache, null, 2);
                            const blob = new Blob([json], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'grok_flags.json';
                            a.click();
                            URL.revokeObjectURL(url);
                            console.log('[GrokFeatureFlags] Exported', Object.keys(flagsCache).length, 'flags');
                        } catch (e) {
                            console.error('[GrokFeatureFlags] Error exporting flags:', e);
                        }
                    };

                    // Import button handler
                    const importButton = modal.querySelector('#grok-feature-flags-import');
                    const importInput = modal.querySelector('#grok-feature-flags-import-input');
                    importButton.onclick = () => {
                        importInput.click();
                    };
                    importInput.onchange = (e) => {
                        try {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                try {
                                    const importedFlags = JSON.parse(event.target.result);
                                    const newFlags = { ...flagsCache };
                                    let importedCount = 0;
                                    Object.keys(importedFlags).forEach(key => {
                                        const upperKey = key.toUpperCase();
                                        if (typeof importedFlags[key] === 'boolean') {
                                            const oldValue = newFlags[upperKey];
                                            newFlags[upperKey] = importedFlags[key];
                                            console.log('[GrokFeatureFlags] Importing flag:', upperKey, 'old value:', JSON.stringify(oldValue), 'new value:', JSON.stringify(newFlags[upperKey]));
                                            importedCount++;
                                        }
                                    });
                                    // Reset problematic flags if modified
                                    if (isProblematicFlagCombination(newFlags)) {
                                        console.warn('[GrokFeatureFlags] Imported modified problematic flags, resetting to safe defaults');
                                        problematicFlags.forEach(flag => {
                                            if (isFlagModified(flag, newFlags[flag])) {
                                                newFlags[flag] = defaultFlags[flag] !== undefined ? defaultFlags[flag] : false;
                                                console.log('[GrokFeatureFlags] Reset problematic flag:', flag, 'to:', newFlags[flag]);
                                            }
                                        });
                                    }
                                    updateLocalStorage(newFlags, 'importButton');
                                    simulateFlagChange();
                                    lastLoggedGates.clear();
                                    renderFlags(searchTerm);
                                    console.log('[GrokFeatureFlags] Imported', importedCount, 'flags');
                                    importInput.value = '';
                                } catch (err) {
                                    console.error('[GrokFeatureFlags] Error parsing imported flags:', err);
                                }
                            };
                            reader.readAsText(file);
                        } catch (e) {
                            console.error('[GrokFeatureFlags] Error importing flags:', e);
                        }
                    };

                    // Reset button handler
                    const resetButton = modal.querySelector('#grok-feature-flags-reset');
                    resetButton.onclick = () => {
                        try {
                            console.log('[GrokFeatureFlags] Reset button clicked, restoring defaults...');
                            localStorage.removeItem('local_feature_flags');
                            localStorage.removeItem('default_feature_flags');
                            defaultFlags = {};
                            flagsCache = {};
                            if (window.Statsig && window.Statsig.getClient) {
                                const statsigClient = window.Statsig.getClient();
                                Object.keys(flagsCache).forEach(key => {
                                    if (typeof flagsCache[key] === 'boolean') {
                                        try {
                                            const value = statsigClient.checkGate(key.toLowerCase());
                                            if (typeof value === 'boolean') {
                                                defaultFlags[key] = value;
                                                console.log('[GrokFeatureFlags] Captured default flag on reset:', key, 'value:', value);
                                            }
                                        } catch (e) {
                                            console.error('[GrokFeatureFlags] Error capturing default flag on reset:', key, e);
                                        }
                                    }
                                });
                                updateDefaultFlagsStorage(defaultFlags, 'resetButton');
                            }
                            updateLocalStorage(flagsCache, 'resetButton');
                            simulateFlagChange();
                            lastLoggedGates.clear();
                            console.log('[GrokFeatureFlags] Reset flags, restored', Object.keys(defaultFlags).length, 'default flags from source');
                            renderFlags(searchTerm);
                            setTimeout(() => window.location.reload(), 1000);
                        } catch (e) {
                            console.error('[GrokFeatureFlags] Error resetting flags:', e);
                        }
                    };

                    searchInput.value = searchTerm;
                } catch (e) {
                    console.error('[GrokFeatureFlags] Error rendering flags:', e);
                }
            }, 1000);

            function renderFlags(searchTerm) {
                renderFlagsDebounced(searchTerm);
            }

            searchInput.addEventListener('input', (e) => renderFlagsDebounced(e.target.value));

            // Toggle modal
            function toggleModal(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[GrokFeatureFlags] Modal toggle triggered, modal display:', modal.classList.contains('visible'));
                try {
                    const isOpening = !modal.classList.contains('visible');
                    if (isOpening) {
                        overlay.classList.add('visible');
                        modal.classList.add('visible');
                        const menu = document.querySelector('div[role="menu"][data-state="open"]');
                        if (menu) {
                            menu.setAttribute('data-state', 'closed');
                            menu.style.display = 'none';
                            console.log('[GrokFeatureFlags] Menu closed on modal open');
                        }
                        setTimeout(() => renderFlags(searchInput.value), 100);
                    } else {
                        modal.classList.remove('visible');
                        overlay.classList.remove('visible');
                    }
                } catch (err) {
                    console.error('[GrokFeatureFlags] Error toggling modal:', err);
                }
            }

            // Add click handler to hidden button
            hiddenButton.addEventListener('click', toggleModal);

            // Monitor for pi-ghost SVG and remove hidden button when found
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    const piGhostSvg = document.querySelector('svg[data-testid="pi-ghost"]');
                    if (piGhostSvg) {
                        console.log('[GrokFeatureFlags] pi-ghost SVG found, removing hidden button');
                        hiddenButton.remove();
                        observer.disconnect();
                    }
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Initial check for pi-ghost SVG
            if (document.querySelector('svg[data-testid="pi-ghost"]')) {
                console.log('[GrokFeatureFlags] pi-ghost SVG already present, not adding hidden button');
                hiddenButton.remove();
            }

            // Insert flag picker menu item
            function insertFlagPickerMenuItem() {
                const menu = document.querySelector('div[role="menu"][data-state="open"]');
                if (!menu) return;
                if (menu.querySelector('#grok-feature-flags-menu-item')) {
                    console.log('[GrokFeatureFlags] Flag picker menu item already exists');
                    return;
                }
                const menuItems = Array.from(menu.querySelectorAll('div[role="menuitem"]'));
                const settingsItem = menuItems.find(item => item.textContent.includes('Settings'));
                const languageItem = menuItems.find(item => item.textContent.includes('Language'));
                const targetItem = settingsItem || languageItem;
                if (!targetItem) {
                    console.warn('[GrokFeatureFlags] Neither Settings nor Language menu item found');
                    return;
                }
                const flagItem = document.createElement('div');
                flagItem.id = 'grok-feature-flags-menu-item';
                flagItem.setAttribute('role', 'menuitem');
                flagItem.setAttribute('tabindex', '-1');
                flagItem.setAttribute('data-orientation', 'vertical');
                flagItem.setAttribute('data-radix-collection-item', '');
                flagItem.className = 'relative flex select-none items-center cursor-pointer px-3 py-2 rounded-xl text-sm outline-none focus:bg-button-ghost-hover';
                flagItem.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" x2="4" y1="22" y2="15"></line>
                    </svg>
                    Flags
                `;
                flagItem.addEventListener('click', toggleModal);
                targetItem.insertAdjacentElement('afterend', flagItem);
                console.log('[GrokFeatureFlags] Flag picker menu item inserted after', targetItem.textContent.trim());
            }

            // Observe DOM for menu appearance
            const menuObserver = new MutationObserver((mutations) => {
                mutations.forEach(() => {
                    if (document.querySelector('div[role="menu"][data-state="open"]')) {
                        insertFlagPickerMenuItem();
                    }
                });
            });

            menuObserver.observe(document.body, { childList: true, subtree: true });

            // Initial check in case menu is already present
            insertFlagPickerMenuItem();

            console.log('[GrokFeatureFlags] Flag picker modal setup complete.');
        }

        // Initialize flagsCache and defaultFlags from localStorage
        try {
            const rawFlags = localStorage.getItem('local_feature_flags');
            console.log('[GrokFeatureFlags] Raw local_feature_flags:', rawFlags);
            flagsCache = JSON.parse(rawFlags || '{}');
            console.log('[GrokFeatureFlags] Initialized flagsCache with', Object.keys(flagsCache).length, 'flags');

            const rawDefaultFlags = localStorage.getItem('default_feature_flags');
            console.log('[GrokFeatureFlags] Raw default_feature_flags:', rawDefaultFlags);
            defaultFlags = JSON.parse(rawDefaultFlags || '{}');
            console.log('[GrokFeatureFlags] Initialized defaultFlags with', Object.keys(defaultFlags).length, 'flags');
        } catch (e) {
            console.error('[GrokFeatureFlags] Error initializing caches:', e);
            flagsCache = {};
            defaultFlags = {};
        }

        // Run strategies
        logEnvironment();
        injectEarlyStatsigOverride();
        setupFunctionInterceptor();
        setupStatsigInterceptor();
        pollForFlags();
        setupFlagPicker();
        updateLocalStorage(flagsCache, 'initialization');

    } catch (error) {
        console.error('[GrokFeatureFlags] Fatal error in script:', error);
    }
})();