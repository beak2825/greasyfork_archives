// ==UserScript==
// @name         Torn Jail - Fast Refresh
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Adds a single button to soft-refresh the jail. Click once to set the page, then click again or use the d key to refresh.
// @author       defend [2683949]
// @match        https://www.torn.com/jailview.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543411/Torn%20Jail%20-%20Fast%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/543411/Torn%20Jail%20-%20Fast%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideTornToolsIcon() {
        const headerIcon = document.querySelector('.users-list-title i.tt-quick-refresh');
        if (headerIcon && headerIcon.style.display !== 'none') {
            headerIcon.style.display = 'none';
        }
        const bottomWrapper = document.querySelector('div.tt-quick-refresh-wrap');
        if (bottomWrapper && bottomWrapper.style.display !== 'none') {
            bottomWrapper.style.display = 'none';
        }
    }

    const observer = new MutationObserver(() => {
        hideTornToolsIcon();
        initializeOurButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function initializeOurButton() {
        const parentContainer = document.querySelector('.users-list-title');
        if (!parentContainer || document.getElementById('my-jail-toggler')) {
            return;
        }

        let startPointA = null;
        let startPointB = null;
        const smartButton = document.createElement('a');
        smartButton.id = 'my-jail-toggler';
        smartButton.href = "#";

        function handleToggle() {
            const currentHash = window.location.hash || '#start=0';
            const currentPageStart = parseInt(currentHash.replace('#start=', ''), 10);
            if (currentPageStart === startPointB) {
                window.location.hash = (startPointA === 0) ? '' : `#start=${startPointA}`;
            } else {
                window.location.hash = `#start=${startPointB}`;
            }
        }

        function handleSetPoint(event) {
            event.preventDefault();
            const currentHash = window.location.hash || '#start=0';
            const currentPageStart = parseInt(currentHash.replace('#start=', ''), 10);
            startPointA = currentPageStart;
            startPointB = currentPageStart + 50;

            const hasTornToolsIcon = document.querySelector('.tt-quick-refresh');

            if (hasTornToolsIcon) {
                smartButton.innerHTML = '<i class="fa-solid fa-arrow-rotate-right"></i>';
                smartButton.style.fontSize = '14px';
                smartButton.style.top = '1px';
                smartButton.style.right = '16px';
            } else {
                smartButton.textContent = '[Refresh]';
                smartButton.style.fontSize = '11px';
                smartButton.style.top = '2px';
                smartButton.style.right = '10px';
            }

            smartButton.removeEventListener('click', handleSetPoint);
            smartButton.addEventListener('click', (e) => {
                e.preventDefault();
                handleToggle();
            });
        }

        parentContainer.style.position = 'relative';
        smartButton.textContent = '[Set Page]';
        smartButton.style.cssText = `
            position: absolute;
            right: 10px;
            top: 2px;
            font-size: 11px;
            font-weight: normal;
            color: #ddd;
            text-decoration: none;
            cursor: pointer;
        `;
        smartButton.addEventListener('click', handleSetPoint);
        parentContainer.appendChild(smartButton);

        hideTornToolsIcon();

        document.addEventListener('keydown', function(event) {
            // Do not trigger the keybind if the user is typing in an input field.
            if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
                return;
            }

            // Check if the pressed key is "d" AND if the toggle has been set (startPointA is not null).
            // Change the "d" to whatever key you want to use for refreshing.
            if (event.key === 'd' && startPointA !== null) {
                event.preventDefault();

                handleToggle();
            }
        });

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOurButton);
    } else {
        initializeOurButton();
    }
})();