// ==UserScript==
// @name         Farm RPG Auto Fish Confirmation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically confirms caught fish with randomized delays.
// @author       Matt's AI Sidekick
// @license MIT
// @match        https://farmrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536120/Farm%20RPG%20Auto%20Fish%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/536120/Farm%20RPG%20Auto%20Fish%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function confirmCatch() {
        const specificDiv = document.querySelector('[class^="fishcaught"][data-speed][data-id]');
        if (specificDiv) {
            setTimeout(() => {
                specificDiv.click(); // Confirm the catch
                console.log("Confirmed fish catch!");
            }, getRandomDelay(1000, 2000)); // Random delay before confirming
        } else {
            console.log("No confirmation needed.");
        }
    }

    // Run the function every 6 seconds
    setInterval(confirmCatch, 6000);
})();