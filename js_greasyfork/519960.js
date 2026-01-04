// ==UserScript==
// @name         MEXC Futures Data Scraper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  抓取 MEXC 期货页面数据
// @author       Your name
// @match        https://futures.mexc.com/*
// @run-at       document-start
// @license 	 MIT
// @downloadURL https://update.greasyfork.org/scripts/519960/MEXC%20Futures%20Data%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/519960/MEXC%20Futures%20Data%20Scraper.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 创建状态显示元素
	const statusDiv = document.createElement('div');
	statusDiv.style.position = 'fixed';
	statusDiv.style.top = '60px';
	statusDiv.style.right = '500px';
	statusDiv.style.padding = '10px';
	statusDiv.style.background = '#333';
	statusDiv.style.color = 'white';
	statusDiv.style.zIndex = '9999';
	statusDiv.style.borderRadius = '5px';
	statusDiv.style.fontSize = '15px';
	statusDiv.style.width = '200px';

	// 数据抓取函数
	function scrapeData() {
		try {
			const priceElements = document.getElementsByClassName('PriceText_text__STO26');
			const contractElements = document.getElementsByClassName('contractDetail_itemContent__q97Yv');

			let status = '';
			let nowPrice = 0;
			let heliPrice = 0;

			// get参数
			let arrowText = new URLSearchParams(window.location.search).get('arrow') ?? '';

			if (priceElements && priceElements.length > 0) {
				nowPrice = parseFloat(priceElements[0].innerText.replace(/[^\d.]/g, ''));
			}

			if (contractElements && contractElements.length > 2) {
				heliPrice = parseFloat(contractElements[2].textContent.trim().replace(/[^\d.]/g, ''));
			}

			if (nowPrice > 0 && heliPrice > 0) {
				const arrow = nowPrice > heliPrice ? '↓' : '↑';
				const percentage = ((nowPrice - heliPrice) / heliPrice * 100).toFixed(2);
				const percentageColor = Math.abs(percentage) > 3 ? 'red' : 'white';
				status += `${arrowText}<br>现价: ${nowPrice}<br>合理: ${heliPrice}<br>${arrow}盾: <span style="color: ${percentageColor};">${percentage}%</span>`;
			}

			statusDiv.innerHTML = status;
		} catch (error) {
			statusDiv.textContent = '数据获取失败: ' + error.message;
			console.error('数据抓取错误:', error);
		}
	}


	function changeColor(color, fontSize) {
		const elements = document.getElementsByClassName('component_itemValue__O8fBA');
		console.log(elements);
		if (!elements || elements.length === 0) {
			setTimeout(() => changeColor(color, fontSize), 100);
			return;
		}
		for (let i = 0; i < elements.length; i++) {
			if (i == 4) {
				elements[i].style.color = color;
				elements[i].style.fontSize = fontSize;
			}
		}
	}

	// 添加状态显示元素到页面
	function addStatusElement() {
		if (document.body) {
			changeColor('#fff', '32px');
			document.body.appendChild(statusDiv);
			// 开始定期抓取数据
			setInterval(scrapeData, 1000);
		} else {
			setTimeout(addStatusElement, 100);
		}
	}

	addStatusElement();
})();