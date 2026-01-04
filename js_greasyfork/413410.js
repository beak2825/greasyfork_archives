// ==UserScript==
// @name         bd-film.cc复制链接+去广告
// @namespace    http://tampermonkey.net/
// @version      0.1.12
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.bd-film.cc/*
// @match        https://www.bd2020.com/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://greasyfork.org/scripts/430623-thunder-flashget-js/code/Thunder_FlashGetjs.js?version=959081
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/413410/bd-filmcc%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/413410/bd-filmcc%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

// 示例页面：
// https://www.bd-film.cc/zx/25068.htm
// https://www.bd2020.com/zx/22746.htm
(function() {
    'use strict';

    // 隐藏左边背景广告
    GM_addStyle('@charset utf-8; #HMcoupletDivleft {display: none;}');

    // 隐藏右边背景广告
    GM_addStyle('@charset utf-8; #HMcoupletDivright {display: none;}');

    $('#showmore > a > center').click();

    setTimeout(function() {
        $('.tab-pane > .item').each(function(i, item) {
            generateButton($(item));
        });
    }, 500);

    function generateButton($container) {
        let link_arr = [];

        $container.find('.panel > .option').each(function(option_i, option_el) {
            const $first_link = $(option_el).children('a');
            const first_text = $first_link.text();
            let url = $first_link.prop('href');
            url = handleUrl(url);
            let filename = first_text;
            let code = '';
            let size = '';
            if ($(option_el).hasClass('copybtn')) {
                filename = first_text.split(/[,，]/)[0];
                let match = $(option_el).text().match(/(?:提取|访问|密)码[：:]\s*?(?<code>[\da-z]{4,6})/i);
                if (match) {
                    code = match.groups.code;
                    code = `，提取码：${code}。`;
                }
            } else {
                // 提取下载链接里的文件名并去掉站点信息
                // https://www.bd2020.com/zx/6935.htm（ftp://g:g@vip.66ys.cn:6070/[66影视www.66ys.cn]功夫小子.rmvb）
                // https://www.bd2020.com/zx/9579.htm（ftp://y:y@vip.66ys.cc:2013/恶梦侦探2(66影视www.66ys.cc).rmvb）
                // https://www.bd2020.com/gq/12960.htm（ftp://6:6@ftp2.kan66.com:4165/【6v电影www.dy131.com】甲贺忍法帖BD中字1280高清.rmvb）
                // https://www.bd2020.com/zx/18985.htm（ftp://6vhao.com:6vhao.net@ftp15.66ys.org:2628/家路BD中字1280高清【6v电影域名被盗,新地址www.6vhao.net】.rmvb）
                filename = first_text.split('/').pop();
                filename = filename.replace(/[\(\[【].*?(?:66ys|6vdy|dy131|6vhao).+?[\)\]】]/i, '');
                if ($(option_el).find('.pull-right > .label.label-default').length) {
                    size = $(option_el).find('.pull-right > .label.label-default').text();
                    size = `[${size}]`;
                }
            }

            const link = `<a href="${url}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${filename+size}</a>${code}`;
            link_arr.push(link);
        });


        link_arr = groupLinkArr(link_arr);
        const $button_copy = $('<button class="imzhi_bdfilm_copy_url">复制所有下载地址</button>');
        $button_copy.attr('data-clipboard-text', link_arr.join("\n"));
        new ClipboardJS('.imzhi_bdfilm_copy_url');
        if (link_arr.length) {
            $container.before($button_copy);
        }
    }

    function handleUrl(str) {
        const decode_str = decodeURI(str);
        let res = decode_str.replace(/\|file\|\[.+?\]/, '|file|[日剧跑rijupao.com]');
        res = res.replace(/&dn=\[.+?\]/, '&dn=[日剧跑rijupao.com]');
        return res;
    }

    function groupLinkArr(link_arr) {
        const arr_baidu = [`百度网盘下载：`];
        const arr_uc = [`UC网盘下载：`];
        const arr_magnet = [`磁力下载：`];
        const arr_ed2k = [`电驴下载：`];
        const arr_wei = [`微云网盘下载：`];
        const arr_xunlei = [`迅雷网盘下载：`];
        const arr_thunder = [`迅雷下载：`];
        link_arr.forEach(function(link_item) {
            if (link_item.includes('pan.baidu.com')) {
                arr_baidu.push(link_item);
            } else if (link_item.includes('www.yun.cn')) {
                arr_uc.push(link_item);
            } else if (link_item.includes('www.weiyun.com')) {
                arr_wei.push(link_item);
            } else if (link_item.includes('ed2k')) {
                arr_ed2k.push(link_item);
            } else if (link_item.includes('magnet')) {
                arr_magnet.push(link_item);
            } else if (link_item.includes('pan.xunlei.com')) {
                arr_xunlei.push(link_item);
            } else if (link_item.includes('thunder://')) {
                arr_thunder.push(link_item);
            }
        });

        const res_arr = concatArr(arr_magnet, arr_ed2k, arr_baidu, arr_xunlei, arr_uc, arr_wei, arr_thunder);
        return res_arr;
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
})();