// ==UserScript==
// @name         漫画去广告&改下拉
// @namespace    http://86821241.qzone.qq.com/
// @description  包子漫画去广告，漫画看改下拉!
// @author       q86821241
// @version      2025-05-28
// @match        https://*.baozimh.com/*
// @match        https://*.twmanga.com/comic/chapter/*/*.html
// @match        https://*.kukuc.co/*
// @match        https://*.kukuc.co/comic/chapter/*/*.html
// @match        https://*.webmota.com/*
// @match        https://*.webmota.com/comic/chapter/*/*.html
// @match        https://*.hbmanga.com/comic/chapter/*/*.html
// @match        https://*.colamanga.com/*/
// @match        https://*.colamanga.com/*/*/*.html
// @match        https://*.xgcartoon.com/*
// @match        https://*.dailygh.com/*
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/470537/%E6%BC%AB%E7%94%BB%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%94%B9%E4%B8%8B%E6%8B%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470537/%E6%BC%AB%E7%94%BB%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%94%B9%E4%B8%8B%E6%8B%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var url = window.location.href;
    if(url.indexOf(".baozimh.com") !== -1 || url.indexOf(".kukuc.co") !== -1 || url.indexOf(".webmota.com") !== -1) {
        $('.desk-ad,.mob-ad,amp-analytics').remove();
        $('.addthis-box,.footer').hide();
        $('.recommend').parent().hide();
    }
    if(url.indexOf(".twmanga.com/comic") !== -1 || url.indexOf(".kukuc.co/comic") !== -1 || url.indexOf(".webmota.com/comic") !== -1) {
        $('head').append('<style>.header, .bottom-bar {transform: translateY(0px)!important;}</style>');
        $('.mobadsq').remove();
        $('#bottom').next().hide();
        $('#bottom,iframe').hide();
        $('.next_chapter').next().hide();
        $('#div_top_ads').remove();
        $('.comic-contain amp-img').each(function(index, element) {
            var src = $(element).attr('src');
            if (index < 4 && /\/(\d+)?(7|8|9|0)\.[a-z]{3,5}$/i.test(src)) {
                $(element).parent().remove();
            } else {
                //$(element).parent().html('<img src="' + $(element).attr('src') + '" style="vertical-align:bottom;width:100%">');
            }
        });
        $('.comic-contain').show();
        var baozimh = 0;
        var baozimhId = setInterval(function() {
            $('body').next().remove();
            $('#__nuxt').next().next().next().remove();
            baozimh++;
            if (baozimh > 20) {
                clearInterval(baozimhId);
            }
        }, 500);
    }
    if (url.indexOf("colamanga.com") !== -1) {
        $('head').append('<style>body{width:100%;overflow-x:hidden;}body > *{z-index:-1!important}.fed-head-info{z-index:1000!important}body > .tc{z-index:0!important;background-color:#f5f5f5;}#DhAMki, #HMcoupletDivright, #HMcoupletDivleft{display:none}</style>');
        $('.mh_wrap').css('min-width', 'initial');
        $('.mh_wrap').css('width', '100%');
        $('.mh_readend').css('padding', '10px');
        var colamanga = 0;
        var colamangaId = setInterval(function() {
            colamanga++;
            if (colamanga > 20) {
                clearInterval(colamangaId);
            }
            var iframes = document.querySelectorAll('iframe');
            for (var i = 0; i < iframes.length; i++) {
                iframes[i].style.display = 'none';
                iframes[i].remove();
            }
            $('[data-type="_mgwidget"], body script, #hidetArea, .PUBFUTURE').remove();
            $('[shape]').click();
        }, 500);
    }
    if(url.indexOf(".xgcartoon.com") !== -1 || url.indexOf(".dailygh.com") !== -1) {
        $('amp-ad,amp-analytics,.mobadsq').remove();
        $('.share,.addthis-box,.footer').hide();
        $('.share').next().hide();
        $('.share,#video-box').next().next().hide();
        var xgcartoon = 0;
        var xgcartoonId = setInterval(function() {
            $('body').next().remove();
            $('#__nuxt').next().next().next().remove();
            xgcartoon++;
            if (xgcartoon > 20) clearInterval(xgcartoonId);
        }, 500);
    }
})();