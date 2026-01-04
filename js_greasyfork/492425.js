// ==UserScript==
// @name         Hiscore temporary replacement
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically forward from a hiscore page to the compare page
// @author       You
// @match        https://idle-pixel.com/hiscores/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/492425/Hiscore%20temporary%20replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/492425/Hiscore%20temporary%20replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUsernameFromUrl() {
        const url = new URL(window.location.href);
        const username = url.searchParams.get("username");
        return username;
    }

    function redirectToCompare(username) {
        if (username) {
            const compareUrl = `https://data.idle-pixel.com/dev/compare/?player2=${username}`;
            window.location.href = compareUrl;
        }
    }

    const username = getUsernameFromUrl();
    redirectToCompare(username);

})();

