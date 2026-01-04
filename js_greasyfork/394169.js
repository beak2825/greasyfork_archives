// ==UserScript==
// @name         偶像大师闪耀色彩BGM保持器
// @name:en      THE IDOLM@STER SHINY COLORS BGM Keeper
// @version      1.0.3
// @description  保持闪耀色彩BGM在后台播放
// @description:en  Keep ShinyColors BGM on at focus lost
// @icon         https://shinycolors.enza.fun/icon_192x192.png
// @original_author       biuuu
// @author       pikakolendo02
// @match        https://shinycolors.enza.fun/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/428281
// @downloadURL https://update.greasyfork.org/scripts/394169/%E5%81%B6%E5%83%8F%E5%A4%A7%E5%B8%88%E9%97%AA%E8%80%80%E8%89%B2%E5%BD%A9BGM%E4%BF%9D%E6%8C%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/394169/%E5%81%B6%E5%83%8F%E5%A4%A7%E5%B8%88%E9%97%AA%E8%80%80%E8%89%B2%E5%BD%A9BGM%E4%BF%9D%E6%8C%81%E5%99%A8.meta.js
// ==/UserScript==

(function () {

	const keepBgm = () => {
	  window.addEventListener('blur', function (e) {
	    e.stopImmediatePropagation();
	  }, false);
	  document.addEventListener('visibilitychange', function (e) {
	    e.stopImmediatePropagation();
	  });
	};

	keepBgm();

}());
