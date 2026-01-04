// ==UserScript==
// @name         微博直跳
// @namespace    https://weibo.com/u/5698313653
// @version      0.2
// @description  微博跳转第三方页面不再等待
// @author       @私聊话题废
// 0.2版本的代码修正为 @Lam_mki
// @match        *://t.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410787/%E5%BE%AE%E5%8D%9A%E7%9B%B4%E8%B7%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/410787/%E5%BE%AE%E5%8D%9A%E7%9B%B4%E8%B7%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = document.getElementsByClassName("desc")[0].innerText
    window.location.href=url
})();