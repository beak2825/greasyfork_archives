// ==UserScript==
// @name         一夜听、恋听网、六月听书网删除广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除广告元素
// @author       鲜榨芒果汁
// @match        *://*m.ting55.com/*
// @match        *://*.6yueting.com/*
// @match        *://*.yiyeting.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ting55.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477213/%E4%B8%80%E5%A4%9C%E5%90%AC%E3%80%81%E6%81%8B%E5%90%AC%E7%BD%91%E3%80%81%E5%85%AD%E6%9C%88%E5%90%AC%E4%B9%A6%E7%BD%91%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/477213/%E4%B8%80%E5%A4%9C%E5%90%AC%E3%80%81%E6%81%8B%E5%90%AC%E7%BD%91%E3%80%81%E5%85%AD%E6%9C%88%E5%90%AC%E4%B9%A6%E7%BD%91%E5%88%A0%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
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