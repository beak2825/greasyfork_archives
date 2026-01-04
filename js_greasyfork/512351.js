// ==UserScript==
// @name         新乡教师发展云中心自动播放
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动播放视频
// @author       EdisonEdz
// @match        https://xb.fteacher.com.cn/*
// @match        https://xx.fteacher.com.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512351/%E6%96%B0%E4%B9%A1%E6%95%99%E5%B8%88%E5%8F%91%E5%B1%95%E4%BA%91%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/512351/%E6%96%B0%E4%B9%A1%E6%95%99%E5%B8%88%E5%8F%91%E5%B1%95%E4%BA%91%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义轮询函数，用于等待“上次观看至”按钮出现
    function waitForLastWatchButton() {
        const checkInterval = setInterval(() => {

            // 使用选择器查找“上次观看至”按钮（根据实际 DOM 结构调整选择器）
            const lastWatchButton = Array.from(document.querySelectorAll('.ant-btn.ant-btn-primary')).find(
                button => button.textContent.includes('继续观看')
            );

            if (lastWatchButton) {
                // 找到按钮后，自动触发点击
                lastWatchButton.click();
                console.log("已自动点击上次观看至按钮");
                const videoElement = document.querySelector('video');
                videoElement.muted = true;
                console.log("视频已静音");
            }

            // 自动播放视频
            waitForPlayer(); // 调用播放器播放函数
        }, 1000); // 每隔 1 秒检查一次
    }

    // 定义轮询函数，用于等待 aliplayer 初始化完成
    function waitForPlayer() {
        const checkInterval = setInterval(() => {
            // 尝试获取 aliplayer 对象
            if (typeof aliplayer !== 'undefined' && aliplayer) {
                // 找到播放器后，清除定时器并开始播放
                aliplayer.play();
                console.log("播放器已找到并开始播放");
                videoElement.muted = true;
                console.log("视频已静音");
            }

            // 也可以尝试通过 DOM 获取视频元素
            const videoElement = document.querySelector('video');
            if (videoElement && videoElement.paused) {
                videoElement.play();
                console.log("通过 DOM 找到视频元素并开始播放");
                videoElement.muted = true;
                console.log("视频已静音");

            }
        }, 1000); // 每隔 1 秒检查一次
    }

    // 定义全局点击开学学习函数，只执行一次
    function startLearn() {
        // 查找带有多个 class 的按钮，并确保其包含“开始学习”文本
        const playButton = document.querySelector("#root > div > div.layoutBox_Nyu_m > div.mainContent_WzEw1 > div > div > div.course_title.cardBox > div > div.inner > div.video-desc > div.handles > div > button");

        console.log(playButton);
        if (playButton) {
            playButton.click();
            console.log("已自动点击开始学习");
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', function () {
        waitForLastWatchButton(); // 启动轮询，等待“上次观看至”按钮出现
    });

    // 页面加载完成点击开始学习
    window.addEventListener('load', function () {
        setTimeout(() => {
            console.log("页面加载完成，点击自动学习");
            startLearn();
        }, 1000);
    }, { once: true }); // 确保只执行一次


})();

