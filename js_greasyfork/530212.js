// ==UserScript==
// @name         Bypass Radiko Region Lock
// @namespace    https://radiko.jp/
// @version      1.0
// @description  绕过 Radiko 的地区检测
// @author       YourName
// @match        *://radiko.jp/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530212/Bypass%20Radiko%20Region%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/530212/Bypass%20Radiko%20Region%20Lock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截 geolocation API，强制返回日本坐标（东京）
    navigator.geolocation.getCurrentPosition = function(success, error, options) {
        success({
            coords: {
                latitude: 35.6895,  // 东京纬度
                longitude: 139.6917, // 东京经度
                accuracy: 10
            }
        });
    };

    // 修改 XHR 请求，欺骗服务器
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes("/v2/api/auth1")) {
            console.log("[Radiko Bypass] Spoofing request: " + url);
            this.setRequestHeader("X-Forwarded-For", "103.5.140.1"); // 日本 IP
        }
        open.apply(this, arguments);
    };

})();