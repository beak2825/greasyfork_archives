// ==UserScript==
// @name         Simple and LagFree Zoom
// @namespace    AeonGV
// @version      1.1
// @description  For those who don't wanna use any other features mod except zoom.
// @author       AeonGV
// @match        http://slither.io/
// @include      http://www.slither-io.com/slitherio
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372149/Simple%20and%20LagFree%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/372149/Simple%20and%20LagFree%20Zoom.meta.js
// ==/UserScript==

function zoom(e) {
    if (!window.gsc) {
        return;
    }
    e.preventDefault();
    gsc *= Math.pow(0.93, e.wheelDelta / -120 || e.detail / 2 || 0);
    gsc > 2 ? gsc = 2 : gsc < 0.2 ? gsc = 0.2 : null;
}


if (/firefox/i.test(navigator.userAgent)) {
        document.addEventListener("DOMMouseScroll", zoom, false);
    } else {
        document.body.onmousewheel = zoom;
    }
