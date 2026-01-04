// ==UserScript==
// @name         AliyunCloudDeveloperNock
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock 系列，阿里云开发者社区文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://developer.aliyun.com/article/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/495367/AliyunCloudDeveloperNock.user.js
// @updateURL https://update.greasyfork.org/scripts/495367/AliyunCloudDeveloperNock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: ["meta[name='last-modified']", ".article-info-time"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>`,
			},
			position: {
				enabled: GM_getValue("position", true),
				selector: [".personal-ip-text", ".personal-ip-box"],
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><!--!System UIcons by @CoreyGinnivan - https://systemuicons.com/ License - Unlicense license Copyright 2020 CoreyGinnivan--><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" transform="translate(4 2)"><path d="m6.5 16.5407715.6311176-.7118691c.71585099-.8191184 1.36011688-1.5983525 1.93279767-2.3377022l.4733382-.6239608c1.97516433-2.6615039 2.96274653-4.77276704 2.96274653-6.33378943 0-3.33218241-2.6862915-6.03344997-6-6.03344997s-6 2.70126756-6 6.03344997c0 1.56102239.98758218 3.67228553 2.96274653 6.33378943l.4733382.6239608c.73630387.9505925 1.5909423 1.9671163 2.56391527 3.0495713z"/><circle cx="6.5" cy="6.5" r="2.5"/></g></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: [".article-content", ".article-info-left"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M368 48h4c6.6 0 12-5.4 12-12V12c0-6.6-5.4-12-12-12H12C5.4 0 0 5.4 0 12v24c0 6.6 5.4 12 12 12h4c0 80.6 32.2 165.8 97.2 208C47.9 298.4 16 383.9 16 464h-4c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12v-24c0-6.6-5.4-12-12-12h-4c0-80.6-32.2-165.8-97.2-208C336.1 213.6 368 128.1 368 48zM64 48h256c0 101.6-57.3 184-128 184S64 149.6 64 48zm256 416H64c0-101.6 57.3-184 128-184s128 82.4 128 184z"/></svg>`,
			},
		},
		unfixed_article_action_bar: {
			enabled: GM_getValue("unfixed_article_action_bar", true),
			selector: [".left-content .aigc-fixed"],
		},
		back_to_top_action_btn: {
			enabled: GM_getValue("back_to_top_action_btn", true),
			icon: `<svg viewBox="0 0 1024 1024" focusable="false" class="" data-icon="caret-up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path></svg>`,
		},
		remove_right_action_ai_assistant: {
			enabled: GM_getValue("remove_right_action_ai_assistant", true),
			selector: [
				"div[data-spm='floating-toolbar']:has(div[class^='WidgetContent-aliyun-ai-assistant'])",
			],
		},
		hidden: {
			article_related_products: {
				enabled: GM_getValue("article_related_products", true),
				selector: [".free-product-content"],
			},
			right_related_product_box: {
				enabled: GM_getValue("right_related_product_box", true),
				selector: [".right-item-box.product-box"],
			},
			right_related_course_box: {
				enabled: GM_getValue("right_related_course_box", true),
				selector: [".right-item-box.course-box"],
			},
			right_related_book_box: {
				enabled: GM_getValue("right_related_book_box", true),
				selector: [".right-item-box.ebook-box"],
			},
			right_related_lab_course_box: {
				enabled: GM_getValue("right_related_lab_course_box", true),
				selector: [".right-item-box.lab-course-box"],
			},
		},
	};

	const setModal = `<div class="modal-dialog"><div class="modal-setting"onClick="event.cancelBubble = true"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间优化</span><span><input type="checkbox"id="feature-mark-datetime"aria-nock="datetime"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>文章位置图标</span><span><input type="checkbox"id="feature-mark-position"aria-nock="position"/><label for="feature-mark-position"></label></span></div><div class="setting-item"><span>文章阅读时长</span><span><input type="checkbox"id="feature-mark-readtime"aria-nock="readtime"/><label for="feature-mark-readtime"></label></span></div><div class="setting-item"><span>取消固定文章交互操作按钮</span><span><input type="checkbox"id="feature-unfixed-article-action-bar"aria-nock="unfixed_article_action_bar"/><label for="feature-unfixed-article-action-bar"></label></span></div><div class="setting-item"><span>显示返回顶部按钮</span><span><input type="checkbox"id="feature-back-to-top-action-btn"aria-nock="back_to_top_action_btn"/><label for="feature-back-to-top-action-btn"></label></span></div><hr/><div class="setting-item"><span>隐藏文章相关产品</span><span><input type="checkbox"id="feature-hidden-article-related-products"aria-nock="article_related_products"/><label for="feature-hidden-article-related-products"></label></span></div><div class="setting-item"><span>隐藏右侧相关产品</span><span><input type="checkbox"id="feature-hidden-right-related-product-box"aria-nock="right_related_product_box"/><label for="feature-hidden-right-related-product-box"></label></span></div><div class="setting-item"><span>隐藏右侧相关课程</span><span><input type="checkbox"id="feature-hidden-right-related-course-box"aria-nock="right_related_course_box"/><label for="feature-hidden-right-related-course-box"></label></span></div><div class="setting-item"><span>隐藏右侧相关电子书</span><span><input type="checkbox"id="feature-hidden-right-related-book-box"aria-nock="right_related_book_box"/><label for="feature-hidden-right-related-book-box"></label></span></div><div class="setting-item"><span>隐藏右侧相关实验场景</span><span><input type="checkbox"id="feature-hidden-right-related-lab-course-box"aria-nock="right_related_lab_course_box"/><label for="feature-hidden-right-related-lab-course-box"></label></span></div><div class="setting-item"><span>隐藏右下角AI助手</span><span><input type="checkbox"id="feature-remove-right-action-ai-assistant"aria-nock="remove_right_action_ai_assistant"/><label for="feature-remove-right-action-ai-assistant"></label></span></div></div></div></div>`;
	const setStyle = `@keyframes fall { 0% { transform: translate(0%, -100%); opacity: 0; } 100% { transform: translate(0%, 0%); opacity: 1; } } .setting-item input[type=checkbox] { height: 0; width: 0; display: none; } .setting-item label { cursor: pointer; text-indent: -9999px; width: 40px; height: 20px; background: pink; display: block; border-radius: 100px; position: relative; } .setting-item label:after { content: ''; position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; background: #fff; border-radius: 90px; transition: 0.2s; } .setting-item input:checked+label { background: #57a; } .setting-item input:checked+label:after { left: calc(100% - 2px); transform: translateX(-100%); } .setting-item label:active:after { width: 28px; } .modal-dialog { pointer-events: auto !important; display:none; border: none; position: fixed; z-index: 99999; left: 0; top: 0; width: 100%; min-width: 100vw; min-height: 100vh; height: 100%; background-color: rgba(0, 0, 0, 0.4); } .modal-setting { width: 450px; margin: auto; background-color: #ffffff; border-radius: 5px; padding: 20px; margin-top: 40px; position: relative; box-sizing: border-box; animation: fall 0.5s ease-in-out; } .modal-header { border-bottom: 1px solid #000000; } .modal-header h3 { padding: 10px 0; margin: 0; } .modal-header span { font-size: 24px; color: #ccc; position: absolute; right: 5px; top: 0; cursor: pointer; } .setting-item { margin: 10px 0; font-size: 14px; display: flex; justify-content: space-between; }`;

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
		const dateLastModified = document.querySelector(features.mark.datetime.selector[0]);

		const postTime = dateLastModified.getAttribute("content");
		const postTimeAgo = calculateTimeAgo(postTime);
		const formattedPostTime = `发布于 ${postTime}（${postTimeAgo}）`;

		const timeBlock = document.createElement("span");
		timeBlock.innerText = formattedPostTime;
		timeBlock.style.textDecoration = "underline";

		const postTimeItem = document.querySelector(features.mark.datetime.selector[1]);
		postTimeItem.innerHTML = features.mark.datetime.icon;
		postTimeItem.appendChild(timeBlock);
		postTimeItem.style.display = "flex";
		postTimeItem.style.alignItems = "center";

		const icon = postTimeItem.querySelector("svg");
		icon.style.width = "14px";
		icon.style.height = "14px";
		icon.style.marginRight = "5px";
	}

	if (features.mark.position.enabled) {
		const observer = new MutationObserver(() => {
			const positionBlock = document.querySelector(features.mark.position.selector[0]);

			if (!positionBlock) {
				return;
			}

			const positionItem = document.querySelector(features.mark.position.selector[1]);
			positionItem.innerHTML = features.mark.position.icon;
			positionItem.appendChild(positionBlock);
			positionItem.style.display = "flex";
			positionItem.style.alignItems = "center";

			const icon = positionItem.querySelector("svg");
			icon.style.width = "15px";
			icon.style.height = "15px";
			icon.style.marginRight = "5px";
			observer.disconnect();
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (features.remove_right_action_ai_assistant.enabled) {
		createObserver((observer) => {
			const aiBtn = document.querySelector(features.remove_right_action_ai_assistant.selector[0]);
			if (!aiBtn) {
				return;
			}
			console.log(aiBtn);

			aiBtn.style.display = "none";
			observer.disconnect();
		});
	}

	if (features.mark.readtime.enabled) {
		const readbox = document.createElement("span");
		readbox.style.display = "flex";
		readbox.style.alignItems = "center";
		readbox.style.marginLeft = "24px";
		const article = document.querySelector(features.mark.readtime.selector[0]);
		const textCount = article.innerText.length;
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
		const icon = readbox.querySelector("svg");
		icon.style.width = "13px";
		icon.style.height = "13px";
		icon.style.marginRight = "5px";
		readbox.style.fontSize = "14px";
		readbox.style.cursor = "pointer";
		readbox.style.textDecoration = "underline";
		readbox.addEventListener("click", () => article.scrollIntoView(false));
		document.querySelector(features.mark.readtime.selector[1]).appendChild(readbox);
	}

	if (features.unfixed_article_action_bar.enabled) {
		const actionBar = document.querySelector(features.unfixed_article_action_bar.selector[0]);
		actionBar.style.position = "unset";
	}

	if (features.back_to_top_action_btn.enabled) {
		const actionBtn = document.createElement("span");
		actionBtn.style.display = "flex";
		actionBtn.style.alignItems = "center";
		actionBtn.style.justifyContent = "center";
		actionBtn.style.borderRadius = "50%";
		actionBtn.style.padding = "14px";
		actionBtn.style.backgroundColor = "#ffffff";
		actionBtn.style.color = "#8c8c8c";
		actionBtn.style.cursor = "pointer";
		actionBtn.style.position = "fixed";
		actionBtn.style.right = "25px";
		actionBtn.style.bottom = "155px";
		actionBtn.style.zIndex = "1000";
		actionBtn.style.boxShadow = "0 1px 7px #0000001c";
		actionBtn.innerHTML = features.back_to_top_action_btn.icon;
		actionBtn.addEventListener("click", () => window.scrollTo(0, 0));
		document.body.appendChild(actionBtn);

		const icon = actionBtn.querySelector("svg");
		icon.style.width = "20px";
		icon.style.height = "20px";
	}

	const hiddenStyle = document.createElement("style");
	document.head.appendChild(hiddenStyle);

	Object.entries(features.hidden).forEach(([key, option]) => {
		if (option.enabled) {
			const cssRule = `${option.selector} { display: none !important; }`;
			hiddenStyle.sheet.insertRule(cssRule);
		}
	});

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

	function createObserver(callback) {
		const observer = new MutationObserver(() => callback(observer));
		observer.observe(document.body, { childList: true, subtree: true });
	}
})();
