// ==UserScript==
// @name         translate-mainonly
// @namespace    https://github.com//translate-mainonly
// @version      0.1
// @description  bing translate and baidu translate mainonly
// @author       liaoran2002
// @match        https://cn.bing.com/*
// @match        https://fanyi.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489930/translate-mainonly.user.js
// @updateURL https://update.greasyfork.org/scripts/489930/translate-mainonly.meta.js
// ==/UserScript==
var e = document.body;
const n = document.head.appendChild(document.createElement("style"));
n.textContent = ".mainonly { outline: 2px solid red; }";
const t = CSS.supports("selector(:has(*))");

function o(n) {
	n instanceof HTMLElement && (e.classList.remove("mainonly"), (e = n).classList.add("mainonly"))
}

function a() {
	if (t) {
		n.textContent = ":not(:has(.mainonly), .mainonly, .mainonly *) { display: none; }";
	} else {
		n.textContent = ":not(.mainonly *, .mainonly-ancestor) { display: none; }";
		var s = e;
		do {
			s.classList.add("mainonly-ancestor")
		} while (s = s.parentElement)
	}
}
try {
	console.log(`%c[translate-mainonly]已加载`, 'color: blue;font-size: large;font-weight: bold;');
	var sss = null;
	if (location.href.includes('cn.bing.com') && location.href.includes('q=%E7%BF%BB%E8%AF%91&')) {
		sss = document.getElementsByClassName('tta_tbl')[0];
	} else if (location.href.includes('fanyi.baidu.com')) {
		sss = document.getElementsByClassName('translate-main')[0];
	}
	if (sss) {
		o(sss);
		a();

	}
} catch (ex) {
	console.error(ex)
}