// ==UserScript==
// @name         Auto Stickers for NT
// @namespace    https://singdev.wixsite.com/sing-developments/nitro
// @version      2.0
// @description  Forget to show your stickers in a race? This script will help you!
// @author       Sing Developments
// @match        https://nitrotype.com/race
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473742/Auto%20Stickers%20for%20NT.user.js
// @updateURL https://update.greasyfork.org/scripts/473742/Auto%20Stickers%20for%20NT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the frequency of hitting the shift key (in milliseconds) and posting stickers
    var shift_key_interval = 10000;   // Interval to hit the shift key (in milliseconds)
    var frequency_of_stickers = 50;    // Adjust this value for different frequencies

    // Function to check if the page is fully loaded
    function isPageFullyLoaded() {
        return document.readyState === 'complete';
    }

    // Function to click the chat picker button and post stickers
    function click_the_b(a) {
        // Hit the shift key periodically
        setInterval(function() {
            simulateKeyEvent('keydown', 16);  // 16 is the keycode for the shift key
            simulateKeyEvent('keyup', 16);
        }, shift_key_interval);

        // Check if a sticker should be posted based on frequency
        if (Math.random() * 100 <= frequency_of_stickers) {
            var total_choices = a.length;
            var current_choice = Math.floor(Math.random() * total_choices);
            a[current_choice].click();
        }
    }

    // Function to simulate keyboard events
    function simulateKeyEvent(type, keyCode) {
        var event = new KeyboardEvent(type, {
            bubbles: true,
            keyCode: keyCode,
            which: keyCode // Specify the 'which' property for better compatibility
        });
        document.dispatchEvent(event);
    }

    // Wait for the page to fully load before performing any actions
    var checkPageInterval = setInterval(function() {
        if (isPageFullyLoaded()) {
            clearInterval(checkPageInterval);

            // Check for the presence of the chat picker button
            var a = document.getElementsByClassName('raceChat-pickerOpt');
            if (a.length > 0) {
                click_the_b(a);
            }
        }
    }, 100); // Check every 100ms if the page is fully loaded
})();
