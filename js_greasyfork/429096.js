// ==UserScript==
// @name         云端学习(第二种类型课程)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  网课学习2
// @author       Feng
// @include      https://tech.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @match        https://tech.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429096/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E7%AC%AC%E4%BA%8C%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%AF%BE%E7%A8%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429096/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E7%AC%AC%E4%BA%8C%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%AF%BE%E7%A8%8B%29.meta.js
// ==/UserScript==

var a=document.getElementsByClassName("cd-icon cd-icon-book");
var b=document.getElementsByClassName("cl-head-tip");
if(a.length==1&&b.length==0)
{var myVar = setInterval(function(){ autoplay() }, 5000);}

function autoplay() {
var x = document.getElementsByClassName("cl-catalog-link");
var y = document.getElementsByClassName("cl-catalog-playing");
var z = document.getElementsByClassName("cl-catalog-link-done");
var x1=videoPlay.getStatus();
if(x1!="playing")
{window.location.reload();}
var i=0;
while(x[i].title!=y[0].title)
{ i++;}
var span1=videoPlay.getStatus();//获取视频播放状态
if(span1=="ended"&&i!=(x.length-1))
{i++;
x[i].click();
sleep();}
else if(span1=="ended"&&i==(x.length-1))
{var span3 = document.getElementsByClassName("cl-go-link");
span3[1].click();
stopplay();}
else if(x.length==z.length)
{var span4 = document.getElementsByClassName("cl-go-link");
span4[1].click();
stopplay();}}

function stopplay() {
clearInterval(myVar);}

function sleep() {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < 1000) {
        continue;
    }
}