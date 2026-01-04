// ==UserScript==
// @name         Instagram Greyscale Filter (Videos Only)
// @name:zh-TW   Instagram 灰階 專注使用 (只限影片)
// @namespace    your-namespace
// @version      1.0
// @description        Applies a greyscale filter to Instagram (Videos Only)
// @description:zh-tw  Applies a greyscale filter to Instagram (Videos Only)
// @author       ICHx, ChatGPT
// @match        https://www.instagram.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479917/Instagram%20Greyscale%20Filter%20%28Videos%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479917/Instagram%20Greyscale%20Filter%20%28Videos%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply the greyscale filter to a video element
    function applyGreyscaleFilterToVideo(videoElement) {
        videoElement.style.filter = 'grayscale(100%)';
        videoElement.style.webkitFilter = 'grayscale(100%)';
    }

    // Function to check if an element is a video
    function isVideoElement(element) {
        return element.tagName.toLowerCase() === 'video';
    }

    // Function to handle mutations in the document
    function handleMutations(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const target = mutation.target;
                if (isVideoElement(target)) {
                    applyGreyscaleFilterToVideo(target);
                }
            } else if (mutation.type === 'childList') {
                for (let addedNode of mutation.addedNodes) {
                    if (isVideoElement(addedNode)) {
                        applyGreyscaleFilterToVideo(addedNode);
                    }
                }
            }
        }
    }

    // Create a new MutationObserver instance
    const observer = new MutationObserver(handleMutations);

    // Start observing changes in the body element
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

    // Apply the filter to existing video elements
    const videos = document.getElementsByTagName('video');
    for (let video of videos) {
        applyGreyscaleFilterToVideo(video);
    }
})();