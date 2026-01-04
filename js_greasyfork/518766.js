// ==UserScript==
// @name         自动签到脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动签到并在完成后跳转到另一个网址
// @author       Gommn
// @match        https://www.xianyudanji.net/user
// @match        https://www.switch520.org/user
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518766/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518766/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 查找签到按钮并点击
        var signButton = document.querySelector('button:contains("每日签到")');
        if (signButton) {
            signButton.click();

            // 监听按钮文字变化
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.target.textContent.includes('今日已签到')) {
                        // 签到完成后跳转到另一个网址
                        window.location.href = 'https://www.switch520.org/user';
                        observer.disconnect(); // 停止观察
                    }
                });
            });

            // 开始观察按钮文字变化
            observer.observe(signButton, { characterData: true, subtree: true });
        }
    });
})();