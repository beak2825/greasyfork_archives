// ==UserScript==
// @name        移除哀悼模式
// @namespace   del_filter
// @version     0.2.3
// @license     Apache 2.0
// @author      Wu_
// @description  移除各大网站的哀悼模式。
// @match       *://*/*
// @grant       GM_addStyle
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455836/%E7%A7%BB%E9%99%A4%E5%93%80%E6%82%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/455836/%E7%A7%BB%E9%99%A4%E5%93%80%E6%82%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
         .black-white,.black_white {
             -webkit-filter: grayscale(0) !important;
             -moz-filter: grayscale(0) !important;
             -ms-filter: grayscale(0) !important;
             -o-filter: grayscale(0) !important;
             filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=0);
             _filter: none;
         }
     ` );

    let html = document.querySelector('html');
    let body = document.querySelector('body');
    ChangeStyle(html);
    ChangeStyle(body);
    function ChangeStyle(dom) {
        dom.style.filter = 'unset'
    }

})();