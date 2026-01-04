// ==UserScript==
// @name         手机贴吧？去你妈的！
// @description  将百度搜索弹出的手机贴吧换成对应的pc网页版页面
// @namespace    Fa鸽
// @version      1.0.1
// @author       Fa鸽
// @match        https://tieba.baidu.com/mo/q/posts?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442801/%E6%89%8B%E6%9C%BA%E8%B4%B4%E5%90%A7%EF%BC%9F%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/442801/%E6%89%8B%E6%9C%BA%E8%B4%B4%E5%90%A7%EF%BC%9F%E5%8E%BB%E4%BD%A0%E5%A6%88%E7%9A%84%EF%BC%81.meta.js
// ==/UserScript==

(function() {
	let umo = new URL(window.location);
	let upc = new URL(umo);
	let pid = umo.searchParams.get("pid"),
		tid = umo.searchParams.get("tid");

	upc.pathname = "/p/" + tid;
	upc.searchParams.delete("tid");
	upc.hash = pid;
	console.log('[fuck-motieba] 溜了 ' + upc)
	window.location.replace(upc);
})();