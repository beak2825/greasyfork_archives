// ==UserScript==
// @name         CSDNock
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @icon		 https://raw.githubusercontent.com/Exisi/BlogNock/main/doc/icon/nock.ico
// @description  BlogNock系列，CSDN文章的标识优化
// @author       Exisi
// @license      MIT License
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://blog.csdn.net/article/details/*
// @supportURL   https://github.com/Exisi/BlogNock/issues/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/493011/CSDNock.user.js
// @updateURL https://update.greasyfork.org/scripts/493011/CSDNock.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const features = {
		recommend_type_wenku: {
			debug: false,
			enabled: GM_getValue("recommend_type_wenku", true),
			selector: ".recommend-item-box.type_chatgpt.clearfix",
		},
		recommend_type_download: {
			debug: false,
			enabled: GM_getValue("recommend_type_download", true),
			selector: ".recommend-item-box.type_download.clearfix",
		},
		mark: {
			datetime: {
				debug: false,
				enabled: GM_getValue("datetime", true),
				selector: [".time", ".up-time"],
			},
			readtime: {
				debug: false,
				enabled: GM_getValue("readtime", true),
				selector: ["#content_views", ".time", ".blog-content-box"],
				icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentcolor" d="M360 0H24C10.7 0 0 10.7 0 24v16c0 13.3 10.7 24 24 24 0 91 51 167.7 120.8 192C75 280.3 24 357 24 448c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24v-16c0-13.3-10.7-24-24-24 0-91-51-167.7-120.8-192C309 231.7 360 155 360 64c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24zm-64 448H88c0-77.5 46.2-144 104-144 57.8 0 104 66.5 104 144z"/></svg>`,
			},
		},
		source_redirct: {
			debug: false,
			enabled: GM_getValue("source_redirct", true),
			selector: [".href-article-edit", ".article-type-img", ".article-source-link a"],
		},
		unfixed_comment: {
			debug: false,
			enabled: GM_getValue("unfixed_comment", true),
			selector: [".left-toolbox"],
		},
		hidden_login: {
			debug: false,
			enabled: GM_getValue("hidden_login", true),
			selector: [".hasAvatar", ".passport-login-container", ".passport-login-box>img"],
		},
		allow_copy: {
			debug: false,
			enabled: GM_getValue("allow_copy", true),
			selector: ["#content_views", "pre", "code"],
		},
		unfold_code: {
			debug: false,
			enabled: GM_getValue("unfold_code", true),
			selector: [".hide-preCode-bt"],
		},
		allow_copy_with_btn: {
			debug: false,
			enabled: GM_getValue("allow_copy_with_btn", true),
			selector: [".hljs-button.signin.active", "button.btn-code-notes", "code"],
		},
		hidden_sidebar: {
			debug: false,
			enabled: GM_getValue("hidden_sidebar", true),
			selector: [".blog_container_aside", "#mainBox"],
		},
		hidden: {
			ai_search_btn: {
				enabled: GM_getValue("ai_search_btn", true),
				selector: ["#toolbar-c-box-button.c-box"],
			},
			article_search_tip: {
				enabled: GM_getValue("article_search_tip", true),
				selector: ["#articleSearchTip"],
			},
			nav_vip_promotion_pic: {
				enabled: GM_getValue("nav_vip_promotion_pic", true),
				selector: [".toolbar-btn-vip img[src^='https://i-operation.csdnimg.cn']"],
			},
			login_tips: {
				enabled: GM_getValue("login_tips", true),
				selector: [".passport-login-tip-container"],
			},
			collection_tips: {
				enabled: GM_getValue("collection_tips", true),
				selector: [".tool-active-list", "#tool-active-list-collection"],
			},
			side_toolbar: {
				enabled: GM_getValue("side_toolbar", true),
				selector: [".csdn-side-toolbar"],
			},
			latest_comments: {
				enabled: GM_getValue("latest_comment", true),
				selector: ["#asideNewComments"],
			},
			hidden_sidebar_ad: {
				enabled: GM_getValue("hidden_sidebar_ad", true),
				selector: ["#footerRightAds"],
			},
			hidden_sidebar_remuneration: {
				enabled: GM_getValue("hidden_sidebar_remuneration", true),
				selector: [".swiper-slide-box-remuneration"],
			},
			sidebar_hot_article: {
				enabled: GM_getValue("sidebar_hot_article", true),
				selector: ["#asideHotArticle"],
			},
		},
	};

	class MenuHandler {
		constructor() {
			const setModal = `<div class="modal-dialog"><div class="modal-setting"onClick="event.cancelBubble = true"><div class="modal-header"><h3>功能设置</h3><span class="btn-dialog-close">×</span></div><div class="modal-body"><div class="setting-item"><span>文章显示时间优化</span><span><input type="checkbox"id="feature-mark-datetime"aria-nock="datetime"/><label for="feature-mark-datetime"></label></span></div><div class="setting-item"><span>文章阅读时长</span><span><input type="checkbox"id="feature-mark-readtime"aria-nock="readtime"/><label for="feature-mark-readtime"></label></span></div><div class="setting-item"><span>移除底部推荐的CSDN下载</span><span><input type="checkbox"id="feature-recommend-type-download"aria-nock="recommend_type_download"/><label for="feature-recommend-type-download"></label></span></div><div class="setting-item"><span>移除底部推荐的CSDN文库文章</span><span><input type="checkbox"id="feature-recommend-type-wenku"aria-nock="recommend_type_wenku"/><label for="feature-recommend-type-wenku"></label></span></div><div class="setting-item"><span>自动转载原链重定向</span><span><input type="checkbox"id="feature-source-redirct"aria-nock="source_redirct"/><label for="feature-source-redirct"></label></span></div><div class="setting-item"><span>取消固定文章工具栏</span><span><input type="checkbox"id="feature-unfixed-comment"aria-nock="unfixed_comment"/><label for="feature-unfixed-comment"></label></span></div><div class="setting-item"><span>关闭界面加载后的登录模态框</span><span><input type="checkbox"id="feature-hidden-login"aria-nock="hidden_login"/><label for="feature-hidden-login"></label></span></div><hr/><div class="setting-item"><span>文章自由复制</span><span><input type="checkbox"id="feature-allow-copy"aria-nock="allow_copy"/><label for="feature-allow-copy"></label></span></div><div class="setting-item"><span>代码自动展开</span><span><input type="checkbox"id="feature-unfold-code"aria-nock="unfold_code"/><label for="feature-unfold-code"></label></span></div><div class="setting-item"><span>允许一键复制代码</span><span><input type="checkbox"id="feature-allow-copy-with-btn"aria-nock="allow_copy_with_btn"/><label for="feature-allow-copy-with-btn"></label></span></div><hr/><div class="setting-item"><span>隐藏AI搜索按钮</span><span><input type="checkbox"id="feature-hidden-ai-search-btn"aria-nock="ai_search_btn"/><label for="feature-hidden-ai-search-btn"></label></span></div><div class="setting-item"><span>隐藏顶部会员促销</span><span><input type="checkbox"id="feature-hidden-nav-vip-promotion-pic"aria-nock="nav_vip_promotion_pic"/><label for="feature-hidden-nav-vip-promotion-pic"></label></span></div><div class="setting-item"><span>隐藏文本复制的工具栏</span><span><input type="checkbox"id="feature-hidden-article-search-tip"aria-nock="article_search_tip"/><label for="feature-hidden-article-search-tip"></label></span></div><div class="setting-item"><span>隐藏右侧工具栏</span><span><input type="checkbox"id="feature-hidden-side-toolbar"aria-nock="side_toolbar"/><label for="feature-hidden-side-toolbar"></label></span></div><div class="setting-item"><span>隐藏登录提示</span><span><input type="checkbox"id="feature-hidden-login-tips"aria-nock="login_tips"/><label for="feature-hidden-login-tips"></label></span></div><div class="setting-item"><span>隐藏收藏提示</span><span><input type="checkbox"id="feature-hidden-collection-tips"aria-nock="collection_tips"/><label for="feature-hidden-collection-tips"></label></span></div><hr/><div class="setting-item"><span>隐藏左侧侧边栏</span><span><input type="checkbox"id="feature-hidden-sidebar"aria-nock="hidden_sidebar"/><label for="feature-hidden-sidebar"></label></span></div><div class="setting-item"><span>隐藏左侧创作助手</span><span><input type="checkbox"id="feature-hidden-sidebar-remuneration"aria-nock="hidden_sidebar_remuneration"/><label for="feature-hidden-sidebar-remuneration"></label></span></div><div class="setting-item"><span>隐藏左侧底部广告</span><span><input type="checkbox"id="feature-hidden-sidebar-ad"aria-nock="hidden_sidebar_ad"/><label for="feature-hidden-sidebar-ad"></label></span></div><div class="setting-item"><span>隐藏左侧热门文章</span><span><input type="checkbox"id="feature-hidden-sidebar-hot-article"aria-nock="sidebar_hot_article"/><label for="feature-hidden-sidebar-hot-article"></label></span></div><div class="setting-item"><span>隐藏左侧最新评论</span><span><input type="checkbox"id="feature-hidden-latest-comment"aria-nock="latest_comment"/><label for="feature-hidden-latest-comment"></label></span></div></div></div></div>`;
			const setStyle = `@keyframes fall { 0% { transform: translate(0%, -100%); opacity: 0; } 100% { transform: translate(0%, 0%); opacity: 1; } } .setting-item input[type=checkbox] { height: 0; width: 0; display: none; } .setting-item label { cursor: pointer; text-indent: -9999px; width: 40px; height: 20px; background: pink; display: block; border-radius: 100px; position: relative; } .setting-item label:after { content: ''; position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; background: #fff; border-radius: 90px; transition: 0.2s; } .setting-item input:checked+label { background: #57a; } .setting-item input:checked+label:after { left: calc(100% - 2px); transform: translateX(-100%); } .setting-item label:active:after { width: 28px; } .modal-dialog { pointer-events: auto !important; display:none; border: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; min-width: 100vw; min-height: 100vh; height: 100%; background-color: rgba(0, 0, 0, 0.4); } .modal-setting { width: 450px; height: 90%; overflow: scroll; margin: auto; background-color: #ffffff; border-radius: 5px; padding: 20px; margin-top: 40px; position: relative; box-sizing: border-box; animation: fall 0.5s ease-in-out; } .modal-header { border-bottom: 1px solid #000000; } .modal-header h3 { padding: 10px 0; margin: 0; } .modal-header span { font-size: 24px; color: #ccc; position: absolute; right: 5px; top: 0; cursor: pointer; } .setting-item { margin: 10px 0; display: flex; justify-content: space-between; }`;

			const dStyle = document.createElement("style");
			dStyle.innerHTML = setStyle;
			document.head.appendChild(dStyle);
			const modal = document.createElement("div");
			modal.innerHTML = setModal;
			document.body.appendChild(modal);

			this.bindEvents();
			this.registerContextMenu();
		}

		bindEvents() {
			const checkboxList = document.querySelectorAll(".setting-item input");
			Array.from(checkboxList).forEach((checkbox) => {
				const nock = checkbox.getAttribute("aria-nock");
				checkbox.checked = GM_getValue(nock, true);
			});

			document.querySelector(".modal-dialog").addEventListener("click", this.closeSetting);
			document.querySelector(".btn-dialog-close").addEventListener("click", this.closeSetting);
			document.querySelector(".modal-body").addEventListener("click", (e) => {
				if (e.target.type !== "checkbox") {
					return;
				}
				const nock = e.target.getAttribute("aria-nock");
				const flag = GM_getValue(nock) == null ? false : !GM_getValue(nock);
				GM_setValue(nock, flag);
			});
		}

		showSetting() {
			document.querySelector(".modal-dialog").style.display = "block";
		}

		closeSetting() {
			document.querySelector(".modal-dialog").style.display = "none";
		}

		registerContextMenu() {
			GM_registerMenuCommand("功能设置", this.showSetting.bind(this));
		}
	}

	const menuHandler = new MenuHandler();

	class ErrorHandler {
		constructor(customConfig = {}) {
			const debugConfig = {
				global: false,
			};

			// Merge custom configuration
			this.debugConfig = { ...debugConfig, ...customConfig };
		}

		/**
		 * Update configuration dynamically
		 * @param {Object} newConfig - New configuration
		 */
		setConfig(customConfig = {}) {
			this.debugConfig = { ...this.debugConfig, ...customConfig };
		}

		/**
		 * Unified error handling function
		 * @param {Error} error - Error object
		 * @param {string} functionName - Function name
		 */
		handleError(error, functionName) {
			const isDebugMode = this.debugConfig[functionName] || this.debugConfig.global;
			// Re-throw error in debug mode
			if (isDebugMode) {
				console.error(`[DEBUG] Error in ${functionName}:`, error);
				throw error;
			} else {
				console.warn(`[WARNING] Error in ${functionName}:`, error.message);
			}
		}

		/**
		 * Safe execution wrapper function
		 * @param {string} functionName - Function name
		 * @param {Function} fn - Function to execute
		 * @returns {*} Function execution result or null
		 */
		safeExecute(functionName, fn) {
			try {
				return fn();
			} catch (error) {
				this.handleError(error, functionName);
				return null;
			}
		}

		/**
		 * Collect debug configuration from features object
		 * @param {Object} features - Features configuration object
		 * @returns {Object} Debug configuration
		 */
		collectDebug(features) {
			if (!features || typeof features !== "object") {
				return {};
			}

			let customConfig = {};

			function traverse(obj) {
				Object.keys(obj).forEach((key) => {
					if (!obj.hasOwnProperty(key)) {
						return;
					}

					const value = obj[key];
					const currentKey = key;

					const isObj = value && typeof value === "object";
					const isDebug = value.hasOwnProperty("debug") && value.debug;

					if (isObj && isDebug) {
						customConfig[currentKey] = true;
					}

					if (isObj && !Array.isArray(value)) {
						traverse(value, currentKey);
					}
				});
			}

			traverse(features);
			return customConfig;
		}
	}

	const errorNock = new ErrorHandler();
	const debugConfig = errorNock.collectDebug(features);
	errorNock.setConfig(debugConfig);

	errorNock.safeExecute("recommend_type_wenku", () => {
		if (!features.recommend_type_wenku.enabled) {
			return;
		}

		const downloadItemList = document.querySelectorAll(features.recommend_type_wenku.selector);
		Array.from(downloadItemList)
			.filter((item) => {
				const link = item.querySelector("a")?.href;
				return link && link.includes("wenku.csdn");
			})
			.forEach((item) => (item.style.display = "none"));
	});

	errorNock.safeExecute("recommend_type_download", () => {
		if (!features.recommend_type_download.enabled) {
			return;
		}

		const downloadItemList = document.querySelectorAll(features.recommend_type_download.selector);
		Array.from(downloadItemList)
			.filter((item) => {
				const link = item.querySelector("a")?.href;
				return link && link.includes("download.csdn");
			})
			.forEach((item) => (item.style.display = "none"));
	});

	errorNock.safeExecute("datetime", () => {
		if (!features.mark.datetime.enabled) {
			return;
		}

		const postTime = document.querySelector(features.mark.datetime.selector[0]);
		const updateTime = document.querySelector(features.mark.datetime.selector[1]) ?? postTime;

		const regex = /\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}/g;
		let rawPostTime = postTime.innerText.match(regex)[0];
		let rawUpdateTime = updateTime.innerText.match(regex)[0];

		[rawPostTime, rawUpdateTime] = [rawPostTime, rawUpdateTime].sort(
			(a, b) => new Date(a) - new Date(b)
		);

		const postTimeAgo = calculateTimeAgo(rawPostTime);
		const updateTimeAgo = calculateTimeAgo(rawUpdateTime);

		const formattedPostTime = `发布于 ${rawPostTime}（${postTimeAgo}）`;
		const formattedUpdateTime = `编辑于 ${rawUpdateTime}（${updateTimeAgo}）`;

		postTime.style.cursor = "pointer";
		postTime.style.fontSize = "14px";
		postTime.style.textDecoration = "underline";
		postTime.innerText = formattedPostTime;
		postTime.setAttribute("data-time", rawPostTime);
		postTime.addEventListener("click", () => {
			const text =
				postTime.innerText == formattedPostTime ? formattedUpdateTime : formattedPostTime;
			postTime.innerHTML = text;
		});
	});

	errorNock.safeExecute("readtime", () => {
		if (!features.mark.readtime.enabled) {
			return;
		}

		const readbox = document.createElement("span");
		readbox.style.display = "flex";
		readbox.style.alignItems = "center";
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
		const icon = readbox.querySelector("svg");
		icon.style.width = "14px";
		icon.style.height = "14px";
		icon.style.marginRight = "3px";
		readbox.style.fontSize = "14px";
		readbox.style.cursor = "pointer";
		readbox.style.textDecoration = "underline";
		readbox.addEventListener("click", () =>
			document.querySelector(features.mark.readtime.selector[2]).scrollIntoView(false)
		);
		document.querySelector(features.mark.readtime.selector[1]).after(readbox);
	});

	errorNock.safeExecute("source_redirct", () => {
		if (!features.source_redirct.enabled) {
			return;
		}

		const editStatus = document.querySelector(features.source_redirct.selector[0]);
		const flag = editStatus.className !== features.source_redirct.selector[0].slice(1);
		if (flag) {
			const copyright = document.querySelector(features.source_redirct.selector[1]);
			const sourceUrl = document.querySelector(features.source_redirct.selector[2]);
			const iconUrl = copyright.getAttribute("src");
			const type = iconUrl.substring(iconUrl.lastIndexOf("/") + 1, iconUrl.lastIndexOf("."));
			if (type === "reprint") {
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
					zIndex: "9999",
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
				link.href = sourceUrl;
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
	});

	errorNock.safeExecute("unfixed_comment", () => {
		if (!features.unfixed_comment.enabled) {
			return;
		}

		const style = document.createElement("style");
		style.textContent = `${features.unfixed_comment.selector[0]}
									{ position: unset !important; }`;
		document.head.appendChild(style);
	});

	errorNock.safeExecute("hidden_login", () => {
		if (
			!features.hidden_login.enabled &&
			document.querySelector(features.hidden_login.selector[0])
		) {
			return;
		}

		const observer = new MutationObserver(() => {
			const loginModal = document.querySelector(features.hidden_login.selector[1]);

			if (!loginModal) {
				return;
			}

			loginModal.querySelector(features.hidden_login.selector[2]).click();
			observer.disconnect();
		});
		observer.observe(document.body, { childList: true, subtree: true });
	});

	errorNock.safeExecute("allow_copy", () => {
		if (!features.allow_copy.enabled) {
			return;
		}

		const contentView = document.querySelector(features.allow_copy.selector[0]);
		contentView.querySelectorAll("*").forEach((content) => {
			content.oncopy = (e) => e.stopPropagation();
		});

		const preTags = document.querySelectorAll(features.allow_copy.selector[1]);
		preTags.forEach((pre) => (pre.style.userSelect = "auto"));

		const codeTags = document.querySelectorAll(features.allow_copy.selector[2]);
		codeTags.forEach((code) => (code.style.userSelect = "auto"));
	});

	errorNock.safeExecute("unfold_code", () => {
		if (!features.unfold_code.enabled) {
			return;
		}

		const unfoldCodeBtns = document.querySelectorAll(features.unfold_code.selector[0]);
		unfoldCodeBtns.forEach((btn) => btn.click());
	});

	errorNock.safeExecute("allow_copy_with_btn", () => {
		if (!features.allow_copy_with_btn.enabled) {
			return;
		}

		const codeCopyBtns = document.querySelectorAll(features.allow_copy_with_btn.selector[0]);
		codeCopyBtns.forEach((btn) => {
			btn.style.display = "none !important";
			btn.style.position = "absolute";
			btn.style.zIndex = "-1";
		});

		const aiCopyBtns = document.querySelectorAll(features.allow_copy_with_btn.selector[1]);
		aiCopyBtns.forEach((btn) => {
			btn.innerHTML = "复制";
			btn.style.paddingLeft = "8px";
			btn.style.backgroundImage = "none";
			btn.onclick = (e) => {
				e.stopPropagation();
				const codeBox = btn.closest("pre").querySelector(features.allow_copy_with_btn.selector[2]);
				navigator.clipboard.writeText(codeBox.innerText);
				btn.innerHTML = "已复制";
				setTimeout(() => (btn.innerHTML = "复制"), 1000);
			};
		});
	});

	errorNock.safeExecute("hidden_sidebar", () => {
		if (!features.hidden_sidebar.enabled) {
			return;
		}

		const style = document.createElement("style");
		style.textContent = `${features.hidden_sidebar.selector[0]}
									{ display: none !important; }`;
		document.head.appendChild(style);

		const main = document.querySelector(features.hidden_sidebar.selector[1]);
		main.style.display = "flex";
		main.style.justifyContent = "center";
	});

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
