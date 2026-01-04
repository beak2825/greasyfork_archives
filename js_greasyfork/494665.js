// ==UserScript==
// @name         51CTONock
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock系列，51CTO 文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://blog.51cto.com/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494665/51CTONock.user.js
// @updateURL https://update.greasyfork.org/scripts/494665/51CTONock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: [".messbox time", "script[type='application/ld+json']"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: [".messbox time", ".article-content-wrap"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M368 48h4c6.6 0 12-5.4 12-12V12c0-6.6-5.4-12-12-12H12C5.4 0 0 5.4 0 12v24c0 6.6 5.4 12 12 12h4c0 80.6 32.2 165.8 97.2 208C47.9 298.4 16 383.9 16 464h-4c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12v-24c0-6.6-5.4-12-12-12h-4c0-80.6-32.2-165.8-97.2-208C336.1 213.6 368 128.1 368 48zM64 48h256c0 101.6-57.3 184-128 184S64 149.6 64 48zm256 416H64c0-101.6 57.3-184 128-184s128 82.4 128 184z"/></svg>`,
			},
		},
		allow_copy: {
			enabled: GM_getValue("allow_copy", true),
			selector: [".code-toolbar", ".article-content-wrap"],
		},
		allow_copy_with_btn: {
			enabled: GM_getValue("allow_copy_with_btn", true),
			selector: [".copy_btn", "code"],
		},
		hidden: {
			first_publish_tips: {
				enabled: GM_getValue("first_publish_tips", true),
				selector: [".detail-content-right section.common-fix:has(img[alt='新人福利'])"],
			},
			publish_task_tips: {
				enabled: GM_getValue("publish_task_tips", true),
				selector: [".header-content>.task", ".header-right .creative"],
			},
			min_menu_pic: {
				enabled: GM_getValue("min_menu_pic", true),
				selector: [".hover-ball"],
			},
			action_feedback: {
				enabled: GM_getValue("action_feedback", true),
				selector: [".minmenu .feedback"],
			},
			action_bootcamp: {
				enabled: GM_getValue("action_bootcamp", true),
				selector: [".minmenu .live"],
			},
			sidebar_lessons: {
				enabled: GM_getValue("sidebar_lessons", true),
				selector: [".zcht"],
			},
		},
		special_hidden: {
			first_publish_tips: {
				enabled: GM_getValue("first_publish_tips", true),
				selector: [".detail-content-right section", "section.common-fix"],
			},
		},
	};

	const setModal = `<div class="modal-dialog"><div class="modal-setting"onClick="event.cancelBubble = true"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间优化</span><span><input type="checkbox"id="feature-mark-datetime"aria-nock="datetime"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>阅读时长点击跳转到文章底部</span><span><input type="checkbox"id="feature-mark-readtime"aria-nock="readtime"/><label for="feature-mark-readtime"></label></span></div><div class="setting-item"><span>文章自由复制</span><span><input type="checkbox"id="feature-allow-copy"aria-nock="allow_copy"/><label for="feature-allow-copy"></label></span></div><div class="setting-item"><span>允许一键复制代码</span><span><input type="checkbox"id="feature-allow-copy-with-btn"aria-nock="allow_copy_with_btn"/><label for="feature-allow-copy-with-btn"></label></span></div><hr/><div class="setting-item"><span>隐藏首次发文提示</span><span><input type="checkbox"id="feature-hidden-first-publish-tips"aria-nock="first_publish_tips"/><label for="feature-hidden-first-publish-tips"></label></span></div><div class="setting-item"><span>隐藏发文任务提示</span><span><input type="checkbox"id="feature-hidden-publish-task-tips"aria-nock="publish_task_tips"/><label for="feature-hidden-publish-task-tips"></label></span></div><div class="setting-item"><span>隐藏右侧AI按钮图片</span><span><input type="checkbox"id="feature-hidden-min-menu-pic"aria-nock="min_menu_pic"/><label for="feature-hidden-min-menu-pic"></label></span></div><div class="setting-item"><span>隐藏右侧反馈按钮</span><span><input type="checkbox"id="feature-hidden-action-feedback"aria-nock="action_feedback"/><label for="feature-hidden-action-feedback"></label></span></div><div class="setting-item"><span>隐藏右侧训练营按钮</span><span><input type="checkbox"id="feature-hidden-action-bootcamp"aria-nock="action_bootcamp"/><label for="feature-hidden-action-bootcamp"></label></span></div><div class="setting-item"><span>隐藏右侧边栏精品课程</span><span><input type="checkbox"id="feature-hidden-sidebar-lessons"aria-nock="sidebar_lessons"/><label for="feature-hidden-sidebar-lessons"></label></span></div></div></div></div>`;
	const setStyle = `@keyframes fall { 0% { transform: translate(0%, -100%); opacity: 0; } 100% { transform: translate(0%, 0%); opacity: 1; } } .setting-item input[type=checkbox] { height: 0; width: 0; display: none; } .setting-item label { cursor: pointer; text-indent: -9999px; width: 40px; height: 20px; background: pink; display: block; border-radius: 100px; position: relative; } .setting-item label:after { content: ''; position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; background: #fff; border-radius: 90px; transition: 0.2s; } .setting-item input:checked+label { background: #57a; } .setting-item input:checked+label:after { left: calc(100% - 2px); transform: translateX(-100%); } .setting-item label:active:after { width: 28px; } .modal-dialog { pointer-events: auto !important; display:none; border: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; min-width: 100vw; min-height: 100vh; height: 100%; background-color: rgba(0, 0, 0, 0.4); } .modal-setting { width: 450px; margin: auto; background-color: #ffffff; border-radius: 5px; padding: 20px; margin-top: 40px; position: relative; box-sizing: border-box; animation: fall 0.5s ease-in-out; } .modal-header { border-bottom: 1px solid #000000; } .modal-header h3 { padding: 10px 0; margin: 0; } .modal-header span { font-size: 24px; color: #ccc; position: absolute; right: 5px; top: 0; cursor: pointer; } .setting-item { margin: 10px 0; font-size: 14px; display: flex; justify-content: space-between; }`;

	const dStyle = document.createElement("style");
	dStyle.innerHTML = setStyle;
	document.head.appendChild(dStyle);
	const modal = document.createElement("div");
	modal.innerHTML = setModal;
	document.body.appendChild(modal);

	const checkboxList = document.querySelectorAll(".setting-item input");
	Array.from(checkboxList).forEach((checkbox) => {
		const nock = checkbox.getAttribute("aria-nock");
		checkbox.checked = GM_getValue(nock, true);
	});

	const showSetting = () => (document.querySelector(".modal-dialog").style.display = "block");
	const closeSetting = () => (document.querySelector(".modal-dialog").style.display = "none");

	document.querySelector(".modal-dialog").addEventListener("click", closeSetting);
	document.querySelector(".modal-setting").addEventListener("click", (e) => e.stopPropagation());
	document.querySelector(".btn-dialog-close").addEventListener("click", closeSetting);
	document.querySelector(".modal-body").addEventListener("click", (e) => {
		if (e.target.type !== "checkbox") {
			return;
		}
		const nock = e.target.getAttribute("aria-nock");
		const flag = GM_getValue(nock) == null ? false : !GM_getValue(nock);
		GM_setValue(nock, flag);
	});
	GM_registerMenuCommand("功能设置", showSetting);

	if (features.mark.datetime.enabled) {
		const datePublished = document.querySelector(features.mark.datetime.selector[0]);
		const jsonData = JSON.parse(
			document.querySelector(features.mark.datetime.selector[1])?.innerText ?? "{}"
		);
		const rawPublishedTime = datePublished.getAttribute("pubdate");
		const rawModifiedTime = jsonData?.upDate ?? rawPublishedTime;
		const postTime = new Date(rawPublishedTime).toLocaleString().replaceAll("/", "-");
		const updateTime = new Date(rawModifiedTime).toLocaleString().replaceAll("/", "-");
		const postTimeAgo = calculateTimeAgo(rawPublishedTime);
		const updateTimeAgo = calculateTimeAgo(rawModifiedTime);
		const formattedPostTime = `发布于 ${postTime}（${postTimeAgo}）`;
		const formattedUpdateTime = `编辑于 ${updateTime}（${updateTimeAgo}）`;
		const timeBlock = document.createElement("span");
		timeBlock.style.textDecoration = "underline";
		timeBlock.innerText = formattedPostTime;
		datePublished.style.display = "flex";
		datePublished.style.alignItems = "center";
		datePublished.style.cursor = "pointer";
		datePublished.innerHTML = features.mark.datetime.icon;
		datePublished.appendChild(timeBlock);
		datePublished.addEventListener("click", () => {
			const text =
				timeBlock.innerText == formattedPostTime ? formattedUpdateTime : formattedPostTime;
			timeBlock.innerText = text;
		});

		const icon = datePublished.querySelector("svg");
		icon.style.width = "14px";
		icon.style.height = "14px";
		icon.style.marginRight = "3px";
	}

	if (features.mark.readtime.enabled) {
		const timeItem = document.querySelector(features.mark.readtime.selector[0]);

		const readbox = document.createElement("span");
		const textCount = document.querySelector(features.mark.readtime.selector[1]).innerText.length;
		const readtime = textCount / 400;
		if (readtime >= 1440) {
			const days = Math.floor(readtime / 1440);
			readbox.innerHTML = `${features.mark.readtime.icon}<span> 预计阅读时长 ${days} 天</span>`;
		}

		if (readtime >= 60) {
			const hours = Math.floor(readtime / 60);
			const minutes = Math.floor(readtime % 60);
			readbox.innerHTML = `${features.mark.readtime.icon}<span> 预计阅读时长 ${hours} 小时 ${minutes} 分钟</span>`;
		}

		if (readtime >= 1) {
			const minutes = Math.round(readtime);
			readbox.innerHTML = `${features.mark.readtime.icon}<span> 预计阅读时长 ${minutes} 分钟</span>`;
		}

		if (readtime < 1) {
			const seconds = Math.round(readtime * 60);
			readbox.innerHTML = `${features.mark.readtime.icon}<span> 预计阅读时长 ${seconds} 秒</span>`;
		}
		readbox.style.textDecoration = "underline";
		readbox.style.display = "inline-flex";
		readbox.style.alignItems = "center";
		readbox.style.cursor = "pointer";
		readbox.addEventListener("click", () =>
			document.querySelector(features.mark.readtime.selector[1]).scrollIntoView(false)
		);

		const icon = readbox.querySelector("svg");
		icon.style.width = "14px";
		icon.style.height = "14px";
		icon.style.marginRight = "3px";

		timeItem.after(readbox);
	}

	if (features.allow_copy.enabled) {
		const observer = new MutationObserver(() => {
			const codeToolBar = document.querySelector(features.allow_copy.selector[0]);

			if (!codeToolBar) {
				return;
			}

			const article = document.querySelector(features.allow_copy.selector[1]);
			article.querySelectorAll("*").forEach((content) => {
				content.oncopy = (e) => e.stopPropagation();
				content.onkeydown = (e) => e.stopPropagation();
			});
			observer.disconnect();
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (features.allow_copy_with_btn.enabled) {
		console.log("object");
		const observer = new MutationObserver(() => {
			const copyBtns = document.querySelectorAll(features.allow_copy_with_btn.selector[0]);

			if (copyBtns.length == 0) {
				return;
			}

			copyBtns.forEach((btn) => {
				btn.innerText = "复制";
				btn.addEventListener("click", (e) => {
					e.stopPropagation();
					const codeBlock = e.target.parentNode.parentNode;
					const code = codeBlock.querySelector(features.allow_copy_with_btn.selector[1]);
					navigator.clipboard.writeText(code.innerText);
					btn.innerText = "已复制";
					setTimeout(() => (btn.innerText = "复制"), 1000);
				});
			});

			observer.disconnect();
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	const hiddenStyle = document.createElement("style");
	document.head.appendChild(hiddenStyle);

	Object.entries(features.hidden).forEach(([key, option]) => {
		if (option.enabled) {
			const cssRule = `${option.selector} { display: none !important; }`;
			hiddenStyle.sheet.insertRule(cssRule);
		}
	});

	if (features.special_hidden.first_publish_tips.enabled) {
		const tipItem = document.querySelector(features.special_hidden.first_publish_tips.selector[1]);
		tipItem.style.display = "none";
		const cssRule = `${features.special_hidden.first_publish_tips.selector[0]}{ visibility: visible !important; }`;
		hiddenStyle.sheet.insertRule(cssRule);
	}

	function calculateTimeAgo(datetime) {
		const SECOND = 1000;
		const MINUTE = 60 * SECOND;
		const HOUR = 60 * MINUTE;
		const DAY = 24 * HOUR;
		const MONTH = 30 * DAY;
		const YEAR = 12 * MONTH;

		const postDate = new Date(datetime);
		const currentDate = new Date();
		const timeDiff = currentDate - postDate;

		if (timeDiff >= YEAR) {
			return Math.floor(timeDiff / YEAR) + " 年前";
		}
		if (timeDiff >= MONTH) {
			return Math.floor(timeDiff / MONTH) + " 个月前";
		}
		if (timeDiff >= DAY) {
			return Math.floor(timeDiff / DAY) + " 天前";
		}
		if (timeDiff >= HOUR) {
			return Math.floor(timeDiff / HOUR) + " 小时前";
		}
		if (timeDiff >= MINUTE) {
			return Math.floor(timeDiff / MINUTE) + " 分钟前";
		}
		return Math.floor(timeDiff / SECOND) + " 秒前";
	}
})();
