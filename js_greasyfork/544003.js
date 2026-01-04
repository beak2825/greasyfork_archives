// ==UserScript==
// @name         Torn Fight Made Easy
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Moves 'Start Fight', 'Mug', & 'Continue' actions to the melee slot
// @author       aquagloop
// @match        *://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544003/Torn%20Fight%20Made%20Easy.user.js
// @updateURL https://update.greasyfork.org/scripts/544003/Torn%20Fight%20Made%20Easy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const ACTION_CONTAINER_SELECTOR = 'div[class*="dialogButtons___"]';
    const SCRIPT_OVERLAY_ID = 'tui-script-overlay';
    const SETTINGS_PANEL_ID = 'tui-settings-panel';

    let config = {
        targetSlot: 'weapon_melee',
        postFightAction: 'mug'
    };

    // --- SETTINGS ---

    const loadSettings = () => {
        const savedConfig = GM_getValue('TUI_CONFIG', config);
        // Basic validation to ensure saved config has the expected keys
        if (savedConfig.targetSlot && savedConfig.postFightAction) {
            config = savedConfig;
        }
    };

    const saveSettings = (newConfig) => {
        config = newConfig;
        GM_setValue('TUI_CONFIG', config);
    };

    const createSettingsPanel = () => {
        // Remove old panel if it exists
        const oldPanel = document.getElementById(SETTINGS_PANEL_ID);
        if (oldPanel) oldPanel.remove();

        // Create panel HTML
        const panel = document.createElement('div');
        panel.id = SETTINGS_PANEL_ID;
        panel.innerHTML = `
            <div class="tui-settings-content">
                <h2>Torn UI Streamliner Settings</h2>
                <div class="tui-setting">
                    <label for="targetSlot">Target Weapon Slot:</label>
                    <select id="targetSlot">
                        <option value="weapon_main" ${config.targetSlot === 'weapon_main' ? 'selected' : ''}>Primary</option>
                        <option value="weapon_second" ${config.targetSlot === 'weapon_second' ? 'selected' : ''}>Secondary</option>
                        <option value="weapon_melee" ${config.targetSlot === 'weapon_melee' ? 'selected' : ''}>Melee</option>
                        <option value="weapon_temp" ${config.targetSlot === 'weapon_temp' ? 'selected' : ''}>Temporary</option>
                        <option value="weapon_fists" ${config.targetSlot === 'weapon_fists' ? 'selected' : ''}>Fists</option>
                    </select>
                </div>
                <div class="tui-setting">
                    <label for="postFightAction">Preferred Post-Fight Action:</label>
                    <select id="postFightAction">
                        <option value="mug" ${config.postFightAction === 'mug' ? 'selected' : ''}>Mug</option>
                        <option value="hospitalize" ${config.postFightAction === 'hospitalize' ? 'selected' : ''}>Hospitalize</option>
                        <option value="leave" ${config.postFightAction === 'leave' ? 'selected' : ''}>Leave</option>
                    </select>
                </div>
                <div class="tui-buttons">
                    <button id="tui-save">Save & Close</button>
                    <button id="tui-cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Add event listeners
        document.getElementById('tui-save').addEventListener('click', () => {
            const newConfig = {
                targetSlot: document.getElementById('targetSlot').value,
                postFightAction: document.getElementById('postFightAction').value
            };
            saveSettings(newConfig);
            panel.remove();
        });

        document.getElementById('tui-cancel').addEventListener('click', () => {
            panel.remove();
        });
    };

    // --- STYLING ---
    GM_addStyle(`
        /* Settings Panel Styling */
        #${SETTINGS_PANEL_ID} {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.7); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
        }
        .tui-settings-content {
            background-color: #333; color: #fff; padding: 20px 30px;
            border-radius: 8px; border: 1px solid #555; text-align: left;
        }
        .tui-settings-content h2 { margin-top: 0; text-align: center; }
        .tui-setting { margin: 15px 0; }
        .tui-setting label { display: block; margin-bottom: 5px; }
        .tui-setting select { width: 100%; padding: 5px; }
        .tui-buttons { margin-top: 20px; text-align: right; }

        /* Main Script Styling */
        #${config.targetSlot} { position: relative !important; }
        #${SCRIPT_OVERLAY_ID} {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            display: flex; flex-direction: column; justify-content: center;
            align-items: stretch; gap: 5px; padding: 5px;
            background-color: rgba(0, 0, 0, 0.4); border: 1px dashed #888;
            box-sizing: border-box; z-index: 10;
        }
        .proxy-button-by-script {
            width: 100%; margin: 0 !important; box-sizing: border-box;
            padding: 10px 5px; background-image: linear-gradient(to bottom,#555 0,#333 100%);
            color: white; text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
            border-radius: 5px; text-align: center; font-size: 14px;
            font-weight: bold; border: 1px solid #222; cursor: pointer;
            flex-grow: 1; display: flex; align-items: center; justify-content: center;
        }
        .proxy-button-by-script:hover { background-image: linear-gradient(to bottom,#666 0,#444 100%); }
        .proxy-button-by-script.mug-button { background-image: linear-gradient(to bottom,#8b0000 0,#5d0000 100%); }
        .proxy-button-by-script.mug-button:hover { background-image: linear-gradient(to bottom,#9f0000 0,#6f0000 100%); }
        .hidden-by-script { visibility: hidden !important; height: 0 !important; padding: 0 !important; margin: 0 !important; opacity: 0 !important; }
    `);


    // --- SCRIPT LOGIC ---

    const findButton = (container, text) => {
        if (!container || !text) return null;
        const buttons = container.querySelectorAll('button');
        for (const button of buttons) {
            if (button.firstChild && button.firstChild.nodeType === Node.TEXT_NODE && button.firstChild.textContent.trim().toLowerCase() === text.toLowerCase()) {
                return button;
            }
        }
        return null;
    };

    const createProxyButton = (realElement, destinationOverlay, onClickCallback) => {
        const proxyButton = document.createElement('button');
        const buttonText = realElement.firstChild.textContent.trim();
        proxyButton.textContent = buttonText;
        proxyButton.className = 'proxy-button-by-script';
        if (buttonText.toLowerCase() === 'mug') {
            proxyButton.classList.add('mug-button');
        }
        proxyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onClickCallback) onClickCallback();
            realElement.click();
        });
        destinationOverlay.appendChild(proxyButton);
    };

    const setupActionOverlay = (destinationSlot) => {
        const oldOverlay = document.getElementById(SCRIPT_OVERLAY_ID);
        if (oldOverlay) oldOverlay.remove();
        const overlay = document.createElement('div');
        overlay.id = SCRIPT_OVERLAY_ID;
        destinationSlot.appendChild(overlay);
        return overlay;
    };

    const main = () => {
        const destinationSlot = document.getElementById(config.targetSlot);
        if (!destinationSlot) return;

        const existingOverlay = document.getElementById(SCRIPT_OVERLAY_ID);
        const actionContainer = document.querySelector(ACTION_CONTAINER_SELECTOR);

        if (!actionContainer) {
            if (existingOverlay) existingOverlay.remove();
            return;
        }

        if (existingOverlay) return;

        // Handle Pre-Fight State
        const startFightButton = findButton(actionContainer, 'start fight');
        if (startFightButton) {
            const overlay = setupActionOverlay(destinationSlot);
            createProxyButton(startFightButton, overlay, () => {
                overlay.remove();
                actionContainer.classList.add('hidden-by-script');
            });
            return;
        }

        // Handle Post-Fight State
        // Define the order of priority for post-fight actions
        const actionPriority = [config.postFightAction, 'mug', 'hospitalize', 'leave', 'continue'];
        let buttonToMove = null;
        // Use a Set to avoid checking the same action twice
        for (const action of [...new Set(actionPriority)]) {
            buttonToMove = findButton(actionContainer, action);
            if (buttonToMove) break; // Found the highest-priority available button
        }

        if (buttonToMove) {
            const overlay = setupActionOverlay(destinationSlot);
            createProxyButton(buttonToMove, overlay, () => {
                overlay.remove();
                actionContainer.classList.add('hidden-by-script');
            });
            return;
        }
    };


    loadSettings();
    GM_registerMenuCommand('Torn UI Streamliner Settings', createSettingsPanel);

    const observer = new MutationObserver(() => {
        setTimeout(main, 150);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();