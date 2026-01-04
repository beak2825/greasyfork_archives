// ==UserScript==
// @name         【知乎问题页】去掉边栏并进行居中优化
// @namespace    http://css.thatwind.com/
// @version      1.1
// @description  去掉知乎问题页侧边栏并进行界面居中优化
// @author       遍智
// @match        *://www.zhihu.com/question/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/37830/%E3%80%90%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E9%A1%B5%E3%80%91%E5%8E%BB%E6%8E%89%E8%BE%B9%E6%A0%8F%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%B1%85%E4%B8%AD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/37830/%E3%80%90%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E9%A1%B5%E3%80%91%E5%8E%BB%E6%8E%89%E8%BE%B9%E6%A0%8F%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%B1%85%E4%B8%AD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';


    document.addEventListener("DOMContentLoaded",go);

    

    go();


    function go(){
        var x="div.Question-mainColumn{margin: auto !important;width: 100% !important;}div.Question-sideColumn,.Kanshan-container{display: none !important;}figure{max-width: 70% !important;}.RichContent-inner{line-height: 30px !important;margin: 40px 60px !important;padding: 40px 50px !important;border: 6px dashed rgba(133,144,166,0.2) !important;border-radius: 6px !important;}.Comments{padding: 12px !important;margin: 60px !important;}";
        var y=document.createElement('style');
        y.innerHTML=x;
        document.getElementsByTagName('head')[0].appendChild(y);
    }



})();