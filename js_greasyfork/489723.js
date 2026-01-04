// ==UserScript==
// @name         聚融E课程自动播放，不带答题功能，version1.0
// @namespace    http://tampermonkey.net/
// @version      2024-03-13
// @description  这是聚融E课程自动播放，不带答题功能，version1.0
// @author       You
// @match        http://www.geron-e.com/static/course/coursedetails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489723/%E8%81%9A%E8%9E%8DE%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%8C%E4%B8%8D%E5%B8%A6%E7%AD%94%E9%A2%98%E5%8A%9F%E8%83%BD%EF%BC%8Cversion10.user.js
// @updateURL https://update.greasyfork.org/scripts/489723/%E8%81%9A%E8%9E%8DE%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%8C%E4%B8%8D%E5%B8%A6%E7%AD%94%E9%A2%98%E5%8A%9F%E8%83%BD%EF%BC%8Cversion10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在页面加载完成后执行
    window.addEventListener('load', function() {
        // 直接调用检查函数
        checkFor100Percent();
    });

    // 检查是否100%并点击下一视频按钮的函数
    function checkFor100Percent() {
        // 开始一个循环
        var checkInterval = setInterval(function() {
            // 获取具有 id 为 "scheduleSvg" 的 div 元素
            var divElement = document.getElementById('scheduleSvg');

            // 如果找到了对应的元素
            if (divElement) {
                // 获取其中的文本内容
                var textContent = divElement.textContent.trim();

                // 检查文本内容是否为 "100%"
                if (textContent === "100%") {
                    // 获取具有 class 为 "switchBtn" 且 id 为 "nextVideo" 的 div 元素
                    var nextVideoButton = document.getElementById('nextVideo');

                    // 如果找到了对应的元素
                    if (nextVideoButton) {
                        // 触发点击事件
                        nextVideoButton.click();
                    }
                } else {
                    var videoElement = document.querySelector('.prism-big-play-btn');

                    // 如果找到了对应的元素并且显示为 block
                    if (videoElement && getComputedStyle(videoElement).display === "block") {
                        // 触发点击事件
                        videoElement.click();

                    }
                }
            }
        }, 3000); // 每隔 3000 毫秒（3 秒）检查一次
    }
})();