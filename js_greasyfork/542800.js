// ==UserScript==
// @name			AI Chat Tools
// @namespace		https://muyi.tw/lab/tokens-tools
// @version			0.6.5
// @description		Count tokens and manage context with export functions
// @author			MuYi + Copilot
// @match			*://chatgpt.com/*
// @match			*://github.com/*
// @match			*://gemini.google.com/*
// @grant			none
// @license			AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/542800/AI%20Chat%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/542800/AI%20Chat%20Tools.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// ====== CONFIG ======
	const CONFIG = {
		selectors: {
			inputText: [
				'div#prompt-textarea',
				'#copilot-chat-textarea-preview',
				'div.ql-editor'
			].join(', '),
			userText: [
				'article div[data-message-author-role="user"]',
				'div[class*="ChatMessage-module__user"] h3.sr-only + div',
				'user-query-content div.query-text'
			].join(', '),
			botText: [
				'article div[data-message-author-role="assistant"]',
				'article div.cm-content',
				'div[class*="ChatMessage-module__ai"] h3.sr-only + div',
				'model-response message-content.model-response-text',
				'model-response .response-content .model-response-text',
			].join(', ')
		},
		validPathPatterns: [
			/\/c\/[0-9a-fA-F\-]{36}/,
			/\/copilot\/c\/[0-9a-fA-F\-]{36}/,
			/\/(?:u\/\d+\/)?app\/[0-9a-fA-F\-]{16}/,
			/\/(?:u\/\d+\/)?gem\/.*$/,
		],
		updateInterval: 1000,
		chunkSize: 6000,
		tokenWarningThreshold: 100000,
		summaryText: '請總結上方對話為技術說明。',
		uiStyle: {
			position: 'fixed',
			bottom: '10%',
			right: '2.5em',
			zIndex: '9999',
			padding: '.5em',
			backgroundColor: 'rgba(0,0,0,0.5)',
			color: 'white',
			fontSize: '100%',
			borderRadius: '.5em',
			fontFamily: 'monospace',
			display: 'none',
		}
	};

	// ====== LOCALE ======
	const localeMap = {
		'zh-hant': {
			calculating: 'Token Counter 計算中⋯⋯',
			total: '本窗內容預估：{0} tokens',
			breakdown: '（輸入輸出：{0}/{1}）',
			inputBox: '輸入欄內容預估：{0} tokens',
			init: 'Token Counter 初始化中⋯⋯',
			navigation: '偵測到頁面導航',
			errorRegex: '正則取代時發生錯誤：{0}',
			errorText: '讀取文字失敗：{0}',
			regexInfo: '[{0}] 匹配 {1} 次，權重 {2}',
			prefixUser: '使用者說：',
			prefixBot: 'AI說：',
			exportText: '輸出文字',
			exportJSON: '輸出 JSON',
			showHelp: '使用說明',
			helpTitle: '使用說明與限制',
			helpContent: `本工具可即時估算目前對話視窗中的 token 數量，並提供對話內容輸出功能。

計算方式：使用大量不同風格、不同語言的文檔，透過各家 tokenizer API 取得平均值後建立的加權估算模型。在文本量大時接近實際值，還原度高；但在文本量少時可能存在較大偏差。對於較冷僻的文風、含大量生僻字的文本（例如秦漢前的古文），誤差值可能較大。顯示數值包含使用者輸入與 AI 回應的 token 總計，以及輸入欄位中尚未送出的內容。

輸出功能：可將對話內容輸出為純文字檔或 JSON 格式，檔名自動包含時間戳記。

限制：本工具僅計算當前視窗中可見的文字內容。未必能讀取或計算後列項目（具體依各家前端框架實作而定）：進階資料分析（ADA）執行的程式碼與結果、畫布（Canvas）內容、已上傳的檔案、RAG 系統的檢索內容、工具呼叫的輸入與輸出、圖片、音訊、影片等多媒體內容、摺疊或隱藏的內容、iframe 中的內容、Shadow DOM 中的內容。無法處理延遲載入的內容，使用輸出功能前請手動滾動至對話最頂端，確保所有內容已完整載入。

關於上下文長度：無論各家宣稱的上下文窗口大小為何，Transformer 架構的實際有效上限約為 100k 至 200k tokens。超過此範圍的宣稱數值通常是透過 RAG 或類 RAG 技術實現。當對話超過 100k tokens 後（本工具會以紅色背景警示），除非內容高度專一化且脈絡集中，否則面對複雜邏輯、龐大脈絡或零散主題時，模型可能產生不連貫或錯誤的回應。`
		},
		'en': {
			calculating: 'Token Counter Calculating...',
			total: 'Total tokens in view: {0}',
			breakdown: '(Input / Output: {0}/{1})',
			inputBox: 'Input box tokens: {0}',
			init: 'Token Counter initializing...',
			navigation: 'Navigation detected',
			errorRegex: 'Token counting regex replacement error: {0}',
			errorText: 'Error getting text: {0}',
			regexInfo: '[{0}] matched {1} times, weight {2}',
			prefixUser: 'User said:',
			prefixBot: 'AI said:',
			exportText: 'Export Text',
			exportJSON: 'Export JSON',
			showHelp: 'Help',
			helpTitle: 'Usage and Limitations',
			helpContent: `This tool provides real-time token count estimation for the current conversation and export functionality.

Calculation Method: The weighted estimation model is built using a large corpus of diverse documents across different styles and languages, with average values obtained from various tokenizer APIs. It approaches actual values closely when text volume is large, with high accuracy; however, it may have larger deviations with small text volumes. For obscure writing styles or texts containing many rare characters (e.g., pre-Qin and Han dynasty classical Chinese), the margin of error may be larger. The displayed values include total tokens from user input and AI responses, plus content in the input field that has not been submitted.

Export Functions: Export conversation content as plain text or JSON format with automatic timestamp in filename.

Limitations: This tool only counts visible text content in the current viewport. May not be able to read or count the following items (depending on frontend framework implementation): Advanced Data Analysis (ADA) code and results, Canvas content, uploaded files, RAG system retrieval content, tool call inputs and outputs, images, audio, video and other multimedia content, collapsed or hidden content, content within iframes, content within Shadow DOM. Cannot handle lazy-loaded content. Before using export functions, please manually scroll to the top of the conversation to ensure all content is fully loaded.

About Context Length: Regardless of claimed context window sizes, the actual effective limit of Transformer architecture is approximately 100k to 200k tokens. Claims exceeding this range are typically achieved through RAG or RAG-like techniques. When conversations exceed 100k tokens (indicated by red background in this tool), unless the content is highly specialized and contextually focused, the model may produce incoherent or erroneous responses when dealing with complex logic, extensive context, or scattered topics.`
		}
	};

	function resolveLocale() {
		const lang = navigator.language.toLowerCase();
		if (localeMap[lang]) return lang;
		if (lang.startsWith('zh-')) {
			const fallback = Object.keys(localeMap).find(k => k.startsWith('zh-'));
			if (fallback) return fallback;
		}
		return 'en';
	}
	const locale = localeMap[resolveLocale()];

	// ====== UTILS ======
	const DEBUG = true;
	const format = (s, ...a) => s.replace(/\{(\d+)\}/g, (_, i) => a[i] ?? '');
	const safeIdle = cb => window.requestIdleCallback?.(cb) || setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1);
	const cancelIdle = h => window.cancelIdleCallback?.(h) || clearTimeout(h);
	const debugLog = (...args) => DEBUG && console.log('[TokenCounter]', ...args);

	// ====== ESTIMATE RULES ======
	const gptWeightMap = [
		{ regex: /[\p{Script=Han}]/gu, weight: 0.99 },
		{ regex: /[\p{Script=Hangul}]/gu, weight: 0.79 },
		{ regex: /[\p{Script=Hiragana}\p{Script=Katakana}]/gu, weight: 0.73 },
		{ regex: /[\p{Script=Latin}]+/gu, weight: 1.36 },
		{ regex: /[\p{Script=Greek}]+/gu, weight: 3.14 },
		{ regex: /[\p{Script=Cyrillic}]+/gu, weight: 2.58 },
		{ regex: /[\p{Script=Arabic}]+/gu, weight: 1.78 },
		{ regex: /[\p{Script=Hebrew}]+/gu, weight: 1.9 },
		{ regex: /[\p{Script=Devanagari}]+/gu, weight: 1.28 },
		{ regex: /[\p{Script=Bengali}]+/gu, weight: 1.77 },
		{ regex: /[\p{Script=Thai}]/gu, weight: 0.45 },
		{ regex: /[\p{Script=Myanmar}]/gu, weight: 0.56 },
		{ regex: /[\p{Script=Tibetan}]/gu, weight: 1.58 },
		{ regex: /\p{Number}{1,3}/gu, weight: 1.0 },
		{ regex: /[\u2190-\u2BFF\u1F000-\u1FAFF]/gu, weight: 1.0 },
		{ regex: /[\p{P}]/gu, weight: 0.95 },
		{ regex: /[\S]+/gu, weight: 3.0 }
	];

	// ====== STATE ======
	const state = {
		idleHandle: null,
		intervalId: null,
		uiBox: null,
		operationId: 0,  // 用於標記當前操作的ID
	};

	// ====== CORE ======

	let updateDirty = false;

	function createUI() {
		if (state.uiBox) return;

		const box = document.createElement('div');
		const content = document.createElement('div');
		const actions = document.createElement('div');

		Object.assign(box.style, CONFIG.uiStyle);
		Object.assign(actions.style, { marginTop: '0.5em' });

		box.appendChild(content);
		box.appendChild(actions);
		document.body.appendChild(box);

		state.uiBox = box;
		state.uiContent = content;
		state.uiActions = actions;
		addUIButton('ℹ️', showHelp, state.uiActions, locale.showHelp);
		addUIButton('📄', exportAsText, state.uiActions, locale.exportText);
		addUIButton('🧾', exportAsJSON, state.uiActions, locale.exportJSON);
	}

	function extractDialogTurns() {
		const userNodes = Array.from(document.querySelectorAll(CONFIG.selectors.userText));
		const botNodes = Array.from(document.querySelectorAll(CONFIG.selectors.botText));
		const turns = [];
		let turnId = 1;

		// 依照出現順序合併 user/bot 節點
		const allNodes = [...userNodes.map(n => ({ role: 'user', node: n })), ...botNodes.map(n => ({ role: 'bot', node: n }))];
		allNodes.sort((a, b) => a.node.compareDocumentPosition(b.node) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

		for (const item of allNodes) {
			let text = item.node?.innerText?.trim() || '';
			text = text.replace(/^Copilot said:\s*/i, '').replace(/^You said:\s*/i, '');
			if (text) {
				turns.push({
					id: turnId++,
					role: item.role,
					text
				});
			}
		}
		return turns;
	}

	function exportToFile(content, ext) {
		const pad = n => n.toString().padStart(2, '0');
		const now = new Date();
		const yyyy = now.getFullYear();
		const MM = pad(now.getMonth() + 1);
		const dd = pad(now.getDate());
		const hh = pad(now.getHours());
		const mm = pad(now.getMinutes());
		const ss = pad(now.getSeconds());
		const filename = `export_${yyyy}${MM}${dd}-${hh}${mm}${ss}.${ext}`;
		const blob = new Blob([content], { type: ext === 'json' ? 'application/json' : 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 100);
		debugLog(`File exported: ${filename}`);
	}

	function exportAsText() {
		const data = extractDialogTurns();
		const output = data.map(({ role, text }) => {
			const prefix = role === 'user' ? locale.prefixUser : locale.prefixBot;
			const unescape = text
				.replace(/\\r/g, '\r')
				.replace(/\\n/g, '\n')
				.replace(/\\t/g, '\t');
			return `${prefix}\n${unescape}`;
		}).join('\n---\n');
		exportToFile(output, 'txt');
	}

	function exportAsJSON() {
		const data = extractDialogTurns();
		exportToFile(JSON.stringify(data, null, 2), 'json');
	}

	function showHelp() {
		const overlay = document.createElement('div');
		Object.assign(overlay.style, {
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0,0,0,0.6)',
			zIndex: '10000',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		});

		const dialog = document.createElement('div');
		Object.assign(dialog.style, {
			backgroundColor: '#1e1e1e',
			color: '#d4d4d4',
			padding: '2em',
			borderRadius: '0.5em',
			maxWidth: '600px',
			maxHeight: '80vh',
			overflow: 'auto',
			position: 'relative',
			boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
		});

		const closeBtn = document.createElement('button');
		closeBtn.textContent = '✕';
		Object.assign(closeBtn.style, {
			position: 'absolute',
			top: '0.5em',
			right: '0.5em',
			background: 'transparent',
			border: 'none',
			color: '#d4d4d4',
			fontSize: '1.5em',
			cursor: 'pointer',
			lineHeight: '1'
		});

		const title = document.createElement('h2');
		title.textContent = locale.helpTitle;
		Object.assign(title.style, {
			marginTop: '0',
			marginBottom: '1em'
		});

		const content = document.createElement('pre');
		content.textContent = locale.helpContent;
		Object.assign(content.style, {
			whiteSpace: 'pre-wrap',
			wordWrap: 'break-word',
			fontFamily: 'inherit',
			margin: '0'
		});

		dialog.appendChild(closeBtn);
		dialog.appendChild(title);
		dialog.appendChild(content);
		overlay.appendChild(dialog);
		document.body.appendChild(overlay);

		const close = () => document.body.removeChild(overlay);
		closeBtn.onclick = close;
		overlay.onclick = e => {
			if (e.target === overlay) close();
		};
		dialog.onclick = e => e.stopPropagation();
	}

	function addUIButton(label, onclick, container = state.uiBox, title = '') {
		const btn = document.createElement('button');
		btn.textContent = label;
		btn.title = title;
		btn.style.marginLeft = '0.5em';
		btn.style.background = 'transparent';
		btn.style.border = 'none';
		btn.style.color = 'inherit';
		btn.style.cursor = 'pointer';
		btn.onclick = onclick;
		container.appendChild(btn);
	}

	let lastPathname = location.pathname;

	function isValidWindow() {
		const now = location.pathname;
		const changed = now !== lastPathname;
		if (changed) lastPathname = now;

		const matched = CONFIG.validPathPatterns.some(re => re.test(now));
		const status = `${matched ? 'valid' : 'invalid'}-${changed ? 'changed' : 'unchanged'}`;

		debugLog('isValidWindow check:', {
			pathname: now,
			status
		});

		return status;
	}

	function getCombinedText(selector) {
		try {
			return Array.from(document.querySelectorAll(selector))
				.map(el => el?.innerText || '')
				.filter(Boolean)
				.join('\n');
		} catch (e) {
			console.error(format(locale.errorText, e));
			return '';
		}
	}

	function estimateTokensAsync(text, callback) {
		if (!text) return callback(0);
		let total = 0, i = 0, remaining = text;
		function process() {
			if (i >= gptWeightMap.length) return callback(Math.round(total));
			const { regex, weight } = gptWeightMap[i++];
			safeIdle(() => {
				const matches = remaining.match(regex) || [];
				total += matches.length * weight;
				try {
					if (matches.length) remaining = remaining.replace(regex, ' ');
				} catch (e) {
					console.error(format(locale.errorRegex, e));
				}
				process();
			});
		}
		process();
	}

	function estimateTokensChunked(text, callback) {
		if (!text) return callback(0);
		const chunks = text.match(new RegExp(`.{1,${CONFIG.chunkSize}}`, 'gs')) || [];
		let total = 0, i = 0;
		function next() {
			if (i >= chunks.length) return callback(total);
			estimateTokensAsync(chunks[i++], count => {
				total += count;
				next();
			});
		}
		next();
	}

	function updateDisplay(user, bot, input) {
		const both = user + bot
		const total = both + input;
		if (total > CONFIG.tokenWarningThreshold) {
			state.uiBox.style.backgroundColor = 'rgba(255,50,50,0.7)';
		} else {
			state.uiBox.style.backgroundColor = CONFIG.uiStyle.backgroundColor;
		}
		// 清空內容
		state.uiContent.textContent = '';
		let lines;
		if (both === 0) {
			lines = [locale.calculating];
		} else {
			lines = [
				format(locale.total, both),
				format(locale.breakdown, user, bot),
				format(locale.inputBox, input)
			];
		}
		for (const line of lines) {
			const div = document.createElement('div');
			div.textContent = line;
			state.uiContent.appendChild(div);
		}
	}

	function updateCounter() {
		const currentOperation = ++state.operationId;  // 遞增操作ID
		const userText = getCombinedText(CONFIG.selectors.userText);
		const botText = getCombinedText(CONFIG.selectors.botText);
		const inputEl = document.querySelector(CONFIG.selectors.inputText);
		const inputText = inputEl ? inputEl.innerText : '';

		let pending = 3;
		let user = 0, bot = 0, input = 0;

		function tryDisplay() {
			if (currentOperation !== state.operationId) return;  // 檢查是否為最新操作
			if (--pending === 0) updateDisplay(user, bot, input);
		}

		estimateTokensChunked(userText, count => {
			if (currentOperation !== state.operationId) return;  // 檢查是否為最新操作
			user = count;
			tryDisplay();
		});
		estimateTokensChunked(botText, count => {
			if (currentOperation !== state.operationId) return;  // 檢查是否為最新操作
			bot = count;
			tryDisplay();
		});
		estimateTokensChunked(inputText, count => {
			if (currentOperation !== state.operationId) return;  // 檢查是否為最新操作
			input = count;
			tryDisplay();
		});
	}

	function resetAll() {
		if (state.idleHandle) {
			cancelIdle(state.idleHandle);
			state.idleHandle = null;
		}
		if (state.intervalId) {
			clearInterval(state.intervalId);
			state.intervalId = null;
		}
		state.operationId++;  // 遞增操作ID使舊的操作失效
		updateDisplay(0, 0, 0);
		updateDirty = false;
	}

	// DO NOT DELETE: 不要覺得這樣用MutationObserver很沒效率，這是故意的。

	function setupMutationObserver() {
		const observer = new MutationObserver(() => {
			switch (isValidWindow()) {
				case 'valid-changed':
					debugLog(locale.navigation);
					resetAll();
					updateDirty = true;
					initialize();
					state.uiBox.style.display = 'block';
					break;
				case 'valid-unchanged':
					updateDirty = true;
					initialize();
					state.uiBox.style.display = 'block';
					break;
				case 'invalid-changed':
					resetAll();
					if (state.uiBox) state.uiBox.style.display = 'none';
					break;
				case 'invalid-unchanged':
				default:
					// Do nothing
					break;
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true
		});
	}

	function initialize() {
		if (state.intervalId) return;
		debugLog(locale.init);
		if (!state.uiBox) createUI();
		state.intervalId = setInterval(() => {
			debugLog('Scheduled update running. UpdateDirty:', updateDirty);
			if (!updateDirty) return;
			updateDirty = false;

			if (state.idleHandle) cancelIdle(state.idleHandle);
			state.idleHandle = safeIdle(() => {
				state.idleHandle = null;
				updateCounter();
			});
		}, CONFIG.updateInterval);
		updateCounter();
	}


	if (document.readyState === 'complete') {
		initialize();
		setupMutationObserver();
	} else {
		window.addEventListener('load', () => {
			initialize();
			setupMutationObserver();
		});
	}

})();
