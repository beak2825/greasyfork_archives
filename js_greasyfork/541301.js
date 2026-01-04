// ==UserScript==
// @name         湖南大学CG平台代码块复制
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在湖南大学CG平台中为每个代码块添加复制按钮
// @author       淼畔
// @match        https://cg.hnu.edu.cn/*
// @grant        none
// @license      MIT
// @icon         https://cg.hnu.edu.cn/images/cgicon.png
// @downloadURL https://update.greasyfork.org/scripts/541301/%E6%B9%96%E5%8D%97%E5%A4%A7%E5%AD%A6CG%E5%B9%B3%E5%8F%B0%E4%BB%A3%E7%A0%81%E5%9D%97%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/541301/%E6%B9%96%E5%8D%97%E5%A4%A7%E5%AD%A6CG%E5%B9%B3%E5%8F%B0%E4%BB%A3%E7%A0%81%E5%9D%97%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 存储已处理的代码块
	const processedPre = new WeakSet();

	// 初始处理可见的代码块
	document.querySelectorAll('pre').forEach(pre => {
		if (isElementVisible(pre)) {
			addButtonForPre(pre);
		}
	});

	// 设置监控 DOM 变化的观察器
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (mutation.type === 'childList') {
				// 处理新增节点
				mutation.addedNodes.forEach(node => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						if (node.tagName === 'PRE' && isElementVisible(node)) {
							addButtonForPre(node);
						}
						node.querySelectorAll('pre').forEach(pre => {
							if (isElementVisible(pre)) {
								addButtonForPre(pre);
							}
						});
					}
				});
			}
			else if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
				document.querySelectorAll('pre').forEach(pre => {
					if (isElementVisible(pre)) {
						addButtonForPre(pre);
					}
				});
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['style']
	});

	// 为单个代码块添加按钮
	function addButtonForPre(pre) {
		if (processedPre.has(pre)) return;
		processedPre.add(pre);

		// 查找合适的容器元素
		let container = findSuitableContainer(pre);

		// 检查字符长度
		const text = container.textContent.trim();
		const shouldNewLine = text.length > 15;

		let btnContainer = container;
		if (shouldNewLine) {
			const newContainer = document.createElement('div');
			newContainer.style.marginTop = '4px';
			pre.parentNode.insertBefore(newContainer, pre);
			btnContainer = newContainer;
		}

		// 添加复制按钮
		createCopyButton(btnContainer, pre);
	}

    // 获取pre元素的文本内容，处理<br>换行，并替换特殊空格和非期望字符
    function getPreTextContent(pre) {
        // 克隆节点以避免修改原始DOM
        const clone = pre.cloneNode(true);

        // 替换所有<br>为换行符
        const brs = clone.querySelectorAll('br');
        brs.forEach(br => {
            br.parentNode.replaceChild(document.createTextNode('\n'), br);
        });

        // 获取文本内容并处理非期望字符
        let text = clone.textContent.trim();

        // 替换所有类型的空格字符(除换行符外)和控制字符
        text = text.replace(/[^\S\n]|[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, ' ');

        // 合并连续的空格为单个空格(不包括换行符)
        text = text.replace(/(?!\n) +(?!\n)/g, ' ');

        return text;
    }

	// 智能查找合适的容器元素
	function findSuitableContainer(pre) {
		// 默认使用前一个元素
		let candidate = pre.previousElementSibling;

		// 向前搜索最多5个元素
		for (let i = 0; i < 5 && candidate; i++) {
			const isValid = (
				candidate &&
				candidate.tagName !== 'BR' && // 跳过 <br> 元素
				!isEffectivelyEmpty(candidate) // 跳过空元素
			);

			if (isValid) {
				return candidate;
			}
			candidate = candidate.previousElementSibling;
		}

		// 如果没有找到合适元素，创建新容器
		const container = document.createElement('div');
		container.style.margin = '8px 0';
		pre.parentNode.insertBefore(container, pre);
		return container;
	}

	// 检查元素是否实质为空
	function isEffectivelyEmpty(element) {
		if (!element) return true;

		// 检查可见子元素
		const hasVisibleChildren = Array.from(element.children).some(child => {
			return isElementVisible(child) && !isEffectivelyEmpty(child);
		});

		// 检查文本内容
		const text = element.textContent.trim();

		return !hasVisibleChildren && text === '';
	}

	// 创建复制按钮
	function createCopyButton(container, preElement) {
		// 避免重复添加
		if (container.querySelector('.hnu-copy-btn')) return;

		const btn = document.createElement('button');
		btn.className = 'hnu-copy-btn';
		btn.textContent = '复制';
		btn.style.cssText = `
            font-size: 12px;
            padding: 2px 8px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            color: #333;
            transition: all 0.3s;
            position: relative;
            z-index: 1000;
        `;

		container.appendChild(btn);

		btn.addEventListener('click', function () {
			const originalText = btn.textContent;
			copyToClipboard(getPreTextContent(preElement));

			btn.textContent = "✓ 复制成功";
			btn.style.background = "#edfae9";
			btn.style.borderColor = "#4CAF50";
			btn.style.color = "#4CAF50";

			setTimeout(() => {
				btn.textContent = originalText;
				btn.style.background = "#f5f5f5";
				btn.style.borderColor = "#ddd";
				btn.style.color = "#333";
			}, 400);
		});
	}

	// 判断元素是否可见
	function isElementVisible(el) {
		if (!el) return false;
		if (el.style && el.style.display === 'none') return false;

		const computedStyle = window.getComputedStyle(el);
		if (computedStyle.display === 'none') return false;
		if (computedStyle.visibility === 'hidden') return false;

		let parent = el.parentElement;
		while (parent && parent !== document.body) {
			const parentStyle = window.getComputedStyle(parent);
			if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') {
				return false;
			}
			parent = parent.parentElement;
		}

		return true;
	}

	// 复制到剪贴板
	function copyToClipboard(text) {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.opacity = '0'; // 透明但可操作
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand('copy');
		document.body.removeChild(textArea);
	}
})();