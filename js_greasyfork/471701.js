// ==UserScript==
// @name         读书小助手
// @name:zh-CN   读书小助手
// @name:zh-TW   读书小助手
// @name:en      Literature mutual helper
// @name:ja      文献相互支援
// @namespace    ucdrs.superlib.net
// @version      1.11.0
// @author       yunteng.m
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAACMuAAAjLgAAAAAAAAAAAAD///////////39///6+v//+/v///39//////////////7+///+/v///////////////////v7///////////////////z8///+/v////////7+////////4uL//0pJ//+wsP///////+np//9wb///vr7///////////////////////9ycf//Jyf//3h4//+np///4uL//+7u//9FRf//Cgn//+7u//+5uf//BQT//wAA//+jo/////////v7////////s7P//xoa//8XF///ISD//w4N//8tLP//f3///yoq//9YWP////////////8zMv//W1v////////7+////Pz///////89PP//hYT////////T0///Bgb//46O//+1tf//Bgb//+jo////////XFz//0tK////////+/v///z8////////ODf//4KB////////7u7//xUU///Pz////v7//w0M//+srP///////2Rk//9CQf////////z8///8/P///////0hI//8MC///NjX//yoq//8BAP//ysr///////8xMf//d3f///////9ubv//OTj////////8/P///Pz///////8+Pf//YWD//9nZ//+4t///Dg3//8fH////////VlX//1JS////////eHj//zEw/////////f3///z8////////Ojn//4SD////////7u7//xQT///Gxv///////29v//88O////////4GA//8qKf////////39///8/P///////0VF//8jIv//Y2L//1JR//8FBP//ysn///////+Fhf//Ly7///////+Skf//Jib////////+/v///Pz///////9CQv//PDv//5KS//95ef//Dw7//7Gx//9HRv//IyP//xEQ//9xcf//Ozr//yQk//////////////z8////////PDz//4aG////////7u7//xsa//+5uf//jY3//zw7//8NDP//ZWX//1VU//9vb////f3////////8/P///////0JC//85OP//j4///3h3//8HBv//x8f///////+NjP//Hx///////////////////////////////f3///////+Ghv//TEz//1NS//9TUv//VFP//9XV////////gYH//wAA///o6P////////v7///////////////////////////////////////////////////9/f///////7u7//+Ojv//6+v////////+/v////////////////////////39///7+///+/v///v7///7+////v7/////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @match        *://book.ucdrs.superlib.net/views/specific/*
// @match        *://book.ucdrs.superlib.net/search*
// @match        *://book.dglib.superlib.net/views/specific/*
// @match        *://book.dglib.superlib.net/search*
// @match        *://search.douban.com/book/subject_search*
// @match        *://book.douban.com/isbn/*
// @match        *://book.douban.com/subject_search*
// @match        *://book.douban.com/tag/*
// @match        *://book.douban.com/subject/*
// @match        *://book.douban.com/series/*
// @match        *://book.douban.com/works/*
// @match        *://book.douban.com/producers/*
// @match        *://book.douban.com/press/*
// @match        *://book.douban.com/author/*/books*
// @match        *://book.douban.com/people/*/wish*
// @match        *://book.douban.com/people/*/do*
// @match        *://book.douban.com/people/*/collect*
// @match        *://www.douban.com/doulist/*
// @match        *://book.douban.com/cart*
// @match        *://cadal.edu.cn/cadalinfo/search*
// @match        *://cadal.edu.cn/cardpage/bookCardPage?*ssno=*
// @match        *://fx.ccelib.com/detail_*
// @match        *://fx.ccelib.com/s?*
// @match        *://www.ncpssd.org/Literature/ancientbooklist.aspx*
// @match        *://www.ncpssd.org/Literature/articleinfo.aspx*
// @match        *://www.digital.archives.go.jp/DAS/meta/*
// @match        *://www.digital.archives.go.jp/file/*.html
// @match        *://e.jd.com/*.html*
// @match        *://item.jd.com/*.html*
// @match        *://e.dangdang.com/products/*.html*
// @match        *://product.dangdang.com/*.html*
// @match        *://read.douban.com/ebook/*/*
// @match        *://www.dedao.cn/ebook/detail?*
// @match        *://www.bookschina.com/*
// @match        *://citic.cmread.com/zxHtml/html/paperBookDetailShare.html?*
// @match        *://www.kongfz.com/publisher/*/*
// @match        *://www.kongfz.com/writer/*/*
// @match        *://shop.kongfz.com/*
// @match        *://book.kongfz.com/*/*/*
// @match        *://book.kongfz.com/C*/*
// @match        *://item.kongfz.com/*
// @match        *://search.kongfz.com/product_result/?*
// @match        *://search.kongfz.com/item_result/?*
// @match        */n/slib/book/slib/*
// @match        */n/jpgfs/book/base/*
// @require      https://greasyfork.org/scripts/450973-gb2312utf8/code/GB2312UTF8.js?version=1091107
// @require      https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @include      */search?*
// @include      *bookDetail.jsp?*
// @include      *chapter.jsp?*
// @include      *book.do?*
// @exclude      *://*.google./*
// @exclude      *://*.bing./*
// @description  读书小助手，直接下载 pdf 的工具。
// @description:zh-CN  读书小助手，直接下载 pdf 的工具。
// @description:zh-tw 读书小助手，直接下载 pdf 的工具。
// @description:en   Literature mutual helper, download pdf directly.
// @description:ja  文献相互支援、直接pdfダウンロードツール。
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @license     Copyright Theron
// @downloadURL https://update.greasyfork.org/scripts/471701/%E8%AF%BB%E4%B9%A6%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471701/%E8%AF%BB%E4%B9%A6%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/* jslint esversion: 6 */
/*globals jQuery, GB2312UTF8, JSZip, saveAs */


(function () {
        'use strict';
        // 基本上设置。
        var apiHost = "https://lib.douban-helper.me";


        function getId(input, regex) {
            if(!input || !regex)return null;
            const match = input.match(regex);
            return match ? match[1] : null;
        }

        const documentUrl = document.URL;
        const dxUsername = jQuery('script[src*="username="]');
        const userId = typeof _GLOBAL_NAV != 'undefined' ? "db_" + _GLOBAL_NAV.USER_ID :
            (dxUsername.length ?
                "dx_" + getId(dxUsername.attr('src'), /username=([^&]*)/i) :
                "");
        const downloadLnk = function (id, type) {
            return jQuery("<a href='" + apiHost + "/book/download?userId=" + userId + "&type=" + type + "&id=" + id + "' target='_blank' class='bnt_book leftF'>点击去下载</a>");
        }


        // 第一步：首先通过各种方式获取dxid 或者 isbn
        let dxid = {}, isbn = {};
        jQuery(".book1, .books").each(function (i, book) {
            const href = jQuery('a[href*="dxNumber"]', book).attr("href");
            dxid[getId(href, /dxNumber=(\d+)/i)] = true;
        });
        let dxidFromUrl = getId(documentUrl, /dxNumber=(\d+)/i);
        if (dxidFromUrl) {
            dxid[dxidFromUrl] = true;
        }

        let isbnFromInfo = getId(jQuery("#info").text().replace(/\s+/g, ''), /ISBN[:|：]([0-9]+)/i);
        if (isbnFromInfo) {
            isbn[isbnFromInfo] = true;
        }

        isbn = Object.keys(isbn);
        dxid = Object.keys(dxid);
        if (isbn.length === 0 && dxid.length === 0) {
            console.log("没有找到 isbn 和 dxid");
            return;
        }
        console.log("isbn: " + isbn);
        console.log("dxid: " + dxid);

        // 第二步，根据 id 查看这本书是否存在
        jQuery.ajax({
            url: apiHost + "/book/jsonp/check?userId=" + userId,
            jsonp: "callback",
            dataType: "jsonp",
            data: {
                id: dxid.length ? dxid.join() : isbn.join(),
                format: "json",
                type: dxid.length ? "dxid" : "isbn"
            },
            fail: function (response) {
                console.log("jsonp request failed " + response);
            },
            success: successRender
        });

        // 第三步，跟进返回的 id是否存在，开始渲染。
        function successRender(response) {
            console.log("jsonP 已经返回了");
            console.log(response);

            if ((isbn.length === 1 || dxid.length === 1)) {
                //     详情页
                console.log("详情页");

                if (jQuery(".bnt_content").length) {
                    //   book.duxiu.com
                    var html =
                        response.indexOf(dxid[0]) !== -1
                            ? downloadLnk(dxid[0], "dxid").attr('class', 'bnt_book leftF')
                            : "<a class='bnt_book leftF' style='color:gray' href='javascript:alert(\"查无此书，点了也白点\")'>查无此书</a>";
                    jQuery(".bnt_content").append(html);
                } else if (jQuery(".tubookimg").length) {
                    // superlib
                    var html =
                        response.indexOf(dxid[0]) !== -1
                            ? downloadLnk(dxid[0], "dxid").attr('style', 'width:100%; display: block;text-align: center')
                            : "<div style='text-align: center'>查无此书</div>";
                    jQuery(".tubookimg").append(html);
                } else if (jQuery("#info").length) {
                    //    douban
                    const html =
                        response.indexOf(isbn[0]) !== -1
                            ? downloadLnk(isbn[0], "isbn")
                            : "查无此书";
                    jQuery("#info").append(jQuery("<span></span>").append('<span class="pl">查询结果</span>: ').append(html).append('<br>'));
                }
            } else {
                //     列表页
                jQuery(".book1").each(function (i, book) {
                    var href = jQuery("#bb a.px14", book).attr("href");

                    if (href) {
                        var urlParams = new URLSearchParams(href.split("?")[1]);
                        var dxNumber = urlParams.get("dxNumber");
                        var html =
                            response.indexOf(dxNumber) != -1
                                ? downloadLnk(dxNumber, "dxid")
                                : "查无此书";
                        var ele = jQuery("table a.px14", book);
                        ele.after(" ").after(html).after(" | ");
                    }
                });


                jQuery(".books").each(function (i, book) {
                    var dxNumber;
                    jQuery("a", book).each(function(i,a){
                        var href = jQuery(a).attr("href");
                        var dxNumber2 = getId(href, /dxid=(\d+)/i) || getId(href, /dxNumber=(\d+)/i);
                        if(dxNumber2){
                           dxNumber=dxNumber2;
                           return ;
                        }
                    })
                    if (dxNumber) {
                        var html =
                            response.indexOf(dxNumber) !== -1
                                ? downloadLnk(dxNumber, "dxid").attr('class', 'bnt_book leftF')
                                : "<a class='bnt_book leftF' style='color: gray' href='#'>查无此书</a>";
                        var ele = jQuery(".bottom_bar a.bnt_book", book).last();
                        
                        if(ele.length==0){
                            ele = jQuery(".bottom_bar div", book).first();
                        }
                        
                        ele.after(html);
                    }
                });

            }

        }

    }
)
();


