// ==UserScript==
// @name AC-block-keyword-from-google-and-baidu
// @namespace BlockAnyThingYouWant
// @include http://www.baidu.com/*
// @include https://www.baidu.com/*
// @include https://www.google.com/*
// @include https://www.bing.com/*
// @include /^https?\:\/\/encrypted.google.[^\/]+/
// @include /^https?\:\/\/www.google.[^\/]+/
// @include /^https?\:\/\/www.haosou.com/
// @include /^https?\:\/\/www.youdao.com/
// @require http://code.jquery.com/jquery-1.8.0.min.js
// @icon    https://coding.net/u/zb227/p/zbImg/git/raw/master/img0/icon.jpg
// @author       AC
// @version 1.0
// @run-at document-start
// @description 从谷歌 百度 必应搜索结果中屏蔽自定义关键字，关键字自己确定吧，想想大概2-3个版本就不会更新了，因为每个人的关键字不一样
// @grant note 2017.12.17 V1.3 修复在百度上的关键字屏蔽
// @grant note 2015.11.26 第一版，规则自己写吧，觉得要反馈的关键字可以在卡饭回个帖，我合适的加入
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481429/AC-block-keyword-from-google-and-baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/481429/AC-block-keyword-from-google-and-baidu.meta.js
// ==/UserScript==

var ACMO = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
/*
变量x用于                                           百度=谷歌=必应=好搜=有道
就是黑名单,自己加入自己想要屏蔽的关键字
*/
var blankList = "||"; //自己看着格式差不多加入就好
var x = blankList.split("原神||鸡你太美");
//===================================================主入口=======================================================
mo = new ACMO(function(allmutations) {
    var href = window.location.href;
    if(href.indexOf("www.baidu") > -1){
        $(".c-container").each(deal); // 百度

    } else if(href.indexOf("www.google") > -1){
        $(".g").each(deal);     // 谷歌
    } else if(href.indexOf("haosou.com") > -1){
        $(".res-list").each(deal); // 好搜
        $(".spread ").each(deal); // 好搜
        $(".brand").each(deal); // 好搜
    } else if(href.indexOf("bing.com") > -1){
        $(".b_algo").each(deal);    // 必应1
        $(".b_ans").each(deal);    // 必应2
    } else if(href.indexOf("youdao.com") > -1){
        $(".res-list").each(deal);        // 有道
    }
});
var targets = document.body;
mo.observe(targets, {'childList': true,'characterData':true,'subtree': true});

// ================================================通用处理函数==========================================================
function deal(){
    var curText = $(this).attr;
    var curText = $(this).text();
    if(checkIndexof(curText) == true){
        $(this).remove();
        //console.log("dealing with");
    }
}
/*遍历查表，如果在表中则返回true*/
function checkIndexof(element){
	var result = (element.indexOf(x[0]) > -1);
	for(var i = 1; i <= x.length; i++){
		//alert("check");
		result = result || (element.indexOf(x[i]) > - 1);
	}
	return result;
}