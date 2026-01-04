// ==UserScript==
// @name         ChatGPT国内极速无广告访问
// @namespace    https://chat.ichen.ink/
// @version      1.0.3
// @description  适用于许多国内访问速度较慢的用户，可以加快页面加载速度并提高聊天室的稳定性。
// @author       阿晨
// @include      *://*.baidu.com/*
// @include      *://*.sogou.com/*
// @include      *://*.so.com/*
// @include      *://*.lcxlh.com/*
// @include      *://*.qwant.com/*
// @include      *://*.bing.com/*
// @match        *://*.baidu.com/*
// @match        *://*.sogou.com/*
// @match        *://*.so.com/*
// @match        *://*.lcxlh.com/*
// @match        *://*.qwant.com/*
// @match        *://*.bing.com/*
// @match        *://*.soso.com/*
// @match        *://*.chinaso.com*
// @match        *://*.maigoo.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464498/ChatGPT%E5%9B%BD%E5%86%85%E6%9E%81%E9%80%9F%E6%97%A0%E5%B9%BF%E5%91%8A%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/464498/ChatGPT%E5%9B%BD%E5%86%85%E6%9E%81%E9%80%9F%E6%97%A0%E5%B9%BF%E5%91%8A%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const jumpUrl = 'https://chat.ichen.ink';
const jumpWords = [
    'chatgpt加速',
    '聊天机器人',
    'chatgpt国内极速访问',
    'chatgpt',
    'chat加速',
    '智能ai',
    'chat',
].map(word => word.toLowerCase());
    const currentUrl = location.href;
    const currentHost = location.host;
    let inputElement;

    if (currentHost.includes('baidu.com')) {
        inputElement = document.getElementById('kw');
    } else if (currentHost.includes('sogou.com')) {
        inputElement = document.getElementById('upquery');
    }
    inputElement?.addEventListener('input', function (e) {
        const currentValue = e.target.value.trim().toLowerCase();
        jumpWords.forEach((word) => {
            if (currentValue.includes(word)) {
                window.location.replace(jumpUrl);
            }
        });
    });
})();
