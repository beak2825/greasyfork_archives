// ==UserScript==
// @name         宪法卫士速过练习工具
// @namespace    http://mcskin.cn
// @version      0.1
// @description  快速完善宪法卫士中的练习
// @author       Michael
// @match        https://static.qspfw.moe.gov.cn/xf2022/learn-practice.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moe.gov.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450918/%E5%AE%AA%E6%B3%95%E5%8D%AB%E5%A3%AB%E9%80%9F%E8%BF%87%E7%BB%83%E4%B9%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/450918/%E5%AE%AA%E6%B3%95%E5%8D%AB%E5%A3%AB%E9%80%9F%E8%BF%87%E7%BB%83%E4%B9%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.showAnswer = function() {
        let answer = questionBank_answer;
        $('.item[data-check='+ answer +']').trigger("click");
    }
    setTimeout(function () {
        let oldNext = window.nextQuestion
        window.nextQuestion = function () {
            oldNext();
            showAnswer();
        }
        showAnswer();
    },1000);
})();