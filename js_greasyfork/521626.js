// ==UserScript==
// @name         企鹅标注复查上一页快捷键
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  给上一页添加快捷键
// @author       Jiyao
// @match        https://qlabel.tencent.com/workbench/tasks/*
// @license      AGPL-3.0
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/521626/%E4%BC%81%E9%B9%85%E6%A0%87%E6%B3%A8%E5%A4%8D%E6%9F%A5%E4%B8%8A%E4%B8%80%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/521626/%E4%BC%81%E9%B9%85%E6%A0%87%E6%B3%A8%E5%A4%8D%E6%9F%A5%E4%B8%8A%E4%B8%80%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 监听键盘事件
    document.addEventListener('keydown', function (e) {
        // 检查是否按下了Ctrl+Q
        if (e.ctrlKey && e.key === 'q') {
            // 阻止默认行为（比如在某些输入框中Ctrl+Q可能有默认操作）
            e.preventDefault();

            // 查找class为ivu - page - prev的元素
            var targetElement = document.querySelector('.ivu - page - prev');
            if (targetElement) {
                // 这里可以根据需求对元素进行操作，比如模拟点击
                targetElement.click();
            }
        }
    });
})();