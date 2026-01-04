// ==UserScript==
// @name         Cookie Operate
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  在网页上对cookie进行操作
// @author       myaijarvis
// @match        https://www.toutiao.com/*
// @run-at       document-end
// @grant        GM_setClipboard
// @grant        GM_deleteValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/484253/Cookie%20Operate.user.js
// @updateURL https://update.greasyfork.org/scripts/484253/Cookie%20Operate.meta.js
// ==/UserScript==

/*
注意：
document.cookie 只能获取当前页面可见的 cookie，它不包括 HTTP-only cookies、Secure cookies、以及其他域的 cookies。这是出于安全和隐私的考虑，防止通过脚本获取敏感信息。
在页面上，通过 JavaScript 访问的 cookie 主要受到 SameSite 属性和 HTTP-only 属性的限制。SameSite 属性规定了 cookie 是否可以随着跨站请求发送，而 HTTP-only 属性则禁止通过脚本访问 cookie。
如果你需要获取所有 cookie，包括 HTTP-only 的和其他域的，一种方法是通过浏览器的开发者工具查看。在 Chrome 浏览器中，你可以按 F12 打开开发者工具，然后切换到 "Application" 或 "Storage" 标签，查看 "Cookies" 部分。
*/
(function() {
    'use strict';

    // 添加一个输入框用于输入cookie的key
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = '输入cookie的key';
    keyInput.style.position = 'fixed';
    keyInput.style.top = '50px';
    keyInput.style.left = '10px';
    keyInput.style.zIndex = '10000';
    keyInput.value='';
    document.body.appendChild(keyInput);

    // 添加一个按钮用于获取cookie值
    const getCookieBtn = document.createElement('button');
    getCookieBtn.textContent = '获取Cookie值';
    getCookieBtn.style.position = 'fixed';
    getCookieBtn.style.top = '90px';
    getCookieBtn.style.left = '10px';
    getCookieBtn.style.zIndex = '10000';
    getCookieBtn.addEventListener('click', function() {
        const key = keyInput.value.trim();
        const cookieValue = getCookie(key);
        alert(`Cookie值为：${cookieValue}`);
    });
    document.body.appendChild(getCookieBtn);

    // 添加一个按钮用于复制cookie值
    const copyCookieBtn = document.createElement('button');
    copyCookieBtn.textContent = '复制Cookie值';
    copyCookieBtn.style.position = 'fixed';
    copyCookieBtn.style.top = '110px';
    copyCookieBtn.style.left = '10px';
    copyCookieBtn.style.zIndex = '10000';
    copyCookieBtn.addEventListener('click', function() {
        const key = keyInput.value.trim();
        const cookieValue = getCookie(key);
        GM_setClipboard(cookieValue);
        alert('Cookie值已复制到剪贴板');
    });
    document.body.appendChild(copyCookieBtn);

    // 添加一个按钮用于删除cookie键值
    const deleteCookieBtn = document.createElement('button');
    deleteCookieBtn.textContent = '删除Cookie值';
    deleteCookieBtn.style.position = 'fixed';
    deleteCookieBtn.style.top = '140px';
    deleteCookieBtn.style.left = '10px';
    deleteCookieBtn.style.zIndex = '10000';
    deleteCookieBtn.addEventListener('click', function() {
        const key = keyInput.value.trim();
        deleteCookie(key);
        alert('Cookie键值已删除');
    });
    document.body.appendChild(deleteCookieBtn);

    // 获取指定key的cookie值
    function getCookie(key) {
        const cookies = document.cookie.split(';');
        console.log(cookies)
        for (const cookie of cookies) {
            const [cookieKey, cookieValue] = cookie.split('=');
            if (cookieKey.trim() === key) {
                return cookieValue;
            }
        }
        return null;
    }

    // 删除指定key的cookie键值
    function deleteCookie(key) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }


})();
