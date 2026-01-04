// ==UserScript==
// @name         调试css样式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击页面切换是否显示所有元素的边框（outline: 1px solid tomato）
// @author       gavin-johnson
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540406/%E8%B0%83%E8%AF%95css%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/540406/%E8%B0%83%E8%AF%95css%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STYLE_ID = 'debug-outline-style';

    function toggleOutline() {
        const existing = document.getElementById(STYLE_ID);
        if (existing) {
            existing.remove(); // 取消边框显示
        } else {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `* { outline: 1px solid tomato !important; }`;
            document.head.appendChild(style);
        }
    }

    // 你可以更换为其他触发方式，例如快捷键（详见下方扩展）
    document.addEventListener('click', (e) => {
        if (e.ctrlKey && e.shiftKey) { // Ctrl + Shift + 点击页面任意位置时生效
            toggleOutline();
        }
    });

})();
