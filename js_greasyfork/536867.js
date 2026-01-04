// ==UserScript==
// @name         Hide YouTube only members videos
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides videos marked as only for members
// @author       Chinchill
// @icon         https://www.youtube.com/favicon.ico
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536867/Hide%20YouTube%20only%20members%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/536867/Hide%20YouTube%20only%20members%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideMembersOnlyVideos() {
        const badges = document.querySelectorAll('.badge-style-type-members-only');
        badges.forEach(badge => {
            const video = badge.closest('ytd-grid-video-renderer, ytd-video-renderer, ytd-rich-item-renderer');
            if (video) {
                video.style.display = 'none';
            }
        });
    }

    hideMembersOnlyVideos();

    const observer = new MutationObserver(() => hideMembersOnlyVideos());
    observer.observe(document.body, { childList: true, subtree: true });
})();
