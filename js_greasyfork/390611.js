// ==UserScript==
// @name         淘宝title去掉淘宝网显示店名
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  none
// @author       Janeway_Ryu
// @match        https://item.taobao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390611/%E6%B7%98%E5%AE%9Dtitle%E5%8E%BB%E6%8E%89%E6%B7%98%E5%AE%9D%E7%BD%91%E6%98%BE%E7%A4%BA%E5%BA%97%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/390611/%E6%B7%98%E5%AE%9Dtitle%E5%8E%BB%E6%8E%89%E6%B7%98%E5%AE%9D%E7%BD%91%E6%98%BE%E7%A4%BA%E5%BA%97%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = document.title.replace("淘宝网",document.getElementsByClassName("tb-shop-name")[0].getElementsByTagName("dl")[0].getElementsByTagName("dd")[0].getElementsByTagName("strong")[0].getElementsByTagName("a")[0].innerText);
})();