// ==UserScript==
// @name         樱花动漫删除广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除广告元素
// @author       鲜榨芒果汁
// @match      	 *://*.zkk78.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477854/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/477854/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
    $(".adsbygoogle").remove();
    $("footer").remove();
    $("divz").remove();
    $("#coupletright").remove();
    $("#coupletleft").remove();
    $('._eptwyvialft').remove();
    $("div  p").remove();
    }
})();