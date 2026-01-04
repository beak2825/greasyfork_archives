// ==UserScript==
// @name         Cookie VIE
// @namespace    https://github.com/RashidaKAKU
// @version      1.0
// @description  查看当前页面的 cookie 值并复制到剪贴板
// @author       Rashida
// @match        *://*/*
// @icon         https://github.com/RashidaKAKU/Tampermonkey-script/blob/main/Cookie%20VIE/cookie.png
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464422/Cookie%20VIE.user.js
// @updateURL https://update.greasyfork.org/scripts/464422/Cookie%20VIE.meta.js
// ==/UserScript==

// 警告：此脚本可以访问您在当前页面的所有 Cookie 信息。
// 警告：请不要在不可信的网站上使用此脚本，并在使用后记得删除。
// 警告：在获取 cookie 值时需要注意隐私和安全问题，同时也需要遵守网站的用户协议和隐私政策。请不要尝试绕过浏览器的限制或者使用未经授权的技术或工具来获取 Cookie 值。如果您有任何疑问，请联系网站管理员或者开发人员。

// 此注释用来测试 github 与 greasy fork 的自动更新

(function() {
    'use strict';

    // 创建一个按钮来显示 cookie
    var button = document.createElement('button');
    button.textContent = '查看 Cookie';
    button.style.position = 'fixed'; // 固定定位
    button.style.bottom = '10px'; // 距离底部 10 像素
    button.style.right = '10px'; // 距离右边 10 像素
    button.style.zIndex = '9999'; // 按钮在最上面
    document.body.appendChild(button); // 将按钮添加到页面中

    // 点击按钮后显示并复制 cookie 值
    button.addEventListener('click', function() {
        // 获取当前页面的所有 cookie，并将它们转换成对象格式
        var cookies = document.cookie.split(';');
        var cookieObj = {};
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].split('=');
            cookieObj[cookie[0].trim()] = cookie[1].trim();
        }
        // 将 cookie 值转换成字符串格式并复制到剪贴板中
        var cookieStr = '';
        for (var key in cookieObj) {
            cookieStr += key + '=' + cookieObj[key] + '; ';
        }
        GM_setClipboard(cookieStr); // 复制到剪贴板

        // 在警告框中显示已复制的 cookie 值
        alert('已复制 cookie 到剪贴板。请不要在不可信的网站上使用此脚本，并在使用后记得删除。\n\n' + cookieStr);
    });
})();