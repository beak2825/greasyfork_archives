// ==UserScript==
// @name         xyxz001.com复制电驴磁力链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.xyxz001.com/xz/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/416538/xyxz001com%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/416538/xyxz001com%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://www.xyxz001.com/xz/4383/
(function() {
    'use strict';

    setTimeout(function () {
        $('table.download_list').each(function(i, container) {
            generateButton($(container));
        });
    }, 500);

    function generateButton($container) {
        const link_arr = [];
//         const link_arr2 = [];
        $container.find('tbody > tr').each(function(i, el) {
            let url = $(el).find('.download_title > a').prop('href');
            let filename = $(el).find('.download_title > a').text().trim();
            let filesize = $(el).find('.download_size').text().trim();
            let link;
            if (url.startsWith('ed2k')) {
                url = parseEd2k(url);
                link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
                link_arr.push(link);
            }
//             if (url.startsWith('magnet')) {
//                 link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
//                 link_arr2.push(link);
//             }
        });

        if (link_arr.length) {
            const $button_copy = $('<button class="imzhi_xyxz001_copy_url" style="background-color: yellow;">复制电驴地址</button>');
            $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
            $container.before($button_copy);
        }
//         if (link_arr2.length) {
//             const $button_copy2 = $('<button class="imzhi_xyxz001_copy_url" style="background-color: blue;">复制磁力地址</button>');
//             $button_copy2.attr('data-clipboard-text', link_arr2.join("\n"));
//             $container.append($button_copy2);
//         }
        new ClipboardJS('.imzhi_xyxz001_copy_url');
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