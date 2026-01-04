// ==UserScript==
// @name         Torn RR Skip Bet Confirmation
// @namespace    Phantom Scripting
// @version      0.2
// @author       ErrorNullTag
// @description  The Request (RR)
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/474925/Torn%20RR%20Skip%20Bet%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/474925/Torn%20RR%20Skip%20Bet%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAndAttachListener(startSelector, confirmSelector) {
        const startButton = document.querySelector(startSelector);
        if (startButton) {
            startButton.addEventListener('click', () => {
                const confirmInterval = setInterval(() => {
                    const confirmButton = document.querySelector(confirmSelector);
                    const startButtonExists = document.querySelector(startSelector);
                    if (!startButtonExists && confirmButton) {
                        const clickEvent = new MouseEvent("click", {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        confirmButton.dispatchEvent(clickEvent);
                        console.log(`Clicked confirmation button with selector: ${confirmSelector}`);
                        clearInterval(confirmInterval);
                        startProcess();
                    }
                }, 100);
            });
            console.log(`Attached click listener to start button with selector: ${startSelector}`);
            return true;
        } else {
            console.log(`Could not find start button.`);
            return false;
        }
    }

    function startProcess() {
        const interval = setInterval(() => {
            if (findAndAttachListener('.submit___Yr2z1', '[data-type="confirm"]')) {
                clearInterval(interval);
            }
        }, 1000);
    }

    startProcess();
})();
