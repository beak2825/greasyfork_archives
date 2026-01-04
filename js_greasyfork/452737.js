// ==UserScript==
// @name         Facebook Video Eradicator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove videos from Facebook feed
// @author       foo
// @match        https://www.facebook.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452737/Facebook%20Video%20Eradicator.user.js
// @updateURL https://update.greasyfork.org/scripts/452737/Facebook%20Video%20Eradicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const feedSelector = '#ssrb_feed_start + div';
    const videoPostsSelector = `${feedSelector} > div:has(video)`;

    setInterval(() => {
        const videoPosts = document.querySelectorAll(videoPostsSelector);
        for (var i = 0; i < videoPosts.length; i++) {
            videoPosts[i].innerHTML = '';
        }
    }, 500);
})();
