// ==UserScript==
// @name         Gartic.io Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks ads on Gartic.io
// @author       Your Name
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509884/Garticio%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/509884/Garticio%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Reklamları gizlemek için stil ekle
    const css = `
        /* Reklam alanlarını gizle */
        .ad, .banner, #ads, .ad-container, .ad-banner {
            display: none !important;
        }
    `;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Reklamları dinamik olarak kaldır
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.ad, .banner, #ads, .ad-container, .ad-banner').forEach(ad => ad.style.display = 'none');
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
