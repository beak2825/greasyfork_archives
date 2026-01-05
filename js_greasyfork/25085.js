// ==UserScript==
// @name         屏蔽首页多余元素
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://portal.hiido.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25085/%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E5%A4%9A%E4%BD%99%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/25085/%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E5%A4%9A%E4%BD%99%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

document.getElementsByClassName('panelCon')[5].style.display = 'none';
var con = document.getElementsByClassName('con')[6];
con.innerHTML  = con.innerHTML + '<div class="QUICKENTER QUICKENTER_1" onclick="document.getElementsByClassName(\'panelCon\')[5].style.display = \'\'" style="cursor:pointer; height:64px; width:72px; margin:4px 2px 0px 2px; text-align:center; float:left;" countdata="1" countdata2="82"><div><div><img class="OAServiceIco" height="48" data="law_flow" src="images/new/icos/law_flow4.png" style="opacity: 1;"></div></div>显示微博</div>';
con.innerHTML  = con.innerHTML + '<div class="QUICKENTER QUICKENTER_1" onclick="document.getElementsByClassName(\'panelCon\')[5].style.display = \'none\'" style="cursor:pointer; height:64px; width:72px; margin:4px 2px 0px 2px; text-align:center; float:left;" countdata="1" countdata2="82"><div><div><img class="OAServiceIco" height="48" data="law_flow" src="images/new/icos/law_flow4.png" style="opacity: 1;"></div></div>隐藏微博</div>';
setTimeout("var menus = document.getElementsByClassName('ulStyle4');var allLis = menus[0].getElementsByTagName('li');var lis = document.getElementsByClassName('titles');for(var i = 0 ; i < lis.length; i++ ){if(lis[i].innerHTML == ' 互娱事业部'){menus[0].insertBefore(lis[i].parentNode.parentNode,allLis[0])}}",500);