// ==UserScript==
// @name         王总域名检查跳转
// @namespace    baiwudu.com
// @version      1.1.2
// @description  王总广告代码代码
// @author       作者：王总
// @match        *://www.baiwudu.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/385730/%E7%8E%8B%E6%80%BB%E5%9F%9F%E5%90%8D%E6%A3%80%E6%9F%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/385730/%E7%8E%8B%E6%80%BB%E5%9F%9F%E5%90%8D%E6%A3%80%E6%9F%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

var href = location.href ;
if(href.indexOf("baidu")>-1){
  //跳转用户访问谷歌则跳转到百度
  location.href = "http://www.qqwyy.cn";
}

var href = location.href ;
if(href.indexOf("ctrip")>-1){
  //跳转用户访问谷歌则跳转到百度
  location.href = "http://www.qqwyy.cn";
}