// ==UserScript==
// @name         GMRE Helper
// @namespace    https://github.com/gncnpk/gmre-helper
// @version      0.0.13
// @description  Adds quality-of-life tweaks to Google Maps Road Editor.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://maps.google.com/roadeditor/iframe*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com/maps
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543166/GMRE%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/543166/GMRE%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const roadTypes = {
        "LOCAL_ROAD": 0,
        "HIGHWAY": 1,
        "PARKING_LOT": 2,
        "BIKING_WALKING_TRAIL": 3,
    };

    // Default key bindings configuration
    const defaultKeyBindings = {
        'i': {
            action: 'startNewRoad',
            description: 'Start New Road'
        },
        'Enter': {
            action: 'finishAction',
            description: 'Finish/Submit Action'
        },
        '1': {
            action: 'selectRoadType',
            param: roadTypes.LOCAL_ROAD,
            description: 'Select Local Road'
        },
        '2': {
            action: 'selectRoadType',
            param: roadTypes.HIGHWAY,
            description: 'Select Highway'
        },
        '3': {
            action: 'selectRoadType',
            param: roadTypes.PARKING_LOT,
            description: 'Select Parking Lot'
        },
        '4': {
            action: 'selectRoadType',
            param: roadTypes.BIKING_WALKING_TRAIL,
            description: 'Select Biking/Walking Trail'
        },
        'z': {
            action: 'undo',
            description: 'Undo'
        },
        'y': {
            action: 'redo',
            description: 'Redo'
        },
        'Delete': {
            action: 'deleteRoad',
            description: 'Delete Road'
        },
        's': {
            action: 'simplifyRoad',
            description: 'Simplify Road'
        },
        'Escape': {
            action: 'back',
            description: 'Back/Exit'
        },
        '+': {
            action: 'zoomIn',
            description: 'Zoom In'
        }, // ← new
        '-': {
            action: 'zoomOut',
            description: 'Zoom Out'
        }, // ← new
        'p': {
            action: 'markPrivateRoad',
            description: 'Mark Private Road'
        }, // ← new
        '`': {
            action: 'toggleSettings',
            description: 'Toggle Settings Panel'
        }
    };

    // Available actions
    const actions = {
        startNewRoad,
        finishAction,
        selectRoadType,
        undo,
        redo,
        deleteRoad,
        toggleSettings,
        simplifyRoad,
        back,
        zoomIn, // ← added
        zoomOut,
        markPrivateRoad
    };

    let keyBindings = {};
    let settingsPanel = null;
    let isSettingsOpen = false;

    function logConsole(msg) {
        console.log("Google Maps Road Editor Helper: " + msg);
    }

    function loadKeyBindings() {
        const stored = localStorage.getItem('gmre-helper-keybindings');
        if (stored) {
            try {
                keyBindings = {
                    ...defaultKeyBindings,
                    ...JSON.parse(stored)
                };
            } catch (e) {
                logConsole("Error loading saved key bindings, using defaults");
                keyBindings = {
                    ...defaultKeyBindings
                };
            }
        } else {
            keyBindings = {
                ...defaultKeyBindings
            };
        }
    }

    function saveKeyBindings() {
        const customBindings = {};
        Object.keys(keyBindings).forEach(key => {
            if (JSON.stringify(keyBindings[key]) !== JSON.stringify(defaultKeyBindings[key])) {
                customBindings[key] = keyBindings[key];
            }
        });
        localStorage.setItem('gmre-helper-keybindings', JSON.stringify(customBindings));
    }

    function addKeyBinding(key, actionName, param, description) {
        keyBindings[key] = {
            action: actionName,
            param: param,
            description: description || `${actionName}${param ? ` (${param})` : ''}`
        };
        saveKeyBindings();
        updateSettingsPanel();
    }

    function removeKeyBinding(key) {
        delete keyBindings[key];
        saveKeyBindings();
        updateSettingsPanel();
    }

    function setupKeyListener() {
        document.addEventListener("keydown", (e) => {
            // Don't trigger if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            const key = e.key;
            const binding = keyBindings[key];

            if (binding && actions[binding.action]) {
                e.preventDefault();
                if (binding.param !== null && binding.param !== undefined) {
                    actions[binding.action](binding.param);
                } else {
                    actions[binding.action]();
                }
            }
        });
    }

    function createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        if (textContent) {
            element.textContent = textContent;
        }
        return element;
    }

    function createSettingsPanel() {
        // Create main panel
        settingsPanel = createElement('div', {
            id: 'gmre-settings-panel'
        });

        // Create content container
        const content = createElement('div', {
            id: 'gmre-settings-content'
        });

        // Create header
        const header = createElement('div', {
            id: 'gmre-settings-header'
        });
        const title = createElement('h3', {}, 'GMRE Helper - Key Bindings');
        const closeBtn = createElement('button', {
            id: 'gmre-close-settings'
        }, '×');
        header.appendChild(title);
        header.appendChild(closeBtn);

        // Create body
        const body = createElement('div', {
            id: 'gmre-settings-body'
        });

        // Create bindings list
        const bindingsList = createElement('div', {
            id: 'gmre-bindings-list'
        });

        // Create add binding section
        const addBinding = createElement('div', {
            id: 'gmre-add-binding'
        });
        const addTitle = createElement('h4', {}, 'Add New Binding');
        addBinding.appendChild(addTitle);

        // Key input
        const keyDiv = createElement('div');
        const keyLabel = createElement('label', {}, 'Key:');
        const keyInput = createElement('input', {
            type: 'text',
            id: 'gmre-new-key',
            placeholder: 'Enter key',
            maxlength: '10'
        });
        keyDiv.appendChild(keyLabel);
        keyDiv.appendChild(keyInput);

        // Action select
        const actionDiv = createElement('div');
        const actionLabel = createElement('label', {}, 'Action:');
        const actionSelect = createElement('select', {
            id: 'gmre-new-action'
        });

        const actionOptions = [{
                value: 'startNewRoad',
                text: 'Start New Road'
            },
            {
                value: 'finishAction',
                text: 'Finish Action'
            },
            {
                value: 'selectRoadType',
                text: 'Select Road Type'
            },
            {
                value: 'undo',
                text: 'Undo'
            },
            {
                value: 'redo',
                text: 'Redo'
            },
            {
                value: 'deleteRoad',
                text: 'Delete Road'
            },
            {
                value: 'simplifyRoad',
                text: 'Simplify Road'
            },
            {
                value: 'back',
                text: 'Back/Exit'
            },
            {
                value: 'toggleSettings',
                text: 'Toggle Settings Panel'
            },
            {
                value: 'zoomIn',
                text: 'Zoom In'
            }, // ← new
            {
                value: 'zoomOut',
                text: 'Zoom Out'
            }, // ← new
            {
                value: 'markPrivateRoad',
                text: 'Mark Private Road'
            }
        ];

        actionOptions.forEach(option => {
            const opt = createElement('option', {
                value: option.value
            }, option.text);
            actionSelect.appendChild(opt);
        });

        actionDiv.appendChild(actionLabel);
        actionDiv.appendChild(actionSelect);

        // Road type selector (hidden initially)
        const roadTypeDiv = createElement('div', {
            id: 'gmre-road-type-selector',
            style: 'display: none;'
        });
        const roadTypeLabel = createElement('label', {}, 'Road Type:');
        const roadTypeSelect = createElement('select', {
            id: 'gmre-new-param'
        });

        const roadTypeOptions = [{
                value: roadTypes.LOCAL_ROAD,
                text: 'Local Road'
            },
            {
                value: roadTypes.HIGHWAY,
                text: 'Highway'
            },
            {
                value: roadTypes.PARKING_LOT,
                text: 'Parking Lot'
            },
            {
                value: roadTypes.BIKING_WALKING_TRAIL,
                text: 'Biking/Walking Trail'
            }
        ];

        roadTypeOptions.forEach(option => {
            const opt = createElement('option', {
                value: option.value
            }, option.text);
            roadTypeSelect.appendChild(opt);
        });

        roadTypeDiv.appendChild(roadTypeLabel);
        roadTypeDiv.appendChild(roadTypeSelect);

        // Add button
        const addBtn = createElement('button', {
            id: 'gmre-add-btn'
        }, 'Add Binding');

        // Assemble add binding section
        addBinding.appendChild(keyDiv);
        addBinding.appendChild(actionDiv);
        addBinding.appendChild(roadTypeDiv);
        addBinding.appendChild(addBtn);

        // Create footer
        const footer = createElement('div', {
            id: 'gmre-settings-footer'
        });
        const resetBtn = createElement('button', {
            id: 'gmre-reset-defaults'
        }, 'Reset to Defaults');
        footer.appendChild(resetBtn);

        // Assemble body
        body.appendChild(bindingsList);
        body.appendChild(addBinding);
        body.appendChild(footer);

        // Assemble content
        content.appendChild(header);
        content.appendChild(body);

        // Assemble panel
        settingsPanel.appendChild(content);

        // Add styles
        const style = createElement('style');
        style.textContent = `
            #gmre-settings-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: none;
            }
            #gmre-settings-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 8px;
                width: 500px;
                max-height: 600px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            #gmre-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #ddd;
                background: #f5f5f5;
                border-radius: 8px 8px 0 0;
            }
            #gmre-settings-header h3 {
                margin: 0;
                color: #333;
            }
            #gmre-close-settings {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            #gmre-settings-body {
                padding: 20px;
                max-height: 500px;
                overflow-y: auto;
            }
            .gmre-binding-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }
            .gmre-binding-key {
                font-family: monospace;
                background: #f0f0f0;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
            }
            .gmre-binding-description {
                flex: 1;
                margin: 0 16px;
                color: #666;
            }
            .gmre-remove-btn {
                background: #ff4444;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            #gmre-add-binding {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 2px solid #ddd;
            }
            #gmre-add-binding h4 {
                margin-top: 0;
                color: #333;
            }
            #gmre-add-binding div {
                margin-bottom: 12px;
            }
            #gmre-add-binding label {
                display: inline-block;
                width: 80px;
                font-weight: bold;
            }
            #gmre-add-binding input, #gmre-add-binding select {
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                width: 150px;
            }
            #gmre-add-btn, #gmre-reset-defaults {
                background: #4285f4;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 8px;
            }
            #gmre-reset-defaults {
                background: #ff6b6b;
            }
            #gmre-settings-footer {
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid #ddd;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(settingsPanel);

        // Event listeners
        closeBtn.addEventListener('click', toggleSettings);
        actionSelect.addEventListener('change', function() {
            const roadTypeSelector = document.getElementById('gmre-road-type-selector');
            roadTypeSelector.style.display = this.value === 'selectRoadType' ? 'block' : 'none';
        });
        addBtn.addEventListener('click', addNewBinding);
        resetBtn.addEventListener('click', resetToDefaults);

        settingsPanel.addEventListener('click', function(e) {
            if (e.target === settingsPanel) {
                toggleSettings();
            }
        });

        updateSettingsPanel();
    }

    function updateSettingsPanel() {
        if (!settingsPanel) return;

        const bindingsList = document.getElementById('gmre-bindings-list');
        // Clear existing content
        while (bindingsList.firstChild) {
            bindingsList.removeChild(bindingsList.firstChild);
        }

        Object.entries(keyBindings).forEach(([key, binding]) => {
            const item = createElement('div', {
                class: 'gmre-binding-item'
            });

            const keySpan = createElement('span', {
                class: 'gmre-binding-key'
            }, key);
            const descSpan = createElement('span', {
                class: 'gmre-binding-description'
            }, binding.description);
            const removeBtn = createElement('button', {
                class: 'gmre-remove-btn',
                'data-key': key
            }, 'Remove');

            item.appendChild(keySpan);
            item.appendChild(descSpan);
            item.appendChild(removeBtn);
            bindingsList.appendChild(item);
        });

        // Add click listeners for remove buttons
        bindingsList.addEventListener('click', function(e) {
            if (e.target.classList.contains('gmre-remove-btn')) {
                const key = e.target.getAttribute('data-key');
                removeKeyBinding(key);
            }
        });
    }

    function addNewBinding() {
        const key = document.getElementById('gmre-new-key').value.trim();
        const action = document.getElementById('gmre-new-action').value;
        const param = action === 'selectRoadType' ?
            parseInt(document.getElementById('gmre-new-param').value) : undefined;

        if (!key || !action) {
            alert('Please fill in all required fields');
            return;
        }

        if (keyBindings[key]) {
            if (!confirm(`Key "${key}" is already bound. Replace it?`)) {
                return;
            }
        }

        const description = action === 'selectRoadType' ?
            `Select ${Object.keys(roadTypes).find(k => roadTypes[k] === param).replace('_', ' ')}` :
            action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        addKeyBinding(key, action, param, description);

        // Clear form
        document.getElementById('gmre-new-key').value = '';
        document.getElementById('gmre-new-action').selectedIndex = 0;
        document.getElementById('gmre-road-type-selector').style.display = 'none';
    }

    function resetToDefaults() {
        if (confirm('Reset all key bindings to defaults? This cannot be undone.')) {
            keyBindings = {
                ...defaultKeyBindings
            };
            saveKeyBindings();
            updateSettingsPanel();
        }
    }

    function toggleSettings() {
        if (!settingsPanel) {
            createSettingsPanel();
        }

        isSettingsOpen = !isSettingsOpen;
        settingsPanel.style.display = isSettingsOpen ? 'block' : 'none';
    }

    // Action functions
    function startNewRoad() {
        try {
            document
                .getElementsByClassName(
                    "VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe LQeN7 s73B3c wF1tve Q8G3mf",
                )[0]
                .children[2].click();
        } catch {
            logConsole("New road button not found...");
        }
    }

    function finishAction() {
        try {
            Array.from(document.getElementsByClassName("VfPpkd-RLmnJb")).filter((e) => {
                return e.parentElement.innerText === "Done" || e.parentElement.innerText === "Submit"
            })[0].click();
        } catch {
            logConsole("Finish button not found...");
        }
    }

    function selectRoadType(roadType) {
        try {
            document.getElementsByClassName("gzWBWb")[roadType].children[0].children[0].children[0].click();
            finishAction();
        } catch {
            logConsole("Road type option not found...");
        }
    }

    function undo() {
        try {
            document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe LQeN7 s73B3c MyHLpd zWXP4b Q8G3mf")[0].click();
        } catch {
            logConsole("Undo button not found...");
        }
    }

    function redo() {
        try {
            document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe LQeN7 s73B3c MyHLpd zWXP4b Q8G3mf")[1].click();
        } catch {
            logConsole("Redo button not found...");
        }
    }

    function deleteRoad() {
        try {
            document.getElementsByClassName("VfPpkd-muHVFf-bMcfAe")[4].click();
            finishAction();
        } catch {
            logConsole("Delete road button not found...");
        }
    }

    function back() {
        try {
            document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc VfPpkd-LgbsSe-OWXEXe-Bz112c-M1Soyc VfPpkd-LgbsSe-OWXEXe-dgl2Hf Rj2Mlf OLiIxf PDpWxe LQeN7 s73B3c MyHLpd wphPJc Q8G3mf")[0].click();
        } catch {
            logConsole("Back button not found...");
        }
    }

    function zoomIn() {
        try {
            document
                .querySelectorAll(".VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc.A07Gsf")[0]
                .click();
        } catch {
            logConsole("Zoom In button not found...");
        }
    }

    function zoomOut() {
        try {
            document
                .querySelectorAll(".VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc.A07Gsf")[1]
                .click();
        } catch {
            logConsole("Zoom Out button not found...");
        }
    }

    function markPrivateRoad() {
        try {
            document.getElementsByClassName("VfPpkd-muHVFf-bMcfAe")[3].click();
        } catch {
            logConsole("Private road button not found...");
        }
    }

    function simplifyRoad() {
        try {
            const svg = document.getElementsByTagName("svg")[19];
            const nodeSelector = "H8Ty1d TNpQ1d CQUm1b";

            // Cache road selector queries
            const roadSelectors = [
                'path[stroke="#1a73e8"]',
                'path[stroke*="blue"]',
                'path[stroke="#4285f4"]'
            ];

            function ensureRoadSelected() {
                for (const selector of roadSelectors) {
                    const roadPath = document.querySelector(selector);
                    if (roadPath) {
                        roadPath.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            button: 0
                        }));
                        return true;
                    }
                }
                return false;
            }

            function deleteHalfNodes() {
                ensureRoadSelected();

                const initialNodes = document.getElementsByClassName(nodeSelector);
                const initialNodeCount = initialNodes.length;
                const targetNodeCount = Math.ceil(initialNodeCount / 2); // Keep half (rounded up)

                if (initialNodeCount === 0) {
                    logConsole("No nodes found to delete");
                    return;
                }

                logConsole(`Starting with ${initialNodeCount} nodes, target: ${targetNodeCount} nodes`);

                let maxAttempts = 100; // Maximum number of deletion attempts
                let attemptCount = 0;
                let previousNodeCount = initialNodeCount;
                let stuckCounter = 0;
                const maxStuckAttempts = 5; // Max attempts when stuck on same node count

                const processNodes = () => {
                    const nodes = document.getElementsByClassName(nodeSelector);

                    // Check termination conditions
                    if (nodes.length <= targetNodeCount) {
                        logConsole(`Target reached! Deleted ${initialNodeCount - nodes.length} nodes. ${nodes.length} nodes remaining.`);
                        return;
                    }

                    if (attemptCount >= maxAttempts) {
                        logConsole(`Stopped after ${maxAttempts} attempts. ${nodes.length} nodes remaining.`);
                        return;
                    }

                    // Check if we're stuck (same node count for multiple attempts)
                    if (nodes.length === previousNodeCount) {
                        stuckCounter++;
                        if (stuckCounter >= maxStuckAttempts) {
                            logConsole(`Stopped: unable to delete nodes after ${stuckCounter} attempts. ${nodes.length} nodes remaining.`);
                            return;
                        }
                    } else {
                        stuckCounter = 0; // Reset stuck counter if progress was made
                    }

                    previousNodeCount = nodes.length;
                    attemptCount++;

                    logConsole(`Attempt ${attemptCount}: ${nodes.length} nodes remaining (target: ${targetNodeCount})`);

                    const node = nodes[0];
                    const rect = node.getBoundingClientRect();
                    const xCoord = rect.left + rect.width / 2;
                    const yCoord = rect.top + rect.height / 2;

                    // Dispatch mouse events
                    svg.dispatchEvent(new MouseEvent('mousedown', {
                        clientX: xCoord,
                        clientY: yCoord,
                        bubbles: true,
                        cancelable: true,
                        button: 0
                    }));

                    svg.dispatchEvent(new MouseEvent('mouseup', {
                        clientX: xCoord,
                        clientY: yCoord,
                        bubbles: true,
                        cancelable: true,
                        button: 0
                    }));

                    // Use setTimeout instead of requestAnimationFrame for better control
                    setTimeout(() => {
                        const remainingNodes = document.getElementsByClassName(nodeSelector);

                        // If deletion didn't work, try clicking the element directly
                        if (remainingNodes.length === nodes.length && stuckCounter > 0) {
                            try {
                                const element = document.elementFromPoint(xCoord, yCoord);
                                if (element) {
                                    element.dispatchEvent(new MouseEvent('click', {
                                        clientX: xCoord,
                                        clientY: yCoord,
                                        bubbles: true,
                                        cancelable: true,
                                        button: 0
                                    }));
                                }
                            } catch (altError) {
                                logConsole("Alternative click method failed: " + altError.message);
                            }
                        }

                        // Continue processing if we haven't hit our limits and haven't reached target
                        if (attemptCount < maxAttempts &&
                            stuckCounter < maxStuckAttempts &&
                            remainingNodes.length > targetNodeCount) {
                            processNodes();
                        }
                    }, 50); // Small delay to allow UI to update
                };

                processNodes();
            }

            deleteHalfNodes();

        } catch (error) {
            logConsole("Error in simplifyRoad: " + error.message);
        }
    }

    // Add this function after the existing action functions
    function setupAutoRefreshWatcher() {
        function watchForAllDone() {
            const targetElement = document.getElementsByClassName("jfXz1e")[0];

            if (!targetElement) {
                // Element not found, try again in 1 second
                setTimeout(watchForAllDone, 1000);
                return;
            }

            // Create a MutationObserver to watch for text changes
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        const currentText = targetElement.innerText.trim();
                        if (currentText === 'All done') {
                            logConsole("'All done' detected - refreshing page...");
                            window.location.reload();
                        }
                    }
                });
            });

            // Configure the observer to watch for text changes
            observer.observe(targetElement, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // Also check immediately in case the text is already there
            const currentText = targetElement.innerText.trim();
            if (currentText === 'All done') {
                logConsole("'All done' detected on load - refreshing page...");
                window.location.reload();
            }

            logConsole("Auto-refresh watcher set up for 'All done' status");
        }

        // Start watching after a short delay to ensure page is loaded
        setTimeout(watchForAllDone, 2000);
    }

    // Then modify your init() function to include this:
    async function init() {
        logConsole("Initializing with configurable key bindings...");
        loadKeyBindings();
        setupKeyListener();
        setupAutoRefreshWatcher(); // Add this line
        logConsole("Key bindings loaded. Press ` (backtick) to open settings.");
    }

    init();
})();
