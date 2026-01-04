// ==UserScript==
// @name         BiliPlus+
// @namespace    https://www.biliplus.com
// @version      1.13.73
// @description  哔哩哔哩失效视频自动跳转
// @author       蓝云
// @icon         https://www.biliplus.com/favicon.ico
// @license      MIT
// @include      http*://*.bilibili.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run_at       document_idle
// @downloadURL https://update.greasyfork.org/scripts/454457/BiliPlus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/454457/BiliPlus%2B.meta.js
// ==/UserScript==
//视频跳转
$(window).load(function () {
    let body = $('body');
    if ($('.error-container').length > 0)
        location.replace(location.href.replace(/\:\/\/www\.bilibili\.com\/video/, '://www.biliplus.com/video'));
    if ($('.video-list-status-text').length > 0)
        location.replace(location.href.replace(/\:\/\/bangumi\.bilibili\.com\/anime/, '://www.biliplus.com/bangumi/i'));
    if ($('.player-limit-wrap').length > 0)
        location.replace(location.href.replace(/\:\/\/www\.bilibili\.com/, '://www.biliplus.com'));

    //收藏夹跳转
    body.mouseover(function () {
        $('.small-item.disabled').each(function () {
            $(this).removeClass('disabled');
            $(this).find('a').attr('href', 'https://www.biliplus.com/video/' + $(this).attr('data-aid'));
        });
    });
    if (orginPopularize.length > 0) {
    }
});