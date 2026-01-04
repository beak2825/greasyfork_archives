// ==UserScript==
// @name         Old Reddit: Pause Videos / YT Embeds When Scrolled Out Upwards
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Pauses Reddit videos and YouTube embeds when they scroll out of view (upwards).
// @author       Claude AI
// @match        https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540394/Old%20Reddit%3A%20Pause%20Videos%20%20YT%20Embeds%20When%20Scrolled%20Out%20Upwards.user.js
// @updateURL https://update.greasyfork.org/scripts/540394/Old%20Reddit%3A%20Pause%20Videos%20%20YT%20Embeds%20When%20Scrolled%20Out%20Upwards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Utility functions ---

    // Find all regular <video> tags on Reddit (not inside YT iframes)
    function getAllRedditVideos() {
        return Array.from(document.querySelectorAll('video'))
            .filter(v => !v.closest('iframe')); // Exclude videos inside iframes
    }

    // Find all YouTube embed iframes
    function getAllYouTubeIframes() {
        return Array.from(document.querySelectorAll('iframe')).filter(iframe => {
            const src = iframe.src || '';
            // Matches youtube.com/embed or redditmedia.com/mediaembed
            return (
                /youtube\.com\/embed/i.test(src) ||
                /youtu\.be\//i.test(src) ||
                /redditmedia\.com\/mediaembed\//i.test(src)
            );
        });
    }

    // Is the element out of the viewport above (both bounds <= 0)?
    function isScrolledOutTop(el) {
        const rect = el.getBoundingClientRect();
        return rect.bottom <= 0 && rect.top <= 0;
    }

    // Pause <video> tags
    function handleRedditVideos() {
        getAllRedditVideos().forEach(video => {
            if (!video.paused && isScrolledOutTop(video)) {
                video.pause();
                console.debug('[Reddit Video Pause Userscript] Paused Reddit <video>:', video);
            }
        });
    }

    // Pause YouTube embeds using postMessage API
    function handleYouTubeEmbeds() {
        getAllYouTubeIframes().forEach(iframe => {
            if (isScrolledOutTop(iframe)) {
                // Tell YT iframe to pause (uses YouTube Iframe API's message format)
                try {
                    iframe.contentWindow.postMessage(
                        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
                        '*'
                    );
                    console.debug('[Reddit Video Pause Userscript] Pause sent to YouTube embed:', iframe);
                } catch (err) {
                    console.warn('[Reddit Video Pause Userscript] Could not postMessage to YouTube embed:', err);
                }
            }
        });
    }

    // --- Main handler ---

    function handleVideosOutOfView() {
        handleRedditVideos();
        handleYouTubeEmbeds();
    }

    // --- Event setup with throttling ---

    let scrollTimer = null;
    function throttledScrollHandler() {
        if (scrollTimer) return;
        scrollTimer = setTimeout(() => {
            handleVideosOutOfView();
            scrollTimer = null;
        }, 200); // 200ms
    }

    window.addEventListener('scroll', throttledScrollHandler);
    window.addEventListener('resize', throttledScrollHandler);

    // Watch for DOM updates for dynamically added videos/embeds
    const observer = new MutationObserver(mutations => {
        handleVideosOutOfView();
    });
    observer.observe(document.body, {childList: true, subtree: true});

    // Initial startup delay for the page to load
    setTimeout(handleVideosOutOfView, 1500);

    console.debug('[Reddit Video Pause Userscript] Loaded (video/YT support)!');

})();