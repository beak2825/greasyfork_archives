// ==UserScript==
// @name         BetterReading
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       greatcl
// @match        http://www.laruence.com/*
// @match        http://wiki.jikexueyuan.com/*
// @match        https://time.geekbang.org/*
// @match        http://*.blog.163.com/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41060/BetterReading.user.js
// @updateURL https://update.greasyfork.org/scripts/41060/BetterReading.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var commonStyle = '<style type="text/css">' +
        '#suIcon{background-color: rgba(174, 34, 199, 0.77);display: inline-block;color: white;border-radius: 2px;width: 20px;height: 20px;line-height: 20px;text-align: center;cursor: pointer;position: absolute;top: 120px;left: 20px;padding-top: 2px;}' +
        'body{font-family: Consolas, "Pingfang SC", "Microsoft Yahei";}' +
        '</style>';
    $('head').append(commonStyle);

    if (location.host === 'www.laruence.com') {
        laruence();
    }

    if (location.host === 'wiki.jikexueyuan.com') {
        $('body').css({
            'background-color': '#c8e3f7'
        });
        $('.detail-nav, .breadcrumb').css({
            'background-color': '#c8e3f7'
        });
    }

    if (location.host === 'time.geekbang.org') {
        geekTime();
    }

    if (location.host.match(/.*\.blog.163.com/)) {
        blog163();
    }

    function blog163() {
        $('#blog-163-com-topbar').hide();
    }

    function geekTime() {
        $('body').css({
            'background-color': 'rgb(235, 240, 243)',
            'font-family': 'Consolas, "Pingfang SC", "Microsoft Yahei"'
        });
        $('a').css({
            'text-decoration': 'none'
        });
        $('.mobile-tips').hide();

        var style = '<style type="text/css">' +
            '.article-item-cover{width: 150px; height: 100px;}' +
            'div.article-content > img:first-of-type{width: 50%;}' +
            '.common-content, .article-comments .comment-item, .comment-item .info .bd, .comment-item .info .reply .reply-content{font-size: 0.85rem; line-height: 1.25rem;}' +
            '.comment-item {margin-bottom: 0.4rem;}' +
            '.comment-item .time, .comment-item .reply-time{display: none;}' +
            '.mobile-tips {display: none !important;}' +
            '.typo-dl, .typo-form, .typo-hr, .typo-ol, .typo-p, .typo-pre, .typo-table, .typo-ul, .typo dl, .typo form, .typo hr, .typo ol, .typo p, .typo pre, .typo table, .typo ul, blockquote {margin-bottom: 0.7rem;}' +
            '</style>';
        $('head').append(style);

        var noDisplayImgList = [
            'https://static001.geekbang.org/resource/image/40/18/40341574317cc135385c6946a17d2818.jpg'
        ];


        if (location.pathname.match(/^\/column\/article\/\d+/)) {
            setTimeout(function(){
                $('title').html($('.article-title').html());

                $('img').each(function(){
                    var src = this.src;
                    for (var i = 0, len = noDisplayImgList.length; i < len; ++i) {
                        if (src === noDisplayImgList[i]) {
                            console.log(src);
                            $(this).hide();
                        }
                    }
                });

                $('p a').each(function(){
                    if (this.text == '戳此获取你的专属海报') {
                        $(this).hide();
                    }
                });
            }, 1000);
        }
    }

    function laruence(){
        var sidebar = $('.sidebar'),
            content = $('.content');
        content.css('width', content.width() + sidebar.width());
        sidebar.hide();
        var style = '<style type="text/css">' +
            'body{background-color: #e7f1f7;font-size: 13px; font-family: Consolas, "Pingfang SC", "Microsoft Yahei";}' +
            '.post{color: rgba(20, 4, 56, 0.91);}' +
            'p{font-size: 14px; line-height: 22px; font-family: Consolas, "Pingfang SC", "Microsoft Yahei"; margin: 0 0 8px; text-indent: 2em !important;}' +
            '.postmeta{padding-bottom: 10px !important;}' +
            '</style>';
        $('head').append(style);
        $('body').append('<div id="suIcon">原</div>');
        //$('p').each(function(){
        //    $(this).html($.trim($(this).html()));
        //});

        $('#suIcon').on('click', function(){
            var me = $(this);
            if (me.hasClass('origin')) {
                me.removeClass('origin');
                me.html('原');
                content.css('width', content.width() + sidebar.width());
                sidebar.hide();
            } else {
                me.addClass('origin');
                me.html('俗');
                sidebar.show();
                content.css('width', content.width() - sidebar.width());
            }
        });
    }
})();