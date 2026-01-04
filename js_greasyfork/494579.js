// ==UserScript==
// @name         JueJinNock
// @namespace    https://github.com/Exisi/BlogNock
// @version      0.0.9
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock系列，掘金文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://*.juejin.cn/post/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494579/JueJinNock.user.js
// @updateURL https://update.greasyfork.org/scripts/494579/JueJinNock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: [
					".meta-box time",
					"script[type='application/ld+json']",
					".author-info-block",
					"block-hidden",
					".meta-box.team .views-count[style]",
				],
				icon: `<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><path stroke-width="1.2" d="m2.5.5h12c1.1045695 0 2 .8954305 2 2v12c0 1.1045695-.8954305 2-2 2h-12c-1.1045695 0-2-.8954305-2-2v-12c0-1.1045695.8954305-2 2-2z"/><path d="m.5 4.5h16" stroke-width="1.2"/><path stroke-width="1.2" d="m8.5 7.5v6" transform="matrix(0 1 -1 0 19 2)"/></g></svg>`,
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: [".meta-box .read-time", "#article-root"],
			},
		},
		allow_copy_with_btn: {
			enabled: GM_getValue("allow_copy_with_btn", true),
			selector: [".code-block-extension-copyCodeBtn"],
		},
		copyright_text: {
			enabled: GM_getValue("copyright_text", true),
			selector: ["#article-root"],
		},
		hidden_login_tips: {
			enabled: GM_getValue("hidden_login_tips", true),
			selector: [".avatar-wrapper", ".bottom-login-guide"],
		},
		hidden: {
			action_ai_btn: {
				enabled: GM_getValue("action_ai_btn", true),
				selector: [".btn-ai"],
			},
			special_activity: {
				enabled: GM_getValue("special_activity", true),
				selector: [".special-activity-item", ".top-banners-container"],
			},
			feedback_btn: {
				enabled: GM_getValue("feedback_btn", true),
				selector: [".meiqia-btn"],
			},
			more_btn: {
				enabled: GM_getValue("more_btn", true),
				selector: [".more-btn"],
			},
			ad_container: {
				enabled: GM_getValue("ad_container", true),
				selector: [".ad-container"],
			},
			ad_article_top: {
				enabled: GM_getValue("ad_article_top", true),
				selector: ["article img[src*='-piu.byteimg.com']"],
			},
		},
	};

	const setModal = `<div class=modal-dialog><div class=modal-setting onclick="event.cancelBubble=!0"><div class=modal-header><h3>功能设置</h3><span class=btn-dialog-close>×</span></div><div class=modal-body><div class=setting-item><span>文章显示时间优化 </span><span><input aria-nock=datetime id=feature-mark-datetime type=checkbox> <label for=feature-mark-datetime></label></span></div><div class=setting-item><span>阅读时长点击跳转到文章底部 </span><span><input aria-nock=readtime id=feature-mark-readtime type=checkbox> <label for=feature-mark-readtime></label></span></div><div class=setting-item><span>允许一键复制代码 </span><span><input aria-nock=allow_copy_with_btn id=feature-allow-copy-with-btn type=checkbox> <label for=feature-allow-copy-with-btn></label></span></div><div class=setting-item><span>移除复制附加的版权声明 </span><span><input aria-nock=copyright_text id=feature-copyright-text type=checkbox> <label for=feature-copyright-text></label></span></div><hr><div class=setting-item><span>隐藏登录提示 </span><span><input aria-nock=hidden_login_tips id=feature-hidden-login-tips type=checkbox> <label for=feature-hidden-login-tips></label></span></div><div class=setting-item><span>隐藏右侧AI助手按钮 </span><span><input aria-nock=action_ai_btn id=feature-hidden-ai-assistant-notification type=checkbox> <label for=feature-hidden-ai-assistant-notification></label></span></div><div class=setting-item><span>隐藏顶部活动图片 </span><span><input aria-nock=special_activity id=feature-hidden-special-activity type=checkbox> <label for=feature-hidden-special-activity></label></span></div><div class=setting-item><span>隐藏右侧反馈按钮 </span><span><input aria-nock=feedback_btn id=feature-hidden-feedback-btn type=checkbox> <label for=feature-hidden-feedback-btn></label></span></div><div class=setting-item><span>隐藏右侧更多按钮 </span><span><input aria-nock=more_btn id=feature-hidden-more-btn type=checkbox> <label for=feature-hidden-more-btn></label></span></div><div class=setting-item><span>隐藏右栏底部群广告 </span><span><input aria-nock=ad_container id=feature-hidden-ad-container type=checkbox> <label for=feature-hidden-ad-container></label></span></div><div class=setting-item><span>隐藏文章顶部图片广告 </span><span><input aria-nock=ad_article_top id=feature-hidden-ad-article-top type=checkbox> <label for=feature-hidden-ad-article-top></label></span></div></div></div></div>`;
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

		const rawPublishedTime = datePublished.getAttribute("datetime");
		const rawModifiedTime = jsonData[0]?.dateModified ?? rawPublishedTime;

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
		datePublished.addEventListener("click", () => {
			const text =
				timeBlock.innerText == formattedPostTime ? formattedUpdateTime : formattedPostTime;
			timeBlock.innerText = text;
		});

		const observer = new MutationObserver(() => {
			const infoBlock = document.querySelector(features.mark.datetime.selector[2]);
			if (infoBlock && infoBlock.classList.contains(features.mark.datetime.selector[3])) {
				return;
			}

			const viewCountBlock = document.querySelector(features.mark.datetime.selector[4]);
			if (viewCountBlock && viewCountBlock.style.display == "none") {
				return;
			}

			datePublished.innerHTML = features.mark.datetime.icon;
			datePublished.appendChild(timeBlock);
			const icon = datePublished.querySelector("svg");
			icon.style.width = "13px";
			icon.style.height = "13px";
			icon.style.marginRight = "5px";

			observer.disconnect();
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (features.mark.readtime.enabled) {
		const readtimeItem = document.querySelector(features.mark.readtime.selector[0]);
		const article = document.querySelector(features.mark.readtime.selector[1]);
		readtimeItem.style.cursor = "pointer";
		readtimeItem.style.textDecoration = "underline";
		readtimeItem.addEventListener("click", () => article.scrollIntoView(false));
	}

	if (features.allow_copy_with_btn.enabled) {
		const observer = new MutationObserver(() => {
			const copyBtns = document.querySelectorAll(features.allow_copy_with_btn.selector[0]);

			if (copyBtns.length === 0) {
				return;
			}

			copyBtns.forEach((btn) => {
				btn.onclick = () => {
					const preBlock = btn.closest("pre");
					const codeBlock = preBlock.querySelector("code");
					navigator.clipboard.writeText(codeBlock.innerText);
					btn.innerText = "已复制";
					setTimeout(() => (btn.innerText = "复制代码"), 1500);
				};
			});
			observer.disconnect();
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (features.copyright_text.enabled) {
		const article = document.querySelector(features.copyright_text.selector[0]);
		article.addEventListener("copy", (e) => {
			e.preventDefault();
			e.stopImmediatePropagation();
			const selectedText = window.getSelection().toString();
			e.clipboardData.setData("text/plain", selectedText);
		});
	}

	if (
		features.hidden_login_tips.enabled &&
		!document.querySelector(features.hidden_login_tips.selector[0])
	) {
		const observer = new MutationObserver(() => {
			const loginTip = document.querySelector(features.hidden_login_tips.selector[1]);

			if (!loginTip) {
				return;
			}

			loginTip.style.display = "none";
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
