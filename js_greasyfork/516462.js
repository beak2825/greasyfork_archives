// ==UserScript==
// @name         东方财富研报OpenPDF
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  浏览研报页面直接打开PDF
// @author       Hunk
// @match        *://data.eastmoney.com/*
// @icon         https://data.eastmoney.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516462/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E7%A0%94%E6%8A%A5OpenPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/516462/%E4%B8%9C%E6%96%B9%E8%B4%A2%E5%AF%8C%E7%A0%94%E6%8A%A5OpenPDF.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var hy_pdf=document.querySelector('.pdf-link');
    if(hy_pdf){
        console.log(hy_pdf.href);
        location.href=hy_pdf.href;
    }
    var gg_pdf=document.querySelector('a[style="color: #039; text-decoration: underline; font-family: 宋体; font-size: 14px;"]');
    if(gg_pdf){
        console.log(gg_pdf.href);
        location.href=gg_pdf.href;
    }

})();
