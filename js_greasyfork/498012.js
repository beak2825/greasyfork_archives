// ==UserScript==
// @name         [KPX] Disable travel button when Flight Time detected - Torn Helper
// @namespace    https://www.torn.com/
// @version      0.3
// @description  Disables the "TRAVEL" button if "Flight Time" is detected on the page.
// @author       KPCX
// @match        https://www.torn.com/travelagency.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498012/%5BKPX%5D%20Disable%20travel%20button%20when%20Flight%20Time%20detected%20-%20Torn%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/498012/%5BKPX%5D%20Disable%20travel%20button%20when%20Flight%20Time%20detected%20-%20Torn%20Helper.meta.js
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

    // Get all the city buttons
    let cityButtons = document.querySelectorAll('.raceway');

    // Add a click event listener to each button
    cityButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Function to wait for the new menu to load
            waitForElements('.travel-info-btn', 200, 999, 'TRAVEL Button')
            .then((elements) => {
                const pageText = document.body.innerText;
                if (pageText.includes('before you return')) {
                    elements.forEach((element) => {
                        const button = element.querySelector('.torn-btn');
                        if (button && button.innerText.toLowerCase() === 'travel') {
                            let clicked = false;

                            // Add click event to the TRAVEL button
                            button.addEventListener('click', (event) => {
                                if (!clicked) {
                                    event.preventDefault();
                                    alert("You're going to travel before OC ready");
                                    clicked = true;
                                }
                            });
                        }
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
        });
    });
})();