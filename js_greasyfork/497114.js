// ==UserScript==
// @name         亿破姐自动完成加法验证
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  亿破姐自动完成加法验证.
// @author       Kimi
// @match        *://www.ypojie.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497114/%E4%BA%BF%E7%A0%B4%E5%A7%90%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%8A%A0%E6%B3%95%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/497114/%E4%BA%BF%E7%A0%B4%E5%A7%90%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E5%8A%A0%E6%B3%95%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取加法表达式中的数字
    const expression = document.querySelector('.label').textContent;
    const numbers = expression.match(/\d+/g);

    // 计算结果
    const result = parseInt(numbers[0], 10) + parseInt(numbers[1], 10);

    // 填写结果并提交表单
    document.querySelector('.input').value = result;
    document.querySelector('.btn').click();
})();