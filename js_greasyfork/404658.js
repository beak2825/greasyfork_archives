// ==UserScript==
// @name         简书文章纯净阅读
// @namespace    jianshu
// @version      0.1
// @description  去除文章页面的头尾和侧边栏，只保留正文
// @author       elecrabbit
// @match        *://www.jianshu.com/p/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404658/%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/404658/%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var currentUrl = window.location.href;
    var text = /jianshu.com\/p\//;
    if(text.test(currentUrl)){
        setTimeout(function(){
        var artical = $('#__next [role="main"]');
        $("header").remove();
        $("footer").next().remove();
        $("footer").remove();
            artical.children(":last").remove();
            artical.children(":first").css("width","1024px");
        },2000);
    }
    // Your code here...
})();