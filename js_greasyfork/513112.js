// ==UserScript==
// @name         视频定时暂停（支持B站和Youtube）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用户可动态设定B站或YouTube视频的停止时间（分钟和秒），自动暂停视频，只暂停一次
// @author       OldHunter
// @match        https://www.bilibili.com/video/*
// @match        https://www.youtube.com/watch*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513112/%E8%A7%86%E9%A2%91%E5%AE%9A%E6%97%B6%E6%9A%82%E5%81%9C%EF%BC%88%E6%94%AF%E6%8C%81B%E7%AB%99%E5%92%8CYoutube%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513112/%E8%A7%86%E9%A2%91%E5%AE%9A%E6%97%B6%E6%9A%82%E5%81%9C%EF%BC%88%E6%94%AF%E6%8C%81B%E7%AB%99%E5%92%8CYoutube%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测当前网站是B站还是YouTube，返回对应的视频元素
    function getVideoElement() {
        if (window.location.host.includes('bilibili.com')) {
            return document.querySelector('video');
        } else if (window.location.host.includes('youtube.com')) {
            return document.querySelector('video');
        }
        return null;
    }

    // 创建用户输入的分钟和秒数输入框
    function createInput(labelText) {
        const label = document.createElement("label");
        label.innerText = labelText;
        const input = document.createElement("input");
        input.type = "number";
        input.style.marginRight = "10px";
        label.appendChild(input);
        return { label, input };
    }

    // 弹出自定义输入框，让用户输入分钟和秒
    function getUserTimeInput(callback) {
        const dialog = document.createElement("div");
        dialog.style.position = "fixed";
        dialog.style.top = "50%";
        dialog.style.left = "50%";
        dialog.style.transform = "translate(-50%, -50%)";
        dialog.style.padding = "20px";
        dialog.style.backgroundColor = "white";
        dialog.style.border = "1px solid black";
        dialog.style.zIndex = "9999";

        // 创建两个输入框：分钟和秒
        const minutesInput = createInput("请输入分钟：");
        const secondsInput = createInput("请输入秒：");

        // 创建确认按钮
        const submitButton = document.createElement("button");
        submitButton.innerText = "确定";
        submitButton.onclick = function() {
            const minutes = parseInt(minutesInput.input.value, 10) || 0;
            const seconds = parseInt(secondsInput.input.value, 10) || 0;
            const totalTime = (minutes * 60) + seconds;
            document.body.removeChild(dialog);  // 移除对话框
            callback(totalTime);  // 返回用户输入的总秒数
        };

        // 将输入框和按钮加入到对话框中
        dialog.appendChild(minutesInput.label);
        dialog.appendChild(secondsInput.label);
        dialog.appendChild(submitButton);
        document.body.appendChild(dialog);
    }

    // 检查视频是否加载完毕
    function checkVideoReady() {
        const video = getVideoElement();
        if (video && video.readyState >= 3) { // readyState 3表示可以开始播放

            // 弹出用户输入框，获取停止时间
            getUserTimeInput(function(stopTime) {
                let pausedOnce = false;  // 记录是否已经暂停过

                if (stopTime > 0) {
                    // 监听视频播放进度，只暂停一次
                    video.addEventListener('timeupdate', function() {
                        if (!pausedOnce && video.currentTime >= stopTime) {
                            video.pause();
                            pausedOnce = true;  // 标记为已经暂停
                            alert(`视频已播放到设定的${Math.floor(stopTime / 60)}分${stopTime % 60}秒，自动暂停。`);
                        }
                    });
                }
            });

        } else {
            // 如果视频还未加载，继续检查
            setTimeout(checkVideoReady, 500);
        }
    }

    // 初始化脚本
    checkVideoReady();
})();
