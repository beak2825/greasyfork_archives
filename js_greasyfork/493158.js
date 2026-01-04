// ==UserScript==
// @name         YouTube 自动暂停并关闭
// @namespace    https://lele1894.tk
// @version      0.5
// @description  页面加载时自动暂停 YouTube 视频，并在30秒后自动关闭页面。添加了一个停止按钮，可以手动停止倒计时。
// @author       Your Name
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493158/YouTube%20%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E5%B9%B6%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/493158/YouTube%20%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E5%B9%B6%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载后执行
    window.addEventListener('load', function() {
        // 等待 1 秒以确保视频已加载
        setTimeout(function() {
            // 获取视频播放器元素
            var player = document.querySelector('video');

            // 如果找到播放器，则暂停视频
            if(player) {
                player.pause();
            }

            // 添加停止按钮
            var stopButton = document.createElement('button');
            stopButton.textContent = '停止';
            stopButton.style.position = 'absolute';
            stopButton.style.top = '30px';
            stopButton.style.left = '50%';
            stopButton.style.transform = 'translate(-50%, -50%)';
            stopButton.style.padding = '8px 16px';
            stopButton.style.background = '#fff';
            stopButton.style.color = '#000';
            stopButton.style.border = 'none';
            stopButton.style.borderRadius = '5px';
            stopButton.style.cursor = 'pointer';
            stopButton.style.zIndex = '9999';
            document.body.appendChild(stopButton);

            // 添加关闭倒计时
            var countDown = 30; // 倒计时时间，单位：秒
            var countdownElement = document.createElement('div');
            countdownElement.textContent = '页面将在 ' + countDown + ' 秒后关闭';
            countdownElement.style.position = 'absolute';
            countdownElement.style.top = '70px';
            countdownElement.style.left = '50%';
            countdownElement.style.transform = 'translateX(-50%)';
            countdownElement.style.padding = '10px 20px';
            countdownElement.style.background = 'rgba(0, 0, 0, 0.7)';
            countdownElement.style.color = '#fff';
            countdownElement.style.borderRadius = '5px';
            countdownElement.style.fontFamily = 'Arial, sans-serif';
            countdownElement.style.fontSize = '16px';
            countdownElement.style.fontWeight = 'bold';
            countdownElement.style.textAlign = 'center';
            countdownElement.style.zIndex = '9999';
            document.body.appendChild(countdownElement);

            var countdownInterval;

            stopButton.addEventListener('click', function() {
                clearInterval(countdownInterval);
                countdownElement.textContent = '倒计时已停止';
                setTimeout(function() {
                    stopButton.style.display = 'none';
                    countdownElement.style.display = 'none';
                    setTimeout(function() {
                        stopButton.remove();
                        countdownElement.remove();
                    }, 1000); // 移除按钮和提示的延迟时间，单位：毫秒
                }, 3000); // 停止按钮和倒计时提示消失的延迟时间，单位：毫秒
            });

            countdownInterval = setInterval(function() {
                countdownElement.textContent = '页面将在 ' + countDown + ' 秒后关闭';
                countDown--;

                if (countDown < 0) {
                    clearInterval(countdownInterval);
                    window.close();
                }
            }, 1000);
        }, 1000);
    });
})();
