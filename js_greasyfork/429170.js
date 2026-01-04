// ==UserScript==
// @name         云端学习(第四种类型课程)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  网课学习4
// @author       Feng
// @include      https://tech.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @match        https://tech.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429170/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E7%AC%AC%E5%9B%9B%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%AF%BE%E7%A8%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429170/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E7%AC%AC%E5%9B%9B%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%AF%BE%E7%A8%8B%29.meta.js
// ==/UserScript==

var a= document.getElementsByClassName("cl-head-tip");
var b= document.getElementsByClassName("cl-play cl-doc-play");
if(a.length==1&&b.length==1)
{var myVar = setInterval(function(){ autoplay() }, 5000);}

function autoplay() {
var span1=document.getElementsByClassName("cl-time")[0].innerText;
var span2=document.getElementsByClassName("cl-time")[1].innerText;
if(span1==span2)
{Submit();
var span3 = document.getElementsByClassName("cl-go-link");
span3[1].click();
stopplay();}}

function stopplay() {
clearInterval(myVar);}

function Submit() {
var x=document.getElementsByClassName("top-title");
if (x.legth)
{if(x[0].title=="恭喜您已经完成课程")
{var y=document.getElementsByClassName("only-one-btn elpui-layer-btn0");
y[0].click();}}}





