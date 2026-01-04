// ==UserScript==
// @name         广开网络教学平台/广东开放大学【10倍速度】自动刷视频【做题功能请查看下面QQ群，联系群主】
// @namespace    一心向善
// @version      1.1.6
// @description  广开/广东开放大学全自动播放视频并模拟观看行为，无做题功能做题功能请查看下面QQ群，联系群主，有需要合作和咨询问题的看下面描述里面QQ群！！！
// @author       一心向善
// @match        *://course.ougd.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466474/%E5%B9%BF%E5%BC%80%E7%BD%91%E7%BB%9C%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E3%80%9010%E5%80%8D%E9%80%9F%E5%BA%A6%E3%80%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%E3%80%90%E5%81%9A%E9%A2%98%E5%8A%9F%E8%83%BD%E8%AF%B7%E6%9F%A5%E7%9C%8B%E4%B8%8B%E9%9D%A2QQ%E7%BE%A4%EF%BC%8C%E8%81%94%E7%B3%BB%E7%BE%A4%E4%B8%BB%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/466474/%E5%B9%BF%E5%BC%80%E7%BD%91%E7%BB%9C%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E3%80%9010%E5%80%8D%E9%80%9F%E5%BA%A6%E3%80%91%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%E3%80%90%E5%81%9A%E9%A2%98%E5%8A%9F%E8%83%BD%E8%AF%B7%E6%9F%A5%E7%9C%8B%E4%B8%8B%E9%9D%A2QQ%E7%BE%A4%EF%BC%8C%E8%81%94%E7%B3%BB%E7%BE%A4%E4%B8%BB%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置视频播放速度 (建议 1.0 - 2.0 倍速)
    const playbackRate = 10.0;

    // 模拟观看时间间隔 (毫秒)
    const watchInterval = 30000; // 30 秒

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
        // 例如：检查是否存在视频元素或特定的页面标识
        return document.querySelector('video') !== null;
    }

    // 自动播放视频
    function autoPlayVideo() {
        const video = document.querySelector('video');
        if (video) {
            // 设置播放速率
            video.playbackRate = playbackRate;

            // 如果视频暂停，则开始播放
            if (video.paused) {
                video.play().then(() => {
                    console.log('视频开始播放...');
                    setupVideoListeners(video);
                }).catch(err => {
                    console.error('自动播放失败:', err);
                });
            } else {
                console.log('视频已在播放...');
                setupVideoListeners(video);
            }
        } else {
            console.log('未找到视频元素。');
        }
    }

    // 设置视频事件监听器
    function setupVideoListeners(video) {
        // 监听视频播放结束事件
        video.addEventListener('ended', () => {
            console.log('视频播放结束...');
            // 视频播放结束后的操作 (如：标记为已完成)
            markVideoAsCompleted();
            // 延迟返回课程列表
            setTimeout(() => {
                returnToPreviousPage();
            }, 5000);
        });

        // 监听视频播放状态变化
        video.addEventListener('play', () => {
            console.log('视频播放中...');
            // 模拟定期观看行为
            simulateWatchingBehavior();
        });

        // 监听视频暂停事件
        video.addEventListener('pause', () => {
            console.log('视频暂停...');
            // 如果视频被暂停，尝试继续播放
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
        });
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

    // 返回上一页
    function returnToPreviousPage() {
        console.log('返回上一页...');
        window.history.back();
    }

    // 启动脚本
    main();
})();