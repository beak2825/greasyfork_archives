// ==UserScript==
// @name         Change Text Alignment for Translated Text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change text alignment to right (like Microsoft Edge when translating to Arabic)
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522527/Change%20Text%20Alignment%20for%20Translated%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/522527/Change%20Text%20Alignment%20for%20Translated%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change text alignment
    function changeTextAlignment() {
        const body = document.querySelector('body');
        if (body) {
            body.style.direction = 'rtl';
            body.style.textAlign = 'right';
        }
    }

    // Call the function
    changeTextAlignment();
})();