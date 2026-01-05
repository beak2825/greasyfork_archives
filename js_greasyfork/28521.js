// ==UserScript==
// @name         百度贴吧只看楼主
// @namespace    http://saber.love/?p=3427
// @version      1.0
// @description  在帖子的任何地方，按下Alt+L组合键即可自动点击“只看楼主”，不用再翻到帖子顶部去点击啦
// @author       雪见仙尊
// @include      http://tieba.baidu.com/p/*
// @include      https://tieba.baidu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28521/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%8F%AA%E7%9C%8B%E6%A5%BC%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/28521/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%8F%AA%E7%9C%8B%E6%A5%BC%E4%B8%BB.meta.js
// ==/UserScript==
document.addEventListener("keydown", function(event) {
	var ev = event || window.event;
	if (ev.altKey&&ev.keyCode==76) {
		document.querySelector("#lzonly").click();
	}
}, false);