// ==UserScript==
// @name         入党积极分子专用2.0版本
// @namespace    null
// @version      2.0
// @description  刷课用的，可以秒刷
// @author       QQ
// @match        http://rdpx.qust.edu.cn/jjfz/play*
// @match        http://*.edu.cn*/jjfz/play*
// @icon         http://www.gov.cn/ztzl/17da/183d03632724084a01bb02.jpg
// @grant        none
// @license      none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436460/%E5%85%A5%E5%85%9A%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90%E4%B8%93%E7%94%A820%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/436460/%E5%85%A5%E5%85%9A%E7%A7%AF%E6%9E%81%E5%88%86%E5%AD%90%E4%B8%93%E7%94%A820%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

$(function() {

	var timem = 5000;
	var nuber = 0;
	var current = 0;
	var videoList = [];


	function init() {
		var videoLiList = document.getElementsByClassName("video_lists")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");
		for (let i = 0; i < videoLiList.length; i++) {
			const li = videoLiList[i];
			var a = li.getElementsByTagName("a")[0];
			var videoInf = {
				url: a.getAttribute("href"),
				name: a.innerText
			}
			videoList.push(videoInf); //

			if (hasClass(li, "video_red1")) {
				current = i;
				nuber = videoLiList.length
			}
		}
	}

	function hasClass(element, cls) {
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}

	function clickPlayBtn() {
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, true);
		var list = document.getElementsByClassName("plyr__controls__item plyr__control");
		for (let i = 0; i < list.length; i++) {
			const btn = list[i];
			if (btn.getAttribute("aria-label") == "Play") {
				btn.dispatchEvent(e)
			}
		}
	}

	function pldown() {
		clickPlayBtn();
	}

	function sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	init();
	async function main() {
		for (let i = current; i < nuber; i++) {

			await sleep(timem);
			clickPlayBtn();
			await sleep(2000); 
			if (i < nuber - 1) {
				location.href = videoList[i + 1].url;
			} else {
				alert("刷完了，老大，退出去切换到下一个");
				break;
			}
			if (i == 80) {
				break
			}
		}
	}
	main();

})