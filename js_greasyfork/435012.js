// ==UserScript==
// @id             CNKI_PDF_Supernova
// @name           ZhiWang批量下载
// @version        0.0.3
// @author         吃了没文化的亏
// @description    视频教程：https://b23.tv/ADizDQ
// @include        http*://*.cnki.net/*
// @include        http*://*.cnki.net.*/*
// @include        */DefaultResult/Index*
// @include        */defaultresult/index*
// @include        */KNS8/AdvSearch*
// @include        */detail.aspx*
// @include        */CatalogViewPage.aspx*
// @include        */Article/*
// @include        */kns/brief/*
// @include        */kns55/brief/*
// @include        */grid2008/brief/*
// @include        */detail/detail.aspx*
// @exclude        http://image.cnki.net/*
// @run-at         document-idle
// @icon           https://cnki.net/favicon.ico
// @grant          unsafeWindow
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @license        MIT
// @namespace https://github.com/supernovaZhangJiaXing/Tampermonkey/
// @downloadURL https://update.greasyfork.org/scripts/435012/ZhiWang%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435012/ZhiWang%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

'use strict';
var $ = unsafeWindow.jQuery;

$(document).ready(function() {
    var myurl = window.location.href;
    var isDetailPage = myurl.indexOf("detail.aspx") != -1 ? true: false; // 点进文献后的详情页
    var isContentPage = myurl.indexOf("kdoc/download.aspx?") != -1 ? true : false; // 分章下载

    if (isDetailPage === false) {
        // 对应普通检索和高级检索
        if (window.location.href.indexOf("kns8") != -1 || window.location.href.indexOf("KNS8") != -1){
            $(document).ajaxSuccess(function(event, xhr, settings) {
                if (settings.url.indexOf('/Brief/GetGridTableHtml') + 1) {
                    var down_btns = $('.downloadlink');
                    for (var i = 0; i < down_btns.length; i++) {
                        down_btns.eq(i).after(down_btns.eq(i).clone().attr('href', toPDF).css('background-color', '#C7FFC7').mouseover(function(e){
                            this.title="PDF下载";
                        })).css('background-color', '#C7FFFF').mouseover(function(e){
                            this.title="CAJ下载";
                        });
                    }
                    // 在后面新增一个批量下载按钮, 功能为下载pdf格式论文
                    $('.bulkdownload.export').eq(0).after($('.bulkdownload.export').eq(0).clone().html($('.bulkdownload.export').eq(0).html().replace('下载', '下载本页所有PDF'))
                                                          .removeClass('bulkdownload').click(function () { // 点击下载按钮后的行为
                        // 获取到勾选的文献, 下载其pdf版
                        var down_btns = $('.downloadlink');

                        for (var i = 0; i < $('input.cbItem').length; i++) {
                               document.querySelector("#gridTable > table > tbody > tr:nth-child({0}) > td.operat > a:nth-child(2) > i".format(i+1)).click();
                               sleep(5000);
                        }
                        $.filenameClear();
                    }).css('background-color', '#C7FFC7')).css('background-color', '#C7FFFF').html($('.bulkdownload.export').eq(0).html().replace('下载', 'CAJ'))
                }
                $('th').eq(8).css('width', '12%');
            });
        }
    }
    else {
        // 只对"博硕论文"详情页做优化, 否则影响期刊页面的显示
        // 来自: https://greasyfork.org/zh-CN/scripts/371938
        if (location.search.match(/dbcode=C[DM][FM]D&/i)) {
            // 整本下载替换为CAJ下载
            $(".btn-dlcaj").first().html($(".btn-dlcaj").first().html().replace("整本", "CAJ"));
            // pdf文件的url
            var pdf_url = $(".btn-dlpdf").remove().find("a").attr("href").replace("&dflag=downpage", "&dflag=pdfdown");
            // 添加PDF下载
            var pdf_down = $('<li class="btn-dlpdf"><a href=' + pdf_url + ' id="pdfDown" target="_blank" name = "pdfDown"><i></i>PDF下载</a></li>');
            $(".btn-dlcaj").first().after(pdf_down);
            // 从分章下载获取目录的URL
            var content_url = $(".btn-dlcaj:eq(1)").find("a").attr("href") || '?';
            content_url = 'https://chn.oversea.cnki.net/kcms/download.aspx' + content_url.match(/\?.*/)[0];
            GM_xmlhttpRequest({method: 'GET', url: content_url, onload: manage_contents});
            // 右侧添加使用说明
            $(".operate-btn").append($('<li class="btn-phone"><a target="_blank" '
                                       + 'href="https://mp.weixin.qq.com/s?__biz=MzU5MTY4NDUzMg==&mid=2247484384'
                                       + '&idx=1&sn=6a135e824793d26b5bd8884b78c1f751&chksm=fe2a753bc95dfc2d3a5f6'
                                       + '383553fc369894c5021619c85bb7554583bdcb8c10624bf2a7097e1&token=462651491&lang=zh_CN#rd">脚本说明</a></li>'));
            // 右侧底部添加工具下载(PdgContentEditor)
            $(".opts-down").append($('<div class="fl info" style="font-size: 13px; border-left: 1px solid #ddd;"><p class="total-inform" style="margin-left: 3px">'
                                     + '<span><a href="https://pan.baidu.com/s/1VoJlEqPnPN8H6oklAZ0bGQ" target="_blank">点击下载目录合并软件及说明</a><br />提取码: y77f</span>'))
        }
    }
});

// 来自: https://greasyfork.org/zh-CN/scripts/371938
function toPDF() {
    return $(this).data('PDF', this.href.replace(/&dflag=\w*|$/, '&dflag=pdfdown')).data("PDF");
}

function get_content(cnt_list){
    var contents = "";
    for (var i = 0; i < cnt_list.length - 1; i++) { // 长度减一, 因为最后一个是text
        var cnt_item = cnt_list[i].childNodes[1].childNodes[1];
        cnt_item = cnt_item.innerHTML;
        var cnt_page = cnt_list[i].childNodes[3].childNodes[0].textContent.trim().split("-")[0]; // 知网的目录给的是个范围, 正常只需要前半部分
        contents = contents + cnt_item.trim().replace(/&nbsp;/g, " ").replace(/ {4}/g, "\t") + "\t" + cnt_page + "\r\n";
    }
    return contents;
}
// 睡眠
function sleep(delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
        continue;
    }
}
// 来自: https://greasyfork.org/zh-CN/scripts/371938
function manage_contents(xhr) {
    var cnt_list = $('tr', xhr.responseText); // 目录列表
    var contents = get_content(cnt_list); // 目录内容
    // 添加目录复制
    $('.btn-dlpdf').first().after($('<li class="btn-dlpdf"><a href="javascript:void(0);">目录复制</a></li>').click(function() {
        GM_setClipboard(contents); // 运用油猴脚本自带的复制函数
        window.alert('目录已复制到剪贴板');
    }));
    // 添加目录下载
    $('.btn-dlpdf').first().after($('<li class="btn-dlcaj"><a>目录下载</a></li>').click(function() {
        var data = new Blob([contents],{type:"text/plain; charset=UTF-8"});
        $(this).find('a').attr("download", '目录_' + $('.wx-tit h1:first-child()').text().trim() + '.txt');
        $(this).find('a').attr("href", window.URL.createObjectURL(data));
        window.URL.revokeObjectURL(data);
        window.alert("目录索引已保存, 请使用PdgCntEditor软件将目录整合到PDF中");
    }));
}