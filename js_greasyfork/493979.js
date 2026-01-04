// ==UserScript==
// @name         ZhiHuNock
// @namespace    http://tampermonkey.net/
// @version      0.0.10
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock系列，知乎文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://zhuanlan.zhihu.com/p/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/493979/ZhiHuNock.user.js
// @updateURL https://update.greasyfork.org/scripts/493979/ZhiHuNock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: [".ContentItem-time", ".Post-Header"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M256 8C119 8 8 119 8 256S119 504 256 504 504 393 504 256 393 8 256 8zm92.5 313h0l-20 25a16 16 0 0 1 -22.5 2.5h0l-67-49.7a40 40 0 0 1 -15-31.2V112a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16V256l58 42.5A16 16 0 0 1 348.5 321z"/></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: [".Post-RichText", ".Post-NormalMain"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M360 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24 0 91 51 167.7 120.8 192C75 280.3 24 357 24 448c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24v-16c0-13.3-10.7-24-24-24 0-91-51-167.7-120.8-192C309 231.7 360 155 360 64c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24zm-64 448H88c0-77.5 46.2-144 104-144 57.8 0 104 66.5 104 144z"/></svg>`,
			},
		},
		hidden_login: {
			enabled: GM_getValue("login_hidden", true),
			selector: [
				".AppHeader-profileAvatar",
				".Modal-closeButton",
				".ZDI--Xmark16",
				".Button--blue",
			],
		},
	};

	const setModal = `<div class="modal-dialog"><div class="modal-setting"onClick="event.cancelBubble = true"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间优化</span><span><input type="checkbox"id="feature-mark-datetime"aria-nock="datetime"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>文章阅读时长</span><span><input type="checkbox"id="feature-mark-readtime"aria-nock="readtime"/><label for="feature-mark-readtime"></label></span></div><div class="setting-item"><span>登录提示自动隐藏</span><span><input type="checkbox"id="feature-login-hidden"aria-nock="login_hidden"/><label for="feature-login-hidden"></label></span></div></div></div></div>`;
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

	const messageblock = document.createElement("div");
	if (features.mark.datetime.enabled) {
		const getRawTimeAgo = (element) => calculateTimeAgo(element.innerText.match(regex)[0]);

		const postTime = document.querySelector(features.mark.datetime.selector[0]);
		const regex = /\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/g;
		const rawTimeAgo = getRawTimeAgo(postTime);

		const iconItem = document.createElement("span");
		iconItem.innerHTML = features.mark.datetime.icon;
		const icon = iconItem.querySelector("svg");
		icon.style.width = "15px";
		icon.style.height = "15px";
		icon.style.marginRight = "5px";

		const formattedTimeElement = document.createElement("span");
		formattedTimeElement.textContent = `（${rawTimeAgo}）`;

		const originalClick = postTime.onclick;
		postTime.style.marginTop = 0;
		postTime.style.cursor = "pointer";
		postTime.style.textDecoration = "underline";
		postTime.style.display = "inline-flex";
		postTime.style.alignItems = "center";
		postTime.prepend(icon);
		postTime.appendChild(formattedTimeElement);
		postTime.addEventListener("click", () => {
			originalClick();
			setTimeout(() => {
				const time = document.querySelector(features.mark.datetime.selector[0]);
				const rawTimeAgo = getRawTimeAgo(time);
				formattedTimeElement.textContent = `（${rawTimeAgo}）`;
			}, 50);
		});
		messageblock.appendChild(postTime);
	}

	if (features.mark.readtime.enabled) {
		const readbox = document.createElement("div");
		const textCount = document.querySelector(features.mark.readtime.selector[0]).innerText.length;
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
		readbox.style.color = "#8491a5";
		readbox.style.fontSize = "14px";
		readbox.style.alignItems = "center";
		readbox.style.cursor = "pointer";
		readbox.addEventListener("click", () =>
			document.querySelector(features.mark.readtime.selector[1]).scrollIntoView(false)
		);

		const icon = readbox.querySelector("svg");
		icon.style.width = "15px";
		icon.style.height = "15px";
		icon.style.marginRight = "5px";

		messageblock.appendChild(readbox);
	}

	if (features.hidden_login.enabled && !document.querySelector(features.hidden_login.selector[0])) {
		const createObserver = (selector, callback) => {
			const observer = new MutationObserver(() => {
				const closeBtn = document.querySelector(selector);

				if (!closeBtn) {
					return;
				}

				callback();
				observer.disconnect();
			});

			observer.observe(document.body, { childList: true, subtree: true });
		};

		createObserver(features.hidden_login.selector[1], () => {
			document.querySelector(features.hidden_login.selector[1]).click();
		});

		const observer = new MutationObserver(() => {
			const closeBtn = document.querySelectorAll(features.hidden_login.selector[2]);

			if (closeBtn.length <= 0) {
				return;
			}

			closeBtn.forEach((btn) => {
				btn.parentNode.parentNode.parentNode.style.display = "none";
			});
			observer.disconnect();
		});

		observer.observe(document.body, { childList: true, subtree: true });

		const obr = new MutationObserver(() => {
			const button = Array.from(document.querySelectorAll(features.hidden_login.selector[3])).find(
				(btn) => btn.textContent.includes("立即登录/注册")
			);

			if (!button) {
				return;
			}

			button.parentNode.parentNode.parentNode.style.display = "none";
			obr.disconnect();
		});

		obr.observe(document.body, { childList: true, subtree: true });
	}

	messageblock.style.display = "flex";
	messageblock.style.alignItems = "center";
	messageblock.style.gap = "10px";
	document.querySelector(features.mark.datetime.selector[1]).appendChild(messageblock);

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
