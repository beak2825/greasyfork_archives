// ==UserScript==
// @name         Highlight Friends on Steam
// @namespace    https://github.com/encumber
// @version      1.0
// @description  Highlight friend blocks for specific Steam IDs
// @author       Nitoned
// @match        https://steamcommunity.com/id/*/friendsthatplay/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535439/Highlight%20Friends%20on%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/535439/Highlight%20Friends%20on%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the custom Steam IDs you want to highlight
    const highlightIDs = ["id", "id2"];

    // Helper function to get the custom ID from href
    // Extracts the ID from /id/ or /profiles/ URL
    function extractSteamID(href) {
        const match = href.match(/^https:\/\/steamcommunity\.com\/(id|profiles)\/([^/?#]+)/);
        return match ? match[2] : null;
    }

    function highlightFriends() {
        const links = document.querySelectorAll('a.friendBlockLinkOverlay');

        links.forEach(link => {
            const steamID = extractSteamID(link.href);
            if (steamID && highlightIDs.includes(steamID)) {
                const parentDiv = link.closest('div');
                if (parentDiv) {
                    parentDiv.style.border = "1px solid red";
                    parentDiv.style.backgroundColor = "#00a840";
                }
            }
        });
    }

    // Observe for dynamically loaded content
    const observer = new MutationObserver(() => {
        highlightFriends();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run on initial load
    highlightFriends();
})();