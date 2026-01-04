// ==UserScript==
// @name        Replace Service Links
// @namespace   https://github.com/Official-Husko/violentmonkey-scripts
// @match       https://kemono.su/*
// @grant       none
// @version     1.0.0
// @license     GNU GPLv3
// @author      Official Husko
// @icon        https://www.pulexart.com/uploads/7/0/1/2/70121829/3-greyfox.png
// @description Replace the patreon links with kemono links for easy navigation. Strictly on Kemono.su
// @downloadURL https://update.greasyfork.org/scripts/484134/Replace%20Service%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/484134/Replace%20Service%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract meta content by name
    function getMetaContentByName(name) {
        const metaTag = document.querySelector(`meta[name="${name}"]`);
        return metaTag ? metaTag.getAttribute('content') : null;
    }

    // Function to extract numeric part from the right of a string
    function extractNumericPartFromRight(inputString) {
        const match = inputString.match(/(\d+)$/);
        return match ? match[1] : null;
    }

    // Get USER_ID and SERVICE_ID from meta tags
    const USER_ID = getMetaContentByName('user');
    const SERVICE_ID = getMetaContentByName('service');

    // Check if USER_ID and SERVICE_ID are available
    if (USER_ID && SERVICE_ID) {
        // Find and replace Patreon links
        document.querySelectorAll('a[href*="patreon.com/posts/"]').forEach(link => {
            const match = link.href.match(/https:\/\/(www\.)?patreon\.com\/posts\/(.+)/);
            if (match) {
                const rawPostID = match[2];
                const numericPostID = extractNumericPartFromRight(rawPostID);
                // Replace the link with the custom format
                if (numericPostID) {
                    link.href = `https://kemono.su/${SERVICE_ID}/user/${USER_ID}/post/${numericPostID}`;
                }
            }
        });
    }
})();