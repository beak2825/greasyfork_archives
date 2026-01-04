// ==UserScript==
// @name        设置以及获取浏览器缓存
// @namespace   
// @description 第一个测试脚本。
// @icon        
// @include     http*
// @include     ftp*
// @version     1.4
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/367890/%E8%AE%BE%E7%BD%AE%E4%BB%A5%E5%8F%8A%E8%8E%B7%E5%8F%96%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BC%93%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/367890/%E8%AE%BE%E7%BD%AE%E4%BB%A5%E5%8F%8A%E8%8E%B7%E5%8F%96%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BC%93%E5%AD%98.meta.js
// ==/UserScript==
function setCookie(name,value){
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
	return unescape(arr[2]);
	else
	return null;
}