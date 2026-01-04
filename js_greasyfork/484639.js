// ==UserScript==
// @name         submitExam4Fenbi
// @name:zh-CN   粉笔交卷
// @namespace    submitExam4Fenbi
// @version      0.1
// @description  粉笔刷题到点交卷，可以在代码前的expectedDuration 设置自定义刷题时间。
// @description:zh-cn    粉笔刷题到点交卷，可以在代码前的expectedDuration 设置自定义刷题时间。
// @author       TIME
// @license      MIT
// @match        *://*.fenbi.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/484639/submitExam4Fenbi.user.js
// @updateURL https://update.greasyfork.org/scripts/484639/submitExam4Fenbi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const expectedDuration = '2:00:00';

    // 定义函数来点击提交按钮
    function clickSubmitButton() {
        const submitButton = document.querySelector('.submit-exercise');
        if (submitButton) {
            submitButton.click();
        };
        const btn_submit = document.querySelector('.btn-submit');
        if (btn_submit) {
            btn_submit.click();
        };
    }

    // 定义函数来将时间字符串转化为秒数
    function timeStringToSeconds(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    // 使用setInterval来连续检查时间，直到达到期望的duration
    const interval = setInterval(function() {
        const timeDiv = document.querySelector('div.time-exercise-text.active');
        const examDetail = document.querySelector('.exam-detail');

        if (timeDiv && examDetail) {
            const timeText = timeDiv.textContent.trim();
            const questionCount = examDetail.childElementCount;
            
            // 默认15道题15分钟，超出15题2个小时
            const duration = questionCount <= 15 ? '0:15:00' : expectedDuration;

            if (timeStringToSeconds(timeText) > timeStringToSeconds(duration)) {
                // 时间达到duration，停止定时器，执行点击操作
                clearInterval(interval);
                clickSubmitButton();
            }
        }
    }, 1000); // 每秒检查一次
})();
