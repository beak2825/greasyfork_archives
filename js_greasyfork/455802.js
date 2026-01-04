// ==UserScript==
// @name         去除灰色滤镜
// @version      0.2
// @description  Remove gray filter
// @license      MIT
// @author       hfdem(https://github.com/hfdem)
// @match        http*://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/users/990847
// @downloadURL https://update.greasyfork.org/scripts/455802/%E5%8E%BB%E9%99%A4%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455802/%E5%8E%BB%E9%99%A4%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    //大部分网站
    GM_addStyle("html, body, div, .grayCtrl .layout-Container>*{filter: none !important}");

    //腾讯游戏
    if(window.location.href.match(/https:\/\/.*.qq.com.*/)){
        document.getElementsByTagName("html")[0].style.cssText="-webkit-filter: grayscale(0%) !important;";
    }
})();