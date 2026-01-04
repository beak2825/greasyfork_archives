// ==UserScript==
// @name         ECUSTAI发送cookies
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get website cookies and generate a link to send them
// @author       Your Name
// @match        *://ai.s.ecust.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514184/ECUSTAI%E5%8F%91%E9%80%81cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/514184/ECUSTAI%E5%8F%91%E9%80%81cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网站的 Cookie
    const cookies = encodeURIComponent(document.cookie); // 对 Cookie 进行编码

    // 生成链接
    const link = `https://ai.bestzyq.cn/cookies.php?cookies=${cookies}`;

    // 创建链接元素并添加到页面
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = '点击这里发送 Cookies';
    linkElement.style.display = 'block'; // 让链接在新行显示
    linkElement.target = '_blank'; // 在新标签页打开链接

    // 将链接添加到页面的 body
    document.body.appendChild(linkElement);
})();
