// ==UserScript==
// @name        网页标题笔记
// @version     0.1.0.1
// @icon        https://tampermonkey.net/favicon.ico
// @description 将选中文字添加到网页标题最前面，以便在浏览器标签栏快速识别
// @author      You!
// @grant       unsafeWindow
// @include     *
// @run-at      document-start
// @namespace   https://greasyfork.org/zh-CN/scripts/369580-网页标题笔记
// @downloadURL https://update.greasyfork.org/scripts/369580/%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/369580/%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
	document.addEventListener('keydown', function() {
		if (192 !== event.keyCode) return;

		if (event.ctrlKey && !event.altKey && !event.shiftKey) setTitleNote(); //替换添加：Ctrl
		else if (!event.ctrlKey && event.altKey && !event.shiftKey) setTitleNote(true); //正向添加：Alt
		else if (event.ctrlKey && event.altKey && !event.shiftKey) setTitleNote(false); //反向添加：Ctrl + Alt
		else if (event.ctrlKey && !event.altKey && event.shiftKey) clearTitleNote(); //清除笔记：Ctrl + Shift

		function getSelectionTxt() {
			var txt = unsafeWindow.getSelection().toString().trim();
			return txt.length ? txt : null;
		}
		function getNote(txt, append) {
			if ('boolean' !== typeof append) {
				unsafeWindow.txts = [txt];
				return txt;
			} else {
				if (undefined === unsafeWindow.txts) unsafeWindow.txts = [];
				if (append) unsafeWindow.txts.push(txt);
				else unsafeWindow.txts.unshift(txt);
			}
			return unsafeWindow.txts.join('|');
		}
		function getOriginalTitle() {
			if (undefined === unsafeWindow.title0) unsafeWindow.title0 = document.title;
			return unsafeWindow.title0;
		}
		function setTitleNote(append) {
			var txt = getSelectionTxt();
			if (!txt) return;
			document.title = getNote(txt, append) + '▶' + getOriginalTitle();
		}
		function clearTitleNote() {
			if (undefined !== unsafeWindow.title0) document.title = unsafeWindow.title0;
			delete unsafeWindow.txts;
		}
	});
}());
