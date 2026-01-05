// ==UserScript==
// @name         自动签到
// @namespace    https://greasyfork.org/zh-CN/users/75882-qq50941544
// @version      2016120301
// @description  自用各种签到
// @author       QQ50941544
// @grant        none
// @include      *//ld.m.jd.com/*
// @include      *//vip.jd.com/*
// @include      *//vip.jr.jd.com/*
// @include      *//jifen.2345.com/*
// @include      *//shouji.2345.com/*
// @include      *//try.jd.com/*
// @include      http://*.feidee.com/*
// @include      http://re.jd.com/*
// @downloadURL https://update.greasyfork.org/scripts/24328/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/24328/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

var wait = 1500;

if(isURL("re.jd.com")){
var url = location.href;
if(url.indexOf("/item/") > 0) {
    var index1 = url.indexOf(".html");
    var index2 = url.lastIndexOf("/", index1);
    location.replace("http://item.jd.com" + url.substring(index2,index1) + ".html");
}
    }
    
if(isURL("feidee.com")){
    if(self.location.protocol == "http:") self.location.replace(self.location.href.replace(/^http/, "https"));   
}
if(isURL("shouji.2345.com")){
    setTimeout(function(){
		every_day_signature();
	},wait);   
}
if(isURL("jifen.2345.com")){
    setTimeout(function(){
		every_day_signature();
	},wait);   
}
if(isURL("vip.jd.com")){
    setTimeout(function(){
    //document.getElementsByClassName("signup-btn")[0].click();
    document.getElementById('checkinBtn').click();
	},wait+500);   
}
if(isURL("http://vip.jr.jd.com/")){
    setTimeout(function(){
		//document.getElementById('qian-btn').click();
          document.getElementsByClassName("qian-text")[0].click();  
	},wait);   
}
if(isURL("try.jd.com")){
    //京东试用
    setTimeout(function(){
		document.getElementById('btn-app').click();
	},wait);
}
if(isURL("ld.m.jd.com")){
    setTimeout(function(){
		document.getElementById('signId').click();
	},wait);   
}
function isURL(x){
    if(window.location.href.indexOf(x)!=-1){
        return true;
    }else{
        return false;
    }
}