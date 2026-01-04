// ==UserScript==
// @name         Vinerri Join Fight Chastity Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script to deter unwanted ranked war assists
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510479/Vinerri%20Join%20Fight%20Chastity%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/510479/Vinerri%20Join%20Fight%20Chastity%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let alertShown = false;

    function handleButton() {
        const buttons = document.querySelectorAll('button.torn-btn');

        buttons.forEach(button => {
            if (button.textContent.trim() === 'Join fight') {
                if (!button.dataset.listenerAdded) {
                    button.addEventListener('click', function(event) {
                        if (!alertShown) {
                            event.preventDefault();
                            event.stopPropagation();

                            if (confirm('Are you sure you want to join this fight?')) {
                                alertShown = true;
                                button.click();
                            }
                        }
                    }, true);
                    button.dataset.listenerAdded = 'true';
                }
            } else if (button.textContent.trim() === 'Start fight') {
                // Remove the event listener if it was previously added
                if (button.dataset.listenerAdded) {
                    button.removeEventListener('click', button.clickHandler);
                    delete button.dataset.listenerAdded;
                }
            }
        });
    }

    // Run the function immediately and set up an interval to check periodically
    handleButton();
    setInterval(handleButton, 1000); // Check every second

    console.log("TamperMonkey script is running on Torn loader page!");
})();
