// ==UserScript==
// @name     Change Text to "More"
// @version  1.0
// @grant    none
// @license  MIT
// @match    https://vanced-youtube.neocities.org/2011/
// @description Blank
// @namespace https://greasyfork.org/users/1090996
// @downloadURL https://update.greasyfork.org/scripts/469608/Change%20Text%20to%20%22More%22.user.js
// @updateURL https://update.greasyfork.org/scripts/469608/Change%20Text%20to%20%22More%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the span element by its ID
    var spanElement = document.getElementById('gbztms1');

    // Change the text content to "More" if the element exists
    if (spanElement) {
        spanElement.textContent = 'More';
    }
})();