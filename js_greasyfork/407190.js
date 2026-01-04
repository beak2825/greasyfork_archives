// ==UserScript==
// @name         idy667.com/qiongdy.com复制电驴链接
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.idy667.com/*/*.html
// @match        http://www.idy667.com/c-*.html
// @match        https://www.idy667.com/*/*.html
// @match        https://www.idy667.com/c-*.html
// @match        https://m.qiongdy.com/*ed2k.html
// @match        http://m.qiongdy.com/*ed2k.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/407190/idy667comqiongdycom%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/407190/idy667comqiongdycom%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://www.idy667.com/tiegu/f-ed2k.html
(function() {
    'use strict';

    const link_arr = [];
    const $container = $('#DonwloadLinksContainer');
    $container.find('.download > ul.body > li.row').each(function(i, el) {
        const filename = $(el).find('p.title').text();
        const url = $(el).find('p.hide:eq(0)').text().trim().replace(/\[.*?idy667.*?\]/, '').replace(/\[.*?qiongdy.*?\]/, '');
        const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
        link_arr.unshift(link);
    });

    const $button_copy = $('<button class="imzhi_idy667_copy_url">复制所有下载地址</button>');
    $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
    new ClipboardJS('.imzhi_idy667_copy_url');
    if (link_arr.length) {
        $container.before($button_copy);
    }
})();