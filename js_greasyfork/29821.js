// ==UserScript==
// @name 沪江英语
// @description 沪江英语的脚本
// @include     http://www.hjenglish.com/*
// @grant       ao
// @version 0.0.2
// @namespace https://greasyfork.org/users/25818
// @downloadURL https://update.greasyfork.org/scripts/29821/%E6%B2%AA%E6%B1%9F%E8%8B%B1%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/29821/%E6%B2%AA%E6%B1%9F%E8%8B%B1%E8%AF%AD.meta.js
// ==/UserScript==

(function(){
    // 开始
    var css = '#uzt_footer{display: none;}';
    addGlobalStyle(css);
	
	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { console.log('插入失败');return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
	
	
	console.log('完成');
	
})()