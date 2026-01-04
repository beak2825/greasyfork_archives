// ==UserScript==
// @name         Website Name Changer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Changes any website's title and favicon to Google Classroom
// @author       You
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524771/Website%20Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/524771/Website%20Name%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the title
    function changeTitle() {
        document.title = "Google Classroom";
    }

    // Function to change the favicon
    function changeFavicon(url) {
        let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = url;

        // Remove old favicons if any exist
        let oldIcons = document.querySelectorAll("link[rel*='icon']");
        oldIcons.forEach(icon => icon.remove());

        document.head.appendChild(link);
    }

    // Run changes when page is fully loaded
    window.addEventListener("load", () => {
        changeTitle();
        changeFavicon("https://ssl.gstatic.com/classroom/favicon.png");
    });

    // MutationObserver to handle dynamic content (e.g., SPAs like YouTube, Twitter)
    let observer = new MutationObserver(() => {
        changeTitle();
        changeFavicon("https://ssl.gstatic.com/classroom/favicon.png");
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

