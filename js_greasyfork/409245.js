// ==UserScript==
// @name         网易云音乐电台DEMO显示歌曲名到标题
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  网易云音乐电台DEMO显示歌曲名到标题，专用于云音乐电台内测DEMO（https://music.163.com/demo/fm#hq）的脚本，功能是在修改网页标题为歌曲名和显示剩余播放时间。

// @author       Salitt
// @match        https://music.163.com/demo/fm*
// @require		 https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409245/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%94%B5%E5%8F%B0DEMO%E6%98%BE%E7%A4%BA%E6%AD%8C%E6%9B%B2%E5%90%8D%E5%88%B0%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/409245/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%94%B5%E5%8F%B0DEMO%E6%98%BE%E7%A4%BA%E6%AD%8C%E6%9B%B2%E5%90%8D%E5%88%B0%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var loading = setInterval(function () {
		setTimeout(function () {
			var title = $('.s-fc1').html();
			if (title!="") {
				changeTitle();
				clearInterval(loading);
			}
		}, 1000);
	}, 1000);
	function changeTitle() {
			setInterval(function () {
				var title = $('.s-fc1').html();
				var timeLeft = $('.s-fc4').html();
				$('title').html(title+" "+timeLeft);
			}, 1000);
	}
})();