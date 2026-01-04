// ==UserScript==
// @name         金蓝领刷课-互联网+职业技能培训网+山东瀚德
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  智能自动播放视频，避免重复触发
// @match        https://www.wljnpx.com/*
// @grant        @license GPL3
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546590/%E9%87%91%E8%93%9D%E9%A2%86%E5%88%B7%E8%AF%BE-%E4%BA%92%E8%81%94%E7%BD%91%2B%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%9F%B9%E8%AE%AD%E7%BD%91%2B%E5%B1%B1%E4%B8%9C%E7%80%9A%E5%BE%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/546590/%E9%87%91%E8%93%9D%E9%A2%86%E5%88%B7%E8%AF%BE-%E4%BA%92%E8%81%94%E7%BD%91%2B%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%9F%B9%E8%AE%AD%E7%BD%91%2B%E5%B1%B1%E4%B8%9C%E7%80%9A%E5%BE%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('自动播放脚本已启动 v3.2');

    // 状态管理
    let isProcessing = false;
    let lastPlayTime = 0;
    let playAttempts = 0;
    let isPlaying = false;

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数 - 修复 ESLint 错误
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false // 修复：分离赋值语句
                }, limit);
            }
        };
    }

    // 检查是否应该尝试播放
    function shouldTryPlay() {
        const now = Date.now();
        // 如果正在处理或距离上次尝试不足3秒，跳过
        if (isProcessing || (now - lastPlayTime) < 3000) {
            return false;
        }
        // 如果尝试次数过多，延长等待时间
        if (playAttempts > 5) {
            if ((now - lastPlayTime) < 10000) {
                return false;
            }
            playAttempts = 0; // 重置尝试次数
        }
        return true;
    }

    // 安全播放视频
    const safePlayVideo = throttle(function() {
        if (!shouldTryPlay()) {
            console.log('跳过播放尝试：冷却中');
            return;
        }

        isProcessing = true;
        lastPlayTime = Date.now();
        playAttempts++;

        const video = document.querySelector('video.pv-video, video');
        const playButton = document.querySelector('.pv-playpause');

        if (!video) {
            console.log('未找到视频元素');
            isProcessing = false;
            return;
        }

        // 检查视频是否真的在播放
        if (!video.paused && video.currentTime > 0 && !video.ended) {
            console.log('视频正在播放中，无需操作');
            isPlaying = true;
            isProcessing = false;
            playAttempts = 0; // 播放成功，重置尝试次数
            return;
        }

        // 只有在视频确实暂停时才尝试播放
        if (video.paused) {
            console.log('检测到视频暂停，尝试播放');

            // 方法1：直接播放视频
            video.play().then(() => {
                console.log('视频播放成功');
                isPlaying = true;
                playAttempts = 0;
            }).catch(err => {
                console.log('直接播放失败，尝试点击按钮', err);

                // 方法2：点击播放按钮（仅当按钮显示为播放图标时）
                if (playButton && playButton.classList.contains('pv-icon-play')) {
                    setTimeout(() => {
                        playButton.click();
                        console.log('已点击播放按钮');
                    }, 500);
                }
            });
        }

        // 处理完成
        setTimeout(() => {
            isProcessing = false;
        }, 2000);
    }, 3000); // 节流：最少3秒执行一次

    // 监听视频状态变化（使用防抖避免频繁触发）
    const handleVideoStateChange = debounce(function(event) {
        const video = event.target;

        if (event.type === 'pause') {
            console.log('视频暂停事件');
            isPlaying = false;
            // 延迟2秒后尝试恢复播放（给其他操作留出时间）
            setTimeout(() => {
                // 再次检查是否仍然暂停
                if (video.paused && !isProcessing) {
                    safePlayVideo();
                }
            }, 2000);
        } else if (event.type === 'play') {
            console.log('视频播放事件');
            isPlaying = true;
            playAttempts = 0;
        } else if (event.type === 'ended') {
            console.log('视频结束事件');
            isPlaying = false;
            // 等待下一个视频加载
            setTimeout(() => {
                safePlayVideo();
            }, 3000);
        }
    }, 500);

    // 监听课程切换（使用防抖）
    const handleCourseSwitch = debounce(function(e) {
        if (e.target.closest('.sctTitle')) {
            console.log('检测到课程切换');
            isPlaying = false;
            playAttempts = 0;
            // 等待新视频加载
            setTimeout(() => {
                safePlayVideo();
            }, 3000);
        }
    }, 1000);

    // 监听DOM变化（使用防抖）
    const handleDOMChange = debounce(function(mutations) {
        let videoChanged = false;

        mutations.forEach(function(mutation) {
            // 只关注视频源变化
            if (mutation.type === 'attributes' &&
                mutation.target.tagName === 'VIDEO' &&
                mutation.attributeName === 'src') {
                videoChanged = true;
            }
        });

        if (videoChanged) {
            console.log('检测到视频源变化');
            isPlaying = false;
            playAttempts = 0;
            setTimeout(() => {
                safePlayVideo();
            }, 2000);
        }
    }, 1000);

    // 设置DOM观察器
    function setupObserver() {
        const observer = new MutationObserver(handleDOMChange);

        observer.observe(document.body, {
            attributes: true,
            childList: false,
            subtree: true,
            attributeFilter: ['src']
        });

        console.log('DOM观察器已设置');
    }

    // 初始化
    function initialize() {
        console.log('开始初始化');

        // 设置事件监听器
        document.addEventListener('pause', handleVideoStateChange, true);
        document.addEventListener('play', handleVideoStateChange, true);
        document.addEventListener('ended', handleVideoStateChange, true);
        document.addEventListener('click', handleCourseSwitch, true);

        // 设置DOM观察器
        setupObserver();

        // 首次检查（延迟执行）
        setTimeout(() => {
            safePlayVideo();
        }, 2000);

        // 定期检查（降低频率，避免干扰）
        setInterval(() => {
            const video = document.querySelector('video.pv-video, video');
            if (video && video.paused && !isProcessing && !isPlaying) {
                console.log('定期检查：发现视频暂停');
                safePlayVideo();
            }
        }, 10000); // 10秒检查一次

        console.log('初始化完成');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && !isPlaying) {
            console.log('页面变为可见，检查播放状态');
            setTimeout(() => {
                safePlayVideo();
            }, 1000);
        }
    });

    console.log('脚本加载完成');

})();
