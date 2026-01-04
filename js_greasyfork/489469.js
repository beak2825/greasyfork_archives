// ==UserScript==
// @name         倍速播放
// @namespace    http://your.namespace.com
// @version      1.0
// @description  使用 - 和 = 键来控制视频倍速，并显示当前倍速
// @author       Your Name
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489469/%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489469/%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var videoElement = document.querySelector('video');

        if (videoElement) {
            var currentSpeedIndex = 3; // 初始倍速为 1.0x
            var playbackSpeedStep = 0.25; // 每次增减的倍速值

            // 创建一个提示框元素
            var speedInfo = document.createElement('div');
            speedInfo.style.position = 'absolute';
            speedInfo.style.top = '50%';
            speedInfo.style.left = '50%';
            speedInfo.style.transform = 'translate(-50%, -50%)';
            speedInfo.style.background = 'rgba(0, 0, 0, 0.7)';
            speedInfo.style.color = 'white';
            speedInfo.style.padding = '5px';
            speedInfo.style.borderRadius = '5px';
            speedInfo.style.zIndex = '9999';
            speedInfo.style.display = 'none'; // 初始隐藏提示框
            videoElement.parentElement.appendChild(speedInfo);

            // 显示提示框并设置定时隐藏
            function showSpeedInfo() {
                speedInfo.style.display = 'block';
                setTimeout(function() {
                    speedInfo.style.display = 'none';
                }, 2000); // 2秒后隐藏提示框
            }

            function updateSpeedInfo() {
                var newSpeed = 0.25 + currentSpeedIndex * playbackSpeedStep;
                if (newSpeed > 8.0) {
                    newSpeed = 8.0; // 最大限制为8倍
                }
                videoElement.playbackRate = newSpeed.toFixed(2); // 保留两位小数

                // 更新提示框文本
                speedInfo.textContent = newSpeed.toFixed(2) + 'x';

                // 显示提示框
                showSpeedInfo();
            }

            document.addEventListener('keydown', function(event) {
                if (event.key === '-' || event.key === '=') {
                    // - 或 = 键按下，减小或增加倍速
                    currentSpeedIndex += (event.key === '-') ? -1 : 1;
                    // 限制倍速值在合法范围内（0.25 到 8.0）
                    currentSpeedIndex = Math.max(0, Math.min(currentSpeedIndex, 32));

                    // 更新倍速和提示框
                    updateSpeedInfo();
                }
            });

            // 初始化提示框
            updateSpeedInfo();
        }
    });
})();
