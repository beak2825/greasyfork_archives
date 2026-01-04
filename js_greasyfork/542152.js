// ==UserScript==
// @name        多網站媒體低音量設定 (Facebook, Threads, Instagram)
// @name:zh-CN  多网站媒体低音量设置 (Facebook, Threads, Instagram)
// @name:en     Multi-Website Media Low Volume Setting (Facebook, Threads, Instagram)
// @version     1.1
// @description 為 Facebook, Threads 和 Instagram 的影片/Shorts 設定獨立的低音量。
// @description:zh-CN 为 Facebook, Threads 和 Instagram 的视频/Shorts 设置独立的低音量。
// @description:en Sets independent low volume for videos/Shorts on Facebook, Threads, and Instagram.
// @author      オーウェル緑
// @match       https://www.facebook.com/*
// @match       https://www.threads.com/*
// @match       https://www.instagram.com/*
// @grant       none
// @license      MIT
// @namespace https://greasyfork.org/users/650912
// @downloadURL https://update.greasyfork.org/scripts/542152/%E5%A4%9A%E7%B6%B2%E7%AB%99%E5%AA%92%E9%AB%94%E4%BD%8E%E9%9F%B3%E9%87%8F%E8%A8%AD%E5%AE%9A%20%28Facebook%2C%20Threads%2C%20Instagram%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542152/%E5%A4%9A%E7%B6%B2%E7%AB%99%E5%AA%92%E9%AB%94%E4%BD%8E%E9%9F%B3%E9%87%8F%E8%A8%AD%E5%AE%9A%20%28Facebook%2C%20Threads%2C%20Instagram%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** Set your desired volume for each website here (between 0.0 and 1.0) ***
    // 0.0 is mute, 1.0 is maximum volume.
    // Recommended values are between 0.1 and 0.3, you can adjust according to your preference.
    const siteVolumes = {
        'facebook.com': 0.2, // Volume for Facebook (e.g., 20%)
        'threads.com': 0.2,  // Volume for Threads (e.g., 20%)
        'instagram.com': 0.2 // Volume for Instagram (e.g., 20%)
    };

    let currentDesiredVolume = 0.2; // Default value, will be updated based on the current domain

    /**
     * Sets the target volume based on the current domain.
     */
    function setCurrentDesiredVolume() {
        const hostname = window.location.hostname;
        if (hostname.includes('facebook.com')) {
            currentDesiredVolume = siteVolumes['facebook.com'];
        } else if (hostname.includes('threads.com')) {
            currentDesiredVolume = siteVolumes['threads.com'];
        } else if (hostname.includes('instagram.com')) {
            currentDesiredVolume = siteVolumes['instagram.com'];
        } else {
            // If not on the listed websites, set a default or do nothing
            currentDesiredVolume = 0.2; // Or set to 0 (mute)
        }
        // console.log(`Current hostname: ${hostname}, Target volume: ${currentDesiredVolume}`);
    }

    /**
     * Attempts to set the volume of a single video element.
     * @param {HTMLVideoElement} video - The video element to set the volume for.
     */
    function setVideoVolume(video) {
        if (video.volume !== currentDesiredVolume) {
            video.volume = currentDesiredVolume;
            // console.log(`Set video volume to: ${currentDesiredVolume} (video id: ${video.id || 'N/A'})`);
        }
    }

    /**
     * Finds and sets the volume for all existing and newly added video elements.
     */
    function processVideos() {
        // Ensure the target volume is set based on the current domain first
        setCurrentDesiredVolume();

        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Attempt to set volume immediately after video metadata is loaded
            video.addEventListener('loadedmetadata', () => setVideoVolume(video), { once: true });
            // Set volume when the video starts playing (important for videos that play after user interaction)
            video.addEventListener('play', () => setVideoVolume(video));
            // Set volume immediately for videos that are already present
            setVideoVolume(video);
        });
    }

    // Use MutationObserver to listen for DOM changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                // If new nodes are added, re-check all videos
                processVideos();
            }
        });
    });

    // Observe changes in the entire document, including subtrees
    observer.observe(document.body, { childList: true, subtree: true });

    // On the first page load, run the volume setting once
    window.addEventListener('load', () => {
        setCurrentDesiredVolume(); // Ensure target volume is set on load event
        processVideos();
    });

    // For Single Page Application (SPA) characteristics, listen for URL changes (though MutationObserver and setInterval are more reliable)
    // This helps update volume when navigating internally within Facebook/Threads/Instagram
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // console.log('URL changed, re-processing video volumes');
            setCurrentDesiredVolume(); // Reset target volume on URL change
            processVideos();
        }
    }).observe(document, { subtree: true, childList: true });


    // Periodically check and set volume as an additional safeguard
    setInterval(processVideos, 1500); // Check and set volume every 1.5 seconds

    // Initial execution
    setCurrentDesiredVolume();
    processVideos();

})();