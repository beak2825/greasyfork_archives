// ==UserScript==
// @name         国图检索默认设置
// @namespace    http://opac.nlc.cn/F/
// @version      0.3
// @description  默认使用isbn号检索书目信息
// @author       赵巍
// @match        http://opac.nlc.cn/F*
// @match        http://opac.nlc.cn/F/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425079/%E5%9B%BD%E5%9B%BE%E6%A3%80%E7%B4%A2%E9%BB%98%E8%AE%A4%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/425079/%E5%9B%BD%E5%9B%BE%E6%A3%80%E7%B4%A2%E9%BB%98%E8%AE%A4%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#find_code").val("ISB");
    $("#reqterm").val("");
    //$("#reqterm").focus;
    document.getElementById("reqterm").focus();

    // Your code here...
})();