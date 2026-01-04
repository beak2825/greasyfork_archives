// ==UserScript==
// @name         Bilibili Favicon Fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fix Bilibili favicon issue by replacing the broken link with a working one.
// @author       Your Name
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496879/Bilibili%20Favicon%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/496879/Bilibili%20Favicon%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newFaviconUrl = 'https://static.hdslb.com/images/favicon.ico';

    function replaceFavicon() {
        const linkElements = document.querySelectorAll("link[rel='shortcut icon']");
        linkElements.forEach(link => {
            if (link.href.includes('www.bilibili.com/favicon.ico')) {
                link.href = newFaviconUrl;
            }
        });

        // If no favicon link is found, create a new one
        if (linkElements.length === 0) {
            const newLink = document.createElement('link');
            newLink.rel = 'shortcut icon';
            newLink.href = newFaviconUrl;
            document.head.appendChild(newLink);
        }
    }

    // Execute the function to replace the favicon after the page fully loads
    window.addEventListener('load', replaceFavicon);
})();
