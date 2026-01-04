// ==UserScript==
// @name         国家开放大学实验学院/全网办/乡村振兴学院【15倍】自动刷视频（不答题不考试，答题/考试找群主处理）
// @namespace    http://xczxzdbf.moodle.qwbx.ouchn.cn
// @version      1.0.0
// @description  国家开放大学实验学院/全网办/乡村振兴学院自动播放视频并模拟观看行为，自动点击播放按钮【做题进群：756253160联系群主】
// @author       Your Name
// @match        *://xczxzdbf.moodle.qwbx.ouchn.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539368/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AD%A6%E9%99%A2%E5%85%A8%E7%BD%91%E5%8A%9E%E4%B9%A1%E6%9D%91%E6%8C%AF%E5%85%B4%E5%AD%A6%E9%99%A2%E3%80%9015%E5%80%8D%E3%80%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%88%E4%B8%8D%E7%AD%94%E9%A2%98%E4%B8%8D%E8%80%83%E8%AF%95%EF%BC%8C%E7%AD%94%E9%A2%98%E8%80%83%E8%AF%95%E6%89%BE%E7%BE%A4%E4%B8%BB%E5%A4%84%E7%90%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539368/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AD%A6%E9%99%A2%E5%85%A8%E7%BD%91%E5%8A%9E%E4%B9%A1%E6%9D%91%E6%8C%AF%E5%85%B4%E5%AD%A6%E9%99%A2%E3%80%9015%E5%80%8D%E3%80%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%88%E4%B8%8D%E7%AD%94%E9%A2%98%E4%B8%8D%E8%80%83%E8%AF%95%EF%BC%8C%E7%AD%94%E9%A2%98%E8%80%83%E8%AF%95%E6%89%BE%E7%BE%A4%E4%B8%BB%E5%A4%84%E7%90%86%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasPlayed = false; // 标志变量，用于判断视频是否已经播放过

    // 设置视频播放速度
    const playbackRate = 15; // 根据实际情况调整播放速度，建议1.0-2.0倍速

    // 主函数
    function main() {
        // 检查是否在视频播放页面
        if (isVideoPage()) {
            console.log('检测到视频页面，开始自动播放...');
            autoPlayVideo();
        } else {
            console.log('这不是一个视频播放页面。');
        }
    }

    // 判断是否为视频播放页面
    function isVideoPage() {
        // 根据实际页面结构修改判断逻辑
        return document.querySelector('video') !== null;
    }

    // 自动播放视频
    function autoPlayVideo() {
        const video = document.querySelector('video');
        if (video) {
            // 设置播放速率
            video.playbackRate = playbackRate;

            // 如果视频暂停，并且还未播放过，则开始播放
            if (video.paused && !hasPlayed) {
                video.play().then(() => {
                    console.log('视频开始播放...');
                    setupVideoListeners(video);
                    // 自动点击播放按钮
                    autoClickPlayButton();
                }).catch(err => {
                    console.error('自动播放失败:', err);
                });
            } else if (!hasPlayed) {
                console.log('视频已在播放...');
                setupVideoListeners(video);
            } else {
                console.log('视频已经播放完毕，不再重复播放。');
                // 移除视频事件监听器
                if (video) {
                    video.removeEventListener('ended', onVideoEnded);
                    video.removeEventListener('play', onVideoPlay);
                    video.removeEventListener('pause', onVideoPause);
                }
            }
        } else {
            console.log('未找到视频元素。');
        }
    }

    // 设置视频事件监听器
    function setupVideoListeners(video) {
        // 监听视频播放结束事件
        video.addEventListener('ended', onVideoEnded);
        function onVideoEnded() {
            console.log('视频播放结束...');
            // 视频播放结束后的操作 (如：标记为已完成)
            markVideoAsCompleted();
            hasPlayed = true; // 标记视频已经播放完毕
            // 移除视频事件监听器
            video.removeEventListener('ended', onVideoEnded);
            video.removeEventListener('play', onVideoPlay);
            video.removeEventListener('pause', onVideoPause);
        }

        // 监听视频播放状态变化
        video.addEventListener('play', onVideoPlay);
        function onVideoPlay() {
            console.log('视频播放中...');
            // 模拟定期观看行为
            simulateWatchingBehavior();
        }

        // 监听视频暂停事件
        video.addEventListener('pause', onVideoPause);
        function onVideoPause() {
            console.log('视频暂停...');
            // 如果视频被暂停，尝试继续播放，但只在视频未播放完毕时
            if (!hasPlayed) {
                setTimeout(() => {
                    if (!video.paused) {
                        console.log('视频已恢复播放...');
                    } else {
                        console.log('尝试恢复视频播放...');
                        video.play().catch(err => {
                            console.error('恢复播放失败:', err);
                        });
                    }
                }, 5000);
            }
        }
    }

    // 自动点击播放按钮
    function autoClickPlayButton() {
        console.log('尝试自动点击播放按钮...');
        // 根据实际页面结构修改按钮的选择器
        const playButton = document.querySelector('button[data-type="play"]');
        if (playButton) {
            playButton.click();
            console.log('播放按钮已点击');
        } else {
            console.log('未找到播放按钮');
        }
    }

    // 模拟观看行为
    function simulateWatchingBehavior() {
        console.log('模拟观看行为...');
        // 这里可以添加模拟鼠标移动、键盘操作等行为的代码
        // 以避免被平台检测为自动化脚本
    }

    // 标记视频为已完成
    function markVideoAsCompleted() {
        console.log('标记视频为已完成...');
        // 这里可以添加与平台 API 交互的代码
        // 以标记视频为已完成状态
    }

    // 启动脚本
    window.addEventListener('load', main);
})();