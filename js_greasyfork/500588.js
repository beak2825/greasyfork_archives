// ==UserScript==
// @name         旧版PN登录
// @namespace    http://tampermonkey.net/
// @version      2024-07-14
// @description  旧版登录
// @author       You
// @match        https://www.westair.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=westair.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500588/%E6%97%A7%E7%89%88PN%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/500588/%E6%97%A7%E7%89%88PN%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
var oldOpen = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function (method, url) {
    var antSelectSelectionItemLi = document.getElementsByClassName("ant-select-selection-item") || [];
    if (antSelectSelectionItemLi.length <= 0) {
        return oldOpen.apply(this, [method, url, !0]);
    }
    var title = antSelectSelectionItemLi[0].title;
    if (title !== '金鹏注册手机号') {
        return oldOpen.apply(this, [method, url, !0]);
    }
    if (method === 'POST' && url === '/air/api/uc/v1/user/ffp/login') {
        console.log("修改请求地址")
        return oldOpen.apply(this, [method, "/air/api/uc/v1/user/authentication", !0])
    }
    return oldOpen.apply(this, [method, url, !0])
}

var oldSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (body) {
    if (body !== null) {
        try {
            var oldBody = JSON.parse(body);
            if (oldBody.hasOwnProperty("number")) {
                body = JSON.stringify({
                    "accountNumber": oldBody.number,
                    "loginType": "PHONE_NUMBER",
                    "password": "SHRsbTEyMzQ="
                })
                console.log("修改请求参数:", body);
            }
        } catch (e) {
        }
    }
    return oldSend.apply(this, [body])
}
})();