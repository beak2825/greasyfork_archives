// ==UserScript==
// @name         为 poe.com 设置并锁定 Cookie
// @namespace    https://poe.com/
// @version      0.3
// @description  为 poe.com 域名下的所有网页设置并锁定特定的 Cookie
// @author        小月
// @match        https://*.poe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466912/%E4%B8%BA%20poecom%20%E8%AE%BE%E7%BD%AE%E5%B9%B6%E9%94%81%E5%AE%9A%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/466912/%E4%B8%BA%20poecom%20%E8%AE%BE%E7%BD%AE%E5%B9%B6%E9%94%81%E5%AE%9A%20Cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从本地存储中加载上次保存的 Cookie 值
    const lastCookieValue = localStorage.getItem('lockedCookieValue');

    // 创建一个锁定 Cookie 的函数
    function lockCookie(cookieValue) {
        document.cookie = `p-b=${cookieValue}; max-age=${60 * 60 * 24 * 365}; path=/; domain=.poe.com;`;

        // 通过将其设置为只读来锁定 Cookie
        Object.defineProperty(document, 'cookie', {
            get: function() { return `p-b=${cookieValue};`; },
            set: function() { return true; }
        });

        // 将锁定的 Cookie 值保存到本地存储
        localStorage.setItem('lockedCookieValue', cookieValue);
    }

    // 创建对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border: 1px solid black; z-index: 9999;';
    dialog.innerHTML = `
        <div style="color: red; font-weight: bold;">
            欢迎➕群714397129
        </div>
        <div>
            请输入新的 Cookie 值：
            <input type="text" id="newCookieValue" style="width: 100%;" />
        </div>
        <div style="margin-top: 10px;">
            <button id="setAndLock">是</button>
            <button id="useLast">否</button>
            <button id="joinGroup">加群</button>
        </div>
    `;
    document.body.appendChild(dialog);

    // 为按钮设置事件监听器
    document.getElementById('setAndLock').addEventListener('click', function() {
        const newValue = document.getElementById('newCookieValue').value;
        lockCookie(newValue);
        alert('Cookie 锁定成功！');
        location.reload();
        dialog.remove();
    });

    document.getElementById('useLast').addEventListener('click', function() {
        if (lastCookieValue) {
            lockCookie(lastCookieValue);
        }
        dialog.remove();
    });

    document.getElementById('joinGroup').addEventListener('click', function() {
        window.location.href = 'https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=N-21YKymkTrfF4yM5L2nE581my5t9CDz&authKey';
    });

})();