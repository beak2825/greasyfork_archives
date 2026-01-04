// ==UserScript==
// @name         Farm RPG Auto Fish Catcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Automatically catches fish every 3 seconds in Farm RPG.
// @author       Matt's AI Sidekick
// @match        https://farmrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536104/Farm%20RPG%20Auto%20Fish%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/536104/Farm%20RPG%20Auto%20Fish%20Catcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickFishElements() {
        const fishElements = document.querySelectorAll('[class*="fish f"]');

        if (fishElements.length > 0) {
            fishElements.forEach(element => {
                element.click(); // Click each fish
            });

            const specificDiv = document.querySelector('[class^="fishcaught"][data-speed][data-id]');
            if (specificDiv) {
                specificDiv.click(); // Confirm catch
            }

            console.log("Clicked fish!");
        } else {
            console.log("No fish found.");
        }
    }

    // Run the function every 3 seconds
    setInterval(clickFishElements, 3000);
})();