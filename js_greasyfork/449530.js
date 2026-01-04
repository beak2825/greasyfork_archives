// ==UserScript==
// @name         4399随心玩
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除未成年账户在4399下的防沉迷弹窗
// @author       Keulx
// @match        https://www.4399.com/*
// @icon         https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/baike/w=268/sign=bad57034cf3d70cf4cfaad0bc0ddd1ba/aa18972bd40735fa23266cb498510fb30e2408ec.jpg
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/449530/4399%E9%9A%8F%E5%BF%83%E7%8E%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/449530/4399%E9%9A%8F%E5%BF%83%E7%8E%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
window.onload = function(){
    document.querySelector("#Anti_open").remove();
    document.querySelector("#Anti_mask").remove();
    document.querySelector("#pusher").remove();
}})();