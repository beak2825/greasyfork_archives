// ==UserScript==
// @name         AI Chat
// @namespace    Auntilz
// @version      1.0
// @description  ai助手
// @author       Auntilz
// @license      MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.siliconflow.cn
// @downloadURL https://update.greasyfork.org/scripts/528941/AI%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/528941/AI%20Chat.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.addEventListener('error', function(e) {
		alert('脚本错误: ' + e.message);
		console.error('脚本错误:', e)
	});

	function debugLog(...args) {
		if (!debugMode) return;
		console.log('[SiliconFlow Debug]', ...args);
		let debugEl = document.getElementById('silicon-flow-debug');
		if (!debugEl) {
			debugEl = document.createElement('div');
			debugEl.id = 'silicon-flow-debug';
			debugEl.style.position = 'fixed';
			debugEl.style.bottom = '10px';
			debugEl.style.left = '10px';
			debugEl.style.background = 'rgba(0,0,0,0.8)';
			debugEl.style.color = 'white';
			debugEl.style.padding = '10px';
			debugEl.style.borderRadius = '5px';
			debugEl.style.maxHeight = '200px';
			debugEl.style.overflowY = 'auto';
			debugEl.style.maxWidth = '500px';
			debugEl.style.zIndex = '10000';
			debugEl.style.fontSize = '12px';
			debugEl.style.fontFamily = 'monospace';
			debugEl.style.display = 'none';
			document.body.appendChild(debugEl)
		}
		if (debugMode) {
			const line = document.createElement('div');
			line.textContent = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
			debugEl.appendChild(line);
			debugEl.scrollTop = debugEl.scrollHeight;
			while (debugEl.children.length > 50) {
				debugEl.removeChild(debugEl.firstChild)
			}
		}
		debugEl.style.display = debugMode ? 'block' : 'none'
	}
	let apiKey = GM_getValue('apiKey', '');
	let model = GM_getValue('model', 'deepseek-ai/DeepSeek-V3');
	let currentStream = null;
	let chatHistory = GM_getValue('chatHistory', []);
	let isDarkMode = GM_getValue('isDarkMode', false);
	let fontSize = GM_getValue('fontSize', 14);
	let debugMode = GM_getValue('debugMode', true);
	let useStreamMode = GM_getValue('useStreamMode', true);
	debugLog('脚本初始化', '模型:', model, '深色模式:', isDarkMode, '调试模式:', debugMode);
	const colors = {
		light: {
			background: '#ffffff',
			secondaryBg: '#f8f9fa',
			border: '#e1e4e8',
			text: '#24292e',
			primaryText: '#0366d6',
			secondaryText: '#586069',
			iconBg: '#0366d6',
			iconHover: '#0257c5',
			inputBg: '#ffffff',
			aiResponse: '#f1f8ff'
		},
		dark: {
			background: '#1e1e1e',
			secondaryBg: '#252525',
			border: '#333333',
			text: '#e1e4e8',
			primaryText: '#58a6ff',
			secondaryText: '#8b949e',
			iconBg: '#1f6feb',
			iconHover: '#388bfd',
			inputBg: '#2d2d2d',
			aiResponse: '#161b22'
		}
	};
	const getColor = (key) => isDarkMode ? colors.dark[key] : colors.light[key];
	const style = document.createElement('style');
	document.head.appendChild(style);

	function updateStyles() {
		style.textContent = `.ai-chat-icon{position:fixed;width:56px;height:56px;background-color:${getColor('iconBg')};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;box-shadow:0 4px 14px rgba(0,0,0,0.16);cursor:grab;user-select:none;touch-action:none;z-index:2147483647;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}.ai-chat-icon svg{filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));transition:transform 0.2s ease}.ai-chat-icon:hover{transform:scale(1.08);box-shadow:0 6px 20px rgba(0,0,0,0.2)}.ai-chat-icon:hover svg{transform:scale(1.1)}.ai-chat-icon:hover{transform:scale(1.05);background-color:${getColor('iconHover')}}.ai-chat-window{position:fixed;bottom:85px;right:20px;width:380px;height:550px;background-color:${getColor('background')};border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,0.12);display:flex;flex-direction:column;overflow:hidden;z-index:9998;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;border:1px solid ${getColor('border')};transition:all 0.3s ease}.ai-chat-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background-color:${getColor('secondaryBg')};border-bottom:1px solid ${getColor('border')};border-top-left-radius:16px;border-top-right-radius:16px}.ai-chat-title{font-weight:600;font-size:16px;color:${getColor('text')};margin:0}.ai-chat-actions{display:flex;align-items:center;gap:14px}.ai-chat-action{background:none;border:none;color:${getColor('secondaryText')};cursor:pointer;font-size:18px;padding:0;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:6px;transition:all 0.2s ease}.ai-chat-action:hover{background-color:${getColor('border')};color:${getColor('primaryText')}}.ai-chat-content{flex:1;padding:16px;overflow-y:auto;overflow-x:hidden;scroll-behavior:smooth}.ai-chat-content::-webkit-scrollbar{width:6px}.ai-chat-content::-webkit-scrollbar-thumb{background-color:${getColor('border')};border-radius:10px}.ai-chat-content::-webkit-scrollbar-track{background-color:transparent}.ai-message{margin-bottom:18px;font-size:${fontSize}px;line-height:1.5;word-wrap:break-word}.ai-user-message{color:${getColor('text')}}.ai-response{padding:12px 16px;background-color:${getColor('aiResponse')};border-radius:10px;margin-top:6px;color:${getColor('text')};word-break:break-word}.ai-sender{font-weight:600;margin-bottom:4px;color:${getColor('primaryText')};display:flex;align-items:center;gap:6px}.ai-chat-input-container{padding:12px 16px;border-top:1px solid ${getColor('border')};background-color:${getColor('secondaryBg')}}.ai-chat-input-wrapper{position:relative;border-radius:10px;background-color:${getColor('inputBg')};border:1px solid ${getColor('border')};padding:8px 40px 8px 12px;transition:border-color 0.2s ease}.ai-chat-input-wrapper:focus-within{border-color:${getColor('primaryText')};box-shadow:0 0 0 2px rgba(3,102,214,0.2)}.ai-chat-input{width:100%;min-height:24px;max-height:120px;border:none;outline:none;background:transparent;resize:none;font-family:inherit;font-size:${fontSize}px;line-height:1.5;color:${getColor('text')};overflow-y:auto}.ai-chat-input::placeholder{color:${getColor('secondaryText')}}.ai-chat-send{position:absolute;right:8px;bottom:8px;width:28px;height:28px;border-radius:50%;background-color:${getColor('iconBg')};color:white;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease}.ai-chat-send:hover{background-color:${getColor('iconHover')}}.ai-chat-send svg{width:16px;height:16px}.ai-settings-panel{position:absolute;top:60px;right:16px;background-color:${getColor('background')};border-radius:10px;border:1px solid ${getColor('border')};box-shadow:0 8px 24px rgba(0,0,0,0.12);padding:16px;width:270px;z-index:10000;display:none;flex-direction:column;gap:14px}.ai-settings-group{display:flex;flex-direction:column;gap:8px}.ai-settings-label{font-size:14px;font-weight:600;color:${getColor('text')}}.ai-settings-input{padding:8px 12px;border-radius:6px;border:1px solid ${getColor('border')};font-size:14px;background-color:${getColor('inputBg')};color:${getColor('text')};width:100%;outline:none}.ai-settings-input:focus{border-color:${getColor('primaryText')};box-shadow:0 0 0 2px rgba(3,102,214,0.2)}.ai-toggle-wrapper{display:flex;justify-content:space-between;align-items:center}.ai-toggle{position:relative;display:inline-block;width:44px;height:22px}.ai-toggle input{opacity:0;width:0;height:0}.ai-toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:${getColor('border')};transition:0.4s;border-radius:22px}.ai-toggle-slider:before{position:absolute;content:"";height:18px;width:18px;left:2px;bottom:2px;background-color:white;transition:0.4s;border-radius:50%}input:checked+.ai-toggle-slider{background-color:${getColor('iconBg')}}input:checked+.ai-toggle-slider:before{transform:translateX(22px)}.ai-settings-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:6px}.ai-settings-button{padding:8px 14px;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s ease}.ai-settings-cancel{background-color:transparent;border:1px solid ${getColor('border')};color:${getColor('text')}}.ai-settings-cancel:hover{background-color:${getColor('border')}}.ai-settings-save{background-color:${getColor('iconBg')};border:1px solid ${getColor('iconBg')};color:white}.ai-settings-save:hover{background-color:${getColor('iconHover')}}.ai-typing{display:inline-block;font-weight:bold;animation:ai-cursor-blink 0.8s infinite;white-space:nowrap}@keyframes ai-cursor-blink{0%{opacity:1}50%{opacity:0}100%{opacity:1}}.ai-code-block{background-color:${isDarkMode?'#1a1a1a':'#f6f8fa'};border-radius:6px;padding:12px;margin:10px 0;overflow-x:auto;font-family:monospace}.ai-markdown p{margin:4px 0}.ai-markdown br{display:block;margin-bottom:2px;content:""}.ai-markdown ul,.ai-markdown ol{padding-left:24px;margin:10px 0}.ai-markdown code{background-color:${isDarkMode?'#1a1a1a':'#f6f8fa'};padding:2px 4px;border-radius:4px;font-family:monospace}.ai-font-size-control{display:flex;align-items:center;gap:10px}.ai-font-button{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;background-color:${getColor('secondaryBg')};border:1px solid ${getColor('border')};color:${getColor('text')};cursor:pointer}.ai-font-button:hover{background-color:${getColor('border')}}.ai-font-size-display{width:30px;text-align:center;font-size:14px;color:${getColor('text')}}.ai-settings-note{font-size:12px;color:${getColor('secondaryText')};margin-top:4px}.ai-clear-chat{color:#d73a49;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:6px;margin-top:10px}.ai-clear-chat:hover{text-decoration:underline}.ai-model-selector{position:relative}.ai-model-selector select{width:100%;padding:8px 12px;border-radius:6px;border:1px solid ${getColor('border')};background-color:${getColor('inputBg')};color:${getColor('text')};appearance:none;font-size:14px;cursor:pointer}.ai-model-selector::after{content:"▼";font-size:12px;color:${getColor('secondaryText')};position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none}.ai-debug-toggle{margin-top:5px}.ai-debug-panel{display:${debugMode?'block':'none'};position:fixed;bottom:10px;left:10px;background-color:rgba(0,0,0,0.8);color:white;padding:10px;border-radius:5px;max-height:200px;overflow-y:auto;max-width:500px;z-index:10000;font-size:12px;font-family:monospace}.ai-status-badge{display:inline-block;padding:2px 6px;border-radius:10px;font-size:10px;margin-left:8px;font-weight:normal}.ai-status-online{background-color:#28a745;color:white}.ai-status-error{background-color:#dc3545;color:white}.ai-error-message{color:#dc3545;font-weight:bold;margin-top:4px}.ai-code-container{position:relative;margin:12px 0;border-radius:6px;overflow:hidden;background-color:${isDarkMode?'#1a1a1a':'#f6f8fa'}}.ai-code-header{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background-color:${isDarkMode?'#2d2d2d':'#e8e8e8'};font-family:monospace;font-size:14px}.ai-copy-button{background:none;border:1px solid ${getColor('border')};color:${getColor('text')};padding:4px 8px;border-radius:4px;cursor:pointer;transition:all 0.2s ease}.ai-copy-button:hover{background-color:${getColor('border')}}.ai-code-block{padding:12px;margin:0;overflow-x:auto;tab-size:4}.ai-inline-code{background-color:${isDarkMode?'#2d2d2d':'#e8e8e8'};padding:2px 4px;border-radius:4px}.ai-markdown-h1{font-size:2em;margin:0.67em 0}.ai-markdown-h2{font-size:1.5em;margin:0.75em 0}.ai-markdown-h3{font-size:1.17em;margin:0.83em 0}.ai-markdown-h4{margin:1.12em 0}.ai-markdown-h5{font-size:0.83em;margin:1.5em 0}.ai-markdown-h6{font-size:0.75em;margin:1.67em 0}`
	}

	function createUI() {
		updateStyles();
		const icon = document.createElement('div');
		icon.className = 'ai-chat-icon';
		icon.innerHTML = `<svg viewBox="0 0 24 24"width="24"height="24"style="fill: white;"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/><path d="M17 11h-4V7h-2v4H7v2h4v4h2v-4h4z"style="fill: white;"/></svg>`;
		let isDragging = false;
		let startX, startY;
		let startLeft, startTop;
		icon.addEventListener('mousedown', function(e) {
			isDragging = true;
			icon.style.cursor = 'grabbing';
			startX = e.clientX;
			startY = e.clientY;
			const rect = icon.getBoundingClientRect();
			startLeft = rect.left;
			startTop = rect.top;
			e.preventDefault();
			e.stopPropagation()
		});
		document.addEventListener('mousemove', function(e) {
			if (!isDragging) return;
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;
			let newLeft = startLeft + deltaX;
			let newTop = startTop + deltaY;
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;
			const iconWidth = icon.offsetWidth;
			const iconHeight = icon.offsetHeight;
			newLeft = Math.max(0, Math.min(windowWidth - iconWidth, newLeft));
			newTop = Math.max(0, Math.min(windowHeight - iconHeight, newTop));
			const threshold = 20;
			if (newLeft < threshold) {
				newLeft = 0
			} else if (newLeft > windowWidth - iconWidth - threshold) {
				newLeft = windowWidth - iconWidth
			}
			if (newTop < threshold) {
				newTop = 0
			} else if (newTop > windowHeight - iconHeight - threshold) {
				newTop = windowHeight - iconHeight
			}
			icon.style.left = `${newLeft}px`;
			icon.style.top = `${newTop}px`
		});
		document.addEventListener('mouseup', function() {
			if (!isDragging) return;
			isDragging = false;
			icon.style.cursor = 'grab';
			const rect = icon.getBoundingClientRect();
			GM_setValue('iconPosition', {
				x: rect.left,
				y: rect.top
			})
		});
		const savedPos = GM_getValue('iconPosition');
		let initialLeft, initialTop;
		if (savedPos) {
			initialLeft = savedPos.x;
			initialTop = savedPos.y
		} else {
			initialLeft = window.innerWidth - 76;
			initialTop = window.innerHeight - 76
		}
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const iconWidth = 56;
		const iconHeight = 56;
		initialLeft = Math.max(0, Math.min(windowWidth - iconWidth, initialLeft));
		initialTop = Math.max(0, Math.min(windowHeight - iconHeight, initialTop));
		icon.style.left = `${initialLeft}px`;
		icon.style.top = `${initialTop}px`;
		document.body.appendChild(icon);
		const chatWindow = document.createElement('div');
		chatWindow.className = 'ai-chat-window';
		chatWindow.style.display = 'none';
		chatWindow.style.opacity = '0';
		chatWindow.style.transform = 'translateY(20px)';
		const header = document.createElement('div');
		header.className = 'ai-chat-header';
		const title = document.createElement('h3');
		title.className = 'ai-chat-title';
		title.innerHTML = 'AI 助手 <span class="ai-status-badge ai-status-online">V1.0</span>';
		const actions = document.createElement('div');
		actions.className = 'ai-chat-actions';
		const settingsButton = document.createElement('button');
		settingsButton.className = 'ai-chat-action ai-settings-button';
		settingsButton.innerHTML = '⚙️';
		settingsButton.title = '设置';
		const themeButton = document.createElement('button');
		themeButton.className = 'ai-chat-action ai-theme-button';
		themeButton.innerHTML = isDarkMode ? '☀️' : '🌙';
		themeButton.title = isDarkMode ? '切换到亮色模式' : '切换到暗色模式';
		const minimizeButton = document.createElement('button');
		minimizeButton.className = 'ai-chat-action ai-minimize-button';
		minimizeButton.innerHTML = '—';
		minimizeButton.title = '最小化';
		actions.appendChild(settingsButton);
		actions.appendChild(themeButton);
		actions.appendChild(minimizeButton);
		header.appendChild(title);
		header.appendChild(actions);
		const content = document.createElement('div');
		content.className = 'ai-chat-content';
		const inputContainer = document.createElement('div');
		inputContainer.className = 'ai-chat-input-container';
		const inputWrapper = document.createElement('div');
		inputWrapper.className = 'ai-chat-input-wrapper';
		const textarea = document.createElement('textarea');
		textarea.className = 'ai-chat-input';
		textarea.placeholder = '输入消息...';
		textarea.rows = 1;
		const sendButton = document.createElement('button');
		sendButton.className = 'ai-chat-send';
		sendButton.innerHTML = `<svg viewBox="0 0 24 24"fill="none"xmlns="http://www.w3.org/2000/svg"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"fill="currentColor"></path></svg>`;
		inputWrapper.appendChild(textarea);
		inputWrapper.appendChild(sendButton);
		inputContainer.appendChild(inputWrapper);
		chatWindow.appendChild(header);
		chatWindow.appendChild(content);
		chatWindow.appendChild(inputContainer);
		const settingsPanel = document.createElement('div');
		settingsPanel.className = 'ai-settings-panel';
		settingsPanel.innerHTML = `<div class="ai-settings-group"><label class="ai-settings-label">API密钥</label><input type="password"class="ai-settings-input ai-api-key"value="${apiKey}"placeholder="请输入硅基流动API密钥"><div class="ai-settings-note">请保管好您的API密钥，不要泄露给他人</div></div><div class="ai-settings-group"><label class="ai-settings-label">AI模型</label><div class="ai-model-selector"><select class="ai-settings-input ai-model-select"><option value="deepseek-ai/DeepSeek-V3"${model==='deepseek-ai/DeepSeek-V3'?'selected':''}>DeepSeek-V3</option><option value="deepseek-ai/DeepSeek-R1"${model==='deepseek-ai/DeepSeek-R1'?'selected':''}>DeepSeek-R1</option><option value="deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"${model==='deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B'?'selected':''}>DeepSeek-R1-Distill-Qwen-1.5B</option><option value="deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"${model==='deepseek-ai/DeepSeek-R1-Distill-Qwen-7B'?'selected':''}>DeepSeek-R1-Distill-Qwen-7B</option><option value="deepseek-ai/DeepSeek-R1-Distill-Qwen-14B"${model==='deepseek-ai/DeepSeek-R1-Distill-Qwen-14B'?'selected':''}>DeepSeek-R1-Distill-Qwen-14B</option><option value="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"${model==='deepseek-ai/DeepSeek-R1-Distill-Qwen-32B'?'selected':''}>DeepSeek-R1-Distill-Qwen-32B</option><option value="custom"${!['deepseek-ai/DeepSeek-V3','deepseek-ai/DeepSeek-R1','deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B','deepseek-ai/DeepSeek-R1-Distill-Qwen-7B','deepseek-ai/DeepSeek-R1-Distill-Qwen-14B','deepseek-ai/DeepSeek-R1-Distill-Qwen-32B'].includes(model)?'selected':''}>自定义</option></select></div><input type="text"class="ai-settings-input ai-custom-model"placeholder="输入自定义模型名称"style="display: ${!['deepseek-ai/DeepSeek-V3', 'deepseek-ai/deepseek-coder', 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', 'mistralai/mistral-small-latest'].includes(model) ? 'block' : 'none'}"value="${!['deepseek-ai/DeepSeek-V3', 'deepseek-ai/deepseek-coder', 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', 'mistralai/mistral-small-latest'].includes(model) ? model : ''}"></div><div class="ai-settings-group"><label class="ai-settings-label">字体大小</label><div class="ai-font-size-control"><button class="ai-font-button ai-font-decrease">-</button><span class="ai-font-size-display">${fontSize}</span><button class="ai-font-button ai-font-increase">+</button></div></div><div class="ai-settings-group"><div class="ai-toggle-wrapper"><label class="ai-settings-label">暗黑模式</label><label class="ai-toggle"><input type="checkbox"class="ai-dark-mode-toggle"${isDarkMode?'checked':''}><span class="ai-toggle-slider"></span></label></div></div><div class="ai-settings-group"><div class="ai-toggle-wrapper"><label class="ai-settings-label">调试模式</label><label class="ai-toggle"><input type="checkbox"class="ai-debug-mode-toggle"${debugMode?'checked':''}><span class="ai-toggle-slider"></span></label></div></div><div class="ai-settings-group"><div class="ai-toggle-wrapper"><label class="ai-settings-label">使用流式API</label><label class="ai-toggle"><input type="checkbox"class="ai-stream-mode-toggle"${useStreamMode?'checked':''}><span class="ai-toggle-slider"></span></label></div><div class="ai-settings-note">关闭此选项可使用非流式API进行调试</div></div><div class="ai-clear-chat"><span>🗑️</span>清除聊天记录</div><div class="ai-settings-footer"><button class="ai-settings-button ai-settings-cancel">取消</button><button class="ai-settings-button ai-settings-save">保存</button></div>`;
		document.body.appendChild(chatWindow);
		document.body.appendChild(settingsPanel);
		return {
			icon,
			chatWindow,
			content,
			textarea,
			sendButton,
			settingsButton,
			settingsPanel,
			themeButton,
			minimizeButton
		}
	}
	const ui = createUI();

	function loadChatHistory() {
		ui.content.innerHTML = '';
		chatHistory.forEach(msg => {
			const messageDiv = document.createElement('div');
			messageDiv.className = 'ai-message';
			if (msg.role === 'user') {
				messageDiv.innerHTML = `<div class="ai-sender"><span>👤</span>你</div><div class="ai-user-message">${msg.content}</div>`
			} else {
				messageDiv.innerHTML = `<div class="ai-sender"><span>🤖</span>AI</div><div class="ai-response ai-markdown">${formatAIResponse(msg.content)}</div>`
			}
			ui.content.appendChild(messageDiv)
		});
		ui.content.scrollTop = ui.content.scrollHeight
	}

	function formatAIResponse(text) {
		if (!text) return '';
		const blockIdPrefix = 'code_block_' + Math.random().toString(36).substr(2, 9) + '_';
		const codeBlocks = [];
		text = text.replace(/```([\w]*)\n([\s\S]*?)```/g, function(match, lang, code) {
			const id = blockIdPrefix + codeBlocks.length;
			codeBlocks.push({
				id: id,
				lang: lang || 'code',
				code: code.endsWith('\n') ? code.slice(0, -1) : code
			});
			return `<div id="placeholder_${id}"></div>`
		});
		text = text.replace(/^#{1,6}\s+(.*)$/gm, function(match, content) {
			const level = match.match(/^#+/)[0].length;
			return `<h${level}class="ai-markdown-h${level}">${content.trim()}</h${level}>`
		});
		text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
		text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
		text = text.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');
		text = text.replace(/\n{2,}/g, '<br><br>');
		text = text.replace(/([^>\n])\n([^<\n])/g, '$1<br>$2');
		setTimeout(() => {
			codeBlocks.forEach(block => {
				const placeholder = document.getElementById(`placeholder_${block.id}`);
				if (placeholder) {
					const container = document.createElement('div');
					container.className = 'ai-code-container';
					const header = document.createElement('div');
					header.className = 'ai-code-header';
					const langSpan = document.createElement('span');
					langSpan.textContent = block.lang;
					header.appendChild(langSpan);
					const copyButton = document.createElement('button');
					copyButton.className = 'ai-copy-button';
					copyButton.textContent = '复制';
					copyButton.setAttribute('data-raw-code', block.code);
					copyButton.onclick = function() {
						const rawCode = this.getAttribute('data-raw-code');
						const textArea = document.createElement('textarea');
						textArea.value = rawCode;
						document.body.appendChild(textArea);
						textArea.select();
						document.execCommand('copy');
						document.body.removeChild(textArea);
						this.textContent = '已复制';
						setTimeout(() => {
							this.textContent = '复制'
						}, 2000)
					};
					header.appendChild(copyButton);
					container.appendChild(header);
					const pre = document.createElement('pre');
					pre.className = 'ai-code-block';
					const code = document.createElement('code');
					code.textContent = block.code;
					pre.appendChild(code);
					container.appendChild(pre);
					placeholder.parentNode.replaceChild(container, placeholder)
				}
			})
		}, 100);
		return text
	}
	ui.icon.addEventListener('click', () => {
		if (ui.chatWindow.style.display === 'none') {
			ui.chatWindow.style.display = 'flex';
			setTimeout(() => {
				ui.chatWindow.style.opacity = '1';
				ui.chatWindow.style.transform = 'translateY(0)';
				ui.textarea.focus()
			}, 10)
		} else {
			ui.chatWindow.style.opacity = '0';
			ui.chatWindow.style.transform = 'translateY(20px)';
			setTimeout(() => {
				ui.chatWindow.style.display = 'none'
			}, 300)
		}
	});
	ui.minimizeButton.addEventListener('click', () => {
		ui.chatWindow.style.opacity = '0';
		ui.chatWindow.style.transform = 'translateY(20px)';
		setTimeout(() => {
			ui.chatWindow.style.display = 'none'
		}, 300)
	});
	ui.themeButton.addEventListener('click', () => {
		isDarkMode = !isDarkMode;
		GM_setValue('isDarkMode', isDarkMode);
		ui.themeButton.innerHTML = isDarkMode ? '☀️' : '🌙';
		ui.themeButton.title = isDarkMode ? '切换到亮色模式' : '切换到暗色模式';
		updateStyles()
	});
	ui.settingsButton.addEventListener('click', () => {
		const rect = ui.settingsButton.getBoundingClientRect();
		ui.settingsPanel.style.display = ui.settingsPanel.style.display === 'flex' ? 'none' : 'flex'
	});
	document.addEventListener('click', (e) => {
		if (!ui.settingsPanel.contains(e.target) && e.target !== ui.settingsButton) {
			ui.settingsPanel.style.display = 'none'
		}
	});
	const fontDecreaseBtn = ui.settingsPanel.querySelector('.ai-font-decrease');
	const fontIncreaseBtn = ui.settingsPanel.querySelector('.ai-font-increase');
	const fontSizeDisplay = ui.settingsPanel.querySelector('.ai-font-size-display');
	fontDecreaseBtn.addEventListener('click', () => {
		if (fontSize > 12) {
			fontSize--;
			fontSizeDisplay.textContent = fontSize;
			updateStyles()
		}
	});
	fontIncreaseBtn.addEventListener('click', () => {
		if (fontSize < 20) {
			fontSize++;
			fontSizeDisplay.textContent = fontSize;
			updateStyles()
		}
	});
	const modelSelect = ui.settingsPanel.querySelector('.ai-model-select');
	const customModelInput = ui.settingsPanel.querySelector('.ai-custom-model');
	modelSelect.addEventListener('change', () => {
		if (modelSelect.value === 'custom') {
			customModelInput.style.display = 'block'
		} else {
			customModelInput.style.display = 'none'
		}
	});
	const clearChatBtn = ui.settingsPanel.querySelector('.ai-clear-chat');
	clearChatBtn.addEventListener('click', () => {
		if (confirm('确定要清除所有聊天记录吗？')) {
			chatHistory = [];
			GM_setValue('chatHistory', chatHistory);
			loadChatHistory()
		}
	});
	const saveBtn = ui.settingsPanel.querySelector('.ai-settings-save');
	saveBtn.addEventListener('click', () => {
		const newApiKey = ui.settingsPanel.querySelector('.ai-api-key').value;
		let newModel = modelSelect.value;
		if (newModel === 'custom') {
			newModel = customModelInput.value.trim()
		}
		isDarkMode = ui.settingsPanel.querySelector('.ai-dark-mode-toggle').checked;
		debugMode = ui.settingsPanel.querySelector('.ai-debug-mode-toggle').checked;
		useStreamMode = ui.settingsPanel.querySelector('.ai-stream-mode-toggle').checked;
		apiKey = newApiKey;
		model = newModel;
		GM_setValue('apiKey', apiKey);
		GM_setValue('model', model);
		GM_setValue('isDarkMode', isDarkMode);
		GM_setValue('fontSize', fontSize);
		GM_setValue('debugMode', debugMode);
		GM_setValue('useStreamMode', useStreamMode);
		ui.themeButton.innerHTML = isDarkMode ? '☀️' : '🌙';
		updateStyles();
		ui.settingsPanel.style.display = 'none';
		if (!apiKey) {
			alert('请设置API密钥以使用聊天功能！')
		}
		debugLog('设置已保存', {
			model,
			isDarkMode,
			debugMode,
			useStreamMode
		})
	});
	const cancelBtn = ui.settingsPanel.querySelector('.ai-settings-cancel');
	cancelBtn.addEventListener('click', () => {
		ui.settingsPanel.style.display = 'none';
		ui.settingsPanel.querySelector('.ai-api-key').value = apiKey;
		modelSelect.value = ['deepseek-ai/DeepSeek-V3', 'deepseek-ai/deepseek-coder', 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B', 'mistralai/mistral-small-latest'].includes(model) ? model : 'custom';
		if (modelSelect.value === 'custom') {
			customModelInput.style.display = 'block';
			customModelInput.value = model
		} else {
			customModelInput.style.display = 'none'
		}
		ui.settingsPanel.querySelector('.ai-dark-mode-toggle').checked = isDarkMode;
		ui.settingsPanel.querySelector('.ai-debug-mode-toggle').checked = debugMode;
		ui.settingsPanel.querySelector('.ai-stream-mode-toggle').checked = useStreamMode;
		fontSizeDisplay.textContent = fontSize
	});
	ui.textarea.addEventListener('input', function() {
		this.style.height = 'auto';
		this.style.height = (this.scrollHeight) + 'px'
	});
	ui.textarea.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage()
		}
	});
	ui.sendButton.addEventListener('click', sendMessage);

	function sendNonStreamRequest(message, aiResponseElement) {
		debugLog('发送非流式API请求', {
			model,
			message: message.substring(0, 30) + '...'
		});
		return GM_xmlhttpRequest({
			method: 'POST',
			url: 'https://api.siliconflow.cn/v1/chat/completions',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			data: JSON.stringify({
				model: model,
				messages: [{
					role: 'user',
					content: message
				}],
				stream: false,
				temperature: 0.7,
				max_tokens: 2048
			}),
			onload: function(response) {
				debugLog('收到完整响应:', response.status, response.statusText);
				try {
					const data = JSON.parse(response.responseText);
					debugLog('解析后数据:', JSON.stringify(data).substring(0, 200) + '...');
					if (data.error) {
						aiResponseElement.innerHTML = `<span style="color:#ff3860">API错误:${data.error.message||JSON.stringify(data.error)}</span>`;
						debugLog('API返回错误:', data.error)
					} else {
						let content = '';
						if (data.choices && data.choices[0]) {
							if (data.choices[0].message) {
								content = data.choices[0].message.content || ''
							} else if (data.choices[0].text) {
								content = data.choices[0].text || ''
							}
						}
						debugLog('提取的内容:', content ? (content.substring(0, 50) + '...') : '无内容');
						if (content) {
							aiResponseElement.innerHTML = formatAIResponse(content);
							chatHistory.push({
								role: 'assistant',
								content: content
							});
							GM_setValue('chatHistory', chatHistory)
						} else {
							aiResponseElement.innerHTML = '<span style="color:#ff3860">无法从响应中提取内容</span>';
							debugLog('响应中没有内容')
						}
					}
				} catch (e) {
					aiResponseElement.innerHTML = `<span style="color:#ff3860">解析响应失败:${e.message}</span>`;
					debugLog('解析错误:', e, '原始响应:', response.responseText.substring(0, 200))
				}
				if (aiResponseElement.querySelector('.ai-typing')) {
					aiResponseElement.querySelector('.ai-typing').remove()
				}
			},
			onerror: function(error) {
				debugLog('请求错误:', error);
				aiResponseElement.innerHTML = `<span style="color:#ff3860">请求失败(${error.status||'网络错误'})</span>`;
				if (aiResponseElement.querySelector('.ai-typing')) {
					aiResponseElement.querySelector('.ai-typing').remove()
				}
			},
			ontimeout: function() {
				debugLog('请求超时');
				aiResponseElement.innerHTML = '<span style="color:#ff3860">请求超时</span>';
				if (aiResponseElement.querySelector('.ai-typing')) {
					aiResponseElement.querySelector('.ai-typing').remove()
				}
			}
		})
	}

	function sendStreamRequest(message, aiResponseElement) {
		debugLog('开始流式请求，使用HTML示例的方法');
		aiResponseElement.innerHTML = '<span class="ai-typing">连接中...</span>';
		let fullText = '';
		let aborted = false;
		const controller = new AbortController();
		(async function() {
			try {
				debugLog('发送fetch请求');
				const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${apiKey}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						model: model,
						stream: true,
						messages: [{
							role: "user",
							content: message
						}],
						temperature: 0.7,
						max_tokens: 2048
					}),
					signal: controller.signal
				});
				debugLog('收到响应:', response.status, response.statusText);
				if (!response.ok) {
					throw new Error(`服务器返回错误:${response.status}${response.statusText}`)
				}
				if (!response.body) {
					throw new Error('没有可读的响应体');
				}
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';
				if (aiResponseElement.querySelector('.ai-typing')) {
					aiResponseElement.querySelector('.ai-typing').textContent = '接收数据中...'
				}
				while (!aborted) {
					const {
						done,
						value
					} = await reader.read();
					if (done) break;
					buffer += decoder.decode(value, {
						stream: true
					});
					debugLog(`接收到数据块:${value.length}字节`);
					const chunks = buffer.split('\n');
					buffer = chunks.pop() || '';
					for (const chunk of chunks) {
						const trimmed = chunk.trim();
						if (!trimmed) continue;
						if (trimmed.startsWith('data: ')) {
							try {
								const dataContent = trimmed.replace(/^data: /, '');
								if (dataContent === '[DONE]') continue;
								const json = JSON.parse(dataContent);
								const content = json.choices[0].delta.content;
								if (content) {
									debugLog('提取到内容:', content);
									fullText += content;
									if (aiResponseElement.querySelector('.ai-typing')) {
										aiResponseElement.querySelector('.ai-typing').remove()
									}
									aiResponseElement.innerHTML = formatAIResponse(fullText);
									ui.content.scrollTop = ui.content.scrollHeight
								}
							} catch (e) {
								debugLog('解析JSON失败:', e.message, '数据:', trimmed.substring(0, 50))
							}
						}
					}
				}
				if (buffer && !aborted) {
					try {
						const dataContent = buffer.replace(/^data: /, '');
						if (dataContent !== '[DONE]') {
							const json = JSON.parse(dataContent);
							if (json.choices[0].delta.content) {
								fullText += json.choices[0].delta.content;
								aiResponseElement.innerHTML = formatAIResponse(fullText)
							}
						}
					} catch (e) {
						debugLog('最终解析失败:', e.message)
					}
				}
				if (aiResponseElement.querySelector('.ai-typing')) {
					aiResponseElement.querySelector('.ai-typing').remove()
				}
				if (fullText) {
					chatHistory.push({
						role: 'assistant',
						content: fullText
					});
					GM_setValue('chatHistory', chatHistory);
					debugLog('聊天历史已保存')
				}
			} catch (error) {
				debugLog('流处理失败:', error);
				if (!aborted) {
					if (error.message.includes('401') && !apiKey.startsWith('sk-')) {
						aiResponseElement.innerHTML = `<span style="color:#ff3860">API密钥格式可能不正确。硅基流动API密钥通常以sk-开头。${apiKey}</span>`;
						setTimeout(() => {
							ui.settingsButton.click()
						}, 1000)
					} else {
						debugLog('尝试使用非流式API作为备选');
						aiResponseElement.innerHTML = '<span class="ai-typing">使用备选方法请求中...</span>';
						sendNonStreamRequest(message, aiResponseElement)
					}
				} else {
					aiResponseElement.innerHTML = '<span style="color:#ff3860">请求已中断</span>'
				}
			}
		})();
		return {
			abort: () => {
				debugLog('中断流式请求');
				aborted = true;
				controller.abort()
			}
		}
	}

	function sendNonStreamRequest(message, aiResponseElement) {
		debugLog('发送非流式API请求');
		const requestData = {
			model: model,
			messages: [{
				role: "user",
				content: message
			}],
			stream: false,
			max_tokens: 2048,
			temperature: 0.7,
			top_p: 0.7,
			top_k: 50,
			frequency_penalty: 0.5,
			n: 1
		};
		return GM_xmlhttpRequest({
			method: 'POST',
			url: 'https://api.siliconflow.cn/v1/chat/completions',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(requestData),
			onload: function(response) {
				debugLog('收到非流式响应:', response.status);
				try {
					const data = JSON.parse(response.responseText);
					if (data.error) {
						aiResponseElement.innerHTML = `<span style="color:#ff3860">API错误:${data.error.message||JSON.stringify(data.error)}</span>`;
						debugLog('API返回错误:', data.error)
					} else {
						let content = '';
						if (data.choices && data.choices[0]) {
							if (data.choices[0].message) {
								content = data.choices[0].message.content || ''
							} else if (data.choices[0].text) {
								content = data.choices[0].text || ''
							}
						}
						debugLog('提取的内容:', content ? (content.substring(0, 50) + '...') : '无内容');
						if (content) {
							aiResponseElement.innerHTML = formatAIResponse(content);
							chatHistory.push({
								role: 'assistant',
								content: content
							});
							GM_setValue('chatHistory', chatHistory)
						} else {
							aiResponseElement.innerHTML = '<span style="color:#ff3860">无法从响应中提取内容</span>';
							debugLog('响应中没有内容')
						}
					}
				} catch (e) {
					aiResponseElement.innerHTML = `<span style="color:#ff3860">解析响应失败:${e.message}</span>`;
					debugLog('解析错误:', e, '原始响应:', response.responseText.substring(0, 200))
				}
				if (aiResponseElement.querySelector('.ai-typing')) {
					aiResponseElement.querySelector('.ai-typing').remove()
				}
			},
			onerror: function(error) {
				debugLog('请求错误:', error);
				aiResponseElement.innerHTML = `<span style="color:#ff3860">请求失败(${error.status||'网络错误'})</span>`;
				if (aiResponseElement.querySelector('.ai-typing')) {
					aiResponseElement.querySelector('.ai-typing').remove()
				}
			}
		})
	}

	function sendMessage() {
		const message = ui.textarea.value.trim();
		if (!message) return;
		if (!apiKey) {
			alert('请先设置API密钥！');
			ui.settingsPanel.style.display = 'flex';
			return
		}
		if (currentStream) {
			try {
				currentStream.abort()
			} catch (e) {
				debugLog('中断请求失败:', e)
			}
			currentStream = null
		}
		debugLog('开始发送消息', '模式:', useStreamMode ? '流式' : '非流式');
		const userMessageDiv = document.createElement('div');
		userMessageDiv.className = 'ai-message';
		userMessageDiv.innerHTML = `<div class="ai-sender"><span>👤</span>你</div><div class="ai-user-message">${message}</div>`;
		ui.content.appendChild(userMessageDiv);
		const aiMessageDiv = document.createElement('div');
		aiMessageDiv.className = 'ai-message';
		aiMessageDiv.innerHTML = `<div class="ai-sender"><span>🤖</span>AI</div><div class="ai-response"><span class="ai-typing">▌</span></div>`;
		ui.content.appendChild(aiMessageDiv);
		ui.content.scrollTop = ui.content.scrollHeight;
		ui.textarea.value = '';
		ui.textarea.style.height = 'auto';
		chatHistory.push({
			role: 'user',
			content: message
		});
		const aiResponseElement = aiMessageDiv.querySelector('.ai-response');
		try {
			if (useStreamMode) {
				currentStream = sendStreamRequest(message, aiResponseElement)
			} else {
				currentStream = sendNonStreamRequest(message, aiResponseElement)
			}
		} catch (e) {
			debugLog('发送请求失败:', e.message);
			aiResponseElement.innerHTML = `<span style="color:#ff3860">发送请求失败:${e.message}</span>`;
			if (aiResponseElement.querySelector('.ai-typing')) {
				aiResponseElement.querySelector('.ai-typing').remove()
			}
		}
	}
	loadChatHistory();
	GM_registerMenuCommand('打开AI助手', () => {
		ui.icon.click()
	});
	GM_registerMenuCommand('设置', () => {
		ui.icon.click();
		setTimeout(() => {
			ui.settingsButton.click()
		}, 300)
	});
	GM_registerMenuCommand('切换调试模式', () => {
		debugMode = !debugMode;
		GM_setValue('debugMode', debugMode);
		alert('调试模式已' + (debugMode ? '开启' : '关闭'));
		updateStyles()
	});
	debugLog('初始化完成', '版本: 2.2', '模型:', model)
})();