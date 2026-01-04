// ==UserScript==
// @name         CSDN显示全部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  [CSDN]
// @author       Blue Fire
// @match        *://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375853/CSDN%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/375853/CSDN%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
        var article = $('#article_content')
        if(article.css("overflow") == "hidden"){
            article.css("overflow", "auto");
            article.css("height", "auto");
            var hide_box = $('.hide-article-box.text-center');
            hide_box.css("display", "none");
            var artH = article.height();
        }
    });
})();