// ==UserScript==
// @name         FIX for "Bing Search returns to the top" !
// @namespace    http://tampermonkey.net/Henry
// @version      1.0.1
// @description  Stop doing weird things, Bing ! ;)
// @author       Henry
// @match        http*://*.bing.com/*
// @icon         https://tsz.netlify.app/img/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462830/FIX%20for%20%22Bing%20Search%20returns%20to%20the%20top%22%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/462830/FIX%20for%20%22Bing%20Search%20returns%20to%20the%20top%22%20%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    https://techcommunity.microsoft.com/t5/microsoft-bing/search-page-of-bing-automatically-jumping-to-the-top-of-page/m-p/3767178/emcs_t/S2h8ZW1haWx8dG9waWNfc3Vic2NyaXB0aW9ufExGN1BYSTdMVldJQkQxfDM3NjcxNzh8U1VCU0NSSVBUSU9OU3xoSw#M2615

    So, I switched to Bing a month ago and.. I HAD the same problem, but I just fixed it !

    There's a function in a script file triggered when Bing Search is Out of Focus, waiting for 15 seconds, and then Scroll the page to the top.

    Why ? ... I really don't know ... but, who cares ? ;)

    For Tampermonkey addon users on Chrome, Edge, Safari, Opera and Firefox, the simple way is to install a script like this.

    AwayTimeThreshold defines the waiting time in seconds when the tab is no longer active to scroll up the page. (Default value: 15 seconds)

    Some sort of temporary (but for a long time, i think ^^) solution is to set an impossible value to reach to this variable. (2 592 000 seconds = One month.)

    I currently use this solution, and it works like a charm ! ;)
    */
    window.AwayTimeThreshold = 2_592_000;

    /*
    // other solution
    // Disable the scroll to top functionality
    function disableScrollToTop() {
        window.scrollTo = function(x, y) {
            if (y !== 0) {
                window.scrollTo.originalFunc(x, y);
            }
        };
        window.scrollTo.originalFunc = window.scrollTo;
    }

    // Listen for 'focus' events on the window
    window.addEventListener('focus', disableScrollToTop);
    */
})();