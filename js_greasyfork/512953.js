// ==UserScript==
// @name         全部使用系统字体
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  强制网页全部使用操作系统设置的字体
// @author       witt
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512953/%E5%85%A8%E9%83%A8%E4%BD%BF%E7%94%A8%E7%B3%BB%E7%BB%9F%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/512953/%E5%85%A8%E9%83%A8%E4%BD%BF%E7%94%A8%E7%B3%BB%E7%BB%9F%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// 设置字体样式
	function setFont(document) {
		var style = document.createElement('style');
		// style.type = 'text/css';
		style.innerHTML = `
            *, iframe * {
                font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
            }
        `;
		document.head.appendChild(style);
	}

	// 监听iframe加载完成事件
	function handleIframeLoad(e) {
		setFont(e.target.contentWindow.document);
	}

	// 设置当前页面的字体
	setFont(document);

	// 监听iframe onload事件
	document.querySelectorAll('iframe').forEach(function (iframe) {
		iframe.addEventListener('load', handleIframeLoad);
	});

	// 监听动态添加的iframe
	new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			Array.prototype.forEach.call(mutation.addedNodes, function (node) {
				if (node.localName === 'iframe') {
					node.addEventListener('load', handleIframeLoad);
				}
			});
		});
	}).observe(document.body, { childList: true, subtree: true });
})();
