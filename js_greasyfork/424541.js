// ==UserScript==
// @name         追新番复制下载链接(新版)
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  追新番新站一键复制下载链接
// @author       imzhi <yxz_blue@126.com>
// @match        http*://fanxinzhui.com/rr/*
// @match        http*://www.fanxinzhui.com/rr/*
// @grant        none
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/424541/%E8%BF%BD%E6%96%B0%E7%95%AA%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%28%E6%96%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424541/%E8%BF%BD%E6%96%B0%E7%95%AA%E5%A4%8D%E5%88%B6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%28%E6%96%B0%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const arr_baidu = [];
    const arr_weiyun = [];
    const arr_xunlei = [];
    const arr_mega = [];
    const arr_magnet = [];
    const arr_ed2k = [];

    $('.item_list > li').each((i, el) => {
        const season = $(el).find('span.season').text().trim();
        const filename = $(el).find('p > span.item').text().trim();

        const $el_1 = $(el).find('p.way > span').eq(0);
        const link_1 = $el_1.find('a').eq(0).prop('href');
        const pwd_1 = $el_1.find('a').eq(1).text().trim();

        const $el_2 = $(el).find('p.way > span').eq(1);
        const link_2 = $el_2.find('a').eq(0).prop('href');
        const pwd_2 = $el_2.find('a').eq(1).text().trim();

        const $el_3 = $(el).find('p.way > span').eq(2);
        const link_3 = $el_3.find('a').eq(0).prop('href');
        const pwd_3 = $el_3.find('a').eq(1).text().trim();

        if (link_1 && link_1.includes('pan.baidu.com')) {
            arr_baidu.push(joinStr(season, filename, link_1, pwd_1));
        }
        if (link_2 && link_2.includes('pan.baidu.com')) {
            arr_baidu.push(joinStr(season, filename, link_2, pwd_2));
        }
        if (link_3 && link_3.includes('pan.baidu.com')) {
            arr_baidu.push(joinStr(season, filename, link_3, pwd_3));
        }

        if (link_1 && link_1.includes('share.weiyun.com')) {
            arr_weiyun.push(joinStr(season, filename, link_1, pwd_1));
        }
        if (link_2 && link_2.includes('share.weiyun.com')) {
            arr_weiyun.push(joinStr(season, filename, link_2, pwd_2));
        }
        if (link_3 && link_3.includes('share.weiyun.com')) {
            arr_weiyun.push(joinStr(season, filename, link_3, pwd_3));
        }

        if (link_1 && link_1.includes('pan.xunlei.com')) {
            arr_xunlei.push(joinStr(season, filename, link_1, pwd_1));
        }
        if (link_2 && link_2.includes('pan.xunlei.com')) {
            arr_xunlei.push(joinStr(season, filename, link_2, pwd_2));
        }
        if (link_3 && link_3.includes('pan.xunlei.com')) {
            arr_xunlei.push(joinStr(season, filename, link_3, pwd_3));
        }

        if (link_1 && link_1.includes('mega.nz')) {
            arr_mega.push(joinStr(season, filename, link_1, pwd_1));
        }
        if (link_2 && link_2.includes('mega.nz')) {
            arr_mega.push(joinStr(season, filename, link_2, pwd_2));
        }
        if (link_3 && link_3.includes('mega.nz')) {
            arr_mega.push(joinStr(season, filename, link_3, pwd_3));
        }

        if (link_1 && link_1.includes('magnet:')) {
            arr_magnet.push(joinStr(season, filename, link_1, pwd_1));
        }
        if (link_2 && link_2.includes('magnet:')) {
            arr_magnet.push(joinStr(season, filename, link_2, pwd_2));
        }
        if (link_3 && link_3.includes('magnet:')) {
            arr_magnet.push(joinStr(season, filename, link_3, pwd_3));
        }

        if (link_1 && link_1.includes('ed2k:')) {
            arr_ed2k.push(joinStr(season, filename, link_1, pwd_1));
        }
        if (link_2 && link_2.includes('ed2k:')) {
            arr_ed2k.push(joinStr(season, filename, link_2, pwd_2));
        }
        if (link_3 && link_3.includes('ed2k:')) {
            arr_ed2k.push(joinStr(season, filename, link_3, pwd_3));
        }
    });

    if (arr_magnet.length) {
        arr_magnet.push(`磁力下载(追新番字幕)：`);
    }
    if (arr_ed2k.length) {
        arr_ed2k.push(`电驴下载(追新番字幕)：`);
    }
    if (arr_baidu.length) {
        arr_baidu.push(`百度网盘下载(追新番字幕)：`);
    }
    if (arr_weiyun.length) {
        arr_weiyun.push(`微云网盘下载(追新番字幕)：`);
    }
    if (arr_xunlei.length) {
        arr_xunlei.push(`迅雷网盘下载(追新番字幕)：`);
    }
    if (arr_mega.length) {
        arr_mega.push(`MEGA 网盘下载(追新番字幕)：`);
    }

    const str = combine2Str(arr_magnet, arr_ed2k, arr_baidu, arr_weiyun, arr_xunlei, arr_mega).trim();
    const $button_copy = $('<button class="imzhi_fanxinzhui_copy_url">复制下载地址</button>');
    $button_copy.attr('data-clipboard-text', str);
    $('.item_title').append($button_copy);
    new ClipboardJS('.imzhi_fanxinzhui_copy_url');

    function joinStr(season, filename, link, pwd) {
        const text = season ? season : filename;
        const code = pwd ? `，提取码：${pwd}。` : '';
        return `<a href="${link}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>${code}`;
    }

    function combine2Str(...arr) {
        const str_arr = [];
        for (let item of arr) {
            str_arr.push(item.reverse().join("\n"));
        }
        return str_arr.join("\n\n");
    }
})();