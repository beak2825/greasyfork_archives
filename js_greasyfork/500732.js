// ==UserScript==
// @name         [KPX] Sulane Auto-Clicker Enable
// @namespace    https://www.sulane.net/
// @version      0.1
// @description  Automatically clicks autokilliker button
// @author       KPCX
// @match        https://www.sulane.net/avaleht.php?asukoht=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sulane.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500732/%5BKPX%5D%20Sulane%20Auto-Clicker%20Enable.user.js
// @updateURL https://update.greasyfork.org/scripts/500732/%5BKPX%5D%20Sulane%20Auto-Clicker%20Enable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your waitForElements function
    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    // Simulate a mouse click on the "Autoklikker" checkbox
    function simulateMouseClick(targetNode) {
        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent('click', true, true);
        targetNode.dispatchEvent(clickEvent);
    }

    // Wait for the checkbox to appear
    waitForElements('#autoClickerCheckBox', 200, 50, 'checkbox')
        .then(checkbox => {
            // Simulate a click on the checkbox
            simulateMouseClick(checkbox[0]);
        })
        .catch(error => {
            console.error(error.message);
        });
})();
