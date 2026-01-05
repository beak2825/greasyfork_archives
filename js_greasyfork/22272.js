// ==UserScript==
// @name         A00 整合脚本
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  自用脚本 反正没人看见
// @author       You
// @include      http://91s.gs/*
// @include      http://pan.789xz.com/file*
// @include      /^http:.*\.cccpan\.com\/login\.aspx\?d=\.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22272/A00%20%E6%95%B4%E5%90%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/22272/A00%20%E6%95%B4%E5%90%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
//永硕网盘自动登陆
if(location.href.match(/^http:.*\.cccpan\.com\/login\.aspx\?d=\.*/)){
	document.getElementById("teqtbz").value='521';
	/*$ = unsafeWindow.jQuery;
	$("#teqtbz").attr("value","521");*/
	document.getElementById("b_dl").click();
}
/*永硕网盘去除播放器
if(location.href.match(/^http:.*\.cccpan\.com/)){
	window.onload = function(){document.getElementById("table2").parentNode.innerHTML="";};//还是没用
}*/
//91s短链还原
if (location.href.match(/^http:\/\/91s\.gs\/.*/)){
	var x = document.getElementsByTagName('tbody')[0].rows[1].cells;
	var url = x[1].innerHTML;
	url = url.replace("<u>","");
	url = url.replace("</u>","");
	location.href = url;
}
//798网盘文件页跳转下载页
if (location.href.match(/^http:\/\/pan\.789xz\.com\/file-\d{5}\.html$/)){
	var x=location.href;
    x=x.replace("file","down");
    location.href=x;
}
