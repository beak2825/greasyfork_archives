// ==UserScript==
// @name         SegmentFaultNock
// @namespace    http://tampermonkey.net/
// @version      0.0.10
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock系列，思否文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://segmentfault.com/a/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494376/SegmentFaultNock.user.js
// @updateURL https://update.greasyfork.org/scripts/494376/SegmentFaultNock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			modified_history: {
				enabled: GM_getValue("modified_history", true),
				selector: ["time[itemprop='datePublished']"],
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" transform="matrix(0 1 1 0 0 2)"><!--!System UIcons by @CoreyGinnivan - https://systemuicons.com/ License - Unlicense license Copyright 2020 CoreyGinnivan--><path d="m8.54949429 2.5c-2.77910025-.01404818-5.48733216 1.42226095-6.97636172 4.0013358-2.209139 3.826341-.89813776 8.7190642 2.92820323 10.9282032s8.7190642.8981378 10.9282032-2.9282032.8981378-8.71906423-2.9282032-10.92820323" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" stroke-linejoin="round"/><path d="m11.5 2.5-3 2.5v-5z" fill="currentColor" fill-rule="nonzero" stroke-width="1.8"/><path d="m4.5 10.5h5v3" stroke="currentColor" stroke-linecap="round" stroke-width="1.8" stroke-linejoin="round"/></g></svg>`,
			},
			adjust_position: {
				enabled: GM_getValue("adjust_position", true),
				selector: ["time[itemprop='datePublished']"],
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><!--!System UIcons by @CoreyGinnivan - https://systemuicons.com/ License - Unlicense license Copyright 2020 CoreyGinnivan--><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" transform="translate(4 2)"><path d="m6.5 16.5407715.6311176-.7118691c.71585099-.8191184 1.36011688-1.5983525 1.93279767-2.3377022l.4733382-.6239608c1.97516433-2.6615039 2.96274653-4.77276704 2.96274653-6.33378943 0-3.33218241-2.6862915-6.03344997-6-6.03344997s-6 2.70126756-6 6.03344997c0 1.56102239.98758218 3.67228553 2.96274653 6.33378943l.4733382.6239608c.73630387.9505925 1.5909423 1.9671163 2.56391527 3.0495713z"/><circle cx="6.5" cy="6.5" r="2.5"/></g></svg>`,
			},
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: ["time[itemprop='datePublished']", "script[type='application/ld+json']"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: ["time[itemprop='datePublished']", "article"],
			},
		},
		hidden: {
			sidebar_image_ad: {
				enabled: GM_getValue("hidden_sidebar_image_ad", true),
				selector: ["div[class^='OA_holder']:has(img)"],
			},
		},
	};

	const setModal = `<div class="nock-modal-dialog"> <div class="modal-setting" onClick="event.cancelBubble = true"> <div class="modal-header"> <h3>功能设置</h3> <span class="btn-dialog-close">×</span> </div> <div class="modal-body"> <div class="setting-item"> <span> 文章显示时间优化 </span> <span> <input type="checkbox" id="feature-mark-datetime" aria-nock="datetime" /> <label for="feature-mark-datetime"></label> </span> </div> <div class="setting-item"> <span> 显示历史修改</span> <span> <input type="checkbox" id="feature-mark-modified-history" aria-nock="modified_history" /> <label for="feature-mark-modified-history"></label> </span> </div> <div class="setting-item"> <span> 定位文字调整 </span> <span> <input type="checkbox" id="feature-mark-adjust-position" aria-nock="adjust_position" /> <label for="feature-mark-adjust-position"></label> </span> </div> <div class="setting-item"> <span> 点击文章阅读时长跳转文章底部 </span> <span> <input type="checkbox" id="feature-mark-readtime" aria-nock="readtime" /> <label for="feature-mark-readtime"></label> </span> </div> <div class="setting-item"> <span> 隐藏右侧图片广告 </span> <span> <input type="checkbox" id="feature-hidden-sidebar-image-ad" aria-nock="hidden_sidebar_image_ad" /> <label for="feature-hidden-sidebar-image-ad"></label> </span> </div> </div> </div> </div>`;
	const setStyle = `@keyframes fall { 0% { transform: translate(0%, -100%); opacity: 0; } 100% { transform: translate(0%, 0%); opacity: 1; } } .setting-item input[type=checkbox] { height: 0; width: 0; display: none; } .setting-item label { cursor: pointer; text-indent: -9999px; width: 40px; height: 20px; background: pink; display: block; border-radius: 100px; position: relative; } .setting-item label:after { content: ''; position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; background: #fff; border-radius: 90px; transition: 0.2s; } .setting-item input:checked+label { background: #57a; } .setting-item input:checked+label:after { left: calc(100% - 2px); transform: translateX(-100%); } .setting-item label:active:after { width: 28px; } .nock-modal-dialog { pointer-events: auto !important; display:none; border: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; min-width: 100vw; min-height: 100vh; height: 100%; background-color: rgba(0, 0, 0, 0.4); } .modal-setting { width: 450px; margin: auto; background-color: #ffffff; border-radius: 5px; padding: 20px; margin-top: 40px; position: relative; box-sizing: border-box; animation: fall 0.5s ease-in-out; } .modal-header { border-bottom: 1px solid #000000; } .modal-header h3 { padding: 10px 0; margin: 0; } .modal-header span { font-size: 24px; color: #ccc; position: absolute; right: 5px; top: 0; cursor: pointer; } .setting-item { margin: 10px 0; display: flex; justify-content: space-between; }`;

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

	const showSetting = () => (document.querySelector(".nock-modal-dialog").style.display = "block");
	const closeSetting = () => (document.querySelector(".nock-modal-dialog").style.display = "none");

	document.querySelector(".nock-modal-dialog").addEventListener("click", closeSetting);
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

	if (features.mark.modified_history.enabled) {
		const datePublished = document.querySelector(features.mark.datetime.selector[0]);
		const datetimeItem = datePublished.parentNode;
		const history = document.createElement("a");
		history.innerHTML = `${features.mark.modified_history.icon}<span>历史修改</span>`;
		history.style.cursor = "pointer";
		history.style.marginLeft = "10px";
		history.style.color = "rgba(108, 117, 125)";
		history.style.display = "flex";
		history.style.alignItems = "center";
		history.addEventListener("click", () => {
			document.querySelectorAll(features.mark.modified_history.selector[0])[1].click();
		});
		datetimeItem.before(history);

		const icon = history.querySelector("svg");
		icon.style.width = "17px";
		icon.style.height = "17px";
		icon.style.marginRight = "3px";
	}

	if (
		features.mark.adjust_position.enabled &&
		document.querySelector(features.mark.adjust_position.selector[0]).nextSibling
	) {
		const time = document.querySelector(features.mark.adjust_position.selector[0]);
		const position = time.nextSibling;
		const positionBox = document.createElement("a");

		positionBox.style.display = "flex";
		positionBox.style.alignItems = "center";
		positionBox.style.marginLeft = "10px";
		positionBox.style.color = "rgba(108, 117, 125)";
		positionBox.innerHTML = features.mark.adjust_position.icon;
		positionBox.appendChild(position);
		const icon = positionBox.querySelector("svg");
		icon.style.width = "16px";
		icon.style.height = "16px";
		time.parentNode.after(positionBox);
	}

	if (features.mark.datetime.enabled) {
		const datePublished = document.querySelector(features.mark.datetime.selector[0]);

		const jsonData = JSON.parse(
			document.querySelector(features.mark.datetime.selector[1])?.innerText ?? "{}"
		);

		const rawPublishedTime = datePublished.getAttribute("datetime");
		const rawUpdatedTime = jsonData.dateModified ?? rawPublishedTime;

		const postTimeAgo = calculateTimeAgo(rawPublishedTime);
		const updateTimeAgo = calculateTimeAgo(rawUpdatedTime);

		const postTime = new Date(rawPublishedTime).toLocaleString().replaceAll("/", "-");
		const updateTime = new Date(rawUpdatedTime).toLocaleString().replaceAll("/", "-");

		const formattedPostTime = `发布于 ${postTime}（${postTimeAgo}）`;
		const formattedUpdateTime = `编辑于 ${updateTime}（${updateTimeAgo}）`;

		const datetimeItem = datePublished.parentNode;
		datetimeItem.innerHTML = features.mark.datetime.icon;

		datePublished.style.textDecoration = "underline";
		datePublished.innerHTML = formattedPostTime;

		datetimeItem.style.display = "flex";
		datetimeItem.style.alignItems = "center";
		datetimeItem.appendChild(datePublished);
		datetimeItem.addEventListener("click", (e) => {
			e.preventDefault();
			const text =
				datePublished.innerText == formattedPostTime ? formattedUpdateTime : formattedPostTime;
			datePublished.innerText = text;
		});

		const icon = datetimeItem.querySelector("svg");
		icon.style.width = "16px";
		icon.style.height = "15px";
		icon.style.marginRight = "3px";

		datePublished.closest("div").style.flexWrap = "wrap";
	}

	if (features.mark.readtime.enabled) {
		const time = document.querySelector(features.mark.readtime.selector[0]);
		const article = document.querySelector(features.mark.readtime.selector[1]);
		const readtime = time.closest("div").lastChild;
		readtime.lastChild.style.textDecoration = "underline";
		readtime.style.cursor = "pointer";
		readtime.addEventListener("click", () => article.scrollIntoView(false));
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
