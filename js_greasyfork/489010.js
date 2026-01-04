// ==UserScript==
// @name         Smash Karts Gold Collector
// @namespace    com.Ethan.Smash_Gold
// @version      1.0.0
// @description  Collect gold coins automatically in Smash Karts!
// @author       Ethan
// @license      MIT
// @match        https://smashkarts.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489010/Smash%20Karts%20Gold%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/489010/Smash%20Karts%20Gold%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to collect gold
    function collectGold() {
        const goldElements = document.querySelectorAll('.gold'); // Select all gold elements
        goldElements.forEach((goldElement) => {
            goldElement.click(); // Click on each gold element
        });
    }

    // Run the gold collection function every 5 seconds
    setInterval(collectGold, 5000);
})();
