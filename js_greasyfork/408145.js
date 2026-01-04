// ==UserScript==
// @name         全自动 百度 贴吧 顶贴
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  全自动百度贴吧顶贴/回帖/引流
// @author       公众号：404Lab 
// @match        http://tieba.baidu.com/p/*
// @match        https://tieba.baidu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408145/%E5%85%A8%E8%87%AA%E5%8A%A8%20%E7%99%BE%E5%BA%A6%20%E8%B4%B4%E5%90%A7%20%E9%A1%B6%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/408145/%E5%85%A8%E8%87%AA%E5%8A%A8%20%E7%99%BE%E5%BA%A6%20%E8%B4%B4%E5%90%A7%20%E9%A1%B6%E8%B4%B4.meta.js
// ==/UserScript==
var j = 0 ;
var word = ['滴滴滴','上车了','不错不错','上车滴滴滴','还算可以了这波','很不错！！！','dddd','顶一哈','好','楼上你为何这么吊请大声告诉我这是几楼','本吊夜观天象，楼下肯定有帅哥美女出现⊙.⊙','不要崇拜哥，哥只是贴吧里的一阵风','吊炸了！','哈哈哈哈哈哈不错~`(*∩_∩*)′','好顶支持~~'];
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
    submitReply();
    },20000);//这里设置顶帖间隔时间；单位为毫秒；默认20秒；

(function() {
    'use strict';

    // Your code here...
})();