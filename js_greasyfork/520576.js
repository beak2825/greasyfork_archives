// ==UserScript==
// @name         YouTuBe Remove More Videos Recommadation
// @name:zh-CN   YouTuBe 暂停视频，关闭更多视频
// @name:zh-TW   YouTuBe 暂停视频，关闭更多视频
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.3.1
// @description  Removes the pause overlay from embedded YouTube videos
// @description:zh-CN 暂停视频，关闭更多视频
// @description:zh-TW 暂停视频，关闭更多视频
// @author       rend,linpan
// @include      https://www.youtube*.com/embed/*
// @match        https://www.youtube.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/520576/YouTuBe%20%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91%EF%BC%8C%E5%85%B3%E9%97%AD%E6%9B%B4%E5%A4%9A%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/520576/YouTuBe%20%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91%EF%BC%8C%E5%85%B3%E9%97%AD%E6%9B%B4%E5%A4%9A%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        document.getElementsByClassName("ytp-pause-overlay ytp-scroll-min")[0]?.remove();
        document.getElementsByClassName("ytp-pause-overlay")[0]?.remove();
        document.getElementsByClassName("ytp-pause-overlay-container")[0]?.remove();
    }, 1000);
})();