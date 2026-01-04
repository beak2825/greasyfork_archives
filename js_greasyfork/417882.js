// ==UserScript==
// @name         我是宪法小标兵！！
// @namespace    XFDT2020
// @version      0.2.2024
// @description  宪法答题自动练习（100%正确率但不支持考试）
// @author       PY-DNG
// @include      *://static.qspfw.moe.gov.cn/xf2024/learning-page.html*
// @include      *://static.qspfw.moe.gov.cn/xf2024/learn-practice.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/417882/%E6%88%91%E6%98%AF%E5%AE%AA%E6%B3%95%E5%B0%8F%E6%A0%87%E5%85%B5%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/417882/%E6%88%91%E6%98%AF%E5%AE%AA%E6%B3%95%E5%B0%8F%E6%A0%87%E5%85%B5%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.href.indexOf('learning-page') != -1) {
        if (document.querySelector('#afterClassPractice')) {
            toExam();
        }
        return;
    }


    const red = "rgb(217, 0, 27)";
    const green = "rgb(2, 155, 90)";

    //examTime = 100000;
    let choices, question, answer;
    let i, j, curNum, totalNum;
    curNum = Math.floor(document.querySelector('#currentTopic').innerHTML);
    totalNum = Math.floor(document.querySelector('#totalTopic').innerHTML);

    for (j = curNum; j <= totalNum; j++) {
        choices = document.querySelectorAll('.prev');
        choices['ABCD'.indexOf(questionBank_answer)].click();
        nextQuestion();
    }
    nextExam();
})();