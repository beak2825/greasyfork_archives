// ==UserScript==
// @name         催庆才博客文章隐藏显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       DannyWu
// @match        https://cuiqingcai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390417/%E5%82%AC%E5%BA%86%E6%89%8D%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/390417/%E5%82%AC%E5%BA%86%E6%89%8D%E5%8D%9A%E5%AE%A2%E6%96%87%E7%AB%A0%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function myfun() {
        document.querySelector("article.lock style").remove();
        document.getElementById("locker").remove();
        document.getElementById("postcomments").remove();
        document.getElementById("respond").remove();
        document.getElementById("comment-ad").remove();
        document.querySelector(".related_top").remove();
        document.querySelector(".article-footer").remove();
        document.querySelector(".article-nav").remove();
    }
    // 用js实现在加载完成一个页面后自动执行一个方法
    /*用window.onload调用myfun()*/
    window.onload=myfun;//不要括号

})();