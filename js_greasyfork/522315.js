// ==UserScript==
// @name         GMGN Network Monitor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Monitor network requests and responses for GMGN
// @author       Your name
// @match        https://gmgn.ai/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522315/GMGN%20Network%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/522315/GMGN%20Network%20Monitor.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const TARGET_PATH = 'sol/new_pairs/1h';
	const CACHE_DURATION = 60 * 60 * 1000; // 1小时的毫秒数

	// 添加缓存对象
	const symbolCache = new Map();

	// 清理过期缓存
	setInterval(() => {
		const now = Date.now();
		for (const [symbol, timestamp] of symbolCache.entries()) {
			if (now - timestamp > CACHE_DURATION) {
				symbolCache.delete(symbol);
			}
		}
	}, 10000);

	// 创建一个显示面板
	const panel = document.createElement('div');
	panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 400px;
        max-height: 600px;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        overflow-y: auto;
        font-family: monospace;
        font-size: 12px;
    `;
	document.body.appendChild(panel);

	// 创建清除按钮
	const clearButton = document.createElement('button');
	clearButton.textContent = '清除日志';
	clearButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 5px;
        background: #ff4444;
        border: none;
        border-radius: 3px;
        color: white;
        cursor: pointer;
    `;
	clearButton.onclick = () => panel.innerHTML = '';
	panel.appendChild(clearButton);

	// 检查URL是否包含目标路径
	const shouldMonitorUrl = (url) => url.includes(TARGET_PATH);

	// 监控 XMLHttpRequest
	const XHR = XMLHttpRequest.prototype;
	const send = XHR.send;
	const open = XHR.open;

	XHR.open = function (method, url) {
		this._method = method;
		this._url = url;
		return open.apply(this, arguments);
	};

	const BOT_TOKEN = '7679670113:AAHTYAvdk8Eb3rO412krML9wSx645n2RS4o';
	const CHAT_ID = '-4786653211';

	// 发送消息到 Telegram
	const sendToTelegram = async (message) => {

		const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: CHAT_ID,
					text: message,
					parse_mode: 'HTML',
				}),
			});
			const data = await response.json();
			if (!data.ok) {
				console.error('Failed to send message to Telegram:', data);
			}


		} catch (error) {
			console.error('Error sending to Telegram:', error);
		}
	};

	// 处理响应数据的方法
	const handleResponse = (data) => {
		if (!data?.data?.pairs || !Array.isArray(data.data.pairs)) {
			console.log('Invalid response format');
			return;
		}

		if (data.data.pairs.length === 0) {
			return;
		}


		// 处理每个代币数据
		const processedData = data.data.pairs;


		if (processedData.length > 0) {
			// 为每个代币创建单独的消息
			processedData.forEach(token => {
				const symbol = token.base_token_info.symbol;
				const now = Date.now();
				const lastSent = symbolCache.get(symbol);

				if (!lastSent || (now - lastSent) > CACHE_DURATION) {
					symbolCache.set(symbol, now);
				} else {
					return;
				}

				const message = `🚀Ticker: ${token.base_token_info.symbol}

💰价格: $${token.base_token_info.price}

📝CA: <code>${token.base_address}</code>

⏰时间: ${new Date(token.open_timestamp * 1000).toLocaleString()}
🏷️市值: ${(token.base_token_info.market_cap / 1000).toFixed(2)}k

⌛️开盘时长: ${Math.floor((Date.now() - token.open_timestamp * 1000) / 60000)}分钟

📊统计:
持有人数: ${token.base_token_info.holder_count}
交易统计: ${token.base_token_info.swaps}次 (买入${token.base_token_info.buys}次, 卖出${token.base_token_info.sells}次)
TOP10占比 ${(token.base_token_info.top_10_holder_rate * 100).toFixed(2)}% ${token.base_token_info.top_10_holder_rate * 100 >= 30 ? '❌' : '✅'}
老鼠仓占比 ${token.base_token_info.rat_trader_amount_rate * 100}% ${token.base_token_info.rat_trader_amount_rate * 100 >= 5 ? '❌' : '✅'}

GMGN K线
\u200Bhttps://gmgn.ai/sol/token/${token.base_address}

🔍 Twitter搜索
\u200Bhttps://x.com/search?q=${encodeURIComponent(token.base_token_info.address)}&src=typed_query&f=live`;

				// 发送到 Telegram
				sendToTelegram(message);
				// 更新显示面板
				const entry = document.createElement('div');
				entry.style.borderBottom = '1px solid #444';
				entry.style.padding = '5px 0';
				entry.innerHTML = entry.innerHTML + `
		<div style="color: #4CAF50">${new Date().toLocaleTimeString()}</div>
		<div style="white-space: pre-wrap; font-family: monospace;">
			${message}
		</div>
	`;
				panel.appendChild(entry);
				panel.scrollTop = panel.scrollHeight;
			});
		}
	};

	XHR.send = function () {
		if (shouldMonitorUrl(this._url)) {
			this.addEventListener('load', function () {
				try {
					const response = JSON.parse(this.responseText);
					handleResponse(response);
				} catch (e) {
					console.log('Response is not JSON' + e.message);
				}
			});
		}
		return send.apply(this, arguments);
	};

	// 监控 Fetch
	const originalFetch = window.fetch;
	window.fetch = async function () {
		const response = await originalFetch.apply(this, arguments);
		const url = arguments[0];
		const method = arguments[1]?.method || 'GET';

		if (shouldMonitorUrl(url.toString())) {
			response.clone().json().then(data => {
				handleResponse(data);
			}).catch(() => {
				console.log('Fetch response is not JSON');
			});
		}

		return response;
	};
})();
