// ==UserScript==
// @name         GPT 放大宽度
// @namespace    http://tampermonkey.net/
// @version      2024-02-03
// @description  GPT 放大宽度,自动适配网页最大值大小
// @author       wrldhorse
// @match        https://chat.openai.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486393/GPT%20%E6%94%BE%E5%A4%A7%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/486393/GPT%20%E6%94%BE%E5%A4%A7%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';

    // Your code here...
    // 创建一个新的样式规则
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(''));

    // 将新的样式规则添加到head中
    document.head.appendChild(newStyle);

    // 获取样式表
    var styleSheet = newStyle.sheet;

    // 在样式表中插入新的规则
    styleSheet.insertRule('@media (min-width: 1280px) { .xl\\:max-w-\\[48rem\\] { max-width: 1000rem !important; } }', 0);
})();