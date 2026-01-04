// ==UserScript==
// @name         百度百科转维基百科
// @version      1.00
// @description  在百度百科中添加跳转到中文维基百科和英文维基百科的按钮。
// @match        *://baike.baidu.com/*
// @grant        none
// @author       tianyunperfect@gmail.com
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @namespace    Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/390601/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E8%BD%AC%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/390601/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E8%BD%AC%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==

(function() {
	//搜索栏
	$('.header .layout').css('width', '95%');
	$('.wgt-searchbar-main').css('width', '100%');
	$('.search .form input').css('width', '400px');
	$('.search .form .help').remove();
	$('.wgt-userbar').css({'position':'static','float':'right'});

	//添加中文wiki
	$('#searchForm #search').after('<button class="hudong" type="button" >中文wiki</button>');
	$('.hudong').click(function() {
			window.open("https://zh.wikipedia.org/wiki/" + $('#query').val());
		});
	//添加英文wiki
	$('#searchForm #search').after('<button class="wiki" type="button" >英文wiki</button>');
	$('.wiki').click(function() {
			window.open("https://en.wikipedia.org/wiki/" + $('#query').val());
		});
})();