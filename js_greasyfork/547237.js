// ==UserScript==
// @name         WhatsApp - maximize chat to narrow window
// @version      1.0
// @description  Hides all sidebars to maximize the chat view. Allows use on narrow viewports.
// @author       Andraž Kos (andraz)
// @namespace    http://github.com/andraz
// @match        https://web.whatsapp.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547237/WhatsApp%20-%20maximize%20chat%20to%20narrow%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/547237/WhatsApp%20-%20maximize%20chat%20to%20narrow%20window.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let focusModeActive = false;
    let focusButton = null;

    GM_addStyle(`
        .whatsapp-focus-button {
            color: white;
            position: fixed !important; top: 0.75rem !important; right: 7.5rem !important;
            z-index: 10000 !important;
            background-color: transparent !important;
            border-radius: 99rem !important;
            padding: 8px !important;
            cursor: pointer !important;
            display: flex; align-items: center; justify-content: center;
            opacity: 0.1 !important;
        }
        .whatsapp-focus-button:hover {
            background-color: var(--button-secondary-background-hover) !important;
            transform: scale(1.05) !important;
            background-color: var(--button-primary-background) !important;
        }
        .whatsapp-focus-button svg {
            width: 24px; height: 24px; fill: var(--icon-primary) !important;
        }
        .whatsapp-focus-button.active {
            opacity: 1 !important;
        }
        .whatsapp-focus-button.active svg {
            fill: var(--panel-header-icon) !important;
        }

        body.whatsapp-focus-mode #app > div[tabindex="-1"] > div > div[tabindex="-1"] > header,
        body.whatsapp-focus-mode #app > div[tabindex="-1"] > div > div[tabindex="-1"] > div:nth-child(3),
        body.whatsapp-focus-mode #app > div[tabindex="-1"] > div > div[tabindex="-1"] > div:nth-child(4) {
            display: none !important;
        }

        #app div {
            min-width: 0px !important;
        }
    `);

    const focusIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M10 4H6a2 2 0 0 0-2 2v4h2V6h4V4zm4 0v2h4v4h2V6a2 2 0 0 0-2-2h-4zm4 14h-4v2h4a2 2 0 0 0 2-2v-4h-2v4zM6 18H4v-4H2v4a2 2 0 0 0 2 2h4v-2z"></path></svg>`;

    function toggleFocusMode() {
        if (!focusModeActive && !document.querySelector('#main')) {
            alert('Please open a chat before activating Focus Mode.');
            return;
        }
        focusModeActive = !focusModeActive;
        document.body.classList.toggle('whatsapp-focus-mode', focusModeActive);

        if (focusButton) {
            focusButton.classList.toggle('active', focusModeActive);
            focusButton.innerHTML = focusIcon;
            focusButton.title = focusModeActive ? 'Exit Focus Mode (Esc or F9)' : 'Enter Focus Mode (F9)';
        }
    }

    function handleKeyboard(e) {
        if (e.key === 'Escape' && focusModeActive) {
            toggleFocusMode();
        }
        if (e.key === 'F9') {
            e.preventDefault();
            toggleFocusMode();
        }
    }

    function init() {
        const observer = new MutationObserver((mutations, obs) => {
            const sidePanel = document.getElementById('side');
            // The grid container is two levels above the #side panel
            const gridParent = sidePanel.parentElement.parentElement;

            if (gridParent && gridParent.querySelector('#main')) {

                if (!document.querySelector('.whatsapp-focus-button')) {
                    focusButton = document.createElement('button');
                    focusButton.className = 'whatsapp-focus-button';
                    focusButton.innerHTML = focusIcon;
                    focusButton.title = 'Enter Focus Mode (F9)';
                    focusButton.addEventListener('click', toggleFocusMode);
                    document.body.appendChild(focusButton);
                    document.addEventListener('keydown', handleKeyboard);
                }

                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();