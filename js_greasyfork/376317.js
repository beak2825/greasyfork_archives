// ==UserScript==
// @name         投稿按钮：想变得可爱
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  让 B 站的投稿按钮恢复旧版样式
// @author       duoduoeeee
// @match        https://*.bilibili.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/376317/%E6%8A%95%E7%A8%BF%E6%8C%89%E9%92%AE%EF%BC%9A%E6%83%B3%E5%8F%98%E5%BE%97%E5%8F%AF%E7%88%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/376317/%E6%8A%95%E7%A8%BF%E6%8C%89%E9%92%AE%EF%BC%9A%E6%83%B3%E5%8F%98%E5%BE%97%E5%8F%AF%E7%88%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("injected!!");
    document.getElementsByClassName("u-link")[0].style = "letter-spacing: 6px; height: 50px; line-height: 47px; padding-left: 2px;";
    document.getElementsByClassName("up-nav")[0].style = "top: 0px;"
})();