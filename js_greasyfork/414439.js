// ==UserScript==
// @name         m.tiantk.com复制链接
// @namespace    http://tampermonkey.net/
// @version      0.1.19
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://m.tiantk.com/*
// @match        http://m.tiantk.com/*
// @match        https://m.tiantk.net/*
// @match        http://m.tiantk.net/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.4.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/414439/mtiantkcom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/414439/mtiantkcom%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://m.tiantk.com/content/index52174.html
(function() {
    'use strict';


    $('.layout-body > div > ul').each(function(i, ul) {
        generateButton($(ul));
    });

    function generateButton($container) {
        let link_arr = [];
        let link_arr_raw = [];
        $container.find('li').each(function(i, el) {
            if (!$(el).find('button.btncopy').length) {
                return;
            }
            let filename = $(el).find('a').text().replace(/\s+\[迅雷\]/, '');
            filename = stripSpace(filename);
            let url = $(el).find('a').prop('href').replace(/^\[.+?\]/, '');
            url = decodeURI(url);
            url = url.replace(/\|file\|\[.+?\]/, '|file|[日剧跑rijupao.com]');
            let url_raw = url;
            if (url.startsWith('thunder://')) {
                url = url.replace('thunder://', '');
                try {
                    url = Base64.decode(url).replace(/^AA/, '').replace(/ZZ$/, '');
                } catch (exception) {
                    console.error('m.tiantk.com复制链接抛出异常', exception);
                    url = url_raw;
                }
                let parse_filename = parseFilename(url);
                if (parse_filename) {
                    filename = parse_filename;
                }
            }
            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            const link_raw = `<a href="${url_raw}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename}</a>`;
            link_arr.push(link);
            link_arr_raw.push(link_raw);
        });

        if (!checkIsMovie()) {
            link_arr.reverse();
            link_arr_raw.reverse();
        }

        link_arr.sort(sortAsc);
        link_arr_raw.sort(sortAsc);

        if (link_arr.length) {
            let count_str = linkCount(link_arr);
            $container.before(`<p>${count_str}</p>`);
            link_arr = linkArrGroup(link_arr);
            const $button_copy = $('<button class="imzhi_tiantk_copy_url">复制所有下载地址</button>');
            $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
            new ClipboardJS('.imzhi_tiantk_copy_url');
            $container.before($button_copy);
        }
        if (link_arr_raw.length) {
            link_arr_raw = linkArrGroup(link_arr_raw);
            const $button_copy_raw = $('<button class="imzhi_tiantk_copy_url" style="margin-left: 10px;">复制原来下载地址</button>');
            $button_copy_raw.attr('data-clipboard-text', link_arr_raw.join("\n"));
            new ClipboardJS('.imzhi_tiantk_copy_url');
            $container.before($button_copy_raw);
        }
    }

    // 根据集数排序
    function sortAsc(item_a, item_b) {
        const num_a = getEpisodeNum(item_a);
        const num_b = getEpisodeNum(item_b);
        return num_a === null || num_b === null ? 0 : parseInt(num_a) - parseInt(num_b);
    }

    // 获取真正的集数
    // 示例网址：http://m.tiantk.com/content/index8428.html
    // 可能存在的情形：EP01、第05回、第29集或者直接是两位或者三位数字（两位数字以0开头）
    function getEpisodeNum(text) {
        let match_res = text.match(/>.+?EP(\d+).*?</i);
        if (!match_res) {
            match_res = text.match(/>.+?第(\d+)[回|话].*?</i);
        }
        if (!match_res) {
            match_res = text.match(/>.+?第(\d+)集.*?</i);
        }
        if (!match_res) {
            match_res = text.match(/>.+?(0\d{1}|[1-9]\d{1,2}).*?</i);
        }
        return match_res ? match_res[1] : null;
    }

    // 获取电驴链接中的文件名
    function parseFilename(url) {
        if (url.startsWith('ed2k://')) {
            const match = url.match(/\|file\|(.+?)\|\d+/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return false;
    }

    // 根据下载链接类型计数
    function linkCount(link_arr) {
        let counts = {};
        link_arr.forEach(function (el) {
            let match_result = el.match(/href="(\w+?):.+?"/i);
            if (match_result) {
                let protocol = match_result[1].toLowerCase();
                if (counts[protocol]) {
                    ++counts[protocol]
                } else {
                    counts[protocol] = 1;
                }

            }
        });

        let str = Object.entries(counts).map(function (val) {
            return `${val[0]}: ${val[1]}`;
        }).join(' ');
        return str;
    }

    // 根据下载链接类型分组
    function linkArrGroup(arr) {
        let list = {};
        arr.forEach(function (el) {
            let mat = el.match(/href="(?<url>.+?)"/);
            let url = mat.groups.url;
            let protocol = url.split(':')[0].toLowerCase();
            let prefix = '其它下载：';

            // 对于百度网盘或者UC网盘链接，先处理 protocol 再处理 el
            if (el.match(/pan\.baidu\.com/)) {
                protocol = 'baidu';
                el = formatWangpan(el);
                el = el.replace('[网盘]', '[百度网盘]');
            } else if (el.match(/www\.yun\.cn/)) {
                protocol = 'uc';
                el = formatWangpan(el);
                el = el.replace('[网盘]', '[UC网盘]');
            } else if (el.match(/pan\.xunlei\.com/)) {
                protocol = 'thunder_pan';
                el = formatWangpan(el);
                el = el.replace('百度', '迅雷').replace('[网盘]', '[迅雷网盘]');
            }
            switch (protocol) {
                case 'thunder':
                    prefix = '迅雷下载：';
                    break;
                case 'magnet':
                    prefix = '磁力下载：';
                    break;
                case 'ed2k':
                    prefix = '电驴下载：';
                    break;
                case 'ftp':
                    prefix = 'FTP下载：';
                    break;
                case 'http':
                case 'https':
                    prefix = '普通下载：';
                    break;
                case 'baidu':
                    prefix = '百度网盘下载：';
                    break;
                case 'uc':
                    prefix = 'UC网盘下载：';
                    break;
                case 'thunder_pan':
                    prefix = '迅雷网盘下载：';
                    break;
            }
            if (!list[prefix]) {
                list[prefix] = [el];
            } else {
                list[prefix].push(el);
            }
        });
        let result = [];
        Object.keys(list).forEach(function (list_key) {
            let key_wrap = [list_key];
            // y为了在每个下载类型前面加一个空行
            if (result.length) {
                key_wrap.unshift('');
            }
            result = result.concat(key_wrap).concat(list[list_key]);
        });
        return result;
    }

    // 格式化网盘链接
    function formatWangpan(url) {
        let mat = url.match(/href="(?<url>.+?)".+?(?:(?:密码|提取码)[:：]\s*?(?<code>[a-zA-Z0-9]{4}))/);
        if (!mat) {
            return url;
        }
        let link_url = mat.groups.url;
        let link_code = mat.groups.code;
        let link_text = $(url).text().trim();
        link_text = link_text.split(/[,，]密码/)[0];
        const result = `<a href="${link_url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${link_text}</a>，提取码：${link_code}。`;
        return result;
    }

    // 去除文件名里的空格
    // 比如：[磁力] WWW.TSKSCN.COM（交响情人梦最终乐章 前篇） RMVB             397.8 MB
    // 改为：[磁力] WWW.TSKSCN.COM（交响情人梦最终乐章 前篇） RMVB[397.8 MB]
    function stripSpace(filename) {
        const result = filename.replace(/\s+?(?<file_size>[\d\.]+?\s*(?:GB|MB))/, '[$<file_size>]');
        return result;
    }

    // 获取当前是否电影
    function checkIsMovie() {
        return $('ul.navlist > li.active').text().trim() === '电影';
    }
})();