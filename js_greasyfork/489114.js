// ==UserScript==
// @name         Pokeclicker Auto Keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically click buttons 1, 2, 3, 4, and 5 in Pokeclicker every 0.1 seconds
// @author       braydelindell
// @match        https://example.com/*  // Replace with the URL of the Pokeclicker game
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489114/Pokeclicker%20Auto%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/489114/Pokeclicker%20Auto%20Keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the interval between each button click (in milliseconds)
    var buttonClickInterval = 100;

    // Function to click buttons 1, 2, 3, 4, and 5
    function autoButtonClick() {
        setInterval(function() {
            // Click buttons 1, 2, 3, 4, and 5
            for (var i = 1; i <= 5; i++) {
                var button = document.querySelector('.button' + i); // Assuming buttons have classes button1, button2, ..., button5
                if (button) {
                    button.click();
                }
            }
        }, buttonClickInterval);
    }

    // Call the autoButtonClick function when the page has finished loading
    window.onload = function() {
        autoButtonClick();
    };

})();