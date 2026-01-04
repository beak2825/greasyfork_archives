// ==UserScript==
// @name         Sefaria Clean Search Links
// @namespace    http://binjomin.hu/
// @version      1.0
// @description  Removes query strings from Sefaria search result links
// @author       Binjomin Szanto-Varnagy
// @license      MIT
// @match        https://www.sefaria.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541347/Sefaria%20Clean%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/541347/Sefaria%20Clean%20Search%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanLinks() {
        const links = document.querySelectorAll('a[href^="/"][href*="?"] > .result-title');

        links.forEach(resultTitle => {
            const anchor = resultTitle.parentElement;
            if (anchor && anchor.tagName === "A") {
                const originalHref = anchor.getAttribute("href");
                const cleanHref = originalHref.split("?")[0];
                anchor.setAttribute("href", cleanHref);
            }
        });
    }

    // Run on page load
    cleanLinks();

    // Run again when the DOM changes (in case results are loaded dynamically)
    const observer = new MutationObserver(() => {
        cleanLinks();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
