// ==UserScript==
// @name         CSDN 文章阅读清洁
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  CSDN文章阅读页清洁工具，去除左右两边的各类垃圾以及文章下面的评论等内容。
// @author       You
// @match        https://blog.csdn.net/lweiyue/article/details/*
// @match        https://blog.csdn.net/eric_k1m/article/details/*
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443866/CSDN%20%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%B8%85%E6%B4%81.user.js
// @updateURL https://update.greasyfork.org/scripts/443866/CSDN%20%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%B8%85%E6%B4%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function haha()
    {

    }
    function Clear()
    {
        if(document.getElementsByClassName("blog_container_aside").length==1)
        {
            document.querySelector(".blog_container_aside").hidden=true;
            document.querySelector(".recommend-right_aside").hidden=true;
            document.querySelector(".more-toolbox-new").hidden=true;
            document.querySelector(".first-recommend-box.recommend-box").hidden=true;
            document.querySelector(".second-recommend-box.recommend-box").hidden=true;
            document.querySelector(".comment-box.comment-box-new").hidden=true;
            document.querySelector(".recommend-box.insert-baidu-box.recommend-box-style").hidden=true;
            document.querySelector(".recommend-nps-box.common-nps-box").hidden=true;
            document.querySelector(".template-box").hidden=true;
            document.querySelector(".blog-footer-bottom").hidden=true;
            setTimeout(haha,1000);
        }
    }

    //__________________________________
    //程序从此处开始执行：
    console.log("脚本正常加载");
    setTimeout(Clear,1000);

})();