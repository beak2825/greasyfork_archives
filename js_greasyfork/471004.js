// ==UserScript==
// @name         Google 2014 Part 7
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the Google logo height on the specified page.
// @author       You
// @match        https://vanced-youtube.neocities.org/2011/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471004/Google%202014%20Part%207.user.js
// @updateURL https://update.greasyfork.org/scripts/471004/Google%202014%20Part%207.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the Google logo height
    function changeGoogleLogoHeight() {
        var lgaDiv = document.getElementById("lga");
        if (lgaDiv) {
            lgaDiv.style.height = "695px";
        }
    }

    // Run the function once the DOM is ready
    document.addEventListener("DOMContentLoaded", changeGoogleLogoHeight);
})();
