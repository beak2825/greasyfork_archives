// ==UserScript==
// @name         解除谷歌“手气不错”、知乎链接的重定向
// @name:zh-CN   解除谷歌“手气不错”、知乎链接的重定向
// @name:en-US   Solve Google I'm Feeling Lucky Redirect Problem/ Zhihu Redirect Problem
// @namespace    SolveRedirect
// @version      0.4
// @author       Bilibili Up 漫游挨踢
// @include     *google.com/*
// @include     *link.zhihu.com/*
// @grant        none
// @description:zh-cn  谷歌手气不错以及知乎会阻止跳转网站，此脚本用于解决此问题。
// @description:en-US  Google 's I'm feeling Lucky and Zhihu will cause redirect problem.This script will solve that.
// @description 谷歌手气不错以及知乎会阻止跳转网站，此脚本用于解决此问题。
// @downloadURL https://update.greasyfork.org/scripts/391383/%E8%A7%A3%E9%99%A4%E8%B0%B7%E6%AD%8C%E2%80%9C%E6%89%8B%E6%B0%94%E4%B8%8D%E9%94%99%E2%80%9D%E3%80%81%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E7%9A%84%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/391383/%E8%A7%A3%E9%99%A4%E8%B0%B7%E6%AD%8C%E2%80%9C%E6%89%8B%E6%B0%94%E4%B8%8D%E9%94%99%E2%80%9D%E3%80%81%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E7%9A%84%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a ="";
    //console.log("it works");alert("Hello World!");
    if(location.href.match(/(https:\/\/www\.)?google\.com\/url\?q=http.+/)){
        a = location.href;
        a=a.replace("https://www.google.com/url?q=","");
        a=a.replace(/%25/g,"%");
        location.href = a;
    }

    if(location.href.match(/(https:\/\/link\.)?zhihu\.com\/\?target=.+/)){
        a = location.href;
        a=a.replace(/.+target=/,"").replace("https%3A","https:").replace("http%3A","https:");
        a=a.replace(/%25/g,"%");
        console.log(a);
        location.href = a;
//        console.log(location.href );
    }
    // Your code here...
})();