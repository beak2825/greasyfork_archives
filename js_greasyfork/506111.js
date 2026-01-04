// ==UserScript==
// @name        直播平台自动选择最高画质
// @namespace   live-auto-max-quality
// @version     2.0.0
// @description	看直播时自动选择最高画质
// @author      qianxu
// @match       https://*.huya.com/*
// @match       https://*.douyu.com/*
// @match       https://live.bilibili.com/*
// @icon        https://www.bilibili.com/favicon.ico
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/506111/%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/506111/%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(() => {
	const LOG_PREFIX = "[直播平台自动选择最高画质]";

	const log = (...args) => {
		console.log(LOG_PREFIX, ...args);
	};

	const { host } = window.location;

	let intervalId;

	// 模拟指针悬停
	const simulateHover = (element) => {
		if (!element) return;
		element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
		element.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
	};

	// 模拟指针移出
	const simulateMouseLeave = (element) => {
		if (!element) return;
		element.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
	};

	const handleBilibili = () => {
		intervalId = setInterval(() => {
			// 模拟指针悬停在播放器上
			const playerWrap = document.getElementById(
				"web-player-controller-wrap-el",
			);
			if (!playerWrap) return;
			simulateHover(playerWrap);

			// 模拟指针悬停在画质选择器上
			const qualityWrap = document.querySelector(".quality-wrap");
			if (!qualityWrap) return;
			simulateHover(qualityWrap);

			// 获取画质列表
			const options = document.querySelectorAll(
				".quality-wrap .panel .list-it:not(:has(.video-enhance))",
			);
			if (options && options.length > 0) {
				log(
					"画质列表:",
					Array.from(options).map((opt) => opt.textContent.trim()),
				);

				const topOption = options[0];
				log("切换到最高画质:", topOption.textContent.trim());
				topOption.click();

				// 模拟指针移出播放器
				simulateMouseLeave(playerWrap);

				clearInterval(intervalId);
			}
		}, 1000);
	};

	const handleDouyu = () => {
		intervalId = setInterval(() => {
			// 获取画质选择器
			const inputs = document.getElementsByTagName("input");
			let qualityInput = null;
			for (const input of inputs) {
				if (input.value && input.value.trim() === "画质") {
					qualityInput = input;
					break;
				}
			}
			if (!qualityInput) return;
			const container = qualityInput.parentElement;
			if (!container) return;

			// 获取画质列表
			const options = container.querySelectorAll("li");
			if (options && options.length > 0) {
				log(
					"画质列表:",
					Array.from(options).map((opt) => opt.textContent.trim()),
				);

				const topOption = options[0];
				log("切换到最高画质:", topOption.textContent.trim());
				topOption.click();

				clearInterval(intervalId);
			}
		}, 1000);
	};

	const handleHuya = () => {
		intervalId = setInterval(() => {
			const list = document.querySelector(".player-videotype-list");
			if (list) {
				const options = list.querySelectorAll("li");
				if (options.length > 0) {
					log(
						"画质列表:",
						Array.from(options).map((opt) => opt.textContent.trim()),
					);

					const topOption = options[0];
					log("切换到最高画质:", topOption.textContent.trim());
					topOption.click();

					clearInterval(intervalId);
				}
			}
		}, 1000);
	};

	if (window.top === window.self) {
		if (host.includes("live.bilibili.com")) {
			handleBilibili();
		} else if (host.includes("douyu.com")) {
			handleDouyu();
		} else if (host.includes("huya.com")) {
			handleHuya();
		}

		setTimeout(() => {
			clearInterval(intervalId);
		}, 10000);
	}
})();
