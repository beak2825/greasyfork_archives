// ==UserScript==
// @name         屏蔽搜狐新闻广告
// @namespace    sohu_news_ad
// @author       lingmoumou
// @description  搜狐新闻屏蔽广告
// @match        *://www.sohu.com/*
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version      0.0.0.2
// @downloadURL https://update.greasyfork.org/scripts/386792/%E5%B1%8F%E8%94%BD%E6%90%9C%E7%8B%90%E6%96%B0%E9%97%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/386792/%E5%B1%8F%E8%94%BD%E6%90%9C%E7%8B%90%E6%96%B0%E9%97%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

$(document).ready(function(){
   function modify() {
    $("godR").css("display", "none");
  }
  
  modify();
});
