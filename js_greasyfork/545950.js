// ==UserScript==
// @name         m.YouTube Auto Landscape Video
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically rotate m.youtube.com videos to appear landscape while orientation lock is on (Orion iOS)
// @author       Jake Julian
// @match        *://m.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545950/mYouTube%20Auto%20Landscape%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/545950/mYouTube%20Auto%20Landscape%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rotateVideo(video) {
        video.style.transform = 'rotate(90deg) translateY(-50%)';
        video.style.transformOrigin = 'top left';
        video.style.position = 'fixed';
        video.style.top = '50%';
        video.style.left = '50%';
        video.style.width = '100vh';
        video.style.height = '100vw';
        video.style.zIndex = 9999;
        video.style.backgroundColor = 'black';
    }

    function resetVideo(video) {
        video.style.transform = '';
        video.style.transformOrigin = '';
        video.style.position = '';
        video.style.top = '';
        video.style.left = '';
        video.style.width = '';
        video.style.height = '';
        video.style.zIndex = '';
        video.style.backgroundColor = '';
    }

    function observeVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.dataset.landscapeApplied) {
                video.dataset.landscapeApplied = 'true';
                video.addEventListener('play', () => rotateVideo(video));
                video.addEventListener('pause', () => resetVideo(video));
                video.addEventListener('ended', () => resetVideo(video));
            }
        });
    }

    // Observe DOM changes to catch new video elements
    const observer = new MutationObserver(observeVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    observeVideos();
})();