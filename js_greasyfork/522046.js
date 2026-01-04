// ==UserScript== K O K U S H I B O
// @name         Kogama Optimization - Lag Reduction
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script to minimize lags in Kogama by removing unnecessary elements and animations
// @author       K O K U S H I B O
// @match        https://www.kogama.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522046/Kogama%20Optimization%20-%20Lag%20Reduction.user.js
// @updateURL https://update.greasyfork.org/scripts/522046/Kogama%20Optimization%20-%20Lag%20Reduction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to optimize Kogama performance
    function optimizeKogama() {
        // Remove ads and unnecessary elements
        document.querySelectorAll('.advertisement, [id^="ad"], iframe[src*="ads"]').forEach(el => el.remove());

        // Disable animations and transitions
        document.querySelectorAll("*").forEach(el => {
            el.style.animation = "none"; // Disable CSS animations
            el.style.transition = "none"; // Disable CSS transitions
        });

        // Reduce graphical load (e.g., remove background images)
        document.body.style.backgroundImage = "none"; // Disable background images
        document.body.style.backgroundColor = "#000000"; // Set black background (optional)

        console.log("Kogama optimization applied successfully.");
    }

    // Apply optimization regularly (for dynamically loaded elements)
    setInterval(optimizeKogama, 2000); // Run every 2 seconds
})();