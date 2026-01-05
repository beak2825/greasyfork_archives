// ==UserScript==
// @name picarto.tv bright colortheme
// @description Adds an option that changes the coloscheme of Picarto.tv into brighter colors depending on the daytime
// @grant none
// @namespace xormak/picarto_bright_colorscheme
// @include https://picarto.tv/*
// @include https://picarto.tv
// @run-at document-end
// @version 0.0.7.4
// @downloadURL https://update.greasyfork.org/scripts/12117/picartotv%20bright%20colortheme.user.js
// @updateURL https://update.greasyfork.org/scripts/12117/picartotv%20bright%20colortheme.meta.js
// ==/UserScript==

/* 
*
* CREATED BY XORMAK.DEVIANTART.COM
*
*/

// variable declaration
var $ = window.jQuery;
var day = new Date();
var time = day.getHours()
	
	//colors
	var black_text = "#000000";
	var m_bg_c = "#D6E1F1"
	
// get daytime
console.log(time);
$(document).ready(function(){
	if (time > 5 && time < 22) {
		// frontpage
		$("#content").css("background-color",m_bg_c);
		$("#index_stream_header").css("color","#000000");
		$(".streamframe").css("box-shadow","5px 5px 10px black");
		$(".filter_top,.filter_top_follows,.filter_items").css("color","#ffffff");
		// settings
		$("body").css("background-color",m_bg_c);
		$("body,.setting,.sett_header,.exp_date_status,.text_symbols_left").css("color","#000000");
		$(".pgname").css("color","#3A3E45");
		$(".markdown_preview_btn,.markdown_edit_btn").css("color","#ffffff");
		$(".norm").css("color","#404040");
		$(".avatar-view").css("border","1px solid black");
		$(".icon-pencil").css("background-color","404040");
	}
});