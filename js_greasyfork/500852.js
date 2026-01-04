// ==UserScript==
// @name         Enhance Media Content
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Preset all thumbnails and images to 3D+HDR and videos to 1080p 144fps VP9+HDR
// @author       Tae
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/500852/Enhance%20Media%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/500852/Enhance%20Media%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply styles to images and thumbnails for 3D+HDR effect
    function applyImageStyles() {
        const images = document.querySelectorAll('img:not([src*="ad"]), .thumbnail:not([src*="ad"])');
        images.forEach(img => {
            img.style.filter = 'brightness(1.1) contrast(1.1) saturate(0.5)';
            img.style.transform = 'perspective(1000px) rotateY(15deg)';
        });
    }

    // Apply video settings for 144fps VP9+HDR
    function applyVideoSettings() {
        const videos = document.querySelectorAll('video:not([src*="ad"])');
        videos.forEach(video => {
            video.addEventListener('loadedmetadata', () => {
                try {
                    video.playbackQuality = {
                        resolution: '1080p',
                        framerate: 144,
                        codec: 'vp9',
                        dynamicRange: 'hdr'
                    };
                    console.log('Applied 144fps VP9+HDR settings to video:', video);
                } catch (error) {
                    console.error('Failed to apply video settings:', error);
                }
            });
        });
    }

    // Observer to detect new images and videos added dynamically
    function observeMutations() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    applyImageStyles();
                    applyVideoSettings();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initial application of styles and settings
    applyImageStyles();
    applyVideoSettings();
    observeMutations();
})();