// ==UserScript==
// @name         google2baidu
// @namespace    http://yuii.yui/
// @version      0.2
// @description  谷歌搜索页添加按钮，切换百度搜索
// @author       yui
// @include      *://*.google.*/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437912/google2baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/437912/google2baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';
var a=document.getElementsByClassName("main")[0];
var a2=document.createElement("a");
a.appendChild(a2)
a2.innerHTML='百<br>度'
a2.style.color='#00AAFF'
//a2.style.width='40px'
a2.id='bingsr'
a2.style.position = "absolute";
a2.style.left = "0px";
a2.style.top = "270px";
//a2.style.border='1px solid #e2e2e4'
//a2.setAttribute("href",url)
a2.setAttribute("readonly",true)
a2.onclick=function(){var str=document.getElementsByTagName('input')[0].value;var url='https://www.baidu.com/s?wd='+str;window.location.href=url}
//$(document).on('click', '#bingsr', function(){var str=$('input').value;var url='https://www.baidu.com/s?wd='+str;window.location.href=url})
})();