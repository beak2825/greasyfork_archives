// ==UserScript==
// @name       CUSTOMER
// @namespace    http://tampermonkey.net/
// @version     1.1
// @description  管家婆系统同步售后订单信息
// @author       You
// @match        https://bfuned5main.wsgjp.com/Main.gspx
// @match        https://bfuned5main.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5func.wsgjp.com/Main.gspx
// @match        https://bfuned5func.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com.cn/Main.gspx
// @grant        GM_addStyle
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @downloadURL https://update.greasyfork.org/scripts/517474/CUSTOMER.user.js
// @updateURL https://update.greasyfork.org/scripts/517474/CUSTOMER.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`.height50{height:50px!important}`)

    'use strict';
	var list = [];
	var getlist = null;
	var bool1 = 0;
	var order_no = '';
	var delivery = '';
	var delivery_no = '';

	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

	$("#\\$80d499b2\\$mnuRoot3").bind("click",function(){
		if (!bool1) {
			var menu = $("#\\$80d499b2\\$mnuRoot3_menu .MenuItem");
			$.each(menu,function(k,v){
				var text = $(v).find('.MenuCaption').text();
				if (text == '售后管理') {
					$(v).bind("click",function(){
						getlist = setInterval(start,1000);
					})
					bool1 = 1;
				}
			})
		}
	})

    $('body').on('click', '#toggle', function() {
		$('#delivery_list').toggleClass('height50');
    })

	$('body').on('click', '#\\$61ca7b13\\$doQueryBtn', function() {
		var td_list = $('#\\$61ca7b13\\$refundGrid .GridHeaderBar').find('td');
		$.each(td_list,function(k,v){
			if ($(v).text() == '订单编号' && $(v).css('display') != 'none') {
				order_no = $(v).index()
			} else if ($(v).text() == '退货物流公司' && $(v).css('display') != 'none') {
				delivery = $(v).index()
			} else if ($(v).text() == '退货物流单号' && $(v).css('display') != 'none') {
				delivery_no = $(v).index()
			}
		})
		$('#code').remove();
		var input = '<input style="position: absolute;left:9999px" id="code" class="form-control" type="text" value="" readonly>';
		$('body').append(input);
		setTimeout(getinfo,2*1000);
		getlist = setInterval(getinfo,30*1000);
	})

	function start() {
		var btn = $("#\\$61ca7b13\\$doQueryBtn");
		if (btn.length > 0) {
			clearInterval(getlist);
			console.log('success');
		} else {
			console.log('fail');
		}
	}

	function getinfo() {
		list = $('#\\$61ca7b13\\$refundGrid .GridBody').find('tr');
		var arr = []
		if (list.length > 0) {
			$.each(list,function(k,v){
				var no1 = $(v).find('td').eq(order_no).text();
				var name = $(v).find('td').eq(delivery).text();
				var no2 = $(v).find('td').eq(delivery_no).text();
				if (no2.length > 1 ) {
					var temp = {
						key: k,
						name: name,
						no1: no1,
						no2: no2,
					}
					arr.push(temp)
				}
			})
		}

		var param = {
			arr: arr
		}

		$.post('https://s.kingdom.net.cn/api/home/index/customer',param,function(res){
			if (res.code == 1) {
				var div = $('#delivery_list');
				if (div.length == 0) {
					var html = '<div id="delivery_list" style="position: absolute;width: 320px;height: 500px;padding: 16px 25px;right: 50px;top: 50px;background: rgba(240, 240, 240, 0.9);overflow: hidden;">';
					html += '<p id="toggle" style="cursor: pointer;font-weight:bold;font-size:14px;text-align: center;margin-bottom: 20px;">展开/收缩</p>';
					html += '<div id="list">';
					var r_list = res.data
					if (r_list.length > 0) {
						$.each(r_list,function(k,v){
							html += '<div style="margin-bottom: 24px;display:flex;justify-content: space-between;"><a href="https://s.kingdom.net.cn/admin/info/index?code='+v.code+'" target="_blank">'+v.delivery_no+'</a><p class="copy" style="cursor: pointer">复制</p></div>';
						})
					}
					html += '</div></div>';
					$('body').append(html);
				} else {
					var r_list = res.data
					var html = '';
					if (r_list.length > 0) {
						$.each(r_list,function(k,v){
							html += '<div style="margin-bottom: 24px;display:flex;justify-content: space-between;"><a href="https://s.kingdom.net.cn/admin/info/index?code='+v.code+'" target="_blank">'+v.delivery_no+'</a><p class="copy" style="cursor: pointer">复制</p></div>';
						})
					}
					$('#list').html(html);
				}
			} else {
				layer.msg(res.msg,{icon: 2})
			}
		})
	}

	$('body').on('click', '.copy', function() {
		var val = $(this).parent().find('a').text();
		$('#code').val(val);
		var input = document.getElementById('code');
		input.select();
		document.execCommand('copy');
		layer.msg('复制成功');
	})
})();

