// ==UserScript==
// @name         添加自定义折叠按钮
// @namespace    http://tampermonkey.net/
// @version      20250816.1
// @description  在页面上选择元素进行折叠并增加折叠展开按钮
// @author       atakhalo
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546032/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8A%98%E5%8F%A0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/546032/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8A%98%E5%8F%A0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let target = null;
	let moveSelect = null;

	// 添加样式
	const style = document.createElement('style');
	style.textContent = `
		.fold-highlight {
			outline: 3px dashed #ff6600 !important;
			cursor: pointer !important;
			position: relative;
			z-index: 9999;
		}

		.fold-highlight::after {
			content: "点击折叠(alt +-*/进行切换父子兄弟)";
			position: absolute;
			top: -25px;
			left: 0;
			background: #ff6600;
			color: white;
			padding: 2px 6px;
			font-size: 12px;
			border-radius: 4px;
			white-space: nowrap;
		}

		.fold-expand-marker {
			margin-top: 12px;
			height: 26px;
			margin-bottom: 20px;
			// color: white;
			// width: 26px;
			display: flex;
			font-size: 16px;
			cursor: pointer;
			box-shadow: 0 2px 6px rgba(0,0,0,0.2);
			// z-index: 10000;
			transition: all 0.2s;
		}

		// .fold-expand-marker:hover {
		//     // transform: scale(1.1);
		//     // box-shadow: 0 4px 10px rgba(0,0,0,0.3);
		// }

		// .fold-expand-marker::after {
		//     content: "展开";
		//     position: absolute;
		//     top: -25px;
		//     right: -5px;
		//     background: #4a6cf7;
		//     color: white;
		//     padding: 2px 6px;
		//     font-size: 12px;
		//     border-radius: 4px;
		//     white-space: nowrap;
		//     opacity: 0;
		//     transition: opacity 0.2s;
		// }

		// .fold-expand-marker:hover::after {
		//     opacity: 1;
		// }

		#foldCounter {
			position: fixed;
			top: 80px;
			left: 25px;
			background: rgba(255,255,255,0.9);
			border: 1px solid #4a6cf7;
			padding: 5px 10px;
			border-radius: 20px;
			font-size: 12px;
			z-index: 9999;
			box-shadow: 0 2px 8px rgba(0,0,0,0.1);
			display: none;
		}

		#foldStatus {
			position: fixed;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
			background: rgba(0,0,0,0.7);
			color: white;
			padding: 8px 16px;
			border-radius: 4px;
			font-size: 14px;
			z-index: 10000;
			display: none;
		}
	`;
	document.head.appendChild(style);

	// 创建状态提示
	const statusMsg = document.createElement('div');
	statusMsg.id = 'foldStatus';
	document.body.appendChild(statusMsg);

	// 显示状态消息
	function showStatus(message, duration = 2000) {
		statusMsg.textContent = message;
		statusMsg.style.display = 'block';
		setTimeout(() => {
			statusMsg.style.display = 'none';
		}, duration);
	}

	GM_registerMenuCommand('选择折叠', toSelect)

	GM_registerMenuCommand('取消选择', stopSelect)
	GM_registerMenuCommand('全部展开', expandAll)
	GM_registerMenuCommand('全部清除', delAll)

	function toSelect() {
		moveSelect = true;
		showStatus('选择模式已激活 - 点击页面元素进行折叠', 3000);
		document.body.addEventListener('mousemove', highlightElement);
		document.body.addEventListener('click', selectElement);
		document.addEventListener('keydown', handleKey);
		// document.addEventListener('wheel', handleWheel);
		document.addEventListener('contextmenu', handleRightClick);
	}

	function stopMoveSelect() {
		moveSelect = false;
		document.body.removeEventListener('mousemove', highlightElement);
	}

	function stopSelect() {
		showStatus('选择模式已取消', 1500);
		endSelect();
	}

	function endSelect() {
		removeHighlights();
		stopMoveSelect();
		target = null;
		document.removeEventListener('keydown', handleKey);
		// document.removeEventListener('wheel', handleWheel);
		document.body.removeEventListener('click', selectElement);
		document.removeEventListener('contextmenu', handleRightClick);
	}

	// 选择元素进行折叠
	function selectElement(e) {
		if (checkFold(target)) // 已经有折叠按钮了
		{

		}
		else {
			foldElement(target);
		}
		endSelect();
		stopE(e);
		showStatus('成功折叠', 1500);
	}

	function checkFold(e) {
		const p = e.previousSibling;
		if (p == null)
			return;
		if (p && p.classList && p.classList.contains('fold-expand-marker')) {
			if (p.isFold === false) {
				p.click();
			}
			return true;
		}
		return false;
	}

	// 递归获取元素的前两个汉字
	function getFirstTwoChineseChars(element) {
		if (!element) return '';
		let text = '';
		for (let node of element.childNodes) {
			if (node.classList?.contains('fold-expand-marker')) {
				continue;
			}
			if (node.nodeType === Node.TEXT_NODE) {
				text += node.textContent.trim();
				if (text.length >= 4) break;
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				text += getFirstTwoChineseChars(node);
				if (text.length >= 4) break;
			}
		}
		return text.slice(0, 4);
	}

	// 折叠元素
	function foldElement(el) {
		// 隐藏元素
		el.style.display = 'none';

		// 创建展开标记
		const expandMarker = document.createElement('div');
		expandMarker.className = 'fold-expand-marker';
		expandMarker.title = '点击展开';
		expandMarker.isFold = true;
		expandMarker.showText = getFirstTwoChineseChars(el);
		expandMarker.textContent = expandMarker.showText + '...展开+';

		// 悬浮显示被遮挡元素内容
		expandMarker.addEventListener('mouseenter', () => {
			if (expandMarker.isFold === false) // 不是折叠就不显示了
			{
				return;
			}
			const preview = document.createElement('div');
			preview.className = 'fold-preview';
			preview.style.position = 'absolute';
			preview.style.zIndex = 9999;
			preview.style.background = '#fff';
			preview.style.border = '1px solid #ccc';
			preview.style.padding = '4px 8px';
			preview.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
			preview.textContent = el.textContent.trim().slice(0, 500);
			document.body.appendChild(preview);

			const rect = expandMarker.getBoundingClientRect();
			preview.style.left = `${rect.left + window.scrollX}px`;
			preview.style.top = `${rect.top + window.scrollY - preview.offsetHeight - 10}px`
			// preview.style.bottom = rect.top + 'px';

			expandMarker._preview = preview;
		});

		expandMarker.addEventListener('mouseleave', () => {
			if (expandMarker._preview) {
				document.body.removeChild(expandMarker._preview);
				expandMarker._preview = null;
			}
		});

		// 点击展开
		expandMarker.addEventListener('click', (e) => {
			if (el.style.display !== 'none') {
				expandMarker.isFold = true
				el.style.display = 'none';
				expandMarker.textContent = expandMarker.showText + '...展开+';
			} else {
				expandMarker.isFold = false
				el.style.display = '';
				expandMarker.textContent = expandMarker.showText + '...折叠-';
			}
			stopE(e);
		});

		const parent = el.parentNode;
		parent.insertBefore(expandMarker, el);
	}

	function expandAll() {
		const button = document.querySelectorAll(".fold-expand-marker");
		button.forEach(element => {
			if (element.isFold === true)
				element.click();
		});
	}

	function delAll() {
		const button = document.querySelectorAll(".fold-expand-marker");
		button.forEach(element => {
			if (element.isFold === true)
				element.click();
			element.remove();
		});
	}

	// 移除高亮
	function removeHighlights() {
		document.querySelectorAll('.fold-highlight').forEach(el => {
			el.classList.remove('fold-highlight');
		});
	}

	// 高亮元素
	function highlightElement(e) {
		highlightTarget(e.target);
	}

	function highlightTarget(newTarget) {
		target = newTarget;
		console.log("target" + target)
		// 排除不需要折叠的元素
		if (!target ||
			target === document.documentElement ||
			target === document.body ||
			target.classList.contains('fold-expand-marker')) {
			removeHighlights();
			return;
		}

		removeHighlights();
		target.classList.add('fold-highlight');
	}


	function handleKey(e) {
		if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
			if (moveSelect) {
				stopMoveSelect();
			}
			if (e.key === '+' || e.key === '=') {
				var newTarget = target.parentNode;
				TrySetTarget(newTarget, true); // 按理说不会折叠按钮不会是父节点，保底一下
				stopE(e);
			}
			else if (e.key === '-' || e.key === '_') {
				var newTarget = target.firstElementChild;
				TrySetTarget(newTarget, true);
				stopE(e);
			}
			else if (e.key === '*' || e.key === ']') {
				var newTarget = target.nextElementSibling;
				TrySetTarget(newTarget, true);
				stopE(e);
			}
			else if (e.key === '/' || e.key === '[') {
				var newTarget = target.previousElementSibling;
				TrySetTarget(newTarget, false);
				stopE(e);
			}
		}
	}

	// toNext 表示如果当前是折叠按钮，是否向下一个还是向上一个
	function IsFoldButton(newTarget, toNext) {
		if (newTarget.classList.contains('fold-expand-marker')) {
			if (toNext) {
				return newTarget.nextElementSibling;
			}
			else {
				return newTarget.previousElementSibling;
			}
		}
		return newTarget;
	}

	function TrySetTarget(newTarget, toNext) {
		newTarget = IsFoldButton(newTarget)
		if (newTarget != null) {
			highlightTarget(newTarget, toNext);
		}
		else {
		}
	}

	function handleRightClick(e) {
		stopSelect();
		stopE(e);
	}

	function stopE(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
	}
})();
