// ==UserScript==
// @name         Disable Tab Switch Detection
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Prevent websites from detecting tab switches
// @author       DharmTej
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527635/Disable%20Tab%20Switch%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/527635/Disable%20Tab%20Switch%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Caution: Might affect other websites. Make sure to disable it when not needed.

    Object.defineProperty(document, "hidden", {
        get: function() { return false; },
        configurable: true
    });

    Object.defineProperty(document, "visibilityState", {
        get: function() { return "visible"; },
        configurable: true
    });

    document.addEventListener("visibilitychange", function(event) {
        event.stopImmediatePropagation();
        console.log('Tab switch detection blocked');
    }, true);
})();
