// ==UserScript==
// @name         Change Agent
// @namespace    https://github.com/appel/userscripts
// @version      0.1.1
// @description  Monitor any page for element changes and pop an alert if a change is detected.
// @author       Ap
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495908/Change%20Agent.user.js
// @updateURL https://update.greasyfork.org/scripts/495908/Change%20Agent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            changeAgentEl: params.get('change_agent_el'),
            changeAgentTime: parseInt(params.get('change_agent_time') || '15', 10)
        };
    }

    function generateStorageKey() {
        return `change_agent_el_${window.location.href}`;
    }

    function storeElementContent(selector) {
        const element = document.querySelector(selector);
        if (element) {
            localStorage.setItem(generateStorageKey(), element.outerHTML);
            console.log(`Stored content for ${selector}:`, element.outerHTML);
        } else {
            console.warn(`Element with selector ${selector} not found`);
        }
    }

    function checkForChange(selector) {
        const storageKey = generateStorageKey();
        const storedContent = localStorage.getItem(storageKey);
        const currentElement = document.querySelector(selector);

        if (currentElement && storedContent) {
            console.log(`Stored content for ${selector} on reload:`, storedContent);
            if (currentElement.outerHTML !== storedContent) {
                alert('The monitored element has changed!');
                console.log("something changed!");
                console.log("Old value: ", storedContent);
                console.log("New value: ", currentElement.outerHTML);
            } else {
                setTimeout(() => location.reload(), changeAgentTime * 60 * 1000);
                document.querySelector('#countdown').textContent = 'No change: ' + document.querySelector('#countdown').textContent;
            }
        } else {
            console.warn(`Element with selector ${selector} not found or no stored content`);
        }
    }

    function createCountdownTimer(duration, display) {
        let timer = duration;
        let paused = false;
        display.textContent = formatTime(timer);

        display.addEventListener('click', () => {
            paused = !paused;
            display.style.backgroundColor = paused ? '#f44336' : '#f44336d4';
        });

        setInterval(() => {
            if (!paused) {
                timer--;
                display.textContent = formatTime(timer);
                if (timer <= 0) {
                    location.reload();
                }
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function initCountdown(duration) {
        const countdownDiv = document.createElement('div');
        countdownDiv.id = 'countdown';
        countdownDiv.style.position = 'fixed';
        countdownDiv.style.bottom = '1rem';
        countdownDiv.style.left = '50%';
        countdownDiv.style.padding = '5px 10px';
        countdownDiv.style.backgroundColor = '#f44336d4';
        countdownDiv.style.color = 'white';
        countdownDiv.style.cursor = 'pointer';
        countdownDiv.style.zIndex = 10000;
        document.body.appendChild(countdownDiv);
        createCountdownTimer(duration, countdownDiv);
    }

    const { changeAgentEl, changeAgentTime } = getQueryParams();

    if (changeAgentEl) {
        window.addEventListener('load', () => {
            initCountdown(changeAgentTime * 60);

            setTimeout(() => {
                storeElementContent(changeAgentEl);

                setTimeout(() => {
                    location.reload();
                }, 15 * 60 * 1000);
            }, 30 * 1000);

            setTimeout(() => {
                checkForChange(changeAgentEl);
            }, changeAgentTime * 60 * 1000);
        });
    }
})();
