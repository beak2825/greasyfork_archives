// ==UserScript==
// @name         markVIP
// @namespace    https://vip.fupanwang.com/
// @version      0.3
// @description  VIP for vip fupan
// @author       Djelouah
// @match        https://vip.fupanwang.com/*
// @icon         https://www.fupanwang.com/favicon.ico
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/521764/markVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/521764/markVIP.meta.js
// ==/UserScript==

/* global ajaxHooker*/
(function() {
    'use strict';
    var userinfo = uni.myTool.userinfo();
    userinfo.vip_time = 1799505621;
    userinfo.expiretime_text = "2027-01-14 23:28:47";
    uni.myTool.setStorage("userinfo", JSON.stringify(userinfo));
    console.log("userinfo", userinfo);
})();
