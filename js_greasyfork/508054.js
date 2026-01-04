// ==UserScript==
// @name         9dn验证码计算器
// @namespace    http://tampermonkey.net/
// @version      2024-09-28
// @description  9dn验证码计算器-
// @author       zzz1
// @match        http://www.9dmgamemod.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9dmgamemod.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508054/9dn%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/508054/9dn%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let num1 = parseInt(document.getElementById('num1').textContent);
    let num2 = parseInt(document.getElementById('num2').textContent);
    let inp1 = document.getElementById('inp1');

    // 将 num1 和 num2 的值转换为数字并计算它们的和
    let sum = num1 + num2;

    // 将结果输出到 inp1 中
    inp1.value = sum;

    // 键盘事件对象，模拟回车键
    let event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
    });

    // 触发输入框的键盘事件
    inp1.dispatchEvent(event);
})();