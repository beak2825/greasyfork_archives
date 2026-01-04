// ==UserScript==
// @name         手动控制课程播放脚本
// @namespace    https://greasyfork.org/zh-CN/users/1063320-%E7%AC%94%E7%A0%9A
// @version      1.2
// @description  添加一个按钮，通过点击按钮先播放视频然后立即完成课程。
// @author       笔墨纸砚
// @match        *://www.sxjkaqjypx.com:88/#/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520403/%E6%89%8B%E5%8A%A8%E6%8E%A7%E5%88%B6%E8%AF%BE%E7%A8%8B%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520403/%E6%89%8B%E5%8A%A8%E6%8E%A7%E5%88%B6%E8%AF%BE%E7%A8%8B%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 日志打印函数
    function log(message) {
        console.log(`[手动控制脚本] ${message}`);
    }

    // 模拟点击事件函数
    function simulateClick(element) {
        if (!element) return;
        log('尝试模拟点击事件...');

        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);

        log('模拟点击已完成。');
    }

    // 播放视频的函数
    function playVideo() {
        const video = document.querySelector('video');
        if (video) {
            log('找到视频元素，尝试播放...');
            video.muted = true; // 静音播放
            video.play().then(() => {
                log('视频已成功播放。');
            }).catch((error) => {
                log(`视频播放失败：${error.message}`);
            });
        } else {
            const playButton = document.querySelector('.video-react-big-play-button');
            if (playButton) {
                log('未找到视频元素，尝试点击播放按钮...');
                simulateClick(playButton);
            } else {
                log('未找到视频元素和播放按钮。');
            }
        }
    }

    // 立即完成课程的函数
    function completeCourse() {
        const video = document.querySelector('video');
        if (video && !isNaN(video.duration) && isFinite(video.duration)) {
            log("检测到视频播放器，尝试完成课程...");
            video.currentTime = video.duration; // 快速跳到视频结尾
            setTimeout(() => {
                video.dispatchEvent(new Event('ended'));
                log("触发视频结束事件，课程已完成。");
            }, 500);
        } else {
            log("未检测到视频播放器或视频时长无效，可能是课程尚未加载完成。");
        }
    }

    // 创建控制按钮
    function createControlButton() {
        const button = document.createElement('button');
        button.textContent = '播放并完成课程';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.right = '10px';
        button.style.transform = 'translateY(-50%)';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            log('按钮点击，开始播放视频并执行完成课程逻辑...');
            playVideo();
            setTimeout(() => {
                completeCourse();
            }, 2000); // 等待视频开始播放后完成课程
        });

        document.body.appendChild(button);
        log('控制按钮已添加到页面。');
    }

    // 页面加载完成后添加按钮
    window.addEventListener('load', () => {
        log('页面加载完成，准备添加控制按钮...');
        createControlButton();
    });
})();
