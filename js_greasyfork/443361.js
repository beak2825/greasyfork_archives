// ==UserScript==
// @name         屏蔽主流新闻资讯网站影响阅读体验的广告
// @namespace    http://pcx.cn/
// @version      1.0
// @description  屏蔽易有料、东方头条（东方资讯）、快科技（驱动之家）、MSN每日新闻、凤凰科技、TechWeb、QQ、edge浏览器自带的新闻资讯等广告，因为这些广告简直铺天盖地，非常影响体验，还你一个纯洁的新闻世界
// @author       islee
// @match        *://*.yiyouliao.com/*
// @match        *://*.eastday.com/*
// @match        *://news.mydrivers.com/*
// @match        *://*.msn.cn/*
// @match        *://tech.ifeng.com/*
// @match        *://*.techweb.com.cn/*
// @match        *://new.qq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443361/%E5%B1%8F%E8%94%BD%E4%B8%BB%E6%B5%81%E6%96%B0%E9%97%BB%E8%B5%84%E8%AE%AF%E7%BD%91%E7%AB%99%E5%BD%B1%E5%93%8D%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/443361/%E5%B1%8F%E8%94%BD%E4%B8%BB%E6%B5%81%E6%96%B0%E9%97%BB%E8%B5%84%E8%AE%AF%E7%BD%91%E7%AB%99%E5%BD%B1%E5%93%8D%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var host = window.location.host

    // 易有料
    if (host.indexOf('yiyouliao.com') > -1) {
        $('.yyl-ads-main, .yyl-news-footer').remove();
        $('.yyl-article-detail-main .yyl-article-detail-content img').css('max-width', '760px');
        var recommend = $('.yyl-article-detail-recommend');
        recommend.next().remove()
        recommend.remove()
        $('.yyl-news-main').css('width', '100%')
    }

    // 东方头条（东方资讯）
    if (host.indexOf('eastday.com') > -1) {
        $('head').append('.tips-dsp .tips-pop { display: none; top: -100%; filter: none; } .filterblur { -webkit-filter: none; -moz-filter: none; -ms-filter: none; -o-filter: none; filter: none }')
        $('.main_content > .aside').remove() // 删除左侧推荐
        $('.bottom_over_cnt').remove() // 删除底部推荐
        $('.J-bdsharebuttonbox-wrap, .bdshare-special').remove() // 删除浮动按钮
        $('.pagination a[pdata]').remove() // 删除最后一页是广告
        $('.article, .detail_left').css('width', '100%')
        // 处理闲置时间广告
        var timer = setInterval(function() {
            $('body > .tips-pop, body > .tips-dsp').remove()
        }, 3000)
    }

    // 快科技（驱动之家）
    if (host.indexOf('news.mydrivers.com') > -1) {
        $('body > .pathway').remove()
        $('body > .baidu').remove()
        $('iframe, .main_right, .page_article, .like_box, .xianguan').remove()
        $('.main_left').css('width', '100%')
    }

    // MSN每日新闻
    if (host.indexOf('msn.cn') > -1) {
        $('#filmstripouter, #aside, .postarticlecontent').remove()
        $('#maincontent').next().remove()
        $('#main').css('width', '100%')
    }

    // 凤凰科技
    if (host.indexOf('tech.ifeng.com') > -1) {
        function removeAd() {
            $('div[class|=rightContent]').remove()
            $('div[class|=leftContent]').css('width', '100%')
            $('div[class|=artical]').css('width', '100%').nextAll().each(function(i, o) {
                $(o).remove()
            })
        }
        setTimeout(removeAd, 100)
        setTimeout(removeAd, 1000)
    }

    // TechWeb
    if (host.indexOf('techweb.com.cn') > -1) {
        function removeTechWebAd() {
            $('.main_l, .main_r, .article_product, .weibo_weixin, .relative_news, .hotpot, .recommend').remove()
            $('.main_c').css('width', '100%').css('margin', 0)
        }
        setTimeout(removeTechWebAd, 10)
    }

    // QQ
    if (host.indexOf('new.qq.com') > -1) {
        function removeQqAd() {
            $('#RIGHT, #GoTop, #Recomend, #LeftTool, #bottomAd, #Comment, .qq_footer').remove()
            $('.LEFT, .content, .content-article').css('width', '100%')
        }
        setTimeout(removeQqAd, 10)
    }

})();