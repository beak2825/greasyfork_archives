// ==UserScript==
// @name         游民星空自动替换高清图片
// @namespace    https://greasyfork.org/zh-CN/users/6065-hatn
// @version      0.1.1
// @description  文章内嵌图片替换为高清图片
// @author       You
// @include      http*://www.gamersky.com/*
// @icon         http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @grant        none
// @run-at     	document-end
// @downloadURL https://update.greasyfork.org/scripts/435364/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/435364/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

$(function() {
	const $pdom = $('p[align="center"]>a');
	if ($pdom.length < 1) return;
	$pdom.each(function() {
	   const cat = /(http[^\?]+\.\w+)/gi;
	   const src_ori = $(this).attr('href');
	   const res = src_ori.match(cat);
	   const src = res[1];
	   //console.log('url: ', src);
	   $('img', this).attr('src', src);
   });
});