// ==UserScript==
// @name         维基百科随机页面跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在维基百科中添加一个随机页面跳转按钮
// @author       YourName
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479214/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E9%9A%8F%E6%9C%BA%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/479214/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E9%9A%8F%E6%9C%BA%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    var randomPageButton = document.createElement('button');
    randomPageButton.innerHTML = '随机页面';
    randomPageButton.style.position = 'fixed';
    randomPageButton.style.top = '10px';
    randomPageButton.style.right = '10px';
    randomPageButton.style.zIndex = '10000';

    // 绑定点击事件到按钮
    randomPageButton.addEventListener('click', function() {
        // 跳转到维基百科的“随机页面”
        window.location.href = '/wiki/Special:Random';
    });

    // 将按钮添加到页面
    document.body.appendChild(randomPageButton);
})();
