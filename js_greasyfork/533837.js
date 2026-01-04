// ==UserScript==
// @name         TestGorilla Mouse Exit Bypass
// @namespace    https://greasyfork.org/en/users/1461725-scriptninja
// @version      1.0.1
// @description  Spoofs mouse behavior on TestGorilla to prevent detection of mouse movements outside the window. Clamps cursor position and blocks mouseleave/mouseout event listeners.
// @author       ScriptNinja
// @license      MIT
// @match        https://*.testgorilla.com/*
// @icon         https://www.google.com/s2/favicons?domain=testgorilla.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533837/TestGorilla%20Mouse%20Exit%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/533837/TestGorilla%20Mouse%20Exit%20Bypass.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Define the boundaries of the "assessment window"
    const FAKE_WINDOW = {
        xMin: 0,          // Left edge
        xMax: window.innerWidth,  // Right edge
        yMin: 0,          // Top edge
        yMax: window.innerHeight // Bottom edge
    };

    // Override MouseEvent properties (clientX, clientY)
    const originalMouseEvent = MouseEvent.prototype;
    const originalClientX = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'clientX');
    const originalClientY = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'clientY');

    Object.defineProperty(MouseEvent.prototype, 'clientX', {
        get: function() {
            let x = originalClientX.get.call(this);
            // Clamp X to fake window boundaries
            return Math.max(FAKE_WINDOW.xMin, Math.min(x, FAKE_WINDOW.xMax));
        },
        configurable: true
    });

    Object.defineProperty(MouseEvent.prototype, 'clientY', {
        get: function() {
            let y = originalClientY.get.call(this);
            // Clamp Y to fake window boundaries
            return Math.max(FAKE_WINDOW.yMin, Math.min(y, FAKE_WINDOW.yMax));
        },
        configurable: true
    });

    // Block mouseleave events
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'mouseleave' || type === 'mouseout') {
            console.log("Blocked mouseleave/mouseout listener");
            return; // Skip adding the listener
        }
        originalAddEventListener.call(this, type, listener, options);
    };

    console.log("Mouse spoofing active");
})();