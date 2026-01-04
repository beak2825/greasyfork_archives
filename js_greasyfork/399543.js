// ==UserScript==
// @name         去掉网页灰色滤镜
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       AN drew
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399543/%E5%8E%BB%E6%8E%89%E7%BD%91%E9%A1%B5%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/399543/%E5%8E%BB%E6%8E%89%E7%BD%91%E9%A1%B5%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = '* {-webkit-filter: grayscale(0%);'+
        '-moz-filter: grayscale(0%);'+
        '-ms-filter: grayscale(0%);'+
        '-o-filter: grayscale(0%);'+
        'filter: grayscale(0%);'+
        'filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=0);'+
        'filter: none!important;}';

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet)
    {
        style.styleSheet.cssText = css;
    }
    else
    {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);

})();