// ==UserScript==
// @name         Youdao-Translate-Auto-Input
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Tebayaki
// @match        https://fanyi.youdao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youdao.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539221/Youdao-Translate-Auto-Input.user.js
// @updateURL https://update.greasyfork.org/scripts/539221/Youdao-Translate-Auto-Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从URL中获取参数t的值
    function getQueryParam(name) {
        const url = window.location.href;
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);
        if (!results || !results[2]) return null;
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function fillInput(input, text) {
        input.textContent = text;
        // 触发输入事件以确保翻译
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }

    // 等待输入框出现并填充文本
    function waitAndFillInput() {
        const text = getQueryParam('t');
        if (!text) return;

        // 观察DOM变化，等待输入框加载
        const observer = new MutationObserver(function(mutations, obs) {
            const input = document.querySelector('#js_fanyi_input');
            if (input) {
                // 停止观察
                fillInput(input, text);
                obs.disconnect();
            }
        });

        // 开始观察整个body的子元素变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 设置超时，防止无限等待
        setTimeout(() => observer.disconnect(), 10000);
    }

    waitAndFillInput();
})();
