// ==UserScript==
// @name         公需课助手
// @namespace    https://greasyfork.org/zh-CN/scripts/522311
// @version      1.3
// @description  自动播放课程视频，自动跳转下一章节，自动静音，暂停后自动播放
// @author       小楫轻舟
// @match        https://jxjy.ahhjsoft.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522311/%E5%85%AC%E9%9C%80%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522311/%E5%85%AC%E9%9C%80%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 保存已处理视频的集合，避免重复处理
    const processedVideos = new Set();

    // 等待元素加载的函数
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const timer = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                } else if (elapsed >= timeout) {
                    clearInterval(timer);
                    reject(`Element not found: ${selector}`);
                }
                elapsed += interval;
            }, interval);
        });
    }

    // 自动静音和播放视频
    async function autoPlayVideo() {
        try {
            const videoSelector = '#lesson_player_box_container_new_hwCloud_dom_baby_html5_api';
            const video = await waitForElement(videoSelector);
            if (video && !processedVideos.has(video)) {
                // 标记视频为已处理
                processedVideos.add(video);

                // 设置静音
                video.muted = true;
                console.log('视频已静音');

                // 自动播放
                video.play().then(() => {
                    console.log('视频已自动播放');
                }).catch(err => {
                    console.error('自动播放失败', err);
                });

                // 监听视频暂停事件，视频暂停时自动播放
                video.addEventListener('pause', () => {
                    console.log('视频暂停，准备重新播放');
                    video.play().then(() => {
                        console.log('视频已继续播放');
                    }).catch(err => {
                        console.error('继续播放失败', err);
                    });
                });

                // 监听视频结束事件
                video.addEventListener('ended', () => {
                    console.log('视频播放结束，尝试跳转到下一章节');
                    goToNextChapter();
                });
            }
        } catch (error) {
            console.error('自动播放视频失败:', error);
        }
    }

    // 跳转到下一章节
    function goToNextChapter() {
        const nextButtonSelector = '.next.ng-scope a[ng-click="events.playNext()"]';
        const nextButton = document.querySelector(nextButtonSelector);
        if (nextButton) {
            nextButton.click();
            console.log('已跳转到下一章节');
        } else {
            console.warn('未找到下一章节按钮');
        }
    }

    // 主函数
    function main() {
        autoPlayVideo();

        // 监听页面的动态变化，确保脚本适应内容变化
        const observer = new MutationObserver(() => {
            autoPlayVideo();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 页面加载后运行脚本
    window.addEventListener('load', main);
})();
