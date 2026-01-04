// ==UserScript==
// @name         哔哩哔哩(b站)显示UID和注册时间
// @namespace    http://tampermonkey.net/
// @version      2024-09-09
// @description  首页、直播、会员购、订单中心、漫画均可显示UID和注册时间。哔哩哔哩漫画增加切换夜间模式按钮。
// @author       AN drew
// @exclude      *://player.bilibili.com/*
// @exclude      *://member.bilibili.com/platform/*
// @exclude      https://www.bilibili.com/video/*
// @exclude      https://www.bilibili.com/bangumi/*
// @exclude      https://www.bilibili.com/cinema/*
// @exclude      https://www.bilibili.com/documentary/*
// @exclude      https://www.bilibili.com/tv/*
// @exclude      https://www.bilibili.com/variety/*
// @exclude      https://www.bilibili.com/judgement/*
// @match        *://member.bilibili.com/x2/creative/h5/calendar/*
// @match        *://*.bilibili.com/*
// @match        *://www.biligame.com/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @require      https://lib.baomitu.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404618/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28b%E7%AB%99%29%E6%98%BE%E7%A4%BAUID%E5%92%8C%E6%B3%A8%E5%86%8C%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/404618/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28b%E7%AB%99%29%E6%98%BE%E7%A4%BAUID%E5%92%8C%E6%B3%A8%E5%86%8C%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

var theme_dark = '<style>' +
    '.theme-dark body {' +
    '	background-color: #333' +
    '}' +
    '.theme-dark .manga-card-vertical .manga-cover {' +
    '	background-color: #222' +
    '}' +
    '.theme-dark .manga-card-vertical .text-info-section .manga-title {' +
    '	color: #999' +
    '}' +
    '.theme-dark .manga-card-vertical .text-info-section .supporting-text {' +
    '	color: #777' +
    '}' +
    '.theme-dark .manga-title {' +
    '	color: hsla(0,0%,100%,.8)' +
    '}' +
    '.theme-dark .manga-title:hover {' +
    '	color:#32AAFF !important' +
    '}' +
    '.theme-dark .manga-title:after {' +
    '	background-color: #303030' +
    '}' +
    '.theme-dark .dp-block.show-status-text.ts-dot-4 {' +
    '	color:#999' +
    '}' +
    '.theme-dark .dp-block.show-status-text.ts-dot-4:hover {' +
    '	color:#32AAFF !important' +
    '}' +
    '.theme-dark .multi-line-text.item-title.w-100.ts-dot-4.border-box:hover {' +
    '	color:#32AAFF !important' +
    '}' +
    '.theme-dark .author-text{' +
    '	color:#999' +
    '}' +
    '.theme-dark .style-text{' +
    '	color:#999' +
    '}' +
    '.theme-dark .rank-hint.dp-i-block{' +
    '	color:#999' +
    '}' +
    '.theme-dark .fans-author-text.t-over-hidden.t-no-wrap{' +
    '	color:#999' +
    '}' +
    '.theme-dark .fans-value{' +
    '	color:#999' +
    '}' +
    '.theme-dark .rank-title.dp-i-block{' +
    '	color:hsla(0,0%,100%,.8)' +
    '}' +
    '.theme-dark .dp-i-block.pointer.ts-dot-4{' +
    '	color:#999' +
    '}' +
    '.theme-dark .dp-i-block.pointer.ts-dot-4.activated{' +
    '	color:#32AAFF !important' +
    '}' +
    '.theme-dark .no-more-ctnr{' +
    '	color:#999 !important' +
    '}' +
    '.theme-dark .text {' +
    '	color: hsla(0,0%,100%,.5)!important' +
    '}' +
    '.theme-dark .manga-cover {' +
    '	background-color: rgba(0,0,0,.2)!important' +
    '}' +
    '.theme-dark .action-button {' +
    '	color: hsla(0,0%,100%,.8)' +
    '}' +
    '.theme-dark .drop-list {' +
    '	background-color: #303030' +
    '}' +
    '.theme-dark .more-btn-container {' +
    '	background-color: #2a2a2a!important' +
    '}' +
    '.theme-dark .more-btn-container .more-button {' +
    '	color: hsla(0,0%,100%,.5)!important' +
    '}' +
    '.theme-dark .login-panel .action-button {' +
    '	color: hsla(0,0%,100%,.8)' +
    '}' +
    '.theme-dark .manga-navbar-manga-logo {' +
    '	color: hsla(0,0%,100%,.8)' +
    '}' +
    '.theme-dark .nav-item {' +
    '	color: hsla(0,0%,100%,.8)' +
    '}' +
    '.theme-dark .v-middle.dp-i-block.ts-dot-4:not(.arrow){' +
    '	color: hsla(0,0%,100%,.8)' +
    '}' +
    '.theme-dark .search-bar-bg {' +
    '	background-color: #303030' +
    '}' +
    '.theme-dark .search-icon {' +
    '	background-image: url()!important' +
    '}' +
    '.theme-dark .search-input,.theme-dark .suggestion-item {' +
    '	color: #aaa' +
    '}' +
    '.theme-dark .user-name {' +
    '	color: #fff' +
    '}' +
    '.theme-dark .info-item {' +
    '	color: hsla(0,0%,100%,.5)' +
    '}' +
    '.theme-dark .logout-btn-container {' +
    '	background-color: #2a2a2a!important' +
    '}' +
    '.theme-dark .logout-btn-container .logout-button {' +
    '	color: hsla(0,0%,100%,.5)!important' +
    '}' +
    '.theme-dark .manga-navbar {' +
    '	box-shadow: none' +
    '}' +
    '.theme-dark .rank-item-wrapper{' +
    '   background:rgb(51,51,51) !important' +
    '}' +
    '.theme-dark .vertical-block-card {' +
    '	background-color: #252525' +
    '}' +
    '.theme-dark .vertical-block-card .item-title {' +
    '	color: #888' +
    '}' +
    '.theme-dark .vertical-block-card .meta-info {' +
    '	color: #666' +
    '}' +
    '.theme-dark .vertical-block-card .multi-line-text:after {' +
    '	background-color: #252525' +
    '}' +
    '.theme-dark .banner-manga-container .section-title,.theme-dark .banner-manga-container .tab-item {' +
    '	color: #888' +
    '}' +
    '.theme-dark .banner-manga-container .tab-item.activated {' +
    '	color: #32aaff' +
    '}' +
    '.theme-dark .new-manga-card {' +
    '	background-color: #333' +
    '}' +
    '.theme-dark .big-bg {' +
    '	background-color: #252525' +
    '}' +
    '.theme-dark .new-manga-name {' +
    '	color: #888' +
    '}' +
    '.theme-dark .new-manga-open-date {' +
    '	color: #777' +
    '}' +
    '.theme-dark .category-item {' +
    '	color: hsla(0,0%,100%,.8)' +
    '}' +
    '.theme-dark .preview-mode .index-indicator,.theme-dark .preview-mode .supporting-text,.theme-dark .preview-mode {' +
    '	color: #777' +
    '}' +
    '.theme-dark .item-title {' +
    '	color: #999!important' +
    '}' +
    '.theme-dark .item-title:after {' +
    '	background-color: #333' +
    '}' +
    '.theme-dark .footer-text {' +
    '	color: #777!important' +
    '}' +
    '.theme-dark .ranking-jump,.theme-dark .section-title {' +
    '	color: #888' +
    '}' +
    '.theme-dark .title-text {' +
    '	color: #999!important' +
    '}' +
    '.theme-dark .section-title {' +
    '	color: #888!important' +
    '}' +
    '.theme-dark .date-item {' +
    '	color: #666!important' +
    '}' +
    '.theme-dark .date-item.active {' +
    '	color: #32aaff!important' +
    '}' +
    '.theme-dark .empty-hinter {' +
    '	background-color: #333' +
    '}' +
    '.theme-dark .section-navigator {' +
    '	border-color: #272727' +
    '}' +
    '.theme-dark .section-navigator .section-item {' +
    '	background-color: #313131;' +
    '	color: #777' +
    '}' +
    '.sidebar-item.dp-block.w-100.activated > .v-middle.dp-i-block.ts-dot-4{' +
    '	color:#32AAFF !important' +
    '}' +
    '.theme-dark .section-navigator .section-item.current {' +
    '	background-color: #272727;' +
    '	color: #6fc3ff' +
    '}'+
    '.theme-dark .schedule-item .text-section .status-text[data-v-683c59ab] {' +
    '	color:#32AAFF !important' +
    '}' +
    '</style>';


(function () {
    'use strict';
    var uid = $.cookie('DedeUserID');
    if ($.cookie('registration_id') === undefined)
    {
        if(window.location.href.indexOf('www.biligame.com') > -1)
        {
            $.cookie('registration_id', uid, { expires: 365, path: '/', domain: 'biligame.com' });
        }
        else
        {
            $.cookie('registration_id', uid, { expires: 365, path: '/', domain: 'bilibili.com' });
        }
    }

    setInterval(function () {
        $('.nav-search-keyword').attr('placeholder', ' ');
    }, 1);


    if (window.location.href.indexOf('https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0') > -1) //注册信息
    {
        var timer = setInterval(function () {
            if ($('pre').length > 0) {
                var str = $('pre').html();
                var json = JSON.parse(str);
                var unix = json.data.pfs.profile.jointime;

                var theday = new Date(unix * 1000);
                var ly = parseInt(theday.getFullYear());
                var lm = parseInt(1 + theday.getMonth());
                var ld = parseInt(theday.getDate());
                clearInterval(timer);

                if ($.cookie('registration_days') === undefined || $.cookie('registration_id') != uid) {
                    $.cookie('registration_days', ly + '-' + lm + '-' + ld, { expires: 365, path: '/', domain: 'bilibili.com' });
                    $.cookie('registration_id', uid, { expires: 365, path: '/', domain: 'bilibili.com' });
                }
            }
        }, 100);
    }
    else if (window.location.href.indexOf('manga.bilibili.com') > -1 && window.location.href != 'https://manga.bilibili.com/eden/bilibili-nav-panel.html') //漫画
    {
        $('head').append($(theme_dark));

        if ($.cookie('nightmode') === undefined) { $.cookie('nightmode', 0, { expires: 365, path: '/', domain: 'bilibili.com' }); }

        var nightmode = $.cookie('nightmode');

        var night = '<button data-v-0c68b9aa=\'\' class=\'nav-item h-100 app-button first mode night\' style=\' vertical-align:middle\'>' +
            '<img data-v-0c68b9aa=\'\' src=\'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDI' +
            'CItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjAzODE3ODAwI' +
            'iBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExMDEiI' +
            'HhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvb' +
            'nQtZmFjZSB7IGZvbnQtZmFtaWx5OiBlbGVtZW50LWljb25zOyBzcmM6IHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL' +
            '2ZvbnRzL2VsZW1lbnQtaWNvbnMud29mZiIpIGZvcm1hdCgid29mZiIpLCB1cmwoImNocm9tZS1leHRlbnNpb246Ly9iYmFraG5tZmtqZW5mYmhqZGRkaXBjZWZuaHBpa2pia' +
            'i9mb250cy9lbGVtZW50LWljb25zLnR0ZiAiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUwMy40IDk1OS4yYy0xNTYuMSAwLTMwM' +
            'y4xLTgzLjItMzgzLjUtMjE3LjNsLTQ1LjgtNzYuMyA4Ny4yIDE3LjNjNDQgOC44IDg4LjkgOC42IDEzMy4yLTAuNkMzODIuNiA2NjQuNCA0NTguMyA2MTMgNTA3LjggNTM4Y' +
            'zQ5LjUtNzUuMSA2Ni44LTE2NC45IDQ4LjctMjUzLTExLjgtNTcuMy0zOC40LTExMC43LTc2LjktMTU0LjRsLTU4LjctNjYuNyA4OC44IDEuMmMyNDMuMSAzLjQgNDQwLjggM' +
            'jAzLjkgNDQwLjggNDQ3IDAgMjQ2LjUtMjAwLjYgNDQ3LjEtNDQ3LjEgNDQ3LjF6TTIzOC4zIDc2OC4xYzY4LjUgNzEuNCAxNjMgMTEyLjMgMjY1LjEgMTEyLjMgMjAzLjEgM' +
            'CAzNjguMy0xNjUuMiAzNjguMy0zNjguMyAwLTE3MS42LTExOS42LTMxNy40LTI3OS44LTM1Ny40IDE5LjQgMzUuNyAzMy41IDc0LjMgNDEuOCAxMTQuNCA0Ni4xIDIyNC40L' +
            'Tk4LjkgNDQ0LjQtMzIzLjMgNDkwLjUtMjQgNS00OCA3LjgtNzIuMSA4LjV6IiBmaWxsPSIjMDAwMDAwIiBwLWlkPSIxMTAyIj48L3BhdGg+PC9zdmc+\' class=\'item-icon v-middle\'>' +
            '<span data-v-0c68b9aa=\'\' class=\'item-label v-middle\' style=\'color:rgba(0,0,0,.8)\'>&nbsp;&nbsp;夜间模式</span></button>';

        var $night = $(night);
        var $topnav = $('.nav-list');
        $topnav.append($night);

        $('body > div.app-layout > nav > div > div.wrapper > div > div:nth-child(2) > div > a:nth-child(6)').attr('style', 'padding-right:0px');
        $('body > div.app-layout > nav > div > div.wrapper > div > div:nth-child(2) > div > a:nth-child(8)').attr('style', 'padding-right:0px');

        if (nightmode == '1') {
            $('html').addClass('theme-dark');

            $('.mode').find('img').attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDIC' +
                                        'ItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjA2NzI5MzM4IiB' +
                                        'jbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjkxNSIgd2lk' +
                                        'dGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mY' +
                                        'WNlIHsgZm9udC1mYW1pbHk6IGVsZW1lbnQtaWNvbnM7IHNyYzogdXJsKCJjaHJvbWUtZXh0ZW5zaW9uOi8vYmJha2hubWZramVuZmJoamRkZGlwY2VmbmhwaWtqYmovZm9udH' +
                                        'MvZWxlbWVudC1pY29ucy53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL2ZvbnR' +
                                        'zL2VsZW1lbnQtaWNvbnMudHRmICIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQo8L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyLjEgNzQzLjVjLTEyNy42IDAtMjMxLjQtMTAz' +
                                        'LjgtMjMxLjQtMjMxLjRzMTAzLjgtMjMxLjQgMjMxLjQtMjMxLjQgMjMxLjQgMTAzLjggMjMxLjQgMjMxLjQtMTAzLjggMjMxLjQtMjMxLjQgMjMxLjR6IG0wLTM5My40Yy04O' +
                                        'S4zIDAtMTYyIDcyLjctMTYyIDE2MnM3Mi43IDE2MiAxNjIgMTYyIDE2Mi03Mi43IDE2Mi0xNjItNzIuNy0xNjItMTYyLTE2MnpNNTEyLjEgMjI3LjFjLTE5LjIgMC0zNC43LT' +
                                        'E1LjUtMzQuNy0zNC43Vjk4LjdjMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjcgMTkuMiAwIDM0LjcgMTUuNSAzNC43IDM0Ljd2OTMuN2MwIDE5LjEtMTUuNSAzNC43LTM0Ljc' +
                                        'gMzQuN3pNMjg2IDMyMC43Yy04LjkgMC0xNy44LTMuNC0yNC41LTEwLjJsLTY2LjMtNjYuM2MtMTMuNi0xMy42LTEzLjYtMzUuNSAwLTQ5LjEgMTMuNS0xMy42IDM1LjUtMTMu' +
                                        'NiA0OS4xIDBsNjYuMyA2Ni4zYzEzLjYgMTMuNiAxMy42IDM1LjUgMCA0OS4xYTM0LjY4IDM0LjY4IDAgMCAxLTI0LjYgMTAuMnpNMTkyLjQgNTQ2LjhIOTguN2MtMTkuMiAwL' +
                                        'TM0LjctMTUuNS0zNC43LTM0LjcgMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjdoOTMuN2MxOS4yIDAgMzQuNyAxNS41IDM0LjcgMzQuNyAwIDE5LjEtMTUuNSAzNC43LTM0Lj' +
                                        'cgMzQuN3pNMjE5LjggODM5LjFjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMi0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMWw2Ni4zLTY2LjNjMTMuNS0xMy42IDM1LjUtMTM' +
                                        'uNiA0OS4xIDAgMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFsLTY2LjMgNjYuM2MtNi45IDYuOC0xNS43IDEwLjItMjQuNiAxMC4yek01MTIuMSA5NjAuMmMtMTkuMiAwLTM0' +
                                        'LjctMTUuNS0zNC43LTM0Ljd2LTkzLjdjMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjcgMTkuMiAwIDM0LjcgMTUuNSAzNC43IDM0Ljd2OTMuN2MwIDE5LjItMTUuNSAzNC43L' +
                                        'TM0LjcgMzQuN3pNODA0LjQgODM5LjFjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMmwtNjYuMy02Ni4zYy0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMSAxMy41LTEzLjYgMz' +
                                        'UuNS0xMy42IDQ5LjEgMGw2Ni4zIDY2LjNjMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFhMzQuNjggMzQuNjggMCAwIDEtMjQuNiAxMC4yek05MjUuNSA1NDYuOGgtOTMuN2M' +
                                        'tMTkuMiAwLTM0LjctMTUuNS0zNC43LTM0LjcgMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjdoOTMuN2MxOS4yIDAgMzQuNyAxNS41IDM0LjcgMzQuNyAwIDE5LjEtMTUuNSAz' +
                                        'NC43LTM0LjcgMzQuN3pNNzM4LjIgMzIwLjdjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMi0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMWw2Ni4zLTY2LjNjMTMuNS0xMy42I' +
                                        'DM1LjUtMTMuNiA0OS4xIDAgMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFsLTY2LjMgNjYuM2MtNi45IDYuOC0xNS44IDEwLjItMjQuNiAxMC4yeiIgZmlsbD0iI2Y0ZWEyYS' +
                                        'IgcC1pZD0iOTE2Ij48L3BhdGg+PC9zdmc+');

            $('.mode').find('img').attr('style', 'width:20px; height:20px');
            $('.mode').find('span').attr('style', 'color:hsla(0,0%,100%,.8)');
            $('.mode').find('span').text(' 日间模式');
            $('.mode').removeClass('night').addClass('day');
            $('.v-middle.dp-i-block.ts-dot-4').attr('style', 'color:hsla(0,0%,100%,.8)');
        }
        else {
            $('html').removeClass('theme-dark');
        }


        $('.mode').click(function () {
            if ($('.mode').hasClass('night')) {
                $.cookie('nightmode', 1, { expires: 365, path: '/', domain: 'bilibili.com' });

                $('html').addClass('theme-dark');

                $('.mode').find('img').attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDIC' +
                                            'ItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjA2NzI5MzM4IiB' +
                                            'jbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjkxNSIgd2lk' +
                                            'dGg9IjMyIiBoZWlnaHQ9IjMyIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mY' +
                                            'WNlIHsgZm9udC1mYW1pbHk6IGVsZW1lbnQtaWNvbnM7IHNyYzogdXJsKCJjaHJvbWUtZXh0ZW5zaW9uOi8vYmJha2hubWZramVuZmJoamRkZGlwY2VmbmhwaWtqYmovZm9udH' +
                                            'MvZWxlbWVudC1pY29ucy53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL2ZvbnR' +
                                            'zL2VsZW1lbnQtaWNvbnMudHRmICIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQo8L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyLjEgNzQzLjVjLTEyNy42IDAtMjMxLjQtMTAz' +
                                            'LjgtMjMxLjQtMjMxLjRzMTAzLjgtMjMxLjQgMjMxLjQtMjMxLjQgMjMxLjQgMTAzLjggMjMxLjQgMjMxLjQtMTAzLjggMjMxLjQtMjMxLjQgMjMxLjR6IG0wLTM5My40Yy04O' +
                                            'S4zIDAtMTYyIDcyLjctMTYyIDE2MnM3Mi43IDE2MiAxNjIgMTYyIDE2Mi03Mi43IDE2Mi0xNjItNzIuNy0xNjItMTYyLTE2MnpNNTEyLjEgMjI3LjFjLTE5LjIgMC0zNC43LT' +
                                            'E1LjUtMzQuNy0zNC43Vjk4LjdjMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjcgMTkuMiAwIDM0LjcgMTUuNSAzNC43IDM0Ljd2OTMuN2MwIDE5LjEtMTUuNSAzNC43LTM0Ljc' +
                                            'gMzQuN3pNMjg2IDMyMC43Yy04LjkgMC0xNy44LTMuNC0yNC41LTEwLjJsLTY2LjMtNjYuM2MtMTMuNi0xMy42LTEzLjYtMzUuNSAwLTQ5LjEgMTMuNS0xMy42IDM1LjUtMTMu' +
                                            'NiA0OS4xIDBsNjYuMyA2Ni4zYzEzLjYgMTMuNiAxMy42IDM1LjUgMCA0OS4xYTM0LjY4IDM0LjY4IDAgMCAxLTI0LjYgMTAuMnpNMTkyLjQgNTQ2LjhIOTguN2MtMTkuMiAwL' +
                                            'TM0LjctMTUuNS0zNC43LTM0LjcgMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjdoOTMuN2MxOS4yIDAgMzQuNyAxNS41IDM0LjcgMzQuNyAwIDE5LjEtMTUuNSAzNC43LTM0Lj' +
                                            'cgMzQuN3pNMjE5LjggODM5LjFjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMi0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMWw2Ni4zLTY2LjNjMTMuNS0xMy42IDM1LjUtMTM' +
                                            'uNiA0OS4xIDAgMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFsLTY2LjMgNjYuM2MtNi45IDYuOC0xNS43IDEwLjItMjQuNiAxMC4yek01MTIuMSA5NjAuMmMtMTkuMiAwLTM0' +
                                            'LjctMTUuNS0zNC43LTM0Ljd2LTkzLjdjMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjcgMTkuMiAwIDM0LjcgMTUuNSAzNC43IDM0Ljd2OTMuN2MwIDE5LjItMTUuNSAzNC43L' +
                                            'TM0LjcgMzQuN3pNODA0LjQgODM5LjFjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMmwtNjYuMy02Ni4zYy0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMSAxMy41LTEzLjYgMz' +
                                            'UuNS0xMy42IDQ5LjEgMGw2Ni4zIDY2LjNjMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFhMzQuNjggMzQuNjggMCAwIDEtMjQuNiAxMC4yek05MjUuNSA1NDYuOGgtOTMuN2M' +
                                            'tMTkuMiAwLTM0LjctMTUuNS0zNC43LTM0LjcgMC0xOS4yIDE1LjUtMzQuNyAzNC43LTM0LjdoOTMuN2MxOS4yIDAgMzQuNyAxNS41IDM0LjcgMzQuNyAwIDE5LjEtMTUuNSAz' +
                                            'NC43LTM0LjcgMzQuN3pNNzM4LjIgMzIwLjdjLTguOSAwLTE3LjgtMy40LTI0LjUtMTAuMi0xMy42LTEzLjYtMTMuNi0zNS41IDAtNDkuMWw2Ni4zLTY2LjNjMTMuNS0xMy42I' +
                                            'DM1LjUtMTMuNiA0OS4xIDAgMTMuNiAxMy42IDEzLjYgMzUuNSAwIDQ5LjFsLTY2LjMgNjYuM2MtNi45IDYuOC0xNS44IDEwLjItMjQuNiAxMC4yeiIgZmlsbD0iI2Y0ZWEyYS' +
                                            'IgcC1pZD0iOTE2Ij48L3BhdGg+PC9zdmc+');

                $('.mode').find('img').attr('style', 'width:20px; height:20px');
                $('.mode').find('span').attr('style', 'color:hsla(0,0%,100%,.8)');
                $('.mode').find('span').text(' 日间模式');
                $('.mode').removeClass('night').addClass('day');
                $('.v-middle.dp-i-block.ts-dot-4').attr('style', 'color:hsla(0,0%,100%,.8)');
            }
            else {
                $.cookie('nightmode', 0, { expires: 365, path: '/', domain: 'bilibili.com' });

                $('html').removeClass('theme-dark');

                $('.mode').find('img').attr('src', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDI' +
                                            'CItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTkxNjAzODE3ODAwI' +
                                            'iBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExMDEiI' +
                                            'HhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+QGZvb' +
                                            'nQtZmFjZSB7IGZvbnQtZmFtaWx5OiBlbGVtZW50LWljb25zOyBzcmM6IHVybCgiY2hyb21lLWV4dGVuc2lvbjovL2JiYWtobm1ma2plbmZiaGpkZGRpcGNlZm5ocGlramJqL' +
                                            '2ZvbnRzL2VsZW1lbnQtaWNvbnMud29mZiIpIGZvcm1hdCgid29mZiIpLCB1cmwoImNocm9tZS1leHRlbnNpb246Ly9iYmFraG5tZmtqZW5mYmhqZGRkaXBjZWZuaHBpa2pia' +
                                            'i9mb250cy9lbGVtZW50LWljb25zLnR0ZiAiKSBmb3JtYXQoInRydWV0eXBlIik7IH0KPC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTUwMy40IDk1OS4yYy0xNTYuMSAwLTMwM' +
                                            'y4xLTgzLjItMzgzLjUtMjE3LjNsLTQ1LjgtNzYuMyA4Ny4yIDE3LjNjNDQgOC44IDg4LjkgOC42IDEzMy4yLTAuNkMzODIuNiA2NjQuNCA0NTguMyA2MTMgNTA3LjggNTM4Y' +
                                            'zQ5LjUtNzUuMSA2Ni44LTE2NC45IDQ4LjctMjUzLTExLjgtNTcuMy0zOC40LTExMC43LTc2LjktMTU0LjRsLTU4LjctNjYuNyA4OC44IDEuMmMyNDMuMSAzLjQgNDQwLjggM' +
                                            'jAzLjkgNDQwLjggNDQ3IDAgMjQ2LjUtMjAwLjYgNDQ3LjEtNDQ3LjEgNDQ3LjF6TTIzOC4zIDc2OC4xYzY4LjUgNzEuNCAxNjMgMTEyLjMgMjY1LjEgMTEyLjMgMjAzLjEgM' +
                                            'CAzNjguMy0xNjUuMiAzNjguMy0zNjguMyAwLTE3MS42LTExOS42LTMxNy40LTI3OS44LTM1Ny40IDE5LjQgMzUuNyAzMy41IDc0LjMgNDEuOCAxMTQuNCA0Ni4xIDIyNC40L' +
                                            'Tk4LjkgNDQ0LjQtMzIzLjMgNDkwLjUtMjQgNS00OCA3LjgtNzIuMSA4LjV6IiBmaWxsPSIjMDAwMDAwIiBwLWlkPSIxMTAyIj48L3BhdGg+PC9zdmc+');

                $('.mode').find('img').attr('style', 'margin-right:4px');
                $('.mode').find('span').attr('style', 'color:rgba(0,0,0,.8)');
                $('.mode').find('span').text(' 夜间模式');
                $('.mode').removeClass('day').addClass('night');
                $('.v-middle.dp-i-block.ts-dot-4').removeAttr('style');
            }
        });

        $('.mode').hover(function () {
            $(this).find('span').attr('style', 'color:#32AAFF');
        }, function () {
            if ($(this).hasClass('night')) {
                $(this).find('span').attr('style', 'color:rgba(0,0,0,.8)');
            }
            else {
                $(this).find('span').attr('style', 'color:hsla(0,0%,100%,.8)');
            }

        });

        $('.v-middle.dp-i-block.ts-dot-4').hover(function () {
            $(this).attr('style', 'color:#32AAFF');
        }, function () {
            if ($('.mode').hasClass('night')) { $(this).attr('style', 'color:rgba(0,0,0,.8)'); }
            else { $(this).attr('style', 'color:hsla(0,0%,100%,.8)'); }
        });


        setInterval(function () {
            $('.tooltip').hide();
        }, 1);
    }





    var u = '<span><span id=\'uid\'>&nbsp;UID:&nbsp;</span><span id=\'id\'>xxx&nbsp;</span></span>';
    var $uid = $(u);
    $uid.css({
        'background': '#7CD4F2',
        'color': 'white',
        'font-size': '10px',
        'margin-right': '30px',
        'padding': '1px 1px 1px 1px',
        'width': '28px',
        'height': '14px'
    });
    var t = '<span><span id=\'registration-time\'><a href=\'https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0\' target=\'_blank\' style=\'color:#00A1D6;text-decoration: underline\'>查看注册天数</a></span><span id=\'time\'></span></span>';
    var $time = $(t);
    $time.css({
        'font-size': '10px',
        'margin-left': '20px',
        'padding': '1px 1px 1px 1px',
        'width': '56px',
        'height': '14px'
    });

    var t2 = '<span><span id=\'registration-time\'>&nbsp;注册时间:&nbsp;</span><span id=\'time\'>xxxx-xx-xx</span></span>';
    var $time2 = $(t2);
    $time2.css({
        'background': '#6DC781',
        'color': 'white',
        'font-size': '10px',
        'margin-left': '20px',
        'padding': '1px 1px 1px 1px',
        'width': '56px',
        'height': '14px'
    });

    setInterval(function () {

        if (window.location.href.indexOf('show.bilibili.com/orderlist') > -1) //订单中心
        {
            if ($('.avatar').length > 0) {
                $('.avatar').hover(function () {
                    if ($('.myinfo').length == 0) {
                        var $div = $('.level').clone(true);
                        $div.empty();
                        $div.attr('class', 'myinfo');
                        $div.css({ 'vertical-align': 'top' });
                        $uid.css({ 'margin-left': '15px' });
                        $uid.css({ 'margin-right': '0px' });
                        $div.append($uid);

                        if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {
                            $time2.css({ 'margin-left': '8px' });
                            $div.append($time2);
                            $('.level').before($div);
                            $('#time').text($.cookie('registration_days') + '\u00a0');
                        }
                        else {
                            $time.css({ 'margin-left': '8px' });
                            $div.append($time);
                            $('.level').before($div);
                        }
                        if (uid != undefined) { $('#id').text(uid + ' '); }
                    }
                    $('.detail').css({ 'padding-top': '20px', 'height': '180px' });
                    $('.title').css({ 'height': '52px' });
                });
            }
        }
        else if (window.location.href.indexOf('game.bilibili.com') > -1 || window.location.href.indexOf('www.biligame.com') > -1) //游戏中心
        {
            if ($('.bili-game-header-user-login').length > 0) {
                $('.bili-game-header-user-login').hover(function () {
                    if ($('.myinfo').length == 0) {
                        var $div = $('<div></div>');
                        $div.attr('class', 'myinfo');
                        $div.css({ 'vertical-align': 'top', 'margin-top': '5px', 'display': 'block', 'padding' : '0px 20px 0px 20px' });
                        $uid.css({ 'margin-right': '0px' });
                        $uid.attr('id', 'uuu');
                        $div.append($uid);
                        if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {
                            $time2.css({ 'margin-left': '0px' });
                            $time2.attr('id', 'ttt');
                            if (window.location.href.indexOf('game.bilibili.com') > -1)
                            {
                                $div.append($time2);
                            }
                            $('.bili-game-header-user-name').after($div);
                            $('#time').text($.cookie('registration_days') + '\u00a0');
                        }
                        else {
                            $time.css({ 'margin-left': '0px' });
                            $time.attr('id', 'ttt');
                            if (window.location.href.indexOf('game.bilibili.com') > -1)
                            {
                                $div.append($time);
                            }
                            $('.bili-game-header-user-name').after($div);
                        }
                        if (uid != undefined) { $('#id').text(uid + ' '); }

                        $('#uuu').wrap('<div></div>');
                        $('#ttt').wrap('<div></div>');
                        $('#ttt').parent().css({ 'margin-top': '5px' });
                    }
                });
            }
        }
        else if (window.location.href.indexOf('show.bilibili.com') > -1) //会员购
        {
            if ($('.myinfo').length == 0 && $('.user-panel').length > 0) {
                $('.user-uname').css({ 'padding-bottom': '5px' });
                $('.panel-list').css({ 'height': '55px' });
                var $div = $('<div></div>');
                $div.attr('class', 'myinfo');
                $div.css({ 'vertical-align': 'top', 'margin-top': '5px', 'display': 'block' });
                $uid.css({ 'margin-right': '0px' });
                $div.append($uid);
                if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {

                    $time2.css({ 'margin-left': '10px' });
                    $div.append($time2);
                    $('.user-uname').append($div);
                    $('#time').text($.cookie('registration_days') + '\u00a0');
                }
                else {
                    $time.css({ 'margin-left': '10px' });
                    $div.append($time);
                    $('.user-uname').append($div);
                }
                if (uid != undefined) { $('#id').text(uid + ' '); }
            }
        }
        else if (window.location.href.indexOf('live.bilibili.com') > -1) //直播
        {
            if ($('.user-panel.dp-table').length > 0) {
                $('.user-panel.dp-table').hover(function () {
                    if ($('.myinfo').length == 0) {
                        var $div = $('<div></div>');
                        $div.attr('class', 'myinfo');
                        $div.css({ 'vertical-align': 'top', 'margin-top': '5px', 'display': 'block' });
                        $uid.css({ 'margin-right': '0px' });
                        $div.append($uid);
                        if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {
                            $time2.css({ 'margin-left': '40px' });
                            $div.append($time2);
                            $('.content-ctnr.border-box.p-relative.over-hidden').prepend($div);
                            $('#time').text($.cookie('registration_days') + '\u00a0');
                        }
                        else {
                            $time.css({ 'margin-left': '40px' });
                            $div.append($time);
                            $('.content-ctnr.border-box.p-relative.over-hidden').prepend($div);
                        }
                        if (uid != undefined) { $('#id').text(uid + ' '); }
                    }
                });
            }
            else if($('.bili-header .header-avatar-wrap').length > 0)
            {
                $('.bili-avatar').hover(function () {
                    if ($('.myinfo').length == 0) {
                        var $div = $('.coins-item').clone(true);
                        $div.empty();
                        $div.attr('class', 'myinfo');
                        $div.css({ 'vertical-align': 'top', 'margin': '5px 0px 5px 0px' });
                        $div.append($uid);
                        let $time22=$time2.clone();
                        $time22.css('margin-left','5px');
                        if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {
                            $div.append($time22);
                            $('.coins-item').before($div);
                            $('#time').text($.cookie('registration_days') + '\u00a0');
                        }
                        else {
                            $div.append($time);
                            $('.coins-item').before($div);
                        }
                        if (uid != undefined) { $('#id').text(uid + ' '); }
                    }
                });
            }
        }
        else if (window.location.href.indexOf('manga.bilibili.com') > -1) //漫画
        {
            if ($('.user-panel.p-relative').length > 0) {
                $('.user-panel.p-relative').hover(function () {
                    if ($('.myinfo').length == 0) {
                        var $div = $('<div></div>');
                        $div.attr('class', 'myinfo');
                        $div.css({ 'vertical-align': 'top', 'margin-top': '5px', 'display': 'block' });
                        $uid.css({ 'margin-right': '0px' });
                        $uid.attr('id', 'uuu');
                        $div.append($uid);
                        if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {
                            $time2.css({ 'margin-left': '0px' });
                            $time2.attr('id', 'ttt');
                            $div.append($time2);
                            $('.user-name.t-center').after($div);
                            $('#time').text($.cookie('registration_days') + '\u00a0');
                        }
                        else {
                            $time.css({ 'margin-left': '0px' });
                            $time.attr('id', 'ttt');
                            $div.append($time);
                            $('.user-name.t-center').after($div);
                        }
                        if (uid != undefined) { $('#id').text(uid + ' '); }

                        $('#uuu').wrap('<div></div>');
                        $('#ttt').wrap('<div></div>');
                        $('#ttt').parent().css({ 'margin-top': '5px' });
                    }
                });
            }
        }
        else {
            if ($('.mini-avatar').length > 0) //旧版首页
            {
                $('.mini-avatar').hover(function () {
                    if ($('.myinfo').length == 0) {
                        var $div = $('.coins').clone(true);
                        $div.empty();
                        $div.attr('class', 'myinfo');
                        $div.css({ 'vertical-align': 'top', 'margin-top': '5px' });
                        $div.append($uid);
                        if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {
                            $div.append($time2);
                            $('.level-content').before($div);
                            $('#time').text($.cookie('registration_days') + '\u00a0');
                        }
                        else {
                            $div.append($time);
                            $('.level-content').before($div);
                        }
                        if (uid != undefined) { $('#id').text(uid + ' '); }
                    }
                });
            }
            else if($('.bili-header .header-avatar-wrap').length > 0) //新版首页
            {
                $('.bili-avatar').hover(function () {
                    if ($('.myinfo').length == 0) {
                        var $div = $('.coins-item').clone(true);
                        $div.empty();
                        $div.attr('class', 'myinfo');
                        $div.css({ 'vertical-align': 'top', 'margin': '5px 0px 5px 0px' });
                        $div.append($uid);
                        let $time22=$time2.clone();
                        $time22.css('margin-left','5px');
                        if ($.cookie('registration_days') != null && $.cookie('registration_id') == uid) {
                            $div.append($time22);
                            $('.coins-item').before($div);
                            $('#time').text($.cookie('registration_days') + '\u00a0');
                        }
                        else {
                            $div.append($time);
                            $('.coins-item').before($div);
                        }
                        if (uid != undefined) { $('#id').text(uid + ' '); }
                    }
                });
            }
            if (window.location.href.indexOf('space.bilibili.com') > -1) //个人空间
            {
                if($('.mystyle').length==0)
                {
                    $('head').append('<style class="mystyle">#id-card .idc-meta{margin-top:0px!important}</style>');
                }
                if ($('.uuid').length == 0) {
                    var $uuid = $('<span class=\'uuid\'></span>');
                    $uuid.attr('style', 'background: rgb(124, 212, 242); color: white; font-size: 10px; vertical-align:middle; margin-left:4px; padding-left:2px; padding-right:5px; border-radius:4px ');
                    if (window.location.pathname.lastIndexOf('/') > 0) { $uuid.text('  UID: ' + window.location.pathname.replace(/[^0-9]/ig,"")); }
                    else { $uuid.text('  UID: ' + window.location.pathname.substring(1) + '  '); }
                    $('.h-basic').children().eq(0).append($uuid);
                }
                $("[id*=id-card]").each(function(){
                    if($(this).find(".uuid").length==0)
                    {
                        var $uuid = $("<span class='uuid'></span>");
                        $uuid.attr("style","background: rgb(124, 212, 242); color: white; font-size: 12px; vertical-align:middle; margin-right:180px; padding-left:4px; padding-right:4px; border-radius:4px; font-weight:normal; width:100px; ")
                        var href=$(this).find(".idc-info>a").attr("href");
                        if (href.lastIndexOf('/') > 0) { $uuid.text('  UID:' + href.replace(/[^0-9]/ig,"")); }
                        //$uuid.text("  UID: "+href.substring(href.lastIndexOf('/', href.lastIndexOf('/') - 1) + 1, href.lastIndexOf('/'))+"  ")
                        $(this).find('.idc-meta').prepend($uuid)
                    }
                })
            }
        }


        $('.gg-icon').closest('.banner-card.b-wrap').hide();

    }, 10);

})();