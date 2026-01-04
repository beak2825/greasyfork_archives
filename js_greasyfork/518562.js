// ==UserScript==
// @name         自动全屏
// @name:en      Automatic full screen
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description:zh-CN  自动实现B站和YouTube网页视频的全屏观看功能。
// @description  Automatically realize the full-screen viewing function of Bilibili and YouTube web videos.
// @author       屑屑
// @icon         https://s2.loli.net/2024/04/28/WEkjH9iy51z63Of.jpg
// @license      MIT
// @match        *://www.youtube.com/watch*
// @match        *://www.bilibili.com/video/*
// @downloadURL https://update.greasyfork.org/scripts/518562/%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/518562/%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择器
    const youtubeSelector = "button.ytp-fullscreen-button.ytp-button";
    const bilibiliSelector = "#bilibili-player .bpx-player-ctrl-web";

    // 判断当前页面是 YouTube 还是 Bilibili
    const isYoutube = window.location.host.includes('youtube.com');
    const isBilibili = window.location.host.includes('bilibili.com');

    // 等待视频加载完成并开始播放
    function waitForVideoToPlay() {
        const video = document.querySelector("video");
        if (video && video.readyState === 4 && !video.paused) {
            console.log("视频已加载并开始播放");
            return true;
        }
        console.log("等待视频加载并开始播放...");
        return false;
    }

    // 保存原有的窗口尺寸
    let originalWidth, originalHeight;
    function saveWindowSize() {
        const video = document.querySelector("video");
        if (video) {
            originalWidth = video.offsetWidth;
            originalHeight = video.offsetHeight;
            console.log(`保存原有尺寸：宽度 = ${originalWidth}, 高度 = ${originalHeight}`);
        } else {
            console.log("未找到视频元素，无法保存尺寸");
        }
    }

    // 点击全屏按钮
    function clickFullscreenButton() {
        if (isYoutube) {
            const fullscreenButton = document.querySelector(youtubeSelector);
            if (fullscreenButton) {
                fullscreenButton.click();
                console.log("YouTube 全屏按钮已点击");
            } else {
                console.log("未找到 YouTube 全屏按钮");
            }
        } else if (isBilibili) {
            const fullscreenButton = document.querySelector(bilibiliSelector);
            if (fullscreenButton) {
                fullscreenButton.click();
                console.log("Bilibili 全屏按钮已点击");
            } else {
                console.log("未找到 Bilibili 全屏按钮");
            }
        } else {
            console.log("未识别到支持的平台");
        }
    }

    // 检查窗口尺寸是否变化
    function hasWindowSizeChanged() {
        const video = document.querySelector("video");
        if (video) {
            const hasChanged = video.offsetWidth !== originalWidth || video.offsetHeight !== originalHeight;
            if (hasChanged) {
                console.log(`窗口尺寸已变化：新宽度 = ${video.offsetWidth}, 新高度 = ${video.offsetHeight}`);
            } else {
                console.log("窗口尺寸未变化");
            }
            return hasChanged;
        }
        console.log("无法获取视频尺寸，未检测到尺寸变化");
        return false;
    }

    // 主逻辑：等待视频播放并执行操作
    function main() {
        if (waitForVideoToPlay()) {
            saveWindowSize(); // 保存原始尺寸
            clickFullscreenButton(); // 尝试点击全屏按钮

            // 等待一定时间以确保尺寸变化
            setTimeout(() => {
                if (!hasWindowSizeChanged()) {
                    // 如果没有变化，执行请求全屏
                    console.log("尝试通过requestFullscreen将视频全屏");
                    document.querySelector("video").requestFullscreen();
                }
                // 脚本结束
                console.log("脚本执行完毕");
            }, 1000); // 等待 1 秒钟以检测尺寸变化
        } else {
            // 继续等待视频开始播放
            console.log("视频尚未播放，继续等待...");
            setTimeout(main, 500);
        }
    }

    // 启动脚本
    console.log("脚本启动...");
    main();

})();
