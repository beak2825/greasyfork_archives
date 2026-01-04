// ==UserScript==
// @name         SubHD 直接跳转 豆瓣
// @namespace    douban Direct Link on SubHD
// @run-at      start
// @match       *://subhd.tv/*
// @version     1.1
// @author      uJZk
// @description huo720.com 重定向至 movie.douban.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/452075/SubHD%20%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%20%E8%B1%86%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/452075/SubHD%20%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%20%E8%B1%86%E7%93%A3.meta.js
// ==/UserScript==

function replaceLink(event)
{
	const anchor = event.target.closest('a');
	if (anchor && anchor.href) {
		anchor.href = anchor.href.replace("https://huo720.com/sub/", "https://movie.douban.com/subject/")
	}
}

addEventListener('click', replaceLink, true);
addEventListener('auxclick', replaceLink, true);