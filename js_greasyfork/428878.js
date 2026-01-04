// ==UserScript==
// @name         BiliAuto
// @version      24.8.15
// @author       mishi321
// @description  B站快捷键扩展 自动关闭顶栏 自动宽屏 2倍速c 减速x 1倍速z
// @match        https://www.bilibili.com/video/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @namespace    https://greasyfork.org/scripts/428878
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428878/BiliAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/428878/BiliAuto.meta.js
// ==/UserScript==

(() => {
	const style = document.createElement("style");
	const 播放器右下方广告 = ".ad-report {display: none !important;}";
	const 宽屏模式创作团队高度调整 = `
.video-info-container[data-v-5120f6b9] {height: 108px !important; padding-top: 22px !important;}
.header {display: none !important;}
.members-info-container {padding-top: 14px !important;}
.membersinfo-upcard-wrap {padding-bottom: 10px !important;}
.bili-danmaku-x-guide-all.bili-danmaku-x-guide.bili-danmaku-x-show {display: none !important;}`;
	const 隐藏顶栏 = "#biliMainHeader {display: none !important;}";
	style.innerHTML += 播放器右下方广告 + 宽屏模式创作团队高度调整;

	const headerClose = GM_getValue("headerClose");
	if (headerClose === true) {
		style.innerHTML += 隐藏顶栏;
	}
	GM_registerMenuCommand(`自动关闭顶栏:${headerClose}`, () => {
		GM_setValue("headerClose", !headerClose);
	});

	let speedIndex = 3;
	const widescreenOn = GM_getValue("widescreenOn");
	GM_registerMenuCommand(`自动宽屏:${widescreenOn}`, () => {
		GM_setValue("widescreenOn", !widescreenOn);
		window.location.reload();
	});
	document.body.addEventListener("keydown", (e) => {
		if (e.target.nodeName !== "BODY") return;
		if (e.ctrlKey === false) {
			switch (e.key) {
				case "c":
					speedIndex = 0;
					document
						.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item")
						[speedIndex].click();
					break;
				case "x":
					if (speedIndex < 5) {
						speedIndex += 1;
					}
					document
						.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item")
						[speedIndex].click();
					break;
				case "z":
					speedIndex = 3;
					document
						.getElementsByClassName("bpx-player-ctrl-playbackrate-menu-item")
						[speedIndex].click();
					break;
				default:
					break;
			}
		}
	});

	document.head.append(style);

	const video = document.getElementsByTagName("video")[0];
	let src = "";
	video.addEventListener("playing", () => {
		console.log("playing");
		if (video.src !== src) {
			console.log("src change");
			const ev1 = setInterval(() => {
				if (video.volume === 0) {
					document
						.getElementsByClassName("bpx-player-ctrl-muted-icon")[0]
						.click();
				}
				if (widescreenOn === true) {
					if (
						document.getElementsByClassName("bpx-state-entered")[0] ===
						undefined
					) {
						document.getElementsByClassName("bpx-player-ctrl-wide")[0].click();
					}
					setTimeout(() => {
						window.scrollTo({
							top: 0,
						});
					}, 2000);
				}
				clearInterval(ev1);
				src = video.src;
			}, 200);
		}
	});
})();
