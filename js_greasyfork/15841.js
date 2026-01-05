// ==UserScript==
// @name CSDN去除二维码图片
// @description 去除二维码图片
// @include     http://blog.csdn.net/*
// @grant       ao
// @version 0.0.1.20160102053431
// @namespace https://greasyfork.org/users/25818
// @downloadURL https://update.greasyfork.org/scripts/15841/CSDN%E5%8E%BB%E9%99%A4%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/15841/CSDN%E5%8E%BB%E9%99%A4%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==



//$(function(){
  	// css实现
	addGlobalStyle('#com-appcode-float-block{display:none!important;}');
	
	
	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
//});

