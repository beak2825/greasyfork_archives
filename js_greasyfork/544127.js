// ==UserScript==
// @name         Torn Revive Booster - Fast Load Edition
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Boost revive button, hide extras, and strip non-essential styles/images for faster loading on Torn.com. Includes a Fast Mode toggle and darkmode interface.
// @author       Dirt-Fairy
// @license      MIT
// @match        https://www.torn.com/profiles*
// @match        https://www.torn.com/hospitalview.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544127/Torn%20Revive%20Booster%20-%20Fast%20Load%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/544127/Torn%20Revive%20Booster%20-%20Fast%20Load%20Edition.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornReviveSettings';
    const defaultSettings = {
        fastMode: true,
        noConfirm: true,
        hideButtons: true,
        customThreshold: 50,
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
    const saveSettings = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // === Strip non-essential visual elements ===
    function stripPageVisuals() {
        const style = document.createElement('style');
        style.textContent = `
            img, video, picture, figure {
                display: none !important;
            }
            body, div, span {
                background: none !important;
                background-image: none !important;
                box-shadow: none !important;
                text-shadow: none !important;
                animation: none !important;
                transition: none !important;
            }
            ::before, ::after {
                content: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // === UI: Toggle and settings panel ===
    function createToggleUI() {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = '10%';
        wrapper.style.left = '10px';
        wrapper.style.zIndex = '9999';
        wrapper.style.fontFamily = 'Arial, sans-serif';
        wrapper.style.fontSize = '13px';

        const mainButton = document.createElement('button');
        mainButton.textContent = `DF's Reviver`;
        Object.assign(mainButton.style, {
            backgroundColor: '#444',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '5px',
            padding: '6px 12px',
            cursor: 'pointer',
            width: '160px'
        });

        const panel = document.createElement('div');
        Object.assign(panel.style, {
            marginTop: '6px',
            background: '#1e1e1e',
            border: '1px solid #444',
            borderRadius: '6px',
            padding: '10px',
            display: 'none',
            color: '#ddd'
        });

        // === Fast Mode Toggle ===
        const fastModeBtn = document.createElement('button');
        fastModeBtn.textContent = `Fast Mode: ${settings.fastMode ? 'ON' : 'OFF'}`;
        Object.assign(fastModeBtn.style, {
            marginBottom: '6px',
            backgroundColor: settings.fastMode ? '#ffc107' : '#555',
            color: '#000',
            border: '1px solid #333',
            borderRadius: '4px',
            width: '100%',
            padding: '4px',
            cursor: 'pointer'
        });
        fastModeBtn.onclick = () => {
            settings.fastMode = !settings.fastMode;
            fastModeBtn.textContent = `Fast Mode: ${settings.fastMode ? 'ON' : 'OFF'}`;
            fastModeBtn.style.backgroundColor = settings.fastMode ? '#ffc107' : '#555';
            saveSettings();
            location.reload(); // apply or remove fast visuals
        };
        panel.appendChild(fastModeBtn);

        // === Custom Threshold Input ===
        const thresholdInput = document.createElement('input');
        thresholdInput.type = 'number';
        thresholdInput.value = settings.customThreshold;
        thresholdInput.style.marginTop = '8px';
        thresholdInput.style.width = '100%';
        thresholdInput.placeholder = 'Threshold % (default 50)';
        thresholdInput.onchange = () => {
            settings.customThreshold = parseFloat(thresholdInput.value) || 50;
            saveSettings();
            enhanceUI();
        };
        panel.appendChild(thresholdInput);

        mainButton.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };

        wrapper.appendChild(mainButton);
        wrapper.appendChild(panel);
        document.body.appendChild(wrapper);
    }

    // === Enhance Yes Button Styling + Floating ===
    function enhanceYesButton() {
        const yesBtn = document.querySelector('.confirm-action-yes');
        const percentText = document.querySelector('.center-block .text b');
        if (yesBtn && percentText && !yesBtn.dataset.enhanced) {
            const match = percentText.innerText.match(/([\d.]+)%/);
            const chance = match ? parseFloat(match[1]) : null;
            const threshold = settings.customThreshold;

            yesBtn.dataset.enhanced = 'true';
            yesBtn.style.position = 'fixed';
            yesBtn.style.bottom = '0';
            yesBtn.style.left = '0';
            yesBtn.style.width = '100vw';
            yesBtn.style.height = '33vh';
            yesBtn.style.zIndex = '10000';
            yesBtn.style.fontSize = '40px';
            yesBtn.style.fontWeight = 'bold';
            yesBtn.style.borderRadius = '0';
            yesBtn.style.padding = '20px';

            if (chance !== null) {
                const isGreen = chance >= threshold;
                yesBtn.style.backgroundColor = isGreen ? '#28a745' : '#dc3545';
                yesBtn.style.border = isGreen ? '6px solid #1e7e34' : '6px solid #721c24';
                yesBtn.style.color = '#fff';

                const label = document.createElement('span');
                label.textContent = ` (${chance.toFixed(1)}%)`;
                label.style.marginLeft = '20px';
                label.style.fontSize = '32px';
                yesBtn.appendChild(label);
            }
        }
    }

    // === Enhance Revive Button (if present) ===
    function enhanceReviveButton() {
        const reviveBtn = document.querySelector('.profile-button-revive');
        if (reviveBtn && !reviveBtn.dataset.enhanced) {
            reviveBtn.dataset.enhanced = 'true';
            reviveBtn.style.position = 'fixed';
            reviveBtn.style.bottom = '0';
            reviveBtn.style.left = '0';
            reviveBtn.style.width = '100vw';
            reviveBtn.style.height = '33vh';
            reviveBtn.style.zIndex = '10000';
            reviveBtn.style.fontSize = '40px';
            reviveBtn.style.fontWeight = 'bold';
            reviveBtn.style.backgroundColor = '#28a745';
            reviveBtn.style.border = '6px solid #1e7e34';
            reviveBtn.style.color = '#fff';
            reviveBtn.style.padding = '20px';
            reviveBtn.style.borderRadius = '0';
        }
    }

    // === Apply Enhancements ===
    function enhanceUI() {
        enhanceReviveButton();
        enhanceYesButton();
    }

    // === Observe DOM ===
    const observer = new MutationObserver(enhanceUI);
    observer.observe(document.body, { childList: true, subtree: true });

    // === Init ===
    if (settings.fastMode) stripPageVisuals();
    enhanceUI();
    createToggleUI();
})();