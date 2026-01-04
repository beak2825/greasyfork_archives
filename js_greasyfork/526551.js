// ==UserScript==
// @name         BiliBili 快进按钮
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在播放器底部加上快进按钮
// @author       isixe
// @license      MIT
// @supportURL   blog.itea.dev
// @match        https://www.bilibili.com/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526551/BiliBili%20%E5%BF%AB%E8%BF%9B%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/526551/BiliBili%20%E5%BF%AB%E8%BF%9B%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const defaultJumpList = [15, 30, 85];
	let jumpList = GM_getValue("jumpList", defaultJumpList);

	GM_registerMenuCommand("设置跳转列表", () => {
		const userInput = prompt("请输入跳转时间列表（以逗号分隔）", jumpList.join(","));
		if (userInput === "" || userInput === null) {
			return;
		}
		const newJumpList = userInput
			.split(",")
			.map((n) => parseInt(n, 10))
			.filter((n) => !isNaN(n) && n > 0);
		if (newJumpList.length === 0) {
			alert("格式错误或列表为空！");
			return;
		}
		jumpList = newJumpList;
		GM_setValue("jumpList", jumpList);
		alert("跳转列表已更新！");
		location.reload();
	});

	const videoTarget = document.querySelector(".bpx-player-video-wrap video");
	const controlTarget = document.querySelector(".bpx-player-control-bottom-right");
	const jumpControl = document.createElement("div");
	jumpControl.className = "jump-control";
	Object.assign(jumpControl.style, {
		gap: "5px",
		height: "35px",
		display: "flex",
		alignItems: "start",
		flexDirection: "row",
		margin: "0 10px",
	});
	controlTarget.appendChild(jumpControl);

	jumpList.forEach((seconds) => {
		const jumpBtn = document.createElement("div");
		const jumpIcon = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="white" stroke-width="5" fill="none" />
            <text x="47" y="69" font-size="50" text-anchor="middle" fill="white">${seconds}</text>
        </svg>`;
		jumpBtn.innerHTML = jumpIcon;
		Object.assign(jumpBtn.style, {
			display: "flex",
			color: "#ffffff",
			fontWeight: "700",
			cursor: "pointer",
			alignItems: "center",
			justifyContent: "center",
		});
		jumpControl.appendChild(jumpBtn);
		jumpBtn.onclick = () => {
			const currentTime = videoTarget.currentTime;
			const targetTime = currentTime + seconds;
			videoTarget.currentTime = targetTime;
		};

		const jumpBtnIcon = jumpBtn.querySelector("svg");
		Object.assign(jumpBtnIcon.style, {
			width: "22px",
			height: "22px",
		});
	});
})();
