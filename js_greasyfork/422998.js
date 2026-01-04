// ==UserScript==
// @name         xdd商品抓取
// @namespace    http://www.isyouday.com/
// @version      0.4.5
// @description  spider
// @author       清梦压星河
// @email        none
// @require      https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js
// @match        *://pifa.pinduoduo.com/goods/detail/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422998/xdd%E5%95%86%E5%93%81%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/422998/xdd%E5%95%86%E5%93%81%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==
$(function($) {
	'use strict';

	$("body .right").append('<div id="spider-data" class="sp-btn">开始采集</div>');
	GM_addStyle('#spider-data{cursor: pointer;position:fixed;top:-100px;z-index:100;display: flex;-webkit-box-pack: center;justify-content: center;-webkit-box-align: center;align-items: center;flex-direction: column;text-align: center;}' + '#spider-data{background-color:#9ED9EB;color:#fff;height: 64px;width: 64px;border: 1px solid rgba(235, 235, 235, 0.8);}' +
              '.sp-btn:before, .sp-btn:after{  position:absolute;  content:"";  box-shadow:0 -7px 35px 18px #9ED9EB;  top:40px;left:10px;bottom:50px;  width:15%;  z-index:-1;  -webkit-transform: rotate(-8deg);  -moz-transform: rotate(-8deg);  transform: rotate(-8deg);}.sp-btn:after{  -webkit-transform: rotate(8deg);  -moz-transform: rotate(8deg);  transform: rotate(8deg);  right: 10px;left: auto;}' +
              '');

	let url = 'http://dserp.imxinxi.com/spider/pdd';
	let is_pass = 1;
	let url_obj = new URL(window.location);
        let url_params = new URLSearchParams(url_obj.search);
        let goods_id = url_params.get('gid');
	let data = {
		goods_id: goods_id,
		goods_title: '',
		goods_remark: '',
		header_img: [],
		goods_url: url_obj.href,
		price: [],
		goods_tag: [],
		goods_sku: [],
		goods_attr: [],
		goods_desc: [],
		goods_desc_str: ''
	};

	function _console(data, title = '') {
		console.log('---------------' + title + 'Start-----------------');
        console.info(data);
        console.log('---------------' + title + 'End-----------------');
	}

	// 数据解析
	function parse_goods() {
		data.goods_title = $('.goods-name .goods-n-title').text();
		// 头图
		$('.goodsHeadInfoL img').each(function() {
			data.header_img.push($(this).attr('src'));
		});
		// 批发价
		data.price.push({
			title: "批发价",
			price: $('.current-price').text(),
			currency: "CNY"
		});
		// 原价
		data.price.push({
			title: "原价",
			price: $('.origin-price').text(),
			currency: "CNY"
		});
		// tag
		$('.goods-tag').each(function() {
			data.goods_tag.push($(this).text());
		});
		// sku
		let sku_type = [];
		$('.sku-select-row').each(function() {
			sku_type.push($(this).find('.sku-select-row-label').text());
		});
		let is_over = false;
		let sku_list_sign = 'pointer';
		let do_sign_class = 'pointer';
		let n = 0;
		while (sku_list_sign == do_sign_class && n < 100) {
			$('.sku-list-row').each(function() {
				let _sku_img = $(this).find('.sku-image img').attr('src');
				let _sku_title = $(this).find('.sku-title').text();
				_sku_title = _sku_title.substring(_sku_title.lastIndexOf('}') + 1);
				let _sku_tilte_arr = _sku_title.split('；');
				let _sku_price = $(this).find('.sku-price').text();
				let _sku_specs = [];
				$.each(sku_type,
				function(k, v) {
					let c_sku_specs = {
						'name': v,
						'value': _sku_tilte_arr[k]
					};
					_sku_specs.push(c_sku_specs);
				});

				let _sku_data = {
					sku_img: _sku_img,
					sku_title: _sku_title,
					sku_price: _sku_price,
					sku_specs: _sku_specs
				};

				data.goods_sku.push(_sku_data);
			});
			sku_list_sign = $('li[data-testid=beast-core-pagination-next]').css('cursor');
                        if(sku_list_sign == 'undefined' || !sku_list_sign){ break; }
			$('li[data-testid=beast-core-pagination-next]').trigger('click');
			n++;
		}

		// 属性
		$('.detailHeader .subItemWrapper').each(function() {
			let cur_label = $(this).find('.subItemLabel').text();
			let cur_val = $(this).find('.subItemVal').text();
			data.goods_attr.push({
				name: cur_label,
				value: cur_val
			});
		});
		// 详情
		let _desc = $('.detailContent').html();
		data.goods_desc_str = _desc;
		$('.detailContent img').each(function() {
			data.goods_desc.push($(this).attr('src'));
		});

		if (data.header_img.length == 0 || data.pf_price == 0 || data.org_price == 0) {
			alert('当前页面不在解析目标范围内，无法采集');
			is_pass = 0;
		}
		_console(JSON.stringify(data, null, 4), '商品信息');
		return data;
	}

	// 数据传输
	function send_data(data) {
		if (!is_pass) { return; }
		var param = { data: data };
		is_pass = 0;
		GM_xmlhttpRequest({
			method: "POST",
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			url: url,
			dataType: "json",
			data: JSON.stringify(param),
			onload: function(response) {
				is_pass = 1;
				alert(response.response);
				_console(response.response, 'request')
			}
		});
	}

	// 抓取
	$("#spider-data").click(function() { send_data(parse_goods()); });
});