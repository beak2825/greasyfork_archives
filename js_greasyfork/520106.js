// ==UserScript==
// @name         hlstudy.scbaixin.net自动跳转下一个视频
// @version      1.3
// @description  hlstudy.scbaixin.net自动跳转下一个视频,在视频播放完成后自动跳转到下一个lesson
// @author       Your Name
// @match        http://hlstudy.scbaixin.net/study/lesson/content/*
// @grant        none
// @namespace https://greasyfork.org/users/1402509
// @downloadURL https://update.greasyfork.org/scripts/520106/hlstudyscbaixinnet%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/520106/hlstudyscbaixinnet%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 检查当前域名是否为 hlstudy.scbaixin.net
    if (window.location.hostname === 'hlstudy.scbaixin.net') {
        // 等待视频元素加载完成
        const videoObserver = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const video = document.getElementById('studyvideo');
                    if (video) {
                        // 视频元素加载完成后自动播放
                        video.play();

                        // 监听视频播放完成事件
                        video.addEventListener('ended', function() {
                            redirectToNextLesson();
                        });

                        // 停止观察
                        observer.disconnect();
                        break;
                    }
                }
            }
        });

        // 配置视频观察选项
        const videoConfig = { childList: true, subtree: true };

        // 开始观察document.body
        videoObserver.observe(document.body, videoConfig);

        // 监听PStudyTime元素内容变化
        const studyTimeObserver = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const studyTimeElement = document.getElementById('PStudyTime');
                    if (studyTimeElement && studyTimeElement.textContent === '学习完成') {
                        redirectToNextLesson();
                        observer.disconnect();
                        break;
                    }
                }
            }
        });

        // 配置PStudyTime观察选项
        const studyTimeConfig = { childList: true, characterData: true, subtree: true };

        // 开始观察PStudyTime元素
        const studyTimeElement = document.getElementById('PStudyTime');
        if (studyTimeElement) {
            studyTimeObserver.observe(studyTimeElement, studyTimeConfig);
        }
 // 9分钟自动刷新页面
        setTimeout(() => {
            window.location.reload();
        }, 9 * 60 * 1000); // 9分钟 = 9 * 60 * 1000 毫秒
    }

    // 重定向到下一个lesson的函数
    function redirectToNextLesson() {
        // 获取当前lesson的值
        const currentLesson = parseInt(new URLSearchParams(window.location.search).get('lesson'));

        // 计算下一个lesson的值
        const nextLesson = currentLesson + 1;

        // 构建新的URL
        const newUrl = window.location.origin + window.location.pathname +
                       '?course=' + new URLSearchParams(window.location.search).get('course') +
                       '&lesson=' + nextLesson +
                       '&status=' + new URLSearchParams(window.location.search).get('status');

        // 跳转到新的URL
        window.location.href = newUrl;
    }
})();