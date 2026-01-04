// ==UserScript==
// @name         Vertix Better Map
// @namespace    http://vertix.io/
// @version      1.0.0
// @description  Makes the map faster and larger, plus adds map zoom (` and tab)
// @author       dannytech
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37249/Vertix%20Better%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/37249/Vertix%20Better%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Faster Minimap
    drawMiniMapFPS = 1;

    // Larger map
    $("#map").css("width", "300px");
    $("#map").css("height", "300px");

    // Zoom
    $("#cvs").keydown(function(a) {
        var b = a.keyCode ? a.keyCode : a.which;
        if (b === 9) { // Zoom in using `
            maxScreenHeight = 3000;
            maxScreenWidth = 3000;
            resize();
        } else if (b === 192) { // Zoom out using Tab
            maxScreenHeight -= 1e3;
            maxScreenWidth -= 1e3;
            resize();
        }
    });
})();