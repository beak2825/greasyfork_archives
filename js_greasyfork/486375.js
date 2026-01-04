// ==UserScript==
// @name         YoutubePlus - 显评论昵称/100%音量增强/一键倍速按钮/自动切换Premium画质/删除迷你播放器按钮
// @namespace    https://github.com/xlch88/YoutubePlus
// @author       Dark495 (https://dark495.me/)
// @version      2025-02-18
// @license      WTFPL
// @description  增强Youtube使用体验
// @author       Dark495
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/486375/YoutubePlus%20-%20%E6%98%BE%E8%AF%84%E8%AE%BA%E6%98%B5%E7%A7%B0100%25%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E4%B8%80%E9%94%AE%E5%80%8D%E9%80%9F%E6%8C%89%E9%92%AE%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2Premium%E7%94%BB%E8%B4%A8%E5%88%A0%E9%99%A4%E8%BF%B7%E4%BD%A0%E6%92%AD%E6%94%BE%E5%99%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/486375/YoutubePlus%20-%20%E6%98%BE%E8%AF%84%E8%AE%BA%E6%98%B5%E7%A7%B0100%25%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E4%B8%80%E9%94%AE%E5%80%8D%E9%80%9F%E6%8C%89%E9%92%AE%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2Premium%E7%94%BB%E8%B4%A8%E5%88%A0%E9%99%A4%E8%BF%B7%E4%BD%A0%E6%92%AD%E6%94%BE%E5%99%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
	"use strict";

	let player;
	let volumePanel;
	let volumeSlider;
	let commentWatcher;

	const functions = {
		maxVolume: {
			name: "真正100%音量",
			enable: true,
		},
		speedButton: {
			name: "一键倍速按钮",
			enable: true,
		},
		speed3Button: {
			name: "3倍速按钮(需先开启倍速按钮)",
			enable: false,
		},
		premiumQuality: {
			name: "自动切换会员画质",
			enable: true,
		},
		hidePiPButton: {
			name: "隐藏画中画/迷你播放器按钮",
			enable: true,
		},
		showNickname: {
			name: "显示评论者昵称",
			enable: true,
		},
		hideCeElement: {
			name: "半透明结尾的推荐视频/作者",
			enable: true,
		},
	};
	let menuIds = [];
	for (const key of Object.keys(functions)) {
		functions[key].enable = GM_getValue(`function_${key}_enable`, functions[key].enable);
	}

	function registerMenu() {
		menuIds.forEach((v) => {
			GM_unregisterMenuCommand(v);
		});
		menuIds = [];

		menuIds.push(
			GM_registerMenuCommand(`😘 当前版本 ${GM_info.script.version}`, function () {
				window.GM_openInTab("https://greasyfork.org/zh-CN/scripts/486375", {
					active: true,
					insert: true,
					setParent: true,
				});
			})
		);

		for (const [key, info] of Object.entries(functions)) {
			menuIds.push(GM_registerMenuCommand(`${info.enable ? "✅" : "❌"} ${info.name}`, () => menuEvent(key)));
		}
	}

	function menuEvent(key) {
		functions[key].enable = !functions[key].enable;
		GM_setValue(`function_${key}_enable`, functions[key].enable);

		switch (key) {
			case "maxVolume":
				if (functions.maxVolume.enable) {
					setVolume();
				} else {
					volumeSlider.style.backgroundColor = "white";
					document.querySelector("#movie_player").setVolume(document.querySelector("#movie_player").getVolume());
				}
				break;

			case "speedButton":
				if (functions.speedButton.enable) {
					addSpeedButton();
				} else {
					document.querySelector(".ytp-speed-button").remove();
				}
				break;

			case "speed3Button":
				if (functions.speed3Button.enable) {
					document.body.classList.add("ytp-show-speed3button");
				} else {
					document.body.classList.remove("ytp-show-speed3button");
				}
				break;

			case "premiumQuality":
				if (functions.premiumQuality.enable) {
					switchToPremiumQuality();
				}
				break;

			case "hidePiPButton":
				if (functions.hidePiPButton.enable) {
					hidePiPButton();
				} else {
					document.body.classList.remove("ytp-hide-pip-button");
				}
				break;

			case "showNickname":
				if (functions.showNickname.enable) {
					registerCommentWatcher();
				} else {
					commentWatcher.disconnect();
					commentWatcher = null;
				}
				break;

			case "hideCeElement":
				if (functions.hideCeElement.enable) {
					document.body.classList.add("ytp-hide-ce-element");
				} else {
					document.body.classList.remove("ytp-hide-ce-element");
				}
				break;
		}

		registerMenu();
	}

	if (!document.querySelector("style.youtube-plus-style")) {
		const speedButtonSvg = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1737240990275" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4235" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M512 512a53.44 53.44 0 0 1-17.4 39.413333L131.933333 882a52.833333 52.833333 0 0 1-35.713333 14 53.84 53.84 0 0 1-21.76-4.666667A52.666667 52.666667 0 0 1 42.666667 842.593333V181.406667A53.333333 53.333333 0 0 1 131.926667 142l362.666666 330.6A53.44 53.44 0 0 1 512 512z m451.933333-39.413333L601.26 142A53.333333 53.333333 0 0 0 512 181.406667v661.186666a52.666667 52.666667 0 0 0 31.793333 48.793334 53.84 53.84 0 0 0 21.76 4.666666 52.833333 52.833333 0 0 0 35.713334-14l362.666666-330.6a53.333333 53.333333 0 0 0 0-78.826666z" fill="#ffffff" p-id="4236"></path></svg>`;
		const style = document.createElement("style");
		style.className = "youtube-plus-style";
		style.textContent = `
			div.ytp-speed-button{
				display:flex;
			}
			span.ytp-speed-button{
				width: 48px;
				height: 48px;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				cursor: pointer;
			}
			span.ytp-speed-button::before{
				content: "";
				background:url('data:image/svg+xml;utf8,${encodeURIComponent(speedButtonSvg)}');
				width: 20px;
				height: 20px;
				background-size: contain;
			}
			span.ytp-speed-button::after{
				content: "1x";
				position: absolute;
				top: -7px;
				left: 28px;
				font-size: 12px;
				transform: scale(0.8);
				color: white;
				pointer-events: none;
				text-align: left;
			}
			span.ytp-speed-button-active::after{
				color: red;
			}
			span.ytp-speed-button-05x::after{
				content: "0.5x";
			}
			span.ytp-speed-button-1x::after{
				content: "1x";
			}
			span.ytp-speed-button-15x::after{
				content: "1.5x";
			}
			span.ytp-speed-button-2x::after{
				content: "2x";
			}
			span.ytp-speed-button-3x{
				display: none;
			}
			span.ytp-speed-button-3x::after{
				content: "3x";
			}
			
			.yt-plus-nickname{ color: #0f0f0f; }
			.yt-plus-username{ color: rgba(0, 0, 0, 0.4); margin-left: 5px; }
			ytd-author-comment-badge-renderer[creator] .yt-plus-nickname{ color:unset; }
			ytd-author-comment-badge-renderer[creator] .yt-plus-username{ color:unset; opacity: 0.4; }
			
			body.ytp-hide-pip-button .ytp-pip-button{ display:none!important; }
			body.ytp-hide-pip-button .ytp-miniplayer-button{ display:none!important; }
			body.ytp-hide-pip-button .ytp-size-button{ display:none!important; }
			body.ytp-show-speed3button .ytp-speed-button-3x{ display:flex; }

            body.ytp-hide-ce-element .ytp-ce-element{ opacity: 0.3!important; }
            body.ytp-hide-ce-element .ytp-ce-element.ytp-ce-element-hover{ opacity: 1!important; }
		`;
		document.head.appendChild(style);
	}

	// =====================================================================================================

	function registerCommentWatcher() {
		if (commentWatcher) {
			commentWatcher.disconnect();
		}

		commentWatcher = new MutationObserver((mutationsList, observer) => {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					mutation.addedNodes.forEach((v) => {
						if (v?.tagName?.toLowerCase() === "ytd-comment-view-model") {
							let author = v.querySelector("#author-comment-badge"),
								url,
								username;
							if (author && author.childElementCount > 0) {
								url = author.querySelector("a#name").href;
								username = author.querySelector("yt-formatted-string").title;
								author = author.querySelector("yt-formatted-string");
							} else {
								author = v.querySelector("#author-text");
								url = author.href;
								username = author.querySelector("span").innerText.trim();
							}

							fetch(url)
								.then((v) => {
									return v.text();
								})
								.then((v) => {
									const result = /<meta property="og:title" content="(.*?)">/.exec(v);
									if (result) {
										const nicknameNode = document.createElement("span");
										nicknameNode.textContent = result[1];
										nicknameNode.className = "yt-plus-nickname";

										const usernameNode = document.createElement("span");
										usernameNode.textContent = username;
										usernameNode.className = "yt-plus-username";

										author.replaceChildren(nicknameNode, usernameNode);
									}
								})
								.catch((e) => {
									console.log("change name error", e);
								});
						}
					});
				}
			}
		});

		commentWatcher.observe(document.querySelector("ytd-comments #contents"), {
			childList: true,
			subtree: true,
		});
	}

	function hidePiPButton() {
		document.body.classList.add("ytp-hide-pip-button");
	}

	function setVolume() {
		if (!functions.maxVolume.enable) return;

		if (parseInt(volumePanel.getAttribute("aria-valuenow")) === 100) {
			volumeSlider.style.backgroundColor = "red";
			if (player.volume !== 1) {
				player.volume = 1;
				console.log("[Youtube真正100%音量] 设置成功！", player, parseInt(volumePanel.getAttribute("aria-valuenow")));
			}
		} else {
			volumeSlider.style.backgroundColor = "white";
		}
	}

	function switchToPremiumQuality() {
		const qualityList = [];
		if (unsafeWindow?.ytInitialPlayerResponse?.playabilityStatus?.paygatedQualitiesMetadata?.qualityDetails) {
			unsafeWindow.ytInitialPlayerResponse.playabilityStatus.paygatedQualitiesMetadata.qualityDetails.forEach((v) => {
				qualityList.push(v.key);
			});

			console.log("[YoutubePlus]", "获取到会员画质列表:", qualityList);
		} else {
			console.log("[YoutubePlus]", "此视频无会员画质或未开通会员。");
		}

		const nowQuality = document.querySelector("#movie_player").getPlaybackQualityLabel().replace(" Premium", ""); // 嗯，会骗，实际上根本就没切
		console.log("[YoutubePlus]", "当前画质:", nowQuality);
		if (qualityList.includes(`${nowQuality} Premium`)) {
			document.querySelector(".ytp-settings-button").click();
			if (!document.querySelector(".ytp-quality-menu")) {
				document.querySelector(".ytp-panel-menu .ytp-menuitem:last-of-type").click();
			}

			const qualityList = {};
			document.querySelector(".ytp-quality-menu .ytp-panel-menu").childNodes.forEach((v, i) => {
				const name = v.querySelector("span").firstChild.textContent.trim();

				qualityList[name] = i;
			});

			document.querySelector(".ytp-quality-menu .ytp-panel-menu").childNodes[qualityList[`${nowQuality} Premium`]].click();
			console.log("[YoutubePlus]", "切换到画质:", `${nowQuality} Premium`);
		}
	}

	function addSpeedButton() {
		if (document.querySelector(".ytp-speed-button")) return;

		const controls = document.getElementsByClassName("ytp-left-controls")[0];
		let speedButtonActive = 0;
		try {
			speedButtonActive = parseFloat(JSON.parse(sessionStorage.getItem("yt-player-playback-rate")).data);
		} catch {}

		const speedButtonDiv = document.createElement("div");
		speedButtonDiv.className = "ytp-speed-button";
		const speedButtons = [];
		for (let speed of [0.5, 1, 1.5, 2, 3]) {
			const speedButton = document.createElement("span");
			speedButton.className = `ytp-speed-button ytp-speed-button-${speed.toString().replace(".", "")}x`;
			speedButtonDiv.appendChild(speedButton);
			speedButton.onclick = () => {
				if (speed > 2) {
					player.playbackRate = speed;
					console.log("[YoutubePlus]", "超级倍速:", speed);
				} else {
					player.playbackRate = speed; // 设置为3倍速后需要用这个还原
					console.log("[YoutubePlus]", "普通倍速:", speed);
					document.querySelector("#movie_player").setPlaybackRate(speed);
					sessionStorage.setItem(
						"yt-player-playback-rate",
						JSON.stringify({
							data: speed.toString(),
							creation: new Date().getTime(),
						})
					);
				}
				speedButtons.forEach((v) => {
					v.classList.remove("ytp-speed-button-active");
				});
				speedButton.classList.add("ytp-speed-button-active");
			};
			if (speedButtonActive === speed) speedButton.classList.add("ytp-speed-button-active");
			speedButtons.push(speedButton);
		}
		controls.parentNode.insertBefore(speedButtonDiv, controls.nextSibling);
	}

	setInterval(() => {
		player = document.getElementsByClassName("video-stream")[0];
		volumePanel = document.getElementsByClassName("ytp-volume-panel")[0];
		volumeSlider = document.getElementsByClassName("ytp-volume-slider-handle")[0];

		if (player && volumePanel && volumeSlider) {
			if (!player.isHookYoutubePlus) {
				player.isHookYoutubePlus = true;

				player.addEventListener("volumechange", () => {
					setVolume();
				});

				if (functions.speedButton.enable) {
					addSpeedButton();
				}
				if (functions.premiumQuality.enable) {
					switchToPremiumQuality();
				}
				if (functions.hidePiPButton.enable) {
					hidePiPButton();
				}
				if (functions.speed3Button.enable) {
					document.body.classList.add("ytp-show-speed3button");
				}
				if (functions.hideCeElement.enable) {
					document.body.classList.add("ytp-hide-ce-element");
				}
			}

			let comment = document.querySelector("ytd-comments #contents");
			if (comment) {
				if (!comment.isHookYoutubePlus_Comment) {
					comment.isHookYoutubePlus_Comment = true;

					if (functions.showNickname.enable) {
						registerCommentWatcher();
					}
				}
			}

			setVolume();
		}
	}, 300);

	registerMenu();
})();
