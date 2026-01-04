// ==UserScript==
// @name         海胆删除收件箱
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  海胆删除收件箱信息，邮箱信息太多，自动删除
// @author       ByZ
// @match        https://www.haidan.video/messages.php?action=viewmailbox
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haidan.video
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504346/%E6%B5%B7%E8%83%86%E5%88%A0%E9%99%A4%E6%94%B6%E4%BB%B6%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/504346/%E6%B5%B7%E8%83%86%E5%88%A0%E9%99%A4%E6%94%B6%E4%BB%B6%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 封装点击操作为返回Promise的函数
        function clickWithPromise(selector) {
            return new Promise((resolve) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.click();
                    console.log(`找到并点击了 ${selector}`);
                    resolve(); // 点击后解决Promise
                } else {
                    console.error(`未找到元素 ${selector}`);
                    resolve(); // 即使未找到元素，也解决Promise
                }
            });
        }

        // 使用Promise执行第一个操作，然后在第一个操作完成后执行第二个操作
        clickWithPromise('body > div.mainroute > div.mainpanel.special-border > form:nth-child(13) > table > tbody > tr.colhead > td > input:nth-child(1)')
            .then(() => {
            // 第一个操作完成后，执行第二个操作
            return clickWithPromise('body > div.mainroute > div.mainpanel.special-border > form:nth-child(13) > table > tbody > tr.colhead > td > input:nth-child(3)');
        })
            .then(() => {
            console.log('两个操作都完成了');
        })
            .catch((error) => {
            console.error('发生错误:', error);
        });
    });
})();