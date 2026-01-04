// ==UserScript==
// @name         Keyword Refresher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  refresh page based on keyword
// @author       san07
// @include      *
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483422/Keyword%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/483422/Keyword%20Refresher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the keyword or sentence to trigger the refresh
    const keyword = "Clicking";

    // Function to check if the keyword is present in the page
    function checkForKeyword() {
        const pageContent = document.body.textContent || document.body.innerText;
        return pageContent.includes(keyword);
    }

    // Function to refresh the page
    function refreshPage() {
        location.reload();
    }

    // Check for the keyword periodically and refresh the page if found
    setInterval(function() {
        if (checkForKeyword()) {
            refreshPage();
        }

    }, 3000); // Adjust the interval (in milliseconds) as needed
})();