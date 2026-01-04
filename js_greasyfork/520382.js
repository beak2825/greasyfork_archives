// ==UserScript==
// @name         cactatv视频自动播放管理
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取视频时长，保证视频播放完成，检测视频是否暂停并继续播放
// @author       Ju5tu5
// @match        *://www.cactatv.cn/*
// @icon         https://www.cactatv.cn/images/front/user/logo1.png
// @grant        none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/520382/cactatv%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/520382/cactatv%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面上的视频元素加载
    function waitForVideoElement() {
        var videoElement = document.querySelector('video');
        if (videoElement) {
            initVideoManagement(videoElement);
        } else {
            // 如果视频元素还没加载，稍后再试
            setTimeout(waitForVideoElement, 500); // 每500毫秒检查一次
        }
    }

    // 初始化视频管理功能
    function initVideoManagement(videoElement) {
        // 获取视频时长
        var videoDuration = videoElement.duration;
        console.log('视频时长为：' + videoDuration + '秒');

        // 监听视频的暂停事件
        videoElement.addEventListener('pause', function() {
            if (!videoElement.ended) {
                // 如果视频暂停了且没有播放完毕，则继续播放
                setTimeout(function() {
                    videoElement.play();
                    console.log('视频已继续播放');
                }, 1000); // 延迟1秒后继续播放，避免与用户操作冲突
            }
        });

        // 定期检查视频播放状态，确保播放完成
        var checkInterval = setInterval(function() {
            if (videoElement.ended) {
                // 视频播放完成，清除定时器
                clearInterval(checkInterval);
                console.log('视频播放已完成');
            } else if (videoElement.paused && !videoElement.ended) {
                // 视频暂停了，尝试继续播放
                videoElement.play();
            }
        }, 5000); // 每5秒检查一次
    }

    // 开始等待视频元素加载
    waitForVideoElement();

})();
