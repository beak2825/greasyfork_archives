// ==UserScript==
// @name         永久禁用知乎
// @version      20240705r0
// @description  实际上是使知乎变安全。
// @author       Eznibuil
// @match        https://www.zhihu.com/*
// @require      https://unpkg.zhihu.com/jquery/dist/jquery.slim.min.js
// @license      GPLv3
// @namespace https://greasyfork.org/users/1282465
// @downloadURL https://update.greasyfork.org/scripts/491410/%E6%B0%B8%E4%B9%85%E7%A6%81%E7%94%A8%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/491410/%E6%B0%B8%E4%B9%85%E7%A6%81%E7%94%A8%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==
$(()=>{
	$('.ExploreHomePage-specialsLogin').remove()
	$('.ExploreSpecialCard-banner').remove()
	$('.Question-sideColumn').remove()
	$('header').remove()
	$('link[rel="apple-touch-icon"]').attr('href','https://www.luogu.com.cn/favicon.ico')
	$('link[rel="shortcut icon"]').attr('href','https://www.luogu.com.cn/favicon.ico')
	$('main').css('background-color','#efefef')
	$('title').text('​')
	window.setInterval(()=>{
		$('.FollowButton').remove()
		$('.Reward').remove()
		$('.VoteButton').remove()
		$('.css-1335jw2').remove()
		$('.css-9b714r').remove()
		$('.css-ghjkiv').remove()
		$('.css-h5kwc4').remove()
	},100);
});