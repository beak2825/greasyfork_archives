// ==UserScript==
// @name         京东供应商后台体验优化
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  京东供应商后台体验优化 enhance
// @author       You
// @license      MIT

// @match        https://procurement.jd.com/*
// @match        https://vcreturns.jd.com/*
// @match        https://promo.shop.jd.com/*
// @match        https://bipower.jd.com/*

// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474580/%E4%BA%AC%E4%B8%9C%E4%BE%9B%E5%BA%94%E5%95%86%E5%90%8E%E5%8F%B0%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/474580/%E4%BA%AC%E4%B8%9C%E4%BE%9B%E5%BA%94%E5%95%86%E5%90%8E%E5%8F%B0%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function(){
        // 采购单, 退货单
        if(location.hostname=="procurement.jd.com" || location.hostname=="vcreturns.jd.com"){
            $(".shop-pageframe__container").css({"width":"1770px"});
            $(".shop-pageframe__body").css({"width":"1570px"});
        }
        // 活动促销
        if(location.hostname=="promo.shop.jd.com"){
            $(".shop-pageframe__container").css({"width":"100%"});
            $(".shop-pageframe__body").css({"width":"100%"});
        }
        // 运营监控
        if(location.hostname=="bipower.jd.com"){
            setTimeout(() => {
                $(".paint-wrapper").css({"width":"2000px"});
                $(".paint-wrapper-children").css({"width":"100%"});
                $(".drr:eq(2)").css({"left":0, "width":"100%"});
            }, 0);
        }
    });
})();