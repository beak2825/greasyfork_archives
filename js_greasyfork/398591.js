// ==UserScript==
// @name         Bilibili-aid Assistant
// @namespace    https://www.maxalex.tk
// @version      0.4
// @description  根据B站bv号获取av号
// @author       MaxAlex, aka zyf722
// @match        https://www.bilibili.com/video/*
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/398591/Bilibili-aid%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/398591/Bilibili-aid%20Assistant.meta.js
// ==/UserScript==

// Configuration Begin

var trytime = 2500; // 等待页面加载完成时间（ms）

// Configuration End

var old_title;

setInterval( function(){

if ($(".tit").text() != old_title) {

var bid = window.location.href.split("video/")[1].split("?")[0].split("/")[0].split("BV")[1];
var cid,aid;

$.ajax({
	type: "GET",
	async: false,
	url: "https://api.bilibili.com/x/player/pagelist?bvid="+bid+"&jsonp=jsonp",
	success: function(data){
		cid = JSON.parse(JSON.stringify(data)).data[0].cid;
	}
});


$.ajax({
	type: "GET",
	async: false,
	url: "https://api.bilibili.com/x/web-interface/view?cid="+cid+"&bvid="+bid,
	success: function(data){
		aid = JSON.parse(JSON.stringify(data)).data.aid;
	}
});

$(".tit").text($(".tit").text()+" (av"+aid+")")

old_title = $(".tit").text()

}

},trytime)