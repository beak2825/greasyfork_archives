// ==UserScript==
// @name         baidu2bing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度搜索页面增加bing搜索
// @author       You
// @match        *://*.baidu.com/*s?*
// @match        *://*.baidu.com/*search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423819/baidu2bing.user.js
// @updateURL https://update.greasyfork.org/scripts/423819/baidu2bing.meta.js
// ==/UserScript==

(function() {
    'use strict';

var a=document.getElementsByTagName("body")[0];
var a2=document.createElement("input");
a.appendChild(a2)
a2.value='Bing一下'
a2.style.color='#E1489E'
a2.style.width='60px'
a2.id='bingsr'
a2.style.position = "fixed";
a2.style.left = "0px";
a2.style.top = "70px";
a2.style.border='1px solid #e2e2e4'
//a2.setAttribute("href",url)
a2.setAttribute("readonly",true)
a2.onclick=function(){var str=$('#kw')[0].value;var url='https://cn.bing.com/search?q='+str;window.location.href=url}
    // Your code here...
})();