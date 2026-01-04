// ==UserScript==
// @name         2014 neocities part 2
// @namespace    https://vanced-youtube.neocities.org/2013/
// @version      1.0
// @description  Change the top position of a specific div element on websites containing a specific URL
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470700/2014%20neocities%20part%202.user.js
// @updateURL https://update.greasyfork.org/scripts/470700/2014%20neocities%20part%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the search form top position
    function changeSearchFormTopPosition() {
        const searchForm = document.querySelector('div.jhp.big');
        if (searchForm) {
            searchForm.style.top = '20px';
        }
    }

    // Check if the current URL contains the target URL
    if (window.location.href.includes('https://vanced-youtube.neocities.org/2013')) {
        // Wait for the page to load and then change the search form top position
        window.addEventListener('load', changeSearchFormTopPosition);
    }
})();