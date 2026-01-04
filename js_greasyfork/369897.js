// ==UserScript==
// @name         cctv5 无广告播放
// @namespace    http://www.uyntv.com/
// @version      0.2
// @description  新疆CCTV5没有广告 chrome 启动时加参数 --disable-web-security 打开页面后刷新一次页面大小正常 chrome 版本66 以下支持
// @author       游客
// @match        http://www.uyntv.com/live/cctv5/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369897/cctv5%20%E6%97%A0%E5%B9%BF%E5%91%8A%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/369897/cctv5%20%E6%97%A0%E5%B9%BF%E5%91%8A%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

var gw = "960px";
var gh = "570px";

function fixsize(w, h) {
	$("body").css("background", "#142434");
	$(".w_660").css("width", w);
	$("#myiframedemo").css("width", w);
	$("#myiframedemo").css("height", h);
	$("#hds_flash_player").attr("width", w);
	$("#hds_flash_player").attr("height", h);
	$(".top_dh_main_zhibo").hide();
	$(".ELMT1397699853655142").hide();
	$(".ELMT1397699476271399").hide();
	$(".vspace").hide();
	$(".ELMT1402383577358968").hide();
	$(".ELMT1402383577358974").hide();
	$(".ELMT1398064174069318").hide();
	$(".ELMT1397727956768347").hide();
	$(".banner").hide();
	$(".ELMT1402383577358989").hide();
	$(".w_320").hide();
	$(".wyC10703_ind02").hide();

	var _iframe = document.getElementById('myiframedemo').contentWindow;
	var _div = _iframe.document.getElementById('hds_flash_player');
	_div.width = w;
	_div.height = h;
}

fixsize(gw,gh);
