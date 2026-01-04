// ==UserScript==
// @name         云端学习(寻找未完成课程)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  寻找未完成课程并自动开始
// @author       Feng
// @include      https://tech.21tb.com/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811
// @match        https://tech.21tb.com/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811#!%2Fels%2Fhtml%2FcourseCenter%2FcourseCenter.loadStudyTask.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429007/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E5%AF%BB%E6%89%BE%E6%9C%AA%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429007/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E5%AF%BB%E6%89%BE%E6%9C%AA%E5%AE%8C%E6%88%90%E8%AF%BE%E7%A8%8B%29.meta.js
// ==/UserScript==


var myVar = setInterval(function(){ autonextpage() }, 2000);

function autonextpage() {
var x1=document.getElementsByClassName("nc-guide-link nc-guide-link-active");//激活的标题
if(x1[0].id=="loadStudyTask")
{var h = document.getElementsByClassName("nc-tip nc-tip-list pull-right nc-active");
h[0].click();//切换至列表模式
sleep();
var span1=document.getElementsByClassName("laypage_curr")[0].innerText;//当前所在页
var span2=document.getElementsByClassName("ncp-page-total");
var span3=span2[0].innerText.substr(1,span2[0].innerText.length-2);//共几页
var x=document.getElementsByClassName("laypage_next");//下一页按钮
var y=document.getElementsByClassName("nc-course-table")[0].getElementsByTagName("tr");
var z=document.getElementsByClassName("nc-study-link");//当前页有几个课程
var i=1;
while(y[i].getElementsByTagName("td")[6].innerText=="已完成"||y[i].getElementsByTagName("td")[6].innerText=="课后测试")//获取课程是否完成
{if(i<(y.length-1))
{i++;}
else if(i==(y.length-1))
{break;}}
if(i==(y.length-1)&&span1!=span3)
{x[0].click();
var j=0
while(j<60)
{var span4=document.getElementsByClassName("laypage_curr")[0].innerText;
if(span1==span4)
{sleep();
j++;}
else
{j=2000;}}}
else if(i<(y.length-1))
{z[i-1].click();
stopautonextpage1();}
else if(span1==span3)
{stopautonextpage2();}}}

function stopautonextpage1() {
clearInterval(myVar);
}

function stopautonextpage2() {
clearInterval(myVar);
alert("所有课程已完成请添加新课程");}

function sleep() {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < 1000) {
        continue;
    }
}