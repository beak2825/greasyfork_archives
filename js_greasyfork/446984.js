// ==UserScript==
// @name         baidu2google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  增加按钮：切换为谷歌搜索结果
// @author       You
// @match        *://*.baidu.com/*s?*
// @match        *://*.baidu.com/*search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446984/baidu2google.user.js
// @updateURL https://update.greasyfork.org/scripts/446984/baidu2google.meta.js
// ==/UserScript==

(function() {
    'use strict';

var a=document.getElementsByTagName("body")[0];
var a2=document.createElement("input");
a.appendChild(a2)
a2.value='Google'
a2.style.color='#E1489E'
a2.style.width='60px'
a2.id='bingsr'
a2.style.position = "fixed";
a2.style.left = "0px";
a2.style.top = "70px";
a2.style.border='1px solid #e2e2e4'
//a2.setAttribute("href",url)
a2.setAttribute("readonly",true)
a2.onclick=function(){var str=$('#kw')[0].value;var url='https://www.google.com/search?q='+str;window.location.href=url}
    // Your code here...
})();