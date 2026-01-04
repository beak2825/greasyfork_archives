// ==UserScript==
// @name         Hide Canvas
// @namespace    https://play.pixels.xyz
// @version      0.2
// @description  Hide all canvas elements, including dynamically added ones
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504801/Hide%20Canvas.user.js
// @updateURL https://update.greasyfork.org/scripts/504801/Hide%20Canvas.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hideCanvas = () => {
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.display = 'none';
        });
    };

    // Initial hide
    hideCanvas();

    // Set up MutationObserver to hide new canvases
    const observer = new MutationObserver(() => {
        hideCanvas();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
