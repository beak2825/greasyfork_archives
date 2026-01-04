// ==UserScript==
// @name         TruyenCuaTui downloader
// @namespace    https://nntoan.com/
// @description  Tải truyện từ truyencuatui.net định dạng epub
// @version      1.0.2
// @icon         https://1.bp.blogspot.com/-dKHpsymtdMY/WWhR69EBgOI/AAAAAAAAA4s/bxIb3L0bFxETn-BR6hOewuzZyPnh9ZfGgCLcBGAs/s1600/truyen-cua-tui-logo.png
// @author       Toan Nguyen
// @oujs:author  nntoan
// @license      MIT; https://nntoan.mit-license.org/
// @supportURL   https://github.com/nntoan/UserScripts/issues
// @match        http://truyencuatui.net/truyen/*
// @match        http://truyencuatui.vn/truyen/*
// @match        https://truyencuatui.net/truyen/*
// @match        https://truyencuatui.vn/truyen/*
// @require      https://unpkg.com/jszip@3.2.1/dist/jszip.min.js
// @require      https://unpkg.com/ejs@2.6.1/ejs.min.js
// @require      https://unpkg.com/jepub@2.1.0/dist/jepub.min.js
// @require      https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/gh/nntoan/mbDownloader@0.2.3/src/mbDownloader.min.js
// @connect      self
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/386212/TruyenCuaTui%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/386212/TruyenCuaTui%20downloader.meta.js
// ==/UserScript==
/*global console, location*/
(function ($, window, document) {
    'use strict';

    $(document).ready(function () {
        $.widget('nntoan.mbDownloader', $.nntoan.mbDownloader, {
            _create: function () {
                this._super();

                // Extending options
                this.options.processing.ebookFileName = this.options.general.pathname.slice(8, -5);
                this.options.xhr.chapter.url = this.options.xhr.chapter.url + $(this.options.classNames.chapterList).data('href') + '.html';
                this.options.xhr.content.url = this.options.general.host + this.options.chapters.chapId;

                // Styling download button for current site
                this.elements.$downloadBtn.attr('class', 'btn btn-lg btn-raised btn-info btn-block btn-downloadepub');

                console.time('downloadAndGenerateEpub');
            },
        });

        $(this).mbDownloader({
            readyToInit: true,
            processing: {
                ebookFileExt: '.epub'
            },
            regularExp: {
                chapter: null,
                eoctext: ['(ps:|hoan nghênh quảng đại bạn đọc quang lâm|Huyền ảo khoái trí ân cừu|truyencuatui .net|truyencuatui)', 'i'],
            },
            classNames: {
                novelId: '#form-report > div.modal-footer > input[type=hidden]:nth-child(2)',
                infoBlock: '.bo-truyen',
                chapterContent: '.chapter-content',
                chapterNotContent: 'iframe, script, style, a, div, p:has(a[href*="truyencuatui.net"])',
                chapterVip: '#btnChapterVip',
                chapterList: '.btn-chapters',
                chapterTitle: 'h1.title > span',
                ebookTitle: 'h1.title',
                ebookAuthor: 'a.list-group-item > span:nth-child(2)',
                ebookCover: '.cover',
                ebookDesc: '.contentt',
                ebookType: 'span.list-group-item:first a',
                downloadBtnStatus: 'btn-primary btn-success btn-info btn-warning btn-danger blue success warning info danger error',
                downloadAppendTo: 'div.jumbotron > div > div.col-md-8 > p:nth-child(6)',
            },
            ebook: {
                fallbackCover: 'https://3.bp.blogspot.com/-g9DNzD8a38g/WWheUmaCjuI/AAAAAAAAA40/K0dd-XV3Dn0UivI2UzcxkYPz7KkVa4-CQCLcBGAs/s1600/cover.jpg'
            },
            chapters: {
                chapListSlice: [6],
            },
            xhr: {
                chapter: {
                    type: 'GET',
                    url: '/chuong/',
                },
                content: {
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    }
                }
            },
            bookInfoUpdated: function (event, data) {
                var that = data.that,
                    options = that.options,
                    $infoBlock = that.elements.$infoBlock;

                options.ebook = $.extend(options.ebook, {
                    title: $infoBlock.find(options.classNames.ebookTitle).text().trim(),
                    author: $infoBlock.find(options.classNames.ebookAuthor).text().trim(),
                    cover: $infoBlock.find(options.classNames.ebookCover).find('img').attr('src'),
                    description: $infoBlock.find(options.classNames.ebookDesc).html(),
                });

                data.epubInfo = $.extend(data.epubInfo, options.ebook);

                console.log('Book information updated...', data.epubInfo);
            },
            chapIdUpdated: function (event, that) {
                var options = that.options;
                options.xhr.content.url = location.protocol + '//' + options.general.host + options.chapters.chapId;
            },
            beforeCreateEpub: function (event, that) {
                console.log('Prepare generate epub...');
            },
            complete: function (event, that) {
                console.log('Epub downloaded successfully. Please check your Downloads folder.');
                console.timeEnd('downloadAndGenerateEpub');
            }
        });
    });
})(jQuery, window, document); // eslint-disable-line
