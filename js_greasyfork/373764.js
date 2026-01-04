// ==UserScript==
// @name         直播吧去广告
// @namespace    https://www.zhibo8.cc/
// @icon         https://www.google.com/s2/favicons?domain=zhibo8.cc
// @version      1.0
// @description  直播吧PC版去首页，新闻详情页广告
// @author       老胡
// @match        https://www.zhibo8.cc
// @match        https://www.zhibo8.cc/*
// @match        https://news.zhibo8.cc/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373764/%E7%9B%B4%E6%92%AD%E5%90%A7%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/373764/%E7%9B%B4%E6%92%AD%E5%90%A7%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    clearHomePageAds();
    clearNewsPageAds();

    function clearHomePageAds() {
        clearHomeDaysBetweenAds();
        clearHomeAppDownloadAds();
        clearHomeSideAds();
        var t = setInterval(function () {
            clearHomeHeaderBannerAds();
        }, 50);
        clearNewsDetailAds();
    }

    function clearNewsPageAds() {
        clearNewsSideAds();
    }

    function clearHomeDaysBetweenAds() {
        $('.advert').remove();
    }

    function clearHomeHeaderBannerAds() {
        var headBannerAds = $('.adv_content');
        if(headBannerAds) {
            headBannerAds.remove();
        } else {
            clearInterval(t);
        }
    }

    function clearHomeAppDownloadAds() {
        $('.pop-autoapp').remove();
    }

    function clearHomeSideAds() {
        $('.ad_box_250').remove();
    }

    function clearNewsSideAds() {
        $('.xw_right').remove();
    }

    function clearNewsDetailAds() {
        $('#BAIDU_DUP_fp_wrapper').remove();
        $('.advertframe').remove();
        $('#iframe-ad').remove();
    }
})();