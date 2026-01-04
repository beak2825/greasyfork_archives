// ==UserScript==
// @name         Torn "Da Pulp Beater"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Warns when opponent's life is below a set %, disables attacking, and provides an on-screen input to change the %.
// @author       HeyItzWerty [3626448]
// @match        https://www.torn.com/loader.php?sid=attack*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/544882/Torn%20%22Da%20Pulp%20Beater%22.user.js
// @updateURL https://update.greasyfork.org/scripts/544882/Torn%20%22Da%20Pulp%20Beater%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Creates a compact settings UI and a placeholder for the warning message.
     */
    function createSettingsUI() {
        const targetArea = document.querySelector('.labelsContainer___Oz6Su');
        if (!targetArea || document.getElementById('life-threshold-container')) {
            return;
        }

        // 1. Create a placeholder for our new warning message, initially hidden
        const warningPlaceholder = document.createElement('div');
        warningPlaceholder.id = 'life-warning-indicator';
        Object.assign(warningPlaceholder.style, {
            color: '#D8000C', // A strong red color
            fontWeight: 'bold',
            fontSize: '14px',
            marginRight: '15px',
            padding: '2px 8px',
            backgroundColor: '#FFD2D2', // Light red background
            border: '1px solid #D8000C',
            borderRadius: '5px',
            display: 'none' // Start hidden
        });

        // 2. Create the settings container
        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'life-threshold-container';
        Object.assign(settingsContainer.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #ccc',
            padding: '2px 8px',
            borderRadius: '5px',
            backgroundColor: '#e0e0e0'
        });

        settingsContainer.innerHTML = `
            <label for="threshold-input" style="font-weight: bold; color: #333; font-size: 12px; margin-bottom: 0;">Warn at %:</label>
            <input type="number" id="threshold-input" style="width: 45px; padding: 2px; border: 1px solid #aaa; border-radius: 3px; font-size: 12px;">
            <button id="save-threshold-btn" style="padding: 2px 8px; border: none; background-color: #4CAF50; color: white; border-radius: 3px; cursor: pointer; font-size: 12px;">Save</button>
            <span id="save-status" style="color: green; font-weight: bold; font-size: 12px;"></span>
        `;

        // 3. Add both the warning placeholder and settings UI to the page
        targetArea.appendChild(warningPlaceholder);
        targetArea.appendChild(settingsContainer);


        const thresholdInput = document.getElementById('threshold-input');
        const saveButton = document.getElementById('save-threshold-btn');
        const saveStatus = document.getElementById('save-status');

        const savedThreshold = GM_getValue('lifeThreshold', 25);
        thresholdInput.value = savedThreshold;

        saveButton.addEventListener('click', () => {
            const newValue = parseInt(thresholdInput.value, 10);
            if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                GM_setValue('lifeThreshold', newValue);
                saveStatus.textContent = 'Saved!';
                setTimeout(() => { saveStatus.textContent = ''; }, 2000);
            } else {
                alert('Please enter a valid number between 0 and 100.');
            }
        });
    }

    /**
     * Checks the opponent's health and triggers the warning and weapon disabling.
     */
    function checkOpponentHealth() {
        const thresholdInput = document.getElementById('threshold-input');
        if (!thresholdInput) return;

        const lifeThreshold = parseInt(thresholdInput.value, 10);
        const opponentBox = document.querySelector('.player___wiE8R .rose___QcHAq');
        if (!opponentBox) return;

        const healthElement = opponentBox.querySelector('[id^="player-health-value"]');
        if (!healthElement || !healthElement.textContent.includes('/')) return;

        const healthValues = healthElement.textContent.replace(/,/g, '').split('/');
        const currentLife = parseInt(healthValues[0], 10);
        const maxLife = parseInt(healthValues[1], 10);

        if (isNaN(currentLife) || isNaN(maxLife) || maxLife === 0) return;

        const lifePercentage = (currentLife / maxLife) * 100;

        if (lifePercentage < lifeThreshold) {
            displayWarning();
            disableAttacks();
        }
    }

    /**
     * Displays the new, integrated warning message in the header.
     */
    function displayWarning() {
        const warningIndicator = document.getElementById('life-warning-indicator');
        if (warningIndicator && warningIndicator.style.display === 'none') {
            warningIndicator.textContent = 'WARNING!';
            warningIndicator.style.display = 'flex'; // Use flex to align text vertically
        }
    }

    /**
     * Reliably finds and disables all player attack buttons.
     */
    function disableAttacks() {
        const attackerHeader = document.querySelector('.headerWrapper___p6yrL.green___QtOKw');
        if (!attackerHeader) return;

        const attackerContainer = attackerHeader.closest('.player___wiE8R');
        if (!attackerContainer) return;

        const playerWeaponArea = attackerContainer.querySelector('.playerArea___AEVBU');
        if (!playerWeaponArea) return;

        playerWeaponArea.querySelectorAll('[id^="weapon_"]').forEach(button => {
            if (button.style.opacity !== '0.5') { // Only disable once
                button.style.pointerEvents = 'none';
                button.style.opacity = '0.5';
            }
        });
    }

    // --- OBSERVERS ---
    const uiObserver = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.labelsContainer___Oz6Su')) {
            createSettingsUI();
            obs.disconnect();
        }
    });

    const fightObserver = new MutationObserver(() => {
        checkOpponentHealth();
    });

    uiObserver.observe(document.body, { childList: true, subtree: true });
    fightObserver.observe(document.body, { childList: true, subtree: true });

})();