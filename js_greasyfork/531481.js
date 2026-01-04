// ==UserScript==
// @name         校园网自动打开认证页面（南昌航空大学）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  检测到校园网后自动打开认证页面，让 Chrome 处理自动填充登录
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531481/%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E8%AE%A4%E8%AF%81%E9%A1%B5%E9%9D%A2%EF%BC%88%E5%8D%97%E6%98%8C%E8%88%AA%E7%A9%BA%E5%A4%A7%E5%AD%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531481/%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E8%AE%A4%E8%AF%81%E9%A1%B5%E9%9D%A2%EF%BC%88%E5%8D%97%E6%98%8C%E8%88%AA%E7%A9%BA%E5%A4%A7%E5%AD%A6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loginPageURL = "http://10.1.88.4"; // 你的校园网认证页面地址
    const checkURL = "http://10.1.88.4/cgi-bin/rad_user_info"; // 用于检测是否已登录

    // 发送请求检查是否已登录
    function checkLoginStatus() {
        GM_xmlhttpRequest({
            method: "GET",
            url: checkURL,
            timeout: 3000, // 3秒超时
            onload: function(response) {
                if (!response.responseText.includes("username")) {
                    console.log("未登录，打开认证页面...");
                    window.open(loginPageURL, "_blank");
                } else {
                    console.log("已登录，无需操作。");
                }
            },
            onerror: function() {
                console.log("无法连接校园网，可能未连接 WiFi");
            }
        });
    }

    // 每隔 30 秒检测一次
    setInterval(checkLoginStatus, 30000);

    // 初次运行时立即检测
    checkLoginStatus();
})();