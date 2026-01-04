// ==UserScript==
// @name         DarkRoom Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DarkRoom Filter v1.0
// @author       You
// @match        https://www.darkroom.net/deck/orders/list*
// @icon         https://www.google.com/s2/favicons?domain=darkroom.net
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/439483/DarkRoom%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/439483/DarkRoom%20Filter.meta.js
// ==/UserScript==
var status = false;
var refresh = 0
function autoFilter() {
	if (!status) {
		return
	}

	let d = current();
	$("#bystatus").val("dispatching");
	$("#fromdate").val(d);
	$("input[name='fromdate_submit']").val(d);
	$("#todate").val(d);
	$("input[name='todate_submit']").val(d)

	//$("button[data-loader-func='filterLoading']").trigger("click")
	window.location.href = "https://www.darkroom.net/deck/orders/list?bystore=hq&bystatus=dispatching&datetype=work-date&select_fromdate=%E4%BB%8E&fromdate=" + d + "&select_todate=%E5%88%B0&todate=" + d + "&refresh=" + refresh;
	//setTimeout(autoFilter(),5000)
}
function current() {
	var d = new Date();
	var str = "";
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var day = d.getDay();
	str += d.getFullYear() + '-';
	if (month < 10) {
		str += "0" + month + '-'; //获取当前月份（0——11）
	}
	if (month >= 10) {
		str += month + '-'; //获取当前月份（0——11）
	}
	if (date < 10) {
		str += "0" + date;
	}
	if (date >= 10) {
		str += date;
	}

	return str;
} (function() {
	'use strict';

	// Your code here...
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	$("button[data-loader-func='filterLoading']").after("&nbsp;<button type=\"button\" id=\"autoFilterButton\" class=\"btn btn-sm btn-v-main px06em  slimAjaxBtn\"><i class=\"fa fa-filter\"></i> 自动刷新-开</i></button>");
	$("#autoFilterButton").click(function() {
		if (status) {
			status = false;
			refresh = 0;
			$("#autoFilterButton").html("<i class=\"fa fa-filter\"></i> 自动刷新-开")
		} else {
			status = true;
			refresh = 1;
			$("#autoFilterButton").html("<i class=\"fa fa-filter\"></i> 自动刷新-关");
			autoFilter();
		}
	});

	if ($.getUrlParam('refresh') == 1) {
		status = true;
		refresh = 1;
		$("#autoFilterButton").html("<i class=\"fa fa-filter\"></i> 自动刷新-关");
		setTimeout(function() {
			autoFilter();
		},
		5000)
	}
})();