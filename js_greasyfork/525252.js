// ==UserScript==
// @name         Slither.io Zoom Hack WORKING 2025
// @namespace    http://slither.io/
// @version      1.0
// @description  Allows zooming in and out in Slither.io using keys 8 and 9. Key 1 reset the zoom - The domain name changed for slither so this has been updated to work.
// @author       Icewerve
// @grant        none
// @match        http://slither.com/io
// @match        http://slither.io/?c
// @match        http://slither.io
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/525252/Slitherio%20Zoom%20Hack%20WORKING%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/525252/Slitherio%20Zoom%20Hack%20WORKING%202025.meta.js
// ==/UserScript==

// Enable debug logging
window.logDebugging = false;
window.log = function() {
    if (window.logDebugging) {
        console.log.apply(console, arguments);
    }
};

window.zoomMultiplier = 1.0;

window.updateZoom = function() {
    window.gsc = window.zoomMultiplier;
    document.getElementById("zoom_overlay").innerHTML =
        `Press (8/9) to change zoom: ${window.zoomMultiplier.toFixed(1)}`;
};


window.recursiveZoomUpdate = function() {
    window.gsc = window.zoomMultiplier;
    requestAnimationFrame(window.recursiveZoomUpdate);
};


window.resetZoom = function() {
    window.zoomMultiplier = 1.0;
    window.updateZoom();
};

window.adjustZoom = function(amount) {
    window.zoomMultiplier = Math.max(0.2, Math.min(3.0, window.zoomMultiplier + amount));
    window.updateZoom();
};

document.oldKeyDown = document.onkeydown;
document.onkeydown = function(e) {
    if (typeof document.oldKeyDown === "function") {
        document.oldKeyDown(e);
    }

    if (document.activeElement.parentElement !== window.nick_holder) {
        if (e.keyCode === 57) {
            window.adjustZoom(0.1);
        } else if (e.keyCode === 56) {
            window.adjustZoom(-0.1);
        } else if (e.keyCode === 49) {
            window.resetZoom();
        }
    }
};

window.initZoomOverlay = function() {
    let overlay = document.createElement("div");
    overlay.id = "zoom_overlay";
    overlay.style = "color: #FFF; font-family: Arial, sans-serif; font-size: 18px; position: fixed; left: 30px; top: 65px; z-index: 1000;";
    overlay.innerHTML = "Press (8/9) to change zoom: " +window.zoomMultiplier + '</span>';
    document.body.appendChild(overlay);
};

window.initt = function() {
    window.initZoomOverlay();
    window.updateZoom();
    window.recursiveZoomUpdate();
};

window.initt();