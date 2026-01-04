// ==UserScript==
// @name         🍉视频一键关注（按F上车）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  打开某个大v的粉丝列表，按F直接一键关注其粉丝。注意不能关注太多，否则会被风控！一天不超过200个。
// @author       Floating Leaves
// @match        https://www.ixigua.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405983/%F0%9F%8D%89%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E5%85%B3%E6%B3%A8%EF%BC%88%E6%8C%89F%E4%B8%8A%E8%BD%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/405983/%F0%9F%8D%89%E8%A7%86%E9%A2%91%E4%B8%80%E9%94%AE%E5%85%B3%E6%B3%A8%EF%BC%88%E6%8C%89F%E4%B8%8A%E8%BD%A6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.onkeydown=function(e){
var keyNum=window.event ? e.keyCode :e.which;
if(keyNum==70){
var elementsByClassName = document.getElementsByClassName('component-follow');
var i=0;
var mount=10;//改变此值可以改变按一次F关注的人数，不要按太快，此值也不要太大。
var e2 = document.createEvent("MouseEvents");
e2.initEvent("click", true, true);
while (i<mount){
    i++;
    elementsByClassName[i].dispatchEvent(e2);
    elementsByClassName[i].Class='icon-done';
    e2 = document.createEvent("MouseEvents");
    e2.initEvent("click", true, true);
}
}

}
}
    // Your code here...
)();