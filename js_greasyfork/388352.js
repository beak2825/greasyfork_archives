// ==UserScript==
// @name         BachNgocSach downloader
// @namespace    https://nntoan.com/
// @description  Tải truyện từ bachngocsach.com định dạng epub
// @version      1.0.1
// @icon         http://i.imgur.com/3lomxTC.png
// @author       Toan Nguyen
// @oujs:author  nntoan
// @license      MIT; https://nntoan.mit-license.org/
// @supportURL   https://github.com/nntoan/UserScripts/issues
// @match        http://bachngocsach.com/reader/*
// @match        https://bachngocsach.com/reader/*
// @require      https://unpkg.com/jszip@3.2.1/dist/jszip.min.js
// @require      https://unpkg.com/ejs@2.6.1/ejs.min.js
// @require      https://unpkg.com/jepub@2.1.0/dist/jepub.min.js
// @require      https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/mbdownloader@0.2.4/src/mbDownloader.js
// @connect      self
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/388352/BachNgocSach%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/388352/BachNgocSach%20downloader.meta.js
// ==/UserScript==
/*global console, location*/
(function ($, window, document) {
    'use strict';

    $(document).ready(function () {
        $.widget('nntoan.mbDownloader', $.nntoan.mbDownloader, {
            _create: function () {
                this._super();

                // Extending options
                this.options.processing.ebookFileName = this.options.general.pathname.slice(8);
                this.options.xhr.chapter.url = this.options.xhr.chapter.url + $(this.options.classNames.chapterList).attr('href');
                this.options.xhr.chapter.data = $.extend(this.options.xhr.chapter.data, {
                    page: 'all'
                });

                // Styling download button for current site
                this.elements.$downloadBtn.attr('class', 'truyen-button');
                this.elements.$downloadBtn.css({ 'background': '#f4b759', 'border-color': '#eb813d' });

                console.time('downloadAndGenerateEpub');
            },

            /**
             * Update CSS of download button.
             *
             * @param {String} status Download status
             * @returns void
             */
            downloadStatus: function (status) {
                this._super(status);
                this.elements.$downloadBtn.css({ 'background': '#e05d59', 'color': '#ffffff !important', 'border-color': '#c83e35' });
            },

            /**
             * Callback function to handle chap list values.
             *
             * @param {Object} options
             * @param {String} val
             * @returns {String}
             */
            chapListValueFilter: function (options, val) {
                val = this._super(options, val);
                val = val.replace(location.protocol + '//' + location.host, '');
                if (val.indexOf(location.pathname) === -1) {
                    val = '';
                }

                if (val === location.pathname) {
                    val = '';
                }

                return val.trim();
            },
        });

        $(this).mbDownloader({
            readyToInit: true,
            processing: {
                ebookFileExt: '.epub'
            },
            regularExp: {
                chapter: null
            },
            classNames: {
                novelId: '#login-user',
                infoBlock: '.node-truyen',
                chapterContent: '#noi-dung',
                chapterNotContent: 'iframe, script, style, a, div, p:has(a[href*="bachngocsach.com"])',
                chapterVip: '#btnChapterVip',
                chapterList: '#chuong-list-more',
                chapterTitle: 'h1#chuong-title',
                ebookTitle: 'h1#truyen-title',
                ebookAuthor: 'div#tacgia > a',
                ebookCover: '#anhbia',
                ebookDesc: '#gioithieu',
                ebookType: 'div#theloai a',
                downloadBtnStatus: 'btn-primary btn-success btn-info btn-warning btn-danger blue success warning info danger error',
                downloadAppendTo: 'nav#truyen-nav:last',
            },
            ebook: {
                corsAnywhere: '',
                fallbackCover: 'https://bachngocsach.com/reader/sites/default/files/logo.png'
            },
            chapters: {
                chapListSlice: [6],
            },
            xhr: {
                chapter: {
                    type: 'GET',
                    url: '',
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
