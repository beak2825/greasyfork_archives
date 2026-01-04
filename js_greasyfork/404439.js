// ==UserScript==
// @name       【618红包免费领3次】【天猫、淘宝】【京东】【拚多多】优惠券 一键免费领取 购物前领一下 省钱30~50%以上 2020.5.31更新
// @namespace    天猫、淘宝 京东 拚多多
// @version      1.0
// @description  一个按钮查找淘宝天猫和京东 拚多多 优惠券，一键免费领取。直接领取优惠券购买。优惠30%以上！优惠券页面京东 淘宝
// @author       javaduke
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @include      http*://item.jd.com/*
// @include      http*://youhui.pinduoduo.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/404439/%E3%80%90618%E7%BA%A2%E5%8C%85%E5%85%8D%E8%B4%B9%E9%A2%863%E6%AC%A1%E3%80%91%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%91%E3%80%90%E4%BA%AC%E4%B8%9C%E3%80%91%E3%80%90%E6%8B%9A%E5%A4%9A%E5%A4%9A%E3%80%91%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96%20%E8%B4%AD%E7%89%A9%E5%89%8D%E9%A2%86%E4%B8%80%E4%B8%8B%20%E7%9C%81%E9%92%B130~50%25%E4%BB%A5%E4%B8%8A%202020531%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/404439/%E3%80%90618%E7%BA%A2%E5%8C%85%E5%85%8D%E8%B4%B9%E9%A2%863%E6%AC%A1%E3%80%91%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%91%E3%80%90%E4%BA%AC%E4%B8%9C%E3%80%91%E3%80%90%E6%8B%9A%E5%A4%9A%E5%A4%9A%E3%80%91%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96%20%E8%B4%AD%E7%89%A9%E5%89%8D%E9%A2%86%E4%B8%80%E4%B8%8B%20%E7%9C%81%E9%92%B130~50%25%E4%BB%A5%E4%B8%8A%202020531%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {
        var host = window.location.host;
        var productNm = '';
        var url = "http://a-tb.tk/index.php?input=2&r=l&kw=";
         var urll = "https://s.click.taobao.com/t?e=m%3D2%26s%3DjMFRN9Q4zKkcQipKwQzePCperVdZeJviU%2F9%2F0taeK29yINtkUhsv0IgRYpQZi8ijzlhp9O5mEHNKBcRrCZgxGYWBT%2BzIaKSn5Oz54zpRcyO1PMTgmI8o%2FpAagSkR8Igzogfc9UhHI0lKaJluSZBCVo5N7u7NTPnpvgfyVVUAbkzCbAGjvJeFYkK%2BYOYvrkDC6Pi1GyWqgsCM%2BhtH71aX6gZRRx05M4zvy3ZD37iHCIPGq4iT%2BDv5wy6Rfdz4cB5cZ5v9KLBpgwp3XATEAAQjY3t41NEyiuTsPQUuEDH%2BG9R7wonVPKiwnfNPZ50JuHSizWrM9D%2FaZ%2FiV3BTvpfOIXBjoF1uP9hObiq5fCK0LpdJLwM43Z0kd3Zem3V3yPx%2F5Lb8Azwqy6ld%2FI3txFDaFjy94%2BmtSxYues37gUxUd%2BilARb8AaZ1M%2FVtrkGj9WrYNIYULNg46oBA%3D&union_lens=lensId%3AOPT%401590887369%400b1a25df_613d_1726846cc5f_67e2%4001&site=0&banner=1";
        var label = "获取优惠券";
        var labell = "618红包";
        var cssSelector = '';
        if (host.indexOf('taobao.com') > 0) {
            productNm = $.trim($('.tb-main-title').text());
            cssSelector = '.tb-action';
        } else if (host.indexOf('tmall.com') > 0) {
            productNm = $.trim($('.tb-detail-hd h1').text());
            cssSelector = '.tb-action';
        } else if (host.indexOf('jd.com') > 0) {
            productNm = $.trim($('.sku-name').text());
            cssSelector = '#choose-btns';
            url = "http://dukeshop.000webhostapp.com/?r=search?kw=";
        } else if (host.indexOf('pinduoduo.com') > 0) {
            window.location.href="https://youhui.pinduoduo.com/?pid=10588193_142393993&fromCustomerMall=1&cpsSign=CM_200529_10588193_142393993_0fab82b298ac8bdeede649381f10f94b&duoduo_type=2";
        }
        $(cssSelector).append(obtainAppendHtml(host, url, productNm, label, urll, labell));
    });

    function obtainAppendHtml(host, url, productNm, label, urll, labell) {
        if (host.indexOf('taobao.com') > 0) {
            return '<div class="div-inline"><div class="tb-btn-buy" style="padding-top:11px;"><a href="' + url + encodeURI(productNm) + '" target="_blank">' + label + '</a></div></div> <div class="div-inline"><div class="tb-btn-add" style="padding-top:11px;"><a href="' + urll + '" target="_blank">' + labell + '</a></div></div>';
        } else if (host.indexOf('tmall.com') > 0) {
            return '<div class="div-inline"><div class="tb-btn-buy tb-btn-sku"  style="padding-top:11px;"><a href="' + url + encodeURI(productNm) + '" target="_blank">' + label + '</a></div></div> <div class="div-inline"><div class="tb-btn-basket tb-btn-sku " style="padding-top:11px;"><a href="' + urll + '" target="_blank">' + labell + '</a></div></div>';
        } else if (host.indexOf('jd.com') > 0) {
            return '<a class="btn-special1 btn-lg" href="' + url + encodeURI(productNm) + '" target="_blank">' + label + '</a>';
        }

    }
})();