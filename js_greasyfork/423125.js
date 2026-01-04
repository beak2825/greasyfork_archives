// ==UserScript==
// @name         YouTube autolike
// @namespace    https://github.com/blackstar0169/youtube-autolike-script
// @version      1.8
// @description  Auto-like YouTube video if you are subscribed to the author's channel. Or can set an option to like all videos regardless if you are subrscribed or not.
// @author       blackstar0169
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      CC-BY-NC-SA-4.0
// @require      https://update.greasyfork.org/scripts/521137/1505441/MonkeyConfigg.js
// @downloadURL https://update.greasyfork.org/scripts/423125/YouTube%20autolike.user.js
// @updateURL https://update.greasyfork.org/scripts/423125/YouTube%20autolike.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var watcher = null;
    const likeSelector = '.ytLikeButtonViewModelHost button';
    const subscribeSelector = '#subscribe-button button';

    // Config
    const config = new MonkeyConfig({
        title: 'YouTube autolike Configuration',
        menuCommand: true,
        params: {
            like_all_videos: {
                type: 'checkbox',
                default: false
            }
        }
    });

    function getObjectProperty(obj, keyStr) {
        const keys = keyStr.split('.');

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (obj && Array.isArray(obj)) {
                key = parseInt(key);
                if (isNaN(key) || typeof obj[key] === 'undefined') {
                    return undefined;
                }
            } else if (!obj || !obj.hasOwnProperty(key)) {
                return undefined;
            }
            obj = obj[key];
        }
        return obj;
    }

    // Check if the video is already liked
    function isLiked() {
        const btn = document.querySelector(likeSelector);
        if (btn === null) {
            console.error("[YouTube autolike] can not find like button !");
            return false;
        }
        return btn.getAttribute('aria-pressed') == 'true';
    }

    function isSubscribed() {
        const btn = document.querySelector(subscribeSelector);
        if (btn === null) {
            console.error("[YouTube autolike] can not find subscribe button !");
            return false;
        }
        return btn.classList.contains('yt-spec-button-shape-next--tonal') ||
            getObjectProperty(window.ytInitialPlayerResponse, 'annotations.0.playerAnnotationsExpandedRenderer.featuredChannel.subscribeButton.subscribeButtonRenderer.subscribed');
    }

    // Try to click on the like button. Return true un success
    function autoLike() {
        // If the user is subscribed to this channel
        const likeAllVideos = config.get('like_all_videos');
        if (isSubscribed() || likeAllVideos) {
            var likeBtn = document.querySelector(likeSelector);

            if (likeBtn && !isLiked()) {
                likeBtn.click();
                return true;
            }
        }

        return false;
    }

    // Watch untile the like button has or has been pressed
    function startWatcher() {
        if (watcher === null) {
            watcher = setInterval(function () {
                if (isLiked() || autoLike()) {
                    clearInterval(watcher);
                    watcher = null;
                }
            }, 1000);
        }
    }

    // Wait for the interface load event
    window.addEventListener("yt-navigate-finish", startWatcher, true);
})();
