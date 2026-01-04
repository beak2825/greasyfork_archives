// ==UserScript==
// @name         JustWatch Link Cleaner
// @namespace    MickyFoley
// @version      1.2
// @description  Cleans JustWatch links to get directly to the movies
// @author       MickyFoley
// @match        https://www.justwatch.com/*
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473453/JustWatch%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/473453/JustWatch%20Link%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to clean a URL
    function cleanUrl(url) {
        const urlObj = new URL(url);
        const encodedUrl = urlObj.searchParams.get('r');
        if (encodedUrl) {
            // Decoding the URL
            let decodedUrl = decodeURIComponent(encodedUrl);
            console.log("Decoded URL before cleanup:", decodedUrl);

            // Remove the `searchReferral` parameter if present
            decodedUrl = decodedUrl.split('?searchReferral=')[0];
            console.log("Decoded URL after cleanup:", decodedUrl);

            return decodedUrl;
        }
        return null;
    }

    // Function to clean and modify the links
    function cleanLinks() {
        const links = document.querySelectorAll('a[href*="click.justwatch.com"], a[href*="d.justwatch.com/a?"]');
        console.log(`Found ${links.length} links to clean.`);
        links.forEach(link => {
            const cleanUrlParam = cleanUrl(link.href);
            if (cleanUrlParam) {
                console.log("Cleaning link:", link.href, " -> ", cleanUrlParam);
                link.href = cleanUrlParam;
            }
        });
    }

    // Initial run to clean already existing links
    cleanLinks();

    // Observer to watch for dynamically added links
    const observer = new MutationObserver(mutations => {
        cleanLinks();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
