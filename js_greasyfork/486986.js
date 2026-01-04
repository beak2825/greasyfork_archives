// ==UserScript==
// @name         CPU Tamer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Throttle CPU usage in the browser
// @author       Your name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486986/CPU%20Tamer.user.js
// @updateURL https://update.greasyfork.org/scripts/486986/CPU%20Tamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const THROTTLE_INTERVAL = 100; // milliseconds
    const THROTTLE_PERCENTAGE = 50; // percentage of CPU usage to throttle to

    let lastTime = 0;
    let timeout = null;

    function throttle() {
        const currentTime = Date.now();
        if (currentTime - lastTime >= THROTTLE_INTERVAL) {
            lastTime = currentTime;
            // Simulate CPU-intensive task
            for (let i = 0; i < 1000000; i++) {
                Math.sqrt(i);
            }
        }

        timeout = setTimeout(throttle, THROTTLE_INTERVAL);
    }

    throttle();

    // You can adjust the above throttle function to suit your specific needs.
    // Be cautious when throttling CPU usage as it may affect browsing experience.
})();
