// ==UserScript==
// @name         哔哩哔哩自动打开字幕 默认2倍速
// @namespace    http://tampermonkey.net/
// @version      2025.05.10
// @description  bilibili b站 哔哩哔哩 播放视频时自动打开网站字幕&默认2倍速
// @author       Jackyanoooox
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530396/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95%20%E9%BB%98%E8%AE%A42%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/530396/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95%20%E9%BB%98%E8%AE%A42%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let queryValue = '';
    // 定时检测URL是否发生变化
    let timer = setInterval(function() {
        // 获取URL中的查询字符串部分
        const queryString = window.location.search;
        // 解析查询字符串，将参数以对象的形式存储
        const params = new URLSearchParams(queryString);
        // 获取特定参数的值
        const value = params.get('p');
        if (queryValue !== value) {
            openSubtitle();
            queryValue = value;
        }
    }, 2000);

    window.addEventListener('unload', function(_event) {
        clearInterval(timer)
    });

    function openSubtitle(){
        setTimeout(() => { document.querySelector("video").playbackRate = 2;
                            document.querySelector('.bpx-player-ctrl-btn[aria-label="字幕"] .bpx-common-svg-icon').click();
                         }, 1000)
    }
    // Your code here...
})();