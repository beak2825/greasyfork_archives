// ==UserScript==
// @name       淘宝.天猫.京东.拼多多.大额优惠券/ 一键免费领取 
// @namespace    http://www.tzbridge.cn/
// @version      1.5.6
// @description 一键免费领取。直接领取优惠券购买。优惠30%以上！
// @author       淘宝优惠劵
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://detail.tmall.hk/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://item.jd.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397331/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E4%BA%AC%E4%B8%9C%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/397331/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E4%BA%AC%E4%B8%9C%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==
(function () {
  'use strict';
  $(document).ready(function () {
    var host = window.location.host;
    var productNm = '';
    var url = "http://www.r10263.cn/mall/topic?type=4&isc=0&goodSource=1&sign=KY58&title=9.9%E5%8C%85%E9%82%AE";
    var urll = "http://www.r10263.cn/mall/findResult?spm=a220o.1000855.0.0.315b4fa5NNOyl8&sign=KY58&goodSource=1&keyword=";
    var label = "精选9.9包邮";
    var labell = "一键领取优惠劵";
    var cssSelector = '';
    if (host.indexOf('taobao.com') > 0) {
      productNm = $.trim($('.tb-main-title').text());
      cssSelector = '.tb-action';
    }
    else if (host.indexOf('tmall.com') > 0) {
      productNm = $.trim($('.tb-detail-hd h1').text());
      cssSelector = '.tb-action';
    }
    else if (host.indexOf('jd.com') > 0) {
      productNm = $.trim($('.sku-name').text());
      cssSelector = '#choose-btns';
      url = "http://www.r10263.cn/mall/findResult?spm=a220o.1000855.0.0.315b4fa5NNOyl8&sign=KY58&goodSource=1&keyword=";
    }
    $(cssSelector).append(obtainAppendHtml(host, url, productNm, label, urll, labell));
  });

  function obtainAppendHtml(host, url, productNm, label, urll, labell) {
    if (host.indexOf('taobao.com') > 0) {
      return '<div class="div-inline"><div class="tb-btn-buy" style="padding-top:11px;"><a href="' + url + encodeURI(productNm) + '" target="_blank">' + label + '</a></div></div> <div class="div-inline"><div class="tb-btn-add" style="padding-top:11px;"><a href="' + urll + '" target="_blank">' + labell + '</a></div></div>';
    }
    else if (host.indexOf('tmall.com') > 0) {
      return '<div class="div-inline"><div class="tb-btn-buy tb-btn-sku"  style="padding-top:11px;"><a href="' + url + encodeURI(productNm) + '" target="_blank">' + label + '</a></div></div> <div class="div-inline"><div class="tb-btn-basket tb-btn-sku " style="padding-top:11px;"><a href="' + urll + '" target="_blank">' + labell + '</a></div></div>';
    }
    else if (host.indexOf('jd.com') > 0) {
      return '<a class="btn-special1 btn-lg" href="' + url + encodeURI(productNm) + '" target="_blank">' + label + '</a>';
    }
  }
})();
