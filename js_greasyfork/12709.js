// ==UserScript==
// @name        tiebapaging
// @namespace   tiebapaging
// @description 解决百度贴吧翻页强制登陆问题
// @version     1
// @grant       none
// @include     http://tieba.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/12709/tiebapaging.user.js
// @updateURL https://update.greasyfork.org/scripts/12709/tiebapaging.meta.js
// ==/UserScript==

$("#guide_fc").css("display")!="none"?$("#guide_fc").hide():null; //隐藏贴吧footer悬浮div.
window.setTimeout(function(){ 
	$('#frs_list_pager').off("click");
	console.log("贴吧列表页"+$('#frs_list_pager').length);
},1000); 
console.log("贴吧列表页"+$('#frs_list_pager').length);
$(".pb_list_pager").off("click");  
