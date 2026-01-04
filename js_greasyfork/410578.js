// ==UserScript==
// @name         CSDN Lite
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  简化CSDN文章页面，去除侧边栏，去除下方课程推荐栏、下载推荐栏，全屏显示文章
// @author       Meteora
// @match        https://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410578/CSDN%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/410578/CSDN%20Lite.meta.js
// ==/UserScript==


//去侧边栏
$('#mainBox > aside').remove();
//去除文章下方关于 课程、下载 的推荐栏
$('#mainBox > main > div.recommend-box.first-recommend-box').remove();
$('#mainBox > main > div.recommend-box.second-recommend-box').remove();
$('div.recommend-download-box').remove();
$('div.type_course').remove();
//修改CSS
$("#mainBox > main").css("float","none");
$("#mainBox > main").css("width","100%");
$("#mainBox > main").css("padding","0");