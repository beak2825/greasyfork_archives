// ==UserScript==
// @name         最穩popcat click腳本
// @namespace    http://tampermonkey.net/
// @version      V1
// @description  沒想到有台灣作者吧
// @author       寂寞0.0
// @match        https://popcat.click/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430681/%E6%9C%80%E7%A9%A9popcat%20click%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/430681/%E6%9C%80%E7%A9%A9popcat%20click%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

var event = new KeyboardEvent('keydown', {
	key: 'g',
	ctrlKey: true
});

setInterval(function(){
	for (var a = 0; a < 120; a++) {
		document.dispatchEvent(event);
	}
}, 0);