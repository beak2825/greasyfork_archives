// ==UserScript==
// @name         Redirect TARDIS Fandom to TARDIS Wiki
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect tardis.fandom.com links to tardis.wiki
// @author       noah-goeders
// @license      MIT
// @match        *://tardis.fandom.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523714/Redirect%20TARDIS%20Fandom%20to%20TARDIS%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/523714/Redirect%20TARDIS%20Fandom%20to%20TARDIS%20Wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect the current page
    const newUrl = window.location.href.replace('tardis.fandom.com', 'tardis.wiki');
    if (window.location.href !== newUrl) {
        window.location.replace(newUrl);
    }

    // Redirect any tardis.fandom.com links on the page
    document.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('a[href*="tardis.fandom.com"]');
        links.forEach(link => {
            link.href = link.href.replace('tardis.fandom.com', 'tardis.wiki');
        });
    });
})();
