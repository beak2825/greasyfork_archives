// ==UserScript==
// @name         Farm RPG Auto Fish Catcher (Fully Random Timing)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license MIT
// @description  Automatically catches fish every 6 seconds with different randomized delays for catching and confirming.
// @author       Matt's AI Sidekick
// @match        https://farmrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536106/Farm%20RPG%20Auto%20Fish%20Catcher%20%28Fully%20Random%20Timing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536106/Farm%20RPG%20Auto%20Fish%20Catcher%20%28Fully%20Random%20Timing%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clickFishElements() {
        // Random delay between 1 and 2 seconds before catching the fish
        setTimeout(() => {
            const fishElements = document.querySelectorAll('[class*="fish f"]');

            if (fishElements.length > 0) {
                fishElements.forEach(element => {
                    element.click(); // Click each fish
                });

                console.log("Clicked fish!");

                // Random delay between 1 and 2 seconds before confirming the catch
                setTimeout(confirmCatch, getRandomDelay(1000, 2000));
            } else {
                console.log("No fish found.");
            }
        }, getRandomDelay(1000, 2000)); // Random delay before clicking fish
    }

    function confirmCatch() {
        const specificDiv = document.querySelector('[class^="fishcaught"][data-speed][data-id]');
        if (specificDiv) {
            specificDiv.click(); // Confirm the catch
            console.log("Confirmed fish catch!");
        } else {
            console.log("No confirmation needed.");
        }
    }

    // Run the function every 6 seconds
    setInterval(clickFishElements, 6000);
})();