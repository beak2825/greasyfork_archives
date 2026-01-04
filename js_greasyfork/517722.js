// ==UserScript==
// @name       ORDER-SYNC
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  同步管家婆订单
// @author       You
// @match        https://bfuned5main.wsgjp.com/Main.gspx
// @match        https://bfuned5main.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5func.wsgjp.com/Main.gspx
// @match        https://bfuned5func.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com.cn/Main.gspx
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517722/ORDER-SYNC.user.js
// @updateURL https://update.greasyfork.org/scripts/517722/ORDER-SYNC.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var list = [];
	var post_data = [];
	var getlist = null;
	var bool1 = 0;

	var order_no = 0;
	var item_no = 0;
	var item_name = 0;
	var item_unit = 0;
	var item_num = 0;
	var item_price = 0;
	var order_price = 0;
	var send_time = 0;
	var pay_time = 0;
	var add_time = 0;
	var shop_name = 0;
	var buy_remark = 0;
	var sell_remark = 0;
	var delivery = 0;
	var delivery_no = 0;
	var stock = 0;

	$("head").append('<link rel="stylesheet" href="https://s.kingdom.net.cn/static/bootstrap.min.css">');
	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

	getlist = setInterval(start,1000);

	$('body').on('click', '#page', function() {
		getpage()
	})

	$('body').on('click', '#restart', function() {
		restart()
	})

	function start() {
		var btn = $("#\\$66d1980b\\$btnQuery");
		if (btn.length > 0) {
			var info = $('#info');
			if (info.length == 0) {
				var merge = '<button style="margin-left:10px" id="page" class="Button dselect">获取本页</button>';
				btn.after(merge);
				var invoice = '<button style="margin-left:10px" id="restart" class="Button dselect">重新开始</button>';
				btn.after(invoice);
			}
			var td_list = $('#\\$66d1980b\\$grid .GridHeaderBar').find('td');
			$.each(td_list,function(k,v){
				if ($(v).text() == '订单编号' && $(v).css('display') != 'none') {
					order_no = $(v).index()
				} else if ($(v).text() == '商品编号' && $(v).css('display') != 'none') {
					item_no = $(v).index()
				} else if ($(v).text() == '商品名称' && $(v).css('display') != 'none') {
					item_name = $(v).index()
				} else if ($(v).text() == '单位' && $(v).css('display') != 'none') {
					item_unit = $(v).index()
				} else if ($(v).text() == '数量' && $(v).css('display') != 'none') {
					item_num = $(v).index()
				} else if ($(v).text() == '订单金额(商品)' && $(v).css('display') != 'none') {
					item_price = $(v).index()
				} else if ($(v).text() == '订单金额(订单)' && $(v).css('display') != 'none') {
					order_price = $(v).index()
				} else if ($(v).text() == '发货时间' && $(v).css('display') != 'none') {
					send_time = $(v).index()
				} else if ($(v).text() == '付款时间' && $(v).css('display') != 'none') {
					pay_time = $(v).index()
				} else if ($(v).text() == '拍下时间' && $(v).css('display') != 'none') {
					add_time = $(v).index()
				} else if ($(v).text() == '网店名称' && $(v).css('display') != 'none') {
					shop_name = $(v).index()
				} else if ($(v).text() == '买家留言' && $(v).css('display') != 'none') {
					buy_remark = $(v).index()
				} else if ($(v).text() == '卖家备注' && $(v).css('display') != 'none') {
					sell_remark = $(v).index()
				} else if ($(v).text() == '物流公司' && $(v).css('display') != 'none') {
					delivery = $(v).index()
				} else if ($(v).text() == '物流单号' && $(v).css('display') != 'none') {
					delivery_no = $(v).index()
				} else if ($(v).text() == '仓库' && $(v).css('display') != 'none') {
					stock = $(v).index()
				}
			})
			clearInterval(getlist);
			// setTimeout(getorder,500)
			// getlist = setInterval(getorder,60*1000);
			console.log('success');
		} else {
			console.log('fail');
		}
	}

	function getpage() {
		clearInterval(getlist);
		setTimeout(orderlist,500)
	}

	function restart() {
		setTimeout(getorder,500)
		getlist = setInterval(getorder,60*1000);
	}

	function getorder() {
		var div = $('#\\$66d1980b\\$btnQuery')[0];
		div.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		setTimeout(orderlist,2000)
	}

	function orderlist() {
		list = $('#\\$66d1980b\\$grid .GridBody').find('tr');
		var arr1 = [];
		var arr2 = [];
		$.each(list,function(k,v){
			var data1 = $(v).find('td').eq(order_no).text();
			var data2 = $(v).find('td').eq(item_no).text();
			var data3 = $(v).find('td').eq(item_name).text();
			var data4 = $(v).find('td').eq(item_num).text();
			var data5 = $(v).find('td').eq(item_price).text();
			var data6 = $(v).find('td').eq(send_time).text();
			var data7 = $(v).find('td').eq(pay_time).text();
			var data8 = $(v).find('td').eq(add_time).text();
			var data9 = $(v).find('td').eq(shop_name).text();
			var data0 = $(v).find('td').eq(buy_remark).text();
			var data10 = $(v).find('td').eq(item_unit).text();
			var data11 = $(v).find('td').eq(sell_remark).text();
			var data12 = $(v).find('td').eq(delivery).text();
			var data13 = $(v).find('td').eq(delivery_no).text();
			var data14 = $(v).find('td').eq(stock).text();
			var data15 = $(v).find('td').eq(order_price).text();
			if (data1.length > 1 || data2.length > 1 ) {
				var temp = {
					order_no: data1,
					item_no: data2,
					item_unit: data10,
					item_name: data3,
					item_num: data4,
					item_price: data5,
					send_time: data6,
					pay_time: data7,
					add_time: data8,
					shop_name: data9,
					buy_remark: data0,
					sell_remark: data11,
					delivery: data12,
					delivery_no: data13,
					stock: data14,
					order_price: data15,
				}
				if (arr1.length > 50) {
					arr2.push(temp)
				} else {
					arr1.push(temp)
				}
			}
		})
		$.post('https://s.kingdom.net.cn/api/home/index/orderSync',{arr:arr1},function(res){
			if (res.code == 1 && arr2.length > 0){
				$.post('https://s.kingdom.net.cn/api/home/index/orderSync',{arr:arr2},function(res){
					layer.msg(res.msg);
				})
			} else {
				layer.msg(res.msg);
			}
		})
	}


	$('body').on('click', '#code', function() {
		var input = document.getElementById('code');
		input.select();
		document.execCommand('copy');
		layer.msg('复制成功');
	})
})();

