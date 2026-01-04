// ==UserScript==
// @name         TencentCloudDeveloperNock-News
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock 系列，腾讯云开发者社区新闻的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://cloud.tencent.com/developer/news/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/523033/TencentCloudDeveloperNock-News.user.js
// @updateURL https://update.greasyfork.org/scripts/523033/TencentCloudDeveloperNock-News.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: [
					"meta[name='subjectTime'",
					".article-source-item time[datetime]",
					".col-article-infos",
				],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"/></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: ["section.col-article .rno-markdown", ".mod-header__detail"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M368 48h4c6.6 0 12-5.4 12-12V12c0-6.6-5.4-12-12-12H12C5.4 0 0 5.4 0 12v24c0 6.6 5.4 12 12 12h4c0 80.6 32.2 165.8 97.2 208C47.9 298.4 16 383.9 16 464h-4c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12v-24c0-6.6-5.4-12-12-12h-4c0-80.6-32.2-165.8-97.2-208C336.1 213.6 368 128.1 368 48zM64 48h256c0 101.6-57.3 184-128 184S64 149.6 64 48zm256 416H64c0-101.6 57.3-184 128-184s128 82.4 128 184z"/></svg>`,
			},
		},
		auto: {
			redirect_origin: {
				enabled: GM_getValue("redirect_origin", true),
				selector: [".col-article-source li:has(.article-source-item)"],
			},
		},
		hidden: {
			top_product_ad_pic: {
				enabled: GM_getValue("top_product_ad_pic", true),
				selector: [".cdc-top-ad"],
			},
			top_activity_ad_pic: {
				enabled: GM_getValue("top_activity_ad_pic", true),
				selector: [".community-header-product-container"],
			},
			content_top_ad: {
				enabled: GM_getValue("content_top_ad", true),
				selector: ["#news-detail-content-product-container"],
			},
			right_qrcode_group_ad: {
				enabled: GM_getValue("right_qrcode_group_ad", true),
				selector: [".layout-side .com-group-card"],
			},
			right_qrcode_action_btn: {
				enabled: GM_getValue("right_qrcode_action_btn", true),
				selector: [".com-widget-global2__btn.code"],
			},
		},
	};

	const setModal = `<div class="modal-dialog"><div class="modal-setting"onClick="event.cancelBubble = true"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间优化</span><span><input type="checkbox"id="feature-mark-datetime"aria-nock="datetime"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>文章阅读时长</span><span><input type="checkbox"id="feature-mark-readtime"aria-nock="readtime"/><label for="feature-mark-readtime"></label></span></div><div class="setting-item"><span>自动源链重定向</span><span><input type="checkbox"id="feature-auto-redirect-origin"aria-nock="redirect_origin"/><label for="feature-auto-redirect-origin"></label></span></div><hr/><div class="setting-item"><span>隐藏顶部产品广告图片</span><span><input type="checkbox"id="feature-hidden-top-product-ad-pic"aria-nock="top_product_ad_pic"/><label for="feature-hidden-top-product-ad-pic"></label></span></div><div class="setting-item"><span>隐藏顶部活动广告图片</span><span><input type="checkbox"id="feature-hidden-top-activity-ad-pic"aria-nock="top_activity_ad_pic"/><label for="feature-hidden-top-activity-ad-pic"></label></span></div><div class="setting-item"><span>隐藏新闻内容顶部的广告图片</span><span><input type="checkbox"id="feature-hidden-content-top-ad"aria-nock="content_top_ad"/><label for="feature-hidden-content-top-ad"></label></span></div><div class="setting-item"><span>隐藏右侧群聊二维码</span><span><input type="checkbox"id="feature-hidden-qrcode-group-ad"aria-nock="right_qrcode_group_ad"/><label for="feature-hidden-qrcode-group-ad-ad"></label></span></div><div class="setting-item"><span>隐藏右侧扫码悬浮按钮</span><span><input type="checkbox"id="feature-hidden-right-qrcode-action-btn"aria-nock="right_qrcode_action_btn"/><label for="feature-hidden-right-qrcode-action-btn"></label></span></div></div></div></div>`;
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
	0;

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

	if (features.mark.datetime.enabled || features.mark.readtime.enabled) {
		const toolbar = document.createElement("div");
		toolbar.className = "nockToolbar";
		toolbar.style.marginBottom = "15px";
		toolbar.style.display = "flex";
		const anchor = document.querySelector(features.mark.datetime.selector[2]);
		anchor.after(toolbar);
	}

	if (features.mark.datetime.enabled) {
		const nockToolbar = document.querySelector(".nockToolbar");
		const datePublished = document.querySelector(features.mark.datetime.selector[0]);
		const dateModified = document.querySelector(features.mark.datetime.selector[1]);

		let rawPostTime = datePublished.getAttribute("content");
		let rawUpdateTime = dateModified.getAttribute("datetime");

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
		timeBlock.style.textDecoration = "underline";

		const dateBox = document.createElement("span");
		dateBox.innerHTML = `<span style="display:inline-flex;align-items:center">${features.mark.datetime.icon}</span>`;
		dateBox.style.display = "inline-flex";
		dateBox.style.alignItem = "center";
		dateBox.style.cursor = "pointer";
		dateBox.addEventListener("click", () => {
			const text =
				timeBlock.innerText == formattedPostTime ? formattedUpdateTime : formattedPostTime;
			timeBlock.innerHTML = text;
		});

		dateBox.append(timeBlock);
		nockToolbar.appendChild(dateBox);

		const icon = dateBox.querySelector("svg");
		icon.style.width = "12px";
		icon.style.height = "12px";
		icon.style.marginRight = "5px";
	}

	if (features.mark.readtime.enabled) {
		const readbox = document.createElement("span");
		Object.assign(readbox.style, {
			display: "flex",
			alignItems: "center",
			marginLeft: "15px",
			fontSize: "12px",
			cursor: "pointer",
			color: "#4b5b76",
			textDecoration: "underline",
		});

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

		Object.assign(icon.style, {
			width: "12px",
			height: "12px",
			marginRight: "5px",
		});

		readbox.addEventListener("click", () => article.scrollIntoView(false));
		document.querySelector(".nockToolbar").appendChild(readbox);
	}

	if (features.auto.redirect_origin.enabled) {
		const selector = features.auto.redirect_origin.selector[0];
		const anchor = document.querySelector(selector)?.nextElementSibling;

		if (anchor) {
			const rawOriginUrl = anchor.innerText ?? "";
			const urlRegex = /(http|https):\/\/[\w.-]+(?:\/[^\s]*)?/;
			const originUrl = rawOriginUrl.match(urlRegex)?.[0];

			if (originUrl) {
				const style = document.createElement("style");
				style.innerHTML = `
					@keyframes fadeIn {
						from { opacity: 0; transform: translateX(20px); }
						to { opacity: 1; transform: translateX(0); }
					}
					@keyframes fadeOut {
						from { opacity: 1; transform: translateX(0); }
						to { opacity: 0; transform: translateX(20px); }
					}
				`;
				document.head.appendChild(style);

				const countdownTips = document.createElement("div");
				Object.assign(countdownTips.style, {
					position: "fixed",
					top: "10px",
					right: "10px",
					padding: "15px",
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					color: "white",
					zIndex: "1000",
					borderRadius: "8px",
					boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
					fontFamily: "Arial, sans-serif",
					animation: "fadeIn 0.3s ease-out",
				});
				countdownTips.innerHTML = `
					<p style="margin: 0; font-size: 14px;">检测到源链接，<span id="countdown">5</span> 秒后跳转。</p>
					<button id="cancelButton" style="margin-top: 10px; padding: 5px 10px; background-color: #00a4ff; color: white; border: none; border-radius: 5px; cursor: pointer;">取消</button>
				`;
				document.body.appendChild(countdownTips);

				const progressBarContainer = document.createElement("div");
				Object.assign(progressBarContainer.style, {
					position: "fixed",
					top: "0",
					left: "0",
					width: "100%",
					height: "2px",
					zIndex: "9999",
				});
				const progressBar = document.createElement("div");
				Object.assign(progressBar.style, {
					width: "100%",
					height: "100%",
					backgroundColor: "#00a4ff",
				});
				progressBarContainer.appendChild(progressBar);
				document.body.appendChild(progressBarContainer);

				const link = document.createElement("a");
				link.href = originUrl;
				link.style.display = "none";
				document.body.appendChild(link);

				let countdown = 5;
				const countdownInterval = setInterval(() => {
					countdown -= 0.01;
					document.getElementById("countdown").innerText = Math.ceil(countdown);
					progressBar.style.width = `${(countdown / 5) * 100}%`;
					if (countdown <= 0) {
						clearInterval(countdownInterval);
						link.click();
					}
				}, 10);

				document.getElementById("cancelButton").addEventListener("click", () => {
					clearInterval(countdownInterval);
					countdownTips.style.animation = "fadeOut 0.3s ease-out";
					countdownTips.addEventListener("animationend", () => {
						countdownTips.remove();
					});
					progressBarContainer.remove();
					link.remove();
				});
			}
		}
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
