// ==UserScript==
// @name         知网空间跳转知网页面
// @namespace    xyz.tree0.a.cnki.cnki2cnki
// @version      0.1.2.2
// @description  知网空间(为搜索引擎优化的)跳转知网适合人类阅读的内部页面
// @author       an_anthony
// @match        http://*.cnki.com.cn/Article/*.htm
// @match        https://*.cnki.com.cn/Article/*.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403732/%E7%9F%A5%E7%BD%91%E7%A9%BA%E9%97%B4%E8%B7%B3%E8%BD%AC%E7%9F%A5%E7%BD%91%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/403732/%E7%9F%A5%E7%BD%91%E7%A9%BA%E9%97%B4%E8%B7%B3%E8%BD%AC%E7%9F%A5%E7%BD%91%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var DbUrl = window.location.href.substr(window.location.href.lastIndexOf('/')+ 1);
    var DbInfoInUrl = DbUrl.toUpperCase().split('-');

    var DbCode = DbInfoInUrl[0].replace("TOTAL","");
    var DbFileNameIndexInUrl = DbUrl.split('-').length - 1;
    var DbFileName = DbInfoInUrl[DbFileNameIndexInUrl].substring(0,DbInfoInUrl[DbFileNameIndexInUrl].indexOf('.'));
    //如果是硕博 还需要加上.nh
    DbFileName = DbFileName + (DbCode ==="CMFD" || DbCode === "CDMD"?".nh":"");

    DbUrl = "/KCMS/detail/detail.aspx?DbCode=" + DbCode + "&FileName=" + DbFileName;

    $("#down_1").before("<div class='xx_font' ><a href='https://kns.cnki.net" + DbUrl + "' target='_self'>【知网详情】</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href='https://x.cnki.net" + DbUrl + "' target='_self'>【知网研学】</a></div>");

})();