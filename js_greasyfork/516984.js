// ==UserScript==
// @name         安大雨课堂
// @namespace    http://tampermonkey.net/
// @version      2024-11-11.3
// @description  自动播放，视频跳转，跳过作业
// @author       BIGMOUSE
// @match        https://ahuyjs.yuketang.cn/pro/lms/*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516984/%E5%AE%89%E5%A4%A7%E9%9B%A8%E8%AF%BE%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/516984/%E5%AE%89%E5%A4%A7%E9%9B%A8%E8%AF%BE%E5%A0%82.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
    function autoPlayVideo() {
        // 选择视频元素
        var video = document.querySelector('video');
        const videoElement = document.querySelector('video.xt_video_player'); // 根据雨课堂视频元素的类名
        var currentUrl = window.location.href;
        console.log("当前页面网址: " + currentUrl);
        var videoIdMatch = currentUrl.match(/.*?video\/(\d{8})/);
        const baseUrl = currentUrl.match(/^(https:\/\/.+?\/pro\/lms\/.+?\/video\/)/)[0];
        var videoId = videoIdMatch[1];
        console.log("视频 ID: " + videoId);
        var next_url_num = Number(videoId)+1;
        var next_url = baseUrl+ next_url_num;

        // 如果视频元素存在且未播放，则触发播放
            if (videoElement && videoElement.paused) {
                console.log("存在");
                videoElement.play();
                console.log("视频正在自动播放...");

                // 监听视频播放完成事件
                videoElement.addEventListener('ended', function() {
                    console.log("视频播放完成！");
                    window.location.href = next_url;

                });
            }
        else if(video == null){
            window.location.href = next_url;
        }
        }

    // 使用 MutationObserver 监听页面元素变化，以在视频加载时触发播放
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            autoPlayVideo(); // 每次检测到变动都尝试自动播放
        });
    });

    // 设置观察选项
    observer.observe(document.body, { childList: true, subtree: true });

    // 初次加载时立即尝试播放
    setTimeout(() => {
               autoPlayVideo();
    },2000);
},6000)();