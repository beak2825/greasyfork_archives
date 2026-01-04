// ==UserScript==
// @name         自动签到助手（包含5个站点）
// @description  实现部分网站的自动签到，彻底解放双手！
// @namespace    http://www.liuweb.com
// @version      0.1
// @author       aoweisi
// @include      *//jifen.2345.com/*
// @include      *//ttz.china.com/*
// @include      *//ttz.china.com/Signin/index/*
// @include      *//www.juxiangyou.com/*
// @include      *//www.juxiangyou.com/sign/*
// @include      *//www.2478.com/*
// @include      *//www.2478.com/dayCheck/*
// @include      *//www.ji7.com/*
// @include      *//www.ji7.com/sign*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37471/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8C%85%E5%90%AB5%E4%B8%AA%E7%AB%99%E7%82%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/37471/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8C%85%E5%90%AB5%E4%B8%AA%E7%AB%99%E7%82%B9%EF%BC%89.meta.js
// ==/UserScript==

function isURL(x){
	if(window.location.href.indexOf(x)!=-1){
		return true;
	}else{
		return false;
	}
}

var wait = 1500;

//2345联盟
if(isURL("jifen.2345.com")){
	setTimeout(function(){
		every_day_signature();
	},wait);
}

//天天钻
if(isURL("ttz.china.com")){
	setTimeout(function(){
		document.getElementsByClassName('sign')[0].click();
	},wait);
}
if(isURL("ttz.china.com/Signin/index")){
	setTimeout(function(){
		document.getElementsByClassName('signinNow')[0].click();
	},wait);
}
//聚享游
if(isURL("www.juxiangyou.com")){
	setTimeout(function(){
		if (document.getElementsByClassName('qiandao-btn')[0].innerText!="已签到") {
			document.getElementsByClassName('qiandao-btn')[0].click();
		}
	},wait);
}
if(isURL("www.juxiangyou.com/sign")){
	setTimeout(function(){
		document.getElementsByClassName('J_sign')[0].click();
	},wait);
}
//24趣吧
if(isURL("www.2478.com")){
	setTimeout(function(){
		if(document.getElementsByClassName('js-checkin')[0].innerText!="已签到"){
			document.getElementsByClassName('js-checkin')[0].click();
		}
	},wait);
}
if(isURL("www.2478.com/dayCheck")){
	setTimeout(function(){
		document.getElementsByClassName('Do_Check')[0].click();
	},wait);
}

//集趣网
if(isURL("www.ji7.com")){
	setTimeout(function(){
		if(document.getElementsByClassName('sign_btn')[0].innerText!="今日已签到"){
			document.getElementsByClassName('sign_btn')[0].click();
		}
	},wait);
}
if(isURL("www.ji7.com/sign")){
	setTimeout(function(){
		document.getElementsByClassName('acc_btn')[0].click();
	},wait);
}