// ==UserScript==
// @name         Jira TestPlayer Buttons
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Кнопки для скролла и сворачивания в Jira Test Player
// @match        https://jira._______.ru/secure/Tests.jspa*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536685/Jira%20TestPlayer%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/536685/Jira%20TestPlayer%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 500);
    }

    function createButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.zIndex = '9999';
        container.style.background = 'white';
        container.style.padding = '10px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        container.style.fontSize = '16px';

        const scrollBtn = document.createElement('button');
        scrollBtn.textContent = '⬇️';
        scrollBtn.style.marginRight = '5px';
        scrollBtn.onclick = () => {
            waitForElement('#ktm-test-player-scope > div.ktm-test-player-scope-single-view.ng-scope > div.ktm-groups-list.ng-scope', (element) => {
                (function scrollToBottom(element) {
                    let scrollTop = -1;
                    let positionCount = 0;
                    const observer = new MutationObserver(function () {
                        element.scrollTop = element.scrollHeight;
                        if (element.scrollTop === scrollTop) {
                            positionCount++;
                        } else {
                            positionCount = 0;
                        }
                        scrollTop = element.scrollTop;
                    });
                    const config = { childList: true, subtree: true };
                    observer.observe(element, config);
                    element.scrollTop = element.scrollHeight;
                })(element);
            });
        };

        const collapseBtn = document.createElement('button');
        collapseBtn.textContent = '✅';
        collapseBtn.onclick = () => {
            const selectors = document.querySelectorAll('.ktm-group-header');
            selectors.forEach(function (header) {
                const icon = header.querySelector('.ktm-collapse-icon');
                if (icon && icon.classList.contains('ktm-expanded-icon')) {
                    header.click();
                }
            });
        };

        container.appendChild(scrollBtn);
        container.appendChild(collapseBtn);
        document.body.appendChild(container);
    }

    window.addEventListener('load', () => {
        setTimeout(createButtons, 2000);
    });
})();
