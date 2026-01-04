
// ==UserScript==
// @name         MeTruyenChu downloader
// @namespace    
// @description  Tải truyện từ metruyenchu.com định dạng epub.
// @version      1.0.1
// @icon         https://i.imgur.com/ZOmmIGK.png
// @author       
// @oujs:author  
// @license      
// @supportURL   
// @match        http://metruyenchu.com/truyen/*
// @match        https://metruyenchu.com/truyen/*
// @match        http://vtruyen.com/truyen/*
// @match        https://vtruyen.com/truyen/*
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require      https://unpkg.com/jszip@3.2.1/dist/jszip.min.js
// @require      https://unpkg.com/ejs@2.6.1/ejs.min.js
// @require      https://unpkg.com/jepub@2.1.0/dist/jepub.min.js
// @require      https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/mbdownloader@0.2.4/src/mbDownloader.js
// @connect      self
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/449442/MeTruyenChu%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/449442/MeTruyenChu%20downloader.meta.js
// ==/UserScript==
/*global console, location*/
(function ($, window, document) { // eslint-disable-line
    'use strict';
 
    $(document).ready(function() {
        $.widget('nntoan.mbDownloader', $.nntoan.mbDownloader, {
            _create: function () {
                var self = this;
                this._super();
 
                // Capture network requests
                var proxied = window.XMLHttpRequest.prototype.open;
                window.XMLHttpRequest.prototype.open = function () {
                    if (arguments[1].includes('v2/chapters') === true) {
                        self.options.xhr.chapter.url = arguments[1];
                    }
                    return proxied.apply(this, [].slice.call(arguments));
                };
 
                // Extending options
                this.options.processing.ebookFileName = this.options.general.pathname.slice(8, -5);
                this.options.xhr.content.url = this.options.general.pathname + this.options.chapters.chapId + '/';
 
                // Styling download button for current site
                this.elements.$downloadBtn.attr('class', 'btn btn-warning btn-md btn-block text-white font-weight-semibold d-flex align-items-center justify-content-center');
                this.elements.$downloadBtn.html('<i class="nh-icon icon-book mr-2"></i>Tải xuống');
                this.elements.$downloadWrapper = $('<li></li>', {
                    class: 'mr-3 w-150'
                });
                this.elements.$downloadWrapper.html(this.elements.$downloadBtn);
                this.elements.$downloadWrapper.appendTo(this.options.classNames.downloadAppendTo);
                document.getElementById(this.options.classNames.getChapterTrigger).click();
 
                console.time('downloadAndGenerateEpub');
            },
 
            /**
             * Get list of chapters request.
             *
             * @param {Object} that     Curent widget object
             * @param {Event} event     jQuery event
             * @param {Element} $widget Current node element
             * @returns void
             */
            getListOfChapters: function (that, event, $widget) {
                var options = that.options, $ajax = null;
 
                if (options.isGlocCallbackRequired) {
                    $ajax = that._trigger('getListOfChaptersPreprocess', event, that);
                } else {
                    $ajax = $.ajax(options.xhr.chapter);
                }
 
                $ajax.done(function (response) {
                    if (options.isGlocCallbackRequired) {
                        $.ajax(options.xhr.chapter).done(function (data) {
                            that.processListOfChapters(data, that, $widget);
                        }).fail(function (error) {
                            $widget.text('Lỗi trước khi bị lỗi danh mục :)');
                            that.downloadStatus('error');
                            console.error(error); //eslint-disable-line
                        });
                    } else {
                        that.processListOfChapters(response, that, $widget);
                    }
                }).fail(function (error) {
                    $widget.text('Lỗi danh mục');
                    that.downloadStatus('error');
                    console.error(error); //eslint-disable-line
                });
            },
 
            /**
             * Process with the XHR response of chapters list.
             *
             * @param {jqXHR} response  XHR response
             * @param {Object} that     Curent widget object
             * @param {Element} $widget Current node element
             * @returns void
             */
            processListOfChapters: function (response, that, $widget) {
                var options = that.options;
 
                options.chapters.chapList = response._data.chapters;
                options.chapters.chapList = options.chapters.chapList.map(function (val) {
                    return that.chapListValueFilter(options, val);
                }).filter(function (chapter) {
                    return chapter !== '';
                });
 
                that._trigger('chapListFiltered', null, options.chapters.chapList);
 
                that.processing.chapListSize = options.chapters.chapList.length;
                if (that.processing.chapListSize > 0) {
                    that.elements.$window.on('beforeunload', function () {
                        return 'Truyện đang được tải xuống...';
                    });
 
                    $widget.one('click', function (e) {
                        e.preventDefault();
                        that.saveEbook($widget);
                    });
 
                    that.getContent($widget);
                }
            },
 
            /**
             * Callback function to handle chap list values.
             *
             * @param {Object} options
             * @param {String} val
             * @returns {String}
             */
            chapListValueFilter: function (options, val) {
                val = val.slug.replace(options.general.referrer, '');
                val = '/' + val;
 
                return val.trim();
            },
 
            /**
             * Update CSS of download button.
             *
             * @param {String} status Download status
             * @returns void
             */
            downloadStatus: function (status) {
                var self = this,
                    options = this.options;
 
                self.elements.$downloadBtn.removeClass(options.classNames.downloadBtnStatus);
 
                if (status === 'error') {
                    self.elements.$downloadBtn.addClass('btn-danger');
                }
 
                if (status === 'warning') {
                    self.elements.$downloadBtn.addClass('btn-warning');
                }
 
                if (status === 'success') {
                    self.elements.$downloadBtn.addClass('btn-success');
                }
            },
 
            /**
         * Cleanup redundant charactes in chapter content.
         *
         * @param {String} html Chapter content as HTML
         * @returns {String}
         */
            cleanupHtml: function (html) {
                var options = this.options;
 
                html = html.replace(options.regularExp.chapter, '');
                html = html.replace(options.regularExp.novel, '');
                html = html.replace(options.regularExp.chineseSpecialChars, '');
                html = html.replace(options.regularExp.alphanumeric, function (key, attr) {
                    if (attr) return ' ';
                    if (!isNaN(key)) return key;
                    if (key.split(options.regularExp.alphabet).length > 2) return ' ';
                    if (key.split(options.regularExp.number).length > 1) return ' ';
                    return key;
                });
                html = html.replace(options.regularExp.buttons, '');
                html = html.split(this.createRegExp(options.regularExp.eoctext))[0];
                html = html.replace('<br> <br>', '<br />');
 
                return '<div>' + html + '</div>';
            },
        });
 
        $(this).mbDownloader({
            readyToInit: true,
            createDownloadWrapper: true,
            processing: {
                ebookFileExt: '.epub'
            },
            jwt: {
                crypt: 'c&fjFR!WXPDPPmTj*!np2E98TPw5GMN93S43WVZDnR9fcmf@g*RA*Z',
            },
            classNames: {
                novelId: '#report',
                infoBlock: '#app .container',
                chapterContent: '#js-read__content',
                chapterNotContent: 'iframe, script, style, a, div, p:has(a[href*="metruyenchu.com"])',
                chapterVip: '#btnChapterVip',
                chapterTitle: '.nh-read__title',
                ebookTitle: 'h1',
                ebookAuthor: '.row.no-gutters .list-unstyled.mb-4 .border-secondary',
                ebookCover: '.row.no-gutters .nh-thumb.shadow',
                ebookDesc: '#nav-intro .content',
                ebookType: '.row.no-gutters .list-unstyled.mb-4 li .border-primary',
                getChapterTrigger: 'nav-tab-chap',
                downloadBtnStatus: 'btn-primary btn-success btn-info btn-warning btn-danger blue success warning info danger error',
                downloadWrapper: 'mr-3 w-150',
                downloadAppendTo: '.row.no-gutters .list-unstyled.d-flex.align-items-center',
            },
            ebook: {
                fallbackCover: 'https://static.cdnno.com/background/metruyenchu.jpg'
            },
            chapters: {
                chapListSlice: [6, -1],
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
            chapTitleUpdated: function(event, data) {
                var options = data.this.options;
                options.xhr.content.url = location.protocol + '//' + options.general.host + options.chapters.chapId;
            },
            beforeCreateEpub: function(event, that) {
                console.log('Prepare generate epub...');
            },
            complete: function(event, that) {
                console.log('Epub downloaded successfully. Please check your Downloads folder.');
                console.timeEnd('downloadAndGenerateEpub');
            }
        });
    });
})(jQuery, window, document); // eslint-disable-line