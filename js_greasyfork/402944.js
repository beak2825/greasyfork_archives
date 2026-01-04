// ==UserScript==
// @name         CSDN去掉不必要的内容__方便印象笔记的网页剪裁
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  每次在使用印象笔记网页插件进行网页剪裁时，选择网页正文，在csdn总会附带很多不必要的东西，这里可以去掉一些不必要的内容
// @author       in_the_wind
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402944/CSDN%E5%8E%BB%E6%8E%89%E4%B8%8D%E5%BF%85%E8%A6%81%E7%9A%84%E5%86%85%E5%AE%B9__%E6%96%B9%E4%BE%BF%E5%8D%B0%E8%B1%A1%E7%AC%94%E8%AE%B0%E7%9A%84%E7%BD%91%E9%A1%B5%E5%89%AA%E8%A3%81.user.js
// @updateURL https://update.greasyfork.org/scripts/402944/CSDN%E5%8E%BB%E6%8E%89%E4%B8%8D%E5%BF%85%E8%A6%81%E7%9A%84%E5%86%85%E5%AE%B9__%E6%96%B9%E4%BE%BF%E5%8D%B0%E8%B1%A1%E7%AC%94%E8%AE%B0%E7%9A%84%E7%BD%91%E9%A1%B5%E5%89%AA%E8%A3%81.meta.js
// ==/UserScript==
//现在发现谷歌应用商店里的adguard的插件可以更高自由度的调整并屏蔽相应的元素，推荐大家能访问的就用那个插件吧..
var myremove=function() {
    'use strict';
    let parent=document.getElementsByTagName("main");
    let child=document.getElementsByClassName("recommend-box");//推荐文章
    let child2=document.getElementsByClassName("template-box");//皮肤说明
    parent[0].removeChild(child[1]);
    parent[0].removeChild(child2[0]);
    let child1=document.getElementById("asideFooter");
    let parent1=document.getElementsByClassName("blog_container_aside");
    parent1[0].removeChild(child1);

};
setTimeout(myremove,500);