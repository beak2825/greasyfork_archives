// ==UserScript==
// @name         JianShuNock
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock系列，简书文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://www.jianshu.com/p/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494159/JianShuNock.user.js
// @updateURL https://update.greasyfork.org/scripts/494159/JianShuNock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		mark: {
			datetime: {
				enabled: GM_getValue("datetime", true),
				selector: ["section button", "time", "section time"],
			},
			readtime: {
				enabled: GM_getValue("readtime", true),
				selector: ["section button", "time", "article"],
			},
		},
		hidden_page_qrcode: {
			enabled: GM_getValue("hidden_page_qrcode", true),
			selector: ["div:has(div[role='document'])", ".anticon-close"],
		},
		hidden: {
			comment_fixed: {
				enabled: GM_getValue("comment_fixed", true),
				selector: ["footer", "footer i", ".anticon-caret-down"],
			},
			app_ercode: {
				enabled: GM_getValue("app_ercode", true),
				selector: [
					"div[role='dialog']",
					"img[src='//upload.jianshu.io/images/js-qrc.png']",
					"button",
					"i[aria-label='ic-shang']",
				],
			},
			unrelated_article: {
				enabled: GM_getValue("unrelated_article", true),
				selector: ["aside section:has(div[role='listitem'])"],
			},
			hot_story: {
				enabled: GM_getValue("hot_story", true),
				selector: ["aside>div"],
			},
			copyright_text: {
				enabled: GM_getValue("copyright_text", true),
			},
		},
	};

	const setModal = `<div class="modal-dialog"><div class="modal-setting"onClick="event.cancelBubble = true"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间优化</span><span><input type="checkbox"id="feature-mark-datetime"aria-nock="datetime"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>文章阅读时长</span><span><input type="checkbox"id="feature-mark-readtime"aria-nock="readtime"/><label for="feature-mark-readtime"></label></span></div><div class="setting-item"><span>隐藏滚动时的全屏扫码下载弹窗</span><span><input type="checkbox"id="feature-hidden-page-qrcode"aria-nock="hidden_page_qrcode"/><label for="feature-hidden-page-qrcode"></label></span></div><div class="setting-item"><span>隐藏底部固定评论框</span><span><input type="checkbox"id="feature-comment-fixed"aria-nock="comment_fixed"/><label for="feature-comment-fixed"></label></span></div><div class="setting-item"><span>隐藏移动端推荐</span><span><input type="checkbox"id="feature-app-ercode"aria-nock="app_ercode"/><label for="feature-app-ercode"></label></span></div><div class="setting-item"><span>隐藏不相关的文章推荐</span><span><input type="checkbox"id="feature-unrelated-article"aria-nock="unrelated_article"/><label for="feature-unrelated-article"></label></span></div><div class="setting-item"><span>隐藏右侧热门故事</span><span><input type="checkbox"id="feature-hot-story"aria-nock="hot_story"/><label for="feature-hot-story"></label></span></div><div class="setting-item"><span>移除复制附加的版权声明</span><span><input type="checkbox"id="feature-copyright-text"aria-nock="copyright_text"/><label for="feature-copyright-text"></label></span></div></div></div></div>`;
	const setStyle = `@keyframes fall { 0% { transform: translate(0%, -100%); opacity: 0; } 100% { transform: translate(0%, 0%); opacity: 1; } } .setting-item input[type=checkbox] { height: 0; width: 0; display: none; } .setting-item label { cursor: pointer; text-indent: -9999px; width: 40px; height: 20px; background: pink; display: block; border-radius: 100px; position: relative; } .setting-item label:after { content: ''; position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; background: #fff; border-radius: 90px; transition: 0.2s; } .setting-item input:checked+label { background: #57a; } .setting-item input:checked+label:after { left: calc(100% - 2px); transform: translateX(-100%); } .setting-item label:active:after { width: 28px; } .modal-dialog { pointer-events: auto !important; display:none; border: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; min-width: 100vw; min-height: 100vh; height: 100%; background-color: rgba(0, 0, 0, 0.4); } .modal-setting { width: 450px; margin: auto; background-color: #ffffff; border-radius: 5px; padding: 20px; margin-top: 40px; position: relative; box-sizing: border-box; animation: fall 0.5s ease-in-out; } .modal-header { border-bottom: 1px solid #000000; } .modal-header h3 { padding: 10px 0; margin: 0; } .modal-header span { font-size: 24px; color: #ccc; position: absolute; right: 5px; top: 0; cursor: pointer; } .setting-item { margin: 10px 0; display: flex; justify-content: space-between; }`;

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

	const createObserver = (callback) => {
		const observer = new MutationObserver(() => callback(observer));
		observer.observe(document.body, { childList: true, subtree: true });
	};

	if (features.mark.datetime.enabled) {
		const getRawTimeAgo = (element) => calculateTimeAgo(element.innerText.match(regex)[0]);
		const regex = /\d{4}.\d{1,2}.\d{1,2} \d{1,2}:\d{1,2}/g;

		createObserver((observer) => {
			const folllowBtn = document.querySelector(features.mark.datetime.selector[0]);
			const messageBox = folllowBtn?.parentNode?.parentNode;
			const postTime = messageBox?.querySelector(features.mark.datetime.selector[1]);

			if (!postTime) {
				return;
			}

			const updateTime =
				document.querySelectorAll(features.mark.datetime.selector[2])[1] ?? postTime;

			const rawPostTimeAgo = getRawTimeAgo(postTime);
			const rawUpdateTimeAgo = getRawTimeAgo(updateTime);

			const formattedPostTime = `发布于 ${postTime.innerText}（${rawPostTimeAgo}）`;
			const formattedUpdateTime = `编辑于 ${updateTime.innerText}（${rawUpdateTimeAgo}）`;

			postTime.style.cursor = "pointer";
			postTime.style.textDecoration = "underline";
			postTime.innerText = formattedPostTime;
			postTime.addEventListener("click", () => {
				const formatTime =
					postTime.innerText == formattedPostTime ? formattedUpdateTime : formattedPostTime;
				postTime.innerText = formatTime;
			});
			observer.disconnect();
		});
	}

	if (features.mark.readtime.enabled) {
		createObserver((observer) => {
			const folllowBtn = document.querySelector(features.mark.readtime.selector[0]);
			const messageBox = folllowBtn?.parentNode?.parentNode;
			const postTime = messageBox?.querySelector(features.mark.readtime.selector[1]);

			if (!postTime) {
				return;
			}

			const bottomMessage = postTime.parentNode;
			const wordCountItem = bottomMessage.lastElementChild;
			const readItem = document.createElement("span");
			const textLen = wordCountItem.innerText.replaceAll(",", "").match(/\d+/g);
			const textCount = parseInt(textLen);
			const readtime = textCount / 400;
			if (readtime >= 1440) {
				const days = Math.floor(readtime / 1440);
				readItem.innerHTML = `<span style='cursor:pointer;'>阅读时长 ${days} 天</span>`;
			}
			if (readtime >= 60) {
				const hours = Math.floor(readtime / 60);
				const minutes = Math.floor(readtime % 60);
				readItem.innerHTML = `<span style='cursor:pointer;'>阅读时长 ${hours} 小时 ${minutes} 分钟</span>`;
			}
			if (readtime >= 1) {
				const minutes = Math.round(readtime);
				readItem.innerHTML = `<span style='cursor:pointer;'>阅读时长 ${minutes} 分钟</span>`;
			}
			if (readtime < 1) {
				const seconds = Math.round(readtime * 60);
				readItem.innerHTML = `<span style='cursor:pointer;'>阅读时长 ${seconds} 秒</span>`;
			}
			readItem.style.marginLeft = "10px";
			readItem.style.textDecoration = "underline";
			readItem.addEventListener("click", () => {
				document.querySelector(features.mark.readtime.selector[2]).scrollIntoView(false);
			});

			wordCountItem.append(readItem);

			observer.disconnect();
		});
	}

	if (features.hidden_page_qrcode.enabled) {
		const observer = new MutationObserver(() => {
			const mask = document.querySelector(features.hidden_page_qrcode.selector[0]);

			if (!mask) {
				return;
			}

			const button = mask.querySelector(features.hidden_page_qrcode.selector[1]);
			button.click();

			mask.style.display = "none";
			observer.disconnect();
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (features.hidden.comment_fixed.enabled) {
		const comment = document.querySelector(features.hidden.comment_fixed.selector[0]);
		comment.style.display = "none";
		const commentIcon = document.querySelector(features.hidden.comment_fixed.selector[1]);
		const cloneCommentIcon = commentIcon.cloneNode(true);

		const actionCommentBtn = document.createElement("div");
		actionCommentBtn.style.width = "40px";
		actionCommentBtn.style.height = "40px";
		actionCommentBtn.style.position = "fixed";
		actionCommentBtn.style.right = "100px";
		actionCommentBtn.style.bottom = "150px";
		actionCommentBtn.style.display = "flex";
		actionCommentBtn.style.alignItems = "center";
		actionCommentBtn.style.justifyContent = "center";
		actionCommentBtn.style.borderRadius = "50%";
		actionCommentBtn.style.color = "#8c8c8c";
		actionCommentBtn.style.cursor = "pointer";
		actionCommentBtn.style.opacity = 0;
		actionCommentBtn.style.backgroundColor = "#ffffff";
		actionCommentBtn.style.boxShadow = "0 1px 3px rgba(26, 26, 26, .1)";
		actionCommentBtn.addEventListener("click", () => {
			const status = comment.style.display === "none" ? "block" : "none";
			comment.style.display = status;
		});
		actionCommentBtn.appendChild(cloneCommentIcon);
		document.body.appendChild(actionCommentBtn);

		window.addEventListener("scroll", () => {
			const scrollTop = document.documentElement.scrollTop;
			const windowHeight = window.innerHeight;

			if (scrollTop === 0 || scrollTop + windowHeight <= 1050) {
				actionCommentBtn.style.opacity = 0;
			} else {
				actionCommentBtn.style.opacity = 1;
			}
		});
	}

	if (features.hidden.app_ercode.enabled) {
		createObserver((observer) => {
			const qrcode = document.querySelector(features.hidden.app_ercode.selector[1]);

			if (!qrcode) {
				return;
			}

			const appRecommendBox = qrcode.parentNode;
			appRecommendBox.style.display = "none";
			appRecommendBox.previousSibling.style.display = "none";
			appRecommendBox.nextSibling.style.display = "none";

			observer.disconnect();
		});

		createObserver((observer) => {
			const dialog = document.querySelector(features.hidden.app_ercode.selector[0]);
			const dialogQrcode = dialog?.querySelector(features.hidden.app_ercode.selector[1]);

			if (!dialogQrcode) {
				return;
			}

			dialog.parentNode.style.display = "none";
			dialog.querySelector(features.hidden.app_ercode.selector[2]).click();
			observer.disconnect();
		});

		const asideRewardBtn = document.querySelector(features.hidden.app_ercode.selector[3]);
		const asideQrcodeBtn = asideRewardBtn.closest("div").parentNode.nextSibling;
		asideQrcodeBtn.style.display = "none";
	}

	if (features.hidden.unrelated_article.enabled) {
		createObserver((observer) => {
			const unrelatedArticleBox = document.querySelector(
				features.hidden.unrelated_article.selector[0]
			);

			if (!unrelatedArticleBox) {
				return;
			}

			unrelatedArticleBox.style.display = "none";
			observer.disconnect();
		});
	}

	if (features.hidden.hot_story.enabled) {
		const hotStoryBox = document.querySelector(features.hidden.hot_story.selector[0]);
		hotStoryBox.style.display = "none";
	}

	if (features.hidden.copyright_text.enabled) {
		document.addEventListener("copy", (e) => {
			e.preventDefault();
			e.stopImmediatePropagation();
			const selectedText = window.getSelection().toString();
			e.clipboardData.setData("text/plain", selectedText);
		});
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
