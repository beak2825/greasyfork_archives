// ==UserScript==
// @name         雪球增强
// @namespace    https://xueqiu.com/
// @version      2024-11-10
// @description  隐藏登录弹窗
// @author       zyco
// @match        https://xueqiu.com/*
// @icon         https://xqimg.imedao.com/17af5fe80fb1844b3fd48941.png
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/516728/%E9%9B%AA%E7%90%83%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/516728/%E9%9B%AA%E7%90%83%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dialogLogin = document.querySelector(".modals.dimmer.js-shown");

    dialogLogin.style.setProperty("display","none","important");
    document.body.classList.remove('scroll-no');

})();