// ==UserScript==
// @name         淘宝天猫分类加文字描述&一淘快捷搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键跳转到一淘搜索返利
// @author       You
// @match        https://item.taobao.com/*
// @match        https://detail.tmall.com/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/406484/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%88%86%E7%B1%BB%E5%8A%A0%E6%96%87%E5%AD%97%E6%8F%8F%E8%BF%B0%E4%B8%80%E6%B7%98%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/406484/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%88%86%E7%B1%BB%E5%8A%A0%E6%96%87%E5%AD%97%E6%8F%8F%E8%BF%B0%E4%B8%80%E6%B7%98%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

GM_addStyle ( `

        .J_TSaleProp.tb-img.tb-clearfix > li > a {
          width: auto !important;
          background-position-x: left !important;
        }

        .J_TSaleProp.tb-img.tb-clearfix > li > a > span {
          display: inline !important;
          margin-left:40px;
        }
        .J_TSaleProp.tb-img.tb-clearfix > li > a > p {
          display: inline !important;
          margin-left:40px;
        }

        .tm-clear.J_TSaleProp.tb-img > li > a[href='#'] {
          width: auto !important;
          float: none;
          display: block;
          background-position-x: left !important;
          text-align: left;
        }

        .tm-clear.J_TSaleProp.tb-img > li > a > span {
          display: inline !important;
          margin-left:40px;
        }

` );

$(document).ready(function(){

    var str = $('h3.tb-main-title').text();
    var url = 'https://www.etao.com/search.htm?spm=1002.8274268.2698880.6862&nq='+ $.trim(str);
    $('h3.tb-main-title').append("<a href='"+ encodeURI(encodeURI(url)) +"' target='view_window'><img src=https://img.alicdn.com/tps/TB1_hriOVXXXXXYaXXXXXXXXXXX-32-32.ico></a>");


    var str1 = $('.tb-detail-hd h1').text();
    var url1 = 'https://www.etao.com/search.htm?spm=1002.8274268.2698880.6862&nq='+ $.trim(str1);
    $('.tb-detail-hd h1').append("<a href='"+ encodeURI(encodeURI(url1)) +"' target='view_window'><img src=https://img.alicdn.com/tps/TB1_hriOVXXXXXYaXXXXXXXXXXX-32-32.ico></a>");
});
