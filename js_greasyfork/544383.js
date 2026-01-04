// ==UserScript==
// @name         湖北高校教师岗前培训
// @version      0.5
// @description  自动向后播放列表中的视频。
// @author       elaine(origin),mk13
// @match        http://hubeigs.study.gspxonline.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1500835
// @downloadURL https://update.greasyfork.org/scripts/544383/%E6%B9%96%E5%8C%97%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/544383/%E6%B9%96%E5%8C%97%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentVideoIndex = 0; // 当前视频索引
    var videoList = []; // 用来保存课程视频列表项

    // 初始化获取所有未完成的课程项
    const initializeVideoList = function() {
        // 获取所有没有完成的课程项（未完成的课程状态为 'half'，未学习为‘round’）
        videoList = Array.from(document.querySelectorAll('li .learn-status'))
                        .filter(item => item.classList.contains('half') || item.classList.contains('round')) // 只选择未完成或者学习中的课程
                        .map(item => item.closest('li')); // 获取课程列表项
        //
        //videoList = Array.from(document.querySelectorAll('li'))
            //.filter(row => row.textContent.includes('learn-status'));
        if (videoList.length > 0){
            console.log('未完成课程:', videoList.length, '项');
            const firstVideo = videoList[0];
            firstVideo.click();
            setTimeout(playVideo, 3000);
        }
        else {
            console.log('所有视频已学习');
            return
        };
    };

    // 每分钟检测视频是否正在播放，不是则刷新页面
    const CheckVideo = function() {
        if (videoList.length == 0){
            console.log('视频已播放完毕');
            return
        };

        const video = document.querySelector('video');
        if (!video) {
            console.log('未找到视频，稍后重试');
            setTimeout(CheckVideo, 2000); // 重试
            return;
        }
        else if (video.paused) {
            console.log("视频异常暂停，5秒后刷新页面.");
            setTimeout(location.reload(),5000);
            } else {
                console.log("视频正在播放.");
            }
        setTimeout(CheckVideo,60000);
        //console.log('60秒后检测');
    };

    // 播放当前课程视频
    const playVideo = function() {
        // 查找当前视频元素
        const video = document.querySelector('video');
        if (!video) {
            console.log('未找到视频元素，稍后重试...');
            setTimeout(playVideo, 2000); // 重试
            return;
        }

        // 设置倍速播放
        video.playbackRate = 1;
        video.play();
        console.log('视频已开始播放，设置为',video.playbackRate,'倍速');

        // 当视频播放结束时，自动切换到下一个视频
        video.addEventListener('ended', () => {
            console.log('当前视频播放完毕，准备切换到下一个视频');
            currentVideoIndex++;

            // 检查是否还有未播放的下一个视频
            if (currentVideoIndex < videoList.length) {
                const nextVideo = videoList[currentVideoIndex];

                if (nextVideo) {
                    console.log('切换到下一个视频：', nextVideo.title);
                    nextVideo.click(); // 模拟点击下一个课程
                    // 给页面一些时间加载下一个视频
                    setTimeout(playVideo, 3000); // 3秒后播放新视频
                }
            } else {
                console.log('所有视频播放完毕');
            }
        });
    };

    // 初始化课程列表并开始播放
    setTimeout(() => {
        initializeVideoList();
        //playVideo(); // 开始播放第一个视频
        setTimeout(CheckVideo, 10000); // 每分钟检测一次视频是否正在播放
    }, 3000); // 页面加载后3秒开始播放

})();
