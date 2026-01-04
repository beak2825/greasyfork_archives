// ==UserScript==
// @name         移除广告Delayed Remove Support ArtStation Tags
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delay removal of specific tags from ArtStation pages
// @author       You
// @match        *://*.artstation.com/*
// @icon         https://www.artstation.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541533/%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8ADelayed%20Remove%20Support%20ArtStation%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/541533/%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8ADelayed%20Remove%20Support%20ArtStation%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 setTimeout 延迟执行
    window.addEventListener('load', function() {
        setTimeout(function() {
            const supportTags = document.querySelectorAll('support-artstation');
            supportTags.forEach(tag => tag.remove()); // 完全删除这些标签
        }, 2000); // 延迟 2000 毫秒（2 秒）
    });
})();