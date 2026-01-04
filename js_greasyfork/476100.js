// ==UserScript==
// @name         BiliFixNavBar
// @name:zh-CN 哔哩哔哩解除导航栏固定
// @name:ja ビリビリnav-bar解除
// @namespace    http://inori.life/
// @version      0.2
// @description  Unfix the bilibili nav bar.
// @description:zh-cn 解除哔哩哔哩导航栏固定
// @description:ja ビリビリナビバーの固定を解除する
// @author       INORI
// @match        *://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476100/BiliFixNavBar.user.js
// @updateURL https://update.greasyfork.org/scripts/476100/BiliFixNavBar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () { //每5秒刷新一次图表
         //需要执行的代码写在这里
        document.getElementsByClassName("fixed-header")[0].className = "bili-header";
    }, 5000);
})();