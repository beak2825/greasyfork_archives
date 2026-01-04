// ==UserScript==
// @name        DA Logo to Watch (Old Watch)
// @version     2.2
// @description When clicking the logo, the site usually takes you to the Home page, aka. the recommended feed. This script will change the link to lead to the Watch page instead. If you are already there, it will go to the home page as normal.
// @author      Valognir (https://www.deviantart.com/valognir)
// @namespace   https://greasyfork.org/en/scripts/445357-da-logo-to-watch-old-watch
// @run-at      document-start
// @match       *://*.deviantart.com/*
// @exclude     *://*.deviantart.com/*realEstateId*
// @downloadURL https://update.greasyfork.org/scripts/445357/DA%20Logo%20to%20Watch%20%28Old%20Watch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445357/DA%20Logo%20to%20Watch%20%28Old%20Watch%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() {
        const observer = new MutationObserver(function(mutations) {
            if (!window.location.href.startsWith('https://www.deviantart.com/notifications/watch')) {
                const logoButton = document.querySelector('[aria-label="DeviantArt - Home"]');
                if (logoButton !== null) {
                    logoButton.href = 'https://www.deviantart.com/notifications/watch';
                }
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    });
})();
