// ==UserScript==
// @name         Luogu Discuss Redirect To lglg.top
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在洛谷讨论区页面添加按钮，跳转到 lglg.top 的对应页面。
// @author       wrkwrk
// @license      MIT
// @match        https://www.luogu.com.cn/discuss/*
// @grant        none
// @connect      lglg.top
// @downloadURL https://update.greasyfork.org/scripts/526937/Luogu%20Discuss%20Redirect%20To%20lglgtop.user.js
// @updateURL https://update.greasyfork.org/scripts/526937/Luogu%20Discuss%20Redirect%20To%20lglgtop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前 URL 中的数字部分
    const currentUrl = window.location.href;
    const match = currentUrl.match(/https:\/\/www\.luogu\.com\.cn\/discuss\/(\d+)/);
    if (!match) return; // 如果 URL 不符合预期格式，则直接退出

    const discussId = match[1]; // 提取讨论 ID
    const redirectUrl = `https://lglg.top/${discussId}`; // 构造目标 URL

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '跳转到 lglg.top';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';

    // 添加点击事件
    button.addEventListener('click', () => {
        window.open(redirectUrl, '_blank'); // 在新标签页中打开目标 URL
    });

    // 将按钮添加到页面中
    document.body.appendChild(button);
})();