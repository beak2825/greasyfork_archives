// ==UserScript==
// @name         hiaxj.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.hiaxj.com/read-*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/419787/hiaxjcom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/419787/hiaxjcom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.hiaxj.com/read-4532
(function() {
    'use strict';

    const link_arr = [];
    const $container = $('.editor_content');
    $container.find('p > a').each(function(i, el) {
        const filename = $(el).text().trim();
        // 返回false是中止循环，这里只需要跳过
        if (!filename) {
            return;
        }
        const url = $(el).prop('href');
        const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
        link_arr.push(link);
    });

    const $button_copy = $('<button class="imzhi_hiaxj_copy_url" style="font-size: 16px;">复制所有下载地址</button>');
    $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
    new ClipboardJS('.imzhi_hiaxj_copy_url');
    if (link_arr.length) {
        $container.append($button_copy);
    }
})();