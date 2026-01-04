// ==UserScript==
// @name         CnBlogsNock
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock系列，博客园文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://www.cnblogs.com/*/p/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494487/CnBlogsNock.user.js
// @updateURL https://update.greasyfork.org/scripts/494487/CnBlogsNock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: ["#post-date", ".postTitle"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M256 8C119 8 8 119 8 256S119 504 256 504 504 393 504 256 393 8 256 8zm92.5 313h0l-20 25a16 16 0 0 1 -22.5 2.5h0l-67-49.7a40 40 0 0 1 -15-31.2V112a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16V256l58 42.5A16 16 0 0 1 348.5 321z"/></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: ["#cnblogs_post_body"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M360 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24 0 91 51 167.7 120.8 192C75 280.3 24 357 24 448c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24v-16c0-13.3-10.7-24-24-24 0-91-51-167.7-120.8-192C309 231.7 360 155 360 64c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24zm-64 448H88c0-77.5 46.2-144 104-144 57.8 0 104 66.5 104 144z"/></svg>`,
			},
		},
		action: {
			back_to_top_btn: {
				enabled: GM_getValue("back_to_top_btn", true),
				icon: `<svg viewBox="0 0 1024 1024" focusable="false" class="" data-icon="caret-up" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"></path></svg>`,
			},
			comment_btn: {
				enabled: GM_getValue("comment_btn", true),
				selector: ["#comment_form"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -40 552 552"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>`,
			},
			collect_btn: {
				enabled: GM_getValue("collect_btn", true),
				selector: ["#green_channel_favorite"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>`,
			},
			thumbs_up_btn: {
				enabled: GM_getValue("thumbs_up_btn", true),
				selector: ["#div_digg .diggit"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 552 552"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M104 224H24c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V248c0-13.3-10.7-24-24-24zM64 472c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zM384 81.5c0 42.4-26 66.2-33.3 94.5h101.7c33.4 0 59.4 27.7 59.6 58.1 .1 17.9-7.5 37.2-19.4 49.2l-.1 .1c9.8 23.3 8.2 56-9.3 79.5 8.7 25.9-.1 57.7-16.4 74.8 4.3 17.6 2.2 32.6-6.1 44.6C440.2 511.6 389.6 512 346.8 512l-2.8 0c-48.3 0-87.8-17.6-119.6-31.7-16-7.1-36.8-15.9-52.7-16.2-6.5-.1-11.8-5.5-11.8-12v-213.8c0-3.2 1.3-6.3 3.6-8.5 39.6-39.1 56.6-80.6 89.1-113.1 14.8-14.8 20.2-37.2 25.4-58.9C282.5 39.3 291.8 0 312 0c24 0 72 8 72 81.5z"/></svg>`,
			},
		},
		hidden: {
			bottom_tips: {
				enabled: GM_getValue("hidden_bottom_tips", true),
				selector: [".charm-bar-wrapper"],
			},
		},
	};

	const setModal = `<div class="modal-dialog"><div class="modal-setting"onClick="event.cancelBubble = true"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间提升</span><span><input type="checkbox"id="feature-mark-datetime"aria-nock="datetime"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>文章阅读时长</span><span><input type="checkbox"id="feature-mark-readtime"aria-nock="readtime"/><label for="feature-mark-readtime"></label></span></div><div class="setting-item"><span>右侧推荐按钮</span><span><input type="checkbox"id="feature-action-thumbs-up-btn"aria-nock="thumbs_up_btn"/><label for="feature-action-thumbs-up-btn"></label></span></div><div class="setting-item"><span>右侧收藏按钮</span><span><input type="checkbox"id="feature-action-collect-btn"aria-nock="collect_btn"/><label for="feature-action-collect-btn"></label></span></div><div class="setting-item"><span>右侧评论跳转按钮</span><span><input type="checkbox"id="feature-action-comment-btn"aria-nock="comment_btn"/><label for="feature-action-comment-btn"></label></span></div><div class="setting-item"><span>右侧回到顶部按钮</span><span><input type="checkbox"id="feature-action-back-to-top-btn"aria-nock="back_to_top_btn"/><label for="feature-action-back-to-top-btn"></label></span></div><hr/><div class="setting-item"><span>隐藏底部文字推广</span><span><input type="checkbox"id="feature-hidden-bottom-tips"aria-nock="hidden_bottom_tips"/><label for="feature-hidden-bottom-tips"></label></span></div></div></div></div>`;
	const setStyle = `@keyframes fall { 0% { transform: translate(0%, -100%); opacity: 0; } 100% { transform: translate(0%, 0%); opacity: 1; } } .setting-item input[type=checkbox] { height: 0; width: 0; display: none; } .setting-item label { cursor: pointer; text-indent: -9999px; width: 40px; height: 20px; background: pink; display: block; border-radius: 100px; position: relative; } .setting-item label:after { content: ''; position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; background: #fff; border-radius: 90px; transition: 0.2s; } .setting-item input:checked+label { background: #57a; } .setting-item input:checked+label:after { left: calc(100% - 2px); transform: translateX(-100%); } .setting-item label:active:after { width: 28px; } .modal-dialog { display:none; border: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; min-width: 100vw; min-height: 100vh; height: 100%; background-color: rgba(0, 0, 0, 0.4); } .modal-setting { width: 450px; margin: auto; background-color: #ffffff; border-radius: 5px; padding: 20px; margin-top: 40px; position: relative; box-sizing: border-box; animation: fall 0.5s ease-in-out; } .modal-header { border-bottom: 1px solid #000000; } .modal-header h3 { padding: 10px 0; margin: 0; } .modal-header span { font-size: 24px; color: #ccc; position: absolute; right: 5px; top: 0; cursor: pointer; } .setting-item { margin: 10px 0; display: flex; justify-content: space-between; }`;

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

	const postMessageBlock = document.createElement("div");
	postMessageBlock.style.margin = "10px 0";
	postMessageBlock.style.display = "flex";
	postMessageBlock.style.alignItems = "center";
	postMessageBlock.style.gap = "5px";

	const actionBar = document.createElement("div");
	actionBar.style.display = "flex";
	actionBar.style.flexDirection = "column-reverse";
	actionBar.style.position = "fixed";
	actionBar.style.bottom = "30px";
	actionBar.style.right = "30px";
	actionBar.style.gap = "10px";
	actionBar.style.fontSize = "18px";
	actionBar.style.width = "38px";

	if (features.mark.datetime.enabled) {
		const postDate = document.querySelector(features.mark.datetime.selector[0]);
		const rawPostTime = postDate.innerText;
		const rawUpdateTime = postDate.getAttribute("data-date-updated") ?? rawPostTime;

		const postTimeAgo = calculateTimeAgo(rawPostTime);
		const updateTimeAgo = calculateTimeAgo(rawUpdateTime);

		const formattedPostTime = `发布于 ${rawPostTime}（${postTimeAgo}）`;
		const formattedUpdateTime = `编辑于 ${rawUpdateTime}（${updateTimeAgo}）`;

		const datetimeBox = document.createElement("span");
		datetimeBox.style.textDecoration = "underline";
		datetimeBox.style.display = "inline-flex";
		datetimeBox.style.alignItems = "center";
		datetimeBox.style.fontSize = "12px";
		datetimeBox.style.cursor = "pointer";
		datetimeBox.innerHTML = `${features.mark.datetime.icon}`;

		const datetime = document.createElement("span");
		datetime.innerText = formattedPostTime;

		datetimeBox.appendChild(datetime);
		datetimeBox.addEventListener("click", () => {
			const text =
				datetime.innerText == formattedPostTime ? formattedUpdateTime : formattedPostTime;
			datetime.innerHTML = text;
		});

		const icon = datetimeBox.querySelector("svg");
		icon.style.width = "15px";
		icon.style.height = "15px";
		icon.style.marginRight = "5px";
		icon.style.color = "rgb(170, 170, 170)";

		postMessageBlock.appendChild(datetimeBox);
	}

	if (features.mark.readtime.enabled) {
		const readtimeBox = document.createElement("span");
		const article = document.querySelector(features.mark.readtime.selector[0]);
		const textCount = article.innerText.length;
		const readtime = textCount / 400;
		if (readtime >= 1440) {
			const days = Math.floor(readtime / 1440);
			readbox.innerHTML = `${features.mark.readtime.icon}<span>预计阅读时长 ${days} 天</span>`;
		}

		if (readtime >= 60) {
			const hours = Math.floor(readtime / 60);
			const minutes = Math.floor(readtime % 60);
			readtimeBox.innerHTML = `${features.mark.readtime.icon}<span>预计阅读时长 ${hours} 小时 ${minutes} 分钟</span>`;
		}

		if (readtime >= 1) {
			const minutes = Math.round(readtime);
			readtimeBox.innerHTML = `${features.mark.readtime.icon}<span>预计阅读时长 ${minutes} 分钟</span>`;
		}

		if (readtime < 1) {
			const seconds = Math.round(readtime * 60);
			readtimeBox.innerHTML = `${features.mark.readtime.icon}<span>预计阅读时长 ${seconds} 秒</span>`;
		}
		readtimeBox.style.textDecoration = "underline";
		readtimeBox.style.display = "inline-flex";
		readtimeBox.style.fontSize = "12px";
		readtimeBox.style.alignItems = "center";
		readtimeBox.style.cursor = "pointer";
		readtimeBox.addEventListener("click", () => article.scrollIntoView(false));

		const icon = readtimeBox.querySelector("svg");
		icon.style.width = "15px";
		icon.style.height = "14px";
		icon.style.marginRight = "5px";
		icon.style.color = "rgb(170, 170, 170)";

		postMessageBlock.appendChild(readtimeBox);
	}

	if (features.action.back_to_top_btn.enabled) {
		const toTopActionBtn = createActionBtn(features.action.back_to_top_btn.icon, () =>
			window.scrollTo(0, 0)
		);
		actionBar.appendChild(toTopActionBtn);
	}

	if (features.action.comment_btn.enabled) {
		const commentActionBtn = createActionBtn(features.action.comment_btn.icon, () =>
			document.querySelector(features.action.comment_btn.selector[0]).scrollIntoView(false)
		);
		actionBar.appendChild(commentActionBtn);
	}

	if (features.action.collect_btn.enabled) {
		const collectActionBtn = createActionBtn(features.action.collect_btn.icon, () =>
			document.querySelector(features.action.collect_btn.selector[0]).click()
		);
		actionBar.appendChild(collectActionBtn);
	}

	if (features.action.thumbs_up_btn.enabled) {
		const thumbsUpActionBtn = createActionBtn(features.action.thumbs_up_btn.icon, () =>
			document.querySelector(features.action.thumbs_up_btn.selector[0]).click()
		);
		actionBar.appendChild(thumbsUpActionBtn);
	}

	const postTitle = document.querySelector(features.mark.datetime.selector[1]);
	postTitle.after(postMessageBlock);

	document.body.appendChild(actionBar);
	window.addEventListener("scroll", () => {
		const scrollTop = document.documentElement.scrollTop;

		if (scrollTop === 0) {
			actionBar.style.opacity = 0;
			actionBar.style.display = "none";
		} else {
			actionBar.style.opacity = 1;
			actionBar.style.display = "flex";
		}
	});

	const hiddenStyle = document.createElement("style");
	document.head.appendChild(hiddenStyle);

	Object.entries(features.hidden).forEach(([key, option]) => {
		if (option.enabled) {
			const cssRule = `${option.selector} { display: none !important; }`;
			hiddenStyle.sheet.insertRule(cssRule);
		}
	});

	function createActionBtn(icon, callback) {
		const actionBtn = document.createElement("span");
		actionBtn.style.display = "flex";
		actionBtn.style.alignItems = "center";
		actionBtn.style.justifyContent = "center";
		actionBtn.style.borderRadius = "50%";
		actionBtn.style.padding = "10px";
		actionBtn.style.backgroundColor = "#ffffff";
		actionBtn.style.color = "#8c8c8c";
		actionBtn.style.cursor = "pointer";
		actionBtn.style.boxShadow = "0 1px 3px rgba(26, 26, 26, .2)";
		actionBtn.innerHTML = icon;
		actionBtn.addEventListener("click", () => callback());
		return actionBtn;
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
