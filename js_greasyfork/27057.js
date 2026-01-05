// ==UserScript==
// @name 维基百科(中文版)链接新空白页打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  维基百科（中文版）链接新空白页打开
// @author       Haiifenng
// @match        https://zh.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27057/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%28%E4%B8%AD%E6%96%87%E7%89%88%29%E9%93%BE%E6%8E%A5%E6%96%B0%E7%A9%BA%E7%99%BD%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/27057/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%28%E4%B8%AD%E6%96%87%E7%89%88%29%E9%93%BE%E6%8E%A5%E6%96%B0%E7%A9%BA%E7%99%BD%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a_list=document.getElementsByTagName("a");
    for(var i=0;i<a_list.length;i++){
        var a=a_list[i];
        a.setAttribute("target", "_blank");
    }
})();