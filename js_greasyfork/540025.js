// ==UserScript==
// @name         TangThuVien downloader
// @namespace    https://nntoan.com/
// @description  Tải truyện từ tangthuvien.vn định dạng epub.
// @version      1.1.4
// @icon         https://i.imgur.com/rt1QT6z.png
// @author       Toan Nguyen
// @oujs:author  nntoan
// @license      MIT; https://nntoan.mit-license.org/
// @supportURL   https://github.com/nntoan/UserScripts/issues
// @match        http://truyen.tangthuvien.vn/doc-truyen/*
// @match        https://truyen.tangthuvien.vn/doc-truyen/*
// @require      https://unpkg.com/jszip@3.2.1/dist/jszip.min.js
// @require      https://unpkg.com/ejs@2.6.1/ejs.min.js
// @require      https://unpkg.com/jepub@2.1.0/dist/jepub.min.js
// @require      https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @connect      self
// @run-at       document-idle
// @noframes
 
/* ==== START OF mbDownloader.min.js ==== */
/**
 * Minified by jsDelivr using Terser v5.19.2.
 * Original file: /gh/nntoan/mbDownloader@0.2.3/src/mbDownloader.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function (e, t) { "use strict"; e.widget("nntoan.mbDownloader", { jepub: null, fileSaver: null, processing: { count: 0, begin: "", end: "", endDownload: !1, beginEnd: "", titleError: [], chapListSize: 0, retryDownload: 0 }, elements: { $window: e(window), $downloadBtn: e("<a>", { class: "btn blue btn-download", href: "javascript:;", text: "Tải xuống" }), $downloadWrapper: e("<div>"), $novelId: null, $infoBlock: null }, options: { errorAlert: !0, readyToInit: !1, createDownloadWrapper: !1, insertMode: "appendTo", credits: '<p>UserScript được viết bởi: UKNOWs</p>', general: { host: location.host, pathname: location.pathname, referrer: location.protocol + "//", pageName: document.title }, processing: { ebookFileName: null, ebookFileExt: ".epub", documentTitle: "[...] Vui lòng chờ trong giây lát" }, regularExp: { chapter: /\s*Chương\s*\d+\s?:.*[^<\n]/g, novel: /\s*Tiểu\s*thuyết\s?:.*[^<\n]/g, chineseSpecialChars: /[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]+/gm, alphanumeric: /\s[a-zA-Z0-9]{6,8}(="")?\s/gm, alphabet: /[A-Z]/, number: /\d+/, buttons: /\([^(]+<button[^/]+<\/button>[^)]*\)\s*/gi, eoctext: ["(ps:|hoan nghênh quảng đại bạn đọc quang lâm|Huyền ảo khoái trí ân cừu)", "i"], breakline: /\n/g, chapList: /(?:href=")[^")]+(?=")/g }, classNames: { novelId: null, infoBlock: null, chapterContent: null, chapterNotContent: null, chapterVip: "#btnChapterVip", chapterTitle: null, ebookTitle: null, ebookAuthor: null, ebookCover: null, ebookDesc: null, ebookType: null, downloadBtnStatus: "btn-primary btn-success btn-info btn-warning btn-danger blue success warning info danger error", downloadAppendTo: null, downloadWrapper: null }, ebook: { title: null, author: null, publisher: location.host, description: null, fallbackCover: null, corsAnywhere: "https://cors-anywhere.herokuapp.com/", tags: [] }, chapters: { chapList: [], chapListSlice: [6, -1], chapId: null, chapTitle: null }, xhr: { chapter: { type: "GET", url: null, data: {} }, content: { type: "GET", url: null, xhrFields: { withCredentials: !0 } }, cover: { mode: "cors" } } }, _create: function () { if (this.elements.$novelId = e(this.options.classNames.novelId), this.elements.$infoBlock = e(this.options.classNames.infoBlock), this.elements.$novelId.length && this.elements.$infoBlock.length) { this.options.general.referrer = this.options.general.referrer + this.options.general.host + this.options.general.pathname, this.options.xhr.content.url = this.options.general.pathname + this.options.chapters.chapId + "/"; var t = this.getBookInfo(); !0 === this.options.readyToInit && (this.jepub = new jEpub, this.jepub.init(t).uuid(this.options.general.referrer)), !0 === this.createDownloadWrapper ? (this.elements.$downloadWrapper.addClass(this.options.classNames.downloadWrapper), this.elements.$downloadWrapper.append(this.options.classNames.downloadAppendTo), this.elements.$downloadBtn.appendTo(this.options.classNames.downloadWrapper)) : this.elements.$downloadBtn.appendTo(this.options.classNames.downloadAppendTo), this.registerEventHandlers(this.elements.$downloadBtn, "dl") } }, getBookInfo: function () { var t = {}, n = this.options, o = this.elements.$infoBlock; n.ebook = e.extend(n.ebook, { title: o.find(n.classNames.ebookTitle).text().trim(), author: o.find(n.classNames.ebookAuthor).find("p").text().trim(), cover: o.find(n.classNames.ebookCover).find("img").attr("src"), description: o.find(n.classNames.ebookDesc).html() }); var r = o.find(n.classNames.ebookType); return r.length && r.each((function () { n.ebook.tags.push(e(this).text().trim()) })), t = e.extend(t, n.ebook), this._trigger("bookInfoUpdated", null, { that: this, epubInfo: t }), t.hasOwnProperty("cover") && delete t.cover, t.hasOwnProperty("fallbackCover") && delete t.fallbackCover, t.hasOwnProperty("corsAnywhere") && delete t.corsAnywhere, t }, updateChapId: function (e) { var t = e.options; t.chapters.chapId = t.chapters.chapList[e.processing.count], t.xhr.content.url = t.general.pathname + t.chapters.chapId + "/", e._trigger("chapIdUpdated", null, e) }, createRegExp: function (e) { if (e.length) return new RegExp(e[0], e[1]) }, registerEventHandlers: function (e, t) { var n = this, o = this.options; "dl" === t && e.one("click contextmenu", (function (t) { t.preventDefault(), document.title = o.processing.documentTitle, n.getListOfChapters(n, t, e) })) }, getListOfChapters: function (t, n, o) { var r = t.options; e.ajax(r.xhr.chapter).done((function (e) { if (r.chapters.chapList = e.match(r.regularExp.chapList), r.chapters.chapList = r.chapters.chapList.map((function (e) { return t.chapListValueFilter(r, e) })).filter((function (e) { return "" !== e })), t._trigger("chapListFiltered", null, r.chapters.chapList), "contextmenu" === n.type) { o.off("click"); var s = prompt("Nhập ID chương truyện bắt đầu tải:", r.chapters.chapList[0]); -1 !== (s = r.chapters.chapList.indexOf(s)) && (r.chapters.chapList = r.chapters.chapList.slice(s)) } else o.off("contextmenu"); t.processing.chapListSize = r.chapters.chapList.length, t.processing.chapListSize > 0 && (t.elements.$window.on("beforeunload", (function () { return "Truyện đang được tải xuống..." })), o.one("click", (function (e) { e.preventDefault(), t.saveEbook(o) })), t.getContent(o)) })).fail((function (e) { o.text("Lỗi danh mục"), t.downloadStatus("error"), console.error(e) })) }, getContent: function (t) { var n = this, o = this.options; !0 !== n.processing.endDownload && (this.updateChapId(n), e.ajax(o.xhr.content).done((function (r) { var s, a = e(r), i = a.find(o.classNames.chapterContent); !0 !== n.processing.endDownload && (n.updateChapterTitle(n, a), s = n.parseChapterContent(n, i, t), n.jepub.add(o.chapters.chapTitle, s), 0 === n.processing.count && (n.processing.begin = o.chapters.chapTitle), n.processing.end = o.chapters.chapTitle, t.html("Đang tải: " + Math.floor(n.processing.count / n.processing.chapListSize * 100) + "%"), n.processing.count++, document.title = "[" + n.processing.count + "] " + o.general.pageName, n.processing.count >= n.processing.chapListSize ? n.saveEbook(t) : n.getContent(t)) })).fail((function (e) { n.downloadError("Kết nối không ổn định", e), 0 === n.processing.retryDownload && n.saveEbook(t) }))) }, updateChapterTitle: function (e, t) { var n = e.options, o = 0; "" !== n.chapters.chapId && null !== (o = n.chapters.chapId.match(n.regularExp.number)) && void 0 !== o[0] && (o = o[0]), n.chapters.chapTitle = t.find(n.classNames.chapterTitle).text().trim(), "" === n.chapters.chapTitle && (n.chapters.chapTitle = "Chương " + o), e._trigger("chapTitleUpdated", null, { this: e, chapNum: o }) }, parseChapterContent: function (e, t, n) { var o, r = e.options, s = t.find(r.classNames.chapterNotContent), a = t.find("[style]").filter((function () { return "1px" === this.style.fontSize || "0px" === this.style.fontSize || "white" === this.style.color })); if (t.length) if (t.find(r.classNames.chapterVip).length) o = e.downloadError("Chương VIP"); else if (t.filter((function () { return -1 !== this.textContent.toLowerCase().indexOf("vui lòng đăng nhập để đọc chương này") })).length) o = e.downloadError("Chương yêu cầu đăng nhập"); else { var i = t.find("img"); i.length && i.replaceWith((function () { return '<br /><a href="' + this.src + '">Click để xem ảnh</a><br />' })), s.length && s.remove(), a.length && a.remove(), "" === t.text().trim() ? o = e.downloadError("Nội dung không có") : (n.hasClass("error") || e.downloadStatus("warning"), o = e.cleanupHtml(t.html())) } else o = e.downloadError("Không có nội dung"); return o }, chapListValueFilter: function (e, t) { return (t = (t = void 0 !== e.chapters.chapListSlice[1] ? t.slice(e.chapters.chapListSlice[0], e.chapters.chapListSlice[1]) : t.slice(e.chapters.chapListSlice[0])).replace(e.general.referrer, "")).trim() }, downloadStatus: function (e) { var t = this.options; this.elements.$downloadBtn.removeClass(t.classNames.downloadBtnStatus).addClass("btn-" + e).addClass(e) }, downloadError: function (e, t, n, o) { var r = this.options; return this.downloadStatus("error"), r.errorAlert && (r.errorAlert = confirm("Lỗi! " + t + "\nBạn có muốn tiếp tục nhận cảnh báo?")), e && console.error(t), !0 === o ? this.processing.retryDownload > 700 ? (this.processing.titleError.push(r.chapters.chapTitle), void this.saveEbook(n)) : (this.downloadStatus("warning"), this.processing.retryDownload += 100, void setTimeout((function () { this.getContent(n) }), this.processing.retryDownload)) : (this.processing.titleError.push(r.chapters.chapTitle), '<p class="no-indent"><a href="' + r.general.referrer + r.chapters.chapId + '">' + t + "</a></p>") }, cleanupHtml: function (e) { var t = this.options; return "<div>" + (e = (e = (e = (e = (e = (e = (e = e.replace(t.regularExp.chapter, "")).replace(t.regularExp.novel, "")).replace(t.regularExp.chineseSpecialChars, "")).replace(t.regularExp.alphanumeric, (function (e, n) { return n || isNaN(e) && (e.split(t.regularExp.alphabet).length > 2 || e.split(t.regularExp.number).length > 1) ? " " : e }))).replace(t.regularExp.buttons, "")).split(this.createRegExp(t.regularExp.eoctext))[0]).replace(t.regularExp.breakline, "<br />")) + "</div>" }, saveEbook: function (e) { var t = this, n = this.options; t.processing.endDownload || (t.processing.endDownload = !0, e.html("Đang nén EPUB..."), t.processing.titleError.length ? t.processing.titleError = '<p class="no-indent"><strong>Các chương lỗi: </strong>' + t.processing.titleError.join(", ") + "</p>" : t.processing.titleError = "", t.processing.beginEnd = '<p class="no-indent">Nội dung từ <strong>' + t.processing.begin + "</strong> đến <strong>" + t.processing.end + "</strong></p>", t.jepub.notes(t.processing.beginEnd + t.processing.titleError + "<br /><br />" + n.credits), t.finaliseEpub(t, e)) }, finaliseEpub: function (e, t) { var n = e.options; e.fetchCoverImage(n.ebook.corsAnywhere + n.ebook.cover, e), e.generateEpub(e, t), e._trigger("complete", null, e) }, fetchCoverImage: function (e, t) { var n = t.options; fetch(e, n.xhr.cover).then((function (e) { if (e.ok) return e.arrayBuffer() })).then((function (e) { t.jepub.cover(e), t._trigger("fetchCoverImage", null, { this: t, image: e }) })).catch((function (o) { console.error(o), e = n.ebook.fallbackCover, t.fetchCoverImage(e, t) })) }, generateEpub: function (e, t) { var n = e.options, o = n.processing.ebookFileName + n.processing.ebookFileExt; e._trigger("beforeCreateEpub", null, e), e.jepub.generate().then((function (r) { document.title = "[⇓] " + n.ebook.title, e.elements.$window.off("beforeunload"), t.attr({ href: window.URL.createObjectURL(r), download: o }).text("✓ Hoàn thành").off("click"), t.hasClass("error") || e.downloadStatus("success"), saveAs(r, o) })).catch((function (t) { e.downloadStatus("error"), console.error(t) })) } }) }(jQuery);
//# sourceMappingURL=/sm/a472e3a3fef1f5b8119d0521301180ae46d65ecc0692468c19d124ff5b00fb29.map
 
/* ==== END OF mbDownloader.min.js ==== */
 
// @downloadURL https://update.greasyfork.org/scripts/540025/TangThuVien%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/540025/TangThuVien%20downloader.meta.js
// ==/UserScript==
/*global console, location*/
(function ($, window, document) { // eslint-disable-line
    'use strict';
 
    $(document).ready(function () {
        $.widget('nntoan.mbDownloader', $.nntoan.mbDownloader, {
            _create: function () {
                var self = this;
                this._super();
 
                // Extending options
                this.options.processing.ebookFileName = this.options.general.pathname.slice(12);
                this.options.xhr.chapter.data = $.extend(this.options.xhr.chapter.data, {
                    story_id: self.elements.$novelId.val()
                });
                this.options.xhr.content.url = this.options.general.pathname + this.options.chapters.chapId + '/';
                this.elements.$downloadBtn.css('margin-top', '10px');
 
                console.time('downloadAndGenerateEpub');
            }
        });
 
        $(this).mbDownloader({
            readyToInit: true,
            processing: {
                ebookFileExt: '.epub'
            },
            classNames: {
                novelId: '#story_id_hidden',
                infoBlock: '.book-detail-wrap',
                chapterContent: '.box-chap:not(.hidden)',
                chapterNotContent: 'iframe, script, style, a, div, p:has(a[href*="truyen.tangthuvien.vn"])',
                chapterVip: '#btnChapterVip',
                chapterTitle: 'h2',
                ebookTitle: 'h1',
                ebookAuthor: '#authorId',
                ebookCover: '#bookImg',
                ebookDesc: '.book-intro',
                ebookType: '.tag-wrap a',
                downloadBtnStatus: 'btn-primary btn-success btn-info btn-warning btn-danger blue success warning info danger error',
                downloadAppendTo: '.book-info p:last-child',
            },
            ebook: {
                fallbackCover: 'https://truyen.tangthuvien.vn/images/default-book.png'
            },
            chapters: {
                chapListSlice: [6, -1],
            },
            xhr: {
                chapter: {
                    type: 'GET',
                    url: '/story/chapters',
                },
                content: {
                    type: 'GET',
                    xhrFields: {
                        withCredentials: true
                    }
                }
            },
            bookInfoUpdated: function (event, data) {
                console.log('Book information updated...', data.epubInfo);
            },
            chapTitleUpdated: function (event, data) {
                console.log('Chapter: ' + data.chapNum + ' downloaded...');
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