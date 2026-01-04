// ==UserScript==
// @name         知网下载助手
// @namespace    wyn665817@163.com
// @version      2.0.2
// @description  解析CNKI论文PDF格式下载地址，支持论文搜索、硕博论文、知网空间、在线阅读页面，默认替换原链接为pdf格式下载链接，支持导出目录，支持一键切换caj和pdf格式下载链接
// @author       wyn665817
// @match        https://www.cnki.net/
// @include      */DefaultResult/Index*
// @include      */KNS8/AdvSearch*
// @include      */detail.aspx*
// @include      */CatalogViewPage.aspx*
// @include      */Article/*
// @connect      cnki.net
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @supportURL   https://greasyfork.org/zh-CN/scripts/371938/feedback
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/371938/%E7%9F%A5%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/371938/%E7%9F%A5%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery,
url = location.pathname,
i = 0, $btn;

if (!$ || !$('[class$=footer]:contains(中国知网)').length) {
} else if (url.match(/defaultresult\/index$/i) || url.match(/KNS8\/AdvSearch$/i)) {
    $(document).ajaxSuccess(function() {
        if (arguments[2].url.indexOf('/Brief/GetGridTableHtml') + 1) url = $('.downloadlink').attr('href', reUrl);
    });
    $btn = GM_registerMenuCommand('切换为CAJ下载链接', change);
} else if (url.match(/detail\.aspx$/) && location.search.match(/dbcode=C[DM][FM]D&/i)) {
    url = $('a:contains(分章下载)').attr('href') || '?';
    url = 'https://chn.oversea.cnki.net/kcms/download.aspx?dflag=catalog&' + url.match(/filename=.+?(&|$)/)[0];
    GM_xmlhttpRequest({method: 'GET', url: url, onload: done});
    url = $('.operate-btn a').attr('href', function() {
        var tip = $(this).text().trim();
        if (!tip.match(/^分[页章]下载$/)) return tip == '整本下载' ? reUrl.call(this) : this.href;
        tip = this.href.replace(/kns8?(?!\/)/, 'gb.oversea');
        if (tip == this.href) return $(this).attr('title', '此镜像网站不支持解析该PDF链接') && tip;
        return $(this).data('CAJ', this.href).data('PDF', tip.replace(/&(.*?)cflag=\w*|$/, '&$1cflag=pdf')).data('PDF');
    });
    $btn = GM_registerMenuCommand('切换为CAJ下载链接', change);
} else if (url.match(/CatalogViewPage\.aspx$/)) {
    $btn = $('#downLoadFile > span').contents().slice(0, 3);
    $btn.eq(0).before($btn.clone()).attr('src', function() {
        return this.src.replace('CAJ', 'PDF');
    }).next().attr('href', reUrl).text('PDF全文下载');
} else if (url.match(/^\/Article\//)) {
    $btn = $('#down_3').attr('id', 'down_1').find('#ty_caj');
    $btn.clone().insertBefore($btn).attr('id', 'ty_pdf').find('a').attr('href', function() {
        return this.href.replace('=caj&', '=pdf&');
    }).text('PDF全文下载');
}

function reUrl() {
    return $(this).data('CAJ', this.href).data('PDF', this.href.replace(/&(.*?)dflag=\w*|$/, '&$1dflag=pdfdown')).data(i % 2 ? 'CAJ' : 'PDF');
}

function change() {
    var type = ++i % 2 ? ['CAJ', 'PDF'] : ['PDF', 'CAJ'];
    url.attr('href', function() {
        return $(this).data(type[0]) || this.href;
    });
    $('.rootw').prev().find('title').text(type[0] + '链接-中国知网');
    GM_unregisterMenuCommand($btn);
    $btn = GM_registerMenuCommand('切换为' + type[1] + '下载链接', change);
}

function done(xhr) {
    var list = $('tr', xhr.responseText).map(function() {
        var $dom = $(this).find('a, td:last');
        return $dom.eq(0).html().trim().replace(/&nbsp;/g, ' ') + '\t' + $dom.eq(1).text().trim().split('-')[0];
    }).get().join('\r\n').replace(/ {4}/g, '\t'),
    blob = new Blob([list]);
    $('<li class="btn-dlpdf"><a href="javascript:void(0);">复制目录</a></li>').prependTo('.operate-btn').click(function() {
        GM_setClipboard(list);
        alert('目录已复制到剪贴板');
    }).toggle(!!list);
    $('<li class="btn-dlcaj"><a>下载目录</a></li>').prependTo('.operate-btn').toggle(!!list).children().each(function() {
        this.download = $('.wx-tit h1').text().trim() + '_目录.txt';
        this.href = URL.createObjectURL(blob);
    }).css('margin-right', '3px');
}