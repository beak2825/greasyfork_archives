// ==UserScript==
// @name         AmapLoginAssist - 高德地图Web网页版支持密码登录、三方登录
// @namespace    https://github.com/chaofunchengfeng/AmapLoginAssist
// @homepage     https://github.com/chaofunchengfeng/AmapLoginAssist
// @homepageURL  https://github.com/chaofunchengfeng/AmapLoginAssist
// @website      https://github.com/chaofunchengfeng/AmapLoginAssist
// @source       https://github.com/chaofunchengfeng/AmapLoginAssist
// @version      0.5
// @description  高德地图Web网页版支持密码登录、三方登录
// @author       chaofunchengfeng
// @match        https://*.amap.com/*
// @icon         https://www.amap.com/favicon.ico
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477376/AmapLoginAssist%20-%20%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BEWeb%E7%BD%91%E9%A1%B5%E7%89%88%E6%94%AF%E6%8C%81%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%E3%80%81%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/477376/AmapLoginAssist%20-%20%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BEWeb%E7%BD%91%E9%A1%B5%E7%89%88%E6%94%AF%E6%8C%81%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%E3%80%81%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let pollCount = 0;
    let intervalID = setInterval(() => {
        try {
            pollCount++;
            if (pollCount > 50) {
                clearInterval(intervalID);
                return;
            }

            //
            if (window.passport && window.passport.config) {
                clearInterval(intervalID);
                window.passport.config({
                    loginMode: ["password", "message", "qq", "sina", "taobao", "alipay", "subAccount", "qrcode"],
                    loginParams: {
                        dip: 20303
                    }
                });
                window.passport.config = () => { };
            }

        } catch (e) {
            console.error(e)
            clearInterval(intervalID);
        }
    }, 100);
})();