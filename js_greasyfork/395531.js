// ==UserScript==
// @name         my zhihu
// @namespace    xay5421
// @version      0.1
// @author       xay5421
// @description  知乎计时插件
// @match        https://www.zhihu.com/*
// @require       https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395531/my%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/395531/my%20zhihu.meta.js
// ==/UserScript==

var $=window.$;
$(function(){
	var t=localStorage.endTime;
	var x;
	if(t==undefined||t<=+new Date()){
		if(t!=undefined)alert("时间到了");
		while(1){
			x=prompt("这一次你想水多少分钟的知乎?");
			if(x==undefined){
				$("body").find("*").remove();
				alert("看来这次你不想水知乎");
				delete localStorage.endTime;
				return;
			}
			x=parseFloat(x);
			if(x.toString()=="NaN")alert("请输入一个数字");else
			if(x<0)alert("这个数字要大于 0");else
			if(x>10)alert("时间太长了,不能超过十分钟,好好写题,不要水来水去");else break;
		}
		x=x*60*1000;
		localStorage.endTime=+new Date()+x;
	}
	if(t>+new Date()){
		setTimeout(function(){$("body").find("*").remove();alert("时间到了");delete localStorage.endTime;},t-(+new Date()));
	}else{
		setTimeout(function(){$("body").find("*").remove();alert("时间到了");delete localStorage.endTime;},x);
	}
});