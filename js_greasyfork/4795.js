// ==UserScript==
// @name         Bilibili(哔哩哔哩) BangumiTwo Raw Hider
// @description  哔哩哔哩-番剧-连载动画-生肉-隐藏
// @version      1.1.21012401
// @author       DanoR
// @namespace    http://weibo.com/zheung
// @grant        none
// @include      *://www.bilibili.com/v/anime/serial*
// @downloadURL https://update.greasyfork.org/scripts/4795/Bilibili%28%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%29%20BangumiTwo%20Raw%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/4795/Bilibili%28%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%29%20BangumiTwo%20Raw%20Hider.meta.js
// ==/UserScript==

(function() {
	setInterval(function() {
		const list = document.querySelectorAll('.vd-list>li');

		for(let i = 0; i < list.length; i++) {
			if(list[i].innerHTML.indexOf('生肉') + 1)
				list[i].style.display = 'none';
			else if(list[i].innerHTML.indexOf('台配') + 1)
				list[i].style.display = 'none';
			else if(list[i].innerHTML.indexOf('英配') + 1)
				list[i].style.display = 'none';
			else if(list[i].innerHTML.indexOf('僅限') + 1)
				list[i].style.display = 'none';
		}
	}, 2014);
})();
