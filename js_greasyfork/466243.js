// ==UserScript==
// @name         UserStatusSub
// @namespace    https://github.com/gui-ying233/UserStatusSub
// @version      1.3.0
// @description  萌娘百科UserStatus订阅
// @author       鬼影233
// @contributor  BearBin@BearBin1215
// @license      MIT
// @match        *.moegirl.org.cn/*
// @icon         https://img.moegirl.org.cn/common/b/b7/%E5%A4%A7%E8%90%8C%E5%AD%97.svg
// @supportURL   https://github.com/gui-ying233/UserStatusSub/issues
// @downloadURL https://update.greasyfork.org/scripts/466243/UserStatusSub.user.js
// @updateURL https://update.greasyfork.org/scripts/466243/UserStatusSub.meta.js
// ==/UserScript==

(() => {
	"use strict";
	if (new URLSearchParams(window.location.search).get("safemode")) return;
	$(() =>
		(async () => {
			window.addEventListener("storage", e => {
				if (e.key === "userStatusSub") {
					if (e.newValue) {
						localStorage.setItem("userStatusSub", e.newValue);
					} else {
						localStorage.removeItem("userStatusSub");
					}
				}
			});

			await mw.loader.using([
				"mediawiki.api",
				"mediawiki.notification",
				"mediawiki.util",
				"oojs-ui",
			]);

			const api = new mw.Api();

			mw.util.addCSS(`.userStatus {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, 11em);
		gap: 1em;
		padding: 1em;
		justify-content: center;
	}

	.userStatusImg {
		width: 25px;
		vertical-align: middle;
	}

	.userStatusRaw {
		display: grid;
		gap: 0.5em;
		border: var(--theme-just-kidding-text-color) dashed 1px;
		padding: 0.5em;
	}

	.userStatusContent {
		max-height: 11em;
		overflow: auto;
		transition: max-height 350ms;
	}

	.userStatusContent:hover {
		max-height: 100%;
	}

	#userStatuUpdate {
		margin: 1em 0;
	}`);

			/**
			 * @return {JSON}
			 */
			function userStatusGetLocalStorage() {
				return Object.values(
					JSON.parse(localStorage.getItem("userStatusSub")) || {}
				);
			}
			async function userStatusSetLocalStorage() {
				if (
					document
						.querySelector("#userStatuSummary > textarea")
						.value.trim()
				) {
					let subList = [];
					for (const t of [
						...new Set(
							document
								.querySelector("#userStatuSummary > textarea")
								.value.trim()
								.split("\n")
								.map(str => str.trim())
								.filter(str => str)
						),
					]) {
						await api
							.get({
								action: "query",
								format: "json",
								prop: "revisions",
								titles: `User:${t}/Status`,
								utf8: 1,
								formatversion: 2,
								rvprop: "timestamp",
							})
							.then(d => {
								if (d.query.pages[0].missing) {
									mw.notify(`用户${t}不存在`, {
										type: "warn",
									});
								} else {
									subList.push({
										title: t,
										timestamp:
											d.query.pages[0].revisions[0]
												.timestamp,
									});
								}
							});
					}
					localStorage.setItem(
						"userStatusSub",
						JSON.stringify(subList)
					);
					document.querySelector("#userStatuSummary > textarea");
				} else {
					localStorage.removeItem("userStatusSub");
				}
			}

			/**
			 * @param {JSON} subList
			 */
			async function updateUserStatus(subList) {
				const userStatusUpdateButton =
					document.getElementById("userStatuUpdate");
				userStatusUpdateButton.style.pointerEvents = "none";
				userStatusUpdateButton.classList.add("oo-ui-widget-disabled");
				userStatusUpdateButton.classList.remove("oo-ui-widget-enabled");
				userStatusUpdateButton.setAttribute("aria-disabled", "true");
				document.body.querySelector(".userStatus").innerHTML = "";
				userStatusSetLocalStorage();
				for (const u of subList) {
					try {
						await api
							.get({
								action: "parse",
								format: "json",
								page: `User:${u.title}/Status`,
								prop: "text",
								disabletoc: 1,
								utf8: 1,
								formatversion: 2,
							})
							.then(d => {
								const userStatusRaw =
									document.createElement("div");
								userStatusRaw.classList.add("userStatusRaw");
								userStatusRaw.innerHTML += d.parse.text;
								switch (
									userStatusRaw.innerText.trim().toLowerCase()
								) {
									case "online":
									case "on":
										userStatusRaw.innerHTML =
											'<img class="userStatusImg" src="https://img.moegirl.org.cn/common/9/94/Symbol_support_vote.svg"> <b style="color:green;">在线</b>';
										break;
									case "busy":
										userStatusRaw.innerHTML =
											'<img class="userStatusImg" src="https://img.moegirl.org.cn/common/c/c5/Symbol_support2_vote.svg"> <b style="color:blue;">忙碌</b>';
										break;
									case "offline":
									case "off":
										userStatusRaw.innerHTML =
											'<img class="userStatusImg" src="https://img.moegirl.org.cn/common/7/7f/Symbol_oppose_vote.svg"> <b style="color:red;">离线</b>';
										break;
									case "away":
										userStatusRaw.innerHTML =
											'<img class="userStatusImg" src="https://img.moegirl.org.cn/common/6/6c/Time2wait.svg"> <b style="color:grey;">已离开</b>';
										break;
									case "sleeping":
									case "sleep":
										userStatusRaw.innerHTML =
											'<img class="userStatusImg" src="https://img.moegirl.org.cn/common/5/54/Symbol_wait.svg"> <b style="color:purple;">在睡觉</b>';
										break;
									case "wikibreak":
									case "break":
										userStatusRaw.innerHTML =
											'<img class="userStatusImg" src="https://img.moegirl.org.cn/common/6/61/Symbol_abstain_vote.svg"> <b style="color:brown;">正在放萌百假期</b>';
										break;
									case "holiday":
										userStatusRaw.innerHTML =
											'<img class="userStatusImg" src="https://img.moegirl.org.cn/common/3/30/Symbol_deferred.svg"> <b style="color:#7B68EE;">处于假期中</b>';
										break;
								}
								userStatusRaw.innerHTML = `<b class="userStatusUserName">${u.title}</b><div class="userStatusContent">${userStatusRaw.innerHTML}</div>`;
								document.body
									.querySelector(".userStatus")
									.append(userStatusRaw);
								userStatusSubDialog.updateSize();
							});
					} catch (e) {
						if (e !== "missingtitle") {
							console.error(e);
						}
					}
				}
				userStatusUpdateButton.style.pointerEvents = "auto";
				userStatusUpdateButton.classList.remove(
					"oo-ui-widget-disabled"
				);
				userStatusUpdateButton.classList.add("oo-ui-widget-enabled");
				userStatusUpdateButton.setAttribute("aria-disabled", "false");
			}

			/* 感谢BearBin@BearBin1215提供的的OOUI部分 */
			const $body = $("body");

			class userStatusSubWindow extends OO.ui.ProcessDialog {
				static static = {
					...super.static,
					tagName: "div",
					name: "userStatus",
					title: "用户状态监控",
					actions: [
						{
							action: "cancel",
							label: "取消",
							flags: ["safe", "close", "destructive"],
						},
						{
							action: "submit",
							label: "保存",
							flags: ["primary", "progressive"],
						},
					],
				};
				constructor(config) {
					super(config);
				}
				initialize() {
					super.initialize();
					this.panelLayout = new OO.ui.PanelLayout({
						scrollable: false,
						expanded: false,
						padded: true,
					});

					const $userStatus = document.createElement("div");
					$userStatus.classList.add("userStatus");

					const $label = document.createElement("p");
					$label.innerText = "订阅列表：";
					const userStatusInputBox =
						new OO.ui.MultilineTextInputWidget({
							placeholder: "仅填写用户名，每个用户名一行",
							id: "userStatuSummary",
							autosize: true,
						});
					const userStatusUpdateButton = new OO.ui.ButtonWidget({
						label: "更新列表",
						flags: ["primary"],
						id: "userStatuUpdate",
					});
					userStatusUpdateButton.on("click", async () => {
						await updateUserStatus(
							userStatusInputBox
								.getValue()
								.trim()
								.split("\n")
								.map(str => str.trim())
								.filter(str => str)
								.map(str => {
									return { title: str };
								})
						);
						this.updateSize();
					});

					this.panelLayout.$element.append(
						$userStatus,
						$label,
						userStatusInputBox.$element,
						userStatusUpdateButton.$element
					);
					this.$body.append(this.panelLayout.$element);
				}

				getActionProcess(action) {
					if (action === "cancel") {
						return new OO.ui.Process(() => {
							this.close({ action });
						}, this);
					} else if (action === "submit") {
						userStatusSetLocalStorage();
						return new OO.ui.Process(() => {
							this.close({ action });
						}, this);
					}
					return super.getActionProcess(action);
				}
			}

			const windowManager = new OO.ui.WindowManager({});
			$body.append(windowManager.$element);
			const userStatusSubDialog = new userStatusSubWindow({
				size: "larger",
			});
			windowManager.addWindows([userStatusSubDialog]);

			mw.util
				.addPortletLink(
					"p-cactions",
					"javascript:void(0);",
					"用户状态监控",
					"ca-userstatussub"
				)
				.addEventListener("click", async () => {
					$("#mw-notification-area").appendTo("body");
					windowManager.openWindow(userStatusSubDialog);
					document.body.querySelector(
						"#userStatuSummary > textarea"
					).value = userStatusGetLocalStorage()
						.map(u => u.title)
						.join("\n");
					await updateUserStatus(userStatusGetLocalStorage());
				});

			const waitTime = 300000;

			var timestamps = {};
			(async () => {
				if (Notification.permission !== "denied") {
					Notification.requestPermission();
				}
				for (const u of userStatusGetLocalStorage()) {
					timestamps[u.title] = u.timestamp;
					setInterval(() => {
						api.get({
							action: "query",
							format: "json",
							prop: "revisions",
							titles: `User:${u.title}/Status`,
							utf8: 1,
							formatversion: 2,
							rvprop: "timestamp|content",
						}).then(d => {
							const timestamp =
								d.query.pages[0].revisions[0].timestamp;
							if (timestamp !== timestamps[u.title]) {
								localStorage.setItem(
									"userStatusSub",
									JSON.stringify(
										userStatusGetLocalStorage()
									).replace(
										`"title":"${u.title}","timestamp":"${
											timestamps[u.title]
										}"`,
										`"title":"${u.title}","timestamp":"${timestamp}"`
									)
								);
								timestamps[u.title] = timestamp;
								let status =
									d.query.pages[0].revisions[0].content
										.trim()
										.toLowerCase();
								switch (status) {
									case "online":
									case "on":
										status = "在线";
										break;
									case "busy":
										status = "忙碌";
										break;
									case "offline":
									case "off":
										status = "离线";
										break;
									case "away":
										status = "已离开";
										break;
									case "sleeping":
									case "sleep":
										status = "在睡觉";
										break;
									case "wikibreak":
									case "break":
										status = "正在放萌百假期";
										break;
									case "holiday":
										status = "处于假期中";
										break;
									default:
										const s = document.createElement("div");
										s.innerHTML = status;
										status = s.innerText;
								}
								new Notification(`${u.title}已更新：`, {
									body: status,
									icon: `//commons.moegirl.org.cn/extensions/Avatar/avatar.php?user=${u.title}`,
								});
							}
						});
					}, waitTime);
					await (() => {
						return new Promise(resolve =>
							setTimeout(
								resolve,
								waitTime / userStatusGetLocalStorage().length
							)
						);
					})();
				}
			})();
		})()
	);
})();
