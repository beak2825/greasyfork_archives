// ==UserScript==
// @name         Hide YouTube Shorts By Likes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide YouTube Shorts videos with less than a certain number of likes.
// @author       ozuromo
// @match        https://www.youtube.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475325/Hide%20YouTube%20Shorts%20By%20Likes.user.js
// @updateURL https://update.greasyfork.org/scripts/475325/Hide%20YouTube%20Shorts%20By%20Likes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const likesToSkip = 10000;

    // Function to hide YouTube Shorts
    function hideShortVideos() {
        var videoElements = document.querySelectorAll('ytd-reel-video-renderer');

        for (var i = 0; i < videoElements.length; i++) {
            var videoElement = videoElements[i];

            if (!videoElement.isActive) { continue; }

            var likes = videoElement.data.reelPlayerOverlayRenderer.likeButton.likeButtonRenderer.likeCount;

            console.log(likes);

            if (likes >= likesToSkip) { continue; }

            videoElements[i+1].scrollIntoView();
            videoElement.remove();

            console.log('Short Skipped');

            break;
        }
    }


    new MutationObserver(() => setTimeout(hideShortVideos, 50)).observe(
        document.querySelector('title'),
        { childList: true }
    );

})();
