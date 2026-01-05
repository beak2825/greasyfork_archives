// ==UserScript==
// @name         起点小说阅读页面跳转wwwploy旧版
// @namespace    http://tampermonkey.net/
// @version        0.3
// @description  try to take over the world!
// @author       ufa31415
// @match        http://*.qidian.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13999/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%ACwwwploy%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/13999/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%ACwwwploy%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
var l=location.toString();
var q="";
if(l.indexOf("http://read.")>=0){
q=l.split("http://read.")[1].split("&")[0];
}
if(q!="")
{
  location.href="http://wwwploy."+q;
}
