// ==UserScript==
// @name         Last.fm: Always Use +noredirect (except image links)
// @namespace    https://last.fm/
// @version      1.3
// @description  Forces all Last.fm music links to include +noredirect to prevent incorrect redirection to similarly named artists. Skips image links.
// @author       DiCK
// @match        https://*.last.fm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534518/Lastfm%3A%20Always%20Use%20%2Bnoredirect%20%28except%20image%20links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534518/Lastfm%3A%20Always%20Use%20%2Bnoredirect%20%28except%20image%20links%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Update all relevant <a> tags to use +noredirect, except if they already have it or go to /+images/
    function fixLinks() {
        const links = document.querySelectorAll('a[href*="/music/"]');

        links.forEach(link => {
            const href = link.getAttribute('href');

            // Skip if the link already contains +noredirect or goes to an image gallery
            if (href.includes('/+noredirect/') || href.includes('/+images/')) return;

            // Match both internal and full URLs to /music/<band>
            const regex = /^(https?:\/\/(www\.)?last\.fm)?\/music\/([^\/?#]+)/;

            const match = href.match(regex);
            if (match) {
                const bandName = match[3];
                const newHref = href.replace(`/music/${bandName}`, `/music/+noredirect/${bandName}`);
                link.setAttribute('href', newHref);
            }
        });
    }

    // Run on page load
    fixLinks();

    // Observe the page for dynamically added content and fix links accordingly
    const observer = new MutationObserver(fixLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
