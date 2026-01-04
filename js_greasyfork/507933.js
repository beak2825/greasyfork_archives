// ==UserScript==
// @name         Lazy Load Videos (Dynamic Support)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Lazy loads videos and handles dynamically added ones via MutationObserver for better performance on media-heavy pages.
// @author       tae
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507933/Lazy%20Load%20Videos%20%28Dynamic%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507933/Lazy%20Load%20Videos%20%28Dynamic%20Support%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.01
    };

    const processedSet = new WeakSet(); // Prevent duplicate observation

    const loadVideo = (video) => {
        if (processedSet.has(video)) return;
        processedSet.add(video);

        const sources = video.querySelectorAll('source[data-src]');
        let loaded = false;

        if (sources.length > 0) {
            sources.forEach(source => {
                if (source.dataset.src) {
                    source.src = source.dataset.src;
                    delete source.dataset.src;
                    loaded = true;
                }
            });
        }

        if (video.dataset.src) {
            video.src = video.dataset.src;
            delete video.dataset.src;
            loaded = true;
        }

        if (loaded) {
            video.load();
        }
    };

    const setupObserver = () => {
        if (!('IntersectionObserver' in window)) {
            fallbackLazyLoad();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    loadVideo(video);
                    observer.unobserve(video);
                }
            });
        }, config);

        const observeVideo = (video) => {
            if ((video.dataset.src || video.querySelector('source[data-src]')) && !processedSet.has(video)) {
                observer.observe(video);
            }
        };

        document.querySelectorAll('video').forEach(observeVideo);

        const mo = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return; // Skip non-element nodes
                    if (node.tagName === 'VIDEO') {
                        observeVideo(node);
                    } else {
                        node.querySelectorAll?.('video').forEach(observeVideo);
                    }
                });
            }
        });

        mo.observe(document.body, { childList: true, subtree: true });
    };

    const fallbackLazyLoad = () => {
        const lazyLoadFallback = () => {
            document.querySelectorAll('video').forEach(video => {
                if ((video.dataset.src || video.querySelector('source[data-src]')) && !processedSet.has(video)) {
                    const rect = video.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        loadVideo(video);
                    }
                }
            });
        };

        document.addEventListener('scroll', lazyLoadFallback);
        window.addEventListener('resize', lazyLoadFallback);
        window.addEventListener('orientationchange', lazyLoadFallback);
        lazyLoadFallback(); // Initial run
    };

    window.addEventListener('load', setupObserver);
})();