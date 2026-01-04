// ==UserScript==
// @name         FONBET - CLIENT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Extract segment from URL and use it in two new URLs
// @author       Lukas Malec
// @match        https://fonbet.com.cy/sports/football/*
// @match        https://fon.bet/sports/football/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496695/FONBET%20-%20CLIENT.user.js
// @updateURL https://update.greasyfork.org/scripts/496695/FONBET%20-%20CLIENT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    let currentUrl = window.location.href;

    // Extract the segment between the last two slashes
    let urlParts = currentUrl.split('/');
    let segment = urlParts[urlParts.length - 2] + urlParts[urlParts.length - 1];

    // Construct the new URLs
    let newUrl1 = `https://clientsapi02w.bk6bba-resources.com/service-tv/mobile/mc?app_name=mobile_site&eventId=${segment}&lang=en&sysId=2&page=stats-1`;
    let newUrl2 = `https://clientsapi01w.bk6bba-resources.com/service-tv/mobile/mc?app_name=mobile_site&eventId=${segment}&lang=en&sysId=2&page=events`;

    // Open the new URLs in separate windows
    window.open(newUrl1, '_blank');
    window.open(newUrl2, '_blank');

    // Close the original window
    window.close();
})();