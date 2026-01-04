// ==UserScript==
// @name         m.jsr9.com/www.jsr9.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://m.jsr9.com/subject/*
// @match        http://m.jsr9.com/subject/*
// @match        https://www.jsr9.com/subject/*
// @match        http://www.jsr9.com/subject/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/414443/mjsr9comwwwjsr9com%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/414443/mjsr9comwwwjsr9com%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://m.jsr9.com/subject/21163.html
(function() {
    'use strict';

    if (location.href.indexOf('www.jsr9.com') > -1) {
        $('.sl.cl').each(function(i, ul) {
            generateButton($(ul));
        });
    } else {
        $('.aui-content > .col-main').each(function(i, ul) {
            generateButton($(ul));
        });
    }

    function generateButton($container) {
        const link_arr = [];
        $container.find('div > a[rel="nofollow"]').each(function(i, el) {
            if (!$(el).length) {
                return;
            }
            const filename = $(el).text().trim().replace('.torrent', '').replace('迅雷下载', '');
            const url = $(el).prop('href').replace(/^\[.+?\]/, '');
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            link_arr.unshift(link);
        });

        link_arr.reverse();
        const $button_copy = $('<button class="imzhi_jsr9_copy_url">复制所有下载地址</button>');
        $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
        new ClipboardJS('.imzhi_jsr9_copy_url');
        if (link_arr.length) {
            $container.before($button_copy);
        }
    }
})();