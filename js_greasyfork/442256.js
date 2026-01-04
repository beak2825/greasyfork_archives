// ==UserScript==
// @name         汽车之家净化
// @namespace    http://tampermonkey.net/
// @version      1.6.7
// @description  AllCleanAutoHome
// @author       androidcn
// @license      GPL-3.0 License
// @match        *://club.autohome.com.cn/bbs/*
// @match        *://club.m.autohome.com.cn/bbs/*
// @match        *://www.autohome.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autohome.com.cn
// @grant        none
// @namespace    https://greasyfork.org/scripts/442256

// @require     http://code.jquery.com/jquery-latest.js

// @downloadURL https://update.greasyfork.org/scripts/442256/%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/442256/%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    var $ = window.$;
    'use strict';
    var KEYWORDS = ['车衣',
                    'XPEL',
                    '膜',
                    '优惠',
                    '出一台',
                    '联系我',
                    '一手',
                    '求购',
                    '出手',
                    '实表',
                    '收',
                    '成新',
                    '自用',
                    '转让',
                    '租',
                    '转单',
                    '批发',
                    '自驾游',
                    '傻',
                    '卖',
                    '喜欢',
                    '相聚',
                    '乌克兰',
                    '精品',
                   '版主',
                    '留情',
                   '组团',
                   '车商',
                    '出',
                   '年卡',
                   '转',
                   '转让',];

//$(document).ready(function(){$.each(KEYWORDS,function(i,val){$('li:contains("'+val+'")').hide();});});
$(window).load(function(){
       $.each(KEYWORDS,function(i,val){
           $.each($('li>div>p.post-title>a:contains("'+val+'")'),function(index, value) {
                    $(this).parent().parent().parent().hide()
                    })
            $.each($('div.athm-card-album43__caption:contains("'+val+'")'),function(index, value) {
                    $(this).parent().parent().parent().hide()
                    })
           //$('li:contains("'+val+'")').hide();
       });
        $('#js-related-cars').hide()
        $('#js-related-topics').hide()
        $('section.fn-container.bbs-recommend').hide()
        $('#js-related-questions').hide()
        $('#js-float-video-container').hide()
        $('#js-sticky-aside').hide()
        $('#js-usedcar-container').hide()
        $('.bbs-guide-recomm').hide()
        $('.entry-pill').hide()

        //MobileAutohome
        //移动推荐阅读
        $(".recommend").hide()
        //移动相关车系
        $("section.generalize-series").hide()
        //隐藏移动版打开APP
        $("#skip-app").hide()
        //隐藏新VR广告
        $('#auto-brand-vr').hide()
        //论坛广告
        $('.union-ad-placeholder').hide()
        //主页APP下载
        $(".activity-app-layer").hide()
        //论坛APP广告推荐二维码
        $('.diversion-fixed-wrap').hide()
        //进一步精简
        $('.bbs-title-more').hide()
        $('.athm-footer').hide()
        $('.bbs-aside').hide()
        $('.athm-bbs-title-more').hide()

});
$(window).on('scroll',
                    function() {
                         $.each(KEYWORDS,function(i,val){
           $.each($('li>div>p.post-title>a:contains("'+val+'")'),function(index, value) {
                    $(this).parent().parent().parent().hide()
                    })
           //$('li:contains("'+val+'")').hide();
           $.each($('div.athm-card-album43__caption:contains("'+val+'")'),function(index, value) {
                    $(this).parent().parent().parent().hide()
                    })
       });
                            $('#js-sticky-aside').hide()
                });
})();
