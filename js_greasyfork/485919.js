// ==UserScript==
// @name         Change FPS Display On Bonk.io
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change FPS display on Alt+F press
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485919/Change%20FPS%20Display%20On%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/485919/Change%20FPS%20Display%20On%20Bonkio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'f' and the 'Alt' key is pressed
        if (event.altKey && event.key === 'f') {
            // Find the target div with the specified class
            const fpsDiv = document.querySelector('.fps-display');

            // Check if the div exists before changing its content
            if (fpsDiv) {
                fpsDiv.textContent = '540 FPS';
            }
        }
    });
})();
