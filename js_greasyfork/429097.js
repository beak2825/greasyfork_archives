// ==UserScript==
// @name         云端学习(第三种类型课程)
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  网课学习3
// @author       Feng
// @include      https://tech.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @match        https://tech.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429097/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E7%AC%AC%E4%B8%89%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%AF%BE%E7%A8%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429097/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E7%AC%AC%E4%B8%89%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%AF%BE%E7%A8%8B%29.meta.js
// ==/UserScript==

var a=document.getElementsByClassName("els-tip-time-pic-rms");
if(a.length)
{var myVar1 = setInterval(function(){ autosearch() }, 2000);
 var myVar2 = setInterval(function(){ autoplay() }, 5000);}

function autosearch(){
    var obj=document.getElementsByClassName("url-course-content")[0].contentWindow; //填你的需要找到元素的那一层iframe的名字
    var x= obj.document.getElementsByClassName("section-item");
    var x1 = obj.document.getElementsByClassName("icon-box")//视频数量
    var y1 = obj.document.getElementsByClassName("section-item finish");
    var z1 = obj.document.getElementsByClassName("first-line active")[0].getElementsByClassName("icon-box")[0].title;//正在播放的视频名字
    var i=0;
    while(x1[i].title!=z1)
    {i++;}
    if(i!=y1.length)
    {x[y1.length].click();
    stopautosearch();}
    else
    {stopautosearch();}}

function stopautosearch(){
    clearInterval(myVar1);}

function autoplay() {
var obj=document.getElementsByClassName("url-course-content")[0].contentWindow; //填你的需要找到元素的那一层iframe的名字
var span1 = obj.document.getElementsByClassName("next-button");
var span2 = document.getElementById("rms-studyRate");
var span4 = obj.document.getElementsByClassName("prism-big-play-btn");//播放失败
var span5 = obj.document.getElementsByClassName("prism-big-play-btn pause");//播放暂停
var span6 = obj.document.getElementsByClassName("prism-big-play-btn playing");//播放中
var span7 = obj.document.getElementsByClassName("outter");
if(span1.length==1)
{span1[0].click();}
else if(span4.length==1&&span5.length==0&&span6.length==0)
{span7[0].click();}
else if(span2.innerText==100)
{var span3 = document.getElementsByClassName("cl-go-link");
span3[0].click();
stopplay();}}

function stopplay() {
clearInterval(myVar2);}