// ==UserScript==
// @name           知网PDF下载助手
// @version        3.8.12
// @author         Supernova
// @description    提供知网搜索页面的直接PDF下载
// @match          http*://*.cnki.net/*
// @match          http*://*.cnki.net.*/*
// @match          http*://*/kns8s/DefaultResult/*
// @match          http*://*/defaultResult/index*
// @match          http*://*-cnki-net-s.*/*
// @match          http*://*/kns8s/AdvSearch*
// @match          http*://*/kcms/detail/detail.aspx*
// @exclude        http://image.cnki.net/*
// @run-at         document-idle
// @icon           https://cnki.net/favicon.ico
// @grant          unsafeWindow
// @grant          GM_xmlhttpRequest
// @license        MIT
// @namespace https://github.com/supernovaZhangJiaXing/Tampermonkey/
// @downloadURL https://update.greasyfork.org/scripts/390733/%E7%9F%A5%E7%BD%91PDF%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/390733/%E7%9F%A5%E7%BD%91PDF%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

'use strict';
var $ = unsafeWindow.jQuery;

$(document).ready(function() {
    if (window.location.href.indexOf("kns8") != -1) {
        $(document).ajaxSuccess(function(event, xhr, settings) {
            if (settings.url.indexOf('/brief/grid') != -1 || settings.url.indexOf("/Brief/GetGridTableHtml") != -1) {
                $.each($('.downloadlink'), function (index, value) {
                    var pdf_down = $(this).clone().css('background-color', '#FFFFC7').mouseover(function(e){
                        this.title="准备中...";
                    });
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: $(".fz14").eq(index).attr('href'),
                        synchronous: true,
                        headers: {
                            Referer: 'https://kns.cnki.net/kns8s/defaultresult/index',
                            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.68"
                        },
                        redirectionLimit: 10,
                        onload: function(response) {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: response.finalUrl, // 跳转后的最终链接
                                synchronous: true,
                                headers: {
                                    Referer: 'https://kns.cnki.net/kns8s/defaultresult/index',
                                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.68"
                                },
                                onload: function(response){
                                    if ($("#pdfDown", response.responseText).attr('href') != undefined) {
                                        pdf_down.css('background-color', '#C7FFC7').attr('href', $("#pdfDown", response.responseText).attr('href')).mouseover(function(e){
                                            this.title="PDF下载";
                                        });
                                    } else {
                                        if ($(".btn-dlpdf", response.responseText).children("a").attr('href') != undefined) {
                                            pdf_down.css('background-color', '#C7FFC7').attr('href', $(".btn-dlpdf", response.responseText).children("a").attr('href')).mouseover(function(e){
                                                this.title="PDF下载";
                                            });
                                        } else {
                                            pdf_down.css('background-color', '#FFC7C7').attr('href', response.responseURL).mouseover(function(e){
                                                this.title="PDF解析失败";
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });
                    $(this).mouseover(function (e) {
                        this.title="CAJ下载";
                    }).css('background-color', '#C7FFFF').after(pdf_down);
                });
                $('.bulkdownload.export').eq(0).after($('.bulkdownload.export').eq(0).clone().html($('.bulkdownload.export').eq(0).html().replace('下载', 'PDF'))
                                                      .removeClass('bulkdownload').click(function () { // 点击下载按钮后的行为
                    // 获取到勾选的文献, 下载其pdf版
                    for (var i = 0; i < $('input.cbItem').length; i++) {
                        if ($('input.cbItem').eq(i).attr('checked') == 'checked') { // 只针对勾选中的i
                            sleep(1000).then(
                                window.open($('.downloadlink').eq(2 * i + 1).attr('href'))
                            );
                        }
                    }
                    $(this).filenameClear();
                }).css('background-color', '#C7FFC7'));
                $('.bulkdownload.export').eq(0).html($('.bulkdownload.export').eq(0).html().replace('下载', 'CAJ'))
                    .removeClass('bulkdownload').click(function () { // 点击下载按钮后的行为
                    // 获取到勾选的文献, 下载其caj版
                    for (var i = 0; i < $('input.cbItem').length; i++) {
                        if ($('input.cbItem').eq(i).attr('checked') == 'checked') { // 只针对勾选中的i
                            sleep(1000).then(
                                window.open($('.downloadlink').eq(i).attr('href'))
                            );
                        }
                    }
                    $(this).filenameClear();
                }).css('background-color', '#C7FFFF');
            }
            $('th').eq(8).css('width', '14%');
        });
    }
    else {
        GM_xmlhttpRequest({
            method: "GET",
            url: $("#pdfDown").attr("href"),
            synchronous: true,
            headers: {
                Referer: 'https://kns.cnki.net/kns8s/defaultresult/index',
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.68"
            },
            redirectionLimit: 10,
            onload: function(response) {
                $("#pdfDown").attr("href", response.finalUrl);
            }
        });
    }
});

// https://stackoverflow.com/a/951057/7795128
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
