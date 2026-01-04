// ==UserScript==
// @name         TestGorilla Full Screen Exit Bypass
// @namespace    https://greasyfork.org/en/users/1461725-scriptninja
// @version      1.0.6
// @description  Prevents TestGorilla from forcing users out of fullscreen mode by overriding exitFullscreen(), spoofing fullscreenElement, and blocking fullscreenchange event listeners. Useful for uninterrupted fullscreen experience during assessments.
// @author       ScriptNinja
// @license      MIT
// @match        https://*.testgorilla.com/*
// @icon         https://www.google.com/s2/favicons?domain=testgorilla.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533836/TestGorilla%20Full%20Screen%20Exit%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/533836/TestGorilla%20Full%20Screen%20Exit%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override exitFullscreen to do nothing
    if (document.exitFullscreen) {
        document.exitFullscreen = function() {
            console.log("Blocked exitFullscreen");
            return Promise.resolve(); // Fake success
        };
    }

    // Block fullscreenchange events
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'fullscreenchange') {
            console.log("Blocked fullscreenchange listener");
            return; // Do not add the event listener
        }
        originalAddEventListener.call(this, type, listener, options);
    };

    // Spoof fullscreen state
    Object.defineProperty(document, 'fullscreenElement', {
        get: () => document.documentElement, // Always return the root element as "fullscreen"
        configurable: true
    });
})();