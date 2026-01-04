// ==UserScript==
// @name         花园签到
// @description  实现部分网站的自动签到 
// @namespace    http://1345613456123
// @version      0.1
// @author       hi
// @include      *//buaabt.cn/*
// @include      *//jifen.2345.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370963/%E8%8A%B1%E5%9B%AD%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/370963/%E8%8A%B1%E5%9B%AD%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
 
function isURL(x){
	if(window.location.href.indexOf(x)!=-1){
		return true;
	}else{
		return false;
	}
}

var wait = 1500;

 

//花园自动签到
if(isURL("buaabt.cn")){
	setTimeout(function(){
		fgbt_do_checkin();
	},wait);
}
//2345联盟
if(isURL("jifen.2345.com")){
	setTimeout(function(){
		every_day_signature();
	},wait);
}
