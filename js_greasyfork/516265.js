// ==UserScript==
// @name         Twitter Following Images Only
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show only image posts from followed accounts
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516265/Twitter%20Following%20Images%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/516265/Twitter%20Following%20Images%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filterTweets() {
        const tweets = document.querySelectorAll('[data-testid="tweet"]');
        tweets.forEach(tweet => {
            const hasImage = tweet.querySelector('img[alt="Image"]');
            const isFollowing = tweet.querySelector('[data-testid="socialContext"]');
            if (!hasImage || !isFollowing) {
                tweet.style.display = 'none';
            }
        });
    }

    // 페이지 로드 시 및 스크롤 시 필터 적용
    window.addEventListener('load', filterTweets);
    window.addEventListener('scroll', filterTweets);
})();