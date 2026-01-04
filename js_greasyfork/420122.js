// ==UserScript==
// @name         owls贴吧顶贴
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  全自动百度贴吧顶贴/回帖/引流
// @author       原作者：公众号：404Lab   更新版白天才顶：Tencent
// @match        http://tieba.baidu.com/p/*
// @match        https://tieba.baidu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420122/owls%E8%B4%B4%E5%90%A7%E9%A1%B6%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/420122/owls%E8%B4%B4%E5%90%A7%E9%A1%B6%E8%B4%B4.meta.js
// ==/UserScript==
var j = 0 ;
var word = ['挺好','不错的帖子诶','还可以','上车打卡滴滴滴','还算可以了这波','很不错！！！','dddd','顶一哈','好','楼上你为何这么吊请大声告诉我这是几楼','我叫你一声你敢答应吗','不要崇拜哥，哥只是贴吧里的一阵风','吊炸了！','有什么不敢，你叫啊′','好顶支持~~','儿子','新手福音','老公老公，我去你们公司给你做助理吧！','新手福音','新手福音3','今天加个3','每天晚上你不再跟老婆一起睡'];
function setReplyContent(){
    if(word.length <= j){
        j = 0;
    }
    var w = word[j];
    j++;
    var html = '<p>'+w+'</p>';
    $("#ueditor_replace").html(html);
}
function submitReply(){
    $(".poster_submit").click();
}
setInterval(function(){
    setReplyContent();
    var d = new Date();
    var time = d.getHours();
//    if(time <=23&& time >=7)//半夜不顶
  //  {
    submitReply();
//    }
    },600000);//这里设置顶帖间隔时间；单位为毫秒；10分钟回一次

(function() {
    'use strict';

    // Your code here...
})();