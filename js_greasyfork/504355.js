// ==UserScript==
// @name         大聪明删除收件箱信息
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  大聪明删除收件箱信息，点开收件箱页面然后会自动勾选删除，页面挂着就好了
// @author       ByZ
// @match        https://hhanclub.top/messages.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hhanclub.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504355/%E5%A4%A7%E8%81%AA%E6%98%8E%E5%88%A0%E9%99%A4%E6%94%B6%E4%BB%B6%E7%AE%B1%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/504355/%E5%A4%A7%E8%81%AA%E6%98%8E%E5%88%A0%E9%99%A4%E6%94%B6%E4%BB%B6%E7%AE%B1%E4%BF%A1%E6%81%AF.meta.js
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
        clickWithPromise('#mainContent > div > div > div > form > div.flex.flex-row.items-center > div:nth-child(2) > div:nth-child(1) > input')
            .then(() => {
            // 第一个操作完成后，执行第二个操作
            return clickWithPromise('#mainContent > div > div > div > form > div.flex.flex-row.items-center > div:nth-child(2) > div:nth-child(3) > input');
        })
            .then(() => {
            console.log('两个操作都完成了');
        })
            .catch((error) => {
            console.error('发生错误:', error);
        });
    });
})();