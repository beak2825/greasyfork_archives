// ==UserScript==
// @name         yikedy.co复制下载链接
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.yikedy.co/tv/*.html
// @match        http://www.yikedy.co/movie/*.html
// @match        https://www.yikedy.co/tv/*.html
// @match        https://www.yikedy.co/movie/*.html
// @match        https://www.yikedy.top/tv/*.html
// @match        https://www.yikedy.top/movie/*.html
// @match        https://*.yikedy.cc/tv/*.html
// @match        https://*.yikedy.cc/movie/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_xmlhttpRequest
// @connect      www.yikedy.co
// @connect      subhd.tv
// @connect      zimuku.org
// @downloadURL https://update.greasyfork.org/scripts/419936/yikedyco%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/419936/yikedyco%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://www.yikedy.co/tv/5c82acfba3d60f10ac034154.html
(function() {
    'use strict';

    setTimeout(function() {
        $('#subtitle-list .download-ul').each(function(i, ul) {
            generateButtonZimu($(ul));
        });

        $('#download-list .download-ul').each(function(i, ul) {
            generateButton($(ul));
        });
    }, 2000);

    function generateButtonZimu($container) {
        console.log('generateButtonZimu', $container);
        const link_arr = ['<strong>字幕下载</strong>'];
        $container.find('li').each(async function(i, el) {
            const $link = $(el).find('a');
            const filename = $link.text().trim();

            const url = $link.prop('href').trim();
            const url_res = await zimuLink(url);

            const subtitle_des = $(el).find('.subtitle_des').text().trim();
            const desc = subtitle_des ? `[${subtitle_des}]` : '';
            const text_str = [desc, filename].filter(x => x).join(' ');

            const link = `<a href="${url_res}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text_str}</a>`;
            link_arr.push(link);
        });

        setTimeout(function() {
            if (link_arr.length < 2) {
                return;
            }
            const $button_copy = $('<button class="imzhi_yikedy_copy_url_zimu">复制字幕地址</button>');
            $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
            new ClipboardJS('.imzhi_yikedy_copy_url_zimu');
            $container.before($button_copy);
        }, 2e3);
    }

    // 获取字幕最终链接
    function zimuLink(url) {
        return new Promise((resolve) => {
            if (!url.includes('yikedy')) {
                resolve(url);
                return;
            }

            GM_xmlhttpRequest({
                url: url,
                onload: function(response) {
                    // console.log('zimuLink', response, response.finalUrl);
                    resolve(response.finalUrl);
                }
            });
        });
    }

    function generateButton($container) {
        const arr_baidu = ['百度网盘下载：'];
        const arr_xunlei_pan = ['迅雷网盘下载：'];
        const arr_aliyun_pan = ['阿里云网盘下载：'];
        const arr_quark = ['夸克网盘下载：'];
        const arr_ed2k = ['电驴下载：'];
        const arr_xunlei = ['迅雷下载：'];
        const arr_magnet = ['磁力下载：'];
        $container.find('li > ul.download-btn > li').each(async function(i, el) {
            const $link = $(el).find('a');
            const url = $link.prop('href').trim();
            if (url.includes('ed2k://')) {
                arr_ed2k.push(await joinLink($link));
            } else if (url.includes('pan.baidu.com')) {
                arr_baidu.push(await joinLink($link));
            } else if (url.includes('pan.xunlei.com')) {
                arr_xunlei_pan.push(await joinLink($link));
            } else if (url.includes('www.aliyundrive.com')) {
                arr_aliyun_pan.push(await joinLink($link));
            } else if (url.includes('pan.quark.cn')) {
                arr_quark.push(await joinLink($link));
            } else if (url.includes('magnet:')) {
                arr_magnet.push(await joinLink($link));
            } else if (url.includes('thunder:')) {
                arr_xunlei.push(await joinLink($link));
            }
        });

        setTimeout(function() {
            const all_link = combineArr([arr_baidu, arr_ed2k, arr_magnet, arr_xunlei_pan, arr_quark, arr_aliyun_pan, arr_xunlei]);
            if (!all_link.length) {
                return;
            }

            const $button_copy = $('<button class="imzhi_yikedy_copy_url">复制所有下载地址</button>');
            $button_copy.attr('data-clipboard-text', all_link.join("\n").trim());
            new ClipboardJS('.imzhi_yikedy_copy_url');
            $container.before($button_copy);
        }, 2e3);
    }

    function joinLink($link) {
        const filename = retText($link);
        const $size = $link.closest('li').find('span');
        const size_text = $size.text().trim();
        const size_str = size_text ? ` (${size_text})` : '';
        const url = parseEd2k($link.prop('href'));
        const $code = $link.closest('li').find('span.pan');
        const code = retCode($code.text().trim());
        const code_str = code ? `，提取码：${code}` : '';
        return new Promise((resolve) => {
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}${size_str}</a>${code_str}`;
            resolve(link);
        });
    }

    // 获取link的文字
    function retText($link) {
        const link_href = onlyUrl($link.prop('href'));
        const filename = $link.text().trim();

        const $li = $link.closest('.download-btn').closest('li');
        const $title = $li.find('.download-title').find('a');
        const title_href = onlyUrl($title.prop('href'));
        const title = $title.text().trim();

        return title_href == link_href ? title : filename;
    }

    // 截取url，省略后面的#或?部分
    function onlyUrl(href) {
        href = href.split('#')[0];
        href = href.split('?')[0];
        return href;
    }

    // 获取提取码
    function retCode(text) {
        const mat = text.match(/提取码：([\d\w]{4})/)
        return mat ? mat[1] : '';
    }

    function parseEd2k(url) {
        // if (url.indexOf('|') < 0) {
        //     url = decodeURI(url);
        // }
        url = decodeURI(url);
        return url;
    }

    // 将几个数组合并，并从第二个数组开始增加空行（来自 FIX字幕侠复制链接）
    function combineArr(list_arr) {
        let result = [];
        list_arr.forEach(function(list_item) {
            const the_item = $.extend([], list_item);
            if (the_item.length <= 1) {
                return;
            }
            if (result.length) {
                the_item.unshift('')
            }
            result = result.concat(the_item);
        });
        return result;
    }
})();