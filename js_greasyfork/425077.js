// ==UserScript==
// @name         91marc激活文本框
// @namespace    z39.91marc.cn
// @version      0.5
// @description  方便使用isbn号查询marc信息
// @author       赵巍
// @match        http://z39.91marc.cn/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/425077/91marc%E6%BF%80%E6%B4%BB%E6%96%87%E6%9C%AC%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/425077/91marc%E6%BF%80%E6%B4%BB%E6%96%87%E6%9C%AC%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("form input:first").focus();//焦点切换到分类号上
    $("form input:first").val("");
    $("body > div.searchdiv > form > input.table-control").val("");
    $("body > div.searchdiv > form > input.table-control").focus();//焦点切换到分类号上
    $("body > div.suspension").remove();
    // Your code here...
    $("#textarea").click(function(){GM_setClipboard($("#textarea").val(), 'text');})

})();