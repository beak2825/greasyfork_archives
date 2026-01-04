// ==UserScript==
// @name         YouTube Reklam Engelleyici
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  YouTube'daki video reklamlarını otomatik olarak atlar ve engeller.
// @author       Your Name
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/6531572f/img/favicon_32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518209/YouTube%20Reklam%20Engelleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/518209/YouTube%20Reklam%20Engelleyici.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const skipAds = () => {
        // Reklam atlama butonunu bul ve tıkla
        const skipButton = document.querySelector('.ytp-ad-skip-button');
        if (skipButton) {
            skipButton.click();
            console.log('Reklam atlandı.');
        }

        // Video reklamlarını tamamen gizle
        const adOverlay = document.querySelectorAll('.ad-showing, .ad-interrupting');
        adOverlay.forEach(ad => {
            ad.style.display = 'none';
            console.log('Video reklam gizlendi.');
        });

        // Banner reklamlarını kaldır
        const bannerAds = document.querySelectorAll('.ytp-ad-overlay-container');
        bannerAds.forEach(banner => {
            banner.style.display = 'none';
            console.log('Banner reklam kaldırıldı.');
        });
    };

    // Düzenli aralıklarla reklamları kontrol et
    setInterval(skipAds, 1000);
})();