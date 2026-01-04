// ==UserScript==
// @name         CC98账号名隐匿
// @namespace    cc98
// @version      0.11
// @description  隐藏98用户名，防止实验室同学在大屏幕上窥探到用户名
// @author       茶包哥@CC98
// @license      GPL
// @include      https://www.cc98.org/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @run-at       DOMContentLoaded
// @downloadURL https://update.greasyfork.org/scripts/438509/CC98%E8%B4%A6%E5%8F%B7%E5%90%8D%E9%9A%90%E5%8C%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/438509/CC98%E8%B4%A6%E5%8F%B7%E5%90%8D%E9%9A%90%E5%8C%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var s=setInterval(function () {
        var a=document.querySelector("#root > div > div.header > div > div > div.topBarRight > div.topBarUserInfo > div.topBarUserName");
        if(a!=null){a.textContent="吴朝晖";clearInterval(s);};
        var b=document.querySelector("#root > div > div.headerWithoutImage > div > div > div.topBarRight > div.topBarUserInfo > div.topBarUserName");
        if(b!=null){b.textContent="吴朝晖";clearInterval(s);};
        var img = document.querySelector('[class="topBarUserImg"] img')
        img.setAttribute('src', 'http://file.cc98.org/v2-upload/rizxybm4.jpg')
}, 500);
})();