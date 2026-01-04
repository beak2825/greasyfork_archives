// ==UserScript==
// @name         Chinesepornmovie PLUS增强插件（去除广告/清爽页面）
// @namespace    http://www.vernonshao.com
// @version      0.1
// @description  去除Chinesepornmovie广告/清爽页面
// @author       Vernon
// @match        *://*chinesepornmovie.net/*
// @downloadURL https://update.greasyfork.org/scripts/373198/Chinesepornmovie%20PLUS%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E6%B8%85%E7%88%BD%E9%A1%B5%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/373198/Chinesepornmovie%20PLUS%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E6%B8%85%E7%88%BD%E9%A1%B5%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {

        //删除所有广告
        var x = document.getElementsByClassName("ads-placment");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.display ="none";
        }

})();