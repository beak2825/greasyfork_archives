// ==UserScript==
// @name         云端学习(课前测试)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动答题
// @author       Feng
// @match        https://ceec.21tb.com/els/html/studyCourse/studyCourse.enterCourse.do*
// @match        https://ceec.21tb.com/els/html/studyCourse/studyCourse.viewPretestPage.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447826/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E8%AF%BE%E5%89%8D%E6%B5%8B%E8%AF%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447826/%E4%BA%91%E7%AB%AF%E5%AD%A6%E4%B9%A0%28%E8%AF%BE%E5%89%8D%E6%B5%8B%E8%AF%95%29.meta.js
// ==/UserScript==

var a=document.getElementsByClassName("cs-test-title").length;
var b=document.getElementsByClassName("cs-test-title")[0].innerText;
var c=document.getElementsByClassName("cs-submit-btn")[0].innerText;
if(a==1&b=="课前测试"&c=="提交")
{var x0=document.getElementsByClassName("cs-test-wrap");//题类型数量
 var n;
for(n=0;n<x0.length;n++)
{var y0=x0[n].getElementsByClassName("cs-test-type")//第n种题类型
if(y0[0].innerText=="单选题")
{var x2=x0[n].getElementsByClassName("cs-test-item cs-item-single");//单选题数量
 var j;
for(j=0;j<x2.length;j++)
{autoanswer();}}
else if(y0[0].innerText=="多选题")
{var y2=x0[n].getElementsByClassName("cs-test-item cs-item-mult");//多选题数量
 var k;
for(k=0;k<y2.length;k++)
{autoanswer();}}
else if(y0[0].innerText=="判断题")
{var z2=x0[n].getElementsByClassName("cs-test-item cs-item-single");//判断题数量
 var m;
for(m=0;m<z2.length;m++)
{autoanswer();}}}
sleep();
document.getElementsByClassName("cs-submit-btn cs-next-btn")[0].click();
sleep();
document.getElementsByClassName("layui-layer-btn1")[0].click();
}
else if(a==1&b=="课前测试"&c=="进入下一步")
{document.getElementsByClassName("cs-submit-btn")[0].click();}

function autoanswer() {
x2[j].getElementsByClassName("cs-radio-checked")[0].click();
}

function sleep() {
var start = (new Date()).getTime();
while((new Date()).getTime() - start < 1000)
{continue;}}