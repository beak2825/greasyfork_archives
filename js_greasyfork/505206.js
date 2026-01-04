// ==UserScript==
// @name         MS Reducer for arras.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ah yes the ms reducer to make arras.io les laggy
// @author       Leo
// @match        https://arras.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505206/MS%20Reducer%20for%20arrasio.user.js
// @updateURL https://update.greasyfork.org/scripts/505206/MS%20Reducer%20for%20arrasio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to reduce the update frequency of certain game functions
    function reduceMS() {
        // Example: Reduce the frequency of game rendering updates
        const originalRender = window.gameRenderFunction;
        if (originalRender) {
            window.lastRenderTime = 0;
            window.gameRenderFunction = function() {
                const now = Date.now();
                if (now - window.lastRenderTime >= 100) { // Adjust the delay (100 ms) as needed
                    window.lastRenderTime = now;
                    originalRender.apply(this, arguments);
                }
            };
        }

        // Example: Reduce the frequency of game update logic
        const originalUpdate = window.gameUpdateFunction;
        if (originalUpdate) {
            window.lastUpdateTime = 0;
            window.gameUpdateFunction = function() {
                const now = Date.now();
                if (now - window.lastUpdateTime >= 100) { // Adjust the delay (100 ms) as needed
                    window.lastUpdateTime = now;
                    originalUpdate.apply(this, arguments);
                }
            };
        }

        console.log('MS reduction optimizations applied.');
    }

    // Apply the optimizations once the game has fully loaded
    window.addEventListener('load', reduceMS);
})();
