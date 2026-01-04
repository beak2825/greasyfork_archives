// ==UserScript==
// @name         GeoGuessr Focus Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Activates a Focus Mode in GeoGuessr Duels which hides opponent names and Rank/Elo automatically. You can turn the mode on and off in the Duels lobby.
// @author       AaronThug
// @license      MIT
// @icon         https://www.geoguessr.com/favicon.ico
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540540/GeoGuessr%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540540/GeoGuessr%20Focus%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let focusModeEnabled = false;
    let MY_USERNAME = '';

    function createFocusModeButton() {
        if (document.querySelector('#focus-mode-container')) return;
        if (window.location.pathname !== '/multiplayer') return;
        const gameModeContainer = document.querySelector('.player-section_gameModeContainer__umor6');
        if (!gameModeContainer) return;

        const outerContainer = document.createElement('div');
        outerContainer.id = 'focus-mode-container';
        outerContainer.style.cssText = `
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: linear-gradient(145deg, #2a2550 0%, #1f1a42 100%);
            border: 2px solid #3d3764;
            border-radius: 20px;
            padding: 16px 24px;
            box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 16px;
            backdrop-filter: blur(10px);
        `;

        const label = document.createElement('span');
        label.textContent = 'Focus Mode';
        label.style.cssText = `
            font-family: 'neo-sans', 'Helvetica Neue', Arial, sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            user-select: none;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        `;

        const toggleContainer = document.createElement('div');
        toggleContainer.style.cssText = `
            width: 52px;
            height: 28px;
            background: linear-gradient(145deg, #1a1538 0%, #0f0f2a 100%);
            border: 1px solid #4a4a6a;
            border-radius: 14px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow:
                inset 0 2px 4px rgba(0, 0, 0, 0.5),
                0 1px 2px rgba(255, 255, 255, 0.1);
        `;

        const toggleKnob = document.createElement('div');
        toggleKnob.style.cssText = `
            width: 24px;
            height: 24px;
            background: linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%);
            border: 1px solid #d0d0d0;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow:
                0 2px 6px rgba(0, 0, 0, 0.3),
                0 1px 2px rgba(0, 0, 0, 0.2);
        `;

        function updateToggleAppearance() {
            if (focusModeEnabled) {
                toggleContainer.style.background = 'linear-gradient(145deg, #4CAF50 0%, #45a049 100%)';
                toggleContainer.style.borderColor = '#388e3c';
                toggleContainer.style.boxShadow = `
                    inset 0 1px 2px rgba(255, 255, 255, 0.2),
                    0 2px 8px rgba(76, 175, 80, 0.4)`;
                toggleKnob.style.transform = 'translateX(24px)';
                toggleKnob.style.background = 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)';
                toggleKnob.style.boxShadow = `
                    0 3px 8px rgba(0, 0, 0, 0.4),
                    0 1px 3px rgba(0, 0, 0, 0.2)`;
            } else {
                toggleContainer.style.background = 'linear-gradient(145deg, #1a1538 0%, #0f0f2a 100%)';
                toggleContainer.style.borderColor = '#4a4a6a';
                toggleContainer.style.boxShadow = `
                    inset 0 2px 4px rgba(0, 0, 0, 0.5),
                    0 1px 2px rgba(255, 255, 255, 0.1)`;
                toggleKnob.style.transform = 'translateX(0)';
                toggleKnob.style.background = 'linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)';
                toggleKnob.style.boxShadow = `
                    0 2px 6px rgba(0, 0, 0, 0.3),
                    0 1px 2px rgba(0, 0, 0, 0.2)`;
            }
        }

        toggleContainer.addEventListener('click', () => {
            focusModeEnabled = !focusModeEnabled;
            updateToggleAppearance();
            localStorage.setItem('geoguessr-focus-mode', focusModeEnabled);
            if (focusModeEnabled) {
                setTimeout(() => {
                    if (!MY_USERNAME) detectMyUsername();
                    censorOpponentNames();
                }, 100);
            }
        });

        updateToggleAppearance();
        toggleContainer.appendChild(toggleKnob);
        panel.appendChild(label);
        panel.appendChild(toggleContainer);
        outerContainer.appendChild(panel);
        gameModeContainer.parentNode.insertBefore(outerContainer, gameModeContainer);
    }

    function detectMyUsername() {
        const duelsNickElement = document.querySelector('.user-nick_nick__sRjZ2.user-nick_visibleOverflow__oR46v');
        if (duelsNickElement && duelsNickElement.textContent) {
            const username = duelsNickElement.textContent.replace(/\s+/g, ' ').trim();
            if (username.length > 0 && username.length < 30) {
                MY_USERNAME = username;
                return true;
            }
        }
        try {
            const userData = localStorage.getItem('gg-user-data');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.nick || user.username || user.name) {
                    MY_USERNAME = user.nick || user.username || user.name;
                    return true;
                }
            }
        } catch (e) {}
        const profileSelectors = [
            '[data-qa="navbar-profile-button"]',
            '.navbar-profile-button',
            '.profile-button'
        ];
        for (const selector of profileSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                const username = element.textContent.trim();
                if (username.length > 0 && username.length < 30 && !username.includes('Profile')) {
                    MY_USERNAME = username;
                    return true;
                }
            }
        }
        return false;
    }

    function censorName(element) {
        if (!element || !element.textContent) return;
        const text = element.textContent.trim();
        if (text === MY_USERNAME) return;
        if (text.length < 2 || /^\d+$/.test(text)) return;
        element.textContent = '?';
    }

    function censorChatMessage(message) {
        if (window.location.pathname !== '/multiplayer') return;
        if (!message || !message.textContent || message.dataset.censored) return;
        const text = message.textContent.trim();
        if (text.includes('has guessed') || text.includes('guessed')) {
            const username = text.split(/has guessed|guessed/)[0].trim();
            if (username !== MY_USERNAME) {
                message.textContent = message.textContent.replace(username, '?');
                message.dataset.censored = 'true';
            }
        }
    }

    function censorOpponentNames() {
        if (window.location.pathname !== '/multiplayer') return;
        if (!focusModeEnabled) return;

        const matchmakingNames = document.querySelectorAll('.summon-glow-text_root__iYz_y');
        matchmakingNames.forEach(element => {
            if (element.closest('.ranked-leaderboard_root__kpVHS')) return;
            const textNodes = Array.from(element.childNodes).filter(node =>
                node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            );
            textNodes.forEach(textNode => {
                const text = textNode.textContent.trim();
                if (text !== MY_USERNAME && text.length > 1) {
                    textNode.textContent = '?';
                    const shadowElement = element.querySelector('.summon-glow-text_shadowPlaceholder___MC0p');
                    if (shadowElement) shadowElement.textContent = '?';
                }
            });
        });

        const chatContainer = document.querySelector('.chat-log_scrollContainer__0fy56');
        if (chatContainer) {
            const messages = Array.from(chatContainer.children);
            messages.forEach(message => {
                if (!message.dataset.censored) {
                    censorChatMessage(message);
                }
            });
        }

        const healthBarNames = document.querySelectorAll('.health-bar-2_nick__dWcMx');
        healthBarNames.forEach(element => {
            if (element.closest('.ranked-leaderboard_root__kpVHS')) return;
            censorName(element);
        });

        const additionalSelectors = [
            '[class*="nick"]:not(.user-nick_visibleOverflow__oR46v)',
            '[class*="player-name"]',
            '[class*="opponent"]'
        ];
        additionalSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.closest('.side-tray_body__30bbe')) return;
                if (element.closest('.ranked-leaderboard_root__kpVHS')) return;
                if (!element.classList.contains('summon-glow-text_root__iYz_y') &&
                    !element.classList.contains('health-bar-2_nick__dWcMx') &&
                    !element.classList.contains('user-nick_visibleOverflow__oR46v')) {
                    if (element.textContent && element.textContent.trim() && element.textContent.trim().length > 1) {
                        censorName(element);
                    }
                }
            });
        });
    }

    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (
                window.location.pathname === '/multiplayer' &&
                mutation.target.classList?.contains('chat-log_scrollContainer__0fy56')
            ) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && !node.dataset.censored) {
                        censorChatMessage(node);
                    }
                }
                continue;
            }
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
        }
        if (shouldUpdate && focusModeEnabled && window.location.pathname === '/multiplayer') {
            setTimeout(() => {
                if (window.location.pathname === '/multiplayer') {
                    createFocusModeButton();
                    if (!MY_USERNAME) detectMyUsername();
                    censorOpponentNames();
                }
            }, 200);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    const savedStatus = localStorage.getItem('geoguessr-focus-mode');
    if (savedStatus === 'true') {
        focusModeEnabled = true;
    }

    setTimeout(() => {
        detectMyUsername();
        if (window.location.pathname === '/multiplayer') {
            createFocusModeButton();
        }
        censorOpponentNames();
    }, 1000);

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                if (!MY_USERNAME) detectMyUsername();
                if (window.location.pathname === '/multiplayer') {
                    createFocusModeButton();
                }
                censorOpponentNames();
            }, 500);
        }
    }).observe(document, { subtree: true, childList: true });
})();