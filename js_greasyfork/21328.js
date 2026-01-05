// ==UserScript==
// @name       nefu cleaner
// @version    0.0.3
// @namespace nefu.edu.cn
// @description  将jwc*.nefu恶心的js超链接转换成正常的超链接，将弹出小窗改为新标签页，提供showModalDialog支持
// @include      http://jwcnew.nefu.edu.cn/*
// @include      http://jwc.nefu.edu.cn/*
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @grant        unsafeWindow
// @license  GPL v3
// @downloadURL https://update.greasyfork.org/scripts/21328/nefu%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/21328/nefu%20cleaner.meta.js
// ==/UserScript==

function isURL(x){
    if(window.location.href.indexOf(x)!=-1){
    	return true;
    }else{
     	return false;
    }
}

if(isURL("jwcnew.nefu.edu.cn")){
    $('a').each(function() {this.href=this.href.replace(/^javascript:JsMod\(\'(.+)\',.+,.+\)$/g,"$1");});
}else if(isURL("jwc.nefu.edu.cn")){
    $('a').each(function() {this.href=this.href.replace(/^javascript:xiazai\(\'(.+)\'\)$/g,"$1");});
    $('a').each(function() {this.href=this.href.replace(/^javascript:buttonToUrl\(\'(.+)\'\)$/g,"$1");});
    $('a').each(function() {this.href=this.href.replace(/^javascript:buttonToOpenUrl\(\'(.+)\'\)$/g,"$1");});
}
unsafeWindow.showModalDialog=function(url){window.open(url);};
Object.defineProperty(window,"showModalDialog",{get:function(url){window.open(url);},configurable:false,enumerable:true});