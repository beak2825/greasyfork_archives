// ==UserScript==
// @name         FIX字幕侠复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.16
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.zimuxia.cn/portfolio/*
// @match        http://www.zimuxia.cn/portfolio/*
// @match        https://web.archive.org/*/http://www.zimuxia.cn/portfolio/*
// @match        https://web.archive.org/*/https://www.zimuxia.cn/portfolio/*
// @match        http://web.archive.org/*/http://www.zimuxia.cn/portfolio/*
// @match        http://web.archive.org/*/https://www.zimuxia.cn/portfolio/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/407520/FIX%E5%AD%97%E5%B9%95%E4%BE%A0%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/407520/FIX%E5%AD%97%E5%B9%95%E4%BE%A0%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('@charset utf-8;button {background-color:#8e8559;}');

    const $content = $('.content-box');
    const all_ed2k = ['电驴下载(FIX字幕)：'];
    const all_magnet = ['磁力下载(FIX字幕)：'];
    const all_115 = ['115网盘下载(FIX字幕)：'];
    const all_uc = ['UC网盘下载(FIX字幕)：'];
    const all_baidu = ['百度网盘下载(FIX字幕)：'];
    const all_kuake = ['夸克网盘下载(FIX字幕)：'];

    let $div_a = $content.find('div a:not(".lightbox-image")');
    // http://www.zimuxia.cn/portfolio/%e6%ad%bb%e4%ba%a1%e7%ac%94%e8%ae%b0 对于这种内容作兼容处理
    // http://www.zimuxia.cn/portfolio/99-9%e5%88%91%e4%ba%8b%e5%be%8b%e5%b8%88 对于这种内容作兼容处理（2021/06/16）
    $div_a = $div_a.length && ($div_a.text().includes('百度网盘') || $div_a.text().includes('百度下载'))
        ? $div_a
        : $content.find('p a:not(".lightbox-image")');
    $div_a.each(function(i, el) {
        const $el = $(el);
        // http://www.zimuxia.cn/portfolio/%e8%af%b7%e8%ae%a9%e6%88%91%e5%8f%ab%e6%82%a8%e5%b2%b3%e7%88%b6%e5%a4%a7%e4%ba%ba
        // 以 <br> 分割来获取集数
        const $br = $el.prevAll('br');

        // http://www.zimuxia.cn/portfolio/%e7%a7%98%e5%af%86%e5%86%85%e5%b9%95%e6%88%98%e6%96%97%e5%90%a7%e5%a5%b3%e5%b7%a1%e8%ad%a6
        // 以父级 <span> 元素来获取集数
        let text = $el.closest('div,p,span').text().trim().split(/\s+/)[0].trim();
        if ($br.length) {
            text = $br.first()[0].nextSibling.nodeValue.trim().split(/\s+/)[0].trim();
        }

        // 获取提取码
        const loop_max = 12;
        let loop_i = 1;
        let code = '';
        let next_sibling = el;
        while (next_sibling.nextSibling && ++loop_i <= loop_max) {
            next_sibling = next_sibling.nextSibling;
            if (next_sibling.nodeType === 3) {
                let mat = next_sibling.textContent.match(/提取码[：:]\s*?(?<code>[\da-z]{4,6})/i);
                // console.log('next_sibling.textContent', next_sibling.textContent, mat);
                if (mat) {
                    code = mat.groups.code;
                    break;
                }
            }
        }
        let code_text = code ? `，提取码：${code}。` : '';
        // console.log('code_text', code_text, el);

        let href = $el.attr('href');
        // 缺失115网盘的地址，http://www.zimuxia.cn/portfolio/%e5%b0%8f%e5%a4%aa%e9%83%8e%e4%b8%80%e4%b8%aa%e4%ba%ba%e7%94%9f%e6%b4%bb
        if (!href) {
            return;
        }
        let raw_href = href;
        // http://www.zimuxia.cn/portfolio/%e6%b4%be%e9%81%a3%e5%91%98%e7%9a%84%e5%93%81%e6%a0%bc
        // S02E04 的电驴链接是以http://开头，需要做特殊处理
        // https://web.archive.org/web/20191216013209/http://www.zimuxia.cn/portfolio/%E8%A1%8C%E9%AA%97%E5%A4%A9%E4%B8%8Bjp
        // 调换 href.replace 的顺序兼容上面的地址
        // console.log('raw_href', raw_href);
        href = decodeURI(href.replace(/https?:\/\/(?:web\.archive\.org\/web\/)?.+?\//, '')
                         .replace('ed2k//', 'ed2k://')
                         .replace('magnet:/?', 'magnet://?')
                         .replace('http://', ''));
        // console.log('href', href);
        if (href.startsWith('ed2k://')) {
            all_ed2k.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>`);
        } else if (href.startsWith('magnet:')) {
            all_magnet.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>`);
        } else if (raw_href.includes('115.com')) {
            all_115.push(`<a href="${raw_href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>${code_text}`);
        } else if (raw_href.includes('www.yun.cn')) {
            all_uc.push(`<a href="${raw_href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>${code_text}`);
        } else if (raw_href.includes('pan.baidu.com')) {
            all_baidu.push(`<a href="${raw_href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>${code_text}`);
        } else if (raw_href.includes('pan.quark.cn')) {
            all_kuake.push(`<a href="${raw_href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>${code_text}`);
        }
    });

    const all_arr = combineArr([all_ed2k, all_magnet, all_baidu, all_uc, all_kuake, all_115]);
    const $button_ed2k = $('<button class="imzhi_zimuxia_copy_url">复制电驴</button>');
    const $button_magnet = $('<button class="imzhi_zimuxia_copy_url">复制磁力</button>');
    const $button_uc = $('<button class="imzhi_zimuxia_copy_url">复制UC</button>');
    const $button_115 = $('<button class="imzhi_zimuxia_copy_url">复制115</button>');
    const $button_baidu = $('<button class="imzhi_zimuxia_copy_url">复制百度</button>');
    const $button_kuake = $('<button class="imzhi_zimuxia_copy_url">复制夸克</button>');
    const $button_all = $('<button class="imzhi_zimuxia_copy_url">复制所有</button>');
    $button_ed2k.attr('data-clipboard-text', all_ed2k.join("\n"));
    $button_magnet.attr('data-clipboard-text', all_magnet.join("\n"));
    $button_uc.attr('data-clipboard-text', all_uc.join("\n"));
    $button_115.attr('data-clipboard-text', all_115.join("\n"));
    $button_baidu.attr('data-clipboard-text', all_baidu.join("\n"));
    $button_kuake.attr('data-clipboard-text', all_kuake.join("\n"));
    $button_all.attr('data-clipboard-text', all_arr.join("\n"));
    new ClipboardJS('.imzhi_zimuxia_copy_url');
    if (all_ed2k.length > 1) {
        $content.after($button_ed2k);
    }
    if (all_magnet.length > 1) {
        $content.after($button_magnet);
    }
    if (all_115.length > 1) {
        $content.after($button_115);
    }
    if (all_uc.length > 1) {
        $content.after($button_uc);
    }
    if (all_baidu.length > 1) {
        $content.after($button_baidu);
    }
    if (all_kuake.length > 1) {
        $content.after($button_kuake);
    }
    if (all_arr.length > 1) {
        $content.after($button_all);
    }

    // 将几个数组合并，并从第二个数组开始增加空行
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