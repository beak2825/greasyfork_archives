// ==UserScript==
// @name       ORDER-COMPANY
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  同步管家婆往来单位
// @author       You
// @match        https://bfuned5main.wsgjp.com/Main.gspx
// @match        https://bfuned5main.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5func.wsgjp.com/Main.gspx
// @match        https://bfuned5func.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com.cn/Main.gspx
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520480/ORDER-COMPANY.user.js
// @updateURL https://update.greasyfork.org/scripts/520480/ORDER-COMPANY.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var list = [];
	var post_data = [];
	var getlist = null;
	var bool1 = 0;

	var code = 0;
	var name = 0;
	var mobile = 0;
	var user = 0;
	var address = 0;
	var email = 0;

	$("head").append('<link rel="stylesheet" href="https://s.kingdom.net.cn/static/bootstrap.min.css">');
	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

	getlist = setInterval(start,1000);

	$('body').on('click', '#page', function() {
		orderlist()
	})

	function start() {
		var btn = $("#\\$7f1102e\\$btnFilter");
		if (btn.length > 0) {
			var info = $('#info');
			if (info.length == 0) {
				var merge = '<button style="margin-left:10px" id="page" class="Button dselect">获取本页</button>';
				btn.after(merge);
			}
			var td_list = $('#\\$7f1102e\\$grid .GridHeaderBar').find('td');
			$.each(td_list,function(k,v){
				if ($(v).text() == '单位编号' && $(v).css('display') != 'none') {
					code = $(v).index()
				} else if ($(v).text() == '单位名称' && $(v).css('display') != 'none') {
					name = $(v).index()
				} else if ($(v).text() == '手机' && $(v).css('display') != 'none') {
					mobile = $(v).index()
				} else if ($(v).text() == '联系人' && $(v).css('display') != 'none') {
					user = $(v).index()
				} else if ($(v).text() == '发货地址' && $(v).css('display') != 'none') {
					address = $(v).index()
				} else if ($(v).text() == '电子邮件' && $(v).css('display') != 'none') {
					email = $(v).index()
				}
			})
			clearInterval(getlist);
			console.log('success');
		} else {
			console.log('fail');
		}
	}

	function orderlist() {
		list = $('#\\$7f1102e\\$grid .GridBody').find('tr');
		var arr = [];
		$.each(list,function(k,v){
			var data1 = $(v).find('td').eq(code).text();
			var data2 = $(v).find('td').eq(name).text();
			var data3 = $(v).find('td').eq(mobile).text();
			var data4 = $(v).find('td').eq(user).text();
			var data5 = $(v).find('td').eq(address).text();
			var data6 = $(v).find('td').eq(email).text();
			if (data1.length > 1 || data2.length > 1 ) {
				var temp = {
					code: data1,
					name: data2,
					mobile: data3,
					user: data4,
					address: data5,
					email: data6,
				}
				arr.push(temp)
			}
		})
		$.post('https://s.kingdom.net.cn/api/home/index/orderCompany',{arr:arr},function(res){
			layer.msg(res.msg);
		})
	}
})();

