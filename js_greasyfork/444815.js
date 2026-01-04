// ==UserScript==
// @name Coupang mobile to desktop
// @name:ko 쿠팡 모바일 링크를 데스크톱 링크로 변경
// @description Redirect mobile links to desktop links on Coupang. Useful for when you save/share a link from your phone but view the page on your desktop PC.
// @description:ko 쿠팡 모바일웹사이트에서 쿠팡 PC버전으로 URL을 리디렉션
// @match https://m.coupang.com/*
// @run-at document-start
// @version 2.0
// @namespace https://10wontips.blogspot.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444815/Coupang%20mobile%20to%20desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/444815/Coupang%20mobile%20to%20desktop.meta.js
// ==/UserScript==

// Modified from: https://greasyfork.org/en/discussions/requests/55817-replace-string-in-an-url#comment-144849

if (window.top !== window.self)	   // Don’t run in frames.
	return;

var currentURL = location.href;

if (currentURL.match("m.coupang.com/nm")) {
	location.href = location.href.replace("m.coupang.com/nm", "coupang.com/np");
};

if (currentURL.match("m.coupang.com/vm")) {
	location.href = location.href.replace("m.coupang.com/vm", "coupang.com/vp");
};

// end of script