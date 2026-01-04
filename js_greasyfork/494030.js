// ==UserScript==
// @name         一块钱快速登录
// @namespace    http://tampermonkey.net/
// @version      2024-05-03
// @description  自动点击同济统一验证的登录按钮
// @author       Melonedo
// @license      GPL
// @match        https://iam.tongji.edu.cn/idp/authcenter/ActionAuthChain*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongji.edu.cn
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/494030/%E4%B8%80%E5%9D%97%E9%92%B1%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/494030/%E4%B8%80%E5%9D%97%E9%92%B1%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const loginButton = document.querySelector('#loginButton');
    if (!loginButton) return;
    setInterval(() => {
        loginButton.click();
    }, 1000);
})();