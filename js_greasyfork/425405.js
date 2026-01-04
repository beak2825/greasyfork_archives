// ==UserScript==
// @name         dytt.com复制资源链接
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  电影淘淘网复制资源链接
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.dytt.com/xiazai/*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425405/dyttcom%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/425405/dyttcom%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var RIJUPAO = {
        IS_DEBUG: true,
        addStyle() {
            GM_addStyle('.imzhi_dytt_copy_url { background-color: aqua; font-size: 14px; border: 1px solid #000; }');
        },
        log(...arg) {
            if (!this.IS_DEBUG) {
                return;
            }
            console.log(...arg);
        },
        downListTableEl() {
            return $('.downList > .downListTable');
        },
        tableWrapEl() {
            return this.downListTableEl().closest('.layui-tab-myCard');
        },
        // 标题格式化，去掉最后括号之前的空格
        formatTitle(title) {
            return title.trim().replace(/\s+?(?<info>[\(（].+?[\)）])$/, '$<info>');
        },
        joinDown(text, href) {
            return `<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>`;
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
            const $btn = $('<button class="imzhi_dytt_copy_url" style=" ">复制资源链接</button>');
            $btn.attr('data-clipboard-text', this.joinArr(arr));
            this.tableWrapEl().before($btn);
            new ClipboardJS('.imzhi_dytt_copy_url');
        },
        init() {
            this.addStyle();

            const arr_thunder = ['迅雷下载：'];
            const arr_emule = ['电驴下载：'];
            const arr_magnet = ['磁力下载：'];
            this.downListTableEl().each((i, tableEl) => {
                $(tableEl).find('tbody > tr').each((i_tr, trEl) => {
                    const $trEl = $(trEl);
                    const $titleEl = $trEl.find('td').eq(1);
                    const $link = $trEl.find('.thunder-link');

                    const title = this.formatTitle($titleEl.text());
                    this.log('title', title);
                    const href = $link.prop('href');
                    const link_item = this.joinDown(title, href);
                    this.log('link_item', link_item);
                    if (href.startsWith('thunder://') && !arr_thunder.includes(link_item)) {
                         arr_thunder.push(link_item);
                    }
                    if (href.startsWith('ed2k://') && !arr_emule.includes(link_item)) {
                         arr_emule.push(link_item);
                    }
                    if (href.startsWith('magnet:') && !arr_magnet.includes(link_item)) {
                         arr_magnet.push(link_item);
                    }
                });
            });

            const combine_arr = this.combineArr(arr_magnet, arr_emule, arr_thunder);
            this.addBtn(combine_arr);
        },
    };
    RIJUPAO.init();
})();