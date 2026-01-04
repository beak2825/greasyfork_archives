// ==UserScript==
// @name         Google neocities 2014 part 5
// @namespace    https://vanced-youtube.neocities.org/2013/
// @version      1.0
// @description  Change the margin of elements with the class 'gsc-tabHeader' on websites containing a specific URL
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470706/Google%20neocities%202014%20part%205.user.js
// @updateURL https://update.greasyfork.org/scripts/470706/Google%20neocities%202014%20part%205.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the tabHeader margin
    function changeTabHeaderMargin() {
        const tabHeaders = document.querySelectorAll('div.gsc-tabHeader');
        tabHeaders.forEach((tabHeader) => {
            tabHeader.style.margin = '-16px 8px';
        });
    }

    // Check if the current URL contains the target URL
    if (window.location.href.includes('https://vanced-youtube.neocities.org/2013/')) {
        // Wait for the page to load and then change the tabHeader margin
        window.addEventListener('load', changeTabHeaderMargin);
    }
})();