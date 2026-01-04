// ==UserScript==
// @name         GitHub工程快捷载入在线VS Code
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  F1载入‘github1s’，F2载入‘gitpod.io’
// @author       You
// @match        https://github.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444591/GitHub%E5%B7%A5%E7%A8%8B%E5%BF%AB%E6%8D%B7%E8%BD%BD%E5%85%A5%E5%9C%A8%E7%BA%BFVS%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/444591/GitHub%E5%B7%A5%E7%A8%8B%E5%BF%AB%E6%8D%B7%E8%BD%BD%E5%85%A5%E5%9C%A8%E7%BA%BFVS%20Code.meta.js
// ==/UserScript==

window.onload = function() {
	document.addEventListener('keydown', function(e) {
		var event = e ? e: window.event;
		var currKey = event.keyCode || event.which || event.charCode;
		// console.log(currKey);
		var url;
		if (currKey == 112) { // F1按键快捷打开 1s
			url = window.location.href;
			window.open('https://github1s' + url.substring(14), '_blank');
		} else if (currKey == 113) { // F2按键快捷打开 gitpod
			url = window.location.href;
			window.open('https://gitpod.io/#/' + url.substring(8), '_blank');
		}
	});
};