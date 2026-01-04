// ==UserScript==
// @name         YouTube Menu Apps Organizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Move "More from YouTube" apps to the top navigation and remove from the right tab.
// @author       YourName
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531650/YouTube%20Menu%20Apps%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/531650/YouTube%20Menu%20Apps%20Organizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveYouTubeApps() {
        // Select the right-side menu where YouTube apps are currently placed
        let rightMenu = document.querySelector("#sections");  // Adjust based on actual HTML
        let topNav = document.querySelector("#top-level-buttons");  // Adjust based on actual HTML

        if (!rightMenu || !topNav) return;

        // Look for app links inside the right menu
        let appLinks = rightMenu.querySelectorAll("ytd-rich-grid-media");  // Adjust based on actual HTML element

        appLinks.forEach(app => {
            let clonedApp = app.cloneNode(true);
            topNav.appendChild(clonedApp);
        });

        // Optionally, remove the original apps from the right menu
        rightMenu.remove();
    }

    function waitForMenu() {
        let checkExist = setInterval(() => {
            if (document.querySelector("#sections") && document.querySelector("#top-level-buttons")) {
                clearInterval(checkExist);
                moveYouTubeApps();
            }
        }, 1000);
    }

    waitForMenu();
})();
