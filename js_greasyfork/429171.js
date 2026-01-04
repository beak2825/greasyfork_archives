// ==UserScript==
// @name         云端学习(自动评估)
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  自动评估
// @author       Feng
// @match        https://tech.21tb.com/els/html/studyCourse/studyCourse.enterCourse.do*
// @match        https://tech.21tb.com/els/html/studyCourse/studyCourse.viewEvaluatePage.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429171/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BC%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429171/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BC%B0%29.meta.js
// ==/UserScript==


var a=document.getElementsByClassName("cs-menu-link").length;
var b=document.getElementsByClassName("cs-item-active")[0].getElementsByClassName("cs-menu-link")[0].title;
var e=document.getElementsByClassName("cs-evaluate-tip");
if(a==2&&b=="课程评估"&&e[0].innerText=="恭喜您已经完成课程学习，请完成课程评估。")
{c();}
else if(a>=3&&b=="课程评估"&&e[0].innerText=="恭喜您已经完成课程学习，请完成课程评估。")
{d();}
else if(e[0].innerText=="恭喜您已完成课程评估。")
{document.getElementsByClassName("cs-close-btn pull-right cs-btn-head")[0].click();
sleep();
var myVar2 = setInterval(function(){ Submit2() }, 1000);}

function c(){
var x=document.getElementsByClassName("cs-input-star");
x[4].click();
var y=document.getElementsByClassName("cs-radio-checked");
var i;
for (i = 4; i <y.length; i=i+5)
{y[i].style.display="inline";
y[i].click();}
var z=document.getElementsByClassName("cs-submit-btn cs-eval-btn")
z[0].click();
sleep();
var myVar1 = setInterval(function(){ Submit1() }, 1000);
sleep();
var myVar4 = setInterval(function(){ Submit4() }, 1000);
sleep();
var x5=document.getElementsByClassName("cs-close-btn pull-right cs-btn-head");
x5[0].click();
sleep();
var myVar2 = setInterval(function(){ Submit2() }, 1000);}

function d(){
var x=document.getElementsByClassName("cs-input-star");
x[4].click();
var y=document.getElementsByClassName("cs-radio-checked");
var i;
for (i = 4; i <y.length; i=i+5)
{y[i].style.display="inline";
y[i].click();}
var z=document.getElementsByClassName("cs-submit-btn cs-eval-btn")
z[0].click();
sleep();
var myVar1 = setInterval(function(){ Submit1() }, 1000);
sleep();
var myVar3 = setInterval(function(){ Submit3() }, 1000);//带课程测试的
sleep();
var x5=document.getElementsByClassName("cs-close-btn pull-right cs-btn-head");
x5[0].click();
sleep();
var myVar2 = setInterval(function(){ Submit2() }, 1000);}

function Submit1() {
var x1=document.getElementsByClassName("layui-layer-content")[0].innerText;
if (x1=="确定要提交吗？")
{var y1=document.getElementsByClassName("layui-layer-btn1");
y1[0].click();
stopSubmit1();}}

function stopSubmit1() {
clearInterval(myVar1);}

function Submit2() {
var x2=document.getElementsByClassName("layui-layer-content")[0].innerText;
if (x2=="您确定要退出课程学习吗？")
{var y2=document.getElementsByClassName("layui-layer-btn1");
y2[0].click();
stopSubmit2();}}

function stopSubmit2() {
clearInterval(myVar2);}

//带课程测试的
function Submit3() {
var x3=document.getElementsByClassName("layui-layer-content");
var y3=x3[0].getElementsByClassName("cs-score-text")[0].innerText;
if (y3=="您对这门课程的评估已提交!")
{var z3=document.getElementsByClassName("layui-layer-btn0");
z3[0].click();
stopSubmit3();}}

function stopSubmit3() {
clearInterval(myVar3);}
//带课程测试的

function Submit4() {
var x4=document.getElementsByClassName("top-title");
var y4=x4[0].title;
if (y4=="您对这门课程的评估已提交!")
{var z4=document.getElementsByClassName(" only-one-btn elpui-layer-btn0");
z4[0].click();
stopSubmit4();}}

function stopSubmit4() {
clearInterval(myVar4);}

function sleep() {
var start = (new Date()).getTime();
while((new Date()).getTime() - start < 1000)
{continue;}}