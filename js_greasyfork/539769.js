// ==UserScript==
// @name         自动播放下一个视频
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  检测视频播放停止后自动播放下一个，并随机暂停3秒
// @author       你
// @match        https://study.szjspx.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539769/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/539769/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用于存储初始的视频元素和播放列表项
    let videoElement;
    let playlistItems = [];

    // 初始化脚本
    function initScript() {
        console.log("脚本已初始化，正在尝试获取视频元素");

        // 使用querySelector获取视频元素
        videoElement = document.querySelector("#myVideo");

        // 检查是否成功获取视频元素
        if (videoElement) {
            console.log("成功获取视频元素");

            // 获取播放列表中的所有项目
            playlistItems = Array.from(document.querySelectorAll('.playlist tbody tr.data'));
            console.log("播放列表中找到项目数量:", playlistItems.length);

            // 监听视频播放结束事件
            videoElement.addEventListener('ended', handleVideoEnded);

            // 监听视频暂停事件
            videoElement.addEventListener('pause', handleVideoPaused);

            // 监听视频播放事件
            videoElement.addEventListener('play', handleVideoPlayed);
        } else {
            console.log("未找到视频元素，请检查页面是否正确加载");
        }
    }

    // 处理视频播放结束
    function handleVideoEnded() {
        console.log("视频播放结束，正在查找播放列表中的下一个视频");

        // 输出视频状态信息
        console.log("视频当前播放时间:", videoElement.currentTime);
        console.log("视频总时长:", videoElement.duration);
        console.log("视频网络状态:", videoElement.networkState);
        console.log("视频就绪状态:", videoElement.readyState);

        // 找到当前正在播放的项目
        let currentIndex = -1;
        let foundCurrent = false;

        playlistItems.forEach((item, index) => {
            // 检查是否有 'cur' 类
            if (item.classList.contains('cur')) {
                currentIndex = index;
                foundCurrent = true;
                console.log("当前播放项目索引:", currentIndex);
            }
        });

        // 如果找到了当前播放项，并且存在下一个项目
        if (foundCurrent && currentIndex >= 0 && currentIndex < playlistItems.length - 1) {
            console.log("找到下一个项目，索引:", currentIndex + 1);

            // 随机等待3-5秒
            const randomDelay = Math.floor(Math.random() * 2000) + 3000; // 3000到5000毫秒之间的随机时间
            console.log(`随机等待 ${randomDelay / 1000} 秒后再跳转到下一个视频`);

            setTimeout(() => {
                // 获取下一个项目
                const nextItem = playlistItems[currentIndex + 1];

                // 触发点击事件来播放下一个视频
                if (nextItem) {
                    console.log("点击下一个项目，标题:", nextItem.querySelector('p.title').textContent);
                    nextItem.click();
                } else {
                    console.log("没有找到下一个项目");
                }
            }, randomDelay);
        } else {
            console.log("所有视频播放完毕或未找到当前播放项");
        }
    }

    // 处理视频暂停
    function handleVideoPaused() {
        console.log("视频已暂停");
        console.log("视频当前播放时间:", videoElement.currentTime);
        console.log("视频总时长:", videoElement.duration);
        console.log("视频网络状态:", videoElement.networkState);
        console.log("视频就绪状态:", videoElement.readyState);
    }

    // 处理视频播放
    function handleVideoPlayed() {
        console.log("视频已开始播放");

        // 设置播放速度为4倍速
        videoElement.playbackRate = 4;

        // 随机选择一个时间点暂停3秒
        const randomPauseTime = Math.floor(Math.random() * (videoElement.duration - 5)) + 5; // 随机选择一个时间点，确保至少5秒后暂停
        console.log(`视频将在 ${randomPauseTime} 秒后暂停3秒`);

        setTimeout(() => {
            videoElement.pause();
            console.log("视频暂停3秒");
            setTimeout(() => {
                videoElement.play();
                console.log("视频继续播放");
            }, 3000);
        }, randomPauseTime * 1000);
    }

    // 监听页面结构变化，特别是 <head> 部分的重新加载
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.target === document.head) {
                console.log("检测到 <head> 部分重新加载，重新初始化脚本");
                // 重新初始化脚本
                initScript();
            }
        });
    });

    // 配置观察器以观察 <head> 部分的变化
    const config = { childList: true, subtree: true };
    observer.observe(document.head, config);

    // 初始调用 initScript
    initScript();
})();