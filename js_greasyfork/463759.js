// ==UserScript==
// @name         Bilibili 回到旧版
// @namespace    http://www.bilibili.com
// @version      0.1
// @description  回到旧版Bilibili PC页面
// @author       ZPC2048
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/463759/Bilibili%20%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/463759/Bilibili%20%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==


'use strict';
function setCookie(key, value, domain, days) {
    var d = new Date();
    d.setTime(d.getTime()+(days*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = key+"="+value+"; "+expires+"; domain="+domain;
}

setCookie("go_old_video", "1", ".bilibili.com", 365);
setCookie("nostalgia_conf", "1", ".bilibili.com", 365);
setCookie("i-wanna-go-back", "1", ".bilibili.com", 365);
setCookie("go-back-dyn", "1", ".bilibili.com", 365);
