// ==UserScript==
// @name         StackEdit.io - Distractionless Mode
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Simplified UI and live status updates for StackEdit.io.
// @match        https://stackedit.io/*
// @grant        none
// @license      CC BY-NC-ND 4.0; https://creativecommons.org/licenses/by-nc-nd/4.0/
// @icon         https://cdn-icons-png.flaticon.com/128/420/420140.png
// @downloadURL https://update.greasyfork.org/scripts/494326/StackEditio%20-%20Distractionless%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/494326/StackEditio%20-%20Distractionless%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideElements = selectors => {
        selectors.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                el.style.display = 'none';
            });
        });
    };

    const toggleStatusBar = () => {
        const statusBarButton = document.querySelector('.button-bar__button--status-bar-toggler');
        if (statusBarButton && statusBarButton.classList.contains('button-bar__button--on')) {
            statusBarButton.click();
        }
    };

    const setElementStyle = (selector, styles) => {
        const element = document.querySelector(selector);
        if (element) Object.assign(element.style, styles);
    };

    function updateStatusBar() {
        const values = document.querySelectorAll('.stat-panel__block--right .stat-panel__value');
        const navBar = document.querySelector('.navigation-bar--editor .navigation-bar__inner--title');

        if (values.length >= 2 && navBar) {
            const charCount = values[0].textContent;
            const wordCount = values[1].textContent;
            let statusDisplay = document.querySelector('.custom-status-display');

            if (!statusDisplay) {
                statusDisplay = document.createElement('div');
                statusDisplay.className = 'custom-status-display';
                statusDisplay.style.fontSize = '15px';
                statusDisplay.style.alignSelf = 'center';
                statusDisplay.style.padding = '0 10px';
                statusDisplay.style.color = '#b9b9b9';
                navBar.prepend(statusDisplay);
            }

            statusDisplay.innerHTML = `<b>${charCount}</b> Chars <b>${wordCount}</b> Words`;
        }
    }

    function updatePrintButton() {
        const printButton = document.querySelector('.navigation-bar__button--publish');
        if (printButton) {
            printButton.removeAttribute('disabled');
            printButton.title = 'Print';
            printButton.ariaLabel = 'Print';
            const printIcon = printButton.querySelector('svg');
            if (printIcon) {
                printIcon.innerHTML = '<path d="M6 9V3h12v6h4v9h-4v3H6 v-3 H2 V9 h4m2-4 v4 h8 V5 H8 m8 14 v-5 H8 v5 h8 m-6-3 h4 v2 h-4 v-2z"></path>';
            }
            printButton.addEventListener('click', function() {
                window.print();
            });
        }
    }

    function customizeUI() {
        hideElements([
            '.navigation-bar__title--input',
            '.navigation-bar__button--stackedit',
            '.navigation-bar__button--explorer-toggler',
            '.navigation-bar__button--sync',
            '.navigation-bar__spinner'
        ]);

        setElementStyle('.navigation-bar__inner--right.navigation-bar__inner--title.flex--row', { paddingRight: '15px' });
        setElementStyle('.flex.flex--row', { gap: '0' });
        const flexButtons = document.querySelectorAll('.flex.flex--row button');
        flexButtons.forEach(function(btn) {
            btn.style.margin = '0';
        });

        const middleBar = document.querySelector('.layout__panel.layout__panel--button-bar');
        if (middleBar) {
            Object.assign(middleBar.style, {
                background: 'linear-gradient(to right, #ffffff 50%, #f3f3f3 50%)',
                width: '26px'
            });
            const buttons = middleBar.querySelectorAll('.button-bar__button');
            buttons.forEach(function(btn) {
                btn.style.visibility = 'hidden';
            });
        }

        const style = document.createElement('style');
        style.innerHTML = `
            ::-webkit-scrollbar { display: none; }
            body { overflow: hidden; }
            .layout__panel--navigation-bar {
                background-color: #1a1a1a;
            }
        `;
        document.head.appendChild(style);
    }

    function observeStatusUpdates() {
        const targetNode = document.querySelector('.stat-panel');
        if (targetNode) {
            const observer = new MutationObserver(updateStatusBar);
            observer.observe(targetNode, { childList: true, subtree: true, characterData: true });
        }
    }

    window.addEventListener('load', function() {
        toggleStatusBar();
        customizeUI();
        updatePrintButton();
        observeStatusUpdates();
        updateStatusBar();
    });
})();