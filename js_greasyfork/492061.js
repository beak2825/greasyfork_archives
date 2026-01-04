// ==UserScript==
// @name         环安专业课小助手
// @namespace    https://greasyfork.org/zh-CN/scripts/492061-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E7%AB%A0%E8%8A%82%E8%A7%86%E9%A2%91-%E5%85%B3%E9%97%AD%E8%A7%86%E9%A2%91%E9%9F%B3%E9%87%8F
// @version      1.4.3
// @description  自动关闭视频音量和自动播放下一章节视频，同时添加可选倍速功能
// @author       小楫轻舟
// @match        https://jxjy.ahharc.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492061/%E7%8E%AF%E5%AE%89%E4%B8%93%E4%B8%9A%E8%AF%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492061/%E7%8E%AF%E5%AE%89%E4%B8%93%E4%B8%9A%E8%AF%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化视频设置
    function initVideoSettings(video) {
        // 关闭视频音量
        video.muted = true;

        // 添加倍速选择功能
        const speedSelect = document.createElement('select');
        speedSelect.innerHTML = '<option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option><option value="16">16x</option>';
        speedSelect.style.position = 'absolute';
        speedSelect.style.top = '10px';
        speedSelect.style.right = '10px';
        speedSelect.style.zIndex = '9999';
        speedSelect.addEventListener('change', function() {
            video.playbackRate = parseFloat(speedSelect.value);
        });
        document.body.appendChild(speedSelect);

        // 视频结束时播放下一章节
        video.addEventListener('ended', navigateToNextChapter);

        // 视频暂停后自动恢复播放
        //video.addEventListener('pause', function() {
           // setTimeout(() => { if (video.paused) video.play(); }, 6000);
        //});
    }

    // 获取下一章节链接
    function getNextChapterLink(courseId, coursewareId, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://jxjy.ahharc.com/member/courseware/getCoursewareListByCourseId.page?courseId=${courseId}`, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                let currentChapterIndex = response.findIndex(chapter =>
                    chapter.coursewareList.some(courseware => courseware.coursewareId === coursewareId)
                );
                if (currentChapterIndex !== -1 && currentChapterIndex < response.length - 1) {
                    const nextChapter = response[currentChapterIndex + 1];
                    if (nextChapter.coursewareList.length > 0) {
                        const nextCoursewareId = nextChapter.coursewareList[0].coursewareId;
                        callback(`https://jxjy.ahharc.com/member/member_toStudyMains.page?courseid=${courseId}&coursewareid=${nextCoursewareId}&classId=${urlParams.get('classId')}&isExam=*`);
                        return;
                    }
                }
            }
            callback(null);
        };
        xhr.send();
    }

    // 跳转到下一章节
    function navigateToNextChapter() {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('courseid');
        const coursewareId = urlParams.get('coursewareid');
        getNextChapterLink(courseId, coursewareId, function(nextChapterLink) {
            if (nextChapterLink) window.location.href = nextChapterLink;
        });
    }

    // 等待视频元素加载完成
    const observer = new MutationObserver(function() {
        const video = document.querySelector('video');
        if (video) {
            initVideoSettings(video);
            observer.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
