// ==UserScript==
// @name         哔哩哔哩视频页性能优化
// @namespace    https://www.bilibili.com/
// @version      0.1-beta
// @description  卡顿什么的统统丢掉！自动跳转到静态高性能seopage
// @author       MingMoeQAQ
// @match        http*://www.bilibili.com/video/*
// @run-at       document-start
// @grant        none
// @license      WTFPL

// @downloadURL https://update.greasyfork.org/scripts/403978/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E9%A1%B5%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/403978/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E9%A1%B5%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function() {
	let msg = document.querySelector('.error-container');
	if (!msg) return;
	location.replace(
	location.href.replace(/\:\/\/www\.bilibili\.com\/video/, '://www.bilibili.com/s/video'));
}, false);