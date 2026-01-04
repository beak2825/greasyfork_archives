// ==UserScript==
// @name         YouTube Ad Blocker - PC Only
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Blocks all YouTube ads when watching videos (PC only).
// @author       Your Name
// @match        *://www.youtube.com/*
// @exclude      *://m.youtube.com/*  // Sadece masaüstü için çalışır
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/509887/YouTube%20Ad%20Blocker%20-%20PC%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/509887/YouTube%20Ad%20Blocker%20-%20PC%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Video reklamlarını ve overlay reklamları atlamak için fonksiyon
    const skipAds = () => {
        const adSkipButton = document.querySelector('.ytp-ad-skip-button'); // "Reklamı Geç" butonu
        if (adSkipButton) adSkipButton.click(); // Reklamı otomatik geç

        const overlayCloseButton = document.querySelector('.ytp-ad-overlay-close-button'); // Küçük banner reklam
        if (overlayCloseButton) overlayCloseButton.click(); // Kapat

        // Reklam video player'ını tamamen kaldır
        const adContainer = document.querySelector('.video-ads');
        if (adContainer) adContainer.remove();
    };

    // 2. Reklam URL isteklerini engellemek için fetch() ve XHR kancalama
    const blockAdRequests = () => {
        const adURLs = ['doubleclick.net', 'googleads.g.doubleclick.net', '/ads/'];

        // fetch() kancalama
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            if (adURLs.some(url => args[0].includes(url))) {
                console.warn(`Blocked ad request: ${args[0]}`);
                return Promise.resolve(new Response('{}')); // Boş yanıt
            }
            return originalFetch.apply(this, args);
        };

        // XMLHttpRequest kancalama
        const originalXHR = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (adURLs.some(adURL => url.includes(adURL))) {
                console.warn(`Blocked ad request: ${url}`);
                return; // İsteği engelle
            }
            return originalXHR.apply(this, arguments);
        };
    };

    // 3. Sayfa değişimlerinde reklamları kontrol eden gözlemci
    const observer = new MutationObserver(() => skipAds());
    observer.observe(document.body, { childList: true, subtree: true });

    // 4. Tarayıcıda reklam URL'lerini engelle
    blockAdRequests();
})();
