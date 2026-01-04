// ==UserScript==
// @name         Torn War Helper (highlights and chain timers)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhances Torn faction wars with member status highlighting, chain timer overlay, and hospital alerts. Includes built-in settings panel for better user experience.
// @author       EagWasTaken [3264609]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532226/Torn%20War%20Helper%20%28highlights%20and%20chain%20timers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532226/Torn%20War%20Helper%20%28highlights%20and%20chain%20timers%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS = {
        colors: {
            online: "rgba(134, 179, 0, 0.4)",
            idle: "rgba(255, 191, 0, 0.4)",
            offline: "rgba(220, 53, 69, 0.3)"
        },

        darkModeColors: {
            online: "rgba(87, 105, 58, 0.9)",
            idle: "rgba(209, 129, 0, 0.3)", 
            offline: "rgba(153, 27, 27, 0.3)"
        },

        highlightOnline: true,
        highlightIdle: true,
        highlightOffline: false,

        refreshRate: 3000,

        flashHospitalChange: true,
        flashDuration: 2000,

        enableChainTimerBox: true,
        chainTimerRefreshRate: 200,
        chainTimerFontSize: '20px',
        chainTimerBoxOpacity: 0.9,
        chainTimerPosition: 'top-right',
        chainTimerBoxPadding: {
            top: 60,
            right: 10,
            left: 10,
            inner: '10px 15px'
        }
    };

    const SETTINGS_UI = {
        panelTitle: "Torn War Helper Settings",
        settingsButtonId: "wh-settings-btn",
        settingsPanelId: "wh-settings-panel",
        
        panelPosition: {
            bottom: '40px',
            left: '20px', 
        },
        
        panelDimensions: {
            width: '300px',
            maxHeight: '80vh',
        },
        
        saveMessageDuration: 2000,
        
        sections: [
            {
                title: "Highlighting",
                settings: [
                    {
                        id: "highlightOnline",
                        label: "Highlight Online Members",
                        type: "checkbox",
                        default: true,
                        tooltip: "Highlight members who are online with green background"
                    },
                    {
                        id: "highlightIdle",
                        label: "Highlight Idle Members",
                        type: "checkbox",
                        default: true,
                        tooltip: "Highlight members who are idle with amber background"
                    },
                    {
                        id: "highlightOffline",
                        label: "Highlight Offline Members",
                        type: "checkbox",
                        default: false,
                        tooltip: "Highlight members who are offline with gray background"
                    }
                ]
            },
            {
                title: "Chain Timer",
                settings: [
                    {
                        id: "enableChainTimerBox",
                        label: "Enable Chain Timer Box",
                        type: "checkbox",
                        default: true,
                        tooltip: "Show the chain timer box overlay"
                    },
                    {
                        id: "chainTimerPosition",
                        label: "Chain Timer Position",
                        type: "select",
                        options: [
                            { value: "top-right", label: "Top Right" },
                            { value: "top-left", label: "Top Left" },
                            { value: "top-center", label: "Top Center" }
                        ],
                        default: "top-right",
                        tooltip: "Position of the chain timer box on screen"
                    },
                    {
                        id: "chainTimerBoxOpacity",
                        label: "Chain Timer Opacity",
                        type: "range",
                        min: 0.1,
                        max: 1.0,
                        step: 0.1,
                        default: 0.9,
                        tooltip: "Transparency of the chain timer box (0.1 = mostly transparent, 1.0 = solid)"
                    },
                    {
                        id: "chainTimerFontSize",
                        label: "Timer Font Size",
                        type: "range",
                        min: 12,
                        max: 30,
                        step: 1,
                        valueConverter: value => `${value}px`,
                        valueParser: value => parseInt(value.replace('px', '')),
                        default: 20,
                        tooltip: "Font size for the chain timer text"
                    }
                ]
            },
            {
                title: "Hospital Alert",
                settings: [
                    {
                        id: "flashHospitalChange",
                        label: "Flash Hospital Status Change",
                        type: "checkbox",
                        default: true,
                        tooltip: "Flash when a player leaves hospital"
                    },
                    {
                        id: "flashDuration",
                        label: "Flash Duration (ms)",
                        type: "number",
                        min: 500,
                        max: 5000,
                        step: 500,
                        default: 2000,
                        tooltip: "Duration of hospital status change flash (in milliseconds)"
                    }
                ]
            },
            {
                title: "Refresh Rate",
                settings: [
                    {
                        id: "refreshRate",
                        label: "Highlighting Refresh Rate (ms)",
                        type: "number",
                        min: 1000,
                        max: 10000,
                        step: 1000,
                        default: 3000,
                        tooltip: "How often to refresh member highlighting (in milliseconds)"
                    }
                ]
            }
        ]
    };

    function saveSettings() {
        localStorage.setItem('tornWarHelperSettings', JSON.stringify(SETTINGS));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('tornWarHelperSettings');
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                for (const key in parsedSettings) {
                    if (typeof SETTINGS[key] === 'object' && !Array.isArray(SETTINGS[key])) {
                        Object.assign(SETTINGS[key], parsedSettings[key]);
                    } else {
                        SETTINGS[key] = parsedSettings[key];
                    }
                }
            } catch (e) {
                // Error handled silently
            }
        }
    }

    const playerStatusHistory = new Map();

    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Status highlighting with pseudo-elements to prevent layout shifts */
            #body.tornWarHelper ul.members-list > li.wh-status--online::before,
            #body.tornWarHelper [class*="membersWrap___"] > li.wh-status--online::before,
            #body.tornWarHelper [class*="members-list"] > li.wh-status--online::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${SETTINGS.colors.online};
                z-index: -1;
                pointer-events: none;
            }

            #body.tornWarHelper.dark-mode ul.members-list > li.wh-status--online::before,
            #body.tornWarHelper.dark-mode [class*="membersWrap___"] > li.wh-status--online::before,
            #body.tornWarHelper.dark-mode [class*="members-list"] > li.wh-status--online::before {
                background-color: ${SETTINGS.darkModeColors.online};
            }

            /* Idle status styles */
            #body.tornWarHelper ul.members-list > li.wh-status--idle::before,
            #body.tornWarHelper [class*="membersWrap___"] > li.wh-status--idle::before,
            #body.tornWarHelper [class*="members-list"] > li.wh-status--idle::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${SETTINGS.colors.idle};
                z-index: -1;
                pointer-events: none;
            }

            #body.tornWarHelper.dark-mode ul.members-list > li.wh-status--idle::before,
            #body.tornWarHelper.dark-mode [class*="membersWrap___"] > li.wh-status--idle::before,
            #body.tornWarHelper.dark-mode [class*="members-list"] > li.wh-status--idle::before {
                background-color: ${SETTINGS.darkModeColors.idle};
            }

            /* Offline status styles */
            #body.tornWarHelper ul.members-list > li.wh-status--offline::before,
            #body.tornWarHelper [class*="membersWrap___"] > li.wh-status--offline::before,
            #body.tornWarHelper [class*="members-list"] > li.wh-status--offline::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${SETTINGS.colors.offline};
                z-index: -1;
                pointer-events: none;
            }

            /* Ensure all rows have position relative for pseudo-element positioning */
            #body.tornWarHelper ul.members-list > li,
            #body.tornWarHelper [class*="membersWrap___"] > li,
            #body.tornWarHelper [class*="members-list"] > li {
                position: relative !important;
            }

            /* Make sure no styles affect layout */
            #body.tornWarHelper li.enemy .attack,
            #body.tornWarHelper li[class*="enemy___"] .attack,
            #body.tornWarHelper li[class*="your___"] .attack {
                position: relative;
                z-index: 1;
            }

            /* Animation for hospital status change flash */
            @keyframes hospitalFlash {
                0%, 100% { background-color: transparent; }
                50% { background-color: rgba(255, 0, 0, 0.7); }
            }

            /* Apply the animation to status elements that changed from hospital */
            .wh-hospital-status-change {
                animation: hospitalFlash ${SETTINGS.flashDuration}ms ease-in-out;
            }

            /* Chain Timer Box Styles */
            #wh-chain-timer-box {
                position: fixed;
                top: ${SETTINGS.chainTimerBoxPadding.top}px;
                right: ${SETTINGS.chainTimerBoxPadding.right}px;
                left: auto;
                transform: none;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 6px 10px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                z-index: 9999;
                font-size: ${SETTINGS.chainTimerFontSize};
                font-weight: bold;
                opacity: ${SETTINGS.chainTimerBoxOpacity};
                transition: opacity 0.3s ease, background-color 0.3s ease;
                border: 1px solid #555;
                font-family: "Arial", sans-serif;
                min-width: 140px;
                display: flex;
                align-items: center;
            }

            /* Container for the timer content */
            #wh-chain-timer-content {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                position: relative;
                padding-right: 20px; /* Add padding on the right to make room for the gear icon */
            }

            /* Label text */
            #wh-chain-timer-label {
                margin-right: 6px;
                white-space: nowrap;
            }

            /* Timer value styling */
            #wh-chain-timer-value {
                min-width: 60px;
                text-align: right;
                font-family: Arial, sans-serif;
                margin-right: 0; /* Remove margin as we're using container padding instead */
            }

            /* Settings icon styling */
            #wh-chain-timer-settings {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 3px;
                font-size: 15px;
                cursor: pointer;
                opacity: 0.8;
                color: white;
                font-weight: bold;
                background-color: transparent;
                width: 16px;
                height: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: none;
                padding: 0;
                margin: 0;
                z-index: 10;
                text-shadow: 0 0 2px #000;
            }

            #wh-chain-timer-settings:hover {
                opacity: 1;
                color: #3f96e0;
            }

            #wh-chain-timer-box:hover {
                opacity: 1;
            }

            #wh-chain-timer-box.warning {
                background-color: rgba(255, 100, 0, 0.9);
                animation: pulse 1s infinite;
            }

            #wh-chain-timer-box.danger {
                background-color: rgba(255, 0, 0, 0.9);
                animation: pulse 0.5s infinite;
            }

            /* Chain cooldown style */
            #wh-chain-timer-box.cooldown {
                background-color: rgba(0, 0, 128, 0.9); /* Navy blue */
                animation: none; /* No pulse animation during cooldown */
                min-width: 155px; /* Wider for cooldown text */
            }

            /* Chain reset style */
            #wh-chain-timer-box.reset {
                background-color: rgba(0, 170, 0, 0.9); /* Bright green */
                animation: flash 1s ease-in-out 3; /* Flash 3 times */
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes flash {
                0%, 100% { background-color: rgba(0, 170, 0, 0.9); }
                50% { background-color: rgba(0, 255, 0, 1); box-shadow: 0 0 15px rgba(0, 255, 0, 0.7); }
            }

            /* Position variants */
            #wh-chain-timer-box.top-left {
                right: auto;
                left: ${SETTINGS.chainTimerBoxPadding.left}px;
                transform: none;
            }

            #wh-chain-timer-box.top-center {
                right: auto;
                left: 50%;
                transform: translateX(-50%);
            }

            #wh-chain-timer-box.top-right {
                left: auto;
                right: ${SETTINGS.chainTimerBoxPadding.right}px;
                transform: none;
            }

            /* Settings button styles - updated for content-title placement */
            #${SETTINGS_UI.settingsButtonId} {
                color: #777;
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 14px;
                font-family: 'Lucida Grande', sans-serif;
                display: inline-flex;
                align-items: center;
                padding: 0 8px;
                line-height: 24px;
                vertical-align: middle;
                transition: color 0.2s;
                margin-right: 10px;
            }

            #${SETTINGS_UI.settingsButtonId}:hover {
                color: #069;
            }

            #${SETTINGS_UI.settingsButtonId} i {
                font-size: 16px;
                margin-right: 5px;
            }

            /* Hide text on mobile */
            @media screen and (max-width: 600px) {
                #${SETTINGS_UI.settingsButtonId} span {
                    display: none;
                }
                
                #${SETTINGS_UI.settingsButtonId} i {
                    margin-right: 0;
                    font-size: 18px;
                }
            }

            #${SETTINGS_UI.settingsPanelId} {
                position: fixed;
                bottom: ${SETTINGS_UI.panelPosition.bottom};
                left: ${SETTINGS_UI.panelPosition.left};
                width: ${SETTINGS_UI.panelDimensions.width};
                max-height: ${SETTINGS_UI.panelDimensions.maxHeight};
                background-color: #1c1c1c;
                border: 1px solid #444;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: none;
                overflow-y: auto;
                color: #fff;
                font-family: Arial, sans-serif;
                transform: translateY(20px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }

            #${SETTINGS_UI.settingsPanelId}.visible {
                display: block;
                transform: translateY(0);
                opacity: 1;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-settings-header {
                background-color: #333;
                padding: 10px 15px;
                border-bottom: 1px solid #444;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-settings-close {
                cursor: pointer;
                font-size: 18px;
                color: #ccc;
                transition: color 0.2s;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-settings-close:hover {
                color: #fff;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-settings-section {
                padding: 10px 15px;
                border-bottom: 1px solid #444;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-section-title {
                font-weight: bold;
                margin-bottom: 10px;
                color: #ccc;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-setting-item {
                margin-bottom: 12px;
                display: flex;
                flex-direction: column;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-setting-label {
                margin-bottom: 5px;
                display: flex;
                align-items: center;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-setting-tooltip {
                margin-left: 5px;
                color: #888;
                font-size: 12px;
                cursor: help;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-setting-tooltip:hover {
                color: #ddd;
            }

            #${SETTINGS_UI.settingsPanelId} input[type="checkbox"] {
                margin-right: 5px;
            }

            #${SETTINGS_UI.settingsPanelId} input[type="number"],
            #${SETTINGS_UI.settingsPanelId} input[type="text"],
            #${SETTINGS_UI.settingsPanelId} select {
                background-color: #333;
                border: 1px solid #555;
                color: #fff;
                padding: 5px;
                border-radius: 3px;
                width: 100%;
            }
            

            #${SETTINGS_UI.settingsPanelId} select,
            #${SETTINGS_UI.settingsPanelId} input[type="number"] {
                height: 30px;
                box-sizing: border-box;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                padding-right: 10px;
            }

            #${SETTINGS_UI.settingsPanelId} input[type="range"] {
                width: 100%;
                background-color: #333;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-range-value {
                margin-left: 10px;
                font-size: 12px;
                color: #aaa;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-settings-footer {
                padding: 10px 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-save-btn {
                background-color: #5cb85c;
                color: #fff;
                border: none;
                padding: 4px 10px;
                border-radius: 3px;
                cursor: pointer;
                transition: background-color 0.2s;
                font-size: 12px;
                min-width: 60px;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-save-btn:hover {
                background-color: #4cae4c;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-reset-btn {
                background-color: #d9534f;
                color: #fff;
                border: none;
                padding: 4px 10px;
                border-radius: 3px;
                cursor: pointer;
                transition: background-color 0.2s;
                font-size: 12px;
                min-width: 60px;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-reset-btn:hover {
                background-color: #c9302c;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-save-message {
                color: #5cb85c;
                font-size: 12px;
                transition: opacity 0.5s;
                opacity: 0;
                position: absolute;
                bottom: 45px;
                left: 0;
                right: 0;
                text-align: center;
            }

            #${SETTINGS_UI.settingsPanelId} .wh-save-message.visible {
                opacity: 1;
            }
        `;

        document.head.appendChild(styleElement);
    }

    function getRows(type) {
        if (type === 'enemy') {
            return [
                ...document.querySelectorAll('li.enemy'),
                ...document.querySelectorAll('li[class*="enemy___"]')
            ];
        } else {
            return [
                ...document.querySelectorAll('li[class*="your___"]'),
                ...document.querySelectorAll('li.your')
            ];
        }
    }

    function processRows(rows) {
        if (window.location.href.includes('chain')) {
            return;
        }

        rows.forEach(row => {
            const isInChain = row.closest('[class*="chainStatus"]') !== null ||
                              row.closest('[id*="chain"]') !== null ||
                              row.closest('[class*="chain-"]') !== null;
            if (isInChain) return;

            row.classList.remove('wh-status--online', 'wh-status--idle', 'wh-status--offline');

            let playerId = extractPlayerId(row);

            processHospitalStatus(row, playerId);

            const statusValue = determinePlayerStatus(row);

            if (statusValue) {
                if (statusValue === 'online' && SETTINGS.highlightOnline) {
                    row.classList.add('wh-status--online');
                } else if (statusValue === 'idle' && SETTINGS.highlightIdle) {
                    row.classList.add('wh-status--idle');
                } else if (statusValue === 'offline' && SETTINGS.highlightOffline) {
                    row.classList.add('wh-status--offline');
                }
            }
        });
    }

    function extractPlayerId(row) {
        const playerIdElement = row.querySelector('[data-player], [data-id], [data-member]');
        if (playerIdElement) {
            return playerIdElement.getAttribute('data-player') ||
                   playerIdElement.getAttribute('data-id') ||
                   playerIdElement.getAttribute('data-member');
        }

        const nameElement = row.querySelector('[class*="name"], .playerName, .userName');
        if (nameElement) {
            return nameElement.textContent.trim();
        }

        return 'player_' + row.textContent.trim().slice(0, 20);
    }

    function processHospitalStatus(row, playerId) {
        if (!SETTINGS.flashHospitalChange || !playerId) return;

        const statusElements = row.querySelectorAll('[class*="status___"], [class*="prevColumn___"], .status, .userStatus');
        let isHospital = false;
        let isOk = false;
        let statusElement = null;

        statusElements.forEach(el => {
            const classNames = el.className;
            if (classNames.includes('status___') || classNames.includes('prevColumn___')) {
                statusElement = el;
                isHospital = classNames.includes('not-ok') ||
                            el.textContent.toLowerCase().includes('hospital');
                isOk = classNames.includes('ok') ||
                       el.textContent.toLowerCase().includes('ok');
            }
        });

        if (statusElement) {
            const previousStatus = playerStatusHistory.get(playerId);
            const currentStatus = isHospital ? 'hospital' : (isOk ? 'ok' : 'unknown');

            if (previousStatus === 'hospital' && currentStatus === 'ok') {
                statusElement.classList.remove('wh-hospital-status-change');
                void statusElement.offsetWidth;
                statusElement.classList.add('wh-hospital-status-change');

                setTimeout(() => {
                    statusElement.classList.remove('wh-hospital-status-change');
                }, SETTINGS.flashDuration);
            }

            playerStatusHistory.set(playerId, currentStatus);
        }
    }

    function determinePlayerStatus(row) {
        const statusIcon = row.querySelector('[class*="status___"], [class*="userIcon___"], .icon-status, .player-status, .memberStatusIcon');
        if (statusIcon) {
            if (statusIcon.className.includes('online')) return 'online';
            if (statusIcon.className.includes('idle')) return 'idle';
            if (statusIcon.className.includes('offline')) return 'offline';
        }

        const svgIcon = row.querySelector('svg[fill]');
        if (svgIcon) {
            const fillAttr = svgIcon.getAttribute('fill');
            if (fillAttr) {
                const match = fillAttr.match(/(online|offline|idle)/i);
                if (match) return match[0].toLowerCase();
            }
        }

        const statusText = row.querySelector('[class*="status___"], .status, .userStatus');
        if (statusText && statusText.textContent) {
            const text = statusText.textContent.toLowerCase().trim();
            if (text.includes('online')) return 'online';
            if (text.includes('idle')) return 'idle';
            return 'offline';
        }

        const statusElement = row.querySelector('[data-status]');
        if (statusElement) {
            return statusElement.getAttribute('data-status').toLowerCase();
        }

        return null;
    }

    function createChainTimerBox() {
        const existingTimerBox = document.getElementById('wh-chain-timer-box');
        if (existingTimerBox) {
            existingTimerBox.remove();
        }

        const timerBox = document.createElement('div');
        timerBox.id = 'wh-chain-timer-box';
        timerBox.className = SETTINGS.chainTimerPosition || 'top-right';
        
        const timerContent = document.createElement('div');
        timerContent.id = 'wh-chain-timer-content';
        
        const timerLabel = document.createElement('span');
        timerLabel.id = 'wh-chain-timer-label';
        timerLabel.textContent = 'Chain: ';
        
        const timerValue = document.createElement('span');
        timerValue.id = 'wh-chain-timer-value';
        timerValue.textContent = '--:--';
        
        const settingsButton = document.createElement('span');
        settingsButton.id = 'wh-chain-timer-settings';
        settingsButton.title = 'Settings';
        settingsButton.textContent = '⚙';
        settingsButton.style.lineHeight = '18px';
        settingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSettingsPanel(e);
        });
        
        timerContent.appendChild(timerLabel);
        timerContent.appendChild(timerValue);
        timerContent.appendChild(settingsButton);
        timerBox.appendChild(timerContent);
        
        if (timerBox.offsetWidth < 140) {
            timerBox.style.minWidth = '140px';
        }
        
        document.body.appendChild(timerBox);

        timerBox.addEventListener('click', (e) => {
            if (e.target.id === 'wh-chain-timer-settings') {
                return;
            }
            
            if (timerBox.classList.contains('top-right')) {
                timerBox.classList.remove('top-right');
                timerBox.classList.add('top-center');
                SETTINGS.chainTimerPosition = 'top-center';
            } else if (timerBox.classList.contains('top-center')) {
                timerBox.classList.remove('top-center');
                timerBox.classList.add('top-left');
                SETTINGS.chainTimerPosition = 'top-left';
            } else {
                timerBox.classList.remove('top-left');
                timerBox.classList.add('top-right');
                SETTINGS.chainTimerPosition = 'top-right';
            }
            
            saveSettings();
        });
        
        return timerBox;
    }

    function updateChainTimerBox() {
        if (!SETTINGS.enableChainTimerBox) return;

        const timerBox = document.getElementById('wh-chain-timer-box');
        if (!timerBox) {
            return createChainTimerBox();
        }
        
        const timerLabel = document.getElementById('wh-chain-timer-label');
        const timerValue = document.getElementById('wh-chain-timer-value');
        
        if (!timerLabel || !timerValue) return;

        const chainState = findChainState();

        if (chainState.timeText) {
            if (chainState.timeText.match(/^0*0:0*0$/) || chainState.timeText === '--:--') {
                timerBox.style.display = 'none';
                window.whPreviousChainTime = null;
            } else {
                updateTimerDisplay(chainState.timeText, chainState.isCooldown);
            }
        } else {
            timerBox.style.display = 'none';
            window.whPreviousChainTime = null;
        }

        function findChainState() {
            const result = {
                timeText: null,
                isCooldown: false
            };

            const chainBoxTitle = document.querySelector('.chain-box-title');
            if (chainBoxTitle && chainBoxTitle.textContent.toLowerCase().includes('cooldown')) {
                const timerElement = document.querySelector('.chain-box-timeleft');
                if (timerElement && timerElement.textContent) {
                    result.timeText = timerElement.textContent.trim();
                    result.isCooldown = true;
                    return result;
                }
            }

            const cooldownElement = document.querySelector('.chain-box .chain-cooldown, [class*="chainCooldown"], .cooldown-timer');
            if (cooldownElement && cooldownElement.textContent) {
                result.timeText = cooldownElement.textContent.trim();
                result.isCooldown = true;
                return result;
            }

            const chainElements = document.querySelectorAll('.chain-box, [class*="chainBox"], .chain-wrap');
            for (const el of chainElements) {
                if (el.textContent.toLowerCase().includes('cooldown')) {
                    const timerEl = el.querySelector('.chain-box-timeleft, [class*="timerValue"], .chain-time');
                    if (timerEl && timerEl.textContent) {
                        result.timeText = timerEl.textContent.trim();
                        result.isCooldown = true;
                        return result;
                    }
                    
                    const timerMatch = el.textContent.match(/(\d+:\d+)/);
                    if (timerMatch && timerMatch[1]) {
                        result.timeText = timerMatch[1];
                        result.isCooldown = true;
                        return result;
                    }
                }
            }

            const topBarChain = document.querySelector('.chain');
            if (topBarChain && topBarChain.textContent) {
                if (topBarChain.textContent.toLowerCase().includes('cooldown')) {
                    const match = topBarChain.textContent.match(/(\d+:\d+)/);
                    if (match && match[1]) {
                        result.timeText = match[1];
                        result.isCooldown = true;
                        return result;
                    }
                }
            }

            const headerChainTimer = document.querySelector('.chain-box:not(.tt-modified)');
            if (headerChainTimer) {
                const timerElement = headerChainTimer.querySelector('.chain-box-timeleft');
                if (timerElement && timerElement.textContent) {
                    result.timeText = timerElement.textContent.trim();
                    return result;
                }
            }

            const otherTimerElement = document.querySelector('.chain-box-timeleft, [class*="chainTimerContainer"] [class*="timerValue"], .chain-box .chain-time');
            if (otherTimerElement && otherTimerElement.textContent) {
                result.timeText = otherTimerElement.textContent.trim();
                return result;
            }

            const headerTimer = document.querySelector('.header-chain-box, .websiteHeaderContent .chain');
            if (headerTimer && headerTimer.textContent && headerTimer.textContent.includes('Chain:')) {
                const match = headerTimer.textContent.match(/Chain:\s*(\d+:\d+)/i);
                if (match && match[1]) {
                    result.timeText = match[1];
                    return result;
                }
            }

            const chainNumberFormat = document.querySelector('.chain');
            if (chainNumberFormat && chainNumberFormat.textContent) {
                const match = chainNumberFormat.textContent.match(/Chain:\d+:(\d+)/i);
                if (match && match[1]) {
                    const seconds = parseInt(match[1]) / 1000;
                    if (!isNaN(seconds)) {
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = Math.floor(seconds % 60);
                        result.timeText = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                        return result;
                    }
                }
            }

            return result;
        }

        function updateTimerDisplay(timeString, isCooldown) {
            timerBox.style.display = 'flex';

            let formattedTime = timeString;

            if (/^\d+:\d+$/.test(timeString)) {
                formattedTime = formattedTime.replace(/^(\d+):(\d+)$/, (match, min, sec) => {
                    return min.padStart(2, '0') + ':' + sec.padStart(2, '0');
                });
            }

            const timeComponents = formattedTime.split(':');
            const minutes = parseInt(timeComponents[0]);
            const seconds = parseInt(timeComponents[1]);
            const currentTotalSeconds = (minutes * 60) + seconds;

            if (isCooldown) {
                timerLabel.textContent = 'Cooldown: ';
                timerBox.style.minWidth = '170px';
            } else {
                timerLabel.textContent = 'Chain: ';
                timerBox.style.minWidth = '140px';
            }
            
            timerValue.textContent = formattedTime;

            timerBox.classList.remove('warning', 'danger', 'cooldown', 'reset');

            if (!isCooldown && 
                window.whPreviousChainTime !== null && 
                currentTotalSeconds >= 295 && currentTotalSeconds <= 300 && 
                window.whPreviousChainTime < 290) {
                
                timerBox.classList.add('reset');
                
                setTimeout(() => {
                    timerBox.classList.remove('reset');
                }, 3000);
            }

            if (isCooldown) {
                timerBox.classList.add('cooldown');
                timerBox.setAttribute('title', 'Chain Cooldown');
            } else {
                if (minutes === 4 && seconds >= 55 || minutes === 5 && seconds === 0) {
                    timerBox.classList.add('reset');
                    timerBox.setAttribute('title', 'Chain Timer - Fresh Chain');
                } 
                else if (minutes === 0) {
                    timerBox.classList.add('warning');
                    
                    if (seconds <= 30) {
                        timerBox.classList.remove('warning');
                        timerBox.classList.add('danger');
                    }
                }
            }
            
            window.whPreviousChainTime = currentTotalSeconds;
        }
    }

    function initializeFontAwesome() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
            document.head.appendChild(link);
        }
    }

    function isChatOverlaying() {
        const button = document.getElementById(SETTINGS_UI.settingsButtonId);
        const panel = document.getElementById(SETTINGS_UI.settingsPanelId);
        
        if (!button) return false;
        
        const buttonRect = button.getBoundingClientRect();
        const panelRect = panel && panel.classList.contains('visible') ? 
                         panel.getBoundingClientRect() : null;
        
        const chatElements = document.querySelectorAll('.chat-box, .chatWindow, .chat-active, .chat-box-content, [class*="chatBox"], .chat-box-input-wrap, .chatContainer, .chat-wrap, .dialogue-box, .message-box');
        
        for (const chat of chatElements) {
            const chatRect = chat.getBoundingClientRect();
            
            const buttonOverlap = !(chatRect.right < buttonRect.left || 
                                 chatRect.left > buttonRect.right || 
                                 chatRect.bottom < buttonRect.top || 
                                 chatRect.top > buttonRect.bottom);
            
            let panelOverlap = false;
            if (panelRect) {
                panelOverlap = !(chatRect.right < panelRect.left || 
                              chatRect.left > panelRect.right || 
                              chatRect.bottom < panelRect.top || 
                              chatRect.top > panelRect.bottom);
            }
            
            if (buttonOverlap || panelOverlap) {
                return true;
            }
        }
        
        return false;
    }
    
    function updateVisibility() {
        const button = document.getElementById(SETTINGS_UI.settingsButtonId);
        const panel = document.getElementById(SETTINGS_UI.settingsPanelId);
        if (!button) return;
        
        if (isChatOverlaying()) {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
            
            if (panel && panel.classList.contains('visible')) {
                panel.classList.remove('visible');
            }
        } else {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }
    }
    
    function toggleSettingsPanel(e) {
        if (e) {
            e.stopPropagation();
        }
        
        const panel = document.getElementById(SETTINGS_UI.settingsPanelId);
        if (!panel) return;
        
        const timerBox = document.getElementById('wh-chain-timer-box');
        if (timerBox) {
            const timerRect = timerBox.getBoundingClientRect();
            panel.style.top = (timerRect.bottom + 10) + 'px';
            panel.style.left = '50%';
            panel.style.transform = 'translateX(-50%)';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        } else {
            panel.style.top = '100px';
            panel.style.left = '50%';
            panel.style.transform = 'translateX(-50%)';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
        
        if (!isChatOverlaying()) {
            panel.classList.toggle('visible');
            
            setTimeout(updateVisibility, 50);
        }
    }

    function addSettingsPanelStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #${SETTINGS_UI.settingsPanelId} {
                position: fixed;
                left: auto;
                right: auto;
                bottom: auto;
                top: auto;
                width: ${SETTINGS_UI.panelDimensions.width};
                max-height: ${SETTINGS_UI.panelDimensions.maxHeight};
                background-color: #1c1c1c;
                border: 1px solid #444;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: none;
                overflow-y: auto;
                color: #fff;
                font-family: Arial, sans-serif;
                transform: translateY(20px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }

            #${SETTINGS_UI.settingsPanelId}.visible {
                display: block;
                transform: translateY(0);
                opacity: 1;
            }
            
            /* Style for settings button on chain timer */
            #${SETTINGS_UI.settingsButtonId} {
                display: inline-block;
                opacity: 0.8;
                text-shadow: 0 0 3px rgba(0,0,0,0.5);
            }
            
            #${SETTINGS_UI.settingsButtonId}:hover {
                opacity: 1;
                text-shadow: 0 0 5px rgba(255,255,255,0.8);
            }
        `;
        document.head.appendChild(styleElement);
    }

    function initialize() {
        if (!window.location.href.includes('factions.php')) return;

        loadSettings();

        initializeFontAwesome();

        document.body.classList.add('tornWarHelper');
        addStyles();
        addSettingsPanelStyles();

        setTimeout(createSettingsPanel, 1000);

        window.whPreviousChainTime = null;

        if (SETTINGS.enableChainTimerBox) {
            createChainTimerBox();
            setInterval(updateChainTimerBox, SETTINGS.chainTimerRefreshRate);
        }

        setTimeout(() => {
            highlightFactionMembers();
            if (SETTINGS.enableChainTimerBox) {
                updateChainTimerBox();
            }
        }, 1000);

        setInterval(highlightFactionMembers, SETTINGS.refreshRate);
        
        setInterval(updateVisibility, 300);

        setupMutationObservers();
    }

    function highlightFactionMembers() {
        processRows(getRows('enemy'));
        processRows(getRows('your'));
    }

    function setupMutationObservers() {
        const memberObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' &&
                    mutation.target.classList &&
                    (mutation.target.classList.contains('members-list') ||
                     mutation.target.className.includes('membersWrap___') ||
                     mutation.target.className.includes('member'))) {

                    highlightFactionMembers();
                    break;
                }
            }
        });

        memberObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        const chatObserver = new MutationObserver(() => {
            updateVisibility();
        });
        
        chatObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
        
        document.addEventListener('click', (e) => {
            const panel = document.getElementById(SETTINGS_UI.settingsPanelId);
            const settingsBtn = document.getElementById(SETTINGS_UI.settingsButtonId);
            
            if (panel && panel.classList.contains('visible') && 
                !panel.contains(e.target) && 
                settingsBtn && !settingsBtn.contains(e.target)) {
                
                panel.classList.remove('visible');
            }
        });

        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;

                if (window.location.href.includes('factions.php')) {
                    setTimeout(() => {
                        if (SETTINGS.enableChainTimerBox && !document.getElementById('wh-chain-timer-box')) {
                            createChainTimerBox();
                        }
                        
                        highlightFactionMembers();

                        if (SETTINGS.enableChainTimerBox) {
                            updateChainTimerBox();
                        }
                    }, 500);
                }
            }
        });

        urlObserver.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function createSettingsPanel() {
        if (document.getElementById(SETTINGS_UI.settingsPanelId)) {
            return;
        }
        
        const panel = document.createElement('div');
        panel.id = SETTINGS_UI.settingsPanelId;
        
        panel.innerHTML = `
            <div class="wh-settings-header">
                <span>${SETTINGS_UI.panelTitle}</span>
                <span class="wh-settings-close">&times;</span>
            </div>
        `;
        
        SETTINGS_UI.sections.forEach(section => {
            const sectionEl = document.createElement('div');
            sectionEl.className = 'wh-settings-section';
            
            sectionEl.innerHTML = `<div class="wh-section-title">${section.title}</div>`;
            
            section.settings.forEach(setting => {
                const settingEl = document.createElement('div');
                settingEl.className = 'wh-setting-item';
                
                let inputHtml = '';
                
                switch (setting.type) {
                    case 'checkbox':
                        const checked = SETTINGS[setting.id] ? 'checked' : '';
                        inputHtml = `
                            <label class="wh-setting-label">
                                <input type="checkbox" id="wh-setting-${setting.id}" data-setting-id="${setting.id}" ${checked}>
                                ${setting.label}
                                <span class="wh-setting-tooltip" title="${setting.tooltip}">ⓘ</span>
                            </label>
                        `;
                        break;
                        
                    case 'select':
                        const options = setting.options.map(option => {
                            const selected = SETTINGS[setting.id] === option.value ? 'selected' : '';
                            return `<option value="${option.value}" ${selected}>${option.label}</option>`;
                        }).join('');
                        
                        inputHtml = `
                            <label class="wh-setting-label">
                                ${setting.label}
                                <span class="wh-setting-tooltip" title="${setting.tooltip}">ⓘ</span>
                            </label>
                            <select id="wh-setting-${setting.id}" data-setting-id="${setting.id}">
                                ${options}
                            </select>
                        `;
                        break;
                        
                    case 'number':
                        const value = SETTINGS[setting.id] || setting.default;
                        inputHtml = `
                            <label class="wh-setting-label">
                                ${setting.label}
                                <span class="wh-setting-tooltip" title="${setting.tooltip}">ⓘ</span>
                            </label>
                            <div style="display: flex; align-items: center;">
                                <input type="number" id="wh-setting-${setting.id}" data-setting-id="${setting.id}" 
                                    min="${setting.min}" max="${setting.max}" step="${setting.step}" value="${value}"
                                    style="flex: 1;">
                            </div>
                        `;
                        break;
                        
                    case 'range':
                        const rangeValue = setting.valueParser 
                            ? setting.valueParser(SETTINGS[setting.id]) 
                            : (SETTINGS[setting.id] || setting.default);
                            
                        inputHtml = `
                            <label class="wh-setting-label">
                                ${setting.label}
                                <span class="wh-setting-tooltip" title="${setting.tooltip}">ⓘ</span>
                            </label>
                            <div style="display: flex; align-items: center;">
                                <input type="range" id="wh-setting-${setting.id}" data-setting-id="${setting.id}" 
                                    min="${setting.min}" max="${setting.max}" step="${setting.step}" value="${rangeValue}">
                                <span class="wh-range-value" id="wh-range-value-${setting.id}">${rangeValue}</span>
                            </div>
                        `;
                        break;
                }
                
                settingEl.innerHTML = inputHtml;
                sectionEl.appendChild(settingEl);
            });
            
            panel.appendChild(sectionEl);
        });
        
        const footer = document.createElement('div');
        footer.className = 'wh-settings-footer';
        footer.innerHTML = `
            <button class="wh-reset-btn">Reset</button>
            <button class="wh-save-btn">Save</button>
            <span class="wh-save-message">Settings saved!</span>
        `;
        panel.appendChild(footer);
        
        document.body.appendChild(panel);
        
        setupSettingsPanelEvents();
    }

    function setupSettingsPanelEvents() {
        const panel = document.getElementById(SETTINGS_UI.settingsPanelId);
        if (!panel) return;
        
        panel.querySelector('.wh-settings-close').addEventListener('click', toggleSettingsPanel);
        
        panel.querySelectorAll('input[type="range"]').forEach(input => {
            const settingId = input.getAttribute('data-setting-id');
            const valueDisplay = document.getElementById(`wh-range-value-${settingId}`);
            
            if (valueDisplay) {
                input.addEventListener('input', () => {
                    valueDisplay.textContent = input.value;
                });
            }
        });
        
        panel.querySelector('.wh-save-btn').addEventListener('click', () => {
            saveSettingsFromUI();
            showSaveMessage();
        });
        
        panel.querySelector('.wh-reset-btn').addEventListener('click', resetSettings);
        
        document.addEventListener('click', (e) => {
            const settingsBtn = document.getElementById(SETTINGS_UI.settingsButtonId);
            
            if (panel.classList.contains('visible') && 
                !panel.contains(e.target) && 
                !settingsBtn.contains(e.target)) {
                toggleSettingsPanel();
            }
        });
    }

    function saveSettingsFromUI() {
        const panel = document.getElementById(SETTINGS_UI.settingsPanelId);
        if (!panel) return;
        
        panel.querySelectorAll('[data-setting-id]').forEach(input => {
            const settingId = input.getAttribute('data-setting-id');
            let value;
            
            if (input.type === 'checkbox') {
                value = input.checked;
            } else if (input.type === 'number') {
                value = parseFloat(input.value);
            } else if (input.type === 'range') {
                const section = SETTINGS_UI.sections.find(s => 
                    s.settings.some(set => set.id === settingId)
                );
                const setting = section?.settings.find(s => s.id === settingId);
                
                if (setting && setting.valueConverter) {
                    value = setting.valueConverter(parseFloat(input.value));
                } else {
                    value = parseFloat(input.value);
                }
            } else {
                value = input.value;
            }
            
            SETTINGS[settingId] = value;
        });
        
        saveSettings();
        
        refreshUIWithNewSettings();
    }

    function showSaveMessage() {
        const saveMsg = document.querySelector(`#${SETTINGS_UI.settingsPanelId} .wh-save-message`);
        if (saveMsg) {
            saveMsg.classList.add('visible');
            
            setTimeout(() => {
                saveMsg.classList.remove('visible');
            }, SETTINGS_UI.saveMessageDuration);
        }
    }

    function resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            localStorage.removeItem('tornWarHelperSettings');
            
            window.location.reload();
        }
    }

    function refreshUIWithNewSettings() {
        const existingTimerBox = document.getElementById('wh-chain-timer-box');
        if (existingTimerBox) {
            existingTimerBox.remove();
        }
        
        if (SETTINGS.enableChainTimerBox) {
            createChainTimerBox();
            updateChainTimerBox();
        }
        
        document.head.querySelector('style')?.remove();
        addStyles();
        
        highlightFactionMembers();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();