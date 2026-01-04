// ==UserScript==
// @name         Youtube Shorts Garbage Remover
// @namespace    http://tampermonkey.net/
// @version      1.66
// @description  Hides elements based on like count conditions. Removes the trash tier garbage youtube shorts shovelled down your throat.
// @author       psyda#0001
// @match        *://www.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465101/Youtube%20Shorts%20Garbage%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/465101/Youtube%20Shorts%20Garbage%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyVideos() {
        var videos = document.querySelectorAll('ytd-reel-video-renderer[is-active]');
        videos.forEach(function(video) {
            var titleContainer = video.querySelector('h2.title');
            var likes = video.querySelector('ytd-toggle-button-renderer#like-button span[role="text"]');

            if (titleContainer && likes) {
                var titleText = titleContainer.textContent.trim();
                var likeText = likes.textContent.trim();

                if (titleText !== '' && likeText.match(/k|m|b/i)) {
                    likes.style.color = 'green'; // Make the like count text green
                    if ((likeText == "like") || (likeText == "Like")){
                        video.remove(); // Remove the video if it doesn't meet the criteria
                    }
                } else {
                    video.remove(); // Remove the video if it doesn't meet the criteria
                }
            }
        });
    }

    // Check every 1000 milliseconds (1 second)
    setInterval(modifyVideos, 1000);
})();