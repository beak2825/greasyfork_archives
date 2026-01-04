// ==UserScript==
// @name         365 - hráčské stats
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Extract segment from URL and use it in two new URLs
// @author       Lukas Malec
// @match        https://www.365scores.com/football/match/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506444/365%20-%20hr%C3%A1%C4%8Dsk%C3%A9%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/506444/365%20-%20hr%C3%A1%C4%8Dsk%C3%A9%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    let currentUrl = window.location.href;

    // Extract the part after the last "=" in the URL
    let segment = currentUrl.split('=').pop();
    console.log(segment);

    // Construct the new URLs
    let newUrl1 = `https://webws.365scores.com/web/athletes/games/lineups?gameId=${segment}`;
    let newUrl2 = `https://webws.365scores.com/web/athletes/games/lineups?appTypeId=5&langId=1&timezoneName=Europe/Prague&userCountryId=22&gameId=${segment}`;

    // Open the new URLs in separate windows
    window.open(newUrl1, '_blank');
    window.open(newUrl2, '_blank');

    // Close the original window
    window.close();
})();