// ==UserScript==
// @name         BiliJiJiDown
// @namespace    https://www.jijidown.com/
// @version      1.02
// @description  哔哩哔哩“啊叻？视频不见了？”自动跳转
// @author       ghostming
// @match        http*://www.bilibili.com/video/av*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369375/BiliJiJiDown.user.js
// @updateURL https://update.greasyfork.org/scripts/369375/BiliJiJiDown.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function() {
	let msg = document.querySelector('.error-container');
	if (!msg) return;
	location.replace(
	location.href.replace(/\:\/\/www\.bilibili\.com\/video/, '://www.jijidown.com/video'));
}, false);