// ==UserScript==
// @name         B 站获取时间戳 markdown 链接
// @description  按 T 就能复制带时间戳的 URL 的 markdown连接了
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @namespace    http://shawroger.gitee.io/
// @version      0.0.1
// @author       shawroger
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449507/B%20%E7%AB%99%E8%8E%B7%E5%8F%96%E6%97%B6%E9%97%B4%E6%88%B3%20markdown%20%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/449507/B%20%E7%AB%99%E8%8E%B7%E5%8F%96%E6%97%B6%E9%97%B4%E6%88%B3%20markdown%20%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
	'use strict';

	document.addEventListener('keypress', function(e) {
		if(e.keyCode === 84) {
			e.preventDefault();
			let timeVal = 0;
			const timeStr = document.querySelectorAll('.bpx-player-ctrl-time-current')[0].innerHTML;
			const time = timeStr.split(':');

			if(time.length === 3) {
				timeVal = time[0]*3600  + time[1]*60 + time[2];
			} else if(time.length === 2) {
				timeVal = time[0] ? time[0]*60 + time[1] : time[1];
			}

			const burl = window.location.href.split('?')[0] + '#t=' + timeVal;

			if (navigator.clipboard) {
				navigator.clipboard.writeText(`[${timeStr}](${burl})`);
			}
		}
	})
})();

