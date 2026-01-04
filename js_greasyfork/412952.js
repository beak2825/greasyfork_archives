// ==UserScript==
// @name         loldytt.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.loldytt.com/*
// @match        http://www.loldytt.com/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/412952/loldyttcom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/412952/loldyttcom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.loldytt.com/Anime/STDXFSH/
(function() {
    'use strict';


    $('ul.downurl').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr = [];
        console.log($container);
        $container.closest('div.con4').find('ul.downurl > li').each(function(i, el) {
            if (!$(el).find('.loldytt > div > input[type=text]').length) {
                return;
            }
            const filename = $(el).find('.loldytt > div > span > a').text();
            const url = $(el).find('.loldytt > div > input[type=text]').val();
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            link_arr.unshift(link);
        });

        link_arr.reverse();
        const $button_copy = $('<button class="imzhi_loldytt_copy_url">复制所有下载地址</button>');
        $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
        new ClipboardJS('.imzhi_loldytt_copy_url');
        if (link_arr.length) {
            $container.before($button_copy);
        }
    }
})();