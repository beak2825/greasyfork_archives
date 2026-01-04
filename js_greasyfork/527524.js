// ==UserScript==
// @name         避免大先生禁止打开控制台
// @namespace    http://tampermonkey.net/
// @version      2025-02-20
// @description  跳过大先生对控制台开启的检测
// @author       You
// @match        https://chat.zju.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zju.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527524/%E9%81%BF%E5%85%8D%E5%A4%A7%E5%85%88%E7%94%9F%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E6%8E%A7%E5%88%B6%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/527524/%E9%81%BF%E5%85%8D%E5%A4%A7%E5%85%88%E7%94%9F%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E6%8E%A7%E5%88%B6%E5%8F%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 创建一个新的 div 元素
    var newElement = document.createElement('div');

    // 设置该元素的 ID
    newElement.id = 'vite-chrome-watone';

    // 设置该元素的 CSS 样式为不可见
    newElement.style.display = 'none';

    // 将该元素添加到页面的 body 中
    document.body.appendChild(newElement);
    
})();