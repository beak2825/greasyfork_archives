// ==UserScript==
// @name         inapian.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.inapian.com/*
// @match        http://www.inapian.com/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/415039/inapiancom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/415039/inapiancom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://www.inapian.com/v/32926.html
(function() {
    'use strict';


    $('.downbox > .downcon').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr = []; // 存储原迅雷地址
        const link_arr2 = []; // 存储迅雷解析后的地址
        $container.find('table.zytable tr > .td_thunder').each(function(i, el) {
            if (!$(el).find('a').length) {
                return;
            }
            let filename = $(el).find('a').text();
            let url = $(el).find('input[type=checkbox]').val();
            let url2 = url;
            let filename2 = filename;
            if (url.startsWith('thunder://')) {
                try {
                    url2 = Base64.decode(url.replace('thunder://', '')).replace(/^AA/, '').replace(/ZZ$/, '');
                    url2 = decodeURI(url2);
                    url2 = url2.replace(/\[INAPIAN\.COM\]/i, '[日剧跑rijupao.com]')
                } catch (e) {
                    console.error('inapian.com复制链接 error', e);
                }
                let parse_filename = parseFilename(url);
                if (parse_filename) {
                    filename2 = parse_filename;
                }
            }
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            link_arr.push(link);
            const link2 = `<a href="${url2}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename2}</a>`;
            link_arr2.push(link2);
        });

        if (link_arr.length) {
            const $button_copy = $('<button class="imzhi_tiantk_copy_url">复制原下载地址</button>');
            $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
            $container.before($button_copy);

        }
        if (link_arr2.length) {
            const $button_copy2 = $('<button class="imzhi_tiantk_copy_url">复制解析下载地址</button>');
            $button_copy2.attr('data-clipboard-text', link_arr2.join("\n"));
            $container.before($button_copy2);

        }
        new ClipboardJS('.imzhi_tiantk_copy_url');
    }

    function parseFilename(url) {
        if (url.startsWith('ed2k://')) {
            const match = url.match(/\|file\|(.+?)\|\d+/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return false;
    }
})();