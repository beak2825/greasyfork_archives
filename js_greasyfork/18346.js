// ==UserScript==
// @name        買科米卡_H是可以的
// @namespace   MyKomica_WeCanH
// @description H是可以的
// @include     http://*.mymoe.moe/*
// @include     http://*.mykomica.org/*
// @include     https://*.mymoe.moe/*
// @include     https://*.mykomica.org/*
// @author      ID:4cHba7kI
// @version     2nd Edition Ver. 2.33
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18346/%E8%B2%B7%E7%A7%91%E7%B1%B3%E5%8D%A1_H%E6%98%AF%E5%8F%AF%E4%BB%A5%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/18346/%E8%B2%B7%E7%A7%91%E7%B1%B3%E5%8D%A1_H%E6%98%AF%E5%8F%AF%E4%BB%A5%E7%9A%84.meta.js
// ==/UserScript==
var threads = document.getElementById("threads");
var blocked = threads.querySelectorAll("img[src='https://imgs.moe/h.jpg']");

for(var i in blocked){
	var parent = blocked[i].parentElement;

	if(typeof parent != 'undefined'){
	var imgUrl = parent.href;

	imgUrl = imgUrl.replace("src", "thumb");
	imgUrl = imgUrl.substring(0, imgUrl.lastIndexOf(".")) + "s.jpg";

	var newThumb = imgUrl;
	blocked[i].src = newThumb;
	blocked[i].removeAttribute("style");
}
}