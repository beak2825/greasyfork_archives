// ==UserScript==
// @name       GJP
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  管家婆系统获取订单信息
// @author       You
// @match        https://bfuned5main.wsgjp.com/Main.gspx
// @match        https://bfuned5main.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5func.wsgjp.com/Main.gspx
// @match        https://bfuned5func.wsgjp.com.cn/Main.gspx
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444116/GJP.user.js
// @updateURL https://update.greasyfork.org/scripts/444116/GJP.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var list = [];
	var getlist1 = null;
	var getlist2 = null;
	var getlist3 = null;
	var getlist4 = null;
	var bool1 = 0;
	var bool2 = 0;
	var bool3 = 0;
	var bool4 = 0;
	var url = 'https://t.kingdom.net.cn';

	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

	var roots = $('.MenuRoots .MenuRoot');
	$.each(roots,function(a,b){
		var root = $(b).text();
		var id = $(b).attr('id');
		if (root == '进货') {
			$('[id="'+id+'"]').bind("click",function(){
				if (!bool1) {
					var menu = $('[id="'+id+'_menu"]'+" .MenuItem");
					$.each(menu,function(k,v){
						var text = $(v).find('.MenuCaption').text();
						if (text == '进货入库单') {
							$(v).bind("click",function(){
								getlist1 = setInterval(start1,1000);
							})
							bool1 = 1;
						}
					})
				}
			})
		} else if (root == '批零') {
			$('[id="'+id+'"]').bind("click",function(){
				if (!bool4) {
					var menu = $('[id="'+id+'_menu"]'+" .MenuItem");
					$.each(menu,function(k,v){
						var text = $(v).find('.MenuCaption').text();
						if (text == '销售退货单') {
							$(v).bind("click",function(){
								getlist4 = setInterval(start4,1000);
							})
							bool4 = 1;
						}
					})
				}
			})
		} else if (root == '库存') {
			$('[id="'+id+'"]').bind("click",function(){
				if (!bool2) {
					var menu = $('[id="'+id+'_menu"]'+" .MenuItem");
					$.each(menu,function(k,v){
						var text = $(v).find('.MenuCaption').text();
						if (text == '报损单') {
							$(v).bind("click",function(){
								getlist2 = setInterval(start2,1000);
							})
							bool2 = 1;
						}
					})
				}
				if (!bool3) {
					var menu = $('[id="'+id+'_menu"]'+" .MenuItem");
					$.each(menu,function(k,v){
						var text = $(v).find('.MenuCaption').text();
						if (text == '调拨单') {
							$(v).bind("click",function(){
								getlist3 = setInterval(start3,1000);
							})
							bool3 = 1;
						}
					})
				}
			})
		}
	})
	function start1() {
		var btn = $("#\\$2c13a003\\$btnExit");
		if (btn.length > 0) {
			$("#\\$2c13a003\\$btnExit").bind("click",getinfo1);
			clearInterval(getlist1);
			console.log('success1');
		} else {
			console.log('fail');
		}
	}
	function getinfo1() {
		var data3 = $("#\\$2c13a003\\$edBType").val();
		var data1 = $("#\\$2c13a003\\$edKType").val();
		var data2 = [];
		var no1 = 5;
		var no2 = 29
		var d_title = $("#\\$2c13a003\\$grid .GridHeaderBar .GridHeader tr td");
		$.each(d_title,function(k,v){
			if ($(v).text() == '商品名称') {
				no1 = k;
			} else if ($(v).text() == '数量') {
				no2 = k;
			}
		})
		setTimeout(function(){
			var d_list = $("#\\$2c13a003\\$grid .GridBody .GridTable tr");
			if (d_list.length > 0) {
				$.each(d_list,function(k,v){
					var name = $(v).find('td').eq(no1).text();
					var num = $(v).find('td').eq(no2).text();
					if (name.length > 1 || num.length > 1 ) {
						var temp = {
							name: name,
							num: num,
						}
						data2.push(temp)
					}
				})
			}
			send(data1,data2,1,data3);
		},500);
	}
	function start2() {
		var btn = $("#\\$25d43318\\$btnExit");
		if (btn.length > 0) {
			$("#\\$25d43318\\$btnExit").bind("click",getinfo2);
			clearInterval(getlist2);
			console.log('success2');
		} else {
			console.log('fail');
		}
	}
	function getinfo2() {
		var data1 = $("#\\$25d43318\\$edKType").val();
		var data2 = [];
		var no1 = 3;
		var no2 = 18
		var d_title = $("#\\$25d43318\\$grid .GridHeaderBar .GridHeader tr td");
		$.each(d_title,function(k,v){
			if ($(v).text() == '商品名称') {
				no1 = k;
			} else if ($(v).text() == '数量') {
				no2 = k;
			}
		})
		setTimeout(function(){
			var d_list = $("#\\$25d43318\\$grid .GridBody .GridTable tr");
			if (d_list.length > 0) {
				$.each(d_list,function(k,v){
					var name = $(v).find('td').eq(no1).text();
					var num = $(v).find('td').eq(no2).text();
					if (name.length > 1 || num.length > 1 ) {
						var temp = {
							name: name,
							num: num,
						}
						data2.push(temp)
					}
				})
			}
			send(data1,data2,3);
		},500);
	}
	function start3() {
		var btn = $("#\\$fd07d875\\$btnExit");
		if (btn.length > 0) {
			$("#\\$fd07d875\\$btnExit").bind("click",getinfo3);
			clearInterval(getlist3);
			console.log('success3');
		} else {
			console.log('fail');
		}
	}
	function getinfo3() {
		var data1 = $("#\\$fd07d875\\$edKType2").val();
		var data2 = [];
		var no1 = 3;
		var no2 = 31;
		var d_title = $("#\\$fd07d875\\$grid .GridHeaderBar .GridHeader tr td");
		$.each(d_title,function(k,v){
			if ($(v).text() == '商品名称') {
				no1 = k;
			} else if ($(v).text() == '数量') {
				no2 = k;
			}
		})
		setTimeout(function(){
			var d_list = $("#\\$fd07d875\\$grid .GridBody .GridTable tr");
			if (d_list.length > 0) {
				$.each(d_list,function(k,v){
					var name = $(v).find('td').eq(no1).text();
					var num = $(v).find('td').eq(no2).text();
					if (name.length > 1 || num.length > 1 ) {
						var temp = {
							name: name,
							num: num,
						}
						data2.push(temp)
					}
				})
			}
			send(data1,data2,2);
		},500);
	}
	function start4() {
		var btn = $("#\\$fcd31d7b\\$btnExit");
		if (btn.length > 0) {
			$("#\\$fcd31d7b\\$btnExit").bind("click",getinfo4);
			clearInterval(getlist4);
			console.log('success4');
		} else {
			console.log('fail');
		}
	}
	function getinfo4() {
		var data1 = $("#\\$fcd31d7b\\$edKType").val();
		var data2 = [];
		var no1 = 5;
		var no2 = 29;
		var d_title = $("#\\$fcd31d7b\\$grid .GridHeaderBar .GridHeader tr td");
		$.each(d_title,function(k,v){
			if ($(v).text() == '商品名称') {
				no1 = k;
			} else if ($(v).text() == '数量') {
				no2 = k;
			}
		})
		setTimeout(function(){
			var d_list = $("#\\$fcd31d7b\\$grid .GridBody .GridTable tr");
			if (d_list.length > 0) {
				$.each(d_list,function(k,v){
					var name = $(v).find('td').eq(no1).text();
					var num = $(v).find('td').eq(no2).text();
					if (name.length > 1 || num.length > 1 ) {
						var temp = {
							name: name,
							num: num,
						}
						data2.push(temp)
					}
				})
			}
			send(data1,data2,4);
		},500);
	}
	function send(data1,data2,type,data3='') {
		var html = '<div style="padding:20px">'+
			     '<form class="form-horizontal">'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">请输入对应工单号：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="order_id">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">请选择问题状况：</label>'+
			     '<div class="col-xs-9">'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="无问题" checked> 无问题'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;';
		if (type == 1) {
			 html += '<label class="radio-inline">'+
			 '<input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="少货"> 少货'+
			 '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			 '<label class="radio-inline">'+
			'<input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="多货"> 多货'+
			'</label>';
		}
		html += '</div>'+
			     '</div>'+
			     '</form>'+
				  '<table border=1 style="width:100%;text-align:center;margin-top:20px;">';
		if (type == 1) {
			html += '<tr>'+
				  '<td colspan="2">供货单位：'+data3+'</td>'+
				'</tr>';
		}
		html += '<tr>'+
				  '<td>商品名称</td>'+
				  '<td>数量</td>'+
				'</tr>';
		$.each(data2,function(k,v){
		html += '<tr>'+
				  '<td>'+v.name+'</td>'+
				  '<td>'+v.num+'</td>'+
			   '</tr>';
		})
		html += '</table></div>';
		var type_name = '';
		if (type == 1) {
			getlist1 = null;
			type_name = '（入库单）';
		} else if (type == 2) {
			getlist2 = null;
			type_name = '（调拨单）';
		} else if (type == 3) {
			getlist3 = null;
			type_name = '（报损单）';
		} else if (type == 4) {
			getlist4 = null;
			type_name = '（客退单）';
		}
		var param = {
			stock:data1,
			list:data2,
			type:type,
			supplier:data3,
		};
		layer.open({
			type: 1,
			id: 'form',
			title: '收货仓库：'+data1+type_name,
			area: ['750px','500px'],
			btn: ['提交'],
			closeBtn : 2,
			content: html,
			yes: function(index){
				var order_id = $('#order_id').val();
				var question = $(':radio[name="inlineRadioOptions"]:checked').val();
				var remark = $('#remark').val();
				param.order_id = order_id;
				param.question = question;
				param.remark = remark;
				$.post(url+'/api/home/index/record',param,function(res){
					if (res.code == 1) {
						layer.msg(res.msg,{icon: 1,time:1000},function(){
							layer.closeAll();
						})
					} else {
						layer.msg(res.msg,{icon: 2})
					}
				})
			}
		})
	}
})();