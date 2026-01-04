// ==UserScript==
// @license      MIT
// @name         淘跨余额监控
// @description  用于淘跨余额监控
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @author       liukx
// @match        https://distributor.taobao.global/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.global
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      erp.unstars.com
// @downloadURL https://update.greasyfork.org/scripts/512712/%E6%B7%98%E8%B7%A8%E4%BD%99%E9%A2%9D%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/512712/%E6%B7%98%E8%B7%A8%E4%BD%99%E9%A2%9D%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

function getUrlParams(url) {
	const searchParams = new URLSearchParams(url.split('?')[1]);
	const params = {};
	for (const [key, value] of searchParams.entries()) {
		params[key] = value;
	}
	return params;
}

const urlParams = getUrlParams(window.location.href);

;(function () {
	'use strict'

	const query_redirect = urlParams.redirect

	if(urlParams.token && urlParams.purchasePayAccountId){
		localStorage.setItem('token',urlParams.token)
		localStorage.setItem('purchasePayAccountId',urlParams.purchasePayAccountId)
	}else if(query_redirect){
		const redirectUrl = decodeURIComponent(query_redirect)
		const redirect_urlParams = getUrlParams(redirectUrl);
		if(redirect_urlParams.token && redirect_urlParams.purchasePayAccountId){
			localStorage.setItem('token',redirect_urlParams.token)
			localStorage.setItem('purchasePayAccountId',redirect_urlParams.purchasePayAccountId)
		}
	}

	// 示例使用
	function formatDate() {
		return new Intl.DateTimeFormat('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).format(new Date())
	}
	const script = () => {
		const token = localStorage.getItem('token');
		const purchasePayAccountId = localStorage.getItem('purchasePayAccountId');

		if(token && purchasePayAccountId){

		}else{
			alert('token || purchasePayAccountId 为空,请手动保存到localStorage')
		}

		console.log(`淘跨余额监控执行:${formatDate()}`)
		let url = location.href
		if (url.includes('https://distributor.taobao.global/apps/user/login')) {
			GM_xmlhttpRequest({
				method: 'GET',
				url: `https://erp.unstars.com/buffet/admin-api/taobao/iop/seller-chat-get-page-link?purchasePayAccountId=${purchasePayAccountId}`,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				onload: function (response) {
					console.log('Response:', response.responseText)

					const json = JSON.parse(response.responseText);
					const chatUrl = json.data

					window.location.href = chatUrl
				},
				onerror: function (error) {
					console.error('Error:', error)
				},
			})
		} else if(url.includes('https://distributor.taobao.global/apps/open/imchat')){
			setTimeout(()=>{
				window.location.href = `https://distributor.taobao.global/apps/dashboard`
			},5*1000)
		} else if (url.includes('https://distributor.taobao.global/apps/dashboard')) {
			let dom = document.querySelector('.next-icon.next-icon-eye-close');
			if (dom) {
				dom.click()
			}
			let total = document.evaluate(
				'//*[@id="layoutContent"]/div/div/div[2]/div[1]/div[3]/div[2]/div[1]/div/div/span',
				document,
				null,
				XPathResult.FIRST_ORDERED_NODE_TYPE,
				null
			).singleNodeValue;
			let account = document.evaluate(
				'//*[@id="layoutContent"]/div/div/div[2]/div[1]/div[1]',
				document,
				null,
				XPathResult.FIRST_ORDERED_NODE_TYPE,
				null
			).singleNodeValue;
			if (total.innerText.length) {
				const data = {
					cnyBalance: total.innerText.replace('CNH', ''),
					username: account.innerText.replace('\n子账号', ''),
				}
				console.log(`淘跨余额监控`, data)

				GM_xmlhttpRequest({
					method: 'POST',
					url: 'https://erp.unstars.com/buffet/admin-api/taobao/iop/push-kuajingbao-balance-message',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					data: JSON.stringify(data),
					onload: function (response) {
						console.log('Response:', response.responseText)
					},
					onerror: function (error) {
						console.error('Error:', error)
					},
				})
			}
		} else {
			alert('未处理的url: ' + url);
		}
	}
	setTimeout(() => {
		location.reload()
	}, 1000 * 60 * 10)
	setTimeout(() => {
		script()
	}, 5000)
	setInterval(() => {
		script()
	}, 1000 * 60)
})()
