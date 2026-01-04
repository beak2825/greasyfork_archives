// ==UserScript==
// @name         Create Cookie for reddit
// @version      1.0
// @description  Creates a cookie when the page is loaded
// @match            *://www.reddit.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/935946
// @downloadURL https://update.greasyfork.org/scripts/490441/Create%20Cookie%20for%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/490441/Create%20Cookie%20for%20reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a cookie
    function createCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    // Call the createCookie function with your desired cookie name, value, and expiration in days
    createCookie("reddit_session", "F*CK_REDDIT_VPN_BLOCKING", 365); // Example: expires in 365 days
})();