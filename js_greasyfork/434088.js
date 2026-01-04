// ==UserScript==
// @name         searchTobaidu
// @namespace	   https://greasyfork.org/users/91873
// @version	     1.0.0.1
// @description  搜索自动跳转到百度搜索
// @author	     wujixian
// @grant	       none
// @match        https://search.yahoo.com/search
// @match        https://www.bing.com/search
// @match        https://www.so.com/s
// @downloadURL https://update.greasyfork.org/scripts/434088/searchTobaidu.user.js
// @updateURL https://update.greasyfork.org/scripts/434088/searchTobaidu.meta.js
// ==/UserScript==
(function () {
  if(window.location.hostname.indexOf("bing")>0||window.location.hostname.indexOf("so")>0){
    location.href.match(/q=([^&]+)/);
  }
  if(window.location.hostname.indexOf("yahoo")>0){
    location.href.match(/p=([^&]+)/);
  }
  location.href='https://www.baidu.com/s?ie=UTF-8&wd='+RegExp.$1
}) ();