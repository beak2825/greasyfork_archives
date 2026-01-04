// ==UserScript==
// @name         Twitter Interests: Uncheck All (Stealth Mode)
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-05-26
// @description  Unchecks all Interests on the Twitter/X Interests page very slowly and randomly with human-like behavior
// @author       Doxie
// @match        https://twitter.com/settings/your_twitter_data/twitter_interests
// @match        https://x.com/settings/your_twitter_data/twitter_interests
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502622/Twitter%20Interests%3A%20Uncheck%20All%20%28Stealth%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502622/Twitter%20Interests%3A%20Uncheck%20All%20%28Stealth%20Mode%29.meta.js
// ==/UserScript==

(function() {
    function getRandomDelay() {
        // Generate a random delay between 5 and 10 seconds
        return 5000 + Math.random() * 5000;
    }

    function simulateHumanBehavior() {
        // Randomly scroll a bit or move the mouse
        const behaviors = [
            () => window.scrollBy(0, Math.random() * 100 - 50),
            () => window.scrollBy(0, Math.random() * -100 + 50),
            () => {
                const event = new MouseEvent('mousemove', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: Math.random() * window.innerWidth,
                    clientY: Math.random() * window.innerHeight
                });
                document.dispatchEvent(event);
            }
        ];
        behaviors[Math.floor(Math.random() * behaviors.length)]();
    }

    function startUnchecking() {
        setTimeout(() => {
            var checkboxes = [];
            document.querySelectorAll('input[type="checkbox"]').forEach((c) => {
                if (c.checked) {
                    checkboxes[checkboxes.length] = c;
                }
            });
            var i = 0;

            var loopId = setInterval(() => {
                if (i % 5 == 0) {
                    simulateHumanBehavior();
                }
                var e = checkboxes[i++];
                if (i % 10 == 0) { 
                    console.log("Running... (" + i + ")"); 
                }
                if (e !== undefined) {
                    if (e.checked) {
                        console.log(e);
                        e.parentElement.click();
                    }
                    // Adding a random delay between 5 to 10 seconds
                    clearInterval(loopId);
                    loopId = setInterval(arguments.callee, getRandomDelay());
                } else {
                    clearInterval(loopId);
                }
            }, getRandomDelay()); 
        }, 4000);
    }

    // Run the function initially
    startUnchecking();

    // Ensure the function runs even after a page refresh
    window.addEventListener('load', startUnchecking);
})();
