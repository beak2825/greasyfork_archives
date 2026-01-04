// ==UserScript==
// @name         Schoology Info Skip
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  When opening a assignment, skip to editing. You have 3 seconds to switch to info if you want to check it.
// @author       Nav
// @license MIT
// @match        https://*.schoology.com/assignments/*/info
// @icon         https://www.google.com/s2/favicons?sz=64&domain=schoology.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479513/Schoology%20Info%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/479513/Schoology%20Info%20Skip.meta.js
// ==/UserScript==


// Note, this script is made easy to edit, so it can be universal.
(function() {
    'use strict';

    // Set Variables
    var originalSegment = '/info';
    var targetSegment = '/mydocument';

    // Check if the script was ran in the lest 3 seconds
    if (localStorage.getItem('urlChangerTimestamp')) {
        var lastTimestamp = parseInt(localStorage.getItem('urlChangerTimestamp'));
        var currentTime = new Date().getTime();

        // If less than 3 seconds have passed, do not change the URL
        if (currentTime - lastTimestamp < 3000) {
            return;
        }
    }

    // Get the current URL
    var currentUrl = window.location.pathname;

    // Check if the current URL ends with the original segment
    if (currentUrl.endsWith(originalSegment)) {
        // Change the URL by replacing the original segment with the target segment
        var newUrl = currentUrl.slice(0, -originalSegment.length) + targetSegment;
        window.history.pushState({}, '', newUrl);

        // Save the current timestamp to localStorage
        localStorage.setItem('urlChangerTimestamp', new Date().getTime().toString());
    }
})();