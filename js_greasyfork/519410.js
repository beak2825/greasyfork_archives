// ==UserScript==
// @name         Gats.io - Mouse Wheel Zoom
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds zoom in and out functionality using the mouse wheel.
// @author       PsychoNurse
// @match        https://gats.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519410/Gatsio%20-%20Mouse%20Wheel%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/519410/Gatsio%20-%20Mouse%20Wheel%20Zoom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Default zoom level
    let zoomLevel = 1;

    // Add zoom functionality on mouse wheel
    window.addEventListener("wheel", function (e) {
        let zoomStep = 0.1; // Zoom increment
        let direction = Math.sign(e.deltaY); // Scroll direction

        if (direction > 0) {
            // Zoom out
            zoomLevel = Math.max(0.5, zoomLevel - zoomStep); // Minimum zoom level
        } else if (direction < 0) {
            // Zoom in
            zoomLevel = Math.min(3, zoomLevel + zoomStep); // Maximum zoom level
        }

        // Apply zoom level to the game's viewport
        document.body.style.transform = `scale(${zoomLevel})`;
        document.body.style.transformOrigin = "center center";
    });
})();