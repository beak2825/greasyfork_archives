// ==UserScript==
// @name         Slither.io Zoom Control
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zoom in and out in Slither.io using Z and X keys (safe and undetectable)
// @author       YourName
// @match        http*://slither.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531524/Slitherio%20Zoom%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/531524/Slitherio%20Zoom%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let zoomSpeed = 0.1; // Adjust zoom speed
    let minZoom = 0.3;   // Minimum zoom level
    let maxZoom = 2.5;   // Maximum zoom level

    function updateZoom(event) {
        if (window.render_mode === 2 && window.wob !== undefined) {
            if (event.key === 'z') {
                // Zoom in
                window.wob *= (1 - zoomSpeed);
            } else if (event.key === 'x') {
                // Zoom out
                window.wob *= (1 + zoomSpeed);
            }
            window.wob = Math.min(maxZoom, Math.max(minZoom, window.wob));
        }
    }

    document.addEventListener('keydown', updateZoom);

    // Continuously apply zoom to ensure it works in public servers
    let applyZoom = setInterval(function() {
        if (window.render_mode === 2 && window.wob !== undefined) {
            window.gsc = window.wob;
        }
    }, 100);

    console.log("Slither.io Zoom Script Loaded - Should work without detection");
})();
