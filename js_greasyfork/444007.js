// ==UserScript==
// @license MIT
// @name         博斯刷课-知识点+视频 不支持题目
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  skip oline lesson
// @author       Li5ngYe
// @match        *://aiit.iflysse.com/*
// @match        http://aiit.iflysse.com/Pages/Student/*
// @icon         https://www.google.com/s2/favicons?domain=iflysse.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444007/%E5%8D%9A%E6%96%AF%E5%88%B7%E8%AF%BE-%E7%9F%A5%E8%AF%86%E7%82%B9%2B%E8%A7%86%E9%A2%91%20%E4%B8%8D%E6%94%AF%E6%8C%81%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/444007/%E5%8D%9A%E6%96%AF%E5%88%B7%E8%AF%BE-%E7%9F%A5%E8%AF%86%E7%82%B9%2B%E8%A7%86%E9%A2%91%20%E4%B8%8D%E6%94%AF%E6%8C%81%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
        //获取下一页元素并click
        document.querySelectorAll("button.el-button.el-button--primary.el-button--small")[1].click();
//         setTimeout(function(){
//             document.querySelector(".btn.btn-info").click();
//         },3000);
    },13000);
})();