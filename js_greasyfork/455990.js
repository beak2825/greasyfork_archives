// ==UserScript==
// @name         恢复色彩🌈去除网站的灰色滤镜
// @namespace    cn.ideajayve
// @version      0.1
// @description  Let there be Colorful! 当网站加载完成时恢复色彩，爱护眼睛保护视力
// @author       Jayve
// @license      GPL License
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455990/%E6%81%A2%E5%A4%8D%E8%89%B2%E5%BD%A9%F0%9F%8C%88%E5%8E%BB%E9%99%A4%E7%BD%91%E7%AB%99%E7%9A%84%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455990/%E6%81%A2%E5%A4%8D%E8%89%B2%E5%BD%A9%F0%9F%8C%88%E5%8E%BB%E9%99%A4%E7%BD%91%E7%AB%99%E7%9A%84%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function (){
        GM_addStyle(`*{filter:unset!important;}html{-webkit-filter: unset!important;-moz-filter: unset!important;-ms-filter: unset!important;-o-filter: unset!important;filter: unset!important;filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=0)!important;_filter:unset!important;}*{filter:gray!important;}html{-webkit-filter: unset!important;-moz-filter: unset!important;-ms-filter: unset!important;-o-filter: unset!important;filter: unset!important;filter:unset!important;_filter:unset!important;}`);
        const href = window.location.href;
        // Baidu
        if(href.indexOf("www.baidu.com")>=0){
            document.body.classList.remove("big-event-gray");
            let lgImg = document.getElementById("s_lg_img");
            if(lgImg){
                lgImg.src = lgImg.src.replace("_gray","");
            }
        }
    }
})();