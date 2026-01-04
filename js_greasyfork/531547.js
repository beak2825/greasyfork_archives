// ==UserScript==
// @name         VirusTotal Engine Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enhance VirusTotal file detection pages by highlighting specific engines
// @author       WUHUA
// @match        https://www.virustotal.com/gui/file/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/531547/VirusTotal%20Engine%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/531547/VirusTotal%20Engine%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Only run on file details or detection pages
    if (!window.location.href.match(/\/gui\/file\/[a-f0-9]+(\/?|\/detection)/i)) {
        return;
    }

    // Default configuration with reduced initial engines list
    const defaultConfig = {
        selectedEngines: [
            "Microsoft",
            "Kaspersky",
            "CrowdStrike Falcon",
            "TrendMicro",
            "ESET-NOD32",
        ],
        highlightColor: "#FFFF99", // Light yellow
        darkModeHighlightColor: "#665500", // Dark yellow
        reorderEngines: true // Move highlighted engines to top
    };

    // Load configuration
    let config = GM_getValue('vtEnhanceConfig', defaultConfig);
    let shadowRootsCache = new WeakMap(); // Cache for shadow roots
    let pendingHighlightTask = null;

    // Save configuration function
    function saveConfig() {
        GM_setValue('vtEnhanceConfig', config);
    }

    function isDarkMode() {
        try {
            const vtColorMode = localStorage.getItem('colorMode');
            if (vtColorMode) return vtColorMode === 'dark';
        } catch (e) { }

        return document.body.classList.contains('dark-theme') ||
            document.documentElement.classList.contains('dark') ||
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Apply base styles once
    function applyBaseStyles() {
        const darkMode = isDarkMode();
        const highlightColor = darkMode ? config.darkModeHighlightColor : config.highlightColor;

        GM_addStyle(`
            div.detection.vt-enhanced-engine {
                background-color: ${highlightColor} !important;
                box-shadow: 0 0 4px rgba(0,0,0,0.2) !important;
                border-radius: 4px !important;
                padding: 2px !important;
                margin: 2px 0 !important;
            }

            vt-ui-detections-list vt-ui-expandable.vt-enhanced-engine {
                background-color: ${highlightColor} !important;
                border-radius: 4px !important;
                margin: 2px 0 !important;
            }

            .vt-enhanced-engine span,
            .vt-enhanced-engine div {
                color: ${darkMode ? '#000' : '#000'} !important;
                font-weight: bold !important;
            }

            #vt-enhance-toggle {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #4CAF50;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                z-index: 9999;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }

            #vt-enhance-config {
                position: fixed;
                bottom: 50px;
                left: 20px;
                background: ${darkMode ? '#222' : 'white'};
                color: ${darkMode ? '#eee' : '#333'};
                border: 1px solid ${darkMode ? '#444' : '#ccc'};
                padding: 15px;
                z-index: 9999;
                box-shadow: 0 0 10px rgba(0,0,0,${darkMode ? '0.5' : '0.2'});
                max-height: 80vh;
                overflow-y: auto;
                display: none;
                border-radius: 5px;
                width: 320px;
            }

            .vt-enhance-section { margin-bottom: 15px; }

            .vt-enhance-button {
                background: ${darkMode ? '#444' : '#f0f0f0'};
                color: ${darkMode ? '#eee' : '#333'};
                border: 1px solid ${darkMode ? '#666' : '#ccc'};
                padding: 5px 10px;
                margin-right: 5px;
                cursor: pointer;
                border-radius: 3px;
            }

            .vt-enhance-save {
                background: #4CAF50;
                color: white;
                border: none;
            }

            .vt-enhance-quick-toggle {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                margin-left: 6px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                background-color: ${darkMode ? '#333' : '#eee'};
                color: ${darkMode ? '#aaa' : '#666'};
                border: 1px solid ${darkMode ? '#555' : '#ccc'};
                opacity: 0.7;
                transition: all 0.2s ease;
            }

            .vt-enhance-quick-toggle.active {
                background-color: #4CAF50;
                color: white;
                opacity: 1;
            }

            .vt-enhance-quick-toggle:hover {
                opacity: 1;
                transform: scale(1.1);
            }
        `);
    }

    // Create simplified UI
    function createConfigUI() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'vt-enhance-toggle';
        toggleBtn.textContent = 'VT Enhance';
        document.body.appendChild(toggleBtn);

        const configPanel = document.createElement('div');
        configPanel.id = 'vt-enhance-config';

        configPanel.innerHTML = `
            <h3>VirusTotal Engine Highlighter</h3>
            <p>Click ★ next to engine names to toggle highlighting</p>
            <div class="vt-enhance-section">
                <label><strong>Light Mode Color:</strong></label>
                <input type="color" id="vt-enhance-color" value="${config.highlightColor}">
            </div>
            <div class="vt-enhance-section">
                <label><strong>Dark Mode Color:</strong></label>
                <input type="color" id="vt-enhance-dark-color" value="${config.darkModeHighlightColor}">
            </div>
            <div class="vt-enhance-section">
                <label>
                    <input type="checkbox" id="vt-enhance-reorder" ${config.reorderEngines ? 'checked' : ''}>
                    <strong>Move highlighted to top</strong>
                </label>
            </div>
            <div class="vt-enhance-section">
                <button id="vt-enhance-save" class="vt-enhance-button vt-enhance-save">Save</button>
                <button id="vt-enhance-close" class="vt-enhance-button">Close</button>
            </div>
            <div class="vt-enhance-section">
                <button id="vt-enhance-export" class="vt-enhance-button">Export</button>
                <button id="vt-enhance-import" class="vt-enhance-button">Import</button>
            </div>
        `;

        document.body.appendChild(configPanel);

        // Event handlers
        toggleBtn.addEventListener('click', () => {
            const isVisible = configPanel.style.display === 'block';
            configPanel.style.display = isVisible ? 'none' : 'block';
        });

        document.getElementById('vt-enhance-save').addEventListener('click', saveSettings);
        document.getElementById('vt-enhance-close').addEventListener('click', () => {
            configPanel.style.display = 'none';
        });

        document.getElementById('vt-enhance-export').addEventListener('click', exportConfig);
        document.getElementById('vt-enhance-import').addEventListener('click', importConfig);
    }

    // Save settings function
    function saveSettings() {
        config.highlightColor = document.getElementById('vt-enhance-color').value;
        config.darkModeHighlightColor = document.getElementById('vt-enhance-dark-color').value;
        config.reorderEngines = document.getElementById('vt-enhance-reorder').checked;

        saveConfig();
        applyBaseStyles();
        scheduleHighlighting();

        document.getElementById('vt-enhance-config').style.display = 'none';

        // Show confirmation
        const notification = document.createElement('div');
        notification.textContent = 'Settings saved!';
        notification.style =
            'position:fixed; top:50px; right:20px; background:#4CAF50; ' +
            'color:white; padding:10px; border-radius:5px; z-index:10000;';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Config import/export
    function exportConfig() {
        const configStr = JSON.stringify(config);
        const blob = new Blob([configStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'vt_enhance_config.json';
        a.click();

        URL.revokeObjectURL(url);
    }

    function importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const importedConfig = JSON.parse(e.target.result);
                    if (importedConfig.selectedEngines && importedConfig.highlightColor) {
                        config = importedConfig;
                        saveConfig();
                        updateUIFromConfig();
                        scheduleHighlighting();
                        alert('Configuration imported successfully!');
                    } else {
                        alert('Invalid configuration file!');
                    }
                } catch (error) {
                    alert('Error importing configuration: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function updateUIFromConfig() {
        if (document.getElementById('vt-enhance-color')) {
            document.getElementById('vt-enhance-color').value = config.highlightColor;
            document.getElementById('vt-enhance-dark-color').value = config.darkModeHighlightColor;
            document.getElementById('vt-enhance-reorder').checked = config.reorderEngines;
        }
    }

    // Optimized Shadow DOM query function with caching
    function queryShadowDOM(selector, root = document.body, maxDepth = 10) {
        if (maxDepth <= 0) return [];

        // Check cache first for this root
        if (shadowRootsCache.has(root)) {
            const cachedResults = shadowRootsCache.get(root).querySelectorAll(selector);
            if (cachedResults.length > 0) {
                return [...cachedResults];
            }
        }

        const results = [...root.querySelectorAll(selector)];

        // Find elements with shadow roots
        const elementsWithShadow = [...root.querySelectorAll('*')]
            .filter(el => el.shadowRoot)
            .map(el => el.shadowRoot);

        // Cache shadow roots for future queries
        elementsWithShadow.forEach(shadowRoot => {
            if (!shadowRootsCache.has(shadowRoot)) {
                shadowRootsCache.set(shadowRoot, shadowRoot);
            }

            // Query inside shadow root
            results.push(...shadowRoot.querySelectorAll(selector));

            // Recursively search deeper, but limit depth
            results.push(...queryShadowDOM(selector, shadowRoot, maxDepth - 1));
        });

        return results;
    }

    function addToggleButton(engineNameEl, engineName) {
        // Check if button already exists
        if (engineNameEl.nextElementSibling?.classList?.contains('vt-enhance-quick-toggle')) {
            return;
        }

        // Create toggle button
        const toggleBtn = document.createElement('span');
        toggleBtn.className = 'vt-enhance-quick-toggle';
        toggleBtn.textContent = '★';
        toggleBtn.title = `Toggle highlighting for ${engineName}`;

        // Mark as active if engine is selected
        if (config.selectedEngines.includes(engineName)) {
            toggleBtn.classList.add('active');
        }

        // Add click handler
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            const index = config.selectedEngines.indexOf(engineName);
            if (index !== -1) {
                config.selectedEngines.splice(index, 1);
                toggleBtn.classList.remove('active');
            } else {
                config.selectedEngines.push(engineName);
                toggleBtn.classList.add('active');
            }

            saveConfig();
            scheduleHighlighting();
        });

        // Insert after engine name
        engineNameEl.parentNode?.insertBefore(toggleBtn, engineNameEl.nextSibling);
    }

    // Schedule highlighting with debounce
    function scheduleHighlighting() {
        if (pendingHighlightTask) {
            clearTimeout(pendingHighlightTask);
        }

        pendingHighlightTask = setTimeout(() => {
            highlightEngines();
            pendingHighlightTask = null;
        }, 200);
    }

    // Get detections container - optimized to look for the specific path
    function findDetectionsContainer() {
        // Find the vt-ui-detections-list
        const detectionsList = queryShadowDOM('vt-ui-detections-list')[0];
        if (!detectionsList?.shadowRoot) return null;

        // Find vt-ui-expandable inside shadow root
        const expandable = detectionsList.shadowRoot.querySelector('vt-ui-expandable');
        if (!expandable?.shadowRoot) return null;

        // Find content slot
        const contentSlot = expandable.shadowRoot.querySelector('slot[name="content"]');
        if (!contentSlot) return null;

        // Get assigned elements
        const contentElements = contentSlot.assignedElements();
        if (contentElements.length === 0) return null;

        // Find the span and then the detections div
        const contentSpan = contentElements[0];
        return contentSpan.querySelector('#detections');
    }

    function reorderHighlightedEngines() {
        const detectionsDiv = findDetectionsContainer();
        if (!detectionsDiv) {
            console.log('Could not find the detections container');
            return;
        }

        // Get all detection divs
        const detectionDivs = Array.from(detectionsDiv.querySelectorAll('.detection'));
        if (detectionDivs.length < 2) return;

        // Split into highlighted and non-highlighted engines
        const highlightedDivs = [];
        const nonHighlightedDivs = [];

        detectionDivs.forEach(div => {
            const engineName = getEngineNameFromElement(div);
            if (engineName && config.selectedEngines.includes(engineName)) {
                highlightedDivs.push(div);
            } else {
                nonHighlightedDivs.push(div);
            }
        });

        // Sort highlighted divs alphabetically
        highlightedDivs.sort((a, b) => {
            const aName = getEngineNameFromElement(a) || '';
            const bName = getEngineNameFromElement(b) || '';
            return aName.localeCompare(bName);
        });

        // Reorder elements
        const fragment = document.createDocumentFragment();

        // Remove and add highlighted divs
        highlightedDivs.forEach(div => {
            div.parentNode.removeChild(div);
            fragment.appendChild(div);
        });

        // Remove and add non-highlighted divs
        nonHighlightedDivs.forEach(div => {
            div.parentNode.removeChild(div);
            fragment.appendChild(div);
        });

        // Insert back into container
        detectionsDiv.appendChild(fragment);
    }

    // Extract engine name from element
    function getEngineNameFromElement(element) {
        try {
            // Try most common selector first
            const engineNameEl = element.querySelector('.engine-name');
            if (engineNameEl) {
                return engineNameEl.textContent.trim();
            }

            // Try other possible selectors
            const engineEl = element.querySelector('[data-tooltip-text]');
            if (engineEl) {
                return engineEl.textContent.trim();
            }

            if (element.hasAttribute && element.hasAttribute('label')) {
                return element.getAttribute('label');
            }

            const engineSpan = element.querySelector('.engine span');
            if (engineSpan) {
                return engineSpan.textContent.trim();
            }

            // Last attempt for any text content that could be an engine name
            const text = element.textContent.trim();
            if (text && text.length > 0 && text.length < 30 &&
                !text.includes('http') && !text.match(/^\d+$/)) {
                return text;
            }

            return null;
        } catch (e) {
            return null;
        }
    }

    // Main highlight function
    function highlightEngines() {
        // Remove previous highlighting
        document.querySelectorAll('.vt-enhanced-engine').forEach(el => {
            el.classList.remove('vt-enhanced-engine');
        });

        // Find engine name elements
        const engineNameElements = queryShadowDOM('.engine-name');

        // Add toggle buttons and highlight
        engineNameElements.forEach(engineNameEl => {
            try {
                const engineName = engineNameEl.textContent.trim();
                if (!engineName) return;

                addToggleButton(engineNameEl, engineName);

                if (config.selectedEngines.includes(engineName)) {
                    const detectionDiv = engineNameEl.closest('div.detection') ||
                        engineNameEl.closest('vt-ui-expandable') ||
                        engineNameEl.closest('tr') ||
                        engineNameEl.parentElement;

                    if (detectionDiv) {
                        detectionDiv.classList.add('vt-enhanced-engine');
                    }
                }
            } catch (e) { }
        });

        // Also try expandable elements
        queryShadowDOM('vt-ui-expandable').forEach(row => {
            try {
                const label = row.getAttribute('label');
                let engineName = label;

                if (!engineName) {
                    const nameElement = row.querySelector('span:first-child') ||
                        row.querySelector('.engine-name');
                    if (nameElement) {
                        engineName = nameElement.textContent.trim();
                    }
                }

                if (engineName && config.selectedEngines.includes(engineName)) {
                    row.classList.add('vt-enhanced-engine');
                }
            } catch (e) { }
        });

        // Reorder engines if option is enabled
        if (config.reorderEngines) {
            setTimeout(reorderHighlightedEngines, 50);
        }
    }

    // Monitor for page navigation in SPA
    function observePageChanges() {
        // URL change detection
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (location.href.match(/\/gui\/file\/[a-f0-9]+(\/?|\/detection)/i)) {
                    setTimeout(scheduleHighlighting, 1000);
                }
            }
        }).observe(document, { subtree: true, childList: true });

        // DOM changes that might contain detection results
        new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' &&
                    mutation.addedNodes.length > 0) {

                    // Look for nodes that might be detection-related
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            (node.tagName === 'VT-UI-DETECTIONS-LIST' ||
                                node.querySelector?.('.engine-name, vt-ui-expandable[label]'))) {
                            scheduleHighlighting();
                            return;
                        }
                    }
                }
            }
        }).observe(document.body, { childList: true, subtree: true });

        // Listen for tab changes
        document.addEventListener('click', event => {
            if (event.target.closest('vt-ui-tab, .nav-link, .tab')) {
                setTimeout(scheduleHighlighting, 500);
            }
        });
    }

    // Inject styles into shadow roots
    function injectShadowStyles() {
        const darkMode = isDarkMode();
        const highlightColor = darkMode ? config.darkModeHighlightColor : config.highlightColor;
        const styleText = `
            .vt-enhanced-engine {
                background-color: ${highlightColor} !important;
                font-weight: bold !important;
                box-shadow: 0 0 4px rgba(0,0,0,0.2) !important;
                border-radius: 4px !important;
            }
            .vt-enhance-quick-toggle {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                margin-left: 6px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                background-color: ${darkMode ? '#333' : '#eee'};
                color: ${darkMode ? '#aaa' : '#666'};
                border: 1px solid ${darkMode ? '#555' : '#ccc'};
                opacity: 0.7;
                transition: all 0.2s ease;
            }
            .vt-enhance-quick-toggle.active {
                background-color: #4CAF50;
                color: white;
                opacity: 1;
            }
            .vt-enhance-quick-toggle:hover {
                opacity: 1;
            }
        `;

        // Find all shadow roots and inject styles
        function injectToShadows(root = document) {
            root.querySelectorAll('*').forEach(el => {
                if (el.shadowRoot && !el.shadowRoot.querySelector('#vt-enhance-style')) {
                    const style = document.createElement('style');
                    style.id = 'vt-enhance-style';
                    style.textContent = styleText;
                    el.shadowRoot.appendChild(style);

                    // Check one level deeper
                    injectToShadows(el.shadowRoot);
                }
            });
        }

        injectToShadows();
    }

    // Initialize the script
    function init() {
        applyBaseStyles();
        createConfigUI();

        // Initial highlighting with progressive attempts
        setTimeout(() => {
            injectShadowStyles();
            scheduleHighlighting();
        }, 1500);

        setTimeout(() => {
            injectShadowStyles();
            scheduleHighlighting();
        }, 3000);

        // Set up observers
        observePageChanges();

        // Listen for theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                applyBaseStyles();
                injectShadowStyles();
                scheduleHighlighting();
            });
        }
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();