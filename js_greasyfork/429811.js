// ==UserScript==
// @name         tokyonothot.com复制资源链接
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  东京不够热字幕官网复制资源链接
// @author       imzhi <yxz_blue@126.com>

// @match        https://www.tokyonothot.com/drama/*
// @match        https://www.tokyonothot.com/movie/*
// @match        https://www.tokyonothot.com/anime/*
// @match        https://www.tokyonothot.com/uncategorized/*
// @match        https://web.archive.org/web/*/https://www.tokyonothot.com/drama/*
// @match        https://web.archive.org/web/*/https://www.tokyonothot.com/movie/*
// @match        https://web.archive.org/web/*/https://www.tokyonothot.com/anime/*

// @match        https://www.tnhsub.com/drama/*
// @match        https://www.tnhsub.com/movie/*
// @match        https://www.tnhsub.com/anime/*
// @match        https://www.tnhsub.com/uncategorized/*
// @match        https://www.tnhsub.com/music-program/*
// @match        https://web.archive.org/web/*/https://www.tnhsub.com/drama/*
// @match        https://web.archive.org/web/*/https://www.tnhsub.com/movie/*
// @match        https://web.archive.org/web/*/https://www.tnhsub.com/anime/*

// @match        https://www.tnhzmz.com/drama/*
// @match        https://www.tnhzmz.com/movie/*
// @match        https://www.tnhzmz.com/anime/*
// @match        https://www.tnhzmz.com/uncategorized/*
// @match        https://www.tnhzmz.com/music-program/*
// @match        https://web.archive.org/web/*/https://www.tnhzmz.com/drama/*
// @match        https://web.archive.org/web/*/https://www.tnhzmz.com/movie/*
// @match        https://web.archive.org/web/*/https://www.tnhzmz.com/anime/*

// @match        https://www.tnhsub.net/drama/*
// @match        https://www.tnhsub.net/movie/*
// @match        https://www.tnhsub.net/anime/*
// @match        https://www.tnhsub.net/uncategorized/*
// @match        https://www.tnhsub.net/music-program/*

// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/429811/tokyonothotcom%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/429811/tokyonothotcom%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const arr_baidu = [];
    const arr_115 = [];
    const arr_uc = [];
    const $content = $('.section_body > .content');
    $content.find('a').each(function(i, el) {
        const $el = $(el);
        // 对web.archive.org里的链接[https://web.archive.org/web/20210226123610/https://pan.baidu.com/s/1WHMptmSDYwPbnpmE3Z3BPA]进行处理
        const href = $el.prop('href').replace(/https?:\/\/(?:web\.archive\.org\/web\/)?\d+?\//, '');
        console.log('href', href);
        if (href.includes('pan.baidu.com')) {
            arr_baidu.push(parseBaidu($el));
        } else if (href.includes('115.com')) {
            arr_115.push(parseBaidu($el));
        } else if (href.includes('yun.cn')) {
            arr_uc.push(parseBaidu($el));
        }
    });
    if (arr_baidu.length) {
        arr_baidu.unshift('百度网盘下载(东京不够热字幕)：');
    }
    if (arr_115.length) {
        arr_115.unshift('115网盘下载(东京不够热字幕)：');
    }
    if (arr_uc.length) {
        arr_uc.unshift('UC网盘下载(东京不够热字幕)：');
    }
    const com_str = combine2Str(arr_baidu, arr_115, arr_uc);
    console.log('com_str', com_str);
    const $button_copy = $('<button class="imzhi_tokyonothot_copy_url" style="font-size: 22px;">复制下载地址</button>');
    $button_copy.attr('data-clipboard-text', com_str);
    $content.after($button_copy);
    new ClipboardJS('.imzhi_tokyonothot_copy_url');

    function parseBaidu($el) {
        const href = $el.prop('href');
        const text = $el.text().trim();
        let pwd;
        pwd = retPwd($el);
        if (!pwd) {
            pwd = retPwdLevel2($el);
        }
        if (!pwd) {
            pwd = retPwdForAnime($el);
        }
        // if (urlIsDrama() || urlIsMovie()) {
        //     pwd = retPwd($el);
        //     if (!pwd) {
        //         pwd = retPwdLevel2($el);
        //     }
        // } else if (urlIsAnime()) {
        //     pwd = retPwdForAnime($el);
        // }
        const pwd_str = pwd ? `，提取码：${pwd}。` : '';
        // console.log('pwd', pwd);
        return `<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${convertText(text)}</a>${pwd_str}`;
    }

    function retPwd($el) {
        let $span = $el.closest('span');
        // 兼容[https://www.tokyonothot.com/drama/wagaya-no-mondai/]
        if (!$span.length) {
            $span = $el.closest('div');
        }
        const href = $el.prop('href').replace('&#', '');
        const html = $span.html();
        // 兼容[https://www.tokyonothot.com/drama/joshi-teki-seikatsu/]，注意：一键复制按钮在页面的下方
        const regex = new RegExp(`${escapeRegExp(href)}[\\s\\S]+?密码：(?:<strong>)?.*?(?<code>[a-z0-9]{4})`, 'i');
        console.log('retPwd', $el, $span, html, regex);
        const mat = html.match(regex);
        return mat ? mat.groups.code : false;
    }

    function retPwdLevel2($el) {
        let $span = $el.closest('span').parents('span');
        const href = $el.prop('href').replace('&#', '');
        // 兼容[https://www.tokyonothot.com/drama/perfect-world/]
        if (!$span.length) {
            $span = $el.closest('span').closest('li');
        }
        let html = $span.html();
        // 防止html为undefined的时候，html.match报错
        html = html ? html : '';
        const regex = new RegExp(`${escapeRegExp(href)}.+?密码：(?:<strong>)?.*?(?<code>[a-z0-9]{4})`, 'i');
        console.log('retPwdLevel2', $el, $span, html, regex);
        const mat = html.match(regex);
        return mat ? mat.groups.code : false;
    }

    function retPwdForAnime($el) {
        let $p = $el.closest('p').next('p');
        // 兼容[https://www.tokyonothot.com/drama/ossanslove/]
        if (!$p.length) {
            $p = $el.closest('p').next('div');
        }
        // 兼容[https://www.tokyonothot.com/drama/school-lawyer/]
        if (!$p.length || !$p.text().trim()) {
            $p = $el.closest('div').next('div');
        }
        if (!$p.length || !$p.text().trim()) {
            $p = $el.closest('div').next('div').next('div');
        }
        // 兼容[https://www.tokyonothot.com/drama/holiday-love/]
        if (!$p.length || !$p.text().trim()) {
            $p = $el.closest('div').next('div').next('div').next('div');
        }
        // 兼容[https://www.tokyonothot.com/drama/repeat/]
        if (!$p.length || !$p.text().trim()) {
            $p = $el.closest('div').nextAll('div').first();
        }
        // 兼容[https://www.tokyonothot.com/drama/13/]
        if (!$p.length || !$p.text().trim()) {
            $p = $el.closest('div').next('p');
        }
        const html = $p.html();
        const regex = new RegExp(`密码：(?:<strong>)?.*?(?<code>[a-z0-9]{4})`, 'i');
        console.log('retPwdForAnime', $p, html, regex);
        const mat = html.match(regex);
        return mat ? mat.groups.code : false;
    }

    function convertText(text) {
        if (!urlIsDrama()) {
            return text;
        }
        if (text === '百度网盘' || text === '115网盘' || text === 'UC网盘') {
            return '全集下载';
        }
        return text;
    }

    function urlIsDrama() {
        return location.href.includes('/drama/');
    }

    function urlIsMovie() {
        return location.href.includes('/movie/');
    }

    function urlIsAnime() {
        return location.href.includes('/anime/');
    }

    // 转义字符串给正则使用并结合实体字符转义
    // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    // https://stackoverflow.com/a/5044296
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
            .replace('&', '&amp;');
    }

    function combine2Str(...arr) {
        const str_arr = [];
        for (let item of arr) {
            if (!item.length) {
                continue;
            }
            str_arr.push(item.join("\n"));
        }
        return str_arr.join("\n\n");
    }
})();