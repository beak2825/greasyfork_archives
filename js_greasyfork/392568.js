// ==UserScript==
// @name         THU网络学堂重排插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       hkz
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        http*://learn.tsinghua.edu.cn/f/wlxt/index/course/student/

// @downloadURL https://update.greasyfork.org/scripts/392568/THU%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%82%E9%87%8D%E6%8E%92%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/392568/THU%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%82%E9%87%8D%E6%8E%92%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


$('#suoxuecourse').ready(function ()
{
'use strict';
var ClassBox=$('#suoxuecourse');  //总课程框
var Classes=$('dd.clearfix.stu'); //各个课程框
var SortedClasses=[];             //排序后的课程数组
for(var i=0;i<Classes.length;i++)
SortedClasses[i]=Classes[i];
SortedClasses.sort(
function(c1,c2)
{
    var h1=parseInt(($('span.green.stud',c1)).text());
    var h2=parseInt(($('span.green.stud',c2)).text());
    var n1=parseInt(($('span.orange.stud',c1)).text());
    var n2=parseInt(($('span.orange.stud',c2)).text());
    if(h1===h2) return n2-n1;else return h2-h1;
})
for(i=0;i<Classes.length;i++)
ClassBox.append(SortedClasses[i]);
})();