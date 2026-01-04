// ==UserScript==
// @name         Twitter Video Volume Control
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Set video volume to 10% and prevent autoplay on Twitter videos.
// @author       You
// @match        https://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493998/Twitter%20Video%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/493998/Twitter%20Video%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setVideoVolume(video, volume) {
        video.volume = volume;
    }

    function pauseVideo(video) {
        if (!video.paused) {
            video.pause();
        }
    }

    function handleVideos() {
        var twitterVideos = document.querySelectorAll('video');
        twitterVideos.forEach(function(video) {
            video.addEventListener('volumechange', function() {
                if (video.volume > 0 && video.muted) {
                    video.muted = false;
                }
            });
            video.autoplay = false;
            pauseVideo(video);
        });
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                handleVideos();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    handleVideos();
})();
