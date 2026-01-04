// ==UserScript==
// @name        GitCode 重定向智能匹配版
// @description GitCode 重定向智能匹配版1
// @namespace   https://github.com/CandyTek
// @author      CandyTek
// @match       *://gitcode.com/gh_mirrors/*
// @match       *://gitcode.com/GitHub_Trending/*
// @version     1.1
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/519099/GitCode%20%E9%87%8D%E5%AE%9A%E5%90%91%E6%99%BA%E8%83%BD%E5%8C%B9%E9%85%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/519099/GitCode%20%E9%87%8D%E5%AE%9A%E5%90%91%E6%99%BA%E8%83%BD%E5%8C%B9%E9%85%8D%E7%89%88.meta.js
// ==/UserScript==
(() => {
	searchGitcodeMirror(0);

	function searchGitcodeMirror(searchTimes) {
		searchTimes++;
		// 超过次数了，就不再尝试
		if(searchTimes > 30){
			return
		}
		const el = document.querySelector("div.repo-warning-msg > div.msg-content > a");
		if(el!=null && el.textContent.includes("github.com")){
			console.warn("正在重定向");
			// 去除尾部 .git 字符串
			window.location.href = el.textContent.replace(/\.git$/, '');
		}else{
			console.warn("未找到Github库，再次重试");
			setTimeout(function() {
				searchGitcodeMirror(searchTimes);
			}, 80);
		}
	}
})();
