// ==UserScript==
// @name 哈哈删除广告 haha.mx
// @description 哈哈删除广告，保留今日查看笑话个数和，哈友排行榜
// @include     http://www.haha.mx/joke/*
// @require     http://cdn.bootcss.com/jquery/1.11.3/jquery.js
// @grant       ao
// @version 1.1
// @namespace https://greasyfork.org/users/25818
// @downloadURL https://update.greasyfork.org/scripts/16325/%E5%93%88%E5%93%88%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A%20hahamx.user.js
// @updateURL https://update.greasyfork.org/scripts/16325/%E5%93%88%E5%93%88%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A%20hahamx.meta.js
// ==/UserScript==

console.clear();
var e = $('.fl.sidebar'),
	v = e.children('div:not(.top-10,.ad-1)');
	
v.hide();
$('[class^="banner-ad-"]').hide();
	
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
	
	
console.log('完成');
	





