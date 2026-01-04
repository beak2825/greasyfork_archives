// ==UserScript==
// @name       SERVICE
// @namespace    http://tampermonkey.net/
// @version     4.5
// @description  管家婆系统获取订单信息
// @author       You
// @match        https://bfuned5main.wsgjp.com/Main.gspx
// @match        https://bfuned5main.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5func.wsgjp.com/Main.gspx
// @match        https://bfuned5func.wsgjp.com.cn/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com/Main.gspx
// @match        https://bfuned5temp2.wsgjp.com.cn/Main.gspx
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447687/SERVICE.user.js
// @updateURL https://update.greasyfork.org/scripts/447687/SERVICE.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var list = [];
	var getlist = null;
	var bool1 = 0;
	var shop_name = '';
	var shop_num = 6;
	var order_num = 5;
	var invoice_name = 25;
	var invoice_no = 100;
	var invoice_remark = 101;
	var invoice_type = 110;
	var invoice_info = 111;
	var status = 10;

	var item_name = 7;
	var item_unit = 12;
	var item_num = 26;
	var item_price = 28;

	$("head").append('<link rel="stylesheet" href="https://s.kingdom.net.cn/static/bootstrap.min.css">');
	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

	$("#\\$80d499b2\\$mnuRoot3").bind("click",function(){
		if (!bool1) {
			var menu = $("#\\$80d499b2\\$mnuRoot3_menu .MenuItem");
			$.each(menu,function(k,v){
				var text = $(v).find('.MenuCaption').text();
				if (text == '订单查询') {
					$(v).bind("click",function(){
						getlist = setInterval(start,1000);
					})
					bool1 = 1;
				}
			})
		}
	})

	$('body').on('click', '#info', function() {
		var sn = $("#\\$4f87816c\\$tradeid").text().replace('未申请','').replace('已申请','').replace('已开票','');
		var nickname = $("#\\$4f87816c\\$customershopaccount").text();
		var item = [];
		var kf = $('#\\$80d499b2\\$home .ellipsis').text();
		var shop = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(shop_num).text();
		var d_list = $("#\\$4f87816c\\$c_gridDetails .GridBody .GridTable tr");
		if (d_list.length > 0) {
			$.each(d_list,function(k,v){
				var name = $(v).find('td').eq(item_name).text();
				var num = $(v).find('td').eq(item_num).text();
				if (name.length > 1 || num.length > 1 ) {
					var temp = {
						name: name,
						num: num,
					}
					item.push(temp)
				}
			})
		}
		send(sn,nickname,item,kf,shop);
	});

	$('body').on('click', '#invoice', function() {
		var status_text = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(status).text();
		// if (status_text != '已记账') {
		// 	layer.msg('只有已记账状态的订单才能提交开票!');
		// 	return false;
		// }
		var kf = $('#\\$80d499b2\\$home .ellipsis').text();
		var order = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(order_num).text();
		var shop = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(shop_num).text();
		var info = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_info).text();
		var name = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_name).text();
		var no = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_no).text();
		var remark = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_remark).text();
		var type = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_type).text();
		var sell = $('#\\$4f87816c\\$sellermemo').val();
		var item = [];
		var d_list = $("#\\$4f87816c\\$c_gridDetails .GridBody .GridTable tr");
		if (d_list.length > 0) {
			$.each(d_list,function(k,v){
				var name = $(v).find('td').eq(item_name).text();
				var unit = $(v).find('td').eq(item_unit).text();
				var price = $(v).find('td').eq(item_price).text();
				var num = $(v).find('td').eq(item_num).text();
				if (name.length > 1 || num.length > 1 ) {
					var temp = {
						name: name,
						unit: unit,
						price: price,
						num: num,
					}
					item.push(temp)
				}
			})
		}
        var param = {
            order: order,
            info: info,
            kf: kf,
            shop: shop,
            item: item,
            name: name,
            no: no,
            remark: remark,
            type: type,
            sell: sell,
        }
        $.post('https://s.kingdom.net.cn/api/home/index/getInvoiceInfo',param,function(res){
            layer.msg(res.msg)
        })
	});

	$('body').on('click', '#merge', function() {
		var status_text = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(status).text();
		// if (status_text != '已记账') {
		// 	layer.msg('只有已记账状态的订单才能提交开票!');
		// 	return false;
		// }

		var html = '<form class="form-horizontal" style="padding:20px;">'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">订单号：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" id="invoice_id" class="form-control" value="">'+
			     '</div>'+
			     '</div>'+
					'</form>';

		var form = layer.open({
			type: 1,
			title: '合并申请开票',
			area: ['500px','200px'],
			btn: ['提交'],
			closeBtn : 2,
			shadeClose: true,
			content: html,
			yes: function(index){
				var invoice_id = $('#invoice_id').val();
				var kf = $('#\\$80d499b2\\$home .ellipsis').text();
				var order = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(order_num).text();
				var shop = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(shop_num).text();
				var info = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_info).text();
				var name = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_name).text();
				var no = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_no).text();
				var remark = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_remark).text();
				var type = $('#\\$4f87816c\\$deliverMainGrid .GridBody').find('tr.active').find('td').eq(invoice_type).text();
				var sell = $('#\\$4f87816c\\$sellermemo').val();
				var item = [];
				var d_list = $("#\\$4f87816c\\$c_gridDetails .GridBody .GridTable tr");
				if (d_list.length > 0) {
					$.each(d_list,function(k,v){
						var name = $(v).find('td').eq(item_name).text();
						var unit = $(v).find('td').eq(item_unit).text();
						var price = $(v).find('td').eq(item_price).text();
						var num = $(v).find('td').eq(item_num).text();
						if (name.length > 1 || num.length > 1 ) {
							var temp = {
								name: name,
								unit: unit,
								price: price,
								num: num,
							}
							item.push(temp)
						}
					})
				}
				var param = {
					invoice_no: invoice_id,
					order: order,
					item: item,
            	shop: shop,
            	sell: sell,
				}
				$.post('https://s.kingdom.net.cn/api/home/index/mergeInvoiceInfo',param,function(res){
					layer.msg(res.msg)
				})
			}
		})
	});

	$('body').on('click', '#\\$4f87816c\\$doQueryBtn', function() {
		var td_list = $('#\\$4f87816c\\$deliverMainGrid .GridHeaderBar').find('td');
		$.each(td_list,function(k,v){
			if ($(v).text() == '网店名称' && $(v).css('display') != 'none') {
				shop_num = $(v).index()
			} else if ($(v).text() == '订单编号' && $(v).css('display') != 'none') {
				order_num = $(v).index()
			} else if ($(v).text() == '专票信息' && $(v).css('display') != 'none') {
				invoice_info = $(v).index()
			} else if ($(v).text() == '发票抬头' && $(v).css('display') != 'none') {
				invoice_name = $(v).index()
			} else if ($(v).text() == '纳税人识别号' && $(v).css('display') != 'none') {
				invoice_no = $(v).index()
			} else if ($(v).text() == '发票备注' && $(v).css('display') != 'none') {
				invoice_remark = $(v).index()
			} else if ($(v).text() == '发票种类' && $(v).css('display') != 'none') {
				invoice_type = $(v).index()
			} else if ($(v).text() == '处理状态' && $(v).css('display') != 'none') {
				status = $(v).index()
			}
		})
		var item_td = $('#\\$4f87816c\\$c_gridDetails .GridHeader').find('td');
		$.each(item_td,function(k,v){
			if ($(v).text() == '商品名称' && $(v).css('display') != 'none') {
				item_name = $(v).index()
			} else if ($(v).text() == '单位' && $(v).css('display') != 'none') {
				item_unit = $(v).index()
			} else if ($(v).text() == '订单单价' && $(v).css('display') != 'none') {
				item_price = $(v).index()
			} else if ($(v).text() == '数量' && $(v).css('display') != 'none') {
				item_num = $(v).index()
			}
		})
	})

	$('body').on('click', '#\\$4f87816c\\$deliverMainGrid .GridBody .GridBodyRow', function() {
		var order_no = $(this).find('td').eq(order_num).text();
		shop_name = $(this).find('td').eq(shop_num).text();

        $('#copyuser1').css('background','#D15B47');
        $('#copyuser2').css('background','#D15B47');

        $.post('https://s.kingdom.net.cn/api/home/index/searchOrderInfo',{order_no:order_no},function(res){
            if (res.code == 1) {
                if (res.data.result == 1) {
                    $('#copyuser1').css('background','#87B87F');
                } else if (res.data.result == 2) {
                    $('#copyuser1').css('background','#87B87F');
                    $('#copyuser2').css('background','#87B87F');
                }
						setTimeout(function(){
							$('#i_status').remove();
							if (res.data.status == 1) {
								var span = '<span id="i_status" style="background-color: #D15B47;color: #fff;padding:6px;font-size:12px;">已申请</span>';
								$('#\\$4f87816c\\$tradeid').append(span)
							} else if (res.data.status == 2) {
								var span = '<a target="_blank" href="'+res.data.pdf+'" id="i_status" style="background-color: #82AF6F;color: #fff;padding:6px;font-size:12px;">已开票</a>';
								$('#\\$4f87816c\\$tradeid').append(span)
							} else {
								var span = '<span id="i_status" style="background-color: #F89406;color: #fff;padding:6px;font-size:12px;">未申请</span>';
								$('#\\$4f87816c\\$tradeid').append(span)
							}
						},600)
            } else {
                layer.msg(res.msg,{icon: 2})
            }
        })
	})

	$('body').on('click', '#copyuser1', function() {
		var order_id = $("#\\$4f87816c\\$tradeid").text();
		var name = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edReceiver").val();
		var mobile = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edMobile").val();
		var province = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edCustomerProvince").val();
		var city = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edCustomerCity").val();
		var area = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edCustomerDistrict").val();
		var detail = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edAddress").val();
		var address = province+city+area+detail;
		var kf = $('#\\$80d499b2\\$home .ellipsis').text();
		var remark = $('#\\$4f87816c\\$sellermemo').val();
		var nick = $('#\\$4f87816c\\$customershopaccount').text().replace('旺旺在线','');
		var item = [];
		var d_list = $("#\\$4f87816c\\$c_gridDetails .GridBody .GridTable tr");
		if (d_list.length > 0) {
			$.each(d_list,function(k,v){
				var name = $(v).find('td').eq(item_name).text();
				var price = $(v).find('td').eq(item_price).text();
				var num = $(v).find('td').eq(item_num).text();
				if (name.length > 1 || num.length > 1 ) {
					var temp = {
						name: name,
						price: price,
						num: num,
					}
					item.push(temp)
				}
			})
		}
		var param = {
			order_id: order_id,
			name: name,
			mobile: mobile,
			address: address,
			type: 1,
			kf: kf,
			nick: nick,
			shop_name: shop_name,
			remark: remark,
			item: item,
			step: 1,
		}

		$.post('https://s.kingdom.net.cn/api/home/index/getUserInfo',param,function(res){
			if (res.code == 1) {
				$('#copyuser1').css('background','#87B87F');
				layer.msg(res.msg)
			} else {
				layer.msg(res.msg,{icon: 2})
			}
		})
	})

	$('body').on('click', '#copyuser2', function() {
		var order_id = $("#\\$4f87816c\\$tradeid").text();
		var name = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edReceiver").val();
		var mobile = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edMobile").val();
		var province = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edCustomerProvince").val();
		var city = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edCustomerCity").val();
		var area = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edCustomerDistrict").val();
		var detail = $("#\\$4f87816c\\$receiverinfo").find("#\\$4f87816c\\$edAddress").val();
		var address = province+city+area+detail;
		var kf = $('#\\$80d499b2\\$home .ellipsis').text();
		var remark = $('#\\$4f87816c\\$sellermemo').val();
		var item = [];
		var d_list = $("#\\$4f87816c\\$c_gridDetails .GridBody .GridTable tr");
		if (d_list.length > 0) {
			$.each(d_list,function(k,v){
				var name = $(v).find('td').eq(item_name).text();
				var price = $(v).find('td').eq(item_price).text();
				var num = $(v).find('td').eq(item_num).text();
				if (name.length > 1 || num.length > 1 ) {
					var temp = {
						name: name,
						price: price,
						num: num,
					}
					item.push(temp)
				}
			})
		}
		var param = {
			order_id: order_id,
			name: name,
			mobile: mobile,
			address: address,
			type: 1,
			kf: kf,
			shop_name: shop_name,
			remark: remark,
			item: item,
			step: 2,
		}

		$.post('https://s.kingdom.net.cn/api/home/index/getUserInfo',param,function(res){
			if (res.code == 1) {
				$('#copyuser2').css('background','#87B87F');
				layer.msg(res.msg)
			} else {
				layer.msg(res.msg,{icon: 2})
			}
		})
	})

	$('body').on('change', '#name', function() {
		var text = $('#name').val();
		var temp = text.split('，');
		$('#name').val(temp[0]);
		if (temp[1]) {
			$('#mobile').val(temp[1]);
		}
		if (temp[2]) {
			$('#address').val(temp[2]);
		}
	});

	function start() {
		var btn = $("#\\$4f87816c\\$doQueryBtn");
		if (btn.length > 0) {
            var info = $('#info');
            if (info.length == 0) {
                var merge = '<button style="margin-left:10px" id="merge" class="Button dselect">合并开票</button>';
                btn.after(merge);
                var invoice = '<button style="margin-left:10px" id="invoice" class="Button dselect">提交开票</button>';
                btn.after(invoice);
                var button = '<button style="margin-left:10px" id="info" class="Button dselect">生成回执编号</button>';
                btn.after(button);
            }
            var copyuser1 = $('#copyuser1');
            if (copyuser1.length == 0) {
                var copy1 = '<button style="margin-left:10px;color:#fff;background:#D15B47" id="copyuser1" class="Button dselect">复制加密信息</button>';
                $("#\\$4f87816c\\$receiverinfo").find('div:last').append(copy1);
            }
            var copyuser2 = $('#copyuser2');
            if (copyuser2.length == 0) {
                var copy2 = '<button style="margin-left:10px;color:#fff;background:#D15B47" id="copyuser2" class="Button dselect">复制明文信息</button>';
                $("#\\$4f87816c\\$receiverinfo").find('div:last').append(copy2);
            }
			clearInterval(getlist);
			console.log('success');
		} else {
			console.log('fail');
		}
	}

	function send(data1,data2,data3,data4,data5) {
		var html = '<form id="s_info" class="form-horizontal" style="padding:20px;">'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">提交人：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" readonly value="'+data4+'">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">店铺：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" readonly value="'+data5+'">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group data1">'+
			     '<label class="col-xs-3 control-label">订单编号：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="sn" value="'+data1+'">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">买家昵称：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="nickname" value="'+data2+'">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">买家姓名：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="name">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">买家电话：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="mobile">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">买家地址：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="address">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">回执编号：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="code">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">备注：</label>'+
			     '<div class="col-xs-9">'+
			     '<textarea class="form-control" id="remark" rows="5"></textarea>'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">寄回件仓库：</label>'+
			     '<div class="col-xs-9">'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="warehouse" value="长沙仓"> 长沙仓'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="warehouse" value="深圳仓 "> 深圳仓 '+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
		        '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">物流公司：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="delivery">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">物流单号：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" class="form-control" id="delivery_no">'+
			     '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">处理建议：</label>'+
			     '<div class="col-xs-9">'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="type" id="inlineRadio1" value="退款退货"> 退款退货'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="type" id="inlineRadio2" value="仅退款"> 仅退款'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="type" id="inlineRadio3" value="换货"> 换货'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="type" id="inlineRadio4" value="维修"> 维修'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="type" id="inlineRadio5" value="补发"> 补发'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="type" id="inlineRadio6" value="拦截件"> 拦截件'+
			     '</label>'+
		        '</div>'+
			     '</div>'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">问题归属：</label>'+
			     '<div class="col-xs-9">'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="belong" value="客服"> 客服'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="belong" value="产品"> 产品'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="belong" value="仓库"> 仓库'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="belong" value="运营"> 运营'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="belong" value="物流"> 物流'+
			     '</label>&nbsp;&nbsp;&nbsp;&nbsp;'+
			     '<label class="radio-inline">'+
			     '<input type="radio" name="belong" value="客户"> 客户'+
			     '</label>'+
		        '</div>'+
			     '</div>'+
				  '<table border=1 style="width:100%;text-align:center;margin-top:20px;">';
		html += '<tr>'+
				  '<td></td>'+
				  '<td>商品名称</td>'+
				  '<td>数量</td>'+
				'</tr>';
		$.each(data3,function(k,v){
		html += '<tr>'+
				  '<td><input type="checkbox" class="item" value="'+k+'" checked></td>'+
				  '<td>'+v.name+'</td>'+
				  '<td>'+v.num+'</td>'+
			   '</tr>';
		})
		html += '</table></form>';

		var form = layer.open({
			type: 1,
			id: 'form',
			title: '生成回执单',
			area: ['750px','500px'],
			btn: ['提交'],
			closeBtn : 2,
			shadeClose: true,
			content: html,
			yes: function(index){
				var checked = [];
				var item = $('#form .item');
				$.each(item,function(k,v){
					if ($(v).prop('checked') == false) {
						checked.push(k);
					}
				})
				var sn = $('#sn').val();
				var nickname = $('#nickname').val();
				var name = $('#name').val();
				var mobile = $('#mobile').val();
				var address = $('#address').val();
				var code = $('#code').val();
				var remark = $('#remark').val();
				var delivery = $('#delivery').val();
				var delivery_no = $('#delivery_no').val();
				var warehouse = $(':radio[name="warehouse"]:checked').val();
				var type = $(':radio[name="type"]:checked').val();
				var belong = $(':radio[name="belong"]:checked').val();
				var param = {
					kf:data4,
					shop:data5,
					warehouse:warehouse,
					sn:sn,
					nickname:nickname,
					name:name,
					mobile:mobile,
					address:address,
					code:code,
					remark:remark,
					delivery:delivery,
					delivery_no:delivery_no,
					type:type,
					belong:belong,
					item:data3,
					checked:checked,
				}
				$.post('https://s.kingdom.net.cn/api/home/index/record',param,function(res){
					if (res.code == 1) {
						$('.layui-layer-btn0').hide();
						layer.msg(res.msg,{icon: 1,time:1000},function(){
							var p = '<p style="text-align:center"><span>回执编号：</span><input style="width:100px;display:inline-block;" id="code" class="form-control" type="text" value="'+res.data+'" readonly></p>'
							$('#form').html(p);
						})
					} else {
						layer.msg(res.msg,{icon: 2})
					}
				})
			}
		})
		checkbind(data1)
	}

	$('body').on('click', '#code', function() {
		var input = document.getElementById('code');
		input.select();
		document.execCommand('copy');
		layer.msg('复制成功');
	})

	function checkbind(sn) {
		$.post('https://s.kingdom.net.cn/api/home/index/check',{sn:sn},function(res){
			if (res.code == 1) {
				$('#s_info .data1 div').append('<p style="margin-top: 10px;color: red;">（这个订单已关联待匹配工单）</p>');
				$('#s_info #delivery').val(res.data.delivery);
				$('#s_info #delivery_no').val(res.data.delivery_no);
			}
		})
	}
})();

