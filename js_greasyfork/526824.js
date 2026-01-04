// ==UserScript==
// @name         OC Role Display
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Dynamically numbers duplicate OC roles based on slot order
// @author       Allenone [2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526824/OC%20Role%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/526824/OC%20Role%20Display.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let globalObserver = null;
    let processing = false;
    const roleMappings = {};
    const debounceDelay = 200;

    const requestIdleCallback = window.requestIdleCallback || function(callback) {
        return setTimeout(callback, 200);
    };

    function processScenario(element) {
        const ocName = element.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = element.querySelectorAll('.wrapper___Lpz_D');

        if (!roleMappings[ocName]) {
            const slotsWithPosition = Array.from(slots).map(slot => {
                const slotFiberKey = Object.keys(slot).find(key => key.startsWith("__reactFiber$"));
                if (!slotFiberKey) return null;

                const fiberNode = slot[slotFiberKey];
                const positionKey = fiberNode.return.key.replace('slot-', '');
                const positionNumber = parseInt(positionKey.match(/P(\d+)/)?.[1] || 0, 10);

                return { slot, positionNumber };
            }).filter(Boolean);

            slotsWithPosition.sort((a, b) => a.positionNumber - b.positionNumber);

            const originalNames = slotsWithPosition.map(({ slot }) => {
                return slot.querySelector('.title___UqFNy')?.innerText.trim() || "Unknown";
            });

            const frequencyMap = originalNames.reduce((acc, name) => {
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            }, {});

            const displayNames = [];
            const countTracker = {};

            originalNames.forEach(name => {
                if (frequencyMap[name] > 1) {
                    countTracker[name] = (countTracker[name] || 0) + 1;
                    displayNames.push(`${name} ${countTracker[name]}`);
                } else {
                    displayNames.push(name);
                }
            });

            roleMappings[ocName] = displayNames;
        }

        slots.forEach(slot => {
            const slotFiberKey = Object.keys(slot).find(key => key.startsWith("__reactFiber$"));
            if (!slotFiberKey) return;

            const fiberNode = slot[slotFiberKey];
            const positionKey = fiberNode.return.key.replace('slot-', '');
            const positionNumber = parseInt(positionKey.match(/P(\d+)/)?.[1] || 0, 10);
            const roleIndex = positionNumber - 1;
            const displayName = roleMappings[ocName][roleIndex];

            const roleElement = slot.querySelector('.title___UqFNy');
            if (displayName && roleElement && roleElement.innerText !== displayName) {
                roleElement.innerText = displayName;
            }
        });
    }

    function doOnHashChange() {
        if (processing) return;
        processing = true;

        requestIdleCallback(() => {
            try {
                const ocElements = document.querySelectorAll('.wrapper___U2Ap7:not(.role-processed)');
                ocElements.forEach(element => {
                    element.classList.add('role-processed');
                    processScenario(element);
                });
            } finally {
                processing = false;
            }
        });
    }

    function observeButtonContainer() {
        let buttonContainer = document.querySelector('.buttonsContainer___aClaa');
        if (buttonContainer) {
            buttonContainer.addEventListener('click', () => {
                document.querySelectorAll('.wrapper___U2Ap7').forEach(el => {
                    el.classList.remove('role-processed');
                });
                doOnHashChange();
            });
        } else {
            setTimeout(observeButtonContainer, 500);
        }
    }

    function setupHashChangeListener() {
        window.addEventListener('hashchange', () => {
            document.querySelectorAll('.wrapper___U2Ap7.role-processed').forEach(el => {
                el.classList.remove('role-processed');
            });
            doOnHashChange();
        });
    }

    function initializeScript() {
        if (globalObserver) globalObserver.disconnect();

        const targetNode = document.querySelector('#factionCrimes-root') || document.body;

        globalObserver = new MutationObserver(debounce(() => {
            if (!document.querySelector('.wrapper___U2Ap7')) return;
            doOnHashChange();
        }, debounceDelay));

        globalObserver.observe(targetNode, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        doOnHashChange();
        observeButtonContainer();
        setupHashChangeListener();
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    if (document.readyState === 'complete') {
        initializeScript();
    } else {
        window.addEventListener('load', initializeScript);
    }
})();