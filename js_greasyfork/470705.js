// ==UserScript==
// @name         Google neocities part 4
// @namespace    https://vanced-youtube.neocities.org/2013/
// @version      1.0
// @description  Change the margin of a specific div element on websites containing a specific URL
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470705/Google%20neocities%20part%204.user.js
// @updateURL https://update.greasyfork.org/scripts/470705/Google%20neocities%20part%204.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the tab margin
    function changeTabMargin() {
        const tabHeader = document.querySelector('div.gsc-tabHeader.gsc-inline-block.gsc-tabhActive[aria-label="refinement"]');
        if (tabHeader) {
            tabHeader.style.margin = '-16px 8px';
        }
    }

    // Check if the current URL contains the target URL
    if (window.location.href.includes('https://vanced-youtube.neocities.org/2013')) {
        // Wait for the page to load and then change the tab margin
        window.addEventListener('load', changeTabMargin);
    }
})();