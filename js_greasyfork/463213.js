"use strict";
// ==UserScript==
// @name         AI-Bot跳转地址转换
// @namespace    https://raw.githubusercontent.com/Fog3211/tampermonkey/gh-pages/ai-bot-link.js
// @version      0.0.2
// @license      MIT
// @description   在ai-bot.cn跳转地址转换
// @author       Fog3211
// @match      https://ai-bot.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463213/AI-Bot%E8%B7%B3%E8%BD%AC%E5%9C%B0%E5%9D%80%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/463213/AI-Bot%E8%B7%B3%E8%BD%AC%E5%9C%B0%E5%9D%80%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const links = document.querySelectorAll('a.card');
    links.forEach(link => {
        const targetUrl = link.getAttribute('data-url');
        const href = link.getAttribute('href');
        if (targetUrl && href) {
            link.setAttribute('href', targetUrl);
            link.setAttribute('data-href', href);
        }
    });
})();
