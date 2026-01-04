// ==UserScript==
// @name         沪江英语悬窗屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Malygose
// @description  屏蔽沪江英语悬窗
// @match        https://dict.hjenglish.com/jp/jc/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/38264/%E6%B2%AA%E6%B1%9F%E8%8B%B1%E8%AF%AD%E6%82%AC%E7%AA%97%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/38264/%E6%B2%AA%E6%B1%9F%E8%8B%B1%E8%AF%AD%E6%82%AC%E7%AA%97%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearModal() {
        // 样式调整
        $('aside').remove();

        // 移除广告
        $('.word-details-ads-placeholder').remove();
        $('#uzt-mask').remove();
        $('#crazy-pop').remove();
        if ($('.feedback-link').next().length) $('.feedback-link').next().remove();
        if ($('.feedback-link').prev().is('div') || $('.feedback-link').prev().is('script')) $('.feedback-link').prev().remove();
        if ($('#uzt-mask').length ||
            $('#crazy-pop').length ||
            $('.feedback-link').prev().is('div') ||
            $('.feedback-link').prev().is('script') ||
            $('.feedback-link').next().length) setTimeout(clearModal, 100);
    }

    $(clearModal);
})();