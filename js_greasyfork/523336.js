// ==UserScript==
// @name         教师研修网-自动点击继续计时按钮
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点击“点击我继续”按钮，使用MutationObserver优化
// @author       lodoo + Kimi
// @match        https://ipx.yanxiu.com/grain/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523336/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E8%AE%A1%E6%97%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/523336/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91-%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E8%AE%A1%E6%97%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来检查并点击按钮
    function checkAndClick() {
        // 使用提供的类名找到“继续计时”按钮
        var continueButton = document.querySelector('.yx--alarm-clock');
        if (continueButton) {
            continueButton.click();
            console.log("已自动点击继续计时按钮");
        }
    }

    // 每隔60秒检查一次按钮是否存在
    setInterval(checkAndClick, 60*1000);
})();