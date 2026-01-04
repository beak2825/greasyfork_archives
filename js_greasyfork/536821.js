// ==UserScript==
// @name         🥇头歌复制限制解除工具(谷歌版)
// @namespace    https://greasyfork.org/users/1473339
// @version      1.0.1
// @description  ✅ 解锁头歌(Educoder)的右键、复制、选择、粘贴限制，支持自由复制代码与内容，提升学习效率！
// @author       暮辞
// @match        https://www.educoder.net/*
// @icon         https://cdn.jsdelivr.net/gh/muciyoung/picgo_blog@main/uPic/1tab.png
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536821/%F0%9F%A5%87%E5%A4%B4%E6%AD%8C%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%B7%A5%E5%85%B7%28%E8%B0%B7%E6%AD%8C%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536821/%F0%9F%A5%87%E5%A4%B4%E6%AD%8C%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%B7%A5%E5%85%B7%28%E8%B0%B7%E6%AD%8C%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const unlock = () => {
        const events = [
            'copy', 'cut', 'paste', 'selectstart', 'contextmenu',
            'mousedown', 'mouseup', 'keydown', 'keypress', 'dragstart'
        ];

        events.forEach(evt => {
            document.addEventListener(evt, e => e.stopPropagation(), true);
            document[`on${evt}`] = null;
            window[`on${evt}`] = null;
        });

        // 添加允许选择样式
        const style = document.createElement('style');
        style.textContent = `
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
            }
        `;
        document.head.appendChild(style);

        // 再次确保右键启用
        window.oncontextmenu = null;
        document.oncontextmenu = null;

        console.log('✅ [Educoder 解锁] 右键与复制限制已成功解除');
    };

    window.addEventListener('load', () => {
        setTimeout(unlock, 800); // 延迟执行，避免被 Vue 或其它框架重设
    });
})();