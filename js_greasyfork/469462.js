// ==UserScript==
// @name         bilibili查看关注时间
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  bilibili查看关注时间，只限关注列表的全部关注生效,增加关注页面,增加web手机页面(这种https://m.bilibili.com/space/4176573)。优化未关注的，和自己页面的显示
// @author       YuNi_Vsinger
// @match        https://space.bilibili.com/*
// @match        https://m.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469462/bilibili%E6%9F%A5%E7%9C%8B%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/469462/bilibili%E6%9F%A5%E7%9C%8B%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// https://api.bilibili.com/x/space/acc/relation?mid=

	window.onload = function () {
		let currentUrl = window.location.href;
		if (currentUrl.includes('/fans/')) {

			setInterval(() => {
				let ulElement = document.querySelector('.be-pager-item-active');
				let active = document.querySelector('.follow-tabs .active');
				// console.log('active:', active.textContent);
				let userId = currentUrl.match(/(?<=space\.bilibili\.com\/)\d+/)[0];
				let url = `https://api.bilibili.com/x/relation/followings?vmid=${userId}&pn=${ulElement.textContent}&ps=20&order=desc&order_type=attention`
				if (active.textContent == '最近关注') {
					url = `https://api.bilibili.com/x/relation/followings?vmid=${userId}&pn=${ulElement.textContent}&ps=20&order=desc&order_type=`
				}
				getList(url)
			}, 1000);
		} else 	if (currentUrl.includes('m.bilibili.com/space')) {
			// console.log('手机端:', currentUrl);


			const regex = /\/(\d+)(\?|\/|$)/;
			const matches = currentUrl.match(regex);
			if (matches && matches.length >= 2) {
				let userId = matches[1];
				// console.log('userId:', userId);

				let url = `https://api.bilibili.com/x/space/acc/relation?mid=${userId}`
				getOne(url)
			}


		}
		 else {
			// console.log('currentUrl:', currentUrl);
			const regex = /\/(\d+)(\?|\/|$)/;
			const matches = currentUrl.match(regex);
			if (matches && matches.length >= 2) {
				let userId = matches[1];
				// console.log('userId:', userId);

				let url = `https://api.bilibili.com/x/space/acc/relation?mid=${userId}`
				getOne(url)
			}


		}
	}


	function getList (url) {
		GM_xmlhttpRequest({
			method: 'get',
			headers: {
				"Content-Type": "text/plain",
			},
			data: url,
			url: url,
			onload: (r) => {
				// console.log("GM_xmlhttpRequest", r.response);
				let response = JSON.parse(r.response);

				// console.log("response", response.data.list);
				let list = response.data.list
				// 查找 class 为 .fans-name 的元素
				let elements = document.getElementsByClassName('fans-name');


				list.forEach(element => {
					// 遍历每个元素
					for (let i = 0; i < elements.length; i++) {
						let e = elements[i];
						if (e.textContent === element.uname) {
							// 找到满足条件的元素

							e.textContent = e.textContent + "[" + timestamptoDate(element.mtime) + "]";
						}
					}
				});




			},
		})
	}
	function getOne (url) {

		GM_xmlhttpRequest({
			method: 'get',
			headers: {
				"Content-Type": "text/plain",
			},
			data: url,
			url: url,
			onload: (r) => {
				// console.log('r:', r);

				let response = JSON.parse(r.response);
				// console.log('response:', response);

				let element = document.getElementById('h-name');
				if(!element){
					 element = document.getElementsByClassName('name')[0];
				}
				if(response.data.relation.mtime && response.data.relation.mtime>0){
					element.textContent = element.textContent + "[" + timestamptoDate(response.data.relation.mtime) + "]";
				}
				
			},
		})
	}

	function timestamptoDate (timestamp) {

		var timestampInMillis = timestamp * 1000;

		// 使用 Date 对象创建一个新的日期实例，并传入毫秒级时间戳作为参数
		var date = new Date(timestampInMillis);


		// console.log('date:', date);

		// 使用 Date 对象提供的各种方法获取年、月、日、小时、分钟、秒等信息
		var year = date.getFullYear();       // 获取年份
		var month = date.getMonth() + 1;     // 获取月份（注意月份从 0 开始，所以要加 1）
		var day = date.getDate();            // 获取日期
		var hours = date.getHours();         // 获取小时
		var minutes = date.getMinutes();     // 获取分钟
		var seconds = date.getSeconds();     // 获取秒数

		// 使用获取到的各个时间部分拼接成最终的时间字符串
		return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;



	}

})();