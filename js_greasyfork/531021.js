// ==UserScript==
// @name         自动快进10秒
// @namespace    yournamespace
// @version      1.0
// @description  自动将视频快进10秒（仅适用于大于1分钟的视频）
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531021/%E8%87%AA%E5%8A%A8%E5%BF%AB%E8%BF%9B10%E7%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/531021/%E8%87%AA%E5%8A%A8%E5%BF%AB%E8%BF%9B10%E7%A7%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找所有视频元素
        var videos = document.querySelectorAll('video');

        // 遍历视频元素
        videos.forEach(function(video) {
            // 获取视频时长
            var duration = video.duration;

            // 如果视频时长大于2分钟，则进行快进操作
            if (duration > 120) {
                // 监听视频播放事件
                video.addEventListener('play', function() {
                    // 设置定时器，在视频播放后自动快进30秒
                    setTimeout(function() {
                        video.currentTime += 10;
                    }, 100); // 延迟1秒执行快进操作，可以根据需要调整延迟时间
                });
            }
        });
    });
})();
