// ==UserScript==
// @name        7mav* 视频助手
// @version     2018-10-17
// @description 在 7mav* 的多个域名下进行广告屏蔽和下载链接提取；
// @author      none
// @match       *://www.7mav*.com/*
// @include     *://www.7mav*.com/* 
// @require     https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at      document-end
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @namespace   eValor
// @downloadURL https://update.greasyfork.org/scripts/373346/7mav%2A%20%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/373346/7mav%2A%20%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var $ = $ || window.$;

    function cleanAds (selector) {
        $(selector).remove();
    }

    cleanAds('.ads');
    cleanAds('.ads-footer');
    cleanAds('.ads-square');
    cleanAds('.ads-player');
    cleanAds('.right');
    $('.content-video').css('margin-right', 0);
    window.resizeBy(1, 1);

    // 播放器界面添加下载链接和按钮的逻辑
    var container = $('#player-container');
    if (container.length > 0) {
        var content_container = $('.content-container').get(0);
        $(content_container).append('<strong class="margin-left:10px;">下载地址: </strong>');
        $('#player_html5_api').find('source').each(function (index, element) {
            element  = $(element);
            var name = element.attr('label').toUpperCase();
            var link = element.attr('src');
            $(content_container).append('<a href="' + link + '" class="btn btn-default btn-xs btn-margin">' + name + '</a>');
        });


    }

})();