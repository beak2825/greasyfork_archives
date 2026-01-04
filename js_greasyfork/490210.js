// ==UserScript==
// @name         Scavening tool
// @namespace    http://tampermonkey.net/
// @version      2024-03-07
// @description  tribal wars auto scavening tool
// @author       LZ
// @match        https://greasyfork.org/en
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @match        https://*/game.php?*screen=place&mode=scavenge*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490210/Scavening%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/490210/Scavening%20tool.meta.js
// ==/UserScript==

(function() {

    // Step 1: Run the provided JavaScript code
    (window.TwCheese && TwCheese.tryUseTool('ASS')) || $.ajax('https://cheesasaurus.github.io/twcheese/launch/ASS.js?' +~~((new Date())/3e5), {cache:1, dataType:"script"});
    void 0;

    // Step 2: Wait for 10 seconds with a countdown
    let countdown = 10;
    let countdownInterval = setInterval(() => {
        console.log(countdown + ' seconds remaining...');
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);

            // Step 3: Find and click the buttons
            let buttons = document.querySelectorAll('.btn.btn-default.free_send_button');
            let clickIndex = buttons.length - 1; // Start from the last button

            let clickInterval = setInterval(() => {
                if (clickIndex < 0) {
                    clearInterval(clickInterval);

                    // Step 4: Wait 5 minutes before reloading
                    let reloadCountdown = 5 * 60; // 5 minutes
                    let reloadCountdownInterval = setInterval(() => {
                        console.log(reloadCountdown + ' seconds until reload...');
                        reloadCountdown--;
                        if (reloadCountdown < 0) {
                            clearInterval(reloadCountdownInterval);
                            console.log('Reloading page...');
                            window.location.reload();
                        }
                    }, 1000);

                    return; // Exit the function
                }

                // Click the current button and decrement the index
                buttons[clickIndex].click();
                clickIndex--;
            }, 1000); // Wait 1 second between clicks
        }
    }, 1000); // 10-second countdown with logs


})();