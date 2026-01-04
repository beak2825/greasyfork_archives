// ==UserScript==
// @name         bt论坛添加一键下载所有bt种子
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  给bt论坛添加一键下载所有bt种子的 按钮
// @author       Jor
// @match        http://www.88btbtt.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410166/bt%E8%AE%BA%E5%9D%9B%E6%B7%BB%E5%8A%A0%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89bt%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/410166/bt%E8%AE%BA%E5%9D%9B%E6%B7%BB%E5%8A%A0%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89bt%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function () {
    'use strict';
	let host = window.location.host
	console.log(host);
	$(".attachlist").each(function(){
		let el=this;
		//console.log(el);
		let alc="";
		$(el).find('a').each(function(){
			let al=this;
			let addr="http://"+host+"/"+ $(al).attr("href").replace("dialog","download") 
			//console.log(host+"/"+addr);
			alc+=addr+"\n";
		})
		var btn = document.createElement('button');
	btn.innerHTML = "一键复制磁力链接";
	btn.className = "btn";
	btn.onclick = function(){
		var clipboard = new ClipboardJS('.btn');

		$(".btn").attr("data-clipboard-text",alc);
	}
	$(el).append(btn);
	})
	

	
	
    
})();

