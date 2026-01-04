// ==UserScript==
// @name         [哔哩哔哩]隐藏视频结束时的“充电鸣谢”
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  隐藏B站视频结束时5s的“充电鸣谢”页面。
// @author       iSwfe
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @run-at       document-end
// @require      https://cdn.staticfile.org/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440607/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%5D%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91%E7%BB%93%E6%9D%9F%E6%97%B6%E7%9A%84%E2%80%9C%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/440607/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%5D%E9%9A%90%E8%97%8F%E8%A7%86%E9%A2%91%E7%BB%93%E6%9D%9F%E6%97%B6%E7%9A%84%E2%80%9C%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    // 定义方法：如何找到视频元素
    var findVideoFunc = () => $('.bpx-player-video-wrap > video');

    // 定义方法：如何找到充电面板
    var findPanelFunc = () => $('.bpx-player-ending-wrap');

    // 定义方法：如何隐藏充电面板
    //var hiddenPanelFunc = (panel) => panel.setAttribute('data-select', 0);
    var hiddenPanelFunc = (panel) => {
        panel.style.display = 'none';
    };


    // 工具方法：在指定事件内定时调用函数
    var setIntervalForTimeOut = (handler, intervalTime, timeOut) => {
        var id = setInterval(handler, intervalTime);
        setTimeout(() => clearInterval(id), timeOut);
    };


    var main = () => {
        // 查找视频元素
        var video = findVideoFunc();
        console.log('got video:', video);

        // 查找隐藏充电面板
        var panel = findPanelFunc();
        console.log('got panel:', panel);

        // 设定视频结束事件：执行隐藏充电面板功能。
        video.onended = () => {
            // 在3秒内，每100毫秒会执行一次。
            //setIntervalForTimeOut(() => hiddenPanelFunc(panel), 50, 3 * 1000);
            console.log('onended: start.');
            var id = setInterval(hiddenPanelFunc, 100);
            console.log('id:', id);
        };
        video.onended = () => {
            panel.style.display = 'none';
        };
        console.log('【隐藏充电面板】功能注入完成。');
    };

    window.onhashchange = window.onload = () => {
        // 页面加载完成，1S后开始注入
        setTimeout(main, 1 * 1000);
    };
})();