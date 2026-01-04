// ==UserScript==
// @name       ORDER-PROFIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  同步管家婆毛利订单用户信息
// @author       You
// @match        https://bfuned5main.wsgjp.com/Main.gspx
// @match        https://bfuned5main.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5func.wsgjp.com/Main.gspx
// @match        https://bfuned5func.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com.cn/Main.gspx
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520479/ORDER-PROFIT.user.js
// @updateURL https://update.greasyfork.org/scripts/520479/ORDER-PROFIT.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var list = [];
	var post_data = [];
	var getlist = null;
	var bool1 = 0;

	var order_no = 0;
	var company = 0;
	var name = 0;
	var mobile = 0;
	var address = 0;

	$("head").append('<link rel="stylesheet" href="https://s.kingdom.net.cn/static/bootstrap.min.css">');
	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

	getlist = setInterval(start,1000);

	$('body').on('click', '#page', function() {
		orderlist()
	})

	function start() {
		var btn = $("#\\$e921448e\\$btnFilter");
		if (btn.length > 0) {
			var info = $('#info');
			if (info.length == 0) {
				var merge = '<button style="margin-left:10px" id="page" class="Button dselect">获取本页</button>';
				btn.after(merge);
			}
			var td_list = $('#\\$e921448e\\$grid .GridHeaderBar').find('td');
			$.each(td_list,function(k,v){
				if ($(v).text() == '单据编号' && $(v).css('display') != 'none') {
					order_no = $(v).index()
				} else if ($(v).text() == '往来单位' && $(v).css('display') != 'none') {
					company = $(v).index()
				} else if ($(v).text() == '收货人' && $(v).css('display') != 'none') {
					name = $(v).index()
				} else if ($(v).text() == '收货人电话' && $(v).css('display') != 'none') {
					mobile = $(v).index()
				} else if ($(v).text() == '收货地址' && $(v).css('display') != 'none') {
					address = $(v).index()
				}
			})
			clearInterval(getlist);
			console.log('success');
		} else {
			console.log('fail');
		}
	}

	function orderlist() {
		list = $('#\\$e921448e\\$grid .GridBody').find('tr');
		var arr = [];
		$.each(list,function(k,v){
			var data1 = $(v).find('td').eq(order_no).text();
			var data2 = $(v).find('td').eq(company).text();
			var data3 = $(v).find('td').eq(name).text();
			var data4 = $(v).find('td').eq(mobile).text();
			var data5 = $(v).find('td').eq(address).text();
			if (data1.length > 1 || data2.length > 1 ) {
				var temp = {
					order_no: data1,
					company: data2,
					name: data3,
					mobile: data4,
					address: data5,
				}
				arr.push(temp)
			}
		})
		$.post('https://s.kingdom.net.cn/api/home/index/orderProfit',{arr:arr},function(res){
			layer.msg(res.msg);
		})
	}
})();

