// ==UserScript==
// @name        YouTube 直播聊天实时翻译
// @version     1.5
// @author      lslqtz
// @license     GPL
// @grant       GM.xmlHttpRequest
// @inject-into content
// @run-at      document-end
// @match       *://*.youtube.com/live_chat*
// @namespace https://greasyfork.org/users/155581
// @description Same as the name
// @downloadURL https://update.greasyfork.org/scripts/520425/YouTube%20%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E5%AE%9E%E6%97%B6%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/520425/YouTube%20%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E5%AE%9E%E6%97%B6%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

window.YTGMFetch = function (url, options = {}) {
	return new Promise((resolve, reject) => {
		const method = options.method || 'GET';
		const headers = options.headers || {};
		const body = options.body || null;

		GM.xmlHttpRequest({
			method: method,
			url: url,
			headers: headers,
			data: body,
			responseType: options.responseType || 'text',
			onload: function (response) {
				const fetchResponse = {
					ok: response.status >= 200 && response.status < 300,
					status: response.status,
					statusText: response.statusText,
					url: response.finalUrl,
					text: () => Promise.resolve(response.responseText),
					json: () => Promise.resolve(JSON.parse(response.responseText)),
					blob: () => Promise.resolve(new Blob([response.response])),
					arrayBuffer: () => Promise.resolve(response.response),
					headers: {
						get: (header) => {
							const headersArray = response.responseHeaders.split('\r\n');
							const headerMap = headersArray.reduce((acc, curr) => {
								const [key, value] = curr.split(': ');
								if (key && value) acc[key.toLowerCase()] = value;
								return acc;
							}, {});
							return headerMap[header.toLowerCase()] || null;
						},
					},
				};

				resolve(fetchResponse);
			},
			onerror: function () {
				reject(new TypeError('Network request failed.'));
			},
			ontimeout: function () {
				reject(new TypeError('Network request timed out.'));
			},
			onabort: function () {
				reject(new DOMException('The operation was aborted.', 'AbortError'));
			},
		});
	});
};
window.ytTextEncoder = new TextEncoder();
window.ytIsSolvingCaptcha = false;
window.ytSymbolRegex = /^([\u{2190}-\u{21FF}]|[\u{2300}-\u{23FF}]|[\u{2460}-\u{24FF}]|[\u{2500}-\u{25FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{2B00}-\u{2BFF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F6FF}]|[\u{1F900}-\u{1FAFF}]|[\u{1FB00}-\u{1FBFF}]|[ !"#$%&'()*+,-./:;<=>?@\[\\\]^_`\{|\}~。，“”、：；？！〝〞〟～〜])+$/u;

// 停止翻译脚本.
function StopYouTubeLiveChatTranslator() {
	console.log("停止 YouTube 直播聊天翻译脚本");

	if (window.ytLiveChatInterval) {
		clearInterval(window.ytLiveChatInterval);
		console.log("已清除计时器");
	}

	if (window.ytObserver) {
		window.ytObserver.disconnect();
		window.ytObserver = null;
		console.log("已清除观察器");
	}
	
	window.chatContainerNotFoundCount = 0;
	window.ytIsSolvingCaptcha = false;
}

// 启动翻译脚本.
function StartYouTubeLiveChatTranslator() {
	console.log("启动 YouTube 直播聊天翻译脚本");

	// 启动定时器.
	window.ytLiveChatInterval = setInterval(CheckAndObserveChatContainer, 1000);
}

function ShowReCaptchaPrompt(onResolved) {
	if (window.ytIsSolvingCaptcha) {
		return;
	}

	window.ytIsSolvingCaptcha = true;

	// 创建提示框 HTML.
	var promptBox = document.createElement("div");
	promptBox.style = `
		position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
		padding: 5px; width: 70%; background: white; border: 1px solid gray; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
		z-index: 10000; text-align: center; font-size: 16px;
	`;
	promptBox.innerHTML = `
		<h3 style="margin-bottom: 15px;">YouTube 直播聊天实时翻译</h3>
		<p style="margin-bottom: 15px;">HTTP 429: 检测到疑似频繁请求触发 reCaptcha 验证码验证.</p>
		<p style="margin-bottom: 15px;">手动访问 <a href="https://translate.googleapis.com/translate_a/single" target="_blank" style="color: blue;">Google Translate API</a> 并完成验证码验证.</p>
		<p style="margin-bottom: 15px;">完成验证后, 点按"我已完成", 即可继续开始翻译.</p>
		<button id="ytRecaptchaResolvedButton">我已完成</button> <button id="ytDisableTranslation">停用翻译</button>
	`;

	document.body.appendChild(promptBox);

	document.getElementById("ytRecaptchaResolvedButton").addEventListener("click", () => {
		promptBox.remove();
		window.ytIsSolvingCaptcha = false;
	});
	document.getElementById("ytDisableTranslation").addEventListener("click", () => {
		promptBox.remove();
		StopYouTubeLiveChatTranslator();
	});
}

// Google Translate API 调用.
async function TranslateText(text, targetLang = 'zh-CN') {
	console.log("翻译消息: " + text);

	if (window.ytIsSolvingCaptcha) {
		return "[翻译失败: 等待解决验证码]";
	}

	try {
		var response = await YTGMFetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + targetLang + '&dt=t&q=' + encodeURIComponent(text));
		if (!response.ok) {
			console.error("翻译 API 请求失败", response.status, response.statusText);
			if (response.status === 429) {
				ShowReCaptchaPrompt();
				return "[翻译失败: 疑似频繁请求触发 reCaptcha 验证码]";
			}
			return `[翻译失败: HTTP ${response.status} ${response.statusText}]`;
		}

		var result = await response.json();
		if (!result || !result[0] || !Array.isArray(result[0])) {
			return "[翻译失败: 无法解析翻译 API 返回的内容]";
		}

		return result[0].map(segment => segment[0]).join('');
	} catch (error) {
		console.error("翻译出错", error);
		return "[翻译出错]";
	}
}

// 解析消息内容, 过滤表情和图片, 并将它们替换为占位符.
function ExtractTextContent(element) {
	var text = '';
	var elements = element.childNodes;
	var placeholders = []; // 存储占位符与原始内容的对应关系.
	var hasText = false;

	elements.forEach(function (node, index) {
		if (node.nodeType === Node.TEXT_NODE) {
			if (!hasText && !node.nodeValue.trim().split(/\r?\n/).every(line => window.ytSymbolRegex.test(line))) {
				hasText = true;
			}
			text += node.nodeValue.trim();
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			if (node.tagName.toLowerCase() === 'img' || (node.tagName.toLowerCase() === 'span' && node.classList.contains('emoji'))) {
				var placeholder = `{{ytPH${index}}}`; // 使用占位符.
				placeholders.push({ placeholder: placeholder, html: node.outerHTML });
				text += placeholder; // 将表情或图片替换为占位符.
			}
		}
	});

	if (!hasText || (text.trim().length <= 2 && window.ytTextEncoder.encode(text.trim()).length <= 4)) {
		return { text: "", placeholders: [] };
	}
	return { text: text.trim(), placeholders: placeholders };
}

// 重新将占位符替换为表情和图片.
function InsertPlaceholdersIntoTranslation(translatedMessage, placeholders) {
	translatedMessage = translatedMessage.replace('{ {', '{{').replace('} }', '}}');
	placeholders.forEach(function (placeholder) {
		translatedMessage = translatedMessage.replace(new RegExp(placeholder.placeholder, 'gi'), placeholder.html);
	});
	return translatedMessage;
}

// 插入翻译后的消息.
function InsertTranslatedMessage(messageElement, translatedMessage) {
	var translationElement = document.createElement('div');
	translationElement.style.color = 'gray';
	translationElement.style.fontSize = 'small';
	translationElement.className = 'translated-message';
	translationElement.innerHTML = "[翻译]: " + translatedMessage;

	// 在原消息下方插入翻译内容.
	messageElement.appendChild(translationElement);
}

// 检查并观察聊天容器.
function CheckAndObserveChatContainer() {
	var chatContainer = document.querySelector('yt-live-chat-app');
	if (chatContainer) {
		if (!window.ytObserver) {
			console.log("聊天容器找到: ", chatContainer);
			ObserveChatUpdates(chatContainer);
			TranslateInitialMessages(chatContainer);
		}
	} else if (window.ytObserver) {
		if (window.chatContainerNotFoundCount++ >= 3) {
			window.chatContainerNotFoundCount = 0;
			window.ytObserver.disconnect();
			window.ytObserver = null;
			console.log("聊天容器已丢失, 停止以前监听的聊天更新");
		}
	}
}

// 翻译已有的最新 20 条消息.
async function TranslateInitialMessages(chatContainer) {
	console.log("开始翻译已有消息...");

	// 获取所有聊天消息节点.
	var messages = chatContainer.querySelectorAll('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer');
	var totalMessages = messages.length;

	// 只处理最后的 10 条消息.
	for (var i = Math.max(0, totalMessages - 10); i < totalMessages; i++) {
		var messageNode = messages[i];
		var messageElement = messageNode.querySelector('#message');
		if (messageElement) {
			// 跳过已翻译消息.
			if (messageElement.querySelector('.translated-message')) {
				console.log("消息已翻译，跳过: ", messageElement.textContent);
				continue;
			}
			var { text, placeholders } = ExtractTextContent(messageElement);
			if (text.length === 0) {
				console.log("已有消息内容为空，跳过翻译");
				continue;
			}
			console.log("已有消息: " + text);
			var translatedMessage = await TranslateText(text);
			if (translatedMessage.length === 0) {
				console.log("翻译消息内容为空，跳过翻译");
				continue;
			}
			console.log("翻译消息: " + text);
			var finalMessage = InsertPlaceholdersIntoTranslation(translatedMessage, placeholders);
			InsertTranslatedMessage(messageElement, finalMessage);
		}
	}
}

// 监听聊天消息更新.
function ObserveChatUpdates(chatContainer) {
	window.ytObserver = new MutationObserver(async function (mutations) {
		for (var i = 0; i < mutations.length; i++) {
			var mutation = mutations[i];
			if (mutation.type !== 'childList') {
				continue;
			}
			mutation.addedNodes.forEach(async function (node) {
				// 检查是否为聊天消息.
				if (node.nodeType === 1 && (node.tagName.toLowerCase() === 'yt-live-chat-text-message-renderer' || node.tagName.toLowerCase() === 'yt-live-chat-paid-message-renderer')) {
					var messageElement = node.querySelector('#message');
					if (messageElement) {
						// 跳过已翻译消息.
						if (messageElement.querySelector('.translated-message')) {
							console.log("消息已翻译，跳过: ", messageElement.textContent);
							return;
						}
						// 提取文本并替换表情或图片为占位符.
						var { text, placeholders } = ExtractTextContent(messageElement);
						if (text.length === 0) {
							console.log("消息内容为空, 跳过翻译");
							return;
						}
						console.log("检测到新消息: " + text);
						var translatedMessage = await TranslateText(text);

						// 将翻译后的文本和表情或图片组合.
						var finalMessage = InsertPlaceholdersIntoTranslation(translatedMessage, placeholders);
						InsertTranslatedMessage(messageElement, finalMessage);
					} else {
						console.warn("未找到消息内容元素");
					}
				}
			});
		}
	});

	console.log("开始监听聊天更新...");
	window.ytObserver.observe(chatContainer, { childList: true, subtree: true });
}

StopYouTubeLiveChatTranslator();
StartYouTubeLiveChatTranslator();
