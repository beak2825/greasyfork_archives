// ==UserScript==
// @name         97riju.net/rijula.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.97riju.net/voddown/*
// @match        https://www.rijula.com/voddown/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/413139/97rijunetrijulacom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/413139/97rijunetrijulacom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.97riju.net/voddown/2541-1-140/
// 示例页面：https://www.rijula.com/voddown/7239-1-6/
(function() {
    'use strict';

    const link_arr = [];
    const $container = $('div.fed-down-item.fed-drop-item.fed-visible');
    $container.find('ul.fed-part-rows > li.fed-part-rows').each(function(i, el) {
        if (!$(el).find('input.fed-form-info').length) {
            return;
        }
        const filename = $(el).find('a.fed-form-info').text().replace('下载', '');
        const url = $(el).find('input.fed-form-info').val();
        const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
        link_arr.unshift(link);
    });

    link_arr.reverse();
    const $button_copy = $('<button class="imzhi_97riju_copy_url">复制所有下载地址</button>');
    $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
    new ClipboardJS('.imzhi_97riju_copy_url');
    if (link_arr.length) {
        $container.before($button_copy);
    }
})();