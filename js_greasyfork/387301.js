// ==UserScript==
// @icon             https://www.thfou.com/img/favicon.ico
// @name             阿里巴巴电脑端直接访问手机端
// @namespace        https://www.thfou.com/
// @version          1.0.7
// @description      优化电脑端直接访问阿里无线端页面的布局，方便浏览。
// @author           头号否
// @match            *://m.1688.com/*
// @require          https://libs.baidu.com/jquery/1.10.2/jquery.min.js
// @supportURL       https://www.thfou.com/liuyan
// @compatible	     Chrome
// @compatible	     Firefox
// @compatible	     Edge
// @compatible   	 Safari
// @compatible   	 Opera
// @compatible	     UC
// @license          GPL-3.0-only
// @run-at           document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/387301/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%94%B5%E8%84%91%E7%AB%AF%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE%E6%89%8B%E6%9C%BA%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/387301/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%94%B5%E8%84%91%E7%AB%AF%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE%E6%89%8B%E6%9C%BA%E7%AB%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
var domain = document.location.href.split("/")[3];
if ( domain == "offer_search" ){
var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML="html{font-size:50px!important;background:#ebebeb!important;}body{width: 500px!important; font-size: 50px!important;margin: 0 auto!important;}#header{width: 500px!important;}.ifr_top,.banner-and-poplayer{display:none!important;}.search-modal{position: absolute!important;}.search-modal_top{width:500px!important;}.search-modal_autocomplete{width: 500px!important; box-shadow: 0 3px 18px rgba(0,0,0,.1)!important;}";
document.getElementsByTagName('HEAD').item(0).appendChild(style);
}
else if ( domain == "" ) {
var mstyle = document.createElement('style');
    mstyle.type = 'text/css';
    mstyle.innerHTML="html{font-size:50px!important;background:#ebebeb!important;}body{width: 500px!important; font-size: 50px!important;margin: 0 auto!important;}#header{width: 500px!important;}.ifr_top,.banner-and-poplayer,#youMayLikeContent{display:none!important;}.search-modal{position: absolute!important;}.search-modal_top{width:500px!important;}.search-modal_autocomplete{width: 500px!important; box-shadow: 0 3px 18px rgba(0,0,0,.1)!important;}.footer-bar,.home-search-second{left:auto!important;}";
document.getElementsByTagName('HEAD').item(0).appendChild(mstyle);
}
})();