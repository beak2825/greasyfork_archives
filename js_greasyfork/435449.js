// ==UserScript==
// @name         微博免跳转
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  Weibo Link
// @include      *://*.weibo.com/*
// @include      *:*weibo.com/*
// @author       wujixian
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/435449/%E5%BE%AE%E5%8D%9A%E5%85%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/435449/%E5%BE%AE%E5%8D%9A%E5%85%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
 
(async () => {
    //获取当前所有cookie
  var strCookies = document.cookie;        
  if (strCookies.indexOf("8888")==-1) {
    document.cookie="SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9Wh1D3horExU45hblZrviw0x;domain=.weibo.com;path=/;";
    document.cookie="_s_tentry=passport.weibo.com;domain=.weibo.com;path=/;";
    document.cookie="SUB=_2AkMW08bAf8NxqwFRmP0RzGrqb4p_yQvEieKgjzcbJRMxHRl-yT9jqhxftRB6PVPoLyHmq4svN1R7omHrouSLx1I3NuuN;domain=.weibo.com;path=/;";
    document.cookie="Apache=1020857047012.4667.1636780558252;domain=.weibo.com;path=/;";
    document.cookie="SINAGLOBAL=1020857047012.4667.1636780558252;domain=.weibo.com;path=/;";
    document.cookie="ULV=1636780558294:1:1:1:1020857047012.4667.1636780558252:;domain=.weibo.com;path=/;";
    document.cookie="8888=8888;domain=.weibo.com;path=/;";
    location.reload();
  }   
}) ();