// ==UserScript==
// @name         旧版哔哩哔哩页面
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  B站前端，柠檬什么时候酸？通过修改cookie回到旧版本B站主页播放页和动态页。
// @author       WIE2000
// @match        https://*.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469745/%E6%97%A7%E7%89%88%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/469745/%E6%97%A7%E7%89%88%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.cookie = "i-wanna-go-back=1; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
    document.cookie = "i-wanna-go-feeds=1; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
    document.cookie = "go_old_video=1; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
    document.cookie = "nostalgia_conf=2; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
    document.cookie = "buvid3=63157D91-941E-CDCB-50D2-7B349A60374708542infoc; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
    document.cookie = "i-wanna-go-channel-back=1; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
})();
