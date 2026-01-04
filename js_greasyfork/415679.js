// ==UserScript==
// @name         浏览器打开；我偏不下载APP；我就用浏览器看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为一些网站 文章添加一个“浏览器打开”的选择，不下载APP就可以看文章或博文；目前先支持新浪新闻
// @author       zhengmingliang
// @require      https://greasyfork.org/scripts/415668-zmquery3-5-1/code/zmQuery351.js?version=866815
// @match        https://*.sina.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415679/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80%EF%BC%9B%E6%88%91%E5%81%8F%E4%B8%8D%E4%B8%8B%E8%BD%BDAPP%EF%BC%9B%E6%88%91%E5%B0%B1%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/415679/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80%EF%BC%9B%E6%88%91%E5%81%8F%E4%B8%8D%E4%B8%8B%E8%BD%BDAPP%EF%BC%9B%E6%88%91%E5%B0%B1%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $$$ = $ || window._$ || zmQuery;
    var href = window.location.href;
    var style = $$$("<style></style>");
    var borderCss = ".my-link-border{color:#fe362c;border:1px solid #fe362c; float:right}" +
        ".new-line{width:100%; margin-top: 4px}"
    style.append(borderCss);
    $$$("head").append(style[0])


    function addLink(each ,dataSelector){
        $$$(each).each(function () {
            if ($$$(this).find("div[class=new-line]").length > 0) {
                return false;
            }
            let href = $$$(this).data(dataSelector);

            let html = "<div class='new-line'><a class=\"my-link-border\" href='"+href+"' target=\"_self\">浏览器打开</a></div>"
            console.log(href);
            $$$(this).append(html);
        })
    }

    if(href = "sina.cn"){
        let count = 0;
        let interval = setInterval(function (){
            if ($$$("#j_relevent_news > a").length > 0) {
                addLink("#j_relevent_news > a","href")
                clearInterval(interval)
            }
            if ($$$("#j_relevent_reading > a").length > 0) {
                addLink("#j_relevent_reading > a","href")
                clearInterval(interval)
            }
            if(count ++ > 30){
                clearInterval(interval)
            }

        },1000)

    }


})();