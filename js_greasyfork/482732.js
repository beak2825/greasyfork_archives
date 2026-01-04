// ==UserScript==
// @name         Clear Youglish Cookies
// @namespace    http://your.namespace.com
// @version      0.2
// @description  Clear Youglish cookies every hour
// @author       Your Name
// @match        *://youglish.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/482732/Clear%20Youglish%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/482732/Clear%20Youglish%20Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to clear cookies
    function clearCookies() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
    }

    // Clear cookies when the script runs
    clearCookies();

    // Set up a timer to clear cookies every hour
    setInterval(function() {
        clearCookies();
    }, 3600000); // 1 hour in milliseconds
})();