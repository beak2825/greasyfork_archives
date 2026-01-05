// ==UserScript==
// @name         GoAlimama
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动跳转到商品相应的淘宝客页面，自己的返利自己赚!
// @author       Neo
// @include http*://item.taobao.com/*
// @include http*://detail.tmall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24766/GoAlimama.user.js
// @updateURL https://update.greasyfork.org/scripts/24766/GoAlimama.meta.js
// ==/UserScript==

// Your code here...
//debugger;
function run(){
	var searchPrefix="http://pub.alimama.com/promo/search/index.htm?q=";
	var link=location.href;
	var realLink=getRealLink(link);
	console.log(realLink);
	var isTb=location.host==='item.taobao.com';
	var isTm=location.host==='detail.tmall.com';
	var targetLink=searchPrefix+encodeURIComponent(realLink);
	var block;
	if(isTm){
		block=document.querySelector('.tb-key');
	}
	else{
		block=document.querySelector('.tb-item-info-r');
	}
	var br=document.createElement('br');
	var mamaLink=document.createElement('a');
	mamaLink.href=targetLink;
	mamaLink.target='_blank';
	mamaLink.innerText='ALIMAMA';
	block.appendChild(mamaLink);
}

function getRealLink(longLink){
	var n=longLink.indexOf('?');
	if (n>0) {
		var params=longLink.substr(n+1).split('&');
		for (var i in params){
			var param=params[i];
			if (param.indexOf('id=')===0) {
				return longLink.substr(0,n+1)+param;
			}
		}
	}
}
run();
