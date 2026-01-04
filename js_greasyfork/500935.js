// ==UserScript==
// @name         哔哩哔哩视频页面去除固定顶栏
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  当前哔哩哔哩顶栏为固定显示，该脚本使哔哩哔哩顶栏变为不固定显示，以此增加网页可展示的内容。以及配合其他脚本的播放器定位功能。
// @author       RC
// @match        https://*.bilibili.com/video/*
// @match        https://*.bilibili.com/list/watchlater*
// @match        https://www.bilibili.com/bangumi/*
// @grant        none
// @icon         https://www.bilibili.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500935/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E9%A1%B5%E9%9D%A2%E5%8E%BB%E9%99%A4%E5%9B%BA%E5%AE%9A%E9%A1%B6%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/500935/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E9%A1%B5%E9%9D%A2%E5%8E%BB%E9%99%A4%E5%9B%BA%E5%AE%9A%E9%A1%B6%E6%A0%8F.meta.js
// ==/UserScript==

'use strict';
(function () {
    // 等待页面加载完成
    window.addEventListener('load', function () {
        setTimeout(function () {
            let style = document.createElement('style');
            style.innerHTML = `
                .bili-header__bar {
                    position: relative  !important;
                }
            `;
            document.body.appendChild(style);
        }, 1000); // 延迟时间
    });
})();
