// ==UserScript==
// @name         评教一键全选完全赞同
// @version      1.0.1
// @description  湖南财院教务系统。
// @author       372728339
// @include      http://jiaowu2.hufe.edu.cn/jsxsd/xspj/xspj_edit.do*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @namespace https://greasyfork.org/users/574299
// @downloadURL https://update.greasyfork.org/scripts/404305/%E8%AF%84%E6%95%99%E4%B8%80%E9%94%AE%E5%85%A8%E9%80%89%E5%AE%8C%E5%85%A8%E8%B5%9E%E5%90%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/404305/%E8%AF%84%E6%95%99%E4%B8%80%E9%94%AE%E5%85%A8%E9%80%89%E5%AE%8C%E5%85%A8%E8%B5%9E%E5%90%8C.meta.js
// ==/UserScript==
(function() {
	"use strict";
	var styles = 'font-size:20px;font-weight:bold;color:#ff8800;cursor:pointer;';
	var border = 'border: 1px solid;margin-right:10px;padding:3px;';
	var $ = unsafeWindow.jQuery;
	var btn = '<button id="btn" style="' + styles + border + '">一键全选</span>';
	$('.Nsb_r_title').append(btn);
	$("#btn").click(() => {
		$('input[type=hidden]').each(function () {
			if ($(this).val() == "5") {
				$(this).prev().attr('checked','true')
			}
		})
	});
})()
