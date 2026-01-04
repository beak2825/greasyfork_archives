// ==UserScript==
// @name         MyFreeMP3跳转
// @version      1.0.0.0.0.0.1
// @match        *://y.qq.com/*
// @match        *://music.163.com/*
// @match        http://tool.liumingye.cn/music/
// @description  跳转到MyFreeMP3进行解析，（脚本改自https://greasyfork.org/zh-CN/scripts/400423）
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @license      MIT
// @namespace    http://tool.liumingye.cn/music/
// @downloadURL https://update.greasyfork.org/scripts/425853/MyFreeMP3%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/425853/MyFreeMP3%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var SiteUrl = window.location.href;
    var ReQQ = /y\.qq\.com\/n\/yqq\/(song|playsquare|album|playlist|singer)/i;
    var ReQQplayer = /y\.qq\.com\/portal\/player.html/i;
    var Re163 = /music\.163\.com\/(#\/|)(song|playlist)(\?id=|\/)([0-9]+)/i;
    var ReApi = /tool\.liumingye\.cn\/music\/login\.php/i;
    var openUrl = function(a, b) {
        var url = "http://tool.liumingye.cn/music/?page=audioPage&name=" + encodeURIComponent(a);
        b && (url += "&type=" + b);
        window.open(url);
    }
    if (ReQQ.test(SiteUrl)) {
        var BtnA = $('<a href="javascript:;" class="mod_btn_green"><i class="mod_btn_green__icon_play"></i>VIP解析</a>');
        var BtnB = $('<a href="javascript:;" class="mod_btn"></i>歌名搜索</a>');
        var $name = $('.data__name_txt');
        $name.parent('.data__name').after(BtnA, BtnB);
        $('.data__actions').css('bottom', '-10px');
        BtnA.click(function() {
            openUrl(window.location.href, "YQA");
        })
        BtnB.click(function() {
            openUrl($name.text().replace(/[\r\n]/g, "").replace(/for/i, "f o r"), "YQA");
        })
        // 判断是否下架
        var interval = setInterval(function() {
            if ($('.data__name_txt').length == 0) {
                clearInterval(interval);
                var BtnA = $('<a href="javascript:;" class="mod_btn_green"><i class="mod_btn_green__icon_play"></i>解析该下架歌曲</a>');
                $('.none_txt__symbol').after(BtnA);
                BtnA.click(function() {
                    openUrl(window.location.href);
                })
            }
        }, 1000);
    } else if (ReQQplayer.test(SiteUrl)) {
        var BtnA = $('<a style="margin-top:-10px;" href="javascript:;" class="mod_btn">VIP解析</a>');
        var BtnB = $('<a style="margin-top:-10px;" href="javascript:;" class="mod_btn">歌名搜索</a>');
        $('.mod_songlist_toolbar').after(BtnA, BtnB);
        BtnA.click(function() {
            openUrl($('.mod_btn_comment').attr('href').replace('#comment_box', ''));
        })
        BtnB.click(function() {
            openUrl($('.js_song').text().replace(/[\r\n]/g, "").replace(/for/i, "f o r"));
        })
    } else if (Re163.test(SiteUrl)) {
        var BtnA = $('<a href="javascript:;" class="u-btni u-btn2 u-btn2-2 u-btni-addply f-fl"><i>VIP解析</i></a>');
        var BtnB = $('<a href="javascript:;" class="u-btni u-btn2 u-btn2-2 u-btni-addply f-fl"><i>歌名搜索</i></a>');
        $('.m-info').find('#content-operation').find('.u-btni-addply').before(BtnA, BtnB);
        $('.u-btni').css('padding', '0 4px 0 0');
        $('.u-btni').css('margin-top', '5px');
        $('.u-btn2').css('margin-top', '5px');
        BtnA.click(function() {
            openUrl(window.location.href, "YQD");
        })
        BtnB.click(function() {
            openUrl($('.f-ff2').eq(0).text().replace(/[\r\n]/g, "").replace(/for/i, "f o r"), "YQD");
        })
    } else if (ReApi.test(SiteUrl)) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "password=greasy" + ";path=/;expires=" + exp.toGMTString();
        location.href = "http://tool.liumingye.cn/music/";
    }
})();