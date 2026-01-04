// ==UserScript==
// @name         修复A岛网页版GIF缩略图闪烁问题
// @namespace    adnmb
// @version      1.0
// @description  A岛网页版的GIF图在未放大时会出现图片损坏情况，无法正确显示，此脚本可修复此情况。
// @author       A岛肥仔
// @include      *://adnmb2.com/*
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/397367/%E4%BF%AE%E5%A4%8DA%E5%B2%9B%E7%BD%91%E9%A1%B5%E7%89%88GIF%E7%BC%A9%E7%95%A5%E5%9B%BE%E9%97%AA%E7%83%81%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/397367/%E4%BF%AE%E5%A4%8DA%E5%B2%9B%E7%BD%91%E9%A1%B5%E7%89%88GIF%E7%BC%A9%E7%95%A5%E5%9B%BE%E9%97%AA%E7%83%81%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if ($('.h-threads-img-box').length > 0) {
        $('.h-threads-img-box').filter(function () {
            return $(this).find('.h-threads-img-a').first().attr('href').endsWith('.gif');
        }).each(function () {
            let imgElement = $(this).find('.h-threads-img');
            let imgAElement = $(this).find('.h-threads-img-a');
            let imgBoxElement = $(this);

            imgElement.attr('data-src', imgAElement.attr('href'));
            imgElement.attr('src', imgAElement.attr('href'));

            imgElement.css({
                'max-width': '250px',
                'max-height': '250px'
            });

            imgAElement.on('click', function () {
                if (imgBoxElement.hasClass('h-active')) {
                    imgElement.css({
                        'max-width': '',
                        'max-height': ''
                    });
                } else {
                    imgElement.css({
                        'max-width': '250px',
                        'max-height': '250px'
                    });
                }
            });
        });
    }
})();