// ==UserScript==
// @name         2014 for google neocities part 2
// @namespace    https://vanced-youtube.neocities.org/2013/
// @version      1.0
// @description  Change the height of a specific div element on websites containing a specific URL
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470698/2014%20for%20google%20neocities%20part%202.user.js
// @updateURL https://update.greasyfork.org/scripts/470698/2014%20for%20google%20neocities%20part%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the form height
    function changeFormHeight() {
        const formContainer = document.querySelector('div.form-cont');
        if (formContainer) {
            formContainer.style.height = '20px';
        }
    }

    // Check if the current URL contains the target URL
    if (window.location.href.includes('https://vanced-youtube.neocities.org/2013')) {
        // Wait for the page to load and then change the form height
        window.addEventListener('load', changeFormHeight);
    }
})();