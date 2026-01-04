// ==UserScript==
// @name         xbsee.com复制下载链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.xbsee.com/down/*/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/408624/xbseecom%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/408624/xbseecom%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.xbsee.com/down/163950/ed2k.html
(function() {
    'use strict';

    const link_arr = [];
    const $container = $('#download-content');
    $container.find('.panel-body .download .divtable ul.body > li').each(function(i, el) {
        const filename = $(el).find('.input-group-addon.content').eq(2).text().trim();
        const url = $(el).find('input.thunder-showlink').val();
        const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
        link_arr.unshift(link);
    });

    const $button_copy = $('<button class="imzhi_xbsee_copy_url">复制所有下载地址</button>');
    $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
    new ClipboardJS('.imzhi_xbsee_copy_url');
    if (link_arr.length) {
        $container.before($button_copy);
    }
})();