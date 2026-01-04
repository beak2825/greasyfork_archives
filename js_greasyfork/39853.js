// ==UserScript==
// @name         重庆大学一卡通支付宝快捷支付
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  支持将重庆大学一卡通网站个人图片隐藏、快捷使用支付宝支付，手机版使用支付宝支付
// @author       wang0.618@qq.com
// @include http://card.cqu.edu.cn/*
// @include http://pay.cqu.edu.cn/payment/pay/payment_selBank.action*
// @downloadURL https://update.greasyfork.org/scripts/39853/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E4%B8%80%E5%8D%A1%E9%80%9A%E6%94%AF%E4%BB%98%E5%AE%9D%E5%BF%AB%E6%8D%B7%E6%94%AF%E4%BB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/39853/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E4%B8%80%E5%8D%A1%E9%80%9A%E6%94%AF%E4%BB%98%E5%AE%9D%E5%BF%AB%E6%8D%B7%E6%94%AF%E4%BB%98.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var site_fun = {
		'Phone/Login': function() {
			window.location.href = 'http://card.cqu.edu.cn/cassyno/index';

		},
		// 改用支付宝支付
		'ComePage': function() {
			if (goReCharge) {
				window.eval.call(window, new String(goReCharge).replace('wap', 'web'));
				console.log(111);
			}

		},
		//http://pay.cqu.edu.cn/payment/pay/payment_selBank.action
		'payment_selBank.action': function() {
			var QueryString = function() {
				// This function is anonymous, is executed immediately and
				// the return value is assigned to QueryString!
				var query_string = {};
				var query = window.location.search.substring(1);
				var vars = query.split("&");
				for (var i = 0; i < vars.length; i++) {
					var pair = vars[i].split("=");
					// If first entry with this name
					if (typeof query_string[pair[0]] === "undefined") {
						query_string[pair[0]] = decodeURIComponent(pair[1]);
						// If second entry with this name
					} else if (typeof query_string[pair[0]] === "string") {
						var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
						query_string[pair[0]] = arr;
						// If third or later entry with this name
					} else {
						query_string[pair[0]].push(decodeURIComponent(pair[1]));
					}
				}
				return query_string;
			} ();
			var id = QueryString['billinfo.billno'];
			window.location.href = 'http://pay.cqu.edu.cn/payment/pay/payment_ebankPay.action?bankid=APAY&ticketTitle=&billno=' + id;
		}
	};

	for (var site in site_fun) {
		if (window.location.href.indexOf(site) != -1) {
			site_fun[site]();
			// console.log(site,site_fun[site]);
		}
	}
	// 去除头像图片
	$('#img_photo').hide();
	if ($("#login-type-list").length) {
		window.location.href = 'http://card.cqu.edu.cn/cassyno/index';
	}

})();