// ==UserScript==
// @name         meiju6.com一键复制电驴链接
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.meiju6.com/detail/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410147/meiju6com%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/410147/meiju6com%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.meiju6.com/detail/id9899.html
(function() {
    'use strict';


    $('.downlist').each(function(downlist_i, downlist_el) {
        const copy_arr = [];
        $(downlist_el).find('ul > li').each(function(li_i, li_el) {
            const $link = $(li_el).find('p > a.d2');
            const $direct_link = $(li_el).find('span > a.d4');
            const text = $link.text().trim().replace(/^\[meiju6\.com\](?:\d+?\|)?/, '');
            const href = $direct_link.prop('href');
            if (!$direct_link.length) {
                return;
            }
            copy_arr.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>`);
        });

        if (!copy_arr.length) {
            return;
        }

        const $copy_down = $('<button id="imzhi-copy-down-btn" style="font-size: 18px;"/>');
        $copy_down.text('一键复制');
        $copy_down.attr('data-clipboard-text', copy_arr.join("\n"));
        new ClipboardJS('#imzhi-copy-down-btn');
        $(downlist_el).before($copy_down);
    });
})();