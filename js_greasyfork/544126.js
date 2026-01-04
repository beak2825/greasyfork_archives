// ==UserScript==
// @name         Torn Profile Button Hider (Darkmode + Drag + Memory)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Toggle visibility of Torn.com profile buttons (dark mode, collapsible UI, global ON/OFF, draggable)
// @author       Dirt-Fairy
// @license      MIT
// @match        https://www.torn.com/profiles*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544126/Torn%20Profile%20Button%20Hider%20%28Darkmode%20%2B%20Drag%20%2B%20Memory%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544126/Torn%20Profile%20Button%20Hider%20%28Darkmode%20%2B%20Drag%20%2B%20Memory%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornProfileButtonSettings';
    const POSITION_KEY = 'tornProfileButtonPos';
    const defaultSettings = {
        enabled: true,
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
    let savedPos = JSON.parse(localStorage.getItem(POSITION_KEY)) || { top: 10, left: 10 };

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    function savePosition(top, left) {
        localStorage.setItem(POSITION_KEY, JSON.stringify({ top, left }));
    }

    function createToggleUI() {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = `${savedPos.top}px`;
        wrapper.style.left = `${savedPos.left}px`;
        wrapper.style.zIndex = '9999';
        wrapper.style.fontFamily = 'Arial, sans-serif';
        wrapper.style.fontSize = '13px';

        const mainButton = document.createElement('button');
        mainButton.textContent = 'DF’s Button Hider';
        Object.assign(mainButton.style, {
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '5px',
            padding: '6px 12px',
            cursor: 'move',
            boxShadow: '0 0 6px rgba(0,0,0,0.6)',
            width: '160px',
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

        // Global enable toggle
        const enableToggle = document.createElement('button');
        enableToggle.textContent = `Hide: ${settings.enabled ? 'ON' : 'OFF'}`;
        Object.assign(enableToggle.style, {
            marginBottom: '10px',
            backgroundColor: settings.enabled ? '#28a745' : '#555',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '4px',
            width: '100%',
            padding: '6px',
            cursor: 'pointer'
        });

        enableToggle.onclick = () => {
            settings.enabled = !settings.enabled;
            enableToggle.textContent = `Hide: ${settings.enabled ? 'ON' : 'OFF'}`;
            enableToggle.style.backgroundColor = settings.enabled ? '#28a745' : '#555';
            saveSettings();
            applyButtonHiding();
        };

        dropdown.appendChild(enableToggle);

        // Per-button toggles
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
                applyButtonHiding();
            };

            label.appendChild(checkbox);
            label.append(` Hide ${key}`);
            dropdown.appendChild(label);
        });

        mainButton.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Dragging functionality
        let isDragging = false;
        let offsetX, offsetY;

        mainButton.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - wrapper.getBoundingClientRect().left;
            offsetY = e.clientY - wrapper.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const left = e.clientX - offsetX;
            const top = e.clientY - offsetY;
            wrapper.style.left = `${left}px`;
            wrapper.style.top = `${top}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                savePosition(parseInt(wrapper.style.top), parseInt(wrapper.style.left));
                document.body.style.userSelect = '';
            }
            isDragging = false;
        });

        wrapper.appendChild(mainButton);
        wrapper.appendChild(dropdown);
        document.body.appendChild(wrapper);
    }

    function applyButtonHiding() {
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
                if (!settings.enabled) {
                    btn.style.display = '';
                } else {
                    btn.style.display = settings.buttons[key] ? 'none' : '';
                }
            }
        });
    }

    const observer = new MutationObserver(applyButtonHiding);
    observer.observe(document.body, { childList: true, subtree: true });

    createToggleUI();
    applyButtonHiding();
})();