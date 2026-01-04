// ==UserScript==
// @name         yinghub.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://yinghub.com/download/*/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/415566/yinghubcom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/415566/yinghubcom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：https://yinghub.com/download/4474/101.html
(function() {
    'use strict';


    $('.panel > .download-list > ul').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr1 = [];
        const link_arr2 = [];
        $container.find('li').each(function(i, el) {
            if (!$(el).find('.pull-right > .btn').length) {
                return;
            }
            let filename = $(el).find('.pull-left').text().trim();

            const $btn1 = $(el).find('.pull-right > .btn:contains(电驴)');
            if ($btn1.length) {
                let url1 = $btn1.prop('href');
                url1 = removeUnnessary(url1);
                if (url1.startsWith('thunder://')) {
                    url1 = parseThunderUrl(url1);
                }
                if (url1.startsWith('ed2k')) {
                    url1 = parseEd2k(url1);
                }
                // 如果是qvod开头的下载链接，替换成#
                // 如 https://yinghub.com/download/1338/101.html
                if (url1.startsWith('qvod')) {
                    url1 = '#';
                }
                const link1 = `<a href="${url1}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
                link_arr1.push(link1);
            }

            const $btn2 = $(el).find('.pull-right > .btn:contains(磁力)');
            if ($btn2.length) {
                let url2 = $btn2.prop('href');
                url2 = removeUnnessary(url2);
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

        if (link_arr1.length) {
            const $button_copy1 = $('<button class="imzhi_yinghub_copy_url">复制所有下载地址(电驴)</button>');
            $button_copy1.attr('data-clipboard-text', linkPrefix(link_arr1.join("\n")));
            $container.before($button_copy1);
        }
        if (link_arr2.length) {
            const $button_copy2 = $('<button class="imzhi_yinghub_copy_url">复制所有下载地址(磁力)</button>');
            $button_copy2.attr('data-clipboard-text', linkPrefix(link_arr2.join("\n")));
            $container.before($button_copy2);
        }
        new ClipboardJS('.imzhi_yinghub_copy_url');
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
    function removeUnnessary(url) {
        return url.replace(/(?:^.+\/\/yinghub\.com.+?)((?:ed2k|magnet).+)/, '$1');
    }

    function linkPrefix(str) {
        let pre = '';
        if (str.indexOf('ed2k:') > -1) {
            pre = '电驴下载';
        }
        if (str.indexOf('magnet:') > -1) {
            pre = '磁力下载';
        }
        let bracket = '';

        if (str.indexOf('人人影视') > -1) {
            bracket = '人人影视字幕';
        } else if (str.match(/BluRay/i) && str.match(/720p/i)) {
            bracket = '720P蓝光无中字';
        } else if (str.match(/BluRay/i) && str.match(/1080p/i)) {
            bracket = '1080P蓝光无中字';
        } else if (str.match(/YYeTs/i)) {
            bracket = '人人影视字幕';
        } else if (str.indexOf('深夜劇バ') > -1 || str.indexOf('深夜剧バ') > -1) {
            bracket = '深夜剧バー字幕';
        } else if (str.match(/zhuixinfan|追新番/i)) {
            bracket = '追新番字幕';
        }
        return pre ? `${pre}(${bracket})：\n${str}` : str;
    }
})();