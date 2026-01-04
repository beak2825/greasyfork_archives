// ==UserScript==
// @name         idybee.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.idybee.com/*.html
// @match        http://www.idybee.com/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/422515/idybeecom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/422515/idybeecom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.idybee.com/7217.html
(function() {
    'use strict';


    $('.tab-content > .tab-pane').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr = [];
        $container.find('.table > tbody > tr').each(function(i, el) {
            const $td_last = $(el).find('td').last();
            const filename = $td_last.find('a').text();
            let url = $td_last.find('a').prop('href');
            if (url.startsWith('ed2k')) {
                url = decodeURI(url);
            }
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            link_arr.push(link);
        });

        const $button_copy = $('<button class="imzhi_idybee_copy_url">复制所有下载地址</button>');
        $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
        new ClipboardJS('.imzhi_idybee_copy_url');
        if (link_arr.length) {
            $container.find('.panel.panel-default').before($button_copy);
        }
    }
})();