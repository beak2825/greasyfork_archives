// ==UserScript==
// @name         Copy to Clipboard Demo
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用 Clipboard API 複製文字到剪貼簿
// @author       你
// @match        https://www.google.com/map*
// @match        https://www.google.com/maps?authuser=0
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536406/Copy%20to%20Clipboard%20Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/536406/Copy%20to%20Clipboard%20Demo.meta.js
// ==/UserScript==

(function () {

    'use strict';
    setTimeout(() => {
    const btn = document.createElement('button');
    btn.textContent = '複製地址';
    btn.style.position = 'fixed';
    btn.style.top = '500px';
    btn.style.left = '5px';
    btn.style.zIndex = 9999;
    btn.style.border = '1.5px solid #000000';
    document.body.appendChild(btn);

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(document.getElementsByClassName('Io6YTe fontBodyMedium kR99db fdkmkc')[0].innerText);
        } catch (err) {
            console.error('複製失敗：', err);
            alert('複製失敗');
        }
    });
}, 100);
    
})();
