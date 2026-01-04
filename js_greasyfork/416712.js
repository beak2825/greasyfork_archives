// ==UserScript==
// @name         aibiet.top复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://aibiet.top/video/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/416712/aibiettop%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/416712/aibiettop%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://aibiet.top/video/452752944.html
(function() {
    'use strict';


    $('#link > table').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr = [];
        $container.find('tbody > tr').each(function(i, el) {
            if (!$(el).find('td:eq(1) > a').length) {
                return;
            }
            let size = $(el).find('td:eq(2)').text().trim();
            let filename = $(el).find('td:eq(1) > a').text().trim() + ` (${size})`;
            let url = $(el).find('td:eq(1) > a').prop('href');
            if (url.startsWith('thunder://')) {
                url = parseThunderUrl(url);
            }
            if (url.startsWith('ed2k')) {
                url = parseEd2k(url);
            }
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            link_arr.push(link);
        });

        if (link_arr.length) {
            const $button_copy = $('<button class="imzhi_aibiet_copy_url">复制所有下载地址</button>');
            $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
            $container.before($button_copy);
        }
        new ClipboardJS('.imzhi_aibiet_copy_url');
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

    function parseThunderUrl(url) {
        url = url.replace('thunder://', '');
        url = Base64.decode(url).replace(/^AA/, '').replace(/ZZ$/, '');
        return url;
    }

    function parseEd2k(url) {
        if (url.indexOf('|') < 0) {
            url = decodeURI(url);
        }
        return url;

    }
})();