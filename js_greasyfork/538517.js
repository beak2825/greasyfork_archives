// ==UserScript==
// @name         bilibili 让推荐页点开的视频能正常返回
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击bilibili的视频推荐卡片、跳转到另一个视频后，可以在浏览器中回退到之前的视频
// @author       Ne0
// @match        *://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538517/bilibili%20%E8%AE%A9%E6%8E%A8%E8%8D%90%E9%A1%B5%E7%82%B9%E5%BC%80%E7%9A%84%E8%A7%86%E9%A2%91%E8%83%BD%E6%AD%A3%E5%B8%B8%E8%BF%94%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/538517/bilibili%20%E8%AE%A9%E6%8E%A8%E8%8D%90%E9%A1%B5%E7%82%B9%E5%BC%80%E7%9A%84%E8%A7%86%E9%A2%91%E8%83%BD%E6%AD%A3%E5%B8%B8%E8%BF%94%E5%9B%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(event) {
        const card = event.target.closest('.video-page-card-small');

        if (card) {
            event.preventDefault();
            event.stopPropagation();

            const linkElement = card.querySelector('a.video-awesome-img');

            if (linkElement && linkElement.href) {
                window.location.href = linkElement.href;
            }
        }
    }, true);

})();