// ==UserScript==
// @name         y80s.com/8080s.net复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.y80s.com/*
// @match        https://www.y80s.com/*
// @match        http://www.y80s.org/*
// @match        https://www.y80s.org/*
// @match        http://www.y80s.net/*
// @match        https://www.y80s.net/*
// @match        http://www.8080s.net/*
// @match        https://www.8080s.net/*
// @match        http://www.80s.cm/*
// @match        https://www.80s.cm/*
// @match        http://www.80s.tw/*
// @match        https://www.80s.tw/*
// @match        http://www.sj80s.com/*
// @match        https://www.sj80s.com/*
// @match        https://m.ghostsylvania.com/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/412678/y80scom8080snet%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/412678/y80scom8080snet%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://www.y80s.com/dm/22062 OR http://www.y80s.com/ju/22061 OR http://www.8080s.net/movie/19240
(function() {
    'use strict';

//     const $load_more = $('#myform').find('ul.dllist1 .dlb_link_link');
//     if ($load_more.length) {
//         $load_more.click();
//         setTimeout(function() {
//             join_link();
//         }, 2500);
//     } else {
//         join_link();
//     }
    const $add_copy_btn = $('<button id="imzhi_add_copy_btn">生成下载按钮</button>');
    $('#minfo').parent().after($add_copy_btn);
    $('#imzhi_add_copy_btn').click(() => {
        join_link();
    });

    function join_link() {
        // 注意：下面的$container必须重新定义，不能使用join_link外部的，否则会导致获取的还是$load_more按钮点击前的下载链接
        const $container = $('#myform');
        if ($('#cpdl2list').find('.imzhi_y80s_copy_url').length) {
            alert('已生成过');
            return;
        }
        let link_arr = [];
        let link_arr_raw = [];
        $container.find('ul.dllist1 > li.dlurlelement').each(function(i, el) {
            if (!$(el).find('.dlname > span > a').length) {
                return;
            }
            const filename = $(el).find('.dlname > span > a').text().trim();
            const size = getSize($(el).find('.dlname > span').text());
            const url = $(el).find('.xunlei.dlbutton3 > a').prop('href');
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename+size}</a>`;

            const url_raw = $(el).find('.xunlei.dlbutton1 > a').prop('href');
            const link_raw = `<a href="${url_raw}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename+size}</a>`;

            if (url) {
                link_arr.unshift(link);
            }
            if (url_raw) {
                link_arr_raw.unshift(link_raw);
            }
        });

        link_arr = [...new Set(link_arr)];
        link_arr_raw = [...new Set(link_arr_raw)];
        const $button_copy = $('<button class="imzhi_y80s_copy_url">复制本地下载地址</button>');
        const $button_copy_raw = $('<button class="imzhi_y80s_copy_url">复制原下载地址</button>');
        if (link_arr_raw.length) {
            $button_copy_raw.attr('data-clipboard-text', link_arr_raw.join("\n"));
            $container.before($button_copy_raw);
        }
        if (link_arr.length) {
            $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
            $container.before($button_copy);
        }
        new ClipboardJS('.imzhi_y80s_copy_url');
    }

    function getSize(text) {
        const mat = text.match(/\d+(?:\.\d{1,2})? (?:M|G)/i);
        return mat ? ` [${mat[0]}]` : '';
    }
})();