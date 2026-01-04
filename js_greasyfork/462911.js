// ==UserScript==
// @name         淘股吧
// @namespace    http://www.baidu.net/
// @version      0.1
// @description  改变淘股吧样式,淘股吧新版本用不习惯
// @author       aniiiu
// @match        *://www.taoguba.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=foxconn.com
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/462911/%E6%B7%98%E8%82%A1%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/462911/%E6%B7%98%E8%82%A1%E5%90%A7.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    var elmnt = document.getElementsByClassName("blogReply-portrait");
    for (var i = 0; i < elmnt.length; i++) {
        var current=elmnt.item(i);
        current.style.display = "none";
	}
    //设置跨度
	var mainLeft = document.getElementById("authorUserid");
	mainLeft.style.width="1200px";
	$(".article-content").css("backgroundColor","#f2f4f2");
	$(".content-right").css("display","none");
})();