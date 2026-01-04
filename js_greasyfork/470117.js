// @license MIT
// ==UserScript==
// @name         通威知学云
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一直在知学云上学习，不会跳出弹窗中端
// @author       Sleepycat
// @match        https://tongwei-solar.yunxuetang.cn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twmodule.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470117/%E9%80%9A%E5%A8%81%E7%9F%A5%E5%AD%A6%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/470117/%E9%80%9A%E5%A8%81%E7%9F%A5%E5%AD%A6%E4%BA%91.meta.js
// ==/UserScript==

(function() {

	setInterval(autoContinue, 1000);
	function autoContinue() {

		var continueBtn = document.querySelector(".alert-wrapper.new-alert-wrapper .btn-ok.btn");
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