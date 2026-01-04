// ==UserScript==
// @name   机核电台页面增强
// @namespace    https://github.com/silevilence/enhances-g-cores
// @version      1.2.4
// @description  在机核的电台页面上增加（大概）有用的功能
// @author       Silevilence
// @match        http*://www.g-cores.com/volumes/*
// @match        http*://www.g-cores.com/radios/*
// @supportURL   https://github.com/silevilence/enhances-g-cores/issues
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=silevilence@outlook.com&item_name=Greasy+Fork+donation
// @downloadURL https://update.greasyfork.org/scripts/39652/%E6%9C%BA%E6%A0%B8%E7%94%B5%E5%8F%B0%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/39652/%E6%9C%BA%E6%A0%B8%E7%94%B5%E5%8F%B0%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

let img_urls;
(function () {
    'use strict';

    // 首先获取时间轴的图片（在class为audio_dot_img的div下）
    // 根据播放进度有textarea和img的区别，需要全部获取并整合
    // 最后需要加上题图（img.img-responsive）
    let divs = $('div.audio_dot_img');

    // img in textarea
    // noinspection JSValidateTypes
    let textareas = divs.children('textarea');
    // get img urls
    // img标签以文本的方式放在textarea中，取出文本后用引号分割来获取url
    let urls = textareas.map(function () {
        return $(this).text().split(/['"]+/)[1];
    });

    // img in img
    // 已播放前后的图片被解析为img标签，直接获取即可
    // noinspection JSValidateTypes
    let imgs = divs.children('img');
    imgs.each(function () {
        urls.push($(this).attr('src'));
    });

    // 题图
    urls.push($('img.img-responsive').attr('src'));

    // remove _limit in url
    img_urls = $.map(urls, function (value) {
        return value.split('_limit').join('');
    });

    // generate element a and set it to show urls in new tab
    // element a
    let download_link = document.createElement('a');
    // set href to show img urls
    // $(download_link).attr('href', 'javascript:show_img_urls();');
    // $(download_link).click(show_img_urls());
    $(download_link).attr('href', 'javascript:;');
    $(function () {
        $(download_link).click(
            // 链接调用的总方法，点击后在新页面展示所有时间轴图片地址
            // noinspection ES6ConvertVarToLetConst, JSUnusedLocalSymbols
            function () {
                // open new tab and show urls
                // let str = ['<pre>', img_urls.join('\n'), '</pre>'];
                let str_urls = $.map(img_urls, function (url) {
                    return `<a href='${url}' target='_blank'>${url}</a>`;
                });
                let win = window.open(document.URL, '_blank');
                if (!win) {
                    alert('弹出窗口被拦截，请允许该网站弹出窗口。');
                    return;
                }
                // win.document.write(str.join('\n'));
                win.document.write(`<pre>${str_urls.join('<br/>')}</pre>`);
            }
        );
    });
    // set contents of element
    $(download_link).html(`<span class="fa fa-download"></span>
    时间轴图片下载`);
    // append element to div
    $('p.story_actions').append(download_link);
})();