// ==UserScript==
// @name         字幕侠一键磁力/电驴 链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  字幕侠一键复制磁力/电驴 链接
// @author       dalaomai
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @match         *://www.zimuxia.cn/portfolio/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426558/%E5%AD%97%E5%B9%95%E4%BE%A0%E4%B8%80%E9%94%AE%E7%A3%81%E5%8A%9B%E7%94%B5%E9%A9%B4%20%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/426558/%E5%AD%97%E5%B9%95%E4%BE%A0%E4%B8%80%E9%94%AE%E7%A3%81%E5%8A%9B%E7%94%B5%E9%A9%B4%20%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    var mag = '';
    var ed2k_map = '';
	$("a[href^='magnet:']").each(function(){
		mag = mag + this.href + '\n'
	});
	$("a[href^='ed2k:']").each(function(){
		ed2k_map = ed2k_map + this.href + '\n'
	});
	var btn = document.createElement('button');
	btn.innerHTML = "一键复制磁力链接";
	btn.className = "btn";
	btn.onclick = function(){
		var clipboard = new ClipboardJS('.btn');

		$(".btn").attr("data-clipboard-text",mag);
	};
    document.getElementsByClassName('content-box')[0].appendChild(btn);
	var ed2k_btn = document.createElement('button');
	ed2k_btn.innerHTML = "一键复制电驴链接";
	ed2k_btn.className = "ed2k_btn";
	ed2k_btn.onclick = function(){
		var clipboard = new ClipboardJS('.ed2k_btn');

		$(".ed2k_btn").attr("data-clipboard-text",ed2k_map);
	};
	document.getElementsByClassName('content-box')[0].appendChild(ed2k_btn);
})();