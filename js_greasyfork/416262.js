// ==UserScript==
// @name         btbtdy2.com复制电驴磁力链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.btbtdy2.com/btdy/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/416262/btbtdy2com%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/416262/btbtdy2com%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://www.btbtdy2.com/btdy/dy11758.html
(function() {
    'use strict';

    setTimeout(function () {
        $('#nucms_downlist > .p_list').each(function(i, ul) {
            generateButton($(ul));
        });
    }, 1000);

    function generateButton($container) {
        const link_arr = [];
        $container.find('ul > li').each(function(i, el) {
            console.log('aaaa', $(el), $(el).html(), $(el).find('span > a.d1'), $(el).find('span > a.d1').length);
            if (!$(el).find('span > a.d1').length) {
                return;
            }
            const $btn1 = $(el).find('span > a.d1');
            const $name = $(el).children('a.ico_1');

            const filename = $name.prop('title');
            let url = $btn1.prop('href');
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
            const $button_copy = $('<button class="imzhi_btbtdy2_copy_url">复制所有下载地址</button>');
            $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
            $container.prepend($button_copy);
        }
        new ClipboardJS('.imzhi_btbtdy2_copy_url');
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