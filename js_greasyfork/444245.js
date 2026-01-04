// ==UserScript==
// @name         Twitter - Auto Refresh List Page
// @description  Twitter - Auto Refresh List Page.
// @version      0.1
// @author       to
// @namespace    https://github.com/to
// @license      MIT
//
// @match        https://twitter.com/i/lists/*
// @match        https://twitter.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
//
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/444245/Twitter%20-%20Auto%20Refresh%20List%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/444245/Twitter%20-%20Auto%20Refresh%20List%20Page.meta.js
// ==/UserScript==

const TOP_RANGE = 300;
const REFRESH_INTERVAL = 10 * 1000;

var onFrame;
var scrollEvent;

addBefore(unsafeWindow, 'requestAnimationFrame', (callback) => {
	onFrame = callback;
});

window.addEventListener("scroll", (event) => {
	scrollEvent = event;
}, false);

document.addEventListener("visibilitychange", (event) => {
	if(!document.hidden)
        refresh();
}, false);

setInterval(refresh, REFRESH_INTERVAL);

function refresh(){
    // ページの途中まで スクロールされている場合 返る
	if(window.scrollY > TOP_RANGE)
        return;

    // 下方向に疑似的にスクロールする
    // 実際に発生したイベントをコピーしたものを再利用する
    // 疑似的な再描画も発生させる
	window.scrollTo(window.scrollX, 1000);
	document.dispatchEvent(scrollEvent || new Event('scroll'));
	onFrame();

	window.scrollTo(window.scrollX, 0);
}

function addBefore(target, name, before) {
	var original = target[name];
	target[name] = function() {
		before.apply(target, arguments);
		return original.apply(target, arguments);
	}
}