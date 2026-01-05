// ==UserScript==
// @name            NICO再生数大于800就加亮
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			0.8.3
// @homepageURL	https://greasyfork.org/users/2805-myimagination
// @description     搜索的时候自动高亮加粗显示再生高于800的
// @include         http://*.nicovideo.jp/tag/*
// @include         http://*.nicovideo.jp/search/*
// @include         https://*.nicovideo.jp/tag/*
// @include         https://*.nicovideo.jp/search/*
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/2469/NICO%E5%86%8D%E7%94%9F%E6%95%B0%E5%A4%A7%E4%BA%8E800%E5%B0%B1%E5%8A%A0%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/2469/NICO%E5%86%8D%E7%94%9F%E6%95%B0%E5%A4%A7%E4%BA%8E800%E5%B0%B1%E5%8A%A0%E4%BA%AE.meta.js
// ==/UserScript==

(function(){
	$(".count.view").find("span").each(function(){
if(parseInt($(this).text().replace(/,/, "")) > 799){
	$(this).css({"color":"red","font-weight":"bold"});
	$(this).closest('.item','li').css({"background-color":"#E0E0E0"});
		}});      
})();