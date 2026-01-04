// ==UserScript==
// @name         Slither.io Zoom Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press D to zoom out and Z to zoom in
// @author       Your Name
// @match        http://slither.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509210/Slitherio%20Zoom%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/509210/Slitherio%20Zoom%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables to control zoom level
    let zoomLevel = 1;
    const zoomStep = 0.1;
    const minZoom = 0.5;
    const maxZoom = 2;

    // Function to set zoom level
    function setZoom(level) {
        document.body.style.transform = `scale(${level})`;
        document.body.style.transformOrigin = 'center center';
    }

    // Event listeners for key presses
    document.addEventListener('keydown', function(event) {
        if (event.key === 'D' || event.key === 'd') {
            zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
            setZoom(zoomLevel);
        } else if (event.key === 'Z' || event.key === 'z') {
            zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
            setZoom(zoomLevel);
        }
    });
})();
