// ==UserScript==
// @name         B站屏蔽短视频
// @namespace    https://space.bilibili.com/9877022?spm_id_from=333.1007.0.0
// @version      2025-02-18
// @description  在油猴脚本扩展中添加设置，可自定义短视频时长阈值，屏蔽直播功能仅在B站首页默认生效
// @license      MIT  // ← 这里添加许可证
// @author       tangseng
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527398/B%E7%AB%99%E5%B1%8F%E8%94%BD%E7%9F%AD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/527398/B%E7%AB%99%E5%B1%8F%E8%94%BD%E7%9F%AD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取存储的短视频时长阈值，如果没有则使用默认值 600 秒（10 分钟）
    let shortVideoThreshold = GM_getValue('shortVideoThreshold', 600);
    // 记录展开按钮是否已经被点击过
    let expandButtonClicked = false;

    // 定义一个函数用于显示所有视频
    function showAllVideos() {
        const homeVideoCards = document.querySelectorAll('.feed-card');
        homeVideoCards.forEach(card => {
            card.style.display = '';
        });

        const rightVideoCards = document.querySelectorAll('.video-page-card-small');
        rightVideoCards.forEach(card => {
            card.style.display = '';
        });
    }

    // 定义一个函数用于隐藏短时长视频
    function hideShortDurationVideos() {
        showAllVideos();

        if (window.location.href === 'https://www.bilibili.com/') {
            // 找到视频卡片元素
            const videoCards = document.querySelectorAll('.feed-card');
            videoCards.forEach(card => {
                // 查找视频时长元素
                const durationElement = card.querySelector('span.bili-video-card__stats__duration');
                if (durationElement) {
                    const durationText = durationElement.textContent.trim();
                    // 解析时长信息
                    const [minutes, seconds] = durationText.split(':').map(Number);
                    const totalSeconds = minutes * 60 + seconds;
                    // 判断是否小于用户设置的时长阈值
                    if (totalSeconds < shortVideoThreshold) {
                        card.style.display = 'none';
                    }
                }
            });

            // 屏蔽直播元素
            const liveElements = document.querySelectorAll('div.live-card');
            liveElements.forEach(element => {
                element.style.display = 'none';
            });
        }
        // 处理视频播放页面情况
        if (window.location.href.startsWith('https://www.bilibili.com/video/')) {
            // 找到视频播放页面右侧推荐视频卡片元素
            const rightVideoCards = document.querySelectorAll('.video-page-card-small');
            rightVideoCards.forEach(card => {
                // 查找视频时长元素
                const durationElement = card.querySelector('span.duration');
                if (durationElement) {
                    const durationText = durationElement.textContent.trim();
                    // 解析时长信息
                    const [minutes, seconds] = durationText.split(':').map(Number);
                    const totalSeconds = minutes * 60 + seconds;
                    // 判断是否小于用户设置的时长阈值
                    if (totalSeconds < shortVideoThreshold) {
                        card.style.display = 'none';
                    }
                }
            });

            // 找到展开按钮并模拟点击
            const expandButton = document.querySelector('.rec-footer');
            if (expandButton &&!expandButtonClicked) {
                expandButton.click();
                expandButtonClicked = true;
            }
        }
    }

    // 页面加载完成后立即执行一次隐藏操作
    window.addEventListener('load', hideShortDurationVideos);

    // 延迟执行函数，避免频繁触发
    let timeoutId;
    function debounceHide() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            // 确保在延迟执行前再次检查页面元素是否加载完成
            if (document.readyState === 'complete') {
                hideShortDurationVideos();
            }
        }, 1000); // 1000ms 延迟
    }

    // 由于页面可能会动态加载内容，使用 MutationObserver 监测页面变化
    const targetNode = document.querySelector('.recommend-list-v1') || document.body;
    const observer = new MutationObserver(debounceHide);
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    // 当页面的状态变为完全加载时，也执行一次隐藏操作
    document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
            hideShortDurationVideos();
        }
    });

    // 注册设置短视频时长阈值的菜单命令
    GM_registerMenuCommand('设置短视频时长阈值（秒）', function () {
        const input = prompt('请输入短视频时长阈值（秒）：', shortVideoThreshold);
        if (input !== null) {
            const newThreshold = parseInt(input, 10);
            if (!isNaN(newThreshold) && newThreshold > 0) {
                shortVideoThreshold = newThreshold;
                GM_setValue('shortVideoThreshold', newThreshold);
                hideShortDurationVideos();
            } else {
                alert('输入无效，请输入一个正整数。');
            }
        }
    });
})();