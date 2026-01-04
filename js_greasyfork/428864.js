// ==UserScript==
// @name         海南大学教务系统自动评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  开启脚本后点击评价会自动打分！！
// @author       龙凯利
// @match        https://jxgl.hainanu.edu.cn/jsxsd/xspj/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428864/%E6%B5%B7%E5%8D%97%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/428864/%E6%B5%B7%E5%8D%97%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
var optionbtn= document.getElementsByName("pj0601id_1");
for(var i = 0 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_2");
for(var i = 0 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_3");
for(var i = 0 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_4");
for(var i = 0 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_5");
for(var i = 1 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_6");
for(var i =2 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_7");
for(var i = 1 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_8");
for(var i = 2 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_9");
for(var i = 1 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}
var optionbtn= document.getElementsByName("pj0601id_10");
for(var i = 1 ;i<optionbtn.length;i+=5 )
{
    optionbtn[i].click();
}

var buy = document.getElementById('tj');
                  buy.click();


})();