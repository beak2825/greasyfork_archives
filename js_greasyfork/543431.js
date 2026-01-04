// ==UserScript==
// @name         Torn Revive Booster
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Enlarges the revive button, hides extras, and adds a toggleable NoConfirm Revive on Torn.com profiles with a dark mode compact toggle menu.
// @author       Dirt-Fairy
// @license      MIT
// @match        https://www.torn.com/profiles*
// @match        https://www.torn.com/hospitalview.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543431/Torn%20Revive%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/543431/Torn%20Revive%20Booster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornToggleSettings';
    const defaultSettings = {
        noConfirm: true,
        hideButtons: true,
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
        }
    };

    let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultSettings;

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function createToggleUI() {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = '10px';
        wrapper.style.left = '10px';
        wrapper.style.zIndex = '9999';
        wrapper.style.fontFamily = 'Arial, sans-serif';
        wrapper.style.fontSize = '13px';

        const mainButton = document.createElement('button');
        mainButton.textContent = `NoConfirm: ${settings.noConfirm ? 'ON' : 'OFF'}`;
        Object.assign(mainButton.style, {
            backgroundColor: settings.noConfirm ? '#28a745' : '#555',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '5px',
            padding: '6px 12px',
            cursor: 'pointer',
            boxShadow: '0 0 6px rgba(0,0,0,0.6)',
            width: '140px',
            textAlign: 'left'
        });

        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            marginTop: '6px',
            background: '#1e1e1e',
            border: '1px solid #444',
            borderRadius: '6px',
            padding: '8px',
            display: 'none',
            boxShadow: '0 0 8px rgba(0,0,0,0.7)',
            color: '#ddd',
            maxWidth: '220px'
        });

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = `Hide Buttons: ${settings.hideButtons ? 'ON' : 'OFF'}`;
        Object.assign(toggleBtn.style, {
            marginBottom: '8px',
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

        mainButton.onclick = () => {
            settings.noConfirm = !settings.noConfirm;
            mainButton.textContent = `NoConfirm: ${settings.noConfirm ? 'ON' : 'OFF'}`;
            mainButton.style.backgroundColor = settings.noConfirm ? '#28a745' : '#555';
            saveSettings();
        };

        mainButton.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

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
                if (chance >= 50) {
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

    $(document).ajaxSend(function (event, jqXHR, ajaxObj) {
        if (settings.noConfirm && ajaxObj.url) {
            ajaxObj.url = ajaxObj.url.replace('action=revive', 'action=revive&step=revive');
        }
    });

    const observer = new MutationObserver(enhanceUI);
    observer.observe(document.body, { childList: true, subtree: true });

    enhanceUI();
    createToggleUI();
})();
