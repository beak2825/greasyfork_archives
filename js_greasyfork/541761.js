// ==UserScript==
// @name         GeoGuessr: Disable Keys 1–6
// @namespace    https://your-namespace.example.com
// @version      1.0
// @description  Disables keys 1 through 6 on GeoGuessr to prevent unintended emoji sending.
// @author       YourName
// @match        https://www.geoguessr.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541761/GeoGuessr%3A%20Disable%20Keys%201%E2%80%936.user.js
// @updateURL https://update.greasyfork.org/scripts/541761/GeoGuessr%3A%20Disable%20Keys%201%E2%80%936.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disable number keys 1–6 globally on geoguessr.com
    window.addEventListener('keydown', function(e) {
        const disabledKeys = ['1','2','3','4','5','6'];
        if (disabledKeys.includes(e.key)) {
            e.stopImmediatePropagation();
            e.preventDefault();
            console.log(`[GeoGuessr Script] Blocked key: ${e.key}`);
        }
    }, true); // Use capture phase to block early
})();
