// ==UserScript==
// @name         追新番完整复制电驴链接
// @namespace    http://tampermonkey.net/
// @version      0.1.18
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.zhuixinfan.com/main.php?mod=viewfilm&pid=*
// @match        http://www.zhuixinfan.com/main.php?mod=viewtvplay&pid=*
// @match        http://www.zhuixinfan.com/main.php?mod=viewresource&sid=*
// @match        http://www.zhuixinfan.com/viewfilm-*.html
// @match        http://www.zhuixinfan.com/viewtvplay-*.html
// @match        http://www.zhuixinfan.com/viewresource-*.html
// @match        http://web.archive.org/web/*/http://*zhuixinfan.com/main.php?mod=viewfilm&pid=*
// @match        http://web.archive.org/web/*/http://*zhuixinfan.com/main.php?mod=viewtvplay&pid=*
// @match        http://web.archive.org/web/*/http://*zhuixinfan.com/main.php?mod=viewresource&sid=*
// @match        http://web.archive.org/web/*/http://*zhuixinfan.com/viewfilm-*.html
// @match        http://web.archive.org/web/*/http://*zhuixinfan.com/viewtvplay-*.html
// @match        http://web.archive.org/web/*/http://*zhuixinfan.com/viewresource-*.html
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/407051/%E8%BF%BD%E6%96%B0%E7%95%AA%E5%AE%8C%E6%95%B4%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/407051/%E8%BF%BD%E6%96%B0%E7%95%AA%E5%AE%8C%E6%95%B4%E5%A4%8D%E5%88%B6%E7%94%B5%E9%A9%B4%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://www.zhuixinfan.com/viewtvplay-1188.html
(function() {
    'use strict';

    const storage_key = 'imzhi_zhuixinfan_magnet_link';
    const tab_key = 'imzhi_zhuixinfan_tab';
    const match_href = location.href.match(/(?:http:\/\/web\.archive\.org\/web\/\d+?\/)?https?:\/\/(?:www\.)?(?<url_mark>zhuixinfan\.com\/main\.php\?mod=viewresource&sid=\d+$)/);
    console.log('location.href', location.href);
    console.log('match_href', match_href);
    if (match_href) {
        let storage_val = GM_getValue(storage_key);
        storage_val = storage_val ? storage_val : [];
        const filename = $('#pdtname').text();
        const url_magnet = $('#torrent_url').text();
        let url_emule = $('#emule_url').text();
        // 如果是qvod开头的下载链接，替换成#
        // 如 http://www.zhuixinfan.com/main.php?mod=viewresource&sid=4236
        if (url_magnet.startsWith('qvod')) {
            url_magnet = '#';
        }
        if (url_emule.startsWith('qvod')) {
            url_emule = '#';
        }

        let copy_magnet_text;
        if (url_magnet) {
            copy_magnet_text = `<a href="${url_magnet}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">[磁力]${filename}</a>`;
            storage_val.unshift(copy_magnet_text);
        }
        if (url_emule) {
            url_emule = decodeURI(url_emule);
            copy_magnet_text = `<a href="${url_emule}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">[电驴]${filename}</a>`;
            storage_val.unshift(copy_magnet_text);
        }

        // 百度、微云链接
        const $wangpan_links = $('.dlinks.dlinks-other > a');
        let url_baidu = '';
        let code_baidu = '';
        let url_weiyun = '';
        let code_weiyun = '';
        $wangpan_links.each(function (i, el) {
            const href = $(el).prop('href');
            const text = $(el).text().trim();
            let mat = text.match(/密码[:：](?<code>[0-9a-zA-Z]{4,6})/i);
            if (href.indexOf('pan.baidu.com') > -1) {
                url_baidu = href;
                // code_baidu = mat && mat.groups ? mat.groups.code : '';
                code_baidu = mat ? mat.groups.code : '';
            }
            if (href.indexOf('weiyun.com') > -1) {
                url_weiyun = href;
                // code_weiyun = mat && mat.groups ? mat.groups.code : '';
                code_weiyun = mat ? mat.groups.code : '';
            }
        });

        const copy_baidu_code = code_baidu ? `，提取码：${code_baidu}。` : '';
        const copy_weiyun_code = code_weiyun ? `，提取码：${code_weiyun}。` : '';
        const copy_baidu_text = `<a href="${url_baidu}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">[百度网盘]${filename}</a>${copy_baidu_code}`;
        const copy_weiyun_text = `<a href="${url_weiyun}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">[微云网盘]${filename}</a>${copy_weiyun_code}`;
        if (url_baidu) {
            storage_val.unshift(copy_baidu_text);
        }
        if (url_weiyun) {
            storage_val.unshift(copy_weiyun_text);
        }

        GM_setValue(storage_key, storage_val);

        let tab_all = GM_getValue(tab_key);
        tab_all = tab_all ? tab_all : [];
        // 往数组里插入的URL为追新番的网址
        tab_all.push(match_href.groups.url_mark);
        GM_setValue(tab_key, tab_all);
        return;
    }

    const $ajax_body = $('#ajax_tbody');
    if ($ajax_body.length && !confirm('确定要完整复制电驴(OR 磁力)链接吗？')) {
        return;
    }
    GM_deleteValue(storage_key);
    GM_deleteValue(tab_key);

    const $td = $ajax_body.find('tr > .td2');
    const td_len = $td.length;
    $td.each(function(i, el) {
        const href_origin = $(el).find('a').prop('href');
        const href_match = href_origin.match(/https?:\/\/(?:www\.)?(?<url_mark>zhuixinfan\.com\/main\.php\?mod=viewresource&sid=\d+$)/);
        const href_real = href_match.groups.url_mark;
        let href = href_origin;

        // 如果是 web.archive.org 里打开的页面，对于 href 需要拼接上前缀 http://web.archive.org/web/xxx/
        const match_arr = location.href.match(/^http:\/\/web\.archive\.org\/web\/\d+?\//);
        if (match_arr) {
            href = match_arr[0] + href_origin;
        }

        setTimeout(function() {
            const tab = GM_openInTab(href, {
//                 active: true,
//                 setParent: true,
//                 incognito: true,
//                 insert: true,
            });
            const inter_id = setInterval(function() {
                let tab_all = GM_getValue(tab_key);
                tab_all = tab_all ? tab_all : [];
                // tab_all的值有问题，一直都只有一个元素（测试网址：http://web.archive.org/web/20200713041515/http://www.zhuixinfan.com/viewfilm-516.html）
                console.log('tab_all', tab_all);
                console.log('href_real', href_real);
                // 检测数组是否有匹配的追新番网址
                if (tab_all.indexOf(href_real) > -1) {
                    clearInterval(inter_id);
                    tab.close();

                    if (i === td_len - 1) {
                        const $button_copy = $('<button class="imzhi_zhuixinfan_copy_url">复制所有下载地址</button>');
                        const curr_text = GM_getValue(storage_key);
                        const group_arr = groupArrList(curr_text);
                        $button_copy.attr('data-clipboard-text', group_arr.join("\n"));
                        new ClipboardJS('.imzhi_zhuixinfan_copy_url');
                        $ajax_body.before($button_copy);
                    }
                }
            }, 1000);
        }, i * 3500);
    });

    // 根据内容获取首行文字（如：电驴下载(人人影视字幕)）
    function firstLine(val) {
        const renren_zimu = /人人影视/i.test(val) || /YYeTs/i.test(val);
        const emule_link = /ed2k:\/\//i.test(val);
        const magnet_link = /magnet:/i.test(val);
        const baidu_link = /pan\.baidu\.com/i.test(val);
        const weiyun_link = /weiyun\.com/i.test(val);

        let line_prefix = '';
        if (emule_link) {
            line_prefix = '电驴下载';
        } else if (magnet_link) {
            line_prefix = '磁力下载';
        } else if (baidu_link) {
            line_prefix = '百度网盘下载';
        } else if (weiyun_link) {
            line_prefix = '微云网盘下载';
        }

        const line_suffix = renren_zimu ? '(人人影视字幕)' : '(追新番字幕)';
        return line_prefix + line_suffix + '：';
    }

    function groupArrList(arr) {
        let group_ed2k = [];
        let group_magnet = [];
        let group_baidu = [];
        let group_weiyun = [];
        arr.forEach(function(item) {
            if (/ed2k:\/\//i.test(item)) {
                group_ed2k.push(item);
            } else if (/magnet:/i.test(item)) {
                group_magnet.push(item);
            } else if (/pan\.baidu\.com/i.test(item)) {
                group_baidu.push(item);
            } else if (/weiyun\.com/i.test(item)) {
                group_weiyun.push(item);
            }
        });

        let all_arr = [];
        if (group_ed2k.length) {
            group_ed2k.unshift(firstLine(group_ed2k));
            all_arr = all_arr.concat(group_ed2k);
        }
        if (group_magnet.length) {
            group_magnet.unshift(firstLine(group_magnet));
            if (all_arr.length) {
                group_magnet.unshift('');
            }
            all_arr = all_arr.concat(group_magnet);
        }
        if (group_baidu.length) {
            group_baidu.unshift(firstLine(group_baidu));
            if (all_arr.length) {
                group_baidu.unshift('');
            }
            all_arr = all_arr.concat(group_baidu);
        }
        if (group_weiyun.length) {
            group_weiyun.unshift(firstLine(group_weiyun));
            if (all_arr.length) {
                group_weiyun.unshift('');
            }
            all_arr = all_arr.concat(group_weiyun);
        }

        return all_arr;
    }
})();