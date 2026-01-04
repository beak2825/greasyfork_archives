// ==UserScript==
// @name         xl720.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  xl720.com复制链接-OH
// @author       imzhi <yxz_blue@126.com>
// @match        https://*.xl720.com/thunder/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xl720.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/474111/xl720com%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/474111/xl720com%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


// 示例页面：https://yinghub.com/download/4474/101.html
(function() {
    'use strict';

    const css = `
.imzhi_yinghub_copy_url {
    font-size: 22px;
    padding: 5px;
    background-color: forestgreen;
    color: white;
    margin-bottom: 10px;
    cursor: pointer;
}
`;
    GM_addStyle(css);

    $('.entry-content').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        const link_arr1 = [];
        $container.find('.download-link > a').each(function(i, el) {
            let filename = $(el).text().trim();
            filename = filename.replace('磁力下载', '').trim();
            const $btn1 = $(el);
            if ($btn1.length) {
                let url1 = $btn1.prop('href');
                url1 = removeUnnessary(url1);
                if (url1.startsWith('thunder://')) {
                    url1 = parseThunderUrl(url1);
                }
                if (url1.startsWith('ed2k')) {
                    url1 = parseEd2k(url1);
                }
                if (url1.startsWith('magnet')) {
                    url1 = parseMagnet(url1);
                }
                const link1 = `<a href="${url1}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
                link_arr1.push(link1);
            }
        });

        if (link_arr1.length) {
            const $button_copy1 = $('<button class="imzhi_yinghub_copy_url">复制地址</button>');
            $button_copy1.attr('data-clipboard-text', linkPrefix(link_arr1.join("\n")));
            $('#zdownload').before($button_copy1);
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

    function parseMagnet(url) {
        url = decodeURI(url);
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