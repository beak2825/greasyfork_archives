// ==UserScript==
// @name         饭否过滤
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按关键字过滤TL消息
// @author       limuxy
// @match        https://fanfou.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34708/%E9%A5%AD%E5%90%A6%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/34708/%E9%A5%AD%E5%90%A6%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

/* jshint esnext: false */
/* jshint esversion: 6 */

(function ($) {
    "use strict";

    // keywords用来存放需要过滤的关键词
    let keywords = [];

    const doFilter = function () {
        $('#content').find('li').each(function () {
            const $li = $(this);
            const author = $li.find('.author').text();
            const status = $li.find('.content').text();

            keywords.forEach(function (keyword) {
                if (author.indexOf(keyword) > -1) {
                    console.log(`[过滤]${author}： ${status} // 原因： ${keyword}`);
                    $li.remove();
                }
                if (status.indexOf(keyword) > -1) {
                    console.log(`[过滤]${author}： ${status} // 原因： ${keyword}`);
                    $li.remove();
                }
            });
        });
    };

    $(function () {
        console.log('过滤插件已加载');
        doFilter();

        $('#content').on('DOMNodeInserted', 'ol', function (e) {
            if (e.target.tagName.toUpperCase() === 'LI') {
                doFilter();
            }
        });
    });

})(jQuery);