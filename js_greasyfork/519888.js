// ==UserScript==
// @name         YouTube Mobile Open Videos and Shorts in New Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open all YouTube videos and Shorts in a new tab on the mobile website
// @author       Agreasyforkuser
// @match        *://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519888/YouTube%20Mobile%20Open%20Videos%20and%20Shorts%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/519888/YouTube%20Mobile%20Open%20Videos%20and%20Shorts%20in%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify all video and Shorts links
    function updateLinks() {
        // Select all anchor tags for regular videos and Shorts
        const videoLinks = document.querySelectorAll('a[href*="/watch"], a[href*="/shorts/"]');
        videoLinks.forEach(link => {
            link.setAttribute('target', '_blank'); // Ensure they open in a new tab
        });
    }

    // Run the function initially
    updateLinks();

    // Observe changes to the page for dynamic content loading
    const observer = new MutationObserver(() => {
        updateLinks(); // Update links whenever the page changes
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
