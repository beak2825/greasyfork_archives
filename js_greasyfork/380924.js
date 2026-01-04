// ==UserScript==
// @name         Taobao Cart Clear 淘宝购物车一键清理工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  清理购物车里过期的商品，一键将过期商品收藏，一键将过期商品移除
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @author       Zszen
// @match        https://cart.taobao.com/cart.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380924/Taobao%20Cart%20Clear%20%E6%B7%98%E5%AE%9D%E8%B4%AD%E7%89%A9%E8%BD%A6%E4%B8%80%E9%94%AE%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/380924/Taobao%20Cart%20Clear%20%E6%B7%98%E5%AE%9D%E8%B4%AD%E7%89%A9%E8%BD%A6%E4%B8%80%E9%94%AE%E6%B8%85%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
	'use strict';

	setTimeout(createBtn,1000);

function createBtn(){
	var lostFav;
	let content;

	lostFav = document.createElement("a");
	content = document.createTextNode('旧10->藏');
	lostFav.appendChild(content);
	$('div.operations').append(lostFav);
	lostFav.addEventListener('click', old10ToFav)

	lostFav = document.createElement("a");
	content = document.createTextNode('旧20->藏');
	lostFav.appendChild(content);
	$('div.operations').append(lostFav);
	lostFav.addEventListener('click', old20ToFav)

	lostFav = document.createElement("a");
	content = document.createTextNode('旧50->藏');
	lostFav.appendChild(content);
	$('div.operations').append(lostFav);
	lostFav.addEventListener('click', old50ToFav)

	lostFav = document.createElement("a");
	content = document.createTextNode('失->藏');
	lostFav.appendChild(content);
	$('div.operations').append(lostFav);
	lostFav.addEventListener('click', lostToFav)

	// var scrollDown = document.createElement("a");
	// // lostFav.setAttribute('href','#');
	// content = document.createTextNode('向下滚屏');
	// scrollDown.appendChild(content);
	// // $('<a href="#" hidefocus="true" style="color:red" class="J_BatchLostFav">失效->收藏(全)</a>');
	// $('div.operations').append(scrollDown);
	// // lostFav.on('click',lost2Fav)
	// scrollDown.addEventListener('click', scrollDownMe)
}

function old10ToFav(evt,deep){
	loopFav(10, true, 10);
}

function old20ToFav(evt,deep){
	loopFav(20, true, 20);
}

function old50ToFav(evt, deep){
	loopFav(50, true, 50);
}

function loopFav(deep, isInit, total){
	if(isInit){
		var allCount = $("div.J_ItemBody").find("a.J_Fav");
		if(allCount.length<deep){
			deep=allCount.length;
		}
	}
	if(deep==0){
		console.log("收藏"+total+"个完毕 ～！")
		alert("收藏"+total+"个完毕 ～！")
		return;
	}
	var lost = $("div.J_ItemBody").find("a.J_Fav").last();
    var lostItem = $("div.J_ItemBody").last();
	if(!lost || lost.length==0){
		console.log("收藏"+total+"个完毕 ～！")
		alert("收藏"+total+"个完毕 ～！")
		return;
	}
	lost[0].click();
    console.log("收藏了一条旧宝贝~~~")
    lostItem[0].remove();
	setTimeout(() => {
		loopFav(deep-1,false,total);
	}, 200);
}

function lostToFav(){
	var lostCount = $("div.item-invalid");
	loopLostFav(lostCount.length);
}

function loopLostFav(total){
	var lost = $("div.item-invalid").find("a.J_Fav").last();
    var lostItem = $("div.item-invalid").last();
	if(!lost || lost.length==0){
        console.log("清理"+total+"个完毕 ～！");
		alert("清理"+total+"个完毕 ～！");
		return;
	}
	lost[0].click();
    console.log("清理了一条过期的宝贝到收藏夹~~~")
    lostItem[0].remove();
	setTimeout(() => {
		lostToFav(total);
	}, 200);
}

function scrollDownMe(){
	if (document.documentElement.scrollTop) {
		document.documentElement.scrollTop += document.documentElement.clientHeight;
	} else {
		document.body.scrollTop += document.documentElement.clientHeight;
	}
}
    // Your code here...
})();





