// ==UserScript==
// @name         btdy.tv复制下载链接
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.btdy.tv/video/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/408154/btdytv%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/408154/btdytv%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.downurl').each(function(i, el) {
        const all_down = [];

        const $down_url = $(el);
        $down_url.find('li').each(function(v_i, v_el) {
            const $li = $(v_el);
            const text = $li.find('span > a').text().trim();
            const href = $li.find('div > input[type=text]').val().trim();
            all_down.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>`);
        });

        if (!all_down.length) {
            return;
        }
        const $button_down = $('<button class="imzhi_bdtv_down_url">btdv.tv复制所有下载</button>');
        $button_down.attr('data-clipboard-text', all_down.join("\n"));
        new ClipboardJS('.imzhi_bdtv_down_url');
        $down_url.before($button_down);
    });
})();