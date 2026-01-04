// ==UserScript==
// @name         The Battle Cats Fandom --> Miraheze
// @namespace    https://github.com/dinosw
// @version      0.2
// @description  Redirects The Battle Cats Fandom wiki to the new Miraheze wiki.
// @author       dinosw
// @match        https://battle-cats.fandom.com/wiki/*
// @match        *://*.fandom.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/516562/The%20Battle%20Cats%20Fandom%20--%3E%20Miraheze.user.js
// @updateURL https://update.greasyfork.org/scripts/516562/The%20Battle%20Cats%20Fandom%20--%3E%20Miraheze.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a URL is a Battle Cats Fandom page
    function isFandomPage(url) {
        return url.startsWith("https://battle-cats.fandom.com/wiki/");
    }

    // Function to perform the redirect to the new Miraheze URL
    function redirectToMiraheze(url) {
        const pageName = url.replace("https://battle-cats.fandom.com/wiki/", "");
        const newUrl = `https://battlecats.miraheze.org/wiki/${pageName}`;
        window.location.replace(newUrl); // Immediate redirect
    }

    // Check if the current page is a Fandom page and redirect on load
    if (isFandomPage(window.location.href)) {
        // Stop the page from fully loading by redirecting before it does
        redirectToMiraheze(window.location.href);
    }

    // Handle link clicks to redirect immediately
    document.addEventListener('click', function(event) {
        let target = event.target;

        // Check if the clicked element is a link (anchor tag)
        if (target && target.tagName === 'A' && target.href) {
            const linkUrl = target.href;

            // If it's a Battle Cats Fandom page, redirect
            if (isFandomPage(linkUrl)) {
                event.preventDefault(); // Prevent the default action (open the link)
                redirectToMiraheze(linkUrl);
            }
        }
    });
})();