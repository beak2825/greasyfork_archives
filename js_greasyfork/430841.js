// ==UserScript==
// @name 云学堂视频不暂停
// @version 0.21
// @description 自动跳过云学堂继续学习的弹窗
// @match *://*.yunxuetang.cn/*
// @match *://*.yxt.cn/*
// @match *://*.yunxuetang.com/*
// @match *://*.yxt.com/*
// @author       海北里
// @namespace    haibeili.com
// @downloadURL https://update.greasyfork.org/scripts/430841/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/430841/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {

	setInterval(autoContinue, 1000);
	function autoContinue() {

		var continueBtn = document.querySelector("#reStartStudy");
		if (continueBtn && continueBtn.click) {

			var imitateMousedown = document.createEvent("MouseEvents");
			imitateMousedown.initEvent("mousedown", true, true);
			continueBtn.dispatchEvent(imitateMousedown);
			continueBtn.click();

			if (console && console.log) {
				console.log('找到并点击了[继续学习]');
			}
		}
	}
})();