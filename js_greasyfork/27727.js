// ==UserScript==
// @name         更改豆瓣导航颜色
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  豆瓣导航颜色
// @author       瓜瓜
// @match        http://www.douban.com/*
// @match        http://*.douban.com/*
// @match        https://www.douban.com/*
// @match        https://*.douban.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/27727/%E6%9B%B4%E6%94%B9%E8%B1%86%E7%93%A3%E5%AF%BC%E8%88%AA%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/27727/%E6%9B%B4%E6%94%B9%E8%B1%86%E7%93%A3%E5%AF%BC%E8%88%AA%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
	var nav = document.getElementById('db-global-nav');
	nav.style.backgroundColor = '#1E2327';
	var nav_items = document.getElementsByClassName('global-nav-items')[0];
	var nav_items_uls = nav_items.children[0];
	var nav_items_lis = nav_items_uls.children;
	for (var i = 0; i < nav_items_lis.length; i++) {
		nav_items_lis[i].getElementsByTagName('a')[0].style.color = '#C7C8C9';
	}
})();