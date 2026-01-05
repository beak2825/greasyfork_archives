// ==UserScript==
// @name           BYR SMTH BBS ip2location
// @namespace      http://bbs.byr.cn/
// @description	   显示北邮人论坛、水木论坛用户发贴IP的物理地址
// @grant             GM_xmlhttpRequest
// @include        http://bbs.byr.cn/*
// @include        https://bbs.byr.cn/*
// @include        http://www.newsmth.net/*
// @version        1.8
// @author         Binux
// @author         John Wong
// @author         Ryan Zheng
// @downloadURL https://update.greasyfork.org/scripts/25639/BYR%20SMTH%20BBS%20ip2location.user.js
// @updateURL https://update.greasyfork.org/scripts/25639/BYR%20SMTH%20BBS%20ip2location.meta.js
// ==/UserScript==

function showLoading(ip, font){
	var span = document.createElement("span");
	span.innerHTML = " [ LOADING... ]";
	span.className = ip;
	font.appendChild(span);
}

function onLoad(event) {
	var fonts = document.getElementsByTagName("font");
	for ( var i = 0,font;font = fonts[i];i++ )
	{
		var result = font.innerHTML.match(/\[FROM:\D{0,5}([0-9a-fA-F\.:]+.)\]/);
		if(result && font.lastChild.nodeName != "SPAN")
		{
			var ip = result[1].replace("*","0");
			showLoading(ip, font);
			sendRequest(ip);
			return;
		}
	}
}

function sendRequest(ip){
    setTimeout(function() {GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://pytool.sinaapp.com/geo?type=json&pos=1&ip='+ip,
    onload: function(responseDetails) {
        var response = responseDetails.responseText;
        var ret = eval('(' + response + ')')['geo']
		var ip = ret['ip']
        var loc = ret['loc']
        showAddress({'ip': ip,'loc': loc});
        }
    })}, 0);
}

function showAddress(response){
	var spans = document.getElementsByClassName(response.ip);
	for(var i=0,span;span = spans[i];i++){
		span.innerHTML = " [" + response.loc + "] ";
	}
}

onLoad();
window.addEventListener("load", onLoad, false);
window.addEventListener("AutoPagerAfterInsert", onLoad, false);
document.addEventListener("DOMNodeInserted", onLoad, false);