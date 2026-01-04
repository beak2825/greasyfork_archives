// ==UserScript==
// @name         机场流量签到
// @namespace    https://www.bmt.pub/
// @version      1.0
// @description  进行每天机场流量签到
// @author       院长
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @include         http://*
// @include         https://*
// @grant           GM_getValue
// @grant           GM.getValue
// @grant           GM_setValue
// @grant           GM.setValue
// @grant			GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getResourceText
// @grant           GM_registerMenuCommand
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/400768/%E6%9C%BA%E5%9C%BA%E6%B5%81%E9%87%8F%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/400768/%E6%9C%BA%E5%9C%BA%E6%B5%81%E9%87%8F%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
//正文
window.onload=function() {
    $("a.btn.btn-icon.icon-left.btn-primary")[0].click();
};