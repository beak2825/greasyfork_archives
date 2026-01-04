// ==UserScript==
// @name         Blur any website with a keyboard shortcut
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT 
// @description  you can Blur any website with a keyboard shortcut
// @author       Rumman
// @match        *://*/*
// @icon         https://cdn.pixabay.com/photo/2015/06/24/02/12/the-blurred-819388_1280.jpg
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/495665/Blur%20any%20website%20with%20a%20keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/495665/Blur%20any%20website%20with%20a%20keyboard%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isBlurred = false;

    // Function to toggle blur effect
    function toggleBlur() {
        if (isBlurred) {
            GM_addStyle(`
                body {
                    filter: none !important;
                    pointer-events: auto !important;
                }
            `);
            isBlurred = false;
        } else {
            GM_addStyle(`
                body {
                    filter: blur(8px) !important;
                    pointer-events: none !important;
                }
            `);
            isBlurred = true;
        }
    }

    // Event listener for keyboard shortcut (Ctrl+B)
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'b') {
            toggleBlur();
        }
    });
})();
