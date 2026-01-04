// ==UserScript==
// @name         CAI Tool Hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides CAI Tools button in case you don't want it to always be there, but still want to keep he functionality of the addon.
// @author       LuxTallis
// @match        https://character.ai/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519784/CAI%20Tool%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/519784/CAI%20Tool%20Hider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', function () {
        // Create and apply custom CSS to hide the .cait_button-cont element
        const style = document.createElement('style');
        style.textContent = `
            .cait_button-cont {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    });
})();
