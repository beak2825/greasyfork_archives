// ==UserScript==
// @name         百度网盘转存窗口扩大
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  百度网盘转存窗口扩大，转存窗口出现前每隔0.5秒检测一次
// @author       卖女孩的小火柴
// @match        https://pan.baidu.com/s/*
// @icon         https://pan.baidu.com/m-static/base/static/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442800/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%BD%AC%E5%AD%98%E7%AA%97%E5%8F%A3%E6%89%A9%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/442800/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%BD%AC%E5%AD%98%E7%AA%97%E5%8F%A3%E6%89%A9%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var interval = setInterval(function() {
		if (document.getElementsByClassName("dialog-fileTreeDialog").length == 1) {
			console.log("发现转存文件树，修改大小位置");
			document.getElementsByClassName("file-tree-container")[0].style.height = "700px";
			document.getElementsByClassName("dialog-fileTreeDialog")[0].style.inset =
				"5% auto auto 25%";
			clearInterval(interval);
			console.log("修改完成，结束循环");
		} else {
			console.log("转存文件树尚未出现");
		}
	}, 500)


})();
