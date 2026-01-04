// ==UserScript==
// @name         google搜索结果缓存快照批量打开
// @namespace    http://tampermonkey.net/
// @version      2024-05-12
// @description  初衷为某个github仓库被删404，在谷歌快照了仍然保留有部分页面，需要批量将这些页面对应的谷歌快照都打开，然后用singlefile本地备份一下。
// @author       You
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/494722/google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%BC%93%E5%AD%98%E5%BF%AB%E7%85%A7%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/494722/google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%BC%93%E5%AD%98%E5%BF%AB%E7%85%A7%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// document.querySelector("#APjFqb").value = "cache:"
	// Your code here...
})();




setTimeout(() => {
	main();
}, 3000);

function main() {
	let nodelist = document.querySelectorAll("div.kb0PBd.cvP2Ce.A9Y9g.jGGQ5e a[jsname]");

	let urls = [];

	nodelist.forEach(function (node) {
		// 获取节点的href属性
		let href = node.getAttribute('href');

		// 拼接字符串
		let cacheUrl = "http://webcache.googleusercontent.com/search?q=cache:" + href;

		// 将拼接好的URL添加到数组中
		urls.push(cacheUrl);
	});

	// 输出数组
	console.log(urls);


	let currentIndex = 0;

	function openUrl() {
		if (currentIndex < urls.length) {
			// 打开当前索引的URL
			window.open(urls[currentIndex], '_blank');

			// 增加当前索引，以便下一次打开下一个链接
			currentIndex++;
		} else {
			// 如果已经打开所有链接，清除间隔器
			clearInterval(intervalId);
		}
	}

	// 每隔3秒执行一次openUrl函数
	let intervalId = setInterval(openUrl, 3000);
}