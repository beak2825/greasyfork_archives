// ==UserScript==
// @name         bilibili 成分查询
// @namespace    https://github.com/sparanoid/userscript
// @supportURL   https://github.com/sparanoid/userscript/issues
// @version      0.1.14
// @description  bilibili 共同关注一键查询（本地查询版）
// @author       Sparanoid
// @license      AGPL
// @compatible   chrome 80 or later
// @compatible   edge 80 or later
// @compatible   firefox 74 or later
// @compatible   safari 13.1 or later
// @match        https://*.bilibili.com/*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/429200/bilibili%20%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/429200/bilibili%20%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

// Debugging pages:
// - https://t.bilibili.com/594017148390748345
// - https://www.bilibili.com/read/cv13871002
// - https://space.bilibili.com/703007996/fans/follow
// - https://www.bilibili.com/video/BV1Ar4y1C77P
// - https://www.bilibili.com/video/BV1KL411g7om (colab)

window.addEventListener(
	"load",
	() => {
		const DEBUG = true;
		const NAMESPACE = "bilibili-social-check";
		const apiBase = "https://api.bilibili.com";
		const feedbackUrl = "https://t.bilibili.com/545085157213602473";
		const conclusion = [
			"🎤谁啊，真不熟", // 0
			"纯路人了属于是", // 1
			"有点共同爱好了", // 2
			"共同兴趣还不少", // 3
			"共同兴趣还挺多", // 4
			"怎么会事呢", // 5
			"很难不是好兄弟", // 6
			"一家人了属于是", // 7
			"很难不狂暴鸿儒", // 8
			"我擦我不好说", //9
			"克隆人是吧？", // 10
		];

		console.log(`${NAMESPACE} loaded`);

		async function fetchResult(url = "", data = {}) {
			const response = await fetch(url, {
				credentials: "include",
			});
			return response.json();
		}

		function debug(description = "", msg = "", force = false) {
			if (DEBUG || force) {
				console.log(`${NAMESPACE}: ${description}`, msg);
			}
		}

		function formatDate(timestamp) {
			const date =
				timestamp.toString().length === 10
					? new Date(+timestamp * 1000)
					: new Date(+timestamp);
			return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
		}

		function rateColor(percent) {
			return `hsl(${100 - percent}, 70%, 45%)`;
		}

		function percentDisplay(num) {
			return num.toFixed(2).replace(".00", "");
		}

		function sanitize(string) {
			const map = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#x27;",
				"/": "&#x2F;",
			};
			const reg = /[&<>"'/]/gi;
			return string.replace(reg, (match) => map[match]);
		}

		function insertAfter(referenceNode, newNode) {
			referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		}

		function attachEl(wrapper, output) {
			const content = document.createElement("div");
			content.innerHTML = output;

			wrapper.append(content);
		}

		function processFollowings(wrapper, id, output, iteration, following) {
			let outputlist = "";

			fetchResult(
				`${apiBase}/x/relation/same/followings?vmid=${id}&pn=${iteration}`,
			).then((data) => {
				debug("data returned", data);

				if (data.code !== 0) {
					outputlist = data.message;
					attachEl(wrapper, outputlist);
				} else {
					const result = data.data;
					const total = result.total;
					const items = result.list;

					if (items.length > 0) {
						items.map((item) => {
							const name = item.uname;
							const status = item.attribute;
							const uid = item.mid;
							const userSince = item.mtime;
							const userSign = item.sign;
							const avatar = item.face;
							const tag = item.tag;
							const verify = item.official_verify;
							let verifyColor = "#000";
							const vip = item.vip;
							let desc = `我的关注时间：${formatDate(userSince)}\n`;

							if (verify?.type === 0) {
								verifyColor = "#ff8d00";
							} else if (verify?.type === 1) {
								verifyColor = "#30a8fd";
							}

							if (verify?.type !== -1) {
								desc += `认证：${verify.desc}\n`;
							}

							// Remove extra the trailling new line
							desc = desc.trim();

							outputlist += `<div>
<a href="https://space.bilibili.com/${uid}" target="_blank" style="display: flex; align-items: center; margin-bottom: 5px; gap: 5px; color: inherit;">
  <img src="${avatar}" style="width: 24px; height: 24px; border-radius: 2px;" />
  <span style="color: ${verifyColor};" title="${desc}">${name}</span>
  ${item.attribute === 6 ? `<span style="border-radius: 2px; background: #5963d6; color: #fff; width: 12px; height: 12px; font-size: 10px; font-weight: bold; text-align: center; line-height: 1;" title="已互粉">⇄</span>` : ""}
  ${vip?.vipType !== 0 && vip?.vipStatus === 1 ? `<span title="${vip.label.text}\n会员有效期：${formatDate(vip.vipDueDate)}"><img src="${vip.avatar_subscript_url}" style="display: block; width: 12px; height: 12px;" /></span>` : ""}
  <span style="opacity: .6; overflow: hidden; text-overflow: ellipsis; white-space: pre; flex: 1;" title="${sanitize(userSign)}" >${sanitize(userSign.replace(/(?:\r\n|\r|\n)/g, ""))}</span>
</a></div>`;
						});

						debug("try next page", iteration + 1);

						const nextPageRequest = setTimeout(
							() => {
								processFollowings(
									wrapper,
									id,
									output,
									iteration + 1,
									following,
								);
							},
							800 + Math.floor(Math.random() * 600),
						);
					} else {
						debug("loop finished");
						// Attach stats
						attachEl(
							wrapper.querySelector("div"),
							`共同关注：${total}\n相似比：${percentDisplay((total / following) * 100)}%（${conclusion[Math.round((total / following) * 10)]}）`,
						);
					}

					attachEl(wrapper, outputlist);
				}
			});
		}

		function processCard(wrapper) {
			const iteration = 1;
			const resultContent = "";
			const idEl =
				wrapper.querySelector(".face") ||
				wrapper.querySelector(".idc-avatar-container") ||
				wrapper.querySelector(".card-user-name");
			const followingEl =
				wrapper.querySelector(".info .social span") ||
				wrapper.querySelector(".info .social .like") ||
				wrapper.querySelector(".idc-content .idc-meta .idc-meta-item") ||
				wrapper.querySelector(".card-social-info .card-user-attention span");
			let id = "";
			const wrapPadding = "1rem";

			if (idEl) {
				id = idEl.href.match(/\/\/space\.bilibili\.com\/(\d+)/)[1];
			}

			// ensure user id exists
			debug("passed wrapper", wrapper);
			debug("current uid", id);

			if (id) {
				// Create output wrapper and limit height
				const injectWrap = wrapper;
				const contentWrap = document.createElement("div");

				contentWrap.classList.add(`${NAMESPACE}-wrap`);
				contentWrap.style.overflowY = "auto";
				contentWrap.style.maxHeight = "300px";
				contentWrap.style.padding = wrapPadding;
				contentWrap.style.paddingTop = ".5rem";
				contentWrap.style.marginTop = "1rem";
				contentWrap.style.borderTop = "1px solid #eee";

				const banner = document.createElement("div");
				banner.style.paddingBottom = ".5rem";
				banner.style.marginBottom = ".5rem";
				banner.style.borderBottom = "1px solid #eee";
				banner.style.whiteSpace = "pre";
				banner.innerHTML =
					`成分查询-本地查询版（<a href="${feedbackUrl}" target="_blank">问题反馈</a>）` +
					`\n外部查询：<a href="https://laplace.live/user/${id}" target="_blank">laplace</a> / <a href="https://danmakus.com/user/${id}" target="_blank">danmakus</a> / <a href="https://space.bilibili.ooo/${id}" target="_blank">ooo</a>` +
					`\n查询时间：${formatDate(Date.now())}`;
				contentWrap.append(banner);

				// Process followingSum when id is available
				const totalFollowing = followingEl.innerText.match(/(\d+)/)[1];
				debug("following element", followingEl);

				// Inject prepared wrapper
				injectWrap.append(contentWrap);

				processFollowings(
					contentWrap,
					id,
					resultContent,
					iteration,
					totalFollowing,
				);
			}
		}

		// .user-card loads dynamcially. So observe it first
		const wrapperObserver = new MutationObserver((mutationsList, observer) => {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					[...mutation.addedNodes].map((item) => {
						debug("mutation wrapper added", item);

						// Normal card, global, comments avatar, comment mentions, and etc.
						if (item.classList?.contains("user-card")) {
							debug("mutation card detected (global card)", item);
							processCard(item);
						}

						// Following/follower list
						if (item.classList?.contains("idc-info")) {
							const parent = item.parentNode;

							if (parent.getAttribute("id") === "id-card") {
								debug("mutation card detected (following/follower list)", item);
								processCard(parent);
							}
						}

						// Cards in dongtai mentions
						// NOTE: deprecated since Oct 2021. Will fallback to global card
						if (item.classList?.contains("face")) {
							const parent = item.parentNode;

							if (parent.classList?.contains("userinfo-content")) {
								debug("mutation card detected (dynamic dongtai)", item);
								processCard(parent);
							}
						}

						// Cards in author area in video page
						if (item.classList?.contains("user-info-wrapper")) {
							const parent = item.parentNode;

							if (parent.classList?.contains("user-card-m-exp")) {
								debug("mutation card detected (dynamic dongtai)", item);
								processCard(parent);
							}
						}
					});
				}
			}
		});
		wrapperObserver.observe(document.body, {
			attributes: false,
			childList: true,
			subtree: true,
		});
	},
	false,
);
