// ==UserScript==
// @name         GeoGuessr B Key Left Mouse Click
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Simulate a left mouse click when pressing the B key in GeoGuessr.
// @author       Your Name
// @match        https://*.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520432/GeoGuessr%20B%20Key%20Left%20Mouse%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/520432/GeoGuessr%20B%20Key%20Left%20Mouse%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Listen for keydown events on the document
    document.addEventListener('keydown', function(event) {
        // Check if the B key was pressed
        if (event.key === 'b' || event.key === 'B') {
            // Get the current mouse position
            document.addEventListener('mousemove', function(e) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;

                // Simulate a left mouse click at the mouse position
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: mouseX,
                    clientY: mouseY
                });

                // Dispatch the click event on the element under the mouse cursor
                const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
                if (elementUnderMouse) {
                    elementUnderMouse.dispatchEvent(clickEvent);
                }
            }, { once: true });
        }
    });
})();