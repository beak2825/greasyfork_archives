// ==UserScript==
// @name         黑TMD白
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  那是你爹，不是人民的爹。
// @author       人民
// @match        *://*/*
// @exclude      *://www.douyin.com*
// @exclude      *://www.bilibili.com/bangumi/media/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455826/%E9%BB%91TMD%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455826/%E9%BB%91TMD%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    var filter = document.createElement('style');
    filter.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(filter);
    filter.appendChild(document.createTextNode("*{filter:grayscale(0%)!important;-webkit-filter:grayscale(0%)!important;}"));
    var windowUrl = window.location.href;
    console.log(windowUrl);
    if( windowUrl.match(/https:\/\/www.baidu.com\/$/)){
        document.getElementById("s_lg_img").setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/index.png");
        document.getElementById("s_lg_img_new").setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/index.png");
        document.getElementById("su").style.setProperty("background-color","#4e6ef2","important");
        if (document.getElementsByClassName("index-logo-src").length==1){
            document.getElementsByClassName("index-logo-src")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
            document.getElementsByClassName("index-logo-peak")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
            document.getElementsByClassName("index-logo-srcnew")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
        }
    }
    if( windowUrl.match(/https:\/\/m.baidu.com\/$/)){
        document.getElementById("logo").getElementsByTagName("a")[0].getElementsByTagName("img")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/logo_web.png");
        document.getElementById("index-bn").style.setProperty("background-color","#4e6ef2","important");
    }
    if( windowUrl.match(/https:\/\/bbs.kafan.cn\/$/)){
        document.getElementById("nv_forum").style.setProperty("background-blend-mode","normal");
    }
    if( windowUrl.match(/https:\/\/www.58pic.com\/$/)){
        document.documentElement.style.setProperty("-webkit-filter","grayscale(0%)","important");
    }
    if( windowUrl.match(/https:\/\/115.com/)){
        filter.appendChild(document.createTextNode(".container-ceiling, .container-main, .dialog-box, .feature-float, .article-reader{-webkit-filter:none!important;}"));
    }
})();