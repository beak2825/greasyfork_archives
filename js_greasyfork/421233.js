// ==UserScript==
// @name         11quu.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.20
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.11quu.com/*html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/421233/11quucom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/421233/11quucom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：
// https://www.11quu.com/10790.html
// https://www.11quu.com/10919.html
// https://www.11quu.com/6855.html
// https://www.11quu.com/7711.html
(function() {
    'use strict';

    const type_1_regex = /(?:提取|访问|密)码[：:]\s*?(?<code>[\da-z]{4,6})/i;
    const type_2_regex = /解压缩?密码[：:]\s*?(?<code>[\da-z]{4,8})/i;

    const zimu = titleHasZhuzhu() || contentHasZhuzhu()
        ? '(SUBPIG猪猪字幕)'
        : (hasZhuixinfan()
           ? '(追新番字幕)'
           : titleHasTokyoNotHot()
               ? '(东京不够热字幕)'
               : '');
    const arr_baidu = [`百度网盘下载${zimu}：`];
    const arr_uc = [`UC网盘下载${zimu}：`];
    const arr_magnet = [`磁力下载${zimu}：`];
    const arr_ed2k = [`电驴下载${zimu}：`];
    const arr_wei = [`微云网盘下载${zimu}：`];
    let $container = $('.jinsom-hide-content');
//     if (!$container.length) {
        $container = $('.jinsom-bbs-single-content').eq(0);
//     }
    $container.find('a').each(function(i, el) {
        const filename = getFilename(el);
        const href = decodeURI($(el).prop('href'));
        let link = `<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
        let code;
        let code_text;
        let zip_code;
        let zip_code_text;

        if (href.includes('pan.baidu.com')) {
            code = getCodeFinal(el);
            code_text = getCodeText(code);
            link += code_text;

            zip_code = getCodeFinal(el, 2);
            zip_code_text = getZipCodeText(zip_code);
            link += zip_code_text;
            arr_baidu.push(stripMark(link));
        } else if (href.includes('www.yun.cn')) {
            code = getCodeFinal(el);
            code_text = getCodeText(code);
            link += code_text;

            zip_code = getCodeFinal(el, 2);
            zip_code_text = getZipCodeText(zip_code);
            link += zip_code_text;
            arr_uc.push(stripMark(link));
        } else if (href.includes('magnet')) {
            arr_magnet.push(link);
        } else if (href.includes('ed2k')) {
            arr_ed2k.push(link);
        } else if (href.includes('weiyun.com')) {
            code = getCodeFinal(el);
            code_text = getCodeText(code);
            link += code_text;

            zip_code = getCodeFinal(el, 2);
            zip_code_text = getZipCodeText(zip_code);
            link += zip_code_text;
            arr_wei.push(stripMark(link));
        }

        // 下载BT种子
        if (href.endsWith('.rar')) {
            if (confirm('是否下载bt种子?')) {
                GM_download(href, filename);
            }
        }
    });

    const link_arr = concatArr(arr_baidu, arr_uc, arr_wei, arr_magnet, arr_ed2k);
    appendBtn(arr_ed2k, '复制电驴', $container);
    appendBtn(arr_magnet, '复制磁力', $container);
    appendBtn(arr_wei, '复制微云', $container);
    appendBtn(arr_uc, '复制uc', $container);
    appendBtn(arr_baidu, '复制baidu', $container);
    appendBtn(link_arr, '复制所有', $container);

    function appendBtn(btn_arr, btn_text, container) {
        if (btn_arr.length > 1) {
            const $button_copy = $(`<button class="imzhi_11quu_copy_url">${btn_text}</button>`);
            $button_copy.attr('data-clipboard-text', btn_arr.join("\n"));
            $(container).after($button_copy);
            new ClipboardJS('.imzhi_11quu_copy_url');
        }
    }

    function concatArr(...list) {
        return list.reduce((accumulator, currentValue) => {
            // 复制数组
            const currentValueCopy = $.extend([], currentValue);
            if (accumulator.length) {
                currentValueCopy.unshift('');
            }
            // filter(a => a)过滤掉数组里的空值
            return currentValueCopy.filter(a => a).length > 1
                ? accumulator.concat(currentValueCopy)
                : accumulator;
        }, []);
    }

    // type 1-提取码，2-解压缩密码
    function getCodeFinal(el, type = 1) {
        let code = getCode(el, type);
        if (!code) {
            // console.log('el.parentNode', el.parentNode);
            let p_name = el.parentNode.nodeName;
            if (p_name === 'P' || p_name === 'DIV' || p_name === 'SPAN') {
                // 解决网址 https://www.11quu.com/6855.html 获取提取码
                // 解决网址 https://www.11quu.com/7711.html 获取提取码
                code = getCodeSimple(el.parentNode, type);
                if (!code) {
                    code = getCodeParagraph(el.parentNode, type);
                }
            }
        }
        return code;
    }

    function getCodeSimple(el, type) {
        let code = '';
        let mat = el.textContent.match(type === 1 ? type_1_regex : type_2_regex);
        if (mat) {
            code = mat.groups.code;
        }
        return code;
    }

    function getCode(el, type) {
        const loop_max = 4;
        let loop_i = 0;
        let code = '';
        let next_sibling = el;
        while (next_sibling.nextSibling && ++loop_i <= loop_max) {
            next_sibling = next_sibling.nextSibling;
            // console.log('next_sibling', next_sibling);
            if (next_sibling.nodeType === 3) {
                let mat = next_sibling.textContent.match(type === 1 ? type_1_regex : type_2_regex);
                // console.log('next_sibling.textContent', next_sibling.textContent, mat, type, type_1_regex);
                if (mat) {
                    code = mat.groups.code;
                    break;
                }
            }
        }
        return code;
    }

    function getCodeParagraph(el, type) {
        const loop_max = 4;
        let loop_i = 0;
        let code = '';
        let next_sibling = el;
        while (next_sibling.nextSibling && ++loop_i <= loop_max) {
            next_sibling = next_sibling.nextSibling;
            // console.log('next_sibling', next_sibling);
            if (next_sibling.nodeName === 'P') {
                let mat = next_sibling.textContent.match(type === 1 ? type_1_regex : type_2_regex);
                // console.log('next_sibling.textContent', next_sibling.textContent, mat);
                if (mat) {
                    code = mat.groups.code;
                    break;
                }
            }
        }
        return code;
    }

    function getCodeText(code) {
        const code_text = code ? `，提取码：${code}。` : '';
        return code_text;
    }

    function getZipCodeText(code) {
        const code_text = code ? `，解压缩密码：${code}。` : '';
        return code_text;
    }

    function titleHasZhuzhu() {
        return $('.jinsom-bbs-single-title > h1').text().includes('SUBPIG');
    }

    function titleHasTokyoNotHot() {
        return $('.jinsom-bbs-single-title > h1').text().includes('东京不够热');
    }

    function contentHasZhuzhu() {
        return $('.jinsom-bbs-single-content:contains("后缀名改为mp4")').length
            || $('.jinsom-bbs-single-content:contains("后缀名改为MP4")').length
            || $('.jinsom-bbs-single-content:contains("后缀改为mp4")').length
            || $('.jinsom-bbs-single-content:contains("后缀改为MP4")').length
            || $('.jinsom-bbs-single-content:contains("subpig")').length
            || $('.jinsom-bbs-single-content:contains("SUBPIG")').length;
    }

    function hasZhuixinfan() {
        return $('.jinsom-bbs-single-title > h1').text().includes('追新番')
            || $('.jinsom-bbs-single-content:contains("追新番")').length;
    }

    // 将连续的标点符号减少
    function stripMark(str) {
        return str.replace('。，', '，').replace('。，', '，');
    }

    function getFilename(el) {
        const p_text = $(el).closest('p').text();
        console.log('p_text', p_text, p_text.split(' '));
        if (p_text.includes('电驴下载') && p_text.includes('磁力下载')) {
            return p_text.split(/\s+/)[0].trim();
        }
        return $(el).text().trim();

    }
})();