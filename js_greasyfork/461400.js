// ==UserScript==
// @name         双击返回顶部
// @namespace    [url]http://tampermonkey.net/[/url]
// @version      0.2
// @description  在所有页面空白处双击左键，自动返回网页顶部。
// @license MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461400/%E5%8F%8C%E5%87%BB%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461400/%E5%8F%8C%E5%87%BB%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 定义一个变量用来记录上次点击的时间
    var lastClickTime = 0;
 
    // 监听页面的点击事件
    document.addEventListener('click', function(e) {
        // 如果点击的目标元素不是文本或图片，即为空白处
        if (e.target.nodeName !== 'TEXT' && e.target.nodeName !== 'IMG') {
            // 获取当前点击的时间
            var currentTime = new Date().getTime();
            // 如果当前点击和上次点击的时间间隔小于300毫秒，即为双击
            if (currentTime - lastClickTime < 300) {
                // 滚动到页面顶部
                window.scrollTo(0, 0);
            }
            // 更新上次点击的时间为当前时间
            lastClickTime = currentTime;
        }
    });
})();