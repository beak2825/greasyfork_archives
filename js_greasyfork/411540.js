// ==UserScript==
// @name         treehousesub.com一键复制电驴链接
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.treehousesub.com/thread-*.html
// @match        http://treehousesub.com/thread-*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411540/treehousesubcom%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/411540/treehousesubcom%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：
// https://www.meiju6.com/detail/id9899.html
// http://treehousesub.com/thread-28841-1-1.html
(function() {
    'use strict';

    // 去掉隐藏的干扰字符
    $('font.jammer').remove();
    $('span:hidden').remove();

    const copy_arr = [];
    // $('.t_f ul li table.el-s').each(function(downlist_i, downlist_el) {
    $('table.el-s').each(function(downlist_i, downlist_el) {
        $(downlist_el).find('tbody > tr').each(function(li_i, li_el) {
            const $link = $(li_el).find('td > a');
            const $direct_link = $link;
            const text = $link.text().trim().replace(/^\[meiju6\.com\](?:\d+?\|)?/, '');
            const href = $direct_link.prop('href');
            if (!$direct_link.length) {
                return;
            }
            copy_arr.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>`);
        });
    });
    if (copy_arr.length) {
        appendBtn(copy_arr, $('table.el-s').eq(0));
    }

    if (!$('.imzhi-copy-down-btn').length) {
        let $main = $('.t_fsz .t_f').eq(0);
        let main_content = $main.text();
        let num = 1;
        const copy_arr = [];
        main_content.split("\n").forEach(function (el, i) {
            if (el.trim().startsWith('magnet') || el.trim().startsWith('ed2k')) {
                const ep = `EP${(num++).toString().padStart(2, 0)}`;
                copy_arr.push(`<a href="${el}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${ep}</a>`);
            }
        });
        appendBtn(copy_arr, $main);
    }


    // 根据内容获取首行文字（如：电驴下载(幻月字幕)）
    function firstLine(val) {
        const huanyue_zimu = /幻月字幕/i.test(val);
        const emule_link = /ed2k:\/\//i.test(val);
        const magnet_link = /magnet:/i.test(val);
        let line_prefix = '';
        if (emule_link && magnet_link) {
            line_prefix = '电驴&磁力下载';
        } else if (emule_link) {
            line_prefix = '电驴下载';
        } else if (magnet_link) {
            line_prefix = '磁力下载';
        }
        const line_suffix = huanyue_zimu ? '(幻月字幕)' : '';
        return line_prefix + line_suffix + '：';
    }

    // 增加一键复制按钮
    function appendBtn(copy_arr, $container) {
        if (!copy_arr.length) {
            return;
        }

        const $copy_down = $('<button class="imzhi-copy-down-btn" style="font-size: 18px;"/>');
        copy_arr.unshift(firstLine(copy_arr.join("\n")));
        $copy_down.text('一键复制');
        $copy_down.attr('data-clipboard-text', copy_arr.join("\n"));
        new ClipboardJS('.imzhi-copy-down-btn');
        $container.prepend($copy_down);
    }
})();