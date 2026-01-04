// ==UserScript==
// @name         easystrapper (for youtube)
// @namespace    http://tampermonkey.net/
// @version      2024-08-13
// @description  Optimizes YouTube loading by preloading thumbnails, lazy loading content, and postponing thumbnail loading during playback.
// @license MIT
// @author       ondry4k
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503582/easystrapper%20%28for%20youtube%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503582/easystrapper%20%28for%20youtube%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function lazyLoadThumbnails() {
        const config = {
            rootMargin: '200px 0px',
            threshold: 0.01
        };

        const observer = new IntersectionObserver((entries, self) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const dataSrc = img.getAttribute('data-thumb') || img.getAttribute('src');
                    if (dataSrc && dataSrc !== img.src) {
                        img.src = dataSrc;
                    }
                    self.unobserve(entry.target);
                    console.log("easystrapper: Thumbnail loaded.");
                }
            });
        }, config);

        document.querySelectorAll('img[src*="default.jpg"]').forEach(img => {
            observer.observe(img);
            console.log("easystrapper: Observer attached to thumbnail.");
        });
    }

    function preloadInitialThumbnails() {
        document.querySelectorAll('img[src*="default.jpg"]').forEach(img => {
            const dataSrc = img.getAttribute('data-thumb') || img.getAttribute('src');
            if (dataSrc && dataSrc !== img.src) {
                img.src = dataSrc;
                console.log("easystrapper: Preloaded initial thumbnail.");
            }
        });
    }

    function postponeThumbnailsOnPlayback() {
        const videoPlayer = document.querySelector('video');
        if (videoPlayer) {
            videoPlayer.addEventListener('playing', () => {
                document.querySelectorAll('img[src*="default.jpg"]').forEach(img => {
                    img.loading = 'lazy';
                    console.log("easystrapper: Thumbnail loading postponed during playback.");
                });
            });

            videoPlayer.addEventListener('pause', () => {
                preloadInitialThumbnails();
                console.log("easystrapper: Thumbnails reloaded after pause.");
            });
        }
    }

    function deferNonCriticalScripts() {
        document.querySelectorAll('script:not([defer]):not([async])').forEach(script => {
            script.setAttribute('defer', '');
            console.log("easystrapper: Script deferred for better performance.");
        });
    }

    // Eliminate render-blocking resources by deferring offscreen images
    function deferOffscreenImages() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
                console.log("easystrapper: Offscreen image set to lazy load.");
            }
        });
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    lazyLoadThumbnails();
                    deferOffscreenImages();
                }
            });
            console.log("easystrapper: DOM changes observed and optimizations reapplied.");
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        preloadInitialThumbnails();
        postponeThumbnailsOnPlayback();
        lazyLoadThumbnails();
        deferNonCriticalScripts();
        deferOffscreenImages();
        observeDOMChanges();
        console.log("easystrapper: Initialization complete, optimizations applied.");
    });

})();
