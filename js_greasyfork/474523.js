// ==UserScript==
// @name         Bilibili live enhance
// @namespace    https://github.com/lxl66566
// @supportURL   https://github.com/lxl66566/Bilibili-live-enhance
// @homepageURL  https://github.com/lxl66566/Bilibili-live-enhance
// @contributionURL https://github.com/lxl66566/Bilibili-live-enhance/issues
// @version      1.1.0
// @description  哔哩哔哩直播增强
// @author       lxl66566
// @connect      live.bilibili.com
// @match        *://live.bilibili.com/*
// @exclude      *://live.bilibili.com/?*
// @exclude      *://live.bilibili.com/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474523/Bilibili%20live%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/474523/Bilibili%20live%20enhance.meta.js
// ==/UserScript==

(function () {
	// rome-ignore lint/suspicious/noRedundantUseStrict: <explanation>
	"use strict";
	console.log("--------- begin Bilibili live enhance ---------");
	const hide_first = (class_string) => {
		document
			.querySelector(`.${class_string?.trim().replaceAll(" ", ".")}`)
			?.remove();
	};
	const hide_all = (class_string) => {
		document
			.querySelectorAll(`.${class_string?.trim().replaceAll(" ", ".")}`)
			?.forEach((element) => {
				element.remove();
			});
	};

	new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 3000); // 加载后才可清理
	}).then(() => {
		hide_first("awesome-pk-box");
		hide_all("right-ctnr");
		hide_first("gift-item");
		hide_first("flip-view over-hidden");
		hide_first("left-part-ctnr vertical-middle dp-table");
		hide_first("right-section");
		hide_first("web-player-icon-feedback");
		hide_first("live-haruna-ctnr z-live-haruna");
		hide_first("web-player-icon-roomStatus");

		// 隐藏礼物栏
		const addGlobalStyle = (css) => {
			const head = document.getElementsByTagName("head")[0];
			const style = document.createElement("style");
			style.innerHTML = css;
			head?.appendChild(style);
		};
		// 面板不会被遮挡
		addGlobalStyle(".package-gift-panel-position { z-index: 99 !important; }");
		const giftbar = document.querySelector(
			".gift-control-section.z-gift-control-section.bg-bright-filter",
		);
		const gift_parent = giftbar?.parentNode;
		const packages = document.querySelector(".item.z-gift-package");
		giftbar.remove();
		// temp 默认监听包裹事件
		const temp = document.createElement("div");
		temp.setAttribute("data-upgrade-intro", "giftPackage");
		temp.setAttribute("class", "item z-gift-package");
		temp.setAttribute("style", "margin-left: 95%;");
		temp.appendChild(packages);
		packages && gift_parent?.appendChild(temp);

		// f 全屏
		document.addEventListener(
			"keydown",
			(e) => {
				if (e.key !== "f") return;
				const vp = document.querySelector("video[id^='video']");
				document.fullscreenElement
					? document.exitFullscreen?.() ??
					  document.webkitExitFullscreen?.() ??
					  document.mozCancelFullScreen?.()
					: vp.requestFullscreen?.() ??
					  vp.webkitRequestFullscreen?.() ??
					  vp.mozRequestFullScreen?.();
			},
			true,
		);

		// 自动原画, source: https://greasyfork.org/zh-CN/scripts/469089-b站直播自动原画切换
		const { quality, qualityCandidates } = window.livePlayer.getPlayerInfo();
		const maxQuality = qualityCandidates[0].qn;
		if (quality !== maxQuality) {
			window.livePlayer.switchQuality(maxQuality);
		}

		console.log("--------- end Bilibili live enhance ---------");
	});
})();
