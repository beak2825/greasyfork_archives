// ==UserScript==
// @name         Page Flip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Flip the entire page 90 degrees clockwise every time a key is pressed
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486570/Page%20Flip.user.js
// @updateURL https://update.greasyfork.org/scripts/486570/Page%20Flip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let degree = 0;
    document.body.addEventListener('keydown', function(event) {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            degree = (degree + 90) % 360;
            document.body.style.transform = `rotate(${degree}deg)`;
        }
    });
})();