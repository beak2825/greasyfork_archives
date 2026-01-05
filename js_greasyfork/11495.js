// ==UserScript==
// @name        漫游BT Magnet修改
// @namespace   https://greasyfork.org/zh-CN/scripts/11495
// @description 修改Magnet磁力链接为百度云离线可以识别的形式
// @include     http://share.popgo.org/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11495/%E6%BC%AB%E6%B8%B8BT%20Magnet%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/11495/%E6%BC%AB%E6%B8%B8BT%20Magnet%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
if (/program-/.test(location.pathname)){
	var path_name=document.getElementById("si_downseed").childNodes[0].search;
	var slice_start=path_name.lastIndexOf("/")+1;
	var slice_end=path_name.indexOf(".");
	var torrent_hash=path_name.split("=")[1];
	var a_magnet=document.getElementById("si_magnet").childNodes[0];
	a_magnet.href="magnet:?xt=urn:btih:"+torrent_hash;
}else{
	var list=document.getElementsByClassName("inde_tab_seedname");
	var hash="",i=0;
	for (i=0;i<=list.length;i++){
		var slice_start=list[i].childNodes[0].pathname.lastIndexOf("-")+1;
		var slice_end=list[i].childNodes[0].pathname.indexOf(".");
		hash=list[i].childNodes[0].pathname.slice(slice_start,slice_end);
		list[i].parentNode.lastChild.firstChild.href="magnet:?xt=urn:btih:"+hash;	
	}
}