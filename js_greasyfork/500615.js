// ==UserScript==
// @name         4399小游戏直链助手
// @namespace    github.com/hmjz100
// @version      0.1
// @description  flash已死，给4399游戏页面增加SWF或直链按钮
// @author       hmjz100
// @match        *://www.4399.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @require      https://unpkg.com/jquery@3.6.3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/500615/4399%E5%B0%8F%E6%B8%B8%E6%88%8F%E7%9B%B4%E9%93%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/500615/4399%E5%B0%8F%E6%B8%B8%E6%88%8F%E7%9B%B4%E9%93%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var originalDocumentWrite = unsafeWindow.document.write;
	unsafeWindow.document.write = function (content) {
		if (content.toString() && content.toString().includes('antijs')) {
			return console.log(content, '检测到防调试脚本，阻止其执行。');
		}
		originalDocumentWrite.apply(document, arguments);
	};


	let timer = setInterval(() => {
		if (!unsafeWindow.webServer && !unsafeWindow._strGamePath) return;
		clearInterval(timer)
		if (unsafeWindow._strGamePath.includes(".swf")) {
			$(document.body).append($(`
				<style>
					a.downloadGame {
						position: fixed;
						z-index: 2147483647;
						bottom: 5%;
						right: 1%;
						background-color: #fff;
						border: 1px #4cb3ff solid;
						border-radius: 8px;
						box-shadow: 0 2px 5px 5px #4cb3ff50;
						background-position: -240px 4px;
					}
				</style>
				<a class="downloadGame pla7" onfocus="this.blur();" href="${unsafeWindow.webServer + unsafeWindow._strGamePath}" target="_blank">SWF</a>
			`))
		} else {
			$(document.body).append($(`
				<style>
					a.downloadGame {
						position: fixed;
						z-index: 2147483647;
						bottom: 5%;
						right: 1%;
						background-color: #fff;
						border: 1px #f99c47 solid;
						border-radius: 8px;
						box-shadow: 0 2px 5px 5px #f99c4750;
						background-position: -320px 4px;
					}
					.pla1, .pla2, .pla3, .pla4, .pla5, .pla6, .pla7, .pla8, .pla9, .p-phone, .baidu-share {
						background: url(../images/fix2.png) no-repeat;
						width: 40px;
						padding-top: 30px;
						margin: 0 10px;
						text-align: center;
						overflow: hidden;
						float: left;
						display: inline;
						color: #333;
						text-decoration: none;
						transition: all .18s linear;
						font-family: Verdana, arial;
						font-size: 12px;
					}
				</style>
				<a class="downloadGame pla9" onfocus="this.blur();" href="${unsafeWindow.webServer + unsafeWindow._strGamePath}" target="_blank">直链</a>
			`))
		};
	}, 1)
})();