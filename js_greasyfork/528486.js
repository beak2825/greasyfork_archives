// ==UserScript==
// @name         Brightness, contrast & saturation booster
// @description  Boosts brightness, contrast & saturation on every website
// @version      1.0
// @author       L.M.M.
// @match        *://*/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/1437292
// @downloadURL https://update.greasyfork.org/scripts/528486/Brightness%2C%20contrast%20%20saturation%20booster.user.js
// @updateURL https://update.greasyfork.org/scripts/528486/Brightness%2C%20contrast%20%20saturation%20booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const brightness = 1.03;
    const contrast = 1.05;
    const saturation = 1.07;

    if (!document.getElementById('filterStyle')) {
        const style = document.createElement('style');
        style.id = 'filterStyle';
        style.textContent = `
            body {
                filter: brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) !important;
            }
        `;
        document.head.appendChild(style); 
    }
})();