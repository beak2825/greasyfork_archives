// ==UserScript==
// @name         Neocities 2014 part 3
// @namespace    *
// @version      1.0
// @description  Change the height of a specific div element on all websites
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470701/Neocities%202014%20part%203.user.js
// @updateURL https://update.greasyfork.org/scripts/470701/Neocities%202014%20part%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the element height
    function changeElementHeight() {
        const element = document.querySelector('div.gsc-positioningWrapper');
        if (element) {
            element.style.height = '20px';
        }
    }

    // Wait for the page to load and then change the element height
    window.addEventListener('load', changeElementHeight);
})();