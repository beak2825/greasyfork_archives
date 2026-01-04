// ==UserScript==
// @license MIT
// @name         禁用Bilibili首页刷新按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  禁用Bilibili首页的刷新按钮，防沉迷
// @author       BaldPotato & ChatGPT
// @match        https://www.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498681/%E7%A6%81%E7%94%A8Bilibili%E9%A6%96%E9%A1%B5%E5%88%B7%E6%96%B0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/498681/%E7%A6%81%E7%94%A8Bilibili%E9%A6%96%E9%A1%B5%E5%88%B7%E6%96%B0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 选择“换一换”按钮的DOM元素
        const refreshButton = document.querySelector('button.primary-btn.roll-btn');

        // 如果找到了按钮，则禁用它
        if (refreshButton) {
            refreshButton.style.pointerEvents = 'none'; // 禁用点击
            refreshButton.style.opacity = '0.15'; // 改变透明度使其看起来禁用
            console.log('已禁用“换一换”按钮');
        } else {
            console.log('未找到“换一换”按钮');
        }
    });
})();