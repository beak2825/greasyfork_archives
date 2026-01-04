// ==UserScript==
// @name         狂按b站视频结束的取消连播按钮
// @namespace    https://greasyfork.org/zh-CN/scripts/474450-%E7%8B%82%E6%8C%89b%E7%AB%99%E8%A7%86%E9%A2%91%E7%BB%93%E6%9D%9F%E7%9A%84%E5%8F%96%E6%B6%88%E8%BF%9E%E6%92%AD%E6%8C%89%E9%92%AE
// @version      0.2
// @description  狂按b站视频结束的取消连播按钮。
// @author       beibeibeibei
// @license      MIT
// @match        *.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474450/%E7%8B%82%E6%8C%89b%E7%AB%99%E8%A7%86%E9%A2%91%E7%BB%93%E6%9D%9F%E7%9A%84%E5%8F%96%E6%B6%88%E8%BF%9E%E6%92%AD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/474450/%E7%8B%82%E6%8C%89b%E7%AB%99%E8%A7%86%E9%A2%91%E7%BB%93%E6%9D%9F%E7%9A%84%E5%8F%96%E6%B6%88%E8%BF%9E%E6%92%AD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let 时间间隔 = 500;

    let timer = setInterval(function() {

        let 取消连播按钮 = document.querySelector("div.bpx-player-ending-related-item-cancel");
        if ( 取消连播按钮 ){
            取消连播按钮.click();
        }

    }, 时间间隔);
    // Your code here...
})();
