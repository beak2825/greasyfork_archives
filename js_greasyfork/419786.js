// ==UserScript==
// @name         dy1234.net复制下载链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.dy1234.net/sub/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/419786/dy1234net%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/419786/dy1234net%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://www.dy1234.net/sub/25900.html
(function() {
    'use strict';

    const link_arr = [];
    const $container = $('.down_list');
    $container.find('ul > li').each(function(i, el) {
        const filesize = $(el).find('.file-size').text();
        const filename = $(el).find('.down_part_name').text().trim() + (filesize ? `[${filesize}]` : '');
        const url = $(el).find('.thunder_url').val().trim().replace(/【.*?idyjy.*?】/, '');
        const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
        link_arr.unshift(link);
    });

    const $button_copy = $('<button class="imzhi_dy1234_copy_url">复制所有下载地址</button>');
    $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
    new ClipboardJS('.imzhi_dy1234_copy_url');
    if (link_arr.length) {
        $container.before($button_copy);
    }
})();