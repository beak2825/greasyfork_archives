// ==UserScript==
// @name       Random Search Generator for Microsoft Rewards
// @namespace  http://tampermonkey.net/
// @version    0.1
// @description  Generates random searches and enters them into the Bing search bar on the Microsoft Rewards homepage
// @author     You
// @match      https://www.bing.com/*
// @grant      none
// @license AL 
// @downloadURL https://update.greasyfork.org/scripts/457702/Random%20Search%20Generator%20for%20Microsoft%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/457702/Random%20Search%20Generator%20for%20Microsoft%20Rewards.meta.js
// ==/UserScript==

(function() {
    'use strict';

        setInterval(function() {
            // Generate a random search query
            var search = generateRandomSearch();
            // Enter the search query into the Bing search bar
            document.getElementById("sb_form_q").value = search;
            // Submit the search
            document.getElementById("sb_form").submit();
        }, 500); // .5 seconds

    function generateRandomSearch() {
        var search = "";
        // Generate a random string of 8 characters
        for (var i = 0; i < 8; i++) {
            // Generate a random number between 0 and 1
            var r = Math.random();
            // If the number is less than 0.5, add a random letter (A-Z) to the search string
            if (r < 0.5) {
                search += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            }
            // Otherwise, add a random number (0-9) to the search string
            else {
                search += Math.floor(Math.random() * 10);
            }
        }
        return search;
    }
})();
