// ==UserScript==
// @name        Remove Quote Marks
// @namespace   https://github.com/Official-Husko/violentmonkey-scripts
// @match       https://www.nexusmods.com/*
// @description This removes the quotation marks that tend to block text content.
// @grant       none
// @license     GNU GPLv3
// @version     1.0
// @author      Official Husko
// @icon        https://www.pulexart.com/uploads/7/0/1/2/70121829/40.png
// @downloadURL https://update.greasyfork.org/scripts/489604/Remove%20Quote%20Marks.user.js
// @updateURL https://update.greasyfork.org/scripts/489604/Remove%20Quote%20Marks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all SVG elements with the specified class name
    var svgElements = document.querySelectorAll('.icon-quote');

    // Check if any SVG elements exist before attempting to remove them
    if (svgElements.length > 0) {
        // Remove each SVG element
        svgElements.forEach(function(svgElement) {
            svgElement.parentNode.removeChild(svgElement);
        });
    }
})();