// ==UserScript==
// @name         自动点击导入Clash按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击页面中特定的按钮以执行导入Clash的操作
// @author       Kimi
// @match        *://*/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/504652/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%AF%BC%E5%85%A5Clash%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/504652/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%AF%BC%E5%85%A5Clash%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // 等待页面加载完成后，延迟2秒执行
        setTimeout(function() {
            findAndClickImportButton();
        }, 2000); // 设置2000毫秒的延迟，即2秒
    });

    function findAndClickImportButton() {
        // 找到页面中onclick属性包含'importSublink('clash')'的按钮
        var importButton = document.querySelector('button[onclick*="importSublink(\'clash\')"]');

        // 如果按钮存在，则模拟点击事件
        if (importButton) {
            console.log('找到导入Clash按钮，执行点击操作...');
            importButton.click();
        } else {
            console.error('未找到导入Clash按钮。');
        }
    }
})();