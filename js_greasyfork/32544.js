// ==UserScript==
// @name         京东会员签到
// @version      20170823
// @grant        none
// @description  进入京东vip页面，模拟点击会员签到，领取京豆
// @namespace https://greasyfork.org/zh-CN/users/150110-000xiaoxiao000
// @include      *//vip.jd.com/*
// @downloadURL https://update.greasyfork.org/scripts/32544/%E4%BA%AC%E4%B8%9C%E4%BC%9A%E5%91%98%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/32544/%E4%BA%AC%E4%B8%9C%E4%BC%9A%E5%91%98%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
var list_checkin_ready = document.getElementsByClassName("item checkin    checkin-ready")[0];
list_checkin_ready.getElementsByClassName("icon-set")[0].click();  