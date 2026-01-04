// ==UserScript==
// @name         过滤快科技网站“好物”广告
// @namespace    http://tampermonkey.net/
// @version      2024-12-02
// @description  过滤快科技、驱动之家、mydrivers网站“好物”广告，自用
// @author       Ray
// @match        https://www.mydrivers.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500199/%E8%BF%87%E6%BB%A4%E5%BF%AB%E7%A7%91%E6%8A%80%E7%BD%91%E7%AB%99%E2%80%9C%E5%A5%BD%E7%89%A9%E2%80%9D%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/500199/%E8%BF%87%E6%BB%A4%E5%BF%AB%E7%A7%91%E6%8A%80%E7%BD%91%E7%AB%99%E2%80%9C%E5%A5%BD%E7%89%A9%E2%80%9D%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery(function ($) {
        $('ul.newslist').each(function(i, obj) {
            $(obj).css("padding-top", "0");
        });
        $('ul.newslist li').each(function(i, obj) {
            var $li = $(obj);
            var $c = $li.find('.c');
            var txt = $c.text().replace(/[\s]+/g, '');
            if ($c.length > 0 && (txt == '好物')) {
                console.log(i + ": " + txt);
                $li.remove();
            }
        });
    });
})();