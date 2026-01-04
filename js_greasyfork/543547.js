// ==UserScript==
// @name         DF`s Revive Booster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enlarges revive button, hides extras with per-button control, adds stats tracker.
// @author       Dirt-Fairy
// @license      MIT
// @match        https://www.torn.com/profiles*
// @match        https://www.torn.com/hospitalview.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543547/DF%60s%20Revive%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/543547/DF%60s%20Revive%20Booster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornReviveSettings';
    const defaultSettings = {
        hideButtons: true,
        threshold: 50,
        buttons: {
            attack: true,
            sendMessage: true,
            initiateChat: true,
            sendMoney: true,
            initiateTrade: true,
            placeBounty: true,
            report: true,
            addToFriendList: true,
            addToEnemyList: true,
            addToTargetList: true,
            personalStats: true,
            viewBazaar: true,
            viewDisplayCabinet: true
        },
        stats: {
            total: 0,
            successes: 0,
            energy: 0,
            active: false
        }
    };

    let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultSettings;

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function createToggleUI() {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = '10%';
        wrapper.style.left = '10px';
        wrapper.style.zIndex = '9999';
        wrapper.style.fontFamily = 'Arial, sans-serif';
        wrapper.style.fontSize = '13px';

        const title = document.createElement('div');
        title.textContent = "DF's Reviver";
        title.style.color = '#0f0';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '4px';
        wrapper.appendChild(title);

        const mainButton = document.createElement('button');
        mainButton.textContent = `Settings ▼`;
        Object.assign(mainButton.style, {
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '5px',
            padding: '6px 12px',
            cursor: 'pointer',
            width: '140px',
            textAlign: 'left',
            marginBottom: '6px'
        });

        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            background: '#1e1e1e',
            border: '1px solid #444',
            borderRadius: '6px',
            padding: '8px',
            display: 'none',
            color: '#ddd',
            maxWidth: '220px'
        });

        // Threshold input
        const thresholdLabel = document.createElement('label');
        thresholdLabel.textContent = 'Success Threshold (%):';
        thresholdLabel.style.display = 'block';
        thresholdLabel.style.marginTop = '5px';

        const thresholdInput = document.createElement('input');
        thresholdInput.type = 'number';
        thresholdInput.value = settings.threshold;
        thresholdInput.min = '0';
        thresholdInput.max = '100';
        thresholdInput.style.width = '100%';
        thresholdInput.style.marginTop = '4px';
        thresholdInput.oninput = () => {
            settings.threshold = parseFloat(thresholdInput.value) || 50;
            saveSettings();
            enhanceYesButton();
        };

        dropdown.appendChild(thresholdLabel);
        dropdown.appendChild(thresholdInput);

        // Hide Buttons Toggle
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = `Hide Buttons: ${settings.hideButtons ? 'ON' : 'OFF'}`;
        Object.assign(toggleBtn.style, {
            margin: '8px 0',
            backgroundColor: settings.hideButtons ? '#dc3545' : '#555',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '4px',
            width: '100%',
            padding: '4px',
            cursor: 'pointer'
        });
        toggleBtn.onclick = () => {
            settings.hideButtons = !settings.hideButtons;
            toggleBtn.textContent = `Hide Buttons: ${settings.hideButtons ? 'ON' : 'OFF'}`;
            toggleBtn.style.backgroundColor = settings.hideButtons ? '#dc3545' : '#555';
            saveSettings();
            enhanceUI();
        };
        dropdown.appendChild(toggleBtn);

        // Per-button checkboxes
        Object.entries(settings.buttons).forEach(([key, value]) => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.margin = '3px 0';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = value;
            checkbox.onchange = () => {
                settings.buttons[key] = checkbox.checked;
                saveSettings();
                enhanceUI();
            };

            label.appendChild(checkbox);
            label.append(` Hide ${key}`);
            dropdown.appendChild(label);
        });

        // Stats tracker
        const statsTitle = document.createElement('div');
        statsTitle.textContent = 'Stats Tracker';
        statsTitle.style.marginTop = '10px';
        statsTitle.style.fontWeight = 'bold';
        statsTitle.style.color = '#0af';
        dropdown.appendChild(statsTitle);

        const statsInfo = document.createElement('div');
        const updateStatsDisplay = () => {
            const rate = settings.stats.total ? ((settings.stats.successes / settings.stats.total) * 100).toFixed(1) : '0.0';
            statsInfo.innerHTML = `Success Rate: <b>${rate}%</b><br>E Spent: <b>${settings.stats.energy}</b>`;
        };

        updateStatsDisplay();
        statsInfo.style.margin = '4px 0';
        dropdown.appendChild(statsInfo);

        const startBtn = document.createElement('button');
        startBtn.textContent = 'Start';
        const pauseBtn = document.createElement('button');
        pauseBtn.textContent = 'Pause';
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';

        [startBtn, pauseBtn, resetBtn].forEach(btn => {
            Object.assign(btn.style, {
                margin: '2px',
                padding: '2px 6px',
                fontSize: '12px',
                cursor: 'pointer'
            });
        });

        startBtn.onclick = () => {
            settings.stats.active = true;
            saveSettings();
        };
        pauseBtn.onclick = () => {
            settings.stats.active = false;
            saveSettings();
        };
        resetBtn.onclick = () => {
            settings.stats = { total: 0, successes: 0, energy: 0, active: false };
            saveSettings();
            updateStatsDisplay();
        };

        dropdown.appendChild(startBtn);
        dropdown.appendChild(pauseBtn);
        dropdown.appendChild(resetBtn);

        // Toggle dropdown
        mainButton.onclick = () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        };

        wrapper.appendChild(mainButton);
        wrapper.appendChild(dropdown);
        document.body.appendChild(wrapper);
    }

    function enhanceYesButton() {
        const yesButton = document.querySelector('.confirm-action-yes');
        const percentText = document.querySelector('.center-block .text b');

        if (yesButton && percentText && !yesButton.dataset.enlarged) {
            const percentMatch = percentText.innerText.match(/([\d.]+)%/);
            const chance = percentMatch ? parseFloat(percentMatch[1]) : null;

            yesButton.dataset.enlarged = 'true';
            yesButton.style.transform = 'scale(1.5)';
            yesButton.style.transformOrigin = 'left center';
            yesButton.style.padding = '14px 28px';
            yesButton.style.borderRadius = '10px';
            yesButton.style.fontWeight = 'bold';
            yesButton.style.marginRight = '20px';
            yesButton.style.marginTop = '10px';
            yesButton.style.position = 'relative';
            yesButton.style.zIndex = '5';
            yesButton.style.display = 'inline-block';
            yesButton.style.float = 'left';

            if (chance !== null) {
                if (settings.stats.active) {
                    settings.stats.total++;
                    if (chance >= settings.threshold - 0.1) settings.stats.successes++;
                    const energyMatch = document.querySelector('.center-block .text')?.innerText.match(/(\d+)\s*energy/i);
                    if (energyMatch) settings.stats.energy += parseInt(energyMatch[1]);
                    saveSettings();
                }

                if (chance >= settings.threshold - 0.1) {
                    yesButton.style.backgroundColor = '#28a745';
                    yesButton.style.border = '4px solid #1e7e34';
                    yesButton.style.color = '#fff';
                } else {
                    yesButton.style.backgroundColor = '#dc3545';
                    yesButton.style.border = '4px solid #721c24';
                    yesButton.style.color = '#fff';
                }

                const label = document.createElement('span');
                label.textContent = ` (${chance.toFixed(1)}%)`;
                label.style.marginLeft = '12px';
                label.style.fontSize = '20px';
                label.style.verticalAlign = 'middle';
                yesButton.appendChild(label);
            }
        }
    }

    function enhanceUI() {
        const reviveButton = document.querySelector('.profile-button-revive');
        if (reviveButton && !reviveButton.dataset.enhanced) {
            reviveButton.style.width = '800%';
            reviveButton.style.height = '200px';
            reviveButton.style.fontSize = '72px';
            reviveButton.style.padding = '30px';
            reviveButton.style.backgroundColor = '#28a745';
            reviveButton.style.color = '#ffffff';
            reviveButton.style.border = '6px solid #1e7e34';
            reviveButton.style.borderRadius = '20px';
            reviveButton.style.cursor = 'pointer';
            reviveButton.style.boxShadow = '0 0 40px rgba(40, 167, 69, 0.8)';
            reviveButton.dataset.enhanced = 'true';
        }

        if (settings.hideButtons) {
            const selectors = {
                attack: '.profile-button-attack',
                sendMessage: '.profile-button-sendMessage',
                initiateChat: '.profile-button-initiateChat',
                sendMoney: '.profile-button-sendMoney',
                initiateTrade: '.profile-button-initiateTrade',
                placeBounty: '.profile-button-placeBounty',
                report: '.profile-button-report',
                addToFriendList: '.profile-button-addToFriendList',
                addToEnemyList: '.profile-button-addToEnemyList',
                addToTargetList: '.profile-button-addToTargetList',
                personalStats: '.profile-button-personalStats',
                viewBazaar: '.profile-button-viewBazaar',
                viewDisplayCabinet: '.profile-button-viewDisplayCabinet'
            };

            Object.entries(selectors).forEach(([key, selector]) => {
                const btn = document.querySelector(selector);
                if (btn) {
                    btn.style.display = settings.buttons[key] ? 'none' : '';
                }
            });
        }

        enhanceYesButton();
    }

    const observer = new MutationObserver(enhanceUI);
    observer.observe(document.body, { childList: true, subtree: true });

    enhanceUI();
    createToggleUI();
})();