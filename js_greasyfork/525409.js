// ==UserScript==
// @name         暗黑核取消滚动框
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  去除暗黑核说明部分的滚动条以直接展示
// @author       Hayami_hikaru(代码使用DeepSeek生成)
// @match        https://*.d2core.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525409/%E6%9A%97%E9%BB%91%E6%A0%B8%E5%8F%96%E6%B6%88%E6%BB%9A%E5%8A%A8%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/525409/%E6%9A%97%E9%BB%91%E6%A0%B8%E5%8F%96%E6%B6%88%E6%BB%9A%E5%8A%A8%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置定时器
    const intervalId = setInterval(() => {
        // 查找 class 为 van-collapse-item__content 的元素
        const targetElement = document.querySelector('.van-collapse-item__content');

        if (targetElement) {
            // 移除 class
            targetElement.removeAttribute('class');

            // 清除定时器
            clearInterval(intervalId);

            console.log('已移除 class 并清除定时器');
        }
    }, 1000); // 每隔 1000 毫秒（1 秒）执行一次
})();