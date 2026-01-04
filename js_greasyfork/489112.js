// ==UserScript==
// @name         Pokeclicker Auto Keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically press keys 1, 2, 3, 4, and 5 in Pokeclicker every 0.1 seconds
// @author       Braydelindell
// @match        https://example.com/*  // Replace with the URL of the Pokeclicker game
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489112/Pokeclicker%20Auto%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/489112/Pokeclicker%20Auto%20Keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the interval between each key press (in milliseconds)
    var keyPressInterval = 100;

    // Function to press keys 1, 2, 3, 4, and 5
    function autoKeyPress() {
        setInterval(function() {
            // Press keys 1, 2, 3, 4, and 5
            for (var i = 1; i <= 5; i++) {
                setTimeout(function(key) {
                    // Dispatch a keydown event for the specified key
                    document.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
                }, keyPressInterval * i, i.toString());
            }
        }, keyPressInterval * 5);
    }

    // Call the autoKeyPress function when the page has finished loading
    window.onload = function() {
        autoKeyPress();
    };

})();