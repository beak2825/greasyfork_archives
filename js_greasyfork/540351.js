// ==UserScript==
// @name         Auto Clear Console Log
// @namespace    https://spin.rip/
// @version      1.1
// @description  Automatically clears the console log every 10 seconds. Interval is defined as a constant variable.
// @author       Spinfal
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540351/Auto%20Clear%20Console%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/540351/Auto%20Clear%20Console%20Log.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CLEAR_INTERVAL = 10000; // Interval in milliseconds
    setInterval(() => {
        console.clear();
    }, CLEAR_INTERVAL);
})();