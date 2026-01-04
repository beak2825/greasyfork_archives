// ==UserScript==
// @name         OSChinaNock-Q
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock 系列，开源中国（OSChina）问答的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://www.oschina.net/question/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/495398/OSChinaNock-Q.user.js
// @updateURL https://update.greasyfork.org/scripts/495398/OSChinaNock-Q.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: ["meta[property='bytedance:published_time']", ".meta-wrap .item"],
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" transform="matrix(0 1 1 0 0 2)"><!--!System UIcons by @CoreyGinnivan - https://systemuicons.com/ License - Unlicense license Copyright 2020 CoreyGinnivan--><path d="m8.54949429 2.5c-2.77910025-.01404818-5.48733216 1.42226095-6.97636172 4.0013358-2.209139 3.826341-.89813776 8.7190642 2.92820323 10.9282032s8.7190642.8981378 10.9282032-2.9282032.8981378-8.71906423-2.9282032-10.92820323" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" stroke-linejoin="round"/><path d="m11.5 2.5-3 2.5v-5z" fill="currentColor" fill-rule="nonzero" stroke-width="1.8"/><path d="m4.5 10.5h5v3" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" stroke-linejoin="round"/></g></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: ["#articleContent", ".meta-wrap"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M368 48h4c6.6 0 12-5.4 12-12V12c0-6.6-5.4-12-12-12H12C5.4 0 0 5.4 0 12v24c0 6.6 5.4 12 12 12h4c0 80.6 32.2 165.8 97.2 208C47.9 298.4 16 383.9 16 464h-4c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12v-24c0-6.6-5.4-12-12-12h-4c0-80.6-32.2-165.8-97.2-208C336.1 213.6 368 128.1 368 48zM64 48h256c0 101.6-57.3 184-128 184S64 149.6 64 48zm256 416H64c0-101.6 57.3-184 128-184s128 82.4 128 184z"/></svg>`,
			},
		},
		hidden: {
			article_content_top_ad: {
				enabled: GM_getValue("article_content_top_ad", true),
				selector: ["#articleContent .ad-wrap", ".question-main .ad-wrap"],
			},
			right_sidebar_popular_info: {
				enabled: GM_getValue("right_popular_info", true),
				selector: [".sidebar-section-list--compact:has(.new-other-list-news)"],
			},
			right_sidebar_popular_software: {
				enabled: GM_getValue("right_sidebar_popular_software", true),
				selector: [".sidebar-section-list--compact:has(.new-other-list-blog)"],
			},
			right_sidebar_bottom_pic_ad: {
				enabled: GM_getValue("right_sidebar_bottom_pic_ad", true),
				selector: [".question-sidebar .ad-wrap"],
			},
			right_qrcode_action_btn: {
				enabled: GM_getValue("right_qrcode_action_btn", true),
				selector: [".codeBlock"],
			},
		},
	};

	const setModal = `<div class="modal-dialog"><div class="modal-setting"onClick="event.cancelBubble = true"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间优化</span><span><input type="checkbox"id="feature-mark-datetime"aria-nock="datetime"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>文章阅读时长</span><span><input type="checkbox"id="feature-mark-readtime"aria-nock="readtime"/><label for="feature-mark-readtime"></label></span></div><hr/><div class="setting-item"><span>隐藏文章正文顶部广告</span><span><input type="checkbox"id="feature-hidden-article-content-top-ad"aria-nock="article_content_top_ad"/><label for="feature-hidden-article-content-top-ad"></label></span></div><div class="setting-item"><span>隐藏右侧热门资讯</span><span><input type="checkbox"id="feature-hidden-right-popular-info"aria-nock="right_popular_info"/><label for="feature-hidden-right-popular-info"></label></span></div><div class="setting-item"><span>隐藏右侧热门软件</span><span><input type="checkbox"id="feature-hidden-right-sidebar-popular-software"aria-nock="right_sidebar_popular_software"/><label for="feature-hidden-right-sidebar-popular-software"></label></span></div><div class="setting-item"><span>隐藏右侧底部图片广告</span><span><input type="checkbox"id="feature-hidden-right-sidebar-bottom-pic-ad"aria-nock="right_sidebar_bottom_pic_ad"/><label for="feature-hidden-right-sidebar-bottom-pic-ad"></label></span></div><div class="setting-item"><span>隐藏右侧二维码操作按钮</span><span><input type="checkbox"id="feature-hidden-right-qrcode-action-btn"aria-nock="right_qrcode_action_btn"/><label for="feature-hidden-right-qrcode-action-btn"></label></span></div></div></div></div>`;
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
		const publishedTime = document.querySelector(features.mark.datetime.selector[0]);
		let postTime = publishedTime.getAttribute("content");
		postTime = new Date(postTime).toLocaleString().replaceAll("/", "-");
		const postTimeAgo = calculateTimeAgo(postTime);
		const formattedPostTime = `发布于 ${postTime}（${postTimeAgo}）`;

		const timeBlock = document.createElement("span");
		timeBlock.innerText = formattedPostTime;
		timeBlock.style.textDecoration = "underline";

		const postTimeItem = document.querySelector(features.mark.datetime.selector[1]);
		const authorBlock = postTimeItem.querySelector("a");
		postTimeItem.innerHTML = null;
		postTimeItem.appendChild(authorBlock);
		postTimeItem.parentNode.style.display = "inline-flex";

		const timeItem = document.createElement("div");
		timeItem.innerHTML = features.mark.datetime.icon;
		timeItem.appendChild(timeBlock);
		timeItem.className = "item";
		timeItem.style.display = "inline-flex";
		timeItem.style.alignItems = "center";

		postTimeItem.after(timeItem);
		const icon = timeItem.querySelector("svg");
		icon.style.width = "15px";
		icon.style.height = "15px";
		icon.style.marginRight = "5px";
	}

	if (features.mark.readtime.enabled) {
		const readbox = document.createElement("div");
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
			readbox.innerHTML = `${features.mark.readtime.icon}<span> 预计阅读时长 ${hours} 小时 ${minutes} 分钟</sp>`;
		}
		if (readtime >= 1) {
			const minutes = Math.round(readtime);
			readbox.innerHTML = `${features.mark.readtime.icon}<span> 预计阅读时长 ${minutes} 分钟</sp>`;
		}
		if (readtime < 1) {
			const seconds = Math.round(readtime * 60);
			readbox.innerHTML = `${features.mark.readtime.icon}<span> 预计阅读时长 ${seconds} 秒</span>`;
		}
		readbox.className = "item";
		readbox.style.fontSize = "14px";
		readbox.style.cursor = "pointer";
		readbox.style.display = "inline-flex";
		readbox.style.alignItems = "center";
		readbox.style.textDecoration = "underline";
		readbox.addEventListener("click", () => article.scrollIntoView(false));
		document.querySelector(features.mark.readtime.selector[1]).appendChild(readbox);

		const icon = readbox.querySelector("svg");
		icon.style.width = "13px";
		icon.style.height = "13px";
		icon.style.marginRight = "5px";
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
})();
