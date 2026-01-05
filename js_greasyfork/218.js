// ==UserScript==
// @name    网页强制复制
// @namespace    https://gitcafe.net/
// @author	无法诉说的吟荡
// @icon	  https://gitcafe.net/favicon.ico
// @version	3.4
// @description	右键强力解锁，可以复制一些特殊网站的文字
// @homepage	https://greasyfork.org/zh-CN/scripts/218
// @include        *
// @run-at        document-end
// @grant          unsafeWindow
// @require        https://cdn.jsdelivr.net/npm/jquery@2.1.0/dist/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/218/%E7%BD%91%E9%A1%B5%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/218/%E7%BD%91%E9%A1%B5%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

function restore() {
	with(document.wrappedJSObject || document) {
		onmouseup = null;
		onmousedown = null;
		oncontextmenu = null
	}
	var arAllElements = document.getElementsByTagName('*');
	for (var i = arAllElements.length - 1; i >= 0; i--) {
		var elmOne = arAllElements[i];
		with(elmOne.wrappedJSObject || elmOne) {
			onmouseup = null;
			onmousedown = null
		}
	}
}
window.addEventListener('load', restore, true);

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style)
}
addGlobalStyle("html, * {-moz-user-select:text!important;}");