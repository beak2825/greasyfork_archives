// ==UserScript==
// @name   获取培训视频地址
// @namespace   hwkxk.cn
// @version      0.1
// @description  获取培训平台中的视频，在标题下方添加下载链接。
// @author       Hwk小康
// @match        *://cstraining.alipay.com/learn*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/34239/%E8%8E%B7%E5%8F%96%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/34239/%E8%8E%B7%E5%8F%96%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
var q = document.getElementsByTagName("h3")[0];
var xxx =document.createElement("span");
xxx.setAttribute("id", "demo1");
q.appendChild(xxx);
var controllist = document.getElementsByTagName("video")[0];
var valuez = controllist.getAttribute("src");
document.getElementById("demo1").innerHTML ='丨<a href="' + valuez +'"  download="">点击下载视频</a>';
})();