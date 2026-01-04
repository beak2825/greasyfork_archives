// ==UserScript==
// @name         Qwen.ai CodeBlock Font Fix (No More Serif)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  让 Qwen Chat 代码快使用非衬线字体, 让代码快更加美观易读. Use sans-serif fonts to make the Qwen Chat code block more aesthetically pleasing and readable
// @author       DBin_K
// @match        https://chat.qwen.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534347/Qwenai%20CodeBlock%20Font%20Fix%20%28No%20More%20Serif%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534347/Qwenai%20CodeBlock%20Font%20Fix%20%28No%20More%20Serif%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 设置目标字体
    const monoFont = '"Lucida Console", Consolas';

    // 创建 <style> 标签
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .ͼ1 .cm-scroller {
            font-family: ${monoFont} !important;
        }
    `;

    // 插入到 <head> 中生效
    document.head.appendChild(style);
})();