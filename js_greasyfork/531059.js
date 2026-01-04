// ==UserScript==
// @name         Instagram Video Continuity
// @version      1.0
// @description  Keep playing videos ONLY if they were active before tab switch
// @author       Zen
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.instagram.com&sz=32
// @license      MIT
// @supportURL   https://github.com/Zen-CloudLabs/UserScripts/issues
// @homepageURL  https://github.com/Zen-CloudLabs/UserScripts
// @namespace https://greasyfork.org/users/1425911
// @downloadURL https://update.greasyfork.org/scripts/531059/Instagram%20Video%20Continuity.user.js
// @updateURL https://update.greasyfork.org/scripts/531059/Instagram%20Video%20Continuity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let activeVideos = new WeakMap();

    function enhanceVideo(video) {
        if (video._pausePatched) return;

        const originalPause = video.pause.bind(video);

        video.addEventListener('play', () => activeVideos.set(video, true));
        video.addEventListener('pause', () => activeVideos.delete(video));

        video.pause = function() {
            if (!document.hidden) originalPause();
        };

        video._pausePatched = true;
    }

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            document.querySelectorAll('video').forEach(video => {
                if (activeVideos.has(video) && video.paused) {
                    video.play().catch(e => {});
                }
            });
        }
    });

    const observer = new MutationObserver(() => {
        document.querySelectorAll('video').forEach(enhanceVideo);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('video').forEach(enhanceVideo);
})();