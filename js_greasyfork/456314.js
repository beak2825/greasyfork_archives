// ==UserScript==
// @name         去除软件站无用元素
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  去除殁漂遥、果核剥壳、423down、mefcl等软件站的无用元素
// @author       You
// @match        *://*.mpyit.com/*
// @match        *://*.ghxi.com/*
// @match        *://*.423down.com/*
// @match        *://*.mefcl.com/*
// @match        *://*.fenxm.com/*
// @match        *://*.gndown.com/*
// @match        *://*.osssr.com/*
// @match        *://*.lsapk.com/*
// @match        *://*.lxapk.com/*
// @match        *://*.qiuquan.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456314/%E5%8E%BB%E9%99%A4%E8%BD%AF%E4%BB%B6%E7%AB%99%E6%97%A0%E7%94%A8%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/456314/%E5%8E%BB%E9%99%A4%E8%BD%AF%E4%BB%B6%E7%AB%99%E6%97%A0%E7%94%A8%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';
    if (window.location.hostname == "www.mpyit.com") {
        $(".sticky").remove();//正版推荐和广告
        $('body').css('background-image', 'none');//body的背景设置为none
        window.scrollTo(0, 60);
        window.scrollTo(0, 0);
    } else if (window.location.hostname == "www.ghxi.com") {
        window.addAdNote = function() {} //广告屏蔽提示条
        setInterval(function () {
            $('a:contains("关闭提示")').parent().parent().remove();
            $('.arco-spin .list > div').filter(function () {
                return $(this).text().includes('置顶');
            }).remove();
        }, 1500);
        $('.arco-spin .list > div').filter(function() {
            return $(this).text().includes('置顶');
        }).remove();
        $(".header-wrap").remove();
        $(".img-ad").remove();
        $(".card-list").remove();
        $(".thematic-list").remove();
        $(".scroll-list").remove();
        $(".text-list").remove();
        $(".footer-wrap").remove();
        $("#wpopt-ai-summary").remove();//广告
        $(".ad_single_2").remove();
        removeElementWithoutClass(".sidebar > div");//sidebar里的广告
        $('button.gh-dialog--btn').length && $('button.gh-dialog--btn').click();//关注公众号弹窗
    } else if (window.location.hostname == "www.423down.com") {
        let isPC = $('div.wrapper').length > 0;
        if (isPC) {
            $('.content-wrap:eq(0) .content ul.excerpt div.info span.cat:contains("423Down")').parent().parent().remove()//带推广和推荐的全删除
            $('.content-wrap:eq(0) .content ul.excerpt li:contains("！"),.content-wrap:eq(0) .content ul.excerpt li:contains("!")').remove();//推广一般都带感叹号
            $('ul.nav ul li').slice(-2).remove();//导航条后两个ai广告
        } else {
            $('.post-list li:contains("置顶")').remove();//手机端匹配"置顶"就行
            $('nav.navbar-nav ul li').slice(0,2).remove();//侧边栏前两个ai广告
        }
        $('.content > p').remove();
    } else if (window.location.hostname == "www.mefcl.com") {
        if (!window.location.href.includes('.html')) {
            removeElementsByText('.content', 'article', '合作推荐');
            removeElementsByText('.content', 'article', '正版特惠');
        }else{
            $(".orbui-post-content").remove();
            $(".item-01").empty();
        }
    }else if (window.location.hostname == "www.fenxm.com") {
        removeElementsByText('.content', 'article', '置顶');
        $(".swiper-container").remove();
        $(".full-pst").remove();
    }else if (window.location.hostname == "www.gndown.com") {
        removeElementsByText('.content', 'article', '置顶');
    }else if (window.location.hostname == "www.osssr.com") {
        removeElementsByText('.content', 'article', '置顶');
        $(".excerpt-minic-index").remove();
    }else if (window.location.hostname == "www.lsapk.com") {
        $(".swiper-container").remove();
        removeElementsByText('.post-list', 'li', '置顶');
        removeElementWithoutClass(".sidebar-box-list > div")
        $(".cp-pop-btn")[0]?.click()
    }else if (window.location.hostname == "www.lxapk.com") {
        $('.adsbygoogle').css('height', '0px');
        $('.swiper-bulletin ,.new-swiper').hide();
        $('.widget-tab-post ,.wp-image-2903').remove();
        $('.container.fluid-widget')[0].remove();
        removeElementsByText('.posts-row', 'posts', '置顶');
    }else if (window.location.hostname == "www.qiuquan.cc") {
        $('span.sticky-icon').parent().parent().remove();
        $('a.style02').parent().remove();
    }

    //删除包含指定字符串的元素
    function removeElementsByText(selector, childSelector, searchText) {
        $(selector).find(childSelector).each(function() {
            if ($(this).text().indexOf(searchText) !== -1) {
                $(this).remove();
            }
        });
    }

    //删除指定元素下没有类名的元素
    function removeElementWithoutClass(selector) {
        $(selector).each(function() {
            if (!$(this).attr('class')) {
                $(this).remove();
            }
        });
    }
})();