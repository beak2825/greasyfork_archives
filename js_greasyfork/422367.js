// ==UserScript==
// @name         domp4.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.domp4.com/detail/*.html
// @match        https://www.domp4.cc/detail/*.html
// @match        https://www.domp4.cc/html/*.html
// @match        https://www.dbmp4.com/detail/*.html
// @match        https://www.dbmp4.com/html/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/422367/domp4com%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/422367/domp4com%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.domp4.com/detail/12589.html
(function() {
    'use strict';


    $('.panel.down-list').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr = [];
        $container.find('li > div.url-left > a').each(function(i, el) {
            const filename = $(el).text().replace(/(?:迅雷|电驴|磁力)下载/, '').replace('[www.domp4.com]', '[www.rijupao.com]');
            const url = decodeURI($(el).prop('href')).replace(/【.*?www.domp4.(?:com|cc)】/, '[日剧跑www.rijupao.com]').replace('[www.domp4.com]', '[www.rijupao.com]');
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            link_arr.unshift(link);
        });

        link_arr.reverse();
        const $button_copy = $('<button class="imzhi_domp4_copy_url">复制所有下载地址</button>');
        $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
        new ClipboardJS('.imzhi_domp4_copy_url');
        if (link_arr.length) {
            $container.before($button_copy);
        }
    }
})();