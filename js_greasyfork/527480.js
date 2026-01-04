// ==UserScript==
// @name         哔哩哔哩直播时间点复制
// @namespace    http://tampermonkey.net/
// @version      2025-02-20
// @description  点击时间即复制
// @author       You
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527480/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E6%97%B6%E9%97%B4%E7%82%B9%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/527480/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E6%97%B6%E9%97%B4%E7%82%B9%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 感谢：https://juejin.cn/post/7162150293335965732
    document.getElementById('live-player').addEventListener('click', function(event) {
        // 检查点击的目标是否是特定的子元素
        if (event.target.matches('.time')) {
            try {
                navigator.clipboard.writeText(event.target.innerText);
                console.log('文本已复制');
            } catch (err) {
                console.error('复制失败:', err);
            }
        }
    });

})();