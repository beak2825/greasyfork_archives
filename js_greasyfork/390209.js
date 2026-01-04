// ==UserScript==
// @name         海涛音乐付费无损音乐免费下载
// @version      1.0
// @match        *://y.qq.com/*
// @match        *://music.163.com/*
// @match        http://www.baidu.com
// @description  提供音乐付费歌曲
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @license      MIT
// @namespace    http://www.baidu.com/
// @downloadURL https://update.greasyfork.org/scripts/390209/%E6%B5%B7%E6%B6%9B%E9%9F%B3%E4%B9%90%E4%BB%98%E8%B4%B9%E6%97%A0%E6%8D%9F%E9%9F%B3%E4%B9%90%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/390209/%E6%B5%B7%E6%B6%9B%E9%9F%B3%E4%B9%90%E4%BB%98%E8%B4%B9%E6%97%A0%E6%8D%9F%E9%9F%B3%E4%B9%90%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var SiteUrl = window.location.href;
    var ReQQ = /y\.qq\.com\/n\/yqq\/(song|playsquare|album|playlist|singer)/i;
    var ReQQplayer = /y\.qq\.com\/portal\/player.html/i;
    var Re163 = /music\.163\.com\/(#\/|)(song|playlist)(\?id=|\/)([0-9]+)/i;
    var ReApi = /lab\.liumingye\.cn\/api\/login\.php/i;
    var openUrl = function(a, b) {
        var url = "http://lab.liumingye.cn/api/?name=" + encodeURIComponent(a);
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
            openUrl(window.location.href);
        })
        BtnB.click(function() {
            openUrl($name.text().replace(/[\r\n]/g, "").replace(/for/i, "f o r"), "qq");
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
            openUrl(window.location.href);
        })
        BtnB.click(function() {
            openUrl($('.f-ff2').eq(0).text().replace(/[\r\n]/g, "").replace(/for/i, "f o r"), "netease");
        })
    } else if (ReApi.test(SiteUrl)) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "password=greasy" + ";path=/;expires=" + exp.toGMTString();
        location.href = "http://lab.liumingye.cn/api/";
    }
})();