// ==UserScript==
// @name         Bypass OnlineTools Paywall
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Onlinetools.com recently implemented a paywall. This script bypasses it.
// @author       Your Name
// @match        http*://onlinetools.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510596/Bypass%20OnlineTools%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/510596/Bypass%20OnlineTools%20Paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeCfcpCookies() {
        // Get all cookies for the current domain
        const cookies = document.cookie.split(';');

        cookies.forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();
            if (cookieName.startsWith('cfcp')) {
                // Sets the cookie's expiration date to the past to remove it
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
            }
        });
    }

    removeCfcpCookies();

    setInterval(removeCfcpCookies, 1000);
})();
