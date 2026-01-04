// ==UserScript==
// @name         Auto-TS-IL
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动点击“继续学习”按钮，并继续播放视频，避免视频自动暂停，并在视频完成后自动播放下一个视频。
// @author       Ergou
// @include      *://i-learning.thundersoft.com/kng/course/package/video/*
// @include      *://i-learning.thundersoft.com/kng/o2ostudy/video/*
// @include      *://i-learning.thundersoft.com/kng/course/package/document/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501453/Auto-TS-IL.user.js
// @updateURL https://update.greasyfork.org/scripts/501453/Auto-TS-IL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickContinue() {
        // 查找继续学习按钮
        let continueButton = document.querySelector('#reStartStudy');
        if (continueButton) {
            if (typeof removeWarningHtml === 'function') {
                // 设置 myMousedown 为 true 以确保 removeWarningHtml 可以正常工作
                if (typeof myMousedown !== 'undefined') {
                    myMousedown = true;
                } else {
                    console.log('not found myMousedown');
                }

                removeWarningHtml();

                // 检查是否成功移除 dvWarningView
                if (!document.getElementById('dvWarningView')) {
                    console.log('成功移除 dvWarningView');
                } else {
                    console.log('未能移除 dvWarningView');
                }
            } else {
                console.log('removeWarningHtml() 方法未定义');
            }
        }
    }

    function playNextVideo() {
        let catalogList = document.querySelector('dl.el-play-catalog-list');
        if (!catalogList) {
            console.log('未找到 el-play-catalog-list 元素');
            return;
        }

        let currentDD = catalogList.querySelector('dd.active.select');
        if (!currentDD) {
            console.log('未找到 active select 的 <dd> 子标签');
            return;
        }

        let nextDD = currentDD.nextElementSibling;
        if (!nextDD) {
            console.log('未找到下一个同级标签');
            return;
        }
        // 当前标签若不是<dd>，则为<dt>，属于章节名，不包含下一个视频的链接，再取下一个元素
        if (nextDD.tagName !== 'DD') {
            nextDD = nextDD.nextElementSibling
        }

        if (!nextDD) {
            console.log('标签错误');
            return;
        }

        let courseDiv = nextDD.querySelector('div.el-course-catalog-right.ellipsis');
        if (!courseDiv) {
            console.log('未找到 el-course-catalog-right ellipsis 的 <div> 子标签');
            return;
        }

        let spanTag = courseDiv.querySelector('span');
        if (!spanTag) {
            console.log('未找到 <span> 子标签');
            return;
        }

        let onclickAttr = spanTag.getAttribute('onclick');
        if (!onclickAttr) {
            console.log('未找到 onclick 属性');
            return;
        }

        // 提取 StudyRowClick 函数的所有参数并调用
        let match = onclickAttr.match(/StudyRowClick\(([^)]+)\)/);
        if (match && match[1]) {
            let params = match[1].split(',').map(param => eval(param.trim()));
            StudyRowClick(...params);
        } else {
            console.log('未能提取到 StudyRowClick 参数');
        }
    }

    function monitorCompletionArea() {
        let completionArea = document.querySelector('#divCompletedArea');
        if (completionArea) {
            // 先判断一次是否显示
            if (completionArea.style.display !== 'none') {
                playNextVideo();
            }

            // 监视complete.style属性变化
            let observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (completionArea.style.display !== 'none') {
                            playNextVideo();
                        }
                    }
                }
            });

            // 观察 completionArea 的属性变化
            observer.observe(completionArea, {
                attributes: true,
                attributeFilter: ['style']
            });
        } else {
            console.log('未找到 divCompletedArea 元素');
        }
    }

    // 监视DOM变化
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                clickContinue();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 设置一个间隔检查弹窗，作为备份措施
    setInterval(() => {
        clickContinue();
    }, 5000);

    monitorCompletionArea();

    // 等待视频元素加载完成
    function waitForVideo() {
        const video = document.querySelector('video');
        if (video) {
            setPlaybackRate(video);
        } else {
            setTimeout(waitForVideo, 500);
        }
    }

    // 设置播放速度为2倍
    function setPlaybackRate(video) {
        video.playbackRate = 2;
        console.log("Playback rate set to 2x");
    }

    // 初始调用
    waitForVideo();
})();
