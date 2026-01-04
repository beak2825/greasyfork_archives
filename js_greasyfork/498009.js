// ==UserScript==
// @name         MyTan 补全计划：快捷键
// @namespace    https://lcwebsite.cn/
// @version      0.5.0
// @description  通过新增一些快捷键让 MyTan Web 端更好用！
// @author       LC
// @match        https://mytan.maiseed.com.cn/*
// @icon         https://mytan.maiseed.com.cn/assets/single-logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498009/MyTan%20%E8%A1%A5%E5%85%A8%E8%AE%A1%E5%88%92%EF%BC%9A%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/498009/MyTan%20%E8%A1%A5%E5%85%A8%E8%AE%A1%E5%88%92%EF%BC%9A%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

"use strict";

(function () {
	const regexs = {
		chatAndDocumentConversation: /^\/(?:chat|document)\/[a-z0-9]{24}$/,
		chatAndDocument: /^\/(?:chat|document)/,
		toolsConversation: /^\/tools\/[a-z0-9]{24}$/,
		chatConversation: /^\/chat\/[a-z0-9]{24}$/,
	};

	const withKeys = {
		none: (e) => !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey,
		alt: (e) => e.altKey,
		ctrl: (e) => e.ctrlKey,
		meta: (e) => e.metaKey,
		shift: (e) => e.shiftKey,
		altOnly: (e) => e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey,
		ctrlOnly: (e) => !e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey,
		metaOnly: (e) => !e.altKey && !e.ctrlKey && e.metaKey && !e.shiftKey,
		shiftOnly: (e) => !e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey,
		altAndCtrl: (e) => e.altKey && e.ctrlKey && !e.metaKey && !e.shiftKey,
		altAndMeta: (e) => e.altKey && !e.ctrlKey && e.metaKey && !e.shiftKey,
		altAndShift: (e) => e.altKey && !e.ctrlKey && !e.metaKey && e.shiftKey,
		ctrlAndMeta: (e) => !e.altKey && e.ctrlKey && e.metaKey && !e.shiftKey,
		ctrlAndShift: (e) => !e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey,
		metaAndShift: (e) => !e.altKey && !e.ctrlKey && e.metaKey && e.shiftKey,
		altCtrlMeta: (e) => e.altKey && e.ctrlKey && e.metaKey && !e.shiftKey,
		altCtrlShift: (e) => e.altKey && e.ctrlKey && !e.metaKey && e.shiftKey,
		altMetaShift: (e) => e.altKey && !e.ctrlKey && e.metaKey && e.shiftKey,
		ctrlMetaShift: (e) => !e.altKey && e.ctrlKey && e.metaKey && e.shiftKey,
		altCtrlMetaShift: (e) =>
			e.altKey && e.ctrlKey && e.metaKey && e.shiftKey,
	};

	// skipcq: JS-R1005 够清晰就行
	document.body.addEventListener("keydown", (e) => {
		const key = e.key.toLowerCase(); // 将键值转换为小写

		if (
			((key === "f2" && withKeys.none(e)) ||
				(key === "l" && withKeys.altOnly(e))) &&
			regexs.chatAndDocumentConversation.test(location.pathname)
		) {
			// F2：重命名对话，适用于聊天和文档的对话页面
			// Alt + L：设置标签，适用于聊天和文档的对话页面
			e.preventDefault();

			// 获取当前活动对话的容器元素
			const activeConversation = document.querySelector(
				".active-conversation-item",
			);
			if (activeConversation !== null) {
				activeConversation.querySelector('[key="more"]')?.click();

				const keyToClick = key === "f2" ? "edit" : "label";
				document.querySelector(`[key="${keyToClick}"]`)?.click();
			}
			return;
		}

		/*
		这一部分功能暂时禁用，等待后续有精力再维护

		if (key === "a" && withKeys.altOnly(e)) {
			// Alt + A：切换到绘图模式
			e.preventDefault();
			document
				.querySelectorAll(
					'div[nztooltipplacement="right"][nz-tooltip]',
				)[2]
				.click();
			return;
		}

		if (key === "c" && withKeys.altOnly(e)) {
			// Alt + C：切换到聊天模式
			e.preventDefault();
			document
				.querySelectorAll(
					'div[nztooltipplacement="right"][nz-tooltip]',
				)[0]
				.click();
			return;
		}

		if (key === "d" && withKeys.altOnly(e)) {
			// Alt + D：切换到文档模式
			e.preventDefault();
			document
				.querySelectorAll(
					'div[nztooltipplacement="right"][nz-tooltip]',
				)[3]
				.click();
			return;
		}

		if (key === "t" && withKeys.altOnly(e)) {
			// Alt + T：切换到工具模式
			e.preventDefault();
			document
				.querySelectorAll(
					'div[nztooltipplacement="right"][nz-tooltip]',
				)[1]
				.click();
			return;
		}

		if (key === "i" && withKeys.altOnly(e)) {
			// Alt + I：打开用户设置
			e.preventDefault();
			document.querySelector(".avatar").click();
			document.querySelector(".setting-item").click();
			return;
		}

		*/

		if (key === "1" && withKeys.altOnly(e)) {
			if (regexs.chatAndDocument.test(location.pathname)) {
				// Alt + 1：打开或收起侧边栏，适用于聊天和文档的所有页面 #4
				e.preventDefault();
				document.querySelector('[key="collapsed"]').click();
				return;
			}

			if (regexs.toolsConversation.test(location.pathname)) {
				// Alt + 1：退出到工具主页，适用于工具的对话页面
				e.preventDefault();
				document.querySelector('[key="arrow"]').click();
				return;
			}

			if (location.pathname === "/draw") {
				// Alt + 1：切换生成与历史页面，适用于绘图页面
				e.preventDefault();
				const items = document.querySelectorAll(
					".tab-item.pointer.ng-star-inserted",
				);
				items[
					items[0].classList.contains("active-tab-item") ? 1 : 0
				].click();
				return;
			}
		}

		if (key === "i" && withKeys.ctrlOnly(e)) {
			// Ctrl + I：聚焦到输入框
			e.preventDefault();
			document.querySelector("textarea")?.focus();
			return;
		}

		if (
			key === "o" &&
			withKeys.ctrlOnly(e) &&
			location.pathname === "/document"
		) {
			// Ctrl + O：打开文档，适用于文档的新建页面
			e.preventDefault();
			document.querySelector("[nz-upload-btn]")?.click();
			return;
		}

		if (
			key === "g" &&
			withKeys.altOnly(e) &&
			regexs.chatConversation.test(location.pathname)
		) {
			// Alt + G：如果可以重新生成回答，重新生成最新的一个回答
			e.preventDefault();
			document.querySelector('[key="regenerate"]')?.click();
		}
	});
})();
