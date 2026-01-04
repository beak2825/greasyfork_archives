// ==UserScript==
// @description 垃圾1
// @namespace 垃圾
// @name 垃圾
// @version 0.1
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @match https://www.douyu.com/*
// @match https://www.douyu.com/*
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @connect open.douyucdn.cn
// @downloadURL https://update.greasyfork.org/scripts/401993/%E5%9E%83%E5%9C%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/401993/%E5%9E%83%E5%9C%BE.meta.js
// ==/UserScript==
javascript:(
function(){
var ct=0;
setInterval(function(){
try{
var $box=$('.TreasureStatus-text');
if(!$box.is(":hidden")){
    if(($box.text()=='领取')){
	$box.trigger('mouseleave');
    $box.trigger('mouseover');
	$box.click();
    }else{
        document.title=$box.text();
    }
}
ct++;
if(ct>=2){
var $stop=$('div[title="暂停"]');
var $msg=$('div[title="关闭弹幕"]');
if(!$stop.is(":hidden")){$stop.click();}
if(!$msg.is(":hidden")){$msg.click();}
ct=0;
}
}catch(e){console.log('1'+e);}
},2000);


})();