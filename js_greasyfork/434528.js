
// ==UserScript==
// @name         ZD-hide
// @description  ZD-隐藏多余元素
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://www.zhundianyinwu.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/434528/ZD-hide.user.js
// @updateURL https://update.greasyfork.org/scripts/434528/ZD-hide.meta.js
// ==/UserScript==

(function() {
    'use strict';
   (document.head || document.documentElement).insertAdjacentHTML('beforeend', '<style>.logo, .pull-right, #banner, .itemList, .footer_top, .container, #productNotice, .index-l h1, #fileWrap, .pro-num-type { display: none!important; } .pro-price-item{color:rgba(0,0,0,.1)!important;} .newJ{color:gray;font-weight: normal;font-size:12px}</style>');


})();



