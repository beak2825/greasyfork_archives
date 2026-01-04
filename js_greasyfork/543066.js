// ==UserScript==
// @name         Torn Drug Cooldown Warning PC version
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Uses your Torn API key to display a countdown timer and a flashing warning when your drug cooldown has expired. Includes a 5-minute snooze for the warning.
// @author       BazookaJoe
// @match        https://www.torn.com/*
// @connect      api.torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543066/Torn%20Drug%20Cooldown%20Warning%20PC%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/543066/Torn%20Drug%20Cooldown%20Warning%20PC%20version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CHECK_INTERVAL_MS = 30000; // How often to check the API (30 seconds)
    const FLASH_INTERVAL_MS = 2000;   // How quickly the warning flashes (milliseconds)
    const ACKNOWLEDGE_SNOOZE_MS = 5 * 60 * 1000; // 5 minutes snooze duration
    const WARNING_TEXT = "Drug Cooldown Expired!"; // The message to display

    let TORN_API_KEY = ""; // API Key will be loaded from storage

    // --- Style for all UI elements ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Full-screen flash warning */
        #drug-cooldown-warning-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.75);
            display: flex; justify-content: center; align-items: center;
            z-index: 99999;
            color: white; font-size: 48px; font-weight: bold; text-align: center;
            font-family: Arial, sans-serif; cursor: pointer; flex-direction: column;
        }
        #drug-cooldown-warning-overlay.flash-on { background-color: rgba(39, 174, 96, 0.85); /* Green for the flash */ }
        .dismiss-message { font-size: 24px; margin-top: 20px; font-weight: normal; }

        /* Countdown timer box */
        #drug-cooldown-timer-box {
            position: fixed; bottom: 100px; right: 80px; /* Moved up the page */
            background-color: rgba(0, 0, 0, 0.8); color: white;
            padding: 8px 12px; border-radius: 5px;
            font-family: monospace; font-size: 16px; font-weight: bold;
            z-index: 99998; display: none; border: 1px solid #444;
            transition: opacity 0.3s;
        }

        /* Settings Icon */
        #drug-cooldown-settings-icon {
            position: fixed; bottom: 95px; right: 15px; /* Moved up the page */
            width: 50px; height: 50px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 50%;
            cursor: pointer;
            display: flex; justify-content: center; align-items: center;
            z-index: 99997;
            border: 1px solid #555;
            transition: background-color 0.2s;
        }
        #drug-cooldown-settings-icon:hover { background-color: rgba(20, 20, 20, 0.9); }
        #drug-cooldown-settings-icon svg { width: 28px; height: 28px; fill: white; }

        /* Settings Modal */
        #api-settings-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex; justify-content: center; align-items: center;
            z-index: 100000;
        }
        #api-settings-modal-content {
            background-color: #f0f0f0; color: #333;
            padding: 25px; border-radius: 8px;
            width: 90%; max-width: 450px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        }
        .dark-mode #api-settings-modal-content { background-color: #2e2e2e; color: #f0f0f0; }
        #api-settings-modal-content h2 { margin-top: 0; margin-bottom: 20px; }
        #api-settings-modal-content label { display: block; margin-bottom: 8px; font-weight: bold; }
        #api-settings-modal-content input {
            width: 100%; padding: 10px; margin-bottom: 20px;
            border-radius: 4px; border: 1px solid #ccc;
            box-sizing: border-box; font-size: 16px;
        }
        .dark-mode #api-settings-modal-content input { background-color: #444; border-color: #666; color: #f0f0f0; }
        #api-settings-modal-buttons { text-align: right; }
        #api-settings-modal-buttons button {
            padding: 10px 18px; border-radius: 5px; border: none;
            font-size: 16px; font-weight: bold; cursor: pointer; margin-left: 10px;
        }
        #api-settings-save-button { background-color: #4CAF50; color: white; }
        #api-settings-save-button:hover { background-color: #45a049; }
        #api-settings-close-button { background-color: #f44336; color: white; }
        #api-settings-close-button:hover { background-color: #da190b; }
    `;
    document.head.appendChild(style);

    let warningInterval = null, isWarningVisible = false, mainCheckInterval = null, countdownInterval = null;
    let drugCooldownEndTime = 0;
    let snoozeEndTime = 0; // Timestamp until which the warning is snoozed

    function hideCountdownBox() {
        const box = document.getElementById('drug-cooldown-timer-box');
        if (box) box.style.display = 'none';
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    function showWarning() {
        if (isWarningVisible || Date.now() < snoozeEndTime) return; // Don't show if snoozed
        isWarningVisible = true;
        hideCountdownBox();
        if (mainCheckInterval) {
            clearInterval(mainCheckInterval);
            mainCheckInterval = null;
        }

        const overlay = document.createElement('div');
        overlay.id = 'drug-cooldown-warning-overlay';
        overlay.innerHTML = `
            <div>${WARNING_TEXT}</div>
            <div class="dismiss-message">(Click anywhere to acknowledge & snooze for 5 mins)</div>
        `;
        document.body.appendChild(overlay);

        let isFlashOn = false;
        warningInterval = setInterval(() => {
            isFlashOn = !isFlashOn;
            overlay.classList.toggle('flash-on', isFlashOn);
        }, FLASH_INTERVAL_MS);

        overlay.addEventListener('click', () => hideWarning(overlay, true)); // Pass true to indicate a snooze
    }

    function hideWarning(overlay, shouldSnooze = false) {
        if (warningInterval) clearInterval(warningInterval);
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        isWarningVisible = false;
        warningInterval = null;

        if (shouldSnooze) {
            snoozeEndTime = Date.now() + ACKNOWLEDGE_SNOOZE_MS;
        }

        startApiCheck();
    }

    function formatTime(totalSeconds) {
        if (totalSeconds <= 0) return "00:00:00";
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const pad = (num) => num.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    function startClientSideCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        const timerBox = document.getElementById('drug-cooldown-timer-box');
        if (!timerBox) return;
        timerBox.style.display = 'block';
        snoozeEndTime = 0; // Reset snooze when a new cooldown starts
        countdownInterval = setInterval(() => {
            const remainingMs = drugCooldownEndTime - Date.now();
            if (remainingMs <= 0) {
                hideCountdownBox();
                if (!isWarningVisible) showWarning();
            } else {
                timerBox.textContent = `Drug: ${formatTime(Math.round(remainingMs / 1000))}`;
            }
        }, 1000);
    }

    function checkCooldownViaApi() {
        if (isWarningVisible || !TORN_API_KEY) return;
        const apiUrl = `https://api.torn.com/user/?selections=cooldowns&key=${TORN_API_KEY}`;
        GM.xmlHttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        console.error("Torn API Error:", data.error.error);
                        if (mainCheckInterval) clearInterval(mainCheckInterval);
                        hideCountdownBox();
                        alert(`Torn API Error: ${data.error.error}. Please check your API key.`);
                        openApiSettingsModal();
                        return;
                    }
                    const drugCooldownSeconds = data.cooldowns ? data.cooldowns.drug : 0;
                    if (drugCooldownSeconds > 0) {
                        drugCooldownEndTime = Date.now() + (drugCooldownSeconds * 1000);
                        if (!countdownInterval) startClientSideCountdown();
                    } else {
                        drugCooldownEndTime = 0;
                        hideCountdownBox();
                        showWarning(); // This will respect the snooze timer
                    }
                } catch (e) {
                    console.error("Failed to parse Torn API response:", e);
                }
            },
            onerror: (response) => console.error("Failed to fetch from Torn API:", response)
        });
    }

    function startApiCheck() {
        if (mainCheckInterval) clearInterval(mainCheckInterval);
        if (TORN_API_KEY) {
            checkCooldownViaApi();
            mainCheckInterval = setInterval(checkCooldownViaApi, CHECK_INTERVAL_MS);
        }
    }

    function openApiSettingsModal() {
        if (document.getElementById('api-settings-modal-overlay')) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'api-settings-modal-overlay';
        modalOverlay.innerHTML = `
            <div id="api-settings-modal-content">
                <h2>API Key Settings</h2>
                <label for="api-key-input">Enter your Torn API Key:</label>
                <input type="text" id="api-key-input" placeholder="Paste your key here" value="${TORN_API_KEY || ''}">
                <div id="api-settings-modal-buttons">
                    <button id="api-settings-save-button">Save</button>
                    <button id="api-settings-close-button">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        const content = modalOverlay.querySelector('#api-settings-modal-content');
        const saveButton = modalOverlay.querySelector('#api-settings-save-button');
        const closeButton = modalOverlay.querySelector('#api-settings-close-button');
        const apiKeyInput = modalOverlay.querySelector('#api-key-input');

        const closeModal = () => modalOverlay.remove();
        closeButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

        saveButton.addEventListener('click', async () => {
            const newKey = apiKeyInput.value.trim();
            if (newKey) {
                await GM.setValue('torn_api_key', newKey);
                TORN_API_KEY = newKey;
                alert('API Key saved!');
                closeModal();
                snoozeEndTime = 0; // Reset snooze on new key
                startApiCheck();
            } else {
                alert('API Key cannot be empty.');
            }
        });
    }

    async function initialize() {
        // Create UI elements
        const countdownBox = document.createElement('div');
        countdownBox.id = 'drug-cooldown-timer-box';
        document.body.appendChild(countdownBox);

        const settingsIcon = document.createElement('div');
        settingsIcon.id = 'drug-cooldown-settings-icon';
        settingsIcon.title = 'API Key Settings';
        settingsIcon.innerHTML = `<svg viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9.9 15.9-19.4 15.9H181.8c-9.5 0-17.4-6.8-19.4-15.9l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L49.8 414.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C50.4 263.1 49.8 254.6 49.8 246s.6-17.1 1.7-25.4L7.2 181.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9.9-15.9 19.4-15.9h80.4c9.5 0 17.4 6.8 19.4 15.9l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 337.8c-50.7 0-91.8-41.1-91.8-91.8s41.1-91.8 91.8-91.8s91.8 41.1 91.8 91.8s-41.1 91.8-91.8 91.8z"/></svg>`;
        settingsIcon.addEventListener('click', openApiSettingsModal);
        document.body.appendChild(settingsIcon);

        // Load API key and start
        TORN_API_KEY = await GM.getValue('torn_api_key', null);
        if (!TORN_API_KEY) {
            openApiSettingsModal();
        } else {
            startApiCheck();
        }
    }

    initialize();

})();