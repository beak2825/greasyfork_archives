// ==UserScript==
// @name         B站自动回到旧版
// @namespace space_bilibili.com_435022639
// @version      1.1.3
// @description  该脚本已经弃用，新版教程请访问https://www.bilibili.com/video/BV1CX4y1j7rZ简介处，该脚本更新时间为24-12-22
// @author       深蓝之亘
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/472114/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/472114/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.cookie = "i-wanna-go-back=1; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "go_back_dyn=1; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "go-back-dyn=1; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    document.cookie = "buvid3= ; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "buvid4=6678A7B6\-9A9C\-F451\-7042\-EA6AFE0FC44C30900\-023071215\-QzuQxZU\%2FtBR4UUgJSIp4jQ\%3D\%3D; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "go_old_video=1; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "FEED_LIVE_VERSION=V8; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "PVID=3; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "browser_resolution=1536-715; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    document.cookie = "nostalgia_conf=2; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "home_feed_column=5; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    //document.cookie = "CURRENT_QUALITY=16; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";

    const hasRefreshed = parseInt(localStorage.getItem('hasRefreshed') || '0');
    if (hasRefreshed !== 0 && hasRefreshed !== 1 && hasRefreshed !== 2 && hasRefreshed !== 3) {
        localStorage.setItem('hasRefreshed', '0');
    }
    switch (hasRefreshed) {
        case 0:
            window.location.reload();
            localStorage.setItem('hasRefreshed', '1');
            break;
        case 1:
            localStorage.setItem('hasRefreshed', '2');
            break;
        case 2:
            window.location.reload();
            localStorage.setItem('hasRefreshed', '3');
            break;
        case 3:
            localStorage.setItem('hasRefreshed', '0');
            break;
        default:
            break;
    }
})();
