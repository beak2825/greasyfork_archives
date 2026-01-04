// ==UserScript==
// @name         甜学院自动点击继续学习按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  判断弹窗并点击继续学习按钮，同时检测并点击开始学习按钮
// @author       You
// @match        https://px.tianlala.com/o2o/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539255/%E7%94%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/539255/%E7%94%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击弹窗中的“继续学习”按钮
    function clickContinueLearning() {
        // 查找所有 button 元素，并过滤出包含 "继续学习" 或 "开始学习" 的按钮
        var buttons = Array.from(document.querySelectorAll('button')).filter(function(button) {
            return /刷新|继续学习|开始学习/.test(button.textContent.trim());
        });

        // 如果找到符合条件的按钮，则点击第一个
        if (buttons.length > 0) {
            buttons[0].click();
            console.log('已点击包含“继续学习”或“开始学习”的按钮');
        } else {
            console.error('没有找到包含“继续学习”或“开始学习”的按钮');
        }

        var video = document.querySelector('video');
        if(video){
             video.play();
            video.playbackRate = 2
        }



        const playerArea = document.querySelector('.yxtulcdsdk-course-player__playeare');

        if (!playerArea) {
            console.warn('未找到课程播放区域 (.yxtulcdsdk-course-player__playeare)');
            return;
        }

        // 查找倒计时元素
        const countdownEl = playerArea.querySelector('.yxt-color-warning');

        if (!countdownEl || !countdownEl.textContent.trim()) {
            console.log('学习已完成或无倒计时信息');
            clickNextButton();
            return;
        }

        // 提取倒计时文本，例如："7分钟 21秒"
        const text = countdownEl.textContent.trim();
        console.log(text);


        }


        function clickNextButton() {

            // 查找所有 button 元素，并过滤出包含 "下一个" 的按钮
            var buttons = Array.from(document.querySelectorAll('button')).filter(function(button) {
                return /下一个/.test(button.textContent.trim());
            });
            // 如果找到符合条件的按钮，则点击第一个
            if (buttons.length > 0) {
                buttons[0].click();
                console.log('已点击包含“下一个”的按钮');
            } else {
                console.error('没有找到包含“下一个”的按钮');
            }
        }

    // 每隔5秒检查一次
    setInterval(() => {
        clickContinueLearning();
    }, 3000);
})();