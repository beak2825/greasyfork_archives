// ==UserScript==
// @name       跳过CL1024 10s限制
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @namespace   Violentmonkey Scripts
// @include http://www.t66y.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/3/25下午11:41:22
// @downloadURL https://update.greasyfork.org/scripts/426197/%E8%B7%B3%E8%BF%87CL1024%2010s%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/426197/%E8%B7%B3%E8%BF%87CL1024%2010s%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==


Object.defineProperty(window,'r9aeadS',{
value: ()=>{},
  writable: false
})
$(()=>{
  $('img[ess-data]').each(function(){
		if($(this).attr('ess-data').indexOf('sinaimg')>0){
			$(this).attr('ess-data', $(this).attr('ess-data').replace(/https:/, "http:"));
		}
		$(this).attr('src', $(this).attr('ess-data'));
		$(this).css('cursor', 'pointer');
		$(this).click(function(){
			window.open('https://to.redircdn.com/?action=image&url='+encodeURIComponent($(this).attr('data-link'))+'&src='+encodeURIComponent($(this).attr('src')));
			return false;
		});
	});
})
