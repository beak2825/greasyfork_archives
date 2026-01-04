// ==UserScript==
// @name         DeepSeek 对话导出
// @name:en      DeepSeek Chat Export
// @namespace    http://tampermonkey.net/
// @version      1.25.0313
// @description  将 Deepseek 对话导出与复制的工具
// @description:en  The tool for exporting and copying dialogues in Deepseek
// @author       木炭
// @copyright	 © 2025 木炭
// @license      MIT
// @supportURL   https://github.com/woodcoal/deepseek-chat-export
// @homeUrl      https://www.mutan.vip/
// @lastmodified 2025-02-27
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/528197/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528197/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
	('use strict');
	const BUTTON_ID = 'DS_MarkdownExport';
	let isProcessing = false;

	GM_addStyle(`
        #${BUTTON_ID}-container {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            display: flex !important;
            gap: 8px !important;
        }
        #${BUTTON_ID}, #${BUTTON_ID}-copy {
            padding: 4px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            opacity: 0.3 !important;
            background: none !important;
            border: none !important;
            font-size: 20px !important;
            position: relative !important;
        }
        #${BUTTON_ID}:hover, #${BUTTON_ID}-copy:hover {
            opacity: 1 !important;
            transform: scale(1.1) !important;
        }
        #${BUTTON_ID}:hover::after, #${BUTTON_ID}-copy:hover::after {
            content: attr(title) !important;
            position: absolute !important;
            top: 100% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            white-space: nowrap !important;
            z-index: 1000 !important;
        }
        .ds-toast {
            position: fixed !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            z-index: 2147483647 !important;
            animation: toast-in-out 2s ease !important;
        }
        .ds-toast.error {
            background: rgba(255, 0, 0, 0.8) !important;
        }
        .ds-toast.success {
            background: rgba(0, 100, 255, 0.8) !important;
        }
        @keyframes toast-in-out {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            20% { opacity: 1; transform: translate(-50%, 0); }
            80% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, 20px); }
        }
    `);

	const SELECTORS = {
		MESSAGE: 'dad65929', // 消息内容区域
		USER_PROMPT: 'fa81', // 用户提问
		AI_ANSWER: 'f9bf7997', // AI回答区域
		AI_THINKING: 'e1675d8b', // 思考区域
		AI_RESPONSE: 'ds-markdown', // 回答内容区域
		TITLE: 'd8ed659a' // 标题
	};

	function createUI() {
		if (document.getElementById(BUTTON_ID)) return;

		// 检查当前是否为首页
		if (isHomePage()) {
			// 如果是首页，移除已存在的按钮
			const existingContainer = document.getElementById(`${BUTTON_ID}-container`);
			if (existingContainer) {
				existingContainer.remove();
			}
			return;
		}

		const container = document.createElement('div');
		container.id = `${BUTTON_ID}-container`;

		const copyBtn = document.createElement('button');
		copyBtn.id = `${BUTTON_ID}-copy`;
		copyBtn.textContent = '📋';
		copyBtn.title = '复制到剪贴板';
		copyBtn.onclick = () => handleExport('clipboard');

		const exportBtn = document.createElement('button');
		exportBtn.id = BUTTON_ID;
		exportBtn.textContent = '💾';
		exportBtn.title = '导出对话';
		exportBtn.onclick = () => handleExport('file');

		container.append(copyBtn, exportBtn);
		document.body.append(container);
	}

	// 添加判断是否为首页的函数
	function isHomePage() {
		// 检查URL是否为首页
		if (
			window.location.pathname === '/' ||
			window.location.href === 'https://chat.deepseek.com/'
		) {
			return true;
		}

		// 检查是否存在对话内容元素
		const hasConversation = !!document.querySelector(`.${SELECTORS.MESSAGE}`);
		return !hasConversation;
	}

	async function handleExport(mode) {
		if (isProcessing) return;
		isProcessing = true;

		try {
			const conversations = await extractConversations();
			if (!conversations.length) {
				showToast('未检测到有效对话内容', true);
				return;
			}

			const content = formatMarkdown(conversations);

			if (mode === 'file') {
				downloadMarkdown(content);
			} else {
				GM_setClipboard(content, 'text');
				showToast('对话内容已复制到剪贴板');
			}
		} catch (error) {
			console.error('[导出错误]', error);
			showToast(`操作失败: ${error.message}`, true);
		} finally {
			isProcessing = false;
		}
	}

	function extractConversations() {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				const conversations = [];
				const blocks = document.querySelector(`.${SELECTORS.MESSAGE}`)?.childNodes;

				blocks.forEach((block) => {
					try {
						if (block.classList.contains(SELECTORS.USER_PROMPT)) {
							conversations.push({
								content: cleanContent(block, 'prompt'),
								type: 'user'
							});
						} else if (block.classList.contains(SELECTORS.AI_ANSWER)) {
							const thinkingNode = block.querySelector(`.${SELECTORS.AI_THINKING}`);
							const responseNode = block.querySelector(`.${SELECTORS.AI_RESPONSE}`);
							conversations.push({
								content: {
									thinking: thinkingNode
										? cleanContent(thinkingNode, 'thinking')
										: '',
									response: responseNode
										? cleanContent(responseNode, 'response')
										: ''
								},
								type: 'ai'
							});
						}
					} catch (e) {
						console.warn('[对话解析错误]', e);
					}
				});

				resolve(conversations);
			});
		});
	}

	function cleanContent(node, type) {
		const clone = node.cloneNode(true);
		clone
			.querySelectorAll('button, .ds-flex, .ds-icon, .ds-icon-button, .ds-button,svg')
			.forEach((el) => el.remove());

		switch (type) {
			case 'prompt':
				var content = clone.textContent.replace(/\n{2,}/g, '\n').trim();

				// 转义 HTML 代码
				return content.replace(/[<>&]/g, function (match) {
					const escapeMap = {
						'<': '&lt;',
						'>': '&gt;',
						'&': '&amp;'
					};
					return escapeMap[match];
				});

			case 'thinking':
				return clone.innerHTML
					.replace(/<\/p>/gi, '\n')
					.replace(/<br\s*\/?>/gi, '\n')
					.replace(/<\/?[^>]+(>|$)/g, '')
					.replace(/\n+/g, '\n')
					.trim();
			case 'response':
				return clone.innerHTML;
			default:
				return clone.textContent.trim();
		}
	}

	function formatMarkdown(conversations) {
		// 获取页面标题
		const titleElement = document.querySelector(`.${SELECTORS.TITLE}`);
		const title = titleElement ? titleElement.textContent.trim() : 'DeepSeek对话';

		let md = `# ${title}\n\n`;

		conversations.forEach((conv, idx) => {
			if (conv.type === 'user') {
				if (idx > 0) md += '\n---\n';
				// md += `## 第 *${idx + 1}#* 轮对话\n`;

				let ask = conv.content.split('\n').join('\n> ');
				md += `\n> [!info] 提问\n> ${ask}\n\n`;
			}

			if (conv.type === 'ai' && conv.content) {
				if (conv.content.thinking) {
					let thinking = conv.content.thinking.split('\n').join('\n> ');

					md += `\n> [!success] 思考\n${thinking}\n`;
				}

				if (conv.content.response) {
					md += `\n${enhancedHtmlToMarkdown(conv.content.response)}\n`;
				}
			}
		});

		return md;
	}

	function enhancedHtmlToMarkdown(html) {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;

		// 预处理代码块
		tempDiv.querySelectorAll('.md-code-block').forEach((codeBlock) => {
			const lang =
				codeBlock.querySelector('.md-code-block-infostring')?.textContent?.trim() || '';
			const codeContent = codeBlock.querySelector('pre')?.textContent || '';
			codeBlock.replaceWith(`[_code_:]${lang}\n${codeContent}[:_code_]`);
		});

		// 预处理数学公式
		tempDiv.querySelectorAll('.math-inline').forEach((math) => {
			math.replaceWith(`$${math.textContent}$`);
		});
		tempDiv.querySelectorAll('.math-display').forEach((math) => {
			math.replaceWith(`\n$$\n${math.textContent}\n$$\n`);
		});

		return Array.from(tempDiv.childNodes)
			.map((node) => convertNodeToMarkdown(node))
			.join('')
			.replace(/\[_code_\:\]/g, '\n```')
			.replace(/\[\:_code_\]/g, '\n```\n')
			.trim();
	}

	function convertNodeToMarkdown(node, level = 0, processedNodes = new WeakSet()) {
		if (!node || processedNodes.has(node)) return '';
		processedNodes.add(node);

		const handlers = {
			P: (n) => {
				const text = processInlineElements(n);
				return text ? `${text}\n` : '';
			},
			STRONG: (n) => `**${n.textContent}**`,
			EM: (n) => `*${n.textContent}*`,
			HR: () => '\n---\n',
			BR: () => '\n',
			A: (n) => processLinkElement(n),
			IMG: (n) => processImageElement(n),
			BLOCKQUOTE: (n) => {
				const content = Array.from(n.childNodes)
					.map((child) => convertNodeToMarkdown(child, level, processedNodes))
					.join('')
					.split('\n')
					.filter((line) => line.trim())
					.map((line) => `> ${line}`)
					.join('\n');
				return `\n${content}\n`;
			},
			UL: (n) => processListItems(n, level, '-'),
			OL: (n) => processListItems(n, level, null, n.getAttribute('start') || 1),
			PRE: (n) => `[_code_:]${n.textContent.trim()}[:_code_]`,
			CODE: (n) => `\`${n.textContent.trim()}\``,
			H1: (n) => `# ${processInlineElements(n)}\n`,
			H2: (n) => `## ${processInlineElements(n)}\n`,
			H3: (n) => `### ${processInlineElements(n)}\n`,
			H4: (n) => `#### ${processInlineElements(n)}\n`,
			H5: (n) => `##### ${processInlineElements(n)}\n`,
			H6: (n) => `###### ${processInlineElements(n)}\n`,
			TABLE: processTable,
			DIV: (n) =>
				Array.from(n.childNodes)
					.map((child) => convertNodeToMarkdown(child, level, processedNodes))
					.join(''),
			'#text': (n) => n.textContent.trim(),
			_default: (n) =>
				Array.from(n.childNodes)
					.map((child) => convertNodeToMarkdown(child, level, processedNodes))
					.join('')
		};

		return handlers[node.nodeName]?.(node) || handlers._default(node);
	}

	function processInlineElements(node) {
		return Array.from(node.childNodes)
			.map((child) => {
				if (child.nodeType === 3) return child.textContent.trim();
				if (child.nodeType === 1) {
					if (child.matches('strong')) return `**${child.textContent}**`;
					if (child.matches('em')) return `*${child.textContent}*`;
					if (child.matches('code')) return `\`${child.textContent}\``;
					if (child.matches('a')) return processLinkElement(child);
					if (child.matches('img')) return processImageElement(child);
				}
				return child.textContent;
			})
			.join('');
	}

	function processImageElement(node) {
		const alt = node.getAttribute('alt') || '';
		const title = node.getAttribute('title') || '';
		const src = node.getAttribute('src') || '';
		return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`;
	}

	function processLinkElement(node) {
		const href = node.getAttribute('href') || '';
		const title = node.getAttribute('title') || '';
		const content = Array.from(node.childNodes)
			.map((child) => convertNodeToMarkdown(child))
			.join('');
		return title ? `[${content}](${href} "${title}")` : `[${content}](${href})`;
	}

	function processListItems(node, level, marker, start = null) {
		let result = '';
		const indent = '  '.repeat(level);
		Array.from(node.children).forEach((li, idx) => {
			const prefix = marker ? `${marker} ` : `${parseInt(start) + idx}. `;
			// 先处理li节点的直接文本内容
			const mainContent = Array.from(li.childNodes)
				.filter((child) => child.nodeType === 1 && !child.matches('ul, ol'))
				.map((child) => convertNodeToMarkdown(child, level))
				.join('')
				.trim();

			if (mainContent) {
				result += `${indent}${prefix}${mainContent}\n`;
			}

			// 单独处理嵌套列表
			const nestedLists = li.querySelectorAll(':scope > ul, :scope > ol');
			nestedLists.forEach((list) => {
				result += convertNodeToMarkdown(list, level + 1);
			});
		});
		return result;
	}

	function processTable(node) {
		const rows = Array.from(node.querySelectorAll('tr'));
		if (!rows.length) return '';

		const headers = Array.from(rows[0].querySelectorAll('th,td')).map((cell) =>
			cell.textContent.trim()
		);

		let markdown = `\n| ${headers.join(' | ')} |\n| ${headers
			.map(() => '---')
			.join(' | ')} |\n`;

		for (let i = 1; i < rows.length; i++) {
			const cells = Array.from(rows[i].querySelectorAll('td')).map((cell) =>
				processInlineElements(cell)
			);
			markdown += `| ${cells.join(' | ')} |\n`;
		}

		return markdown + '\n';
	}

	function downloadMarkdown(content) {
		const titleElement = document.querySelector(`.${SELECTORS.TITLE}`);
		const title = titleElement ? titleElement.textContent.trim() : 'DeepSeek对话';
		const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${title}.md`;
		link.style.display = 'none';
		document.body.appendChild(link);
		link.click();
		setTimeout(() => {
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
		}, 1000);
	}

	function showToast(message, isError = false) {
		const toast = document.createElement('div');
		toast.className = `ds-toast ${isError ? 'error' : 'success'}`;
		toast.textContent = message;
		document.body.appendChild(toast);

		toast.addEventListener('animationend', () => {
			document.body.removeChild(toast);
		});
	}

	// 添加 URL 变化监听
	function setupUrlChangeListener() {
		let lastUrl = window.location.href;

		// 监听 URL 变化
		setInterval(() => {
			if (lastUrl !== window.location.href) {
				lastUrl = window.location.href;
				const existingContainer = document.getElementById(`${BUTTON_ID}-container`);
				if (existingContainer) {
					existingContainer.remove();
				}
				createUI();
			}
		}, 1000);

		// 监听 history 变化
		const pushState = history.pushState;
		history.pushState = function () {
			pushState.apply(history, arguments);
			const existingContainer = document.getElementById(`${BUTTON_ID}-container`);
			if (existingContainer) {
				existingContainer.remove();
			}
			createUI();
		};
	}

	const observer = new MutationObserver(() => createUI());
	observer.observe(document, { childList: true, subtree: true });
	// window.addEventListener('load', createUI);
	// setInterval(createUI, 3000);
	window.addEventListener('load', () => {
		createUI();
		setupUrlChangeListener();
	});
})();
