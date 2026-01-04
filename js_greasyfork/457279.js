// ==UserScript==
// @name         京东佣金助手-浏览京东商品实现显示推广的佣金金额，佣金比例
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @run-at       document-idle
// @description  “京东佣金助手”，可以方便用户在浏览京东商品的实现显示推广的佣金金额，佣金比例。由于时间仓促，难免会有bug，如有问题QQ：3140905638，QQ群：455422537。
// @description:zh-CN  “京东佣金助手”，可以方便用户在浏览京东商品的实现显示推广的佣金金额，佣金比例。由于时间仓促，难免会有bug，如有问题QQ：3140905638，QQ群：455422537。
// @author       Satan
// @include		 http*://item.jd.com/*
// @include		 http*://item.jd.hk/*
// @require        https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/457279/%E4%BA%AC%E4%B8%9C%E4%BD%A3%E9%87%91%E5%8A%A9%E6%89%8B-%E6%B5%8F%E8%A7%88%E4%BA%AC%E4%B8%9C%E5%95%86%E5%93%81%E5%AE%9E%E7%8E%B0%E6%98%BE%E7%A4%BA%E6%8E%A8%E5%B9%BF%E7%9A%84%E4%BD%A3%E9%87%91%E9%87%91%E9%A2%9D%EF%BC%8C%E4%BD%A3%E9%87%91%E6%AF%94%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457279/%E4%BA%AC%E4%B8%9C%E4%BD%A3%E9%87%91%E5%8A%A9%E6%89%8B-%E6%B5%8F%E8%A7%88%E4%BA%AC%E4%B8%9C%E5%95%86%E5%93%81%E5%AE%9E%E7%8E%B0%E6%98%BE%E7%A4%BA%E6%8E%A8%E5%B9%BF%E7%9A%84%E4%BD%A3%E9%87%91%E9%87%91%E9%A2%9D%EF%BC%8C%E4%BD%A3%E9%87%91%E6%AF%94%E4%BE%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.unmou.com/yongjin/jd/getJdGoodsInfo?url=" + encodeURIComponent(window.location.href),
        onload: function(response) {
            if (response.readyState == 4) {
                var result = JSON.parse(response.responseText);
                appendHtml(result);
            }
        }
    });

    function appendHtml(dataObj) {
        var pcpriceHtml = '<span class="p-price jd_pc" style="margin-left: 20px"><span>佣金：￥</span><span class="price commision">' + (dataObj.unitPrice * (dataObj.commisionRatioPc / 100)).toFixed(2) + '</span><span class="rate">(' + dataObj.commisionRatioPc + '%)</span></span>';
        $('.dd .p-price').after(pcpriceHtml);
        if (dataObj.unitPrice != dataObj.wlUnitPrice) {
            var wlPriceHtml = '<div class="summary-price J-summary-price">\n' +
                '    <div class="dt">无 线 端</div>\n' +
                '    <div class="dd">\n' +
                '        <span class="p-price jd_wl"><span>￥</span><span class="price">' + dataObj.wlUnitPrice + '</span></span><span class="p-price jd_pc" style="margin-left: 20px"><span>佣金：￥</span><span class="price commision">' + (dataObj.wlUnitPrice * (dataObj.commisionRatioWl / 100)).toFixed(2) + '</span><span class="rate">(' + dataObj.commisionRatioWl + '%)</span></span>\n' +
                '    </div>\n' +
                '</div>';
            $('.summary-price').after(wlPriceHtml);
        }
    }
})();