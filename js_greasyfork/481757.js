// ==UserScript==
// @name        instagram redirect to picuki
// @namespace   Violentmonkey Scripts
// @match       https://www.instagram.com/*
// @grant       none
// @version     1.2
// @author      minnie
// @description 12/9/2023, 3:07:35 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481757/instagram%20redirect%20to%20picuki.user.js
// @updateURL https://update.greasyfork.org/scripts/481757/instagram%20redirect%20to%20picuki.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function() {
        // get the current page URL
        const currentUrl = window.location.href;
        console.log('REDIRECT TO PICUKI');

        // extract the username from the insta URL
        function extractUser(link) {
            const regex = /\/([^\/?]+)\/$/;
            const match = link.match(regex);
            return match ? match[1] : null;
        }

        // get username of the current insta page
        const username = extractUser(currentUrl);
        console.log('USERNAME: ' + username);

        // check if a username is found and redirect to picuki
        if (username) {
            window.location.assign("https://www.picuki.com/profile/" + username);
        } else {
            console.error("Unable to extract username from the URL");
        }
    }, 3000); // 3 seconds timeout
})();

