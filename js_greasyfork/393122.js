// ==UserScript==
// @icon            http://dripzil.com/img/favicon.ico
// @name            [HAN] 韩站增强
// @namespace       dripzil
// @author          hanfly
// @description     增加网页下载按钮，下一页、上一页按钮
// @match           *://dripzil.com/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.3
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393122/%5BHAN%5D%20%E9%9F%A9%E7%AB%99%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/393122/%5BHAN%5D%20%E9%9F%A9%E7%AB%99%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
	'use strict';

	//获取网页wir_id，便于翻页
	function getUrlParam(name){
	    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if (r!=null) return unescape(r[2]); return null;
	}

	//处理翻页页码
	var last_page = parseInt(getUrlParam('wr_id')) + parseInt("1");
	var next_page = parseInt(getUrlParam('wr_id')) - parseInt("1");

	//增加按钮html
	var add_button_html = '<div>';
	add_button_html += '<a href="http://dripzil.com/bbs/board.php?bo_table=woman01&wr_id=' + last_page + '" class="btn btn-default"><i class="fa fa-arrow-left"></i></a>';
	add_button_html += '<a href="http://dripzil.com/bbs/board.php?bo_table=woman01&wr_id=' + next_page + '" class="btn btn-default"><i class="fa fa-arrow-right"></i></a>';
	add_button_html += '<a href="javascript:void(0);" class="btn btn-default"  style="float:right"><i class="fa fa-download"></i></a>';
	add_button_html += '</div>';

	//插入位置
	var ul_tag = $("div.border_title");
	if (ul_tag) {
		ul_tag.append(add_button_html);
	}

})();