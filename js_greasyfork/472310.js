// ==UserScript==
// @name         Bing Homepage Quiz
// @name:zh-CN   必应首页测试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically answers Bing Homepage Quiz
// @description:zh-CN  自动回答必应首页的测试题
// @author       PRO
// @match        https://cn.bing.com/*
// @icon         http://bing.com/favicon.ico
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/472310/Bing%20Homepage%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/472310/Bing%20Homepage%20Quiz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function selectAnswer() {
        let quiz = document.getElementById("wkCanvas");
        if (!quiz) return;
        let next = quiz.querySelector("input[id^=nextQuestionbtn]");
        if (next && next.checkVisibility()) next.click();
        let answers = quiz.querySelectorAll("div[id^=QuestionPane] a.wk_choicesInstLink div.b_hPanel div.wk_choiceMaxWidth");
        for (let answer of answers) {
            if (answer.querySelector("div.wk_hideCompulsary")) {
                answer.click();
                break;
            }
        }
    }
    window.setTimeout(selectAnswer, Math.random() * 1000 + 1000);
})();