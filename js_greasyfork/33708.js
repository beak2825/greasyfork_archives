// ==UserScript==
// @name         G+ avatar comeback
// @namespace    undefineds
// @version      2.0
// @description  Google+评论头像修改
// @author       saifu nekura
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @match        *://plus.google.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/33708/G%2B%20avatar%20comeback.user.js
// @updateURL https://update.greasyfork.org/scripts/33708/G%2B%20avatar%20comeback.meta.js
// ==/UserScript==

(function() {
    'use strict';

var contents = 'content';
var storage = window.localStorage;
  // var gb_Nc = document.querySelector("body").classList.contains("gb_9c");

    //地区转换，默认HK
//var changelink = 'https://plus.google.com/?gl=HK';
 //   var bool = window.location.href == "https://plus.google.com/" || window.location.href == "https://plus.google.com/u/0/" && document.getElementsByClassName("gb_b")[0].href == 'https://www.google.cn/intl/zh-CN/options/';
//if(bool)  window.location.href = changelink;
 //默认头像
var defaultHead = "//lh3.googleusercontent.com/image/-n-0L5nvI570/AAAAAAAAAAI/AAAAAAAAAAA/V0sHAqXP4pk/s60-p-k-no/photo.jpg";
 //最大头像数量
var headNum = 5000;

     var selectStyle=document.createElement("style");
    selectStyle.innerHTML=".yB586c {width:48px!important;}.z5rWI {font-size: 12px!important; }.z5rWI span {display: block; width:100%;}.PvmUkc {visibility: hidden; margin-top:0px!important; }.OnSI9b:hover .PvmUkc{visibility: visible;}.BCNiN {padding: 12px 16px!important; padding-bottom: 0px!important;}.PvmUkc .JSaIGb {width: 18px!important; height: 18px!important;}.nk-postHead {width:24px; height: 24px; border-radius: 50%; margin-right: 5px; background: url('"+defaultHead+"');float: left; background-size: 24px!important;}.nk-postHead img {width: 24px; height: 24px; border-radius:50%; }.lbkpOc {line-height: 24px!important; }.SVRkP {max-height:42px!important; display: block!important;}";
    document.getElementsByTagName("head")[0].appendChild(selectStyle);

$(function(){
    //动态日志
//
  //  $('.Nb2Prf').append('<a class="M9kDrd" track:click" href="https://plus.google.com/apps/activities" target="_blank"><div class="CjySve">Activities</div></a>');

function writeHead(img,name){
		if(window.localStorage){
            storage[name] = img;
             if(storage.length > headNum) {
                 storage.removeItem(storage.key(storage.length/2));
             }
        }
}


     function isLocalStorage() {
        var testKey = 'test',
                storage = window.localStorage;
        try {
            storage.setItem(testKey, 'testValue');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    if(isLocalStorage()){
$(document).on('DOMSubtreeModified', contents, function (e) {
	 $('div.SVRkP').each(function(){
	 		var name = $(this).find(".vGowKb").html();
	 	if($(this).find('bdo').length == 0){
	 		$(this).prepend("<bdo class='nk-postHead'></bdo>");
	 	}else if(name != null) {
	 		var newHead = storage[name];
            if(newHead != null) $(this).find('.nk-postHead').css('background','url("'+newHead+'")');
	 	}
 });
 $("div.Ihwked").on('click',function(){
	setTimeout(function(){
       	$("li.BCNiN").each(function(){
	       	var imgs = $(this).find("img").attr('src');
	      	var names = $(this).find(".vGowKb").html();
	      //	if(storage.getItem(names) == null){
	      	writeHead(imgs,names);
	     // 	}
       	});
	},1200);
	});

});
    }else{
    alert("来自G+ avatar comeback   浏览器不支持localStorage");
    }
//if(bool && !$("div").hasClass("gb_Nc"))  window.location.href = changelink;
});

})();