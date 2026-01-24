// ==UserScript==
// @name         学习通教师自动批阅
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  学习通批改作业点击ctrl直接触发“提交并进入下一份”
// @author       You
// @match          *://*.chaoxing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/455926/%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E5%B8%88%E8%87%AA%E5%8A%A8%E6%89%B9%E9%98%85.user.js
// @updateURL https://update.greasyfork.org/scripts/455926/%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E5%B8%88%E8%87%AA%E5%8A%A8%E6%89%B9%E9%98%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeyup = function(e) {
        // 兼容FF和IE和Opera
        var event = e || window.event;
        var key = event.which || event.keyCode || event.charCode;

        // 监听 Ctrl 键 (Key Code 17)
        if (key == 17) {
            // 使用 CSS 选择器直接查找带有 onclick="markAction(0)" 的 a 标签
            // 这种方式比遍历所有链接更精准、更快速
            var targetBtn = document.querySelector('a[onclick="markAction(0)"]');

            if (targetBtn) {
                targetBtn.click();
                console.log("检测到Ctrl键，已自动点击提交下一份");
            } else {
                console.log("未找到提交按钮，请检查页面状态");
            }
        }
    };
})();