// ==UserScript==
// @name         追新番复制磁力链接
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        http://www.zhuixinfan.com/main.php?mod=viewresource&sid=*
// @match        http://103.116.73.246/main.php?mod=viewresource&sid=*
// @match        http://web.archive.org/web/*/http://*zhuixinfan.com/main.php?mod=viewresource&sid=*
// @match        https://web.archive.org/web/*/http://*zhuixinfan.com/main.php?mod=viewresource&sid=*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406985/%E8%BF%BD%E6%96%B0%E7%95%AA%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/406985/%E8%BF%BD%E6%96%B0%E7%95%AA%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// 示例页面：http://www.zhuixinfan.com/main.php?mod=viewresource&sid=11464
(function() {
    'use strict';

    const $down_emule = $('.bt.bt-dl:contains("电驴下载")');
    const $down_magnet = $('.bt.bt-cl:contains("磁力下载")');

    const $copy_emule = $('<button class="imzhi-copy-btn" />');
    const $copy_magnet = $('<button class="imzhi-copy-btn" />');
    const $copy_baidu = $('<button class="imzhi-copy-btn" />');
    const $copy_weiyun = $('<button class="imzhi-copy-btn" />');

    const filename = $('#pdtname').text();

    const url_emule = $('#emule_url').text();
    const url_magnet = $('#torrent_url').text();

    const copy_emule_text = `<a href="${url_emule}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">[电驴]${filename}</a>`;
    const copy_magnet_text = `<a href="${url_magnet}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">[磁力]${filename}</a>`;

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
//             code_baidu = mat && mat.groups ? mat.groups.code : '';
            code_baidu = mat ? mat.groups.code : '';
        }
        if (href.indexOf('weiyun.com') > -1) {
            url_weiyun = href;
//             code_weiyun = mat && mat.groups ? mat.groups.code : '';
            code_weiyun = mat ? mat.groups.code : '';
        }
    });

    const copy_baidu_code = code_baidu ? `，提取码：${code_baidu}。` : '';
    const copy_weiyun_code = code_weiyun ? `，提取码：${code_weiyun}。` : '';
    const copy_baidu_text = `<a href="${url_baidu}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">[百度网盘]${filename}</a>${copy_baidu_code}`;
    const copy_weiyun_text = `<a href="${url_weiyun}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">[微云网盘]${filename}</a>${copy_weiyun_code}`;

    $copy_emule.text('复制(emule)');
    $copy_magnet.text('复制(magnet)');
    $copy_baidu.text('复制(baidu)');
    $copy_weiyun.text('复制(weiyun)');
    $copy_emule.attr('data-clipboard-text', copy_emule_text);
    $copy_magnet.attr('data-clipboard-text', copy_magnet_text);
    $copy_baidu.attr('data-clipboard-text', copy_baidu_text);
    $copy_weiyun.attr('data-clipboard-text', copy_weiyun_text);
    new ClipboardJS('.imzhi-copy-btn');
    if (url_emule) {
        $down_emule.next('.bt.bt-copy').after($copy_emule);
    }
    if (url_magnet) {
        $down_magnet.next('.bt.bt-copy').after($copy_magnet);
    }
    if (url_baidu) {
        $('#pdtname').closest('h2').after($copy_baidu);
    }
    if (url_weiyun) {
        $('#pdtname').closest('h2').after($copy_weiyun);
    }
})();