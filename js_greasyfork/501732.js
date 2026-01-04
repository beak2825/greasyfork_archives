// ==UserScript==
// @name         等级查看
// @namespace    http://tampermonkey.net/
// @version      2024-07-25
// @description  一个简单的查询等级入口
// @author       ziye
// @match        https://linux.do/
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501732/%E7%AD%89%E7%BA%A7%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/501732/%E7%AD%89%E7%BA%A7%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取目标元素
    var targetElement = document.querySelectorAll('.d-header .icons')[0];

    if(!targetElement) return

    // 创建新的链接元素
    var newLink = document.createElement('a');
    newLink.alt = '查看等级'
    newLink.href = 'https://connect.linux.do';
    newLink.target = '_blank'; // 可选：在新标签页中打开链接

    // 创建新的等级图标元素
    var newIcon = document.createElement('span');
    newIcon.classList.add('icon', 'rank-icon'); // 添加必要的类名
    newIcon.innerHTML = '⭐'; // 你可以用实际的图标或图标字体

    // 将图标元素添加到链接元素中
    newLink.appendChild(newIcon);

    // 将新的链接元素插入到目标元素下
    targetElement.appendChild(newLink);
})();