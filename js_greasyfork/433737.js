// ==UserScript==
// @name         随机金额生成器
// @namespace    http://your-homepage.com/
// @version      0.1.1
// @description  生成一个随机金额并在网页上显示，并提供一个复制按钮
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/433737/%E9%9A%8F%E6%9C%BA%E9%87%91%E9%A2%9D%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/433737/%E9%9A%8F%E6%9C%BA%E9%87%91%E9%A2%9D%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简单的线性同余生成器
    function LCG(seed) {
        return function() {
            seed = Math.imul(48271, seed) | 0 % 2147483647;
            return (seed & 2147483647) / 2147483648;
        };
    }

    // 使用当前时间作为种子
    var seed = Date.now();
    var random = LCG(seed);

    // 生成随机金额并保留两位小数
    var min = 1;
    var max = 1000;
    var money = (random() * (max - min) + min).toFixed(2);

    // 创建一个新的div元素，并设置其内容为随机金额
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.bottom = '10px';
    div.style.right = '10px';  // 修改这里
    div.style.zIndex = 9999;
    div.style.padding = '10px';
    div.style.backgroundColor = 'white';
    div.style.border = '1px solid black';

    // 创建一个新的按钮元素，用于复制随机金额
    var button = document.createElement('button');
    button.textContent = '复制金额';
    button.onclick = function() {
        GM_setClipboard(money, 'text');
        button.disabled = true;  // 添加这一行来禁用按钮
    };

    // 将按钮添加到div中
    div.appendChild(button);

    // 创建一个新的span元素，并设置其内容为随机金额
    var span = document.createElement('span');
    span.textContent = ' 随机金额：' + money;

    // 将span添加到div中
    div.appendChild(span);

    // 将新创建的div添加到网页上
    document.body.appendChild(div);
})();