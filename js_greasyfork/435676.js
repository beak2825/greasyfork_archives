// ==UserScript==
// @name         info纯净阅读
// @namespace    http://jianpage.com/
// @version      0.3
// @description  简化版本阅读模式
// @author       ixx
// @match        *://www.infoq.cn/article/*
// @match        *://www.infoq.cn/news/*
// @icon         https://www.google.com/s2/favicons?domain=infoq.cn
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435676/info%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/435676/info%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    var sh,sh2;
    $(document).ready(function(){
        sh=setInterval(show,500);
    })
    function show(){
        if($(".article-main").html()){
            $(".article-main").css("background", "#e5f3ed");
            $(".inner-content").css("background", "#e5f3ed");
            $(".content-main").css("width","100%");
            $(".article-main").css("width","100%");
            $(".header").remove();
            $(".operation-bar").remove();
            $(".inner-content").css("padding-top","0")
            $(".article-aside").remove();
            $(".footer").remove();
            clearInterval(sh);
        }
    }
})();


