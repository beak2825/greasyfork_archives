// ==UserScript==
// @name         AutoJump
// @name:zh-CN   自动跳转第三方URL
// @namespace    https://greasyfork.org/zh-CN/scripts/440863-autojump
// @version      1.7
// @description  为了应对QQ,知乎,简书...等网站不自动跳转第三方URL的问题
// @author       Antecer
// @include      *
// @icon64       https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @icon         https://antecer.gitlab.io/amusingdevice/icon/antecer.ico
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440863/AutoJump.user.js
// @updateURL https://update.greasyfork.org/scripts/440863/AutoJump.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// 跳转到目标网页
	function jumpTo(url) {
		window.history.pushState(null, null, window.top.location.href); // 保存历史记录,方便回退网页
		document.documentElement.innerHTML = `正在跳转到目标网站...<br>${url}`;
		window.top.location.href = url;
	}
	// 页面网址
	var fromUrl = window.location.origin + window.location.pathname;
	// 规则列表
	var fromUrls = {
		'https://c.pc.qq.com/middlem.html': /(?<=pfurl=)[^&]+/, // QQ
		'https://link.zhihu.com/': /(?<=target=)[^&]+/, // 知乎
		'https://www.jianshu.com/go-wild': /(?<=url=)[^&]+/, // 简书
		'https://link.csdn.net/': /(?<=target=)[^&]+/, // csdn
	}
	// 查找规则并跳转到目标网页
	if (fromUrls[fromUrl]) {
		let jumpMatch = window.location.search.match(fromUrls[fromUrl]);
		if (jumpMatch) jumpTo(decodeURIComponent(jumpMatch[0]));
	}
	// 贴吧跳转页(贴吧跳转url加密了,需要特殊对待)
	if (fromUrl == 'http://jump2.bdimg.com/safecheck/index') {
		var timer = self.setInterval(() => {
			console.log('等待body加载...');
			if (document.body) {
				clearInterval(timer);
				let html = document.documentElement.outerHTML;
				let jumpMatch = html.match(/(?<=class="link">)[^<]+/);
				if (jumpMatch) jumpTo(jumpMatch[0]);
			}
		}, 100);
	}
})();