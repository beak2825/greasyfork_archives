// ==UserScript==
// @name         我不要用微信打开 GDUT 总务处！
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  绕过广东工业大学总务处报修登录页面的微信 UA 检测
// @author       GamerNoTitle
// @match        http://hqgl.gdut.edu.cn/*
// @run-at       document-start
// @grant        none
// @icon         https://www.gdut.edu.cn/favicon.ico
// @iconURL      https://www.gdut.edu.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/531974/%E6%88%91%E4%B8%8D%E8%A6%81%E7%94%A8%E5%BE%AE%E4%BF%A1%E6%89%93%E5%BC%80%20GDUT%20%E6%80%BB%E5%8A%A1%E5%A4%84%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/531974/%E6%88%91%E4%B8%8D%E8%A6%81%E7%94%A8%E5%BE%AE%E4%BF%A1%E6%89%93%E5%BC%80%20GDUT%20%E6%80%BB%E5%8A%A1%E5%A4%84%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 覆盖浏览器UA检测
    Object.defineProperty(navigator, "userAgent", {
        value:
            "Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36 MicroMessenger/8.0.25.2200(0x28001951)",
        configurable: false,
        writable: false,
    });

    // 覆盖原网站的检测函数
    window.isWeiXin = function () {
        return true;
    };
})();
