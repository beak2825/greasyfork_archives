// ==UserScript==
// @name 获取vagrant 的boxs的下载地址
// @description 让vagrant 的boxs的出现下载地址
// @include     https://atlas.hashicorp.com/*/boxes/*
// @require     http://cdn.bootcss.com/jquery/1.11.3/jquery.js
// @grant       ao
// @version 0.0.1.20160102052826
// @namespace https://greasyfork.org/users/25818
// @downloadURL https://update.greasyfork.org/scripts/15839/%E8%8E%B7%E5%8F%96vagrant%20%E7%9A%84boxs%E7%9A%84%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/15839/%E8%8E%B7%E5%8F%96vagrant%20%E7%9A%84boxs%E7%9A%84%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

$(function(){
	var e = $('.set-item>.row:first-child'),
		v = e.children('a:last-child');
	//https://atlas.hashicorp.com/laravel/boxes/homestead/versions/0.4.0/providers/virtualbox.box
	v.each(function(i){
		var t = $(this);
		t.before(t.clone().attr('href',function(t){
			return this.href+'/providers/virtualbox.box';
		}).html('下载virtualbox'));
	});
	
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
	
})





