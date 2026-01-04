// ==UserScript==
// @name         Discord Token Login
// @description  使用Discord Token登录帐户更容易。
// @author       wzshjm
// @version      1.0
// @license      GPL-3.0
// @namespace    https://github.com/wzhjm/
// @match        *://*.discord.com/*
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com&sz=256
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496436/Discord%20Token%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/496436/Discord%20Token%20Login.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function setDiscordToken(token) {
        setInterval(() => {
            let frame = document.createElement("iframe");
            document.body.appendChild(frame)
                .contentWindow.localStorage.token = '"' + token + '"';
        }, 50);
        setTimeout(() => { location.href = "/app"; }, 1000);
    }
    function inputTokenLogin() {
        let token = prompt("请输入Discord Token进行登录:", "");
        if (token) {
            setDiscordToken(token);
        }
    }
    // 函数：注册菜单项
    function registerMenu() {
        GM_registerMenuCommand("Token登录", inputTokenLogin, 't');
    }
    // 初始菜单注册
    registerMenu();
})();