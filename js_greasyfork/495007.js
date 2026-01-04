// ==UserScript==
// @name         TencentCloudDeveloperNock
// @namespace    https://github.com/Exisi/BlogNock
// @version      0.0.8
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock 系列，腾讯云开发者社区文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://cloud.tencent.com/developer/article/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/495007/TencentCloudDeveloperNock.user.js
// @updateURL https://update.greasyfork.org/scripts/495007/TencentCloudDeveloperNock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: ["meta[name='subjectTime'", ".mod-article-content .date-text"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: [".mod-content", ".mod-article-content .date-text"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M368 48h4c6.6 0 12-5.4 12-12V12c0-6.6-5.4-12-12-12H12C5.4 0 0 5.4 0 12v24c0 6.6 5.4 12 12 12h4c0 80.6 32.2 165.8 97.2 208C47.9 298.4 16 383.9 16 464h-4c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12v-24c0-6.6-5.4-12-12-12h-4c0-80.6-32.2-165.8-97.2-208C336.1 213.6 368 128.1 368 48zM64 48h256c0 101.6-57.3 184-128 184S64 149.6 64 48zm256 416H64c0-101.6 57.3-184 128-184s128 82.4 128 184z"/></svg>`,
			},
		},
		sleep: {
			left_emoji_animation: {
				enabled: GM_getValue("left_emoji_animation", true),
				selector: [".cdc-suspend-pill .emoji-item-icon"],
			},
		},
		hidden: {
			day_loading_activity_modal: {
				enabled: GM_getValue("day_loading_activity_modal", true),
				selector: [
					".cdc-portal-wrapper:has(.mod-activity)",
					".cdc-portal-wrapper:has(.cdc-activity-modal)",
				],
			},
			top_product_ad_pic: {
				enabled: GM_getValue("top_product_ad_pic", true),
				selector: [".cdc-top-ad"],
			},
			top_activity_ad_pic: {
				enabled: GM_getValue("top_activity_ad_pic", true),
				selector: ["#private-domain-aside"],
			},
			right_coupon_action_btn: {
				enabled: GM_getValue("right_coupon_action_btn", true),
				selector: [".cdc-widget-global__btn:has(.cdc-widget-global__btn-tag)"],
			},
			right_pic_ad: {
				enabled: GM_getValue("right_pic_ad", true),
				selector: [
					".cdc-commercial-card:has(.cdc-commercial-card__img)",
					".cdc-commercial-card:has(img[class*='ad-image'])",
				],
			},
			right_qrcode_group_ad: {
				enabled: GM_getValue("right_qrcode_group_ad", true),
				selector: [".cdc-commercial-card.mod-group-card"],
			},
			right_related_product_and_service: {
				enabled: GM_getValue("right_related_product_and_service", true),
				selector: [".cdc-mod-product2:has(.cdc-product-info2__list)"],
			},
		},
	};

	const setModal = `<div class="modal-dialog"><div class="modal-setting"onclick="event.cancelBubble=!0"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间优化</span><span><input aria-nock="datetime"id="feature-mark-datetime"type="checkbox"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>文章阅读时长</span><span><input aria-nock="readtime"id="feature-mark-readtime"type="checkbox"/><label for="feature-mark-readtime"></label></span></div><hr/><div class="setting-item"><span>停止文章左侧按钮图标动画</span><span><input aria-nock="left_emoji_animation"id="feature-sleep-left-emoji-animation"type="checkbox"/><label for="feature-sleep-left-emoji-animation"></label></span></div><hr/><div class="setting-item"><span>隐藏每日活动提示的模态框</span><span><input aria-nock="day_loading_activity_modal"id="feature-hidden-day-loading-activity-modal"type="checkbox"/><label for="feature-hidden-day-loading-activity-modal"></label></span></div><div class="setting-item"><span>隐藏顶部产品广告图片</span><span><input aria-nock="top_product_ad_pic"id="feature-hidden-top-product-ad-pic"type="checkbox"/><label for="feature-hidden-top-product-ad-pic"></label></span></div><div class="setting-item"><span>隐藏顶部活动广告图片</span><span><input aria-nock="top_activity_ad_pic"id="feature-hidden-top-activity-ad-pic"type="checkbox"/><label for="feature-hidden-top-activity-ad-pic"></label></span></div><div class="setting-item"><span>隐藏右侧领券操作按钮</span><span><input aria-nock="right_coupon_action_btn"id="feature-hidden-right-coupon-action-btn"type="checkbox"/><label for="feature-hidden-right-coupon-action-btn"></label></span></div><div class="setting-item"><span>隐藏右侧群二维码广告</span><span><input aria-nock="right_qrcode_group_ad"id="feature-hidden-right-qrcode-group-ad"type="checkbox"/><label for="feature-hidden-right-qrcode-group-ad"></label></span></div><div class="setting-item"><span>隐藏右侧图片广告</span><span><input aria-nock="right_pic_ad"id="feature-hidden-right-pic-ad"type="checkbox"/><label for="feature-hidden-right-pic-ad"></label></span></div><div class="setting-item"><span>隐藏右侧相关产品和服务</span><span><input aria-nock="right_related_product_and_service"id="feature-hidden-right-related-product-and-service"type="checkbox"/><label for="feature-hidden-right-related-product-and-service"></label></span></div></div></div></div>`;
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
		const datePublished = document.querySelector(features.mark.datetime.selector[0]);
		const dateModified = document.querySelector(features.mark.datetime.selector[1]).parentElement;

		const regex = /\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}/g;
		let rawPostTime = datePublished.getAttribute("content");
		let rawUpdateTime = dateModified.innerText.match(regex)[0];

		[rawPostTime, rawUpdateTime] = [rawPostTime, rawUpdateTime].sort(
			(a, b) => new Date(a) - new Date(b)
		);

		const postTimeAgo = calculateTimeAgo(rawPostTime);
		const updateTimeAgo = calculateTimeAgo(rawUpdateTime);

		const formattedPostTime = `发布于 ${rawPostTime}（${postTimeAgo}）`;
		const formattedUpdateTime = `编辑于 ${rawUpdateTime}（${updateTimeAgo}）`;

		const timeBlock = document.createElement("span");
		timeBlock.innerText = formattedPostTime;
		timeBlock.style.fontSize = "12px";

		dateModified.innerHTML = `<span style="display:flex;align-items:center">${features.mark.datetime.icon}</span>`;
		dateModified.appendChild(timeBlock);
		dateModified.style.textDecoration = "underline";
		dateModified.style.display = "flex";
		dateModified.style.alignItems = "center";

		dateModified.addEventListener("click", () => {
			const text =
				timeBlock.innerText == formattedPostTime ? formattedUpdateTime : formattedPostTime;
			timeBlock.innerHTML = text;
		});

		const icon = dateModified.querySelector("svg");
		icon.style.width = "12px";
		icon.style.height = "12px";
		icon.style.marginRight = "5px";
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
		icon.style.width = "12px";
		icon.style.height = "12px";
		icon.style.marginRight = "5px";
		readbox.style.fontSize = "12px";
		readbox.style.cursor = "pointer";
		readbox.style.color = "#4b5b76";
		readbox.style.textDecoration = "underline";
		readbox.addEventListener("click", () => article.scrollIntoView(false));

		const toolbar = document.querySelector(features.mark.readtime.selector[1]).parentElement
			.parentElement;
		toolbar.appendChild(readbox);
	}

	if (features.sleep.left_emoji_animation.enabled) {
		const animationStyle = document.createElement("style");
		document.head.appendChild(animationStyle);

		const cssRule = `${features.sleep.left_emoji_animation.selector[0]} { animation : none !important; }`;
		animationStyle.sheet.insertRule(cssRule);
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
