// ==UserScript==
// @name         作业帮优化
// @namespace    undefined
// @version      0.2
// @description  删除作业帮分享页的广告和优化页面
// @author       ByteCat
// @match        *://www.zybang.com/question/rcswebview/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39070/%E4%BD%9C%E4%B8%9A%E5%B8%AE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/39070/%E4%BD%9C%E4%B8%9A%E5%B8%AE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Class 定位 元素 删除函数
    function removeElementsByClass(className){
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    // 删除作业本推广下载 Logo
    removeElementsByClass("header");
    // 删除拍摄的原题
    removeElementsByClass("card question");
    // 删除“参考例题”的条条
    var title = document.getElementsByClassName("refer-title");
    title[0].parentNode.className = "temp-title";
    removeElementsByClass("temp-title");
    // 删除“考点”和“分析”
    var temp = document.getElementsByClassName("refer-answer");
    temp[0].parentNode.className = "kaodian";
    temp[1].parentNode.className = "fenxi";
    removeElementsByClass("kaodian");
    removeElementsByClass("fenxi");


})();