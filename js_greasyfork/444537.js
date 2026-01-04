// ==UserScript==
// @name         香蕉工具
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  内部香蕉工具使用
// @author       ka1D0u
// @match        http://bianque.al.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444537/%E9%A6%99%E8%95%89%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/444537/%E9%A6%99%E8%95%89%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';


    setTimeout(() => {
        let roleKey = "monitor-login-role";
        let tokenKey = "manager-token";
        let userKey = "monitor-login-user"

        var cookie = window.Cookies.get()

        var role = cookie[roleKey]
        var user = cookie[userKey]
        var managerToken = cookie[tokenKey]

        var tokenDict = {};

        tokenDict[tokenKey] = managerToken;

        if (role != undefined) {
            tokenDict[roleKey] = encodeURI(role);
        };
        if (user != undefined) {
            tokenDict[userKey] = encodeURI(user);
        };

        var token = btoa(JSON.stringify(tokenDict));

        var btn = document.createElement('button');
        btn.id = "token-open-btn";
        btn.textContent = "香蕉!";
        btn.style.backgroundColor = "#ffea49";
        btn.style.border = "1px solid #ffea49";
        btn.style.color = "#000";
        btn.style.margin = "10px";
        btn.onclick = function () {
            window.open(
                `http://127.0.0.1:8110/#?token=${token}`

            )
        };

        var btn2 = document.createElement('button');
        btn2.id = "token-clipboard-btn";
        btn2.textContent = "复制";
        btn2.style.backgroundColor = "#ffea49";
        btn2.style.border = "1px solid #ffea49";
        btn2.style.color = "#000";
        btn2.style.margin = "10px";


        var btn3 = document.createElement('button');
        btn3.id = "token-open-btn";
        btn3.textContent = "香蕉Plus!";
        btn3.style.backgroundColor = "#ffea49";
        btn3.style.border = "1px solid #ffea49";
        btn3.style.color = "#000";
        btn3.style.margin = "10px";
        btn3.onclick = function () {
            window.open(
                `sixplus://bianque|${token}`

            )
        };

        var clipboard = new ClipboardJS(
            '#token-clipboard-btn', {
                text: function(trigger) {
                    return token
                }
            });

        clipboard.textContent = "Token";
        clipboard.on('success', function(e) {
            console.info('Token:', e.text);
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            console.error('Error Action:', e.action);
        });

        var path_ = "#popContainer > section > section > main > div > div.tabs-view-content.mix.fixed > div > div > div.page-content.mix.fixed > div > div > div.page-header.mix.fixed"

        document.querySelector(
            path_).appendChild(
                btn
            );
        document.querySelector(
                path_).appendChild(
                    btn2
                )
        document.querySelector(
                path_).appendChild(
                    btn3
                )
    }, 500);
})();