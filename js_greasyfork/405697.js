// ==UserScript==
// @name         字幕侠一键复制所有磁力链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键复制所有磁力链接
// @author       benz1
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @match        *://www.zimuxia.cn/portfolio/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405697/%E5%AD%97%E5%B9%95%E4%BE%A0%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E6%89%80%E6%9C%89%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/405697/%E5%AD%97%E5%B9%95%E4%BE%A0%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E6%89%80%E6%9C%89%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    var mag = '';
	$("a[href^='magnet:']").each(function(){
		mag = mag + this.href + '\n'
	});
	var btn = document.createElement('button');
	btn.innerHTML = "一键复制磁力链接";
	btn.className = "btn";
	btn.onclick = function(){
		var clipboard = new ClipboardJS('.btn');

		$(".btn").attr("data-clipboard-text",mag);
	};
	document.getElementsByClassName('content-box')[0].appendChild(btn);
})();