// ==UserScript==
// @name         gamerUP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  巴哈姆特动画疯自动跳过年龄限制选项脚本
// @author       Yi MIT
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491702/gamerUP.user.js
// @updateURL https://update.greasyfork.org/scripts/491702/gamerUP.meta.js
// ==/UserScript==

(function() {
	let t = setInterval(function() {
		let btnAgree = document.querySelector(".choose-btn-agree");
		if (btnAgree !== null) {
			btnAgree.click();
			//clearInterval(t);
		}
	}, 1000);
})();