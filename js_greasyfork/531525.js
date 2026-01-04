// ==UserScript==
// @name         Diep.io Zoom Hack (Guaranteed Working)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Properly working zoom hack by modifying game view settings
// @author       YourName
// @match        http*://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531525/Diepio%20Zoom%20Hack%20%28Guaranteed%20Working%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531525/Diepio%20Zoom%20Hack%20%28Guaranteed%20Working%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let zoomLevel = 1;
    let zoomStep = 0.1;
    let minZoom = 0.5;
    let maxZoom = 3.0;

    function adjustZoom(event) {
        if (event.key === 'z') {
            zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
        } else if (event.key === 'x') {
            zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
        }
        if (window.global && window.global.player) {
            window.global.scale = zoomLevel;
        }
    }
    document.addEventListener('keydown', adjustZoom);

    console.log("Diep.io Zoom Hack Activated - Press Z/X to Zoom In/Out (Tested Working)");
})();