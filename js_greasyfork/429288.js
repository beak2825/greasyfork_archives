// ==UserScript==
// @name         云端学习(第一种类型课程)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  网课学习1
// @author       Feng
// @include      https://tech.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @match        https://tech.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429288/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E7%AC%AC%E4%B8%80%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%AF%BE%E7%A8%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429288/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E7%AC%AC%E4%B8%80%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%AF%BE%E7%A8%8B%29.meta.js
// ==/UserScript==

var a= document.getElementsByClassName("cl-head-tip");
var b= document.getElementsByClassName("themeside");
var c= document.getElementsByClassName("cl-catalog-link");
if(a.length==1&&b.length==1&&c.length==1)
{var myVar1 = setInterval(function(){ autoplay1() }, 5000);}//多个视频
else if(a.length==1&&b.length==1&&c.length==0)
{var myVar2 = setInterval(function(){ autoplay2() }, 5000);}//单个视频


function autoplay1() {
var x = document.getElementsByClassName("cl-catalog-link");
var y = document.getElementsByClassName("cl-catalog-playing");
var z = document.getElementsByClassName("cl-catalog-link-done");
var x1=videoPlay.getStatus();
if(x1=="pause"||x1=="loading")
{window.location.reload();}
var i=0;
while(x[i].title!=y[0].title)
{ i++;}
var span1=$(minStudyTime).html();
var span2=$(studiedTime).html();
if(x.length==z.length)
{var span4 = document.getElementsByClassName("cl-go-link");
span4[1].click();
stopplay1();}
else if(span1==span2&&i!=(x.length-1))
{i++;
x[i].click();}
else if(span1==span2&&i==(x.length-1))
{var span3 = document.getElementsByClassName("cl-go-link");
span3[1].click();
stopplay1();}}

function stopplay1() {
clearInterval(myVar1);}

function autoplay2() {
var span1=$(minStudyTime).html();
var span2=$(studiedTime).html();
var x1=videoPlay.getStatus();
if(span1==span2)
{var span3 = document.getElementsByClassName("cl-go-link");
span3[1].click();
stopplay2();}
else if(x1=="pause"||x1=="loading")
{window.location.reload();}}

function stopplay2() {
clearInterval(myVar2);}
