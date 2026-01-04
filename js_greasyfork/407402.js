// ==UserScript==
// @name         简书沉浸模式
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  优化简书的UI样式并去除广告
// @author       lnwazg
// @match        https://www.jianshu.com/p/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407402/%E7%AE%80%E4%B9%A6%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/407402/%E7%AE%80%E4%B9%A6%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        setTimeout(function(){
            $("div._3Pnjry").remove();
            $("div._2oDcyf").remove();

            $("div._1kCBjS").remove();
            $("div._19DgIp").remove();
            $("div._13lIbp").remove();
            $("div.d0hShY").remove();

            $(".QxT4hD").hide();
            $("._2Nttfz").remove();

            $("aside").remove();
            $("#note-page-comment").remove();

            $("._gp-ck").width(1200);

            $(".ouvJEz").removeAttr("background-color");
            $(".VYwngI").hide();

        },600);
    });
})();