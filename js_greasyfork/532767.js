// ==UserScript==
// @name         Redditp Autoplay On Load (Mobile Ready)
// @namespace    http://yourmomshouse.com/
// @version      1.3
// @description  Autoplays all videos on redditp.com, even when scrolling. Works in AdGuard on Android.
// @author       Your Friendly Script Goblin
// @match        *://redditp.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532767/Redditp%20Autoplay%20On%20Load%20%28Mobile%20Ready%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532767/Redditp%20Autoplay%20On%20Load%20%28Mobile%20Ready%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function autoplayVideos() {
        const videos = document.querySelectorAll('video:not([data-autoplayed])');
        videos.forEach(video => {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => video.setAttribute('data-autoplayed', 'true'))
                    .catch(err => {
                        console.warn('Autoplay failed:', err);
                    });
            } else {
                video.setAttribute('data-autoplayed', 'true');
            }
        });
    }

    // Initial run
    autoplayVideos();

    // MutationObserver for dynamic content
    const observer = new MutationObserver(() => {
        autoplayVideos();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Optional: rerun every few seconds in case of missed mutations
    setInterval(autoplayVideos, 3000);
})();