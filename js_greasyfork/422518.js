// ==UserScript==
// @name         hao6v.net复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.hao6v.net/*.html
// @match        http://www.hao6v.net/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/422518/hao6vnet%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/422518/hao6vnet%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.hao6v.net/gq/2016-09-17/BTJMBTWJ.html
(function() {
    'use strict';


    $('#endText > table').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr = [];
        $container.find('tbody > tr').each(function(i, el) {
            const $link = $(el).find('td > a');
            if (!$link.length) {
                return false;
            }
            let filename = $link.text();
            let url = $link.prop('href');
            if (url.startsWith('ed2k')) {
                url = decodeURI(url);
            }
            filename = replaceRijupao(filename);
            url = replaceRijupao(url);
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            link_arr.push(link);
        });

        const $button_copy = $('<button class="imzhi_hao6v_copy_url">复制所有下载地址</button>');
        $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
        new ClipboardJS('.imzhi_hao6v_copy_url');
        if (link_arr.length) {
            $container.after($button_copy);
        }
    }

    function replaceRijupao(text) {
        return text.replace(/\[www\..+?\]/i, '[日剧跑rijupao.com]')
            .replace(/\【www\.+?\】/i, '[日剧跑rijupao.com]');
    }
})();