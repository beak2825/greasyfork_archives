// ==UserScript==
// @name         Ukagaka Shell Title Notifier
// @namespace    https://jirehlov.com
// @version      0.1
// @description  检测#robot_speech_js 中包含"你有"时闪烁网页标题，提醒用户有新消息。
// @author       Jirehlov
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506183/Ukagaka%20Shell%20Title%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/506183/Ukagaka%20Shell%20Title%20Notifier.meta.js
// ==/UserScript==
let originalTitle = document.title;
let interval;
function updateTitle() {
	if ($("#robot_speech_js:contains(\"你有\")").length > 0) {
		if (!interval) {
			interval = setInterval(() => {
				document.title = document.title.startsWith("\u3010新消息\u3011") ? originalTitle : "\u3010新消息\u3011" + originalTitle;
			}, 500);
		}
	} else {
		clearInterval(interval);
		interval = null;
		document.title = originalTitle;
	}
}
updateTitle();
new MutationObserver(updateTitle).observe(document.querySelector("#robot_speech_js"), {
	childList: true,
	subtree: true
});