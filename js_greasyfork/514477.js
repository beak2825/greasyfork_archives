// ==UserScript==
// @name         Die Stämme Auto Scavenging
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Automates scavenging in Die Stämme
// @author       ricardofauch
// @match        https://*.die-staemme.de/game.php?*screen=place&mode=scavenge*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514477/Die%20St%C3%A4mme%20Auto%20Scavenging.user.js
// @updateURL https://update.greasyfork.org/scripts/514477/Die%20St%C3%A4mme%20Auto%20Scavenging.meta.js
// ==/UserScript==

(function() {
    'use strict';

function injectStyles() {
        const styles = `
            #scavengeUI {
                position: fixed;
                left: 8%;
                top: 50%;
                transform: translateY(-50%);
                background-color: rgba(245, 245, 245, 0.95);
                border: 1px solid #967444;
                border-radius: 4px;
                padding: 8px;
                z-index: 9999;
                width: 140px;
                height: 140px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            #scavengeUI .title {
                font-weight: bold;
                color: #784B25;
                font-size: 12px;
                margin-bottom: 20px;
                text-align: center;
                font-family: Arial, sans-serif;
            }
            #scavengeUI label {
                display: block;
                color: #5C3C1D;
                font-size: 11px;
                font-weight: bold;
                margin-bottom: 4px;
                font-family: Arial, sans-serif;
                text-align: center;
            }
            #scavengeUI input[type="number"] {
                width: 100%;
                padding: 4px;
                border: 1px solid #967444;
                background-color: white;
                color: #4A3011;
                border-radius: 2px;
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                outline: none;
                box-sizing: border-box;
                margin-bottom: 10px;
            }
            #scavengeUI .checkbox-container {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 8px 0;
                padding: 4px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 2px;
            }
            #scavengeUI .checkbox-container input[type="checkbox"] {
                margin-right: 5px;
            }
            #scavengeUI input:focus {
                border-color: #784B25;
                box-shadow: 0 0 2px #967444;
            }
            #scavengeUI:hover {
                background-color: rgba(255, 255, 255, 0.98);
            }
            #debugOutput {
                margin-top: 10px;
                padding-top: 10px;
                font-family: Arial, sans-serif;
                font-size: 10px;
                color: #5C3C1D;
            }
            #nextReloadTime {
                margin-top: 8px;
                padding: 4px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 2px;
                text-align: center;
                font-size: 11px;
                font-weight: bold;
                color: #5C3C1D;
            }
            .debug-entry {
                margin-bottom: 4px;
                padding: 2px;
                border-radius: 2px;
            }
            .debug-entry.info { color: #0066cc; }
            .debug-entry.warning { color: #cc6600; }
            .debug-entry.error { color: #cc0000; }
            .debug-entry.success { color: #006600; }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // Update Configuration
    const CONFIG = {
        TOTAL_SPEARS: 100,           // Default total spears
        MAX_SPEAR_PERCENTAGE: 0.35,  // Maximum percentage of total spears per run (35%)
        INCLUDE_SWORDS: true,       // Default sword setting
        MIN_SPEARS_THRESHOLD: 20,    // Minimum spears needed to start scavenging
        UI_LOAD_DELAY: 6000,         // Delay to wait for UI to load (in milliseconds)
        INPUT_PROCESS_DELAY: 1000,   // Delay after setting input before clicking (in milliseconds)
        INPUT_RETRY_DELAY: 200,      // Delay between input retry attempts (in milliseconds)
        MAX_INPUT_RETRIES: 5,        // Maximum number of times to retry setting the input
        MIN_RELOAD_TIME: 8,          // Minimum minutes before reload
        MAX_RELOAD_TIME: 12,         // Maximum minutes before reload
        DEBUG: false                  // Enable/disable debug logging
    };

    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'scavengeUI';
        ui.innerHTML = `
            <div class="title">Das Meisterräuber Script</div>
            <label for="totalSpears">Speere Gesamt</label>
            <input type="number" id="totalSpears" min="0" step="1">
            <div class="checkbox-container">
                <input type="checkbox" id="includeSwords" ${CONFIG.INCLUDE_SWORDS ? 'checked' : ''}>
                <label for="includeSwords">Schwerter benutzen</label>
            </div>
            <div id="nextReloadTime">Nächster Reload: --:--</div>
            <div id="debugOutput"></div>
        `;
        document.body.appendChild(ui);

        // Get input elements
        const totalSpearsInput = document.getElementById('totalSpears');
        const includeSwordsCheckbox = document.getElementById('includeSwords');

        // Load saved values
        const savedSpears = localStorage.getItem('scavengeTotalSpears');
        const savedSwordsSetting = localStorage.getItem('scavengeIncludeSwords');

        if (savedSpears) {
            CONFIG.TOTAL_SPEARS = parseInt(savedSpears);
            totalSpearsInput.value = CONFIG.TOTAL_SPEARS;
        } else {
            totalSpearsInput.value = CONFIG.TOTAL_SPEARS;
        }

        if (savedSwordsSetting !== null) {
            CONFIG.INCLUDE_SWORDS = savedSwordsSetting === 'true';
            includeSwordsCheckbox.checked = CONFIG.INCLUDE_SWORDS;
        }

        // Add event listeners
        totalSpearsInput.addEventListener('change', (e) => {
            const newValue = parseInt(e.target.value) || CONFIG.TOTAL_SPEARS;
            CONFIG.TOTAL_SPEARS = newValue;
            localStorage.setItem('scavengeTotalSpears', newValue);
            debugLog(`Total spears updated to: ${newValue}`, 'info');
        });

        includeSwordsCheckbox.addEventListener('change', (e) => {
            CONFIG.INCLUDE_SWORDS = e.target.checked;
            localStorage.setItem('scavengeIncludeSwords', CONFIG.INCLUDE_SWORDS);
            debugLog(`Include swords setting updated to: ${CONFIG.INCLUDE_SWORDS}`, 'info');
        });
    }

    // Debug logging function
    function debugLog(message, type = 'info') {
        if (!CONFIG.DEBUG) return;

        const styles = {
            info: 'color: #0099ff; font-weight: bold;',
            warning: 'color: #ffa500; font-weight: bold;',
            error: 'color: #ff0000; font-weight: bold;',
            success: 'color: #00ff00; font-weight: bold;'
        };

        const timestamp = new Date().toLocaleTimeString();
        console.log(`%c[${timestamp}] ${message}`, styles[type]);

        // Update UI debug output
        const debugOutput = document.getElementById('debugOutput');
        if (debugOutput) {
            // Create new debug entry
            const entry = document.createElement('div');
            entry.className = `debug-entry ${type}`;
            entry.textContent = `[${timestamp}] ${message}`;

            // Add new entry at the top
            debugOutput.insertBefore(entry, debugOutput.firstChild);

            // Keep only last 4 messages
            while (debugOutput.children.length > 4) {
                debugOutput.removeChild(debugOutput.lastChild);
            }
        }
    }

    // Helper function to get random reload time
    function getRandomReloadTime() {
        const reloadTime = (Math.random() * (CONFIG.MAX_RELOAD_TIME - CONFIG.MIN_RELOAD_TIME) + CONFIG.MIN_RELOAD_TIME) * 60 * 1000;
        debugLog(`Generated random reload time: ${Math.round(reloadTime/1000/60)} minutes`);
        return reloadTime;
    }

    // Helper function to extract number from text
    function extractNumber(text) {
        const match = text.match(/\((\d+)\)/);
        const number = match ? parseInt(match[1]) : 0;
        debugLog(`Extracted number ${number} from text: ${text}`);
        return number;
    }

    // Helper function to set input value and verify it stuck
    async function setInputValueWithVerification(input, value, retryCount = 0) {
        debugLog(`Attempt ${retryCount + 1} to set ${input.name} input value to ${value}`, 'info');

        // Set the value and dispatch events
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, CONFIG.INPUT_RETRY_DELAY));

        // Check if value stuck
        if (input.value !== value.toString()) {
            debugLog(`${input.name} input verification failed! Current value: ${input.value}`, 'warning');

            if (retryCount < CONFIG.MAX_INPUT_RETRIES) {
                debugLog(`Retrying... (${retryCount + 1}/${CONFIG.MAX_INPUT_RETRIES})`, 'info');
                return setInputValueWithVerification(input, value, retryCount + 1);
            } else {
                debugLog('Max retries reached!', 'error');
                return false;
            }
        }

        debugLog(`${input.name} input value verified successfully`, 'success');
        return true;
    }


    // Main scavenging function
    async function handleScavenging() {
        debugLog('=== Starting scavenging operation ===', 'info');
        debugLog(`Current configuration:
        Total spears: ${CONFIG.TOTAL_SPEARS}
        Min spears threshold: ${CONFIG.MIN_SPEARS_THRESHOLD}
        UI load delay: ${CONFIG.UI_LOAD_DELAY}ms
        Reload time range: ${CONFIG.MIN_RELOAD_TIME}-${CONFIG.MAX_RELOAD_TIME} minutes`, 'info');

        // Wait for UI to load
        debugLog(`Waiting ${CONFIG.UI_LOAD_DELAY}ms for UI to load...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.UI_LOAD_DELAY));
        debugLog('UI load delay completed', 'success');

        // Get available spears
        const spearLink = document.querySelector('a.units-entry-all[data-unit="spear"]');
        if (!spearLink) {
            debugLog('Could not find spear count element!', 'error');
            scheduleReload();
            return;
        }

        const availableSpears = extractNumber(spearLink.textContent);
        debugLog(`Found ${availableSpears} available spears`, 'info');

        let availableSwords = 0;
        if (CONFIG.INCLUDE_SWORDS) {
            const swordLink = document.querySelector('a.units-entry-all[data-unit="sword"]');
            if (swordLink) {
                availableSwords = extractNumber(swordLink.textContent);
                debugLog(`Found ${availableSwords} available swords`, 'info');
            }
        }

        // Check if we have enough units
        if (availableSpears < CONFIG.MIN_SPEARS_THRESHOLD && (!CONFIG.INCLUDE_SWORDS || availableSwords === 0)) {
            debugLog(`Not enough units available, waiting for next reload`, 'warning');
            scheduleReload();
            return;
        }

        // Get the Start buttons again after setting the input
        const startButtons = Array.from(document.querySelectorAll('a.btn.free_send_button'));
        debugLog(`Found ${startButtons.length} start buttons after setting input`, 'info');

        if (startButtons.length === 0) {
            debugLog('No available start buttons found after setting input!', 'error');
            scheduleReload();
            return;
        }

        // Calculate units per option
        const evenDistributionMaxSpears = Math.floor(CONFIG.TOTAL_SPEARS / startButtons.length);
        const percentageMaxSpears = Math.floor(CONFIG.TOTAL_SPEARS * CONFIG.MAX_SPEAR_PERCENTAGE);
        const maxSpearsPerRun = Math.min(evenDistributionMaxSpears, percentageMaxSpears);
        const spearsToSend = Math.min(availableSpears, maxSpearsPerRun);

        let swordsToSend = 0;
        if (CONFIG.INCLUDE_SWORDS && availableSwords > 0) {
            swordsToSend = Math.floor(availableSwords / startButtons.length);
        }

        debugLog(`Will send ${spearsToSend} spears and ${swordsToSend} swords per run`, 'info');

        // Find and set inputs
        const spearInput = document.querySelector('input[name="spear"].unitsInput.input-nicer');
        const swordInput = document.querySelector('input[name="sword"].unitsInput.input-nicer');

        if (!spearInput) {
            debugLog('Could not find spear input!', 'error');
            scheduleReload();
            return;
        }

        // Set spear input
        const spearInputSuccess = await setInputValueWithVerification(spearInput, spearsToSend);

        // Set sword input if enabled
        let swordInputSuccess = true;
        if (CONFIG.INCLUDE_SWORDS && swordsToSend > 0 && swordInput) {
            swordInputSuccess = await setInputValueWithVerification(swordInput, swordsToSend);
        }

        if (!spearInputSuccess || !swordInputSuccess) {
            debugLog('Failed to set input values after all retries, scheduling reload', 'error');
            scheduleReload();
            return;
        }

        // Wait for input processing
        debugLog(`Waiting ${CONFIG.INPUT_PROCESS_DELAY}ms for input processing...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.INPUT_PROCESS_DELAY));

        // Verify one last time before clicking
        if (spearInput.value !== spearsToSend.toString()) {
            debugLog('Input value changed before clicking! Scheduling reload', 'error');
            scheduleReload();
            return;
        }


        // Get the last available button
        const lastButton = startButtons[startButtons.length - 1];

        // Click the button
        debugLog('Clicking start button...', 'info');
        lastButton.click();
        debugLog('Start button clicked', 'success');

        // Reload the page after clicking
        debugLog('Scheduling page reload in 1 second...', 'info');
        setTimeout(() => {
            debugLog('Reloading page...', 'info');
            window.location.reload();
        }, 1000);
    }

    // Schedule the next reload
    function scheduleReload() {
        const reloadTime = getRandomReloadTime();
        const nextReloadTime = new Date(Date.now() + reloadTime);
        const timeString = nextReloadTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

        const nextReloadElement = document.getElementById('nextReloadTime');
        if (nextReloadElement) {
            nextReloadElement.textContent = `Nächster Reload: ${timeString} Uhr`;
        }

    debugLog(`Scheduling next reload at ${timeString}`, 'info');
    setTimeout(() => {
        debugLog('Executing scheduled reload...', 'info');
        window.location.reload();
    }, reloadTime);
}

    // Start the script
    debugLog('=== Script initialized ===', 'info');
    // Initialize the UI
    injectStyles();
    createUI();
    handleScavenging();

})();