// ==UserScript==
// @name         Temp Warning Mobile
// @namespace    heartflower.torn
// @version      1.0
// @description  Screen gets red layer when someone throws a temp on you (for mobile)
// @author       Heartflower
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530418/Temp%20Warning%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/530418/Temp%20Warning%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let attackerName = '';
    let processedMessages = new Set();

    function findAttackerName(attacker) {
        let userName = attacker.querySelector('.userName___loAWK');

        if (attackerName === '') {
            attackerName = userName.textContent;
        }
    }

    function checkAttack(element) {
        if (attackerName === '') {
            setTimeout(() => checkAttack(element), 100);
            return;
        }

        let text = element.textContent;

        // If the message has already been processed, return early
        if (processedMessages.has(text)) return;

        let attackPatterns = [
            `near ${attackerName}`,
            `around ${attackerName}`,
            `in ${attackerName}'s face`
        ];

        let selfAttackPatterns = [
            `${attackerName} threw`,
            `${attackerName} sprayed`
        ];

        // Ensure it's not self-inflicted
        if (selfAttackPatterns.some(pattern => text.includes(pattern))) return;

        // Check if attacked
        if (attackPatterns.some(pattern => text.includes(pattern))) {
            processedMessages.add(text); // Store the processed message
            findElement(document.body, '.effectsWrap___qpu5J');
        }
    }

    // Create a mutation observer to watch for changes on the page
    function createObserver(element) {
        let target;
        target = element;

        if (!target) {
            console.error(`Target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        checkAttack(node);
                    });

                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    // Find an element based on className
    function findElement(parent, className) {
        let element = parent.querySelector(className);
        if (!element) {
            setTimeout(() => findElement(parent, className), 10);
            return;
        }

        if (className === '.playersModelWrap___dkqHO') {
            findElement(element, '.green___QtOKw');
        } else if (className === '.green___QtOKw') {
            findAttackerName(element);
        } else if (className === '.logWrap___Sspzk') {
            findElement(element, '.list___UZYhA');
        } else if (className === '.list___UZYhA') {
            createObserver(element);
        } else if (className === '.effectsWrap___qpu5J') {
            element.style.transition = 'background 3s ease-in-out';
            element.style.background = '#ff000040';

            setTimeout(() => {
                element.style.transition = 'background 3s ease-in-out';
                element.style.background = '#ff000040';
            }, 3000); // Stay

            setTimeout(() => {
                element.style.transition = 'background 3s ease-in-out';
                element.style.background = 'transparent';
            }, 6000); // Fade out
        }
    }

    findElement(document.body, '.playersModelWrap___dkqHO');
    findElement(document.body, '.logWrap___Sspzk');
})();