// ==UserScript==
// @name         Change Search Form Height
// @namespace    https://vanced-youtube.neocities.org/2013/
// @version      1.0
// @description  Change the height of a specific div element on websites containing a specific URL
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470699/Change%20Search%20Form%20Height.user.js
// @updateURL https://update.greasyfork.org/scripts/470699/Change%20Search%20Form%20Height.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the search form height
    function changeSearchFormHeight() {
        const searchForm = document.querySelector('div.jhp.big');
        if (searchForm) {
            searchForm.style.height = '20px';
        }
    }

    // Check if the current URL contains the target URL
    if (window.location.href.includes('https://vanced-youtube.neocities.org/2013')) {
        // Wait for the page to load and then change the search form height
        window.addEventListener('load', changeSearchFormHeight);
    }
})();