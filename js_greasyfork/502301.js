// ==UserScript==
// @name         javaGuideAdRemove
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  JavaGuide 指北 提示\广告 移除 java面试题
// @author       Alone
// @match        *://*javaguide.cn/*
// @match        *://*.yuque.com/snailclimb*
// @require      https://code.jquery.com/jquery-3.7.1.slim.js
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/502301/javaGuideAdRemove.user.js
// @updateURL https://update.greasyfork.org/scripts/502301/javaGuideAdRemove.meta.js
// ==/UserScript==
(function () {
	'use strict';


	// 防抖\节流
	function debounce(func, wait) {
		let timeout;

		return function () {
			const context = this,
				args = arguments;

			// 如果定时器已设置，则清除它
			if (timeout) {
				clearTimeout(timeout);
			}

			// 设置新的定时器
			timeout = setTimeout(() => {
				func.apply(context, args);
			}, wait);
		};
	}

	function modifyIcon() {
		// 替换此URL为你想要的图标URL
		const newIconUrl = 'https://baidu.com/favicon.ico';

		// 查找现有的favicon标签
		let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
		link.type = 'image/x-icon';
		link.rel = 'shortcut icon';
		link.href = newIconUrl;

		// 如果favicon标签不存在，则添加它
		if (!document.querySelector("link[rel*='icon']")) {
			document.getElementsByTagName('head')[0].appendChild(link);
		}
	}

	function handle() {
		modifyIcon()
		$("img[alt='JavaGuide 官方公众号']").remove()

		$("a[href='/about-the-author/zhishixingqiu-two-years.html']").remove()

		$(".vp-navbar-start>a").remove()

		var originalText = "面试";
		var newText = "笔记";

		let title = $("title").html().replace(new RegExp(originalText, 'g'), newText).replace("| JavaGuide", "")

		$("title").html(title)

		$('body :not(script)').contents().filter(function () {
			return this.nodeType === 3; // 文本节点
		}).each(function () {
			this.nodeValue = this.nodeValue.replace(new RegExp(originalText, 'g'), newText);
		});
		$(".hint-container[baseURI='https://javaguide.cn/cs-basics/network/other-network-questions.html']").remove()
		$(".hint-container,.tip").remove()
		console.log(" 执行成功")
	}

	// 定义一个回调函数，该函数会在DOM变化时被调用
	function mutationCallback(mutationsList, observer) {
		for (let mutation of mutationsList) {
			if (mutation.type === 'childList') {
				debounce(handle(), 5000);
				break
			}
		}
	}

	$(document).ready(function () {
		handle()
	})

	// 创建一个MutationObserver实例并传入回调函数
	const observer = new MutationObserver(mutationCallback);
	const config = {childList: true, subtree: true};
	const targetNode = document.body;
	debounce(observer.observe(targetNode, config), 5000);


})();