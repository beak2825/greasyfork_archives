// ==UserScript==
// @name       享设计
// @namespace  http://userscripts.org/scripts/show/486139
// @version    1.0
// @description  享设计,显示无水印大图
// @copyright      2023-12-8, doocii
// @include        https://www.design006.com/*
// @require        https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451514/%E4%BA%AB%E8%AE%BE%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/451514/%E4%BA%AB%E8%AE%BE%E8%AE%A1.meta.js
// ==/UserScript==



var str = $(".max_pre_img").html();
var url = str.match(/http.*jpg?/);

$("body").append("<a href='" + url + "' target='_blank' class='download'>" + '下载大图' + "</a>");
$(".download").css({
	"color": "#fff",
	"font-size": "12px",
	"padding": "10px 30px",
	"display": "block",
	"background": "#33bd4b",
	"position": "fixed",
	"top": "12px",
	"right": "46px",
	"z-index": "999999",
	"border-radius": "99px",

});