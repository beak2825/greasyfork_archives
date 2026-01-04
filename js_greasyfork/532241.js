// ==UserScript==
// @name         Kemono Auto Full-Res Images
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically load full-res images on Kemono without a button, optimized for dynamic navigation (SPA-friendly). 🔥
// @author       rockyjoe554
// @license MI
// @match        https://kemono.su/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532241/Kemono%20Auto%20Full-Res%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/532241/Kemono%20Auto%20Full-Res%20Images.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastUrl = location.href;

    function upgradeImages() {
        const thumbs = document.querySelectorAll('.post__thumbnail a.fileThumb img');

        thumbs.forEach(img => {
            const link = img.closest('a.fileThumb');
            if (!link) return;

            const fullUrl = link.href;
            if (img.src !== fullUrl) {
                img.src = fullUrl;
                img.setAttribute('data-src', fullUrl);
                img.loading = 'eager';
            }
        });
    }

    function waitForImagesAndUpgrade() {
        const maxAttempts = 20;
        let attempt = 0;

        const interval = setInterval(() => {
            attempt++;
            const thumbs = document.querySelectorAll('.post__thumbnail a.fileThumb img');
            if (thumbs.length > 0) {
                upgradeImages();
                clearInterval(interval);
            } else if (attempt >= maxAttempts) {
                clearInterval(interval);
            }
        }, 250);
    }

    const observer = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            waitForImagesAndUpgrade();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', waitForImagesAndUpgrade);
})();
