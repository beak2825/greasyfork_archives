// ==UserScript==
// @name         Change GeoGuessr Font to Comic Sans
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change the font of GeoGuessr to Comic Sans
// @author       hwzt (the goat)
// @match        *://*.geoguessr.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502373/Change%20GeoGuessr%20Font%20to%20Comic%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/502373/Change%20GeoGuessr%20Font%20to%20Comic%20Sans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change font to Comic Sans
    function changeFont() {
        // Apply Comic Sans to the entire document body
        document.body.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';

        // Apply Comic Sans to all elements
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            el.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';
        });
    }

    // Delay function call to ensure all elements are loaded
    function applyFontAfterDelay() {
        setTimeout(changeFont, 1000); // Delay in milliseconds
    }

    // Call the function after a short delay
    applyFontAfterDelay();
})();