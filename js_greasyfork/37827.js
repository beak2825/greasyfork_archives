// ==UserScript==
// @name         去除淘宝/天猫搜索页的广告侧边栏
// @namespace    http://css.thatwind.com/
// @version      1.3
// @description  去除 淘宝和天猫商品、店铺搜索页 的广告侧边栏和底栏
// @author       遍智
// @match        *://s.taobao.com/search*
// @match        *://list.tmall.com/search_product*
// @match        *://shopsearch.taobao.com/search*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/37827/%E5%8E%BB%E9%99%A4%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E6%90%9C%E7%B4%A2%E9%A1%B5%E7%9A%84%E5%B9%BF%E5%91%8A%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/37827/%E5%8E%BB%E9%99%A4%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E6%90%9C%E7%B4%A2%E9%A1%B5%E7%9A%84%E5%B9%BF%E5%91%8A%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';


    document.addEventListener("DOMContentLoaded",go);



    go();


    function go(){
        if(location.href.indexOf('shopsearch')!=-1){forShopsearch();return;}
        var x=" .list-item{margin:0 auto !important;}#J_Recommend{display: none;}div.grid-left{width: 100% !important;}div.grid-right{display: none !important;}#mainsrp-p4pBottom{display: none;} ";
        var y=document.createElement('style');
        y.innerHTML=x;
        document.getElementsByTagName('head')[0].appendChild(y);
    }

    function forShopsearch(){
        var x=".grid-right{display: none !important;}.grid-left{float: none !important;}.grid-total,#J_SiteNavBd,#srp-footer>.footer{width: 990px !important;}";
        var y=document.createElement('style');
        y.innerHTML=x;
        document.getElementsByTagName('head')[0].appendChild(y);
    }


})();