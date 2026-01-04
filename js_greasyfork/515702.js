// ==UserScript==
// @name         华北理工大学校园网自动登录
// @namespace    Giocatore
// @version      1.0
// @description  【华北理工大学校园网自动登录】
// @author       Giocatore
// @match      http://172.30.0.11/*
// @match      http://172.30.0.11/eportal/index.jsp?wlanuserip=6f0abb747872ebf9ab54c8893f62d0ea&wlanacname=cee24f8cac61aac95ac37f8c286d8295&ssid=&nasip=fc7e443a4fb0d3d2aa6fa026e7617dfe&mac=1670fd5ec15f7a5a8ff7a4be521247c6&t=wireless-v2&url=ee87b1634742a905d3bcaa94ab6f72ecb6810fb1e1bcd8cb
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515702/%E5%8D%8E%E5%8C%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/515702/%E5%8D%8E%E5%8C%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const username = "username";
    const password = "password";

    function autoLogin() {
        const accountInput = document.querySelector('input[type="text"]');
        const passwordInput = document.querySelector('input[type="password"]');
        const loginButton = document.getElementById('loginLink');

        // 自动点击登录链接
        if (accountInput && passwordInput && loginButton) {
            accountInput.value = username;
            passwordInput.value = password;
            loginButton.click();
        } else {
            console.error("Login elements not found");
        }
    }

    window.addEventListener('load', autoLogin);
})();
