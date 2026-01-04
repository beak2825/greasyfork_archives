// ==UserScript==
// @name         Tenor to Direct GIF
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts correct unique GIF key from image URL and redirects to direct .gif link on c.tenor.com
// @author       Pythius-Demon
// @match        https://tenor.com/view/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543028/Tenor%20to%20Direct%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/543028/Tenor%20to%20Direct%20GIF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to search for valid img and extract the unique key
    const tryRedirect = () => {
        const imgs = document.querySelectorAll('img[src*="tenor.com"]');
        for (const img of imgs) {
            const match = img.src.match(/tenor\.com\/[a-z]\/([a-zA-Z0-9_-]+)\/[^\/]+\.gif/);
            if (match && match[1]) {
                const key = match[1];
                const directUrl = `https://c.tenor.com/${key}/tenor.gif`;
                if (window.location.href !== directUrl) {
                    window.location.replace(directUrl);
                    return true;
                }
            }
        }
        return false;
    };

    // Use MutationObserver since tenor.com is dynamic
    const observer = new MutationObserver(() => {
        if (tryRedirect()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run once in case image already exists
    tryRedirect();
})();
