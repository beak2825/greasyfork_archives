// ==UserScript==
// @name         百度首页净化
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  将百度首页foot底栏/辅助模式的按钮/输入框内的热搜词提示词placeholder/搜索框下方的AI搜去除，使其首页简单美观又不影响官方可自定义功能，建议根据下方截图进行设置并配合自定义壁纸使用
// @author       ylgzs666
// @match        https://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471801/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/471801/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('#bottom_layer').remove()
    $('#s_side_wrapper').remove()
    $('.new_search_guide_bub').remove()
    var kw=document.createElement('style');
    kw.innerText='#kw::placeholder{color: #00000000 !important;}';
    document.head.appendChild(kw);
})();