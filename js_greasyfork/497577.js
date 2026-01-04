// ==UserScript==
// @name         Tracking Redirect Nuker
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Decode encoded URLs in links and replace them with the decoded URL
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://*/*
// @exclude      *://*.indeed.com/*
// @exclude      *://indeed.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497577/Tracking%20Redirect%20Nuker.user.js
// @updateURL https://update.greasyfork.org/scripts/497577/Tracking%20Redirect%20Nuker.meta.js
// ==/UserScript==
     
(function() {
    'use strict';

    function decodeAndReplaceLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            const encodedIndexHttps = href.indexOf('https%3A%2F%2F');
            const encodedIndexHttp = href.indexOf('http%3A%2F%2F');
            if (encodedIndexHttps !== -1 || encodedIndexHttp !== -1) {
                const encodedPart = href.substring(Math.max(encodedIndexHttps, encodedIndexHttp));
                const decodedPart = decodeURIComponent(encodedPart);
                link.setAttribute('href', decodedPart);
            }
        });
    }

    // Run once when the page loads
    decodeAndReplaceLinks();

    // Run every time a change is detected on the page
    const observer = new MutationObserver(decodeAndReplaceLinks);
    observer.observe(document.body, { subtree: true, childList: true });
})();