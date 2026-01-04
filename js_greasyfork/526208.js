// ==UserScript==
// @name         简洁网页翻译助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  单击按钮即可将当前页面翻译成中文（使用 Google 翻译）
// @author       你的名字
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526208/%E7%AE%80%E6%B4%81%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526208/%E7%AE%80%E6%B4%81%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标语言为中文
    const targetLang = 'zh-CN';

    // 创建一个简洁的翻译按钮
    const btn = document.createElement('button');
    btn.innerText = '翻译';
    btn.style.position = 'fixed';
    btn.style.bottom = '10px';
    btn.style.right = '10px';
    btn.style.padding = '5px 10px';
    btn.style.fontSize = '14px';
    btn.style.zIndex = 9999;
    btn.style.background = 'rgba(255, 255, 255, 0.8)';
    btn.style.border = '1px solid #ccc';
    btn.style.borderRadius = '3px';
    btn.style.cursor = 'pointer';

    document.body.appendChild(btn);

    // 点击按钮后跳转至 Google 翻译页面，将当前页面翻译为中文
    btn.addEventListener('click', function() {
        const translateUrl = `https://translate.google.com/translate?hl=zh-CN&sl=auto&tl=${targetLang}&u=${encodeURIComponent(window.location.href)}`;
        window.location.href = translateUrl;
    });
})();