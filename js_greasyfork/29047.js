// ==UserScript==
// @name           mcbbs_avatar
// @description    MCBBS头衔显示修复
// @author         浅念
// @version        1.1
// @include        http*://mcbbs.tvt.im/*
// @include        http*://mcbbs.net/*
// @grant          none
// @namespace https://greasyfork.org/zh-CN/scripts/29047-mcbbs-avatar
// @downloadURL https://update.greasyfork.org/scripts/29047/mcbbs_avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/29047/mcbbs_avatar.meta.js
// ==/UserScript==

var html=document.getElementsByTagName("img");
for(var i=0;i<html.length;i++){
 if(html[i].src.indexOf("http://www.mcbbs.net/uc_server/avatar.php")>-1){
	 html[i].src=html[i].src.replace(/www.mcbbs.net/g, "mcbbs.tvt.im");
 }
}
var s = document.createElement("script");
s.innerHTML='\
function modifyResponse(response) {\
	var html=document.getElementsByTagName("img");\
	for(var i=0;i<html.length;i++){\
	 if(html[i].src.indexOf("http://www.mcbbs.net/uc_server/avatar.php")>-1){\
		 html[i].src=html[i].src.replace(/www.mcbbs.net/g, "mcbbs.tvt.im");\
	 }\
	}\
\
}\
\
function openBypass(original_function) {\
\
    return function(method, url, async) {\
        this.requestMethod = method;\
        this.requestURL = url;\
\
        this.addEventListener("readystatechange", modifyResponse);\
        return original_function.apply(this, arguments);\
    };\
\
}\
\
function sendBypass(original_function) {\
    return function(data) {\
        this.requestData = data;\
        return original_function.apply(this, arguments);\
    };\
}\
\
XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);\
XMLHttpRequest.prototype.send = sendBypass(XMLHttpRequest.prototype.send);\
';
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);