// ==UserScript==
// @name         不许腾讯视频缩小
// @namespace    https://ivanli.cc
// @version      0.1
// @description  腾讯视频网页播放器 禁止滚轮缩放
// @license      MIT
// @author       Ivan
// @match        https://v.qq.com/*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435767/%E4%B8%8D%E8%AE%B8%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/435767/%E4%B8%8D%E8%AE%B8%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const timer = setInterval(() => {
        const elem = document.querySelector('#tenvideo_player *');
        console.log(elem);
        if (!elem) {
            return;
        }
        console.log('done');
        elem.addEventListener('mousewheel', ev => ev.stopImmediatePropagation(), true);
        clearInterval(timer);
    }, 1000);
})();