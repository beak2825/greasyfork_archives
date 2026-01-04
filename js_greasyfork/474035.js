// ==UserScript==
// @name         Bing Link Redirect Decoder
// @namespace    MickyFoley
// @version      1.0
// @description  Decode Bing redirect URLs and replace them with the actual URLs.
// @author       MickyFoley
// @match        *://*.bing.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474035/Bing%20Link%20Redirect%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/474035/Bing%20Link%20Redirect%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function decodeBingURL(encodedURL) {
        // Modify the encoded URL to match Base64 encoding
        let modifiedEncodedURL = encodedURL.replace('-', '+').replace('_', '/');

        // Add padding if necessary
        let paddingNeeded = modifiedEncodedURL.length % 4;
        if (paddingNeeded) {
            modifiedEncodedURL += '='.repeat(4 - paddingNeeded);
        }

        // Decode the URL and return
        return atob(modifiedEncodedURL);
    }

    function processLinks() {
        const links = document.querySelectorAll('a[href*="bing.com/ck/"]');
        links.forEach(link => {
            const urlMatch = link.href.match(/u=([^&]+)/);
            if (urlMatch && urlMatch[1]) {
                const decodedURL = decodeBingURL(urlMatch[1].slice(2));
                link.href = decodedURL;
                link.title = "Decoded URL: " + decodedURL;
            }
        });
    }

    // Process links when the page loads and also when new content is added
    processLinks();
    new MutationObserver(processLinks).observe(document.body, { childList: true, subtree: true });
})();
