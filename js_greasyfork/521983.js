// ==UserScript==
// @name         Reaper-Scans Left/Right Arrow Key Chapter Navigation
// @description  Left and Right keyboard arrow key navigation for chapters on reaper-scans.com
// @author       YourName
// @match        https://reaper-scans.com/*
// @grant        none
// @version 0.0.1.20241227130937
// @namespace https://greasyfork.org/users/1290861
// @downloadURL https://update.greasyfork.org/scripts/521983/Reaper-Scans%20LeftRight%20Arrow%20Key%20Chapter%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/521983/Reaper-Scans%20LeftRight%20Arrow%20Key%20Chapter%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("keyup", function(event) {
        const nextChapterButton = document.getElementById('number-go-left'); // Next Chapter
        const prevChapterButton = document.getElementById('number-go-right'); // Previous Chapter (replace with actual ID)

        // Right arrow key for "Next Chapter"
        if (event.key === "ArrowRight" && nextChapterButton) {
            nextChapterButton.click();
        }
        // Left arrow key for "Previous Chapter"
        else if (event.key === "ArrowLeft" && prevChapterButton) {
            prevChapterButton.click();
        }
    });
})();
