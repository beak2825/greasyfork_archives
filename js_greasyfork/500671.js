// ==UserScript==
// @name         Remove Legacy Parameter from Telegram Links
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove legacy=1 parameter from specific Telegram links
// @author       Your Name
// @match        https://t.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500671/Remove%20Legacy%20Parameter%20from%20Telegram%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/500671/Remove%20Legacy%20Parameter%20from%20Telegram%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove legacy=1 from a URL
    function removeLegacyParameter(url) {
        let urlObj = new URL(url);
        urlObj.searchParams.delete('legacy');
        return urlObj.toString();
    }

    // Function to update all links on the page
    function updateLinks() {
        // Get all links on the page
        let links = document.querySelectorAll('a');

        // Remove legacy=1 from each link
        links.forEach(link => {
            if (link.href.includes('legacy=1')) {
                link.href = removeLegacyParameter(link.href);
                console.log('Removed legacy=1 from ' + link.href);
            }
        });
    }

    // Run updateLinks when the page is loaded
    window.addEventListener('load', updateLinks);

    // Run updateLinks every second to handle dynamic content
    setInterval(updateLinks, 1000);
})();
