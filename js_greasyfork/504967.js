// ==UserScript==
// @name         Idle MMO Battle Automation with GUI and Logs
// @namespace    https://web.idle-mmo.com/
// @version      1.3
// @description  Automatically clicks "Start Hunt" and "Battle Max" based on game conditions. Includes a GUI for toggling settings, viewing logs, and copying the log, with customizable cooldown and randomization to prevent bans.
// @author       Unknown Monkey
// @match        https://web.idle-mmo.com/battle
// @match        https://web.idle-mmo.com/battle?same_window=true
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504967/Idle%20MMO%20Battle%20Automation%20with%20GUI%20and%20Logs.user.js
// @updateURL https://update.greasyfork.org/scripts/504967/Idle%20MMO%20Battle%20Automation%20with%20GUI%20and%20Logs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    let autoBattleEnabled = true;
    let cooldownMin = 2000; // Minimum cooldown (milliseconds)
    let cooldownMax = 5000; // Maximum cooldown (milliseconds)
    let randomizeCooldown = true;

    // Function to log messages to the GUI
    function logMessage(message) {
        const logArea = document.getElementById('logArea');
        const timestamp = new Date().toLocaleTimeString();
        logArea.value += `[${timestamp}] ${message}\n`;
        logArea.scrollTop = logArea.scrollHeight; // Auto-scroll to the bottom
    }

    // Function to click buttons by CSS selector with improved timing
    function clickButtonBySelector(selector) {
        const waitForButton = setInterval(() => {
            const button = document.querySelector(selector);
            if (button) {
                const isButtonDisabled = button.hasAttribute('disabled') || button.classList.contains('opacity-40');
                logMessage(`Button found with selector: ${selector}`);
                logMessage(`Button disabled state: ${isButtonDisabled}`);
                if (!isButtonDisabled) {
                    try {
                        clearInterval(waitForButton);

                        // Introduce a small random delay before clicking to simulate more human-like behavior
                        setTimeout(() => {
                            button.click();
                            logMessage(`Clicked button with selector: ${selector}`);
                            // Log button action
                            logMessage(`Button ${selector} action triggered.`);
                        }, getRandomCooldown()); // Use a small random delay

                    } catch (error) {
                        logMessage(`Error clicking button with selector: ${selector} - ${error.message}`);
                    }
                } else {
                    logMessage(`Button with selector: ${selector} is disabled`);
                }
            } else {
                logMessage(`Button with selector: ${selector} not found`);
            }
        }, 1000); // Check every 1000ms
    }

    // Function to get the value of an element by CSS selector
    function getValueBySelector(selector) {
        const element = document.querySelector(selector);
        return element ? parseInt(element.textContent.trim(), 10) : null;
    }

    // Function to get a random cooldown value within the specified range
    function getRandomCooldown() {
        return Math.floor(Math.random() * (cooldownMax - cooldownMin + 1)) + cooldownMin;
    }

    // Automation logic (focuses on "Start Hunt", "Battle Max" and "Battle Max" button)
    function automateBattle() {
        if (!autoBattleEnabled) return;

        const battleMaxValueSelector = 'div.w-5'; // Adjust selector if necessary
        const startHuntSelector = 'button.bg-white\\/10:nth-child(1)';
        const battleMaxButtonSelector = 'button.battle-max'; // Placeholder selector for "Battle Max" button

        setTimeout(() => {
            const battleMaxValue = getValueBySelector(battleMaxValueSelector);
            logMessage(`Battle Max Value: ${battleMaxValue}`);

            if (document.querySelector(startHuntSelector)) {
                logMessage(`Attempting to click "Start Hunt"`);
                clickButtonBySelector(startHuntSelector);
            } else if (battleMaxValue > 0 && document.querySelector(battleMaxButtonSelector)) {
                logMessage(`Attempting to click "Battle Max" button`);
                clickButtonBySelector(battleMaxButtonSelector);
            } else {
                logMessage(`"Start Hunt" button not found or Battle Max value is not greater than 0, or "Battle Max" button not found.`);
            }
        }, randomizeCooldown ? getRandomCooldown() : cooldownMin);
    }

    // Set up an interval for automation
    setInterval(automateBattle, randomizeCooldown ? getRandomCooldown() : cooldownMin);

    // GUI creation with a toggle button
    function createGUI() {
        // Create GUI container
        const gui = document.createElement('div');
        gui.id = 'battle-automation-gui';
        gui.innerHTML = `
            <div>
                <h3>Battle Automation</h3>
                <label><input type="checkbox" id="toggleAutoBattle" checked> Auto Battle</label><br>
                <label for="cooldownMin">Cooldown Min (ms):</label>
                <input type="number" id="cooldownMin" value="${cooldownMin}" min="0"><br>
                <label for="cooldownMax">Cooldown Max (ms):</label>
                <input type="number" id="cooldownMax" value="${cooldownMax}" min="0"><br>
                <label><input type="checkbox" id="toggleRandomizeCooldown" checked> Randomize Cooldown</label><br>
                <textarea id="logArea" rows="10" cols="40" readonly></textarea><br>
                <button id="copyLogButton">Copy Log</button><br>
            </div>
        `;
        document.body.appendChild(gui);

        // Create Show/Hide GUI button
        const toggleGUIButton = document.createElement('button');
        toggleGUIButton.id = 'toggleGUIButton';
        toggleGUIButton.textContent = 'Hide GUI';
        toggleGUIButton.style.position = 'fixed';
        toggleGUIButton.style.top = '10px';
        toggleGUIButton.style.right = '10px';
        toggleGUIButton.style.zIndex = '1001'; // Above GUI
        document.body.appendChild(toggleGUIButton);

        // Event listeners for toggling settings
        document.getElementById('toggleAutoBattle').addEventListener('change', (e) => {
            autoBattleEnabled = e.target.checked;
            logMessage(`Auto Battle: ${autoBattleEnabled}`);
        });

        // Event listeners for cooldown settings
        document.getElementById('cooldownMin').addEventListener('change', (e) => {
            cooldownMin = parseInt(e.target.value, 10);
            logMessage(`Cooldown Min set to: ${cooldownMin}`);
        });
        document.getElementById('cooldownMax').addEventListener('change', (e) => {
            cooldownMax = parseInt(e.target.value, 10);
            logMessage(`Cooldown Max set to: ${cooldownMax}`);
        });

        // Event listeners for randomizing cooldown
        document.getElementById('toggleRandomizeCooldown').addEventListener('change', (e) => {
            randomizeCooldown = e.target.checked;
            logMessage(`Randomize Cooldown: ${randomizeCooldown}`);
        });

        // Event listener for copying logs
        document.getElementById('copyLogButton').addEventListener('click', () => {
            const logArea = document.getElementById('logArea');
            logArea.select();
            document.execCommand('copy');
            logMessage('Log copied to clipboard.');
        });

        // Event listener for hiding/showing GUI
        document.getElementById('toggleGUIButton').addEventListener('click', () => {
            const gui = document.getElementById('battle-automation-gui');
            if (gui.style.opacity === '0') {
                gui.style.opacity = '1';
                document.getElementById('toggleGUIButton').textContent = 'Hide GUI';
            } else {
                gui.style.opacity = '0';
                document.getElementById('toggleGUIButton').textContent = 'Show GUI';
            }
        });

        // Inject CSS for GUI
        GM_addStyle(`
            #battle-automation-gui {
                position: fixed;
                top: 10px;
                right: 10px;
                background: #ffffff;
                border: 1px solid #cccccc;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                opacity: 1; /* Ensure GUI is initially visible */
                transition: opacity 0.3s; /* Smooth transition for hiding/showing */
            }
            #battle-automation-gui h3 {
                margin: 0;
                font-size: 16px;
                color: black;
            }
            #battle-automation-gui label,
            #battle-automation-gui input,
            #battle-automation-gui button,
            #battle-automation-gui textarea {
                font-size: 14px;
                color: black;
            }
            #battle-automation-gui textarea {
                width: 100%;
                font-family: monospace;
            }
            #toggleGUIButton {
                background: #f39c12;
                color: white;
                border: none;
                padding: 8px 16px;
                cursor: pointer;
                z-index: 1001;
            }
        `);
    }

    // Initialize GUI
    createGUI();
})();

