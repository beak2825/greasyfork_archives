// ==UserScript==
// @name         自动刷课脚本 - 适配指定平台
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动播放视频、自动跳转未完成课程
// @author       You
// @match        https://jxjy.ahharc.com/member/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546864/%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20-%20%E9%80%82%E9%85%8D%E6%8C%87%E5%AE%9A%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/546864/%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20-%20%E9%80%82%E9%85%8D%E6%8C%87%E5%AE%9A%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 生成随机延迟（秒）
    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 获取当前 iframe 内的视频元素
    function getVideo() {
        try {
            const iframe = document.getElementById('c_frame');
            if (!iframe) return null;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            return iframeDoc.getElementById('example_video_1_html5_api');
        } catch (e) {
            console.warn('[AutoStudy] 无法访问 iframe 内容（可能跨域）:', e);
            return null;
        }
    }

    // 播放视频
    function playVideo() {
        const video = getVideo();
        if (video) {
            video.play().catch(e => console.warn('[AutoStudy] 自动播放失败:', e));
            console.log('[AutoStudy] 视频已开始播放');
        } else {
            console.warn('[AutoStudy] 未找到视频元素');
        }
    }

    // 检查是否播放完成
    function isVideoEnded() {
        const video = getVideo();
        if (!video) return false;
        return video.ended || Math.ceil(video.currentTime) >= Math.ceil(video.duration);
    }

    // 找下一个未完成的课程并点击
    function gotoNextLesson() {
        const lessons = document.getElementsByName('studyUrl');
        let foundUnfinished = false;

        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];
            // 获取当前课程后面的 span（进度）
            const nextSpan = lesson.closest('div')?.nextElementSibling;
            const progressText = nextSpan?.textContent?.trim() || '0%';
            const isCompleted = progressText.includes('100%');

            if (!isCompleted) {
                console.log(`[AutoStudy] 发现未完成课程: ${lesson.textContent.trim()}`);
                // 模拟点击进入下一节
                setTimeout(() => {
                    lesson.click();
                    console.log('[AutoStudy] 已跳转到下一节...');
                }, randomDelay(3, 6) * 1000); // 随机延迟 3~6 秒
                foundUnfinished = true;
                break;
            }
        }

        if (!foundUnfinished) {
            console.log('%c[AutoStudy] 所有课程已完成！', 'color: green; font-weight: bold;');
            alert('🎉 所有课程已刷完！');
        }
    }

    // 主循环：每 5 秒检查一次播放状态
    function startAutoStudy() {
        console.log('%c[AutoStudy] 自动刷课脚本已启动', 'color: blue; font-weight: bold;');

        const checkInterval = setInterval(() => {
            const video = getVideo();
            if (!video) {
                console.warn('[AutoStudy] 视频未加载，等待中...');
                return;
            }

            const currentTime = Math.ceil(video.currentTime);
            const duration = Math.ceil(video.duration);
            const progress = ((currentTime / duration) * 100).toFixed(1);

            console.log(`[AutoStudy] 播放进度: ${progress}% (${currentTime}s / ${duration}s)`);

            if (isVideoEnded()) {
                console.log('%c[AutoStudy] 视频播放完成，准备跳转...', 'color: green');
                clearInterval(checkInterval);
                gotoNextLesson();
            }
        }, 5000); // 每 5 秒检查一次
    }

    // 页面完全加载后执行
    window.addEventListener('load', () => {
        // 延迟 2 秒确保 iframe 加载完成
        setTimeout(() => {
            playVideo();
            startAutoStudy();
        }, 2000);
    });

})();