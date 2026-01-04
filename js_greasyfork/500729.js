// ==UserScript==
// @name         [KPX] CB - Auto Click "I AGREE"
// @namespace    https://chaturbate.com/
// @version      0.1
// @description  Automatically clicks the "I AGREE" button on entrance terms popup.
// @author       KPCX
// @match        https://chaturbate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500729/%5BKPX%5D%20CB%20-%20Auto%20Click%20%22I%20AGREE%22.user.js
// @updateURL https://update.greasyfork.org/scripts/500729/%5BKPX%5D%20CB%20-%20Auto%20Click%20%22I%20AGREE%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    waitForElements('#close_entrance_terms', 500, 20, 'I AGREE button')
        .then(elements => {
            const agreeButton = elements[0];
            agreeButton.click();
            console.log('Clicked the "I AGREE" button.');
        })
        .catch(error => {
            console.error(error.message);
        });
})();