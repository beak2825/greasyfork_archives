// ==UserScript==
// @name         成电慕课自动播放-研究生入学教育
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自动在视频播放到指定进度时点击"下一个"按钮，并在新视频加载后自动播放
// @author       Alpaca
// @match        *://mooc2.uestc.edu.cn/course/*/learning-activity/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544291/%E6%88%90%E7%94%B5%E6%85%95%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E7%A0%94%E7%A9%B6%E7%94%9F%E5%85%A5%E5%AD%A6%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/544291/%E6%88%90%E7%94%B5%E6%85%95%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E7%A0%94%E7%A9%B6%E7%94%9F%E5%85%A5%E5%AD%A6%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==


let hasShownSetupMessage = false;
(function() {
    'use strict';

    // 配置参数
    const config = {
        buttonClass: 'button ng-scope',// 目标按钮类名
        nextButtonText: '下一个',// 下一个按钮的文本内容
        triggerPercentage: 85,// 触发操作的播放进度百分比
        checkInterval: 1000,// 元素检查间隔(毫秒)
        actionDelay: 500, // 操作执行延迟(毫秒)
        playDelay: 1500, // 新视频加载后自动播放的延迟(毫秒)
        playbackRate: 1.0 //视频播放倍速
    };

    let videoElement = null;
    let hasTriggered = false;
    let observer = null;
    function handleVideoTransition(newVideo) {
        return setTimeout(() => {
            // 查找播放按钮并点击
            const playButton = document.querySelector('i.mvp-fonts-play');
            if (playButton) {
                playButton.click();
            } else {
                // 回退方案：直接播放
                setTimeout(() => {
                    newVideo.play().catch(console.error);
                }, config.actionDelay);
            }
            newVideo.playbackRate = config.playbackRate //更新倍速
            setupProgressControl();
        }, config.playDelay);
    }



    // 查找视频元素
    function findVideoElement() {
        const videos = document.getElementsByTagName('video');
        return videos.length > 0 ? videos[0] : null;
    }

    // 查找下一个按钮
    function findNextButton() {
        const allButtons = document.getElementsByTagName('button');
        return Array.from(allButtons).find(btn =>
            btn.textContent.trim() === config.nextButtonText
        );
    }

    // 设置视频进度控制
    function setupProgressControl() {
        videoElement = findVideoElement();
        const targetButton = findNextButton();

        if (!videoElement || !targetButton) {
            console.log('未找到视频元素或目标按钮，将在1秒后重试...');
            setTimeout(setupProgressControl, config.checkInterval);
            return;
        }

        // 清除旧的事件监听器
        videoElement.removeEventListener('timeupdate', progressHandler);
        videoElement.removeEventListener('play', resetTrigger);

        // 添加新的事件监听
        videoElement.addEventListener('timeupdate', progressHandler);
        videoElement.addEventListener('play', resetTrigger);

        // 重置触发状态
        hasTriggered = false;

        // 设置视频自动播放
        if (videoElement.paused) {
            const playButton = document.querySelector('i.mvp-fonts-play');
            if (playButton) {
                playButton.click();
            } else {
                videoElement.play().catch(e => console.log('自动播放失败:', e));
            }
        }
        videoElement.playbackRate = config.playbackRate;

        if (!hasShownSetupMessage) {
            console.log('视频进度控制设置完成');
            hasShownSetupMessage = true;
        }
    }


    // 视频进度处理
    function progressHandler() {
        if (!videoElement.duration) return;

        const currentPercentage = (videoElement.currentTime / videoElement.duration) * 100;

        if (currentPercentage >= config.triggerPercentage && !hasTriggered) {
            console.log(`视频已播放${config.triggerPercentage}%，准备执行操作...`);
            hasTriggered = true;

            // 执行点击下一个按钮操作
            setTimeout(() => {
                const targetButton = findNextButton();
                if (targetButton) {
                    targetButton.click();
                    console.log('按钮点击操作已执行');

                    // 设置观察器检测新视频加载
                    setupVideoObserver();
                }
            }, config.actionDelay+3000);
        }
    }


    // 重置触发状态
    function resetTrigger() {
        if (videoElement.currentTime === 0) {
            hasTriggered = false;
            console.log('视频重置，已清除触发状态');
        }
    }

    // 设置视频观察器
    function setupVideoObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length) {
                    const newVideo = findVideoElement();
                    if (newVideo && newVideo !== videoElement) {
                        videoElement = newVideo;
                        handleVideoTransition(newVideo);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    // 初始设置
    hasShownSetupMessage = false;
    setupProgressControl();
})();
