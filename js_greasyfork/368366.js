// ==UserScript==
// @name       【稳定可用 常更新】【淘宝】【天猫】内部优惠券 一键免费领取 购物前点击领取领一下 直接省钱30%以上 2021.10.31更新
// @namespace    https://www.jbsou.cn/
// @version      8.55
// @description  一个按钮查找淘宝天猫内部优惠券，一键免费领取。直接领取优惠券购买。优惠30%以上！
// @author       Timi
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @run-at       document-end
// @antifeature  referral-link 【应GreasyFork代码规范要求：查询过程中 会含有推广者的pid代码 产生佣金。含有优惠券查询功能的脚本必须添加此提示！脚本使用过程中无任何强制跳转等行为，代码可查，请大家放心！在此感谢大家的理解...】

// @downloadURL https://update.greasyfork.org/scripts/368366/%E3%80%90%E7%A8%B3%E5%AE%9A%E5%8F%AF%E7%94%A8%20%E5%B8%B8%E6%9B%B4%E6%96%B0%E3%80%91%E3%80%90%E6%B7%98%E5%AE%9D%E3%80%91%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%91%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96%20%E8%B4%AD%E7%89%A9%E5%89%8D%E7%82%B9%E5%87%BB%E9%A2%86%E5%8F%96%E9%A2%86%E4%B8%80%E4%B8%8B%20%E7%9B%B4%E6%8E%A5%E7%9C%81%E9%92%B130%25%E4%BB%A5%E4%B8%8A%2020211031%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/368366/%E3%80%90%E7%A8%B3%E5%AE%9A%E5%8F%AF%E7%94%A8%20%E5%B8%B8%E6%9B%B4%E6%96%B0%E3%80%91%E3%80%90%E6%B7%98%E5%AE%9D%E3%80%91%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%91%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96%20%E8%B4%AD%E7%89%A9%E5%89%8D%E7%82%B9%E5%87%BB%E9%A2%86%E5%8F%96%E9%A2%86%E4%B8%80%E4%B8%8B%20%E7%9B%B4%E6%8E%A5%E7%9C%81%E9%92%B130%25%E4%BB%A5%E4%B8%8A%2020211031%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {
        var host = window.location.host;
        var productNm = '';
        var url = "http://quan.at38.cn/?cid=sINHpAY#/search?keyword=";
         var urll = "http://quan.at38.cn/?cid=sINHpAY#/index/home";
        var label = "获取优惠券";
        var labell = "双11现金红包";
        var cssSelector = '';
        if (host.indexOf('taobao.com') > 0) {
            productNm = $.trim($('.tb-main-title').text());
            cssSelector = '.tb-action';
        } else if (host.indexOf('tmall.com') > 0) {
            productNm = $.trim($('.tb-detail-hd h1').text());
            cssSelector = '.tb-action';
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