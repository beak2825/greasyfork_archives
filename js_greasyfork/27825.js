// ==UserScript==
// @name        双栏显示搜索结果
// @namespace   none
// @description 双栏显示baidu, sogou, so, google, bing的搜索结果
// @version     1.9.14
// @include     *://www.baidu.com/*
// @include     *://www.sogou.com/*
// @include     *://www.so.com/*
// @include     *://www.google.*/*
// @include     *://*.bing.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/27825/%E5%8F%8C%E6%A0%8F%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/27825/%E5%8F%8C%E6%A0%8F%E6%98%BE%E7%A4%BA%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var domURL = document.URL;
    var element = document.createElement('style');
    if (domURL.indexOf('baidu.com') !== - 1) {
        element.innerHTML = '#content_right{display:none}.container_l,#content_left,.c-container .c-result-content,.c-container .c-container{width:auto !important}#content_left{display:flex;flex-wrap:wrap}.c-container{width:46% !important;padding-right:28px;}#rs_top_new, .hit_top_new{width:100% !important}';
    }
    if (domURL.indexOf('sogou.com') !== - 1) {
        element.innerHTML = '#right{display:none}.hintBox,.wrapper,#pagebar_container,.header,.wrap .cr > div{width:90vw !important;margin-left:115px !important;}.header .header-box{width:auto !important}#main,.results{min-width:90vw !important;padding-right:0 !important;display:flex;flex-wrap:wrap}.results>div{width:46% !important;padding-right:28px;}.search-info{position: absolute !important}';
    }
    if (domURL.indexOf('so.com') !== - 1) {
        element.innerHTML = '#side{display:none}#main,.result{width:auto !important}.result{display:flex;flex-wrap:wrap}.res-list{width:46%;margin-right:28px;}'
    }
    if (domURL.indexOf('google') !== - 1) {
        element.innerHTML = '.rhscol,#rhs.rhstc4 .VjDLd,#wp-tabs-container,.g-blk{display:none !important;}#cnt #center_col,.hlcw0c{width:89vw !important;}#rso,.hlcw0c{display:flex !important; !important;flex-wrap:wrap !important;}.g{width:45% !important;padding-right:28px !important;}.dZtbP{flex: unset !important; width:45%}#cnt #foot{width:1px !important}.vk_c{border:0px solid #dfe1e5 !important;}.AaVjTc{margin: 30px 0 !important;}'
    }
    if (domURL.indexOf('bing.com') !== - 1) {
        element.innerHTML = '#b_context{display:none}#b_results{width:100%;display:flex;flex-wrap:wrap}#b_results>li{width:46%;margin-right:28px;}.b_pag,.b_ans{width:100% !important}'
    }
    document.documentElement.appendChild(element);
}) ();
