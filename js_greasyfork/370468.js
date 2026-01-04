// ==UserScript==
// @name         知网下载助手（测试版）
// @namespace    wyn665817@163.com
// @version      0.2.0
// @description  解析CNKI论文PDF格式下载地址，支持论文搜索、硕博论文页面，默认替换原链接为pdf格式下载链接，支持导出目录，支持一键切换caj和pdf格式下载链接
// @author       wyn665817
// @match        https://www.cnki.net/
// @include      */DefaultResult/Index*
// @include      */KNS8/AdvSearch*
// @include      */detail.aspx*
// @connect      cnki.net
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/370468/%E7%9F%A5%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B5%8B%E8%AF%95%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/370468/%E7%9F%A5%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E6%B5%8B%E8%AF%95%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery,
url = location.pathname,
i = 0, $btn;

if (!$ || !$('[class$=footer]:contains(中国知网)').length) {
} else if (url.match(/defaultresult\/index$/i) || url.match(/KNS8\/AdvSearch$/i)) {
    $(document).ajaxSuccess(function() {
        if (arguments[2].url.indexOf('/Brief/GetGridTableHtml') + 1) url = $('.downloadlink').attr('href', reUrl);
    });
    $btn = GM_registerMenuCommand('切换CAJ下载链接', change);
} else if (url.match(/detail\.aspx$/) && location.search.match(/dbcode=C[DM][FM]D&/i)) {
    url = $('a:contains(分章下载)').attr('href') || '?';
    url = 'https://chn.oversea.cnki.net/kcms/download.aspx' + url.replace(/%20/g, '').match(/\?.*/)[0];
    GM_xmlhttpRequest({method: 'GET', url: url, onload: done});
    url = $('.operate-btn a').attr('href', function() {
        var tip = $(this).text().trim();
        if (!tip.match(/^分[页章]下载$/)) return tip == '整本下载' ? reUrl.call(this) : this.href;
        tip = this.href.replace(/kns8?(?!\/)/, 'chn.oversea').replace(/%20/g, '').replace(/kcms/, 'kns').replace(/\.aspx/, '');
        return $(this).data('CAJ', this.href).data('PDF', tip + '&cflag=pdf').data('PDF');
    });
    $btn = GM_registerMenuCommand('切换CAJ下载链接', change);
}

function reUrl() {
    return $(this).data('CAJ', this.href).data('PDF', this.href.replace(/&dflag=\w*|$/, '&dflag=pdfdown')).data(i % 2 ? 'CAJ' : 'PDF');
}

function change() {
    var type = ++i % 2 ? ['CAJ', 'PDF'] : ['PDF', 'CAJ'];
    url.attr('href', function() {
        return $(this).data(type[0]) || this.href;
    });
    $('.rootw').prev().find('title').text(type[0] + '链接-中国知网');
    GM_unregisterMenuCommand($btn);
    $btn = GM_registerMenuCommand('切换' + type[1] + '下载链接', change);
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