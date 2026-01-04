// ==UserScript==
// @name         云端学习(课程页面自动刷新)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  课程页面自动刷新(10分钟)
// @author       Feng
// @match        https://tech.21tb.com/els/html/index.parser.do?id=NEW_COURSE_CENTER&current_app_id=8a80810f5ab29060015ad1906d0b3811
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429023/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E8%AF%BE%E7%A8%8B%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429023/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E8%AF%BE%E7%A8%8B%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%29.meta.js
// ==/UserScript==


var myVar1 = setInterval(function(){ myrefresh() }, 600000);

function myrefresh()
{
var x1=document.getElementsByClassName("nc-guide-link nc-guide-link-active");//激活的标题
if(x1[0].id=="loadStudyTask")
{window.location.reload();}
}