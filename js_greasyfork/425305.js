// ==UserScript==
// @name         rrdyw.cc复制资源链接
// @namespace    http://tampermonkey.net/
// @version      0.1.12
// @description  人人电影网复制资源链接
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.rrdyw.cc/movie/*.html
// @match        https://www.rrdyw.cc/dongman/*.html
// @match        https://www.rrdyw.cc/dianshiju/*.html
// @match        https://www.rrdyw.cc/zongyi/*.html
// @match        https://www.rr2022.com/movie/*.html
// @match        https://www.rr2022.com/dongman/*.html
// @match        https://www.rr2022.com/dianshiju/*.html
// @match        https://www.rr2022.com/zongyi/*.html
// @match        https://www.rrdynb.com/movie/*.html
// @match        https://www.rrdynb.com/dongman/*.html
// @match        https://www.rrdynb.com/dianshiju/*.html
// @match        https://www.rrdynb.com/zongyi/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/425305/rrdywcc%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/425305/rrdywcc%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var RIJUPAO = {
        contentEl() {
            return $('.movie-txt');
        },
        content() {
            return this.contentEl().html();
        },
        // 匹配前两个 [xxx] 作为标题，并且去掉第二个 [xxx] 里的数字集数
        title() {
            const pat = /(?:\[.+?\]){2}/;
            const res_mat = $('.posttitle').text().match(pat);
            return res_mat
                ? res_mat[0].replace(/\s+\d{1,2}\]/, ']')
                : false;
        },
        joinDown(text, href, code) {
            const code_text = code ? `，提取码：${code}。` : '';
            return `<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>${code_text}`;
        },
        combineArr(...list) {
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
        },
        joinArr(arr) {
            return arr.join("\n");
        },
        addBtn(arr) {
            const $btn = $('<button class="imzhi_rrdyw_copy_url" style="background-color: aqua; font-size: 22px;">复制下载链接</button>');
            $btn.attr('data-clipboard-text', this.joinArr(arr));
            this.contentEl().append($btn);
            new ClipboardJS('.imzhi_rrdyw_copy_url');
        },
        findCode(el) {
            const loop_max = 4;
            let loop_i = 0;
            let next = el;
            let code = '';
            let mat;
            while (next.nextSibling && ++loop_i <= loop_max) {
                next = next.nextSibling;
                if (next.nodeName !== 'SPAN') {
                    continue;
                }
                if (!next.innerText.includes('提取码')) {
                    continue;
                }
                console.log('next.innerText', next, next.innerText);
                mat = next.innerText.match(/提取码(?:\:|：)\s*?(?<code>[a-zA-Z0-9]{4})/);
                if (mat) {
                    code = mat.groups.code;
                } else if (next.nextSibling) {
                    console.log('next.nextSibling.textContent', next.nextSibling.textContent);
                    code = next.nextSibling.textContent.trim();
                } else {
                    // 兼容 https://www.rrdyw.cc/movie/2021/1025/22106.html
                    console.log('next.parentNode.nextSibling.textContent', next.parentNode.nextSibling.textContent);
                    code = next.parentNode.nextSibling.textContent.trim();
                }
                break;
            }
            return code;
        },
        replaceUrl(url) {
            return decodeURI(url).replace(/\|file\|(?:\[.+?\]|【.+?】)/, '|file|[日剧跑rijupao.com]');
        },
        init() {
            const title = this.title();
            const content = this.content();

            const arr_emule = ['电驴下载：'];
            const arr_magnet = ['磁力下载：'];
            const arr_baidu = ['百度网盘下载：'];
            const arr_xunlei = ['迅雷网盘下载：'];
            const arr_uc = ['UC网盘下载：'];
            const arr_ali = ['阿里网盘下载：'];
            const arr_115 = ['115网盘下载：'];
            const arr_kuake = ['夸克网盘下载：'];
            this.contentEl().find('a').each((i, el) => {
                const $el = $(el);
                let href = $el.prop('href');
                const text = $el.text().trim();

                if (href.startsWith('ed2k://')) {
                    href = this.replaceUrl(href);
                    arr_emule.push(this.joinDown(text, href));
                }
                if (href.startsWith('magnet:')) {
                    href = this.replaceUrl(href);
                    arr_magnet.push(this.joinDown(text, href));
                }
                if (href.startsWith('https://pan.baidu.com')) {
                    const code = this.findCode(el);
                    arr_baidu.push(this.joinDown(text, href, code));
                }
                if (href.startsWith('https://pan.xunlei.com')) {
                    const code = this.findCode(el);
                    arr_xunlei.push(this.joinDown(text, href, code));
                }
                if (href.startsWith('https://www.yun.cn')) {
                    arr_uc.push(this.joinDown(text, href));
                }
                if (href.startsWith('https://www.aliyundrive.com')) {
                    const code = this.findCode(el);
                    arr_ali.push(this.joinDown(text, href, code));
                }
                if (href.startsWith('https://pan.quark.cn')) {
                    const code = this.findCode(el);
                    arr_kuake.push(this.joinDown(text, href, code));
                }
                if (href.startsWith('https://115.com')) {
                    const code = this.findCode(el);
                    arr_115.push(this.joinDown(text, href, code));
                }
            });

            const combine_arr = this.combineArr(arr_baidu, arr_xunlei, arr_emule, arr_magnet, arr_ali, arr_kuake, arr_uc, arr_115);
            this.addBtn(combine_arr);
        },
    };
    RIJUPAO.init();
})();