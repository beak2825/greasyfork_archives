// ==UserScript==
// @name         BCCZCS.COM校对冷却禁用
// @namespace    https://github.com/tony6960/bcczcs_no_sleep_script/
// @version      0.1
// @description  disable bcczcs.com's pracitce wrong time sleep
// @author       drank
// @match        https://bcczcs.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496834/BCCZCSCOM%E6%A0%A1%E5%AF%B9%E5%86%B7%E5%8D%B4%E7%A6%81%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/496834/BCCZCSCOM%E6%A0%A1%E5%AF%B9%E5%86%B7%E5%8D%B4%E7%A6%81%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来启用按钮并更改其文本
    function enableAndChangeButton() {
        $("#ckanswerBtn").prop("disabled", false).val("校对答案");
        $("#nextQuestion").show().focus();
        wrongAnswer=false;
    }

    // 每秒执行一次 enableAndChangeButton 函数
    setInterval(enableAndChangeButton, 100);
})();
