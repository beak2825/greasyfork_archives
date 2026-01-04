// ==UserScript==
// @name         mag234.com复制电驴磁力链接
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://mag234.com/index/index*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/416017/mag234com%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/416017/mag234com%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://mag234.com/index/index?c=&k=%E7%BA%AA%E5%AE%9E72%E5%B0%8F%E6%97%B6
(function() {
    'use strict';


    $('.link-list-wrapper').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr1 = [];
        const link_arr2 = [];
        $container.find('ul.link-list > li').each(function(i, el) {
            const $li = $(el);
            const $name = $li.find('span.name');
            const $size = $li.find('span.size');
            const filename = `${$name.text()}[${$size.text()}]`
                .replace(/\[(?:CiLi001|auto).+?\]/i, '')
                .replace(/【(?:CiLi001|auto).+?】/i, '');

            if ($li.data('ed2k')) {
                let url1 = $li.data('ed2k');
                if (url1.startsWith('thunder://')) {
                    url1 = parseThunderUrl(url1);
                }
                if (url1.startsWith('ed2k')) {
                    url1 = parseEd2k(url1);
                }
                const link1 = `<a href="${url1}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
                link_arr1.push(link1);
            }

            if ($li.data('magnet')) {
                let url2 = $li.data('magnet');
                if (url2.startsWith('thunder://')) {
                    url2 = parseThunderUrl(url2);
                }
                if (url2.startsWith('ed2k')) {
                    url2 = parseEd2k(url2);
                }
                const link2 = `<a href="${url2}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
                link_arr2.push(link2);
            }
        });

        link_arr1.reverse();
        link_arr2.reverse();
        if (link_arr1.length) {
            const $button_copy1 = $('<button class="imzhi_mag234_copy_url">复制所有下载地址(电驴)</button>');
            $button_copy1.attr('data-clipboard-text', link_arr1.join("\n"));
            $container.before($button_copy1);
        }
        if (link_arr2.length) {
            const $button_copy2 = $('<button class="imzhi_mag234_copy_url">复制所有下载地址(磁力)</button>');
            $button_copy2.attr('data-clipboard-text', link_arr2.join("\n"));
            $container.before($button_copy2);
        }
        new ClipboardJS('.imzhi_mag234_copy_url');
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