// ==UserScript==
// @name         霸王龙压制组复制链接
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  霸王龙压制组的复制链接脚本
// @author       imzhi <yxz_blue@126.com>
// @match        https://t-rex.tzfile.com/*.html
// @match        https://t-rex.tzfile.com/redirect?token=*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js
// @grant        GM_addStyle
// @grant        GM_getTabs
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445815/%E9%9C%B8%E7%8E%8B%E9%BE%99%E5%8E%8B%E5%88%B6%E7%BB%84%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/445815/%E9%9C%B8%E7%8E%8B%E9%BE%99%E5%8E%8B%E5%88%B6%E7%BB%84%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    GM_addStyle('@charset utf-8;button { background-color: #fff9dc; font-size: 22px; margin-right: 10px; color: #000; }');

    const article_id = findArticleId();
    if (!article_id) {
        console.log('_imzhi not found article_id')
        return;
    }

    const $content = $('.single-article .entry-content');
    const all_ed2k = ['电驴下载(BWL)：'];
    const all_magnet = ['磁力下载(BWL)：'];
    const all_115 = ['115网盘下载(BWL)：'];
    const all_uc = ['UC网盘下载(BWL)：'];
    const all_baidu = ['百度网盘下载(BWL)：'];
    const all_aliyun = ['阿里云网盘下载(BWL)：'];
    const all_ali = ['阿里云盘下载(BWL)：'];
    const all_kuake = ['夸克网盘下载(BWL)：'];
    const all_xunlei = ['迅雷网盘下载(BWL)：'];

    let $div_a = $content.find('p > a');
    $div_a.each(function(i, el) {
        const $el = $(el);

        let href = $el.attr('href');
        push_item(href);
        console.log(`_imzhi href ${href}`)
    });

    const button_list = await getDownloadData(article_id);
    for (const [button_key, button_item] of Object.entries(button_list)) {
        // button_item.name
        const this_url = await getDownloadPageData(article_id, button_key);
        // console.log('this_url', this_url);

        let url_redirect = await getDownloadUrlRedirect(this_url);
        url_redirect = url_redirect.trim()
        if (!url_redirect) continue;
        console.log('url_redirect---', url_redirect)
        push_item(url_redirect);
        console.log(`_imzhi url_redirect ${url_redirect}`)
    }

    function push_item(href) {
        if (href.startsWith('https://pan.quark.cn')) {
            all_kuake.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">夸克网盘</a>`);
        } else if (href.startsWith('https://pan.baidu.com')) {
            all_baidu.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">百度网盘</a>`);
        } else if (href.startsWith('https://www.aliyundrive.com')) {
            all_aliyun.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">阿里云网盘</a>`);
        } else if (href.startsWith('https://drive.uc.cn')) {
            all_uc.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">UC网盘</a>`);
        } else if (href.startsWith('https://pan.xunlei.com')) {
            all_xunlei.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">迅雷网盘</a>`);
        } else if (href.startsWith('https://www.alipan.com/')) {
            all_ali.push(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">阿里云盘</a>`);
        }
    }

    const all_arr = combineArr([all_baidu, all_aliyun, all_kuake, all_ed2k, all_magnet, all_uc, all_xunlei, all_115, all_ali]);
    // console.log('all_arr', all_arr, all_baidu, all_aliyun, all_kuake, all_ed2k, all_magnet, all_uc, all_xunlei, all_115, all_ali)
    const $button_baidu = $('<button class="imzhi_zimuxia_copy_url">复制百度</button>');
    const $button_aliyun = $('<button class="imzhi_zimuxia_copy_url">复制阿里云</button>');
    const $button_ali = $('<button class="imzhi_zimuxia_copy_url">复制阿里云</button>');
    const $button_kuake = $('<button class="imzhi_zimuxia_copy_url">复制夸克</button>');
    const $button_ed2k = $('<button class="imzhi_zimuxia_copy_url">复制电驴</button>');
    const $button_magnet = $('<button class="imzhi_zimuxia_copy_url">复制磁力</button>');
    const $button_uc = $('<button class="imzhi_zimuxia_copy_url">复制UC</button>');
    const $button_115 = $('<button class="imzhi_zimuxia_copy_url">复制115</button>');
    const $button_xunlei = $('<button class="imzhi_zimuxia_copy_url">复制迅雷</button>');
    const $button_all = $('<button class="imzhi_zimuxia_copy_url">复制所有</button>');
    $button_baidu.attr('data-clipboard-text', all_baidu.join("\n"));
    $button_aliyun.attr('data-clipboard-text', all_aliyun.join("\n"));
    $button_aliyun.attr('data-clipboard-text', all_ali.join("\n"));
    $button_kuake.attr('data-clipboard-text', all_kuake.join("\n"));
    $button_ed2k.attr('data-clipboard-text', all_ed2k.join("\n"));
    $button_magnet.attr('data-clipboard-text', all_magnet.join("\n"));
    $button_uc.attr('data-clipboard-text', all_uc.join("\n"));
    $button_115.attr('data-clipboard-text', all_115.join("\n"));
    $button_xunlei.attr('data-clipboard-text', all_xunlei.join("\n"));
    $button_all.attr('data-clipboard-text', all_arr.join("\n"));
    new ClipboardJS('.imzhi_zimuxia_copy_url');
    if (all_baidu.length > 1) {
        $content.after($button_baidu);
    }
    if (all_aliyun.length > 1) {
        $content.after($button_aliyun);
    }
    if (all_ali.length > 1) {
        $content.after($button_ali);
    }
    if (all_kuake.length > 1) {
        $content.after($button_kuake);
    }
    if (all_ed2k.length > 1) {
        $content.after($button_ed2k);
    }
    if (all_magnet.length > 1) {
        $content.after($button_magnet);
    }
    if (all_115.length > 1) {
        $content.after($button_115);
    }
    if (all_uc.length > 1) {
        $content.after($button_uc);
    }
    if (all_xunlei.length > 1) {
        $content.after($button_xunlei);
    }
    if (all_arr.length > 1) {
        $content.after($button_all);
    }

    // 将几个数组合并，并从第二个数组开始增加空行
    function combineArr(list_arr) {
        let result = [];
        list_arr.forEach(function(list_item) {
            const the_item = $.extend([], list_item);
            if (the_item.length <= 1) {
                return;
            }
            if (result.length) {
                the_item.unshift('')
            }
            result = result.concat(the_item);
        });
        return result;
    }

    async function getDownloadData(post_id) {
        const res = await $.post('https://t-rex.tzfile.com/wp-json/b2/v1/getDownloadData', {post_id});
        // console.log('getDownloadData', res);
        const button = res[0] && res[0].button ? res[0].button : [];
        // console.log('getDownloadData button', button);
        return button;
    }

    async function getDownloadPageData(post_id, i) {
        const index = 0
        const res = await $.post('https://t-rex.tzfile.com/wp-json/b2/v1/getDownloadPageData', {post_id, i, index});
        // console.log('getDownloadPageData', res);
        const url = res.button ? res.button.url : '';
        return url;
    }

    async function getDownloadUrlRedirect(link) {
        const url = `https://t-rex.tzfile.com/redirect?token=${link}`;
        const res = await GM.xmlHttpRequest({method: 'GET', url})
            .catch(e => console.log('getDownloadUrlRedirect err', e));
        // console.log('getDownloadUrlRedirect', link, res, res.response);
        // res.response 示例:
        // <script language="JavaScript">
        //     window.location.href = "https://pan.baidu.com/s/1jVajakj_FFu1x5N1T4QgYA?pwd=trex"
        // </script>

        let match = res.response.match(/window\.location\.href.+?"(?<the_url>.+?)"/)
        if (!match) {
            // <a href="https://pan.quark.cn/s/22267d5dbe6e" class="download-link" target="_blank">支持本站请使用浏览器/网盘APP扫码</a>
            match = res.response.match(/href.+?"(?<the_url>.+?)".+?class="download-link"/)
            if (!match) {
                return '';
            }
        }

        return match.groups.the_url;
    }

    function findArticleId() {
        const href = location.href;
        const result = href.match(/\/(?<id>\d+?)\.html/);
        if (!result) {
            return '';
        }
        return result.groups.id;
    }

    // await waitTime(3000)

//     const $down_btn = document.querySelectorAll('.allow-down .download-button-box > .button');
//     console.log('$down_btn', $down_btn, [...$down_btn]);
//     for (let $down_btn_item of $down_btn) {
//         console.log('$down_btn_item', $down_btn_item);
//         $down_btn_item.click();

//         break;
//     }

//     GM_openInTab('https://baidu.com')

//     await waitTime(2000)
//     const tabs = await GM.getTabs();
//     console.log('tabs', tabs)

//     function waitTime(time) {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve();
//             }, time);
//         });
//     }
})();