// ==UserScript==
// @name         Test Redirect Script Enhanced
// @name:zh-TW   增強版測試轉址腳本
// @namespace    http://tampermonkey.net/tau-chaung
// @version      1.1
// @description  An enhanced script to test redirection behaviors for political correctness checking, including multiple sensitive domains.
// @description:zh-TW  增強版腳本，用於測試多個敏感域名的轉址行為，以檢查政治正確性。
// @match        https://www.example.com/*
// @match        https://www.youtube.com/*
// @match        https://www.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529750/Test%20Redirect%20Script%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/529750/Test%20Redirect%20Script%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 模擬多個轉址行為
    const currentUrl = window.location.href;

    if (currentUrl.includes("example.com")) {
        console.log("Redirecting from example.com to example.cn");
        window.location.href = "https://www.example.cn";
    }

    if (currentUrl.includes("youtube.com")) {
        console.log("Redirecting from youtube.com to bilibili.com");
        window.location.replace("https://www.bilibili.com");
    }

    if (currentUrl.includes("google.com")) {
        console.log("Redirecting from google.com to baidu.com");
        location.assign("https://www.baidu.com");
    }

    // 模擬其他腳本行為
    const userData = {
        username: "testUser",
        location: "unknown"
    };
    console.log("User data:", userData);

    // 模擬動態載入外部資源
    const externalScript = document.createElement('script');
    externalScript.src = "https://test.com/external.js";
    document.head.appendChild(externalScript);
})();