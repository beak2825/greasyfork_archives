// ==UserScript==
// @name         AutoLike YouTube Videos
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically likes YouTube videos
// @author       Fri
// @match        https://www.youtube.com/watch*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480633/AutoLike%20YouTube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/480633/AutoLike%20YouTube%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lastUrl = location.href;
    var observer;
    var likeAttempted = false;

    function clickLikeButton() {
        let likeButton = document.querySelector('.YtLikeButtonViewModelHost button');
        let dislikeButton = document.querySelector('.YtDislikeButtonViewModelHost button');

        if (!likeButton || !dislikeButton) {
            console.log("Buttons not found. Waiting for buttons to load.");
            return;
        }

        if (dislikeButton.getAttribute('aria-pressed') === 'true') {
            console.log("Dislike button is already clicked. Aborting like action.");
            return;
        }

        if (likeButton.getAttribute('aria-pressed') === 'false' && !likeAttempted) {
            likeButton.click();
            console.log("Like button clicked");
            likeAttempted = true;
        } else if (likeButton.getAttribute('aria-pressed') === 'true') {
            console.log("Like button already liked");
            likeAttempted = true;
        }
    }

    function checkForNewVideo() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            likeAttempted = false;
            observer.disconnect();
            setTimeout(() => {
                observer.observe(document.body, { childList: true, subtree: true });
                clickLikeButton();
            }, 1000);
        }
    }

    observer = new MutationObserver(function(mutations, obs) {
        if (!likeAttempted) {
            clickLikeButton();
        }
    });

    setInterval(checkForNewVideo, 1000);
    observer.observe(document.body, { childList: true, subtree: true });
})();
