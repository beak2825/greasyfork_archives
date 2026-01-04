// ==UserScript==

// @name         第一会所阅读模式

// @namespace    http://tampermonkey.net/

// @version      0.5

// @description  try to take over the world!

// @author       You

// @match        http://38.103.161.226/forum/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/389421/%E7%AC%AC%E4%B8%80%E4%BC%9A%E6%89%80%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/389421/%E7%AC%AC%E4%B8%80%E4%BC%9A%E6%89%80%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==



(function() {

    'use strict';

var className = document.getElementsByClassName("t_msgfont");

var str = className[0].innerHTML;

str=str.replace(/&nbsp;/ig,'');//去掉
str=str.replace("<table>(.*?)</table>",'');//去掉


document.write('<body style="background-color:#9fb157;line-height:200%;"><div style="margin: 5% auto 5% auto;width: 50%;background-color:#333333;color:#009688;box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.2);">'+'<div style="padding:5%;font-size:12px;">'+str+'</div>'+'</div></body>');

var obj = document.getElementsByTagName("table");
obj.parentNode.removeChild(obj);

})();
