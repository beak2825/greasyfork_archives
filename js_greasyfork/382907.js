// ==UserScript==
// @name         有道精品课听课页面优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化界面，去除进度条上方影响观看的缩略图
// @author       JiuYin
// @match        http://live.youdao.com/live/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382907/%E6%9C%89%E9%81%93%E7%B2%BE%E5%93%81%E8%AF%BE%E5%90%AC%E8%AF%BE%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/382907/%E6%9C%89%E9%81%93%E7%B2%BE%E5%93%81%E8%AF%BE%E5%90%AC%E8%AF%BE%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
         $("div.slick-initialized.slick-slider.Preview_container_3aX.previewContainer.vjs-control-bar").html("");
    }
})();