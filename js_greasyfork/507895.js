// ==UserScript==
// @name         Ultimate Video & Image Quality Enhancer (No Lag, Best Previews)
// @namespace    https://greasyfork.org/shannonturner
// @version      1.4
// @description  Forces the highest quality playback for videos and images on all sites. Enhances thumbnails and video previews instantly without lag, pausing, or freezing.
// @author       tae
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507895/Ultimate%20Video%20%20Image%20Quality%20Enhancer%20%28No%20Lag%2C%20Best%20Previews%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507895/Ultimate%20Video%20%20Image%20Quality%20Enhancer%20%28No%20Lag%2C%20Best%20Previews%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("✅ Ultimate Video & Image Quality Enhancer is now active!");

    function enhanceMedia() {
        try {
            document.querySelectorAll('img:not([data-enhanced])').forEach(img => {
                if (!img.closest('iframe') && !img.closest('[class*="ad"], [id*="ad"]')) {
                    enhanceImage(img);
                }
            });

            document.querySelectorAll('video:not([data-enhanced])').forEach(video => {
                enhanceVideo(video);
            });
        } catch (err) {
            console.warn("❌ Error while enhancing media:", err);
        }
    }

    function enhanceImage(img) {
        if (!img.src || img.hasAttribute('data-enhanced')) return;

        try {
            // Upgrade to high-resolution if typical low-res parameters are detected
            img.src = img.src
                .replace(/=s\d+/g, '=s2160')
                .replace(/w=\d+/g, 'w=2160')
                .replace(/h=\d+/g, 'h=3840');

            img.style.imageRendering = 'crisp-edges';
            img.style.filter = 'none';
            img.setAttribute('data-enhanced', 'true');
        } catch (e) {
            console.error('❌ Failed to enhance image:', e);
        }
    }

    function enhanceVideo(video) {
        if (video.hasAttribute('data-enhanced')) return;

        try {
            video.setAttribute('data-enhanced', 'true');
            video.preload = 'auto';
            video.playsInline = true;
            video.autobuffer = true;
            video.style.filter = 'none';

            // Attempt to force highest quality playback
            if (typeof video.getAvailableQualityLevels === 'function') {
                const levels = video.getAvailableQualityLevels();
                if (levels?.length) {
                    video.setPlaybackQuality?.(levels[0]);
                }
            }

            video.load();
        } catch (e) {
            console.error('❌ Failed to enhance video:', e);
        }
    }

    function observeDOM() {
        const observer = new MutationObserver(() => {
            requestAnimationFrame(enhanceMedia);
        });

        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            enhanceMedia();
            observeDOM();
        });
    } else {
        enhanceMedia();
        observeDOM();
    }

    setInterval(enhanceMedia, 7000);
})();