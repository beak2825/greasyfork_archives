// ==UserScript==
// @name         DeepSeek 方角化 (Squared)
// @name:zh-CN   DeepSeek 方角化
// @namespace    http://tampermonkey.net/
// @version      2025-01-22
// @description  A very simple and straightforward userscript to remove rounded borders from DeepSeek. It's just personal preference.
// @description:zh-CN 一个简单的用户脚本，用于移除DeepSeek的圆角边框。纯属个人偏好。
// @author       https://github.com/xskutsu
// @match        *://*.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524581/DeepSeek%20%E6%96%B9%E8%A7%92%E5%8C%96%20%28Squared%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524581/DeepSeek%20%E6%96%B9%E8%A7%92%E5%8C%96%20%28Squared%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `* { border-radius: 0 !important; }`;
    document.head.appendChild(style);
})();