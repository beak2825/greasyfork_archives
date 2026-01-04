// ==UserScript==
// @name         早教中国免登陆下载
// @namespace    https://imewchen.com/
// @version      0.1.1
// @description  去除早教中国的注册/登陆限制
// @author       MewChen
// @include      http*://zaojiao-china.com/*
// @include      http*://*.zaojiao-china.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40192/%E6%97%A9%E6%95%99%E4%B8%AD%E5%9B%BD%E5%85%8D%E7%99%BB%E9%99%86%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/40192/%E6%97%A9%E6%95%99%E4%B8%AD%E5%9B%BD%E5%85%8D%E7%99%BB%E9%99%86%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $('.blackCover').css('display','none');
        $('.Re-Login').css('display','none');
        $('.allTransparents').css('display','none');
    });
})();