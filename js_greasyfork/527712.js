// ==UserScript==
// @name         B站稍后再看直接打开
// @namespace    qtqz
// @version      0.3
// @description  不用再访问奇怪的定制版播放页。通过拦截点击事件实现，兼容性好
// @author       qtqz
// @match        https://www.bilibili.com/watchlater/list*
// @icon         https://www.bilibili.com/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527712/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/527712/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

// 2025-02-08 create
(function() {
    'use strict';

    document.addEventListener('click', function (e) {
        if (!e.target.closest('a')?.href.includes('bilibili.com/list/watchlater/?bvid=')) return;
        // 阻止默认行为，即禁止打开链接 //默认行为不冒泡
        e.preventDefault();

        // 获取链接地址
        const href = e.target.closest('a').getAttribute('href');

        // 提取链接地址中的bvid参数
        const urlParams = new URLSearchParams(href.split('?')[1]);
        const bvid = urlParams.get('bvid');

        // 在新标签中打开新页面 https://www.bilibili.com/video/${bvid}/
        window.open(`https://www.bilibili.com/video/${bvid}/`, '_blank');
    })
})();