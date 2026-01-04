// ==UserScript==
// @name         隐藏继续使用 Google 搜索前须知
// @version      1.0
// @description  隐藏继续使用 Google 搜索前须知的弹出提示
// @author       ChatGPT
// @match        *://www.google.co.jp/*
// @match        *://www.google.com.hk/*
// @match        *://www.google.com/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/502851/%E9%9A%90%E8%97%8F%E7%BB%A7%E7%BB%AD%E4%BD%BF%E7%94%A8%20Google%20%E6%90%9C%E7%B4%A2%E5%89%8D%E9%A1%BB%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/502851/%E9%9A%90%E8%97%8F%E7%BB%A7%E7%BB%AD%E4%BD%BF%E7%94%A8%20Google%20%E6%90%9C%E7%B4%A2%E5%89%8D%E9%A1%BB%E7%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个计数器，用来记录执行次数
    let count = 0;

    // 设置定时器，每隔300毫秒执行一次
    let intervalId = setInterval(function() {
        // 执行的脚本逻辑
        document.querySelectorAll('button, a').forEach(element => {
            if (element.textContent.includes('继续阅读') || element.textContent.includes('全部拒绝')) {
                element.click();
            }
        });

        // 每执行一次计数器加1
        count++;

        // 如果执行了10次，清除定时器
        if (count === 10) {
            clearInterval(intervalId);
        }
    }, 300);

    // 添加隐藏元素的样式
    let style = document.createElement('style');
    style.innerHTML = `[aria-label='继续使用 Google 搜索前须知'] {display: none !important; visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px;}`;
    document.head.appendChild(style);

})();
