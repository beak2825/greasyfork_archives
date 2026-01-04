// ==UserScript==
// @name         韶关学院评教2
// @namespace    http://your.namespace.com
// @version      0.1
// @description  在Textarea自动填入文本
// @match        https://yjcg.webvpn.sgu.edu.cn/pj/Student/*
// @match        https://yjcg.webvpn.sgu.edu.cn/pj/Student/PJStandard.aspx?sqid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497710/%E9%9F%B6%E5%85%B3%E5%AD%A6%E9%99%A2%E8%AF%84%E6%95%992.user.js
// @updateURL https://update.greasyfork.org/scripts/497710/%E9%9F%B6%E5%85%B3%E5%AD%A6%E9%99%A2%E8%AF%84%E6%95%992.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function fillTextAreaAndSubmit() {
        var textToFill = '老师人很好'; // 要填入的文本
        var textArea = document.getElementById('TxtPcontent'); // 找到<textarea>元素
        var submitButton = document.getElementById('LinkButtonPJ'); // 找到提交按钮
        var exitButton = document.getElementById('LinkButtonfq'); // 找到退出按钮

        if (textArea && submitButton && exitButton) {
            // 设置<textarea>的值为指定的文本
            textArea.value = textToFill;

            // 模拟点击提交按钮
            submitButton.click();

            // 延迟500毫秒后点击退出按钮
            setTimeout(function() {
                exitButton.click();
            }, 200); // 这里设置了延迟时间为500毫秒
        }
    }

    // 在页面加载后自动执行
    window.addEventListener('load', function() {
        fillTextAreaAndSubmit();
    });
})();

