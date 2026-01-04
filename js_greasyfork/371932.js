// ==UserScript==
// @name         bilibili直播间刷屏Clear
// @namespace    mscststs
// @version      0.4
// @description  直播间刷屏消息Clear
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371932/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E5%88%B7%E5%B1%8FClear.user.js
// @updateURL https://update.greasyfork.org/scripts/371932/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E5%88%B7%E5%B1%8FClear.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let list = window.Helper_danmaku_List = [];
	let threshold = 3;
	$("body").append(`
	<style>
		.Helper_danmaku_clear_hide{
			display:none !important;
		}
	</style>
	`)
	function ListennerDanmaku(){
		$("body").on("DOMNodeInserted",".chat-item.danmaku-item",function(e){
			let content = $(this).find(".danmaku-content").text();
			//console.log(content);
			if(list[content]){
				list[content]+=1;
			}else{
				list[content]=1;
			}
			setTimeout(function(){
				list[content]-=1;
				if(list[content]===0){
					delete(list[content]);
				}
			},5000);
			if(list[content]==threshold){
				$(this).css("background-color","990");
				//console.log("-1s");
			}
			if(list[content]>threshold){
				$(this).addClass("Helper_danmaku_clear_hide");//元素隐藏
				//console.log("-1s");
			}
		});
		$("body").on("DOMNodeInserted",".bilibili-danmaku",function(){
			let list = window.Helper_danmaku_List;
			let content = $(this).text();
			//console.log(list[content]);
			if(list[content]>threshold){
			
				$(this).addClass("Helper_danmaku_clear_hide");//元素隐藏
			}else{
				$(this).removeClass("Helper_danmaku_clear_hide");//元素隐藏
			}
		});
	}
	ListennerDanmaku();
})();