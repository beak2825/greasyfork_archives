// ==UserScript==
// @name               Z-Library ui enhance
// @name:zh-CN         Z-Library 增强脚本
// @name:en            Z-Library UI Enhance
// @namespace          out
// @version            2026.1.13
// @description        改善 Zlibray 页面功能的油猴脚本
// @description:zh-CN  给 Z-Library 一个更友好的使用体验
// @description:en     give Z-Library  a more user friendly experience
// @author             blue-bird
// @match              https://*.z-library.sk/*
// @match              https://*.z-lib.fm/*
// @match              https://*.z-lib.gs/book/*
// @match              https://*.z-lib.gs/booklist/*
// @match              https://*.z-lib.gs/
// @match              https://*.z-lib.gs/s/*
// @match              https://*.z-lib.gs/users/downloads
// @match              https://*.z-lib.gs/users/zrecommended*
// @match              https://*.1lib.sk/book/*
// @match              https://*.1lib.sk/booklist/*
// @match              https://*.1lib.sk/
// @match              https://*.1lib.sk/s/*
// @match              https://*.1lib.sk/users/downloads
// @match              https://*.1lib.sk/users/zrecommended*
// @match              https://*.z-lib.gd/*
// @match              https://*.z-lib.gl/*
// @match              https://*.z-library.mn/* 
// @run-at             document-end
// @icon               https://www.google.com/s2/favicons?sz=64&domain=1lib.sk
// @grant              GM_xmlhttpRequest
// @grant              GM_addStyle
// @grant              unsafeWindow
// @grant              GM_openInTab
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_download
// @grant              GM_registerMenuCommand
// @connect            book.douban.com
// @connect            doubanio.com
// @downloadURL https://update.greasyfork.org/scripts/497146/Z-Library%20ui%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/497146/Z-Library%20ui%20enhance.meta.js
// ==/UserScript==

/* global $,ZLibraryNotify, i18next, ZLibraryResponse,CurrentBook,CurrentUser,ZLibrarySpinner, ZLibrary, ZLibraryContextMenu, isValidInputString, UserBookmarks, ZLibraryMultiselect*/

(function () {
    'use strict';

    async function getDocAsync(url) {
        function page_parser(responseText) {
            return (new DOMParser()).parseFromString(responseText, 'text/html');
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (responseDetail) {
                    if (responseDetail.status === 200) {
                        let doc = page_parser(responseDetail.responseText);
                        resolve({ doc, responseDetail });
                    } else {
                        reject(new Error('Request failed'));
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    function downloadFile(url, name, onSuccess, onError, onprogress, ontimeout) {
        GM_download({
            url: url, // 下载的文件 URL
            name: name, // 从 URL 中提取文件名
            downloadMode: "browser",
            onload: function () {
                if (onSuccess) onSuccess(); // 调用成功回调
            },
            onerror: function (error) {
                if (onError) onError(error); // 调用失败回调
            },
            ontimeout: function () {
                if (ontimeout) ontimeout();
            },
            onprogress: function (event) {
                if (onprogress) onprogress(event);
            }
        });
    }


    function set_field_value(name, value) {
        if (value === "" || value == null) {
            return
        }
        $('#formBookEdit input, #formBookEdit textarea').each(function (index, el) {

            if (name === 'description' && el.name === name) {
                $('#description').trumbowyg('html', value);
                return
            }
            if (el.name === name) {
                $(el).val(value).change()
                $(el).trigger('input')
            }
        })
    }

    async function fetchMeatByIsbnByDouban(isbn) {
        function urlToFile(url) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: function (response) {
                        const contentType = response.responseHeaders.match(/content-type:\s*(.+)/i)[1];
                        const filename = url.substring(url.lastIndexOf("/") + 1);
                        const mimeType = contentType.split(";")[0];

                        const blob = new Blob([response.response], { type: mimeType });
                        const file = new File([blob], filename, { type: mimeType });

                        resolve(file);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            })
        }

        const url = `https://book.douban.com/isbn/${isbn}`
        try {
            const { doc } = await getDocAsync(url)
            const html = $('#info', doc).html().replace(/\s*/g, '').replace(/<(?!br).*?>/g, "").split("<br>");

            const formattedData = html.filter(item => item !== "").reduce((obj, item) => {
                const keyValue = item.split(":");
                const key = keyValue[0];
                obj[key] = keyValue[1];
                return obj;
            }, {});
            if ($("#formBookCover").length === 0) {
                const coverurl = $(".nbg", doc).attr("href")
                // 排除无封面的书籍
                if (!coverurl.endsWith("update_image")) {
                    const imgFile = await urlToFile(coverurl)
                    CurrentBook.suggestCover(imgFile)
                }
            }

            set_field_value("pages", formattedData['页数'])
            set_field_value("author", formattedData['作者'])
            set_field_value("publisher", formattedData['出版社'])
            if (formattedData && formattedData['丛书']) {
                set_field_value("series", formattedData['丛书'].replace("&nbsp;", ""));
            }
            const year = formattedData['出版年'] ? formattedData['出版年'].split("-")[0] : null
            set_field_value("year", year)
            let desc = $('#link-report > div > div', doc).text()
            if (desc === '') {
                desc = $('#link-report > span.all.hidden > div > div', doc).text()
            }
            set_field_value("description", desc.replace(/\s*/, ''))


        } catch (e) {
            console.log(e)
            send_error_msg("豆瓣无此isbn书籍")
        }
    }


    /**
     * Get the daily downloaded count for a user.
     *
     * @return {number} the daily downloaded count for the user
     */
    function get_user_remain_daily_downloaded_count() {
        let text = $('.user-card > div.caret-scroll > div:nth-child(1) > div:nth-child(2) > div.caret-scroll__title').text()

        let match = text.match(/(\d+)\s*\/\s*(\d+)/);

        if (match) {
            let firstNumber = match[1]; // 获取第一个数字
            let secondNumber = match[2]; // 获取第二个数字
            return parseInt(secondNumber) - parseInt(firstNumber)
        } else {
            throw new Error('cannot get daily downloaded count');
        }
    }

    function user_is_premium() {
        return $('.profile-header__status--premium').length > 0
    }


    function send_error_msg(msg, params = {}) {
        new ZLibraryNotify().error(i18next.t(msg, params))
    }

    function send_ok_msg(msg, params = {}) {
        new ZLibraryNotify().success(i18next.t(msg, params))
    }

    function send_info_notify(msg, params = {}) {
        new ZLibraryNotify().info(i18next.t(msg, params))
    }

    // use i18next to translate
    // i18next add resource
    function add_resource() {
        i18next.addResourceBundle('en', "translation", {
            "开始查找在线阅读地址": "Start finding online reading address",
            "下载完成": "Download completed",
            "复制书单完成": "Copy booklist completed",
            "举报成功": "Report success",
            "load success": "load success",
            "save success": "save success",
            "清除完成": "Clear completed",
            "添加白名单成功": "Add whitelist success",
            "开始复制书单": "Start copying booklist",
            "start_download_with_title": "Start downloading {{title}}",
            "need set download whitelist": "Please set the download file format whitelist in Tampermonkey first, otherwise only pdf can be downloaded",
            "start_copy_booklist_page": "Start copying booklist {{page}} page",
            "copy_book_to_booklist_error": "Copy book to booklist error {{error}}",
            "download_book_error": "Download book error {{error}}",
            "今日下载次数已用完": "Today's download times have been used up",
            "下载书籍超时错误": "Download book timeout error",
            "download_mode_not_supported": "Download mode not supported, please check your download mode setting, it should be set to 'brower API'",
            "download mode warning": "Download mode warning",
            "filter_recommend": "Filter recommend enable",
            "lock_search": "Lock search Exact Matching enable",
            "Settings Page": "Script Settings",
            "download_number": "download count",
            "skip_downloaded": "skip downloaded book",
            "start download": " start download",
            "download_number_big": "download count too big",
            "auto_close_notify": "auto close notify",

        })
        i18next.addResourceBundle('zh', "translation", {
            "need set download whitelist": "请先设置油猴下载文件格式白名单，否则只能下载pdf格式",
            "load success": "载入成功",
            "save success": "保存成功",
            "start_copy_booklist_page": "开始复制书单第{{page}}页",
            "start_download_with_title": "开始下载{{title}}",
            "copy_book_to_booklist_error": "复制书籍到书单失败 原因：{{error}}",
            "download_book_error": "下载书籍出现错误：{{error}}",
            "download mode warning": "下载模式错误",
            "download_mode_not_supported": "当前下载模式存在问题，请检查油猴脚本的下载模式设置，它应该设置为'浏览器 API'",
            "今日下载次数已用完": "今日下载次数已用完",
            "下载书籍超时错误": "下载书籍超时错误",
            "复制书单完成": "复制书单完成",
            "开始查找在线阅读地址": "开始查找在线阅读地址",
            "下载完成": "下载完成",
            "举报成功": "举报成功",
            "清除完成": "清除完成",
            "添加白名单成功": "添加白名单成功",
            "开始复制书单": "开始复制书单",
            "copy booklist": "复制书单",
            "batch download": "批量下载",
            "filter_recommend": "启用推荐过滤",
            "lock_search": "锁定精准搜索",
            "Settings Page": "脚本设置",
            "download_number": "下载数量",
            "skip_downloaded": "跳过已下载书籍",
            "start download": "开始下载",
            "download_number_big": "下载数量超过了今日剩余下载次数",
            "auto_close_notify": "自动关闭通知",
            "collapse_same_isbn": "折叠相同isbn书籍",
        })
    }

    add_resource()


    let currentUrl = window.location.href;
    const testUrl = new URL(currentUrl)

    function get_bookId() {
        return testUrl.pathname.split("/")[2]
    }


    const config_key = "config"
    const lock_search_key = "lock_search"
    const filter_recommend_key = "filter_recommend"
    const auto_close_notify = "auto_close_notify"
    // 折叠相同isbn书籍
    const collapse_same_isbn = "collapse_same_isbn"
    let setting = GM_getValue(config_key, {})

    const enable_filter_recom = setting[filter_recommend_key] ?? true
    const enable_lock_search = setting[lock_search_key] ?? true
    const enable_auto_close_notice = setting[auto_close_notify] ?? false
    const enable_collapse_same_isbn = setting[collapse_same_isbn] ?? false



    function checkDownloadedStatus() {
        // 遍历每个元素
        if (!enable_filter_recom) {
            return
        }
        let zCoverList = $('z-cover')
        zCoverList.each(function () {
            // 检查元素的this.downloaded属性
            if ((this.downloaded || ZLibrary.checkIsDownloaded(this.id, this.isbn)) && !this.markButton && this.id !== get_bookId()) {
                // 如果this.downloaded为true，则隐藏该元素
                // check is z-carousel elemet <z-carousel  
                if ($(this).parent().parent().prop('tagName') === 'Z-CAROUSEL') {
                    return
                }
                $(this).parent().parent().remove()
            }
        });
    }

    function checkDownloadedStatusInRecommend() {
        if (!enable_filter_recom) {
            return
        }

        function getReactFiber(domElement) {
            // React 内部属性的常见前缀（覆盖不同版本）
            const fiberPrefixes = ['__reactFiber$', '__reactInternalInstance$'];

            // 遍历元素的所有属性，匹配前缀
            for (const propName of Object.keys(domElement)) {
                for (const prefix of fiberPrefixes) {
                    if (propName.startsWith(prefix)) {
                        // 找到匹配的属性，返回其值（即 Fiber 节点）
                        return domElement[propName];
                    }
                }
            }
            return null;
        }

        // 获取当前 div 的 Fiber 节点
        const currentFiber = getReactFiber(document.querySelector("[class*='RecommendationBlock__Masonry']"));
        const parentFiber = currentFiber.return;
        const grandparentFiber = parentFiber.return;
        let stateNode = grandparentFiber.memoizedState;

        let booklist = stateNode.memoizedState;

        // hook dispatch
        const originalDispatch = stateNode.queue.dispatch

        stateNode.queue.dispatch = function (booklist) {
            console.debug("hook dispatch")
            console.debug(booklist)
            const filteredBookList = booklist.filter(function (book) {
                return !ZLibrary.checkIsDownloaded(book.id, book.isbn);
            });
            console.debug("filteredBookList", filteredBookList)
            originalDispatch.call(this, filteredBookList)
        }
        // check have update
        if (filteredBookList.length === booklist.length) {
            return
        }

        stateNode.queue.dispatch(filteredBookList)
    }


    function createObserver(func) {
        const observer = new MutationObserver(function (mutationsList) {
            // 遍历每个变动
            for (let mutation of mutationsList) {
                // 检查是否有新节点插入
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 遍历新插入的节点
                    for (let node of mutation.addedNodes) {
                        // 检查是否是目标元素
                        func(node)
                    }
                }
            }
        });
        observer.observe(document, {
            childList: true, subtree: true, attributes: false
            , characterData: false
        });
        return observer
    }

    const waitForEl = function (selector, callback) {
        if ($(selector).length) {
            callback();
        } else {
            setTimeout(function () {
                waitForEl(selector, callback);
            }, 100);
        }
    };

    function getUserLanguage() {
        return i18next.language;
    }

    const userLanguage = getUserLanguage();

    function translate(msg, arg) {
        return i18next.t(msg, arg);
    }

    function booklistPageExec() {
        function getCurBooklistid() {
            return testUrl.pathname.split("/")[2]
        }

        const CurBooklistid = getCurBooklistid()
        let user_daily_downloaded_count = get_user_remain_daily_downloaded_count()
        waitForEl('div.booklist-main.active > div.booklist-searchline > z-dropdown',
            function () {

                const header = $('div.booklist-main.active > div.booklist-searchline > z-dropdown')
                if (userLanguage === "zh") {
                    header.after(
                        `<div class="clear"></div> <div id="wrapLang" class="mr-4"></div>`
                    )

                    let observer = null

                    function switchLang(items) {
                        // check is array and not null
                        if (observer instanceof MutationObserver) {
                            observer.disconnect()
                        }
                        // 遍历数组并获取每个对象的 value
                        const values = items.map(item => {
                            return item.value;
                        });
                        if (values.length === 0) {
                            return
                        }
                        let value = values[0]
                        $("z-bookcard").each(function () {
                            const lang = $(this).attr('language')
                            if (lang !== value && lang !== "") {
                                $(this).remove()
                            }
                        });
                        observer = createObserver(function (node) {
                            if ($(node).prop('tagName') === 'Z-BOOKCARD') {
                                const lang = $(node).attr('language')
                                if (lang !== value && lang !== "") {
                                    $(node).remove()
                                }
                            }
                        })
                    }


                    const multiSelectInit = function () {
                        new ZLibraryMultiselect({
                            wrapSelector: '#wrapLang',
                            useTargetSelect: true,
                            enableFooter: false,
                            valuesName: 'languages',
                            placeholder: '选择语言',
                            textForNone: '任何语言',
                            enableNone: true,
                            rowData: {
                                items: [{ "text": "阿拉伯语", "value": "arabic" }, {
                                    "text": "亚美尼亚语",
                                    "value": "armenian"
                                }, { "text": "阿塞拜疆语", "value": "azerbaijani" }, {
                                    "text": "孟加拉语",
                                    "value": "bengali"
                                }, { "text": "中文", "value": "chinese" }, {
                                    "text": "荷兰语",
                                    "value": "dutch"
                                }, { "text": "英语", "value": "english" }, {
                                    "text": "法语",
                                    "value": "french"
                                }, { "text": "格鲁吉亚语", "value": "georgian" }, {
                                    "text": "德语",
                                    "value": "german"
                                }, { "text": "希腊语", "value": "greek" }, {
                                    "text": "印地语",
                                    "value": "hindi"
                                }, { "text": "印度尼西亚语", "value": "indonesian" }, {
                                    "text": "意大利语",
                                    "value": "italian"
                                }, { "text": "日语", "value": "japanese" }, {
                                    "text": "韩语",
                                    "value": "korean"
                                }, { "text": "马来西亚语", "value": "malaysian" }, {
                                    "text": "普什图语",
                                    "value": "pashto"
                                }, { "text": "波兰语", "value": "polish" }, {
                                    "text": "葡萄牙语",
                                    "value": "portuguese"
                                }, { "text": "俄语", "value": "russian" }, {
                                    "text": "塞尔维亚语",
                                    "value": "serbian"
                                }, { "text": "西班牙语", "value": "spanish" }, {
                                    "text": "泰卢固语",
                                    "value": "telugu"
                                }, { "text": "泰语", "value": "thai" }, {
                                    "text": "繁体字",
                                    "value": "traditional chinese"
                                }, { "text": "土耳其语", "value": "turkish" }, {
                                    "text": "乌克兰语",
                                    "value": "ukrainian"
                                }, { "text": "乌拉都语", "value": "urdu" }, { "text": "越南语", "value": "vietnamese" }],
                                selected: [],
                            },
                            handlers: {
                                onChange: switchLang
                            }
                        }
                        )
                    }
                    multiSelectInit()
                }
                let listHeader = $(".booklist-header__options");
                listHeader.prepend(`<div><a  class="btn btn-primary" href="javascript://" style="
                                                margin-right: 6px; 
                                                position: relative;
                                                top: 3px;"
                                     id="plugin_copy_booklist">${translate("copy booklist")}</a></div>`)
                $("#plugin_copy_booklist").on("click", function (readListCopyClickEvent) {
                    readListCopyClickEvent.preventDefault()
                    let x = readListCopyClickEvent.pageX
                    let y = readListCopyClickEvent.pageY
                    if (readListCopyClickEvent.type === 'click') {
                        x = readListCopyClickEvent.target.getBoundingClientRect().x;
                        y = readListCopyClickEvent.target.getBoundingClientRect().y + readListCopyClickEvent.target.getBoundingClientRect().height + window.scrollY;
                    }
                    new ZLibraryResponse(`/papi/booklist/current-user/`)
                        .success(function (json) {
                            const transformedList = json.list.map(item => ({
                                text: item.title,
                                onClick: () => {
                                    const id = item.id; // 使用 item.id
                                    let loadCount = 1;
                                    let userBookmarks = new UserBookmarks(CurrentUser.id);

                                    function loadBooks(loadCount) {
                                        send_info_notify("start_copy_booklist_page", { page: loadCount })
                                        new ZLibraryResponse(new Request('/papi/booklist/' + CurBooklistid + '/get-books/' + loadCount + '?order=date_savedA', {
                                            method: 'POST'
                                        }))
                                            .success(function (json) {
                                                json.books.forEach(item => {
                                                    //   if (!ZLibrary.checkIsDownloaded(item.book_id, item.book.isbn)) {
                                                    userBookmarks.addBookToBooklist({
                                                        bookId: item.book_id,
                                                        booklistId: id,
                                                    }).catch(error => {
                                                        send_error_msg("copy_book_to_booklist_error", { error: error })
                                                    });
                                                    //  }
                                                });
                                                // Check if there are more books to load
                                                if (json.pagination.next) {
                                                    setTimeout(loadBooks, 1000, json.pagination.next);
                                                } else {
                                                    send_ok_msg("复制书单完成")
                                                }
                                            })
                                            .fetch();
                                    }

                                    send_info_notify("开始复制书单")

                                    try {
                                        loadBooks(loadCount); // Initial call
                                    } catch (error) {
                                        send_error_msg("copy_book_to_booklist_error", { error: error })
                                        console.error(error);
                                    }

                                }
                            }));

                            ZLibraryContextMenu({
                                x, y,
                                list: transformedList
                            });
                        })
                        .fetch();
                })


                listHeader.prepend(`<div><a  class="btn btn-primary" href="javascript://" style="
                                                margin-right: 6px; 
                                                position: relative;
                                                top: 3px;"
                                     id="plugin_download_booklist">${translate("batch download")}</a></div>`)

                $("#plugin_download_booklist").on("click", function (downloadClickEvent) {

                    downloadClickEvent.preventDefault()
                    if (user_daily_downloaded_count <= 0) {
                        send_error_msg("今日下载次数已用完")
                        return
                    }

                    if ((GM_info.downloadMode === "native" || GM_info.downloadMode === "disabled") && GM_info.scriptHandler !== "ScriptCat") {
                        send_error_msg(translate("download_mode_not_supported"))
                        // const confirm = new ZLibraryConfirm(translate("download mode warning"),translate("download_mode_not_supported"))
                        // confirm.positive(() => {
                        //     downloadBookLists(loadCount)
                        // })
                        // confirm.show()
                        return;
                    }

                    if ($("#ZUE-download-modal").length === 0) {
                        $("body").append(`
                    <div id="ZUE-download-modal" class="hidden">
<form onsubmit="return false;" id="formSetting" class="form-horizontal">
    <div class="download-book-container">
        <div class="row" style="margin-bottom: 18px;">
         <div class="form-group">

            <label class="control-label col-sm-4">
                ${translate("download_number")} 
            </label>
            <div class="col-sm-2">
                <input type="number" min="1" class="form-control" name="download_number" id="download_number" value="10">
            </div>

          </div>
          <div class="form-group">
             <label class="control-label col-sm-4 mr-10">
                ${translate("skip_downloaded")} 
            </label>
            <div class="col-sm-2 checkbox">
                <input type="checkbox" name="filter_downloaded" id="filter_downloaded" value="1" checked>
            </div>
          </div>
        </div>
        </form>
                        </div>
                    `)
                    }


                    unsafeWindow.startDownload = startDownload
                    function startDownload() {
                        let need_download = $("#download_number").val();
                        if (need_download === undefined || need_download > user_daily_downloaded_count) {
                            send_error_msg("download_number_big")
                            return;
                        }

                        let skip = $("#filter_downloaded").is(":checked");

                        let loadCount = 1;

                        function downloadBookLists(loadCount) {

                            /**
                                 * @param {Book[]} books - Array of book objects
                                 * @param {number} cur_index - Current index
                                 */
                            async function downloadBooks(books, cur_index) {
                                let cur_book = books[cur_index]
                                if (cur_book == null) return
                                if (user_daily_downloaded_count <= 0) {
                                    send_error_msg("今日下载次数已用完,下载结束")
                                    return
                                }
                                if (need_download <= 0) {
                                    send_ok_msg("下载完成")
                                    return
                                }



                                if (skip && ZLibrary.checkIsDownloaded(cur_book.book_id, cur_book.book.isbn)) {
                                    cur_index = cur_index + 1
                                    await downloadBooks(books, cur_index);
                                    return
                                }


                                send_info_notify("start_download_with_title", { title: cur_book.book.title })
                                await new Promise((resolve, reject) => {
                                    user_daily_downloaded_count -= 1
                                    need_download -= 1
                                    downloadFile(cur_book.book.dl, `${cur_book.book.title}.${cur_book.book.extension}`,
                                        function () {
                                            CurrentUser.addDownloadedBook(cur_book.book_id)
                                            resolve()
                                        }, (err) => {
                                            send_error_msg("download_book_error", { error: err.message });
                                            if (err.error === "not_whitelisted") {
                                                send_info_notify("请先设置油猴下载文件格式白名单，否则只能下载pdf格式");
                                            }
                                            console.log(err);
                                            reject(err); // 失败时调用 reject
                                        }, function (progress) {
                                            console.log(progress);
                                        }, function () {
                                            send_error_msg("下载书籍超时错误");
                                        });
                                });

                                await downloadBooks(books, cur_index + 1);
                            }

                            new ZLibraryResponse(new Request('/papi/booklist/' + CurBooklistid + '/get-books/' + loadCount + '?order=date_savedA', {
                                method: 'POST'
                            }))
                                .success(/**
                                 * @param {BooksResponse} json
                                 * */
                                    async function (json) {

                                        let download_books = json.books
                                        let i = 0

                                        await downloadBooks(download_books, i)
                                        // Check if there are more books to load
                                        if (json.pagination.next) {

                                            setTimeout(downloadBookLists, 1000, json.pagination.next);
                                        } else {
                                            send_ok_msg("下载完成")
                                        }
                                    })
                                .fetch();
                        }

                        downloadBookLists(loadCount);

                    }

                    const showModal = function () {
                        const merchantModal = new ZLibraryModal({
                            element: 'ZUE-download-modal',
                            container: 'zlibrary-modal-styled',
                            title: translate("batch download"),
                            footer: `<div class="modal-footer"> <button class="btn btn-success" onclick="startDownload()">${translate("start download")}</button></div>`
                        })
                        merchantModal.show()
                    }
                    showModal()
                })

            }
        )
    }


    function searchPageExec() {
        changeSearch();
        // 保存原生的hasAttribute方法

        function collapser() {
            const isbnMap = new Map();

            // 查找所有带有isbn属性的z-bookcard元素
            $('z-bookcard[isbn]').each(function () {
                const $card = $(this);
                const isbn = $card.attr('isbn');
                const $parent = $card.closest('.book-item.resItemBoxBooks');

                if (isbn && $parent.length) {
                    if (!isbnMap.has(isbn)) {
                        isbnMap.set(isbn, {
                            firstParent: $parent,
                            otherParents: []
                        });
                    } else {
                        isbnMap.get(isbn).otherParents.push($parent);
                    }
                }
            });

            // 处理每组具有相同ISBN的元素
            isbnMap.forEach((group) => {
                const { firstParent, otherParents } = group;

                // 如果只有一个元素，则不需要折叠
                if (otherParents.length === 0) return;

                // 创建一个容器用于放置所有相同ISBN的书籍
                const $container = $('<div>')
                    .addClass('isbn-group-container');

                // 将容器插入到第一个父元素之后
                firstParent.after($container);

                // 将第一个父元素移入容器
                $container.append(firstParent);

                // 隐藏其他父元素并添加到容器中
                $(otherParents).each(function () {
                    $(this)
                        .hide()
                        .addClass('ml-6 mt-2 opacity-90 border-l-2 border-blue-300 pl-4')
                        .appendTo($container);
                });

                // 创建折叠/展开按钮
                const $toggleButton = $('<button>')
                    .addClass('btn')
                    .attr('type', 'button')
                    .css('width', '100%');

                // 创建按钮文本和箭头图标
                const $buttonText = $('<span>').text(`查看更多 ${otherParents.length} 个版本`);
                const $arrowIcon = $('<i>')
                    .addClass('book-toggle-icon')
                    .html('&#9660;');

                // 组合按钮
                $toggleButton.append($buttonText).append($arrowIcon);

                // 记录折叠状态
                let isCollapsed = true;

                // 添加点击事件处理
                $toggleButton.on('click', function () {
                    isCollapsed = !isCollapsed;

                    // 切换其余元素的可见性并添加动画
                    $(otherParents).each(function () {
                        const $parent = $(this);
                        if (isCollapsed) {
                            $parent.hide();
                        } else {
                            $parent.show()
                                .css({ opacity: 0, transform: 'translateX(10px)' })
                                .animate({ opacity: 1, transform: 'translateX(0)' }, 300);
                        }
                    });

                    // 更新箭头方向和按钮文本
                    $arrowIcon.css('transform', isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)');
                    $buttonText.text(isCollapsed
                        ? `查看更多 ${otherParents.length} 个版本`
                        : `收起 ${otherParents.length} 个版本`);

                    // 更新容器样式
                    $container.css('border-color', isCollapsed ? '#3b82f6' : '#1e40af');
                });

                // 将按钮添加到容器中
                $container.append($toggleButton);
            });
        }


        console.debug(`current user is premium?: ${user_is_premium()}`)
        if (!user_is_premium()) {
            console.debug("add premium download")
            const originalHasAttribute = HTMLElement.prototype.hasAttribute;
            HTMLElement.prototype.hasAttribute = function (attrName) {
                // 针对z-bookcard元素且检查的是'premium'属性时，强制返回true
                if (this.tagName.toLowerCase() === 'z-bookcard' && attrName === 'premium') {
                    return true;
                }
                // 其他情况调用原生方法
                return originalHasAttribute.call(this, attrName);
            };
        }


        const btn_html = `<div class="element zlibicon-open-book icon-open-book-by-script" title  data-original-title="${translate("online read")}"></div>`
        GM_addStyle(".icon-open-book-by-script {font-size: 24px;opacity: 0.3} .icon-open-book-by-script:hover {opacity: 0.8;}")
        waitForEl("z-bookcard.ready", function () {
            $('#searchResultBox > .book-item > z-bookcard').each(function () {
                // 获取当前元素的 shadowRoot
                const shadowRoot = this.shadowRoot;
                // 在 shadowRoot 中查找 .bookmark 元素并插入 btn_html
                $(shadowRoot).find(".actions").prepend(btn_html);
                $(".tile", shadowRoot).on("click", ".icon-open-book-by-script", async function () {
                    send_ok_msg("开始查找在线阅读地址")
                    const element = $(this);
                    const href = element.parent().parent().find("a").attr('href');
                    try {
                        const { doc } = await getDocAsync(href)
                        let reader_link = $(".reader-link", doc).attr('href')
                        GM_openInTab(reader_link, { active: true });
                        const bookid = element.parent().parent().find(".bookmarks").attr('data-book_id');
                        CurrentUser.addDownloadedBook(parseInt(bookid))
                        await new ZLibraryResponse(`/papi/user/count-download/${bookid}`).fetch()
                    } catch {
                        send_error_msg("网络错误")
                    }
                })
            });
            if (enable_collapse_same_isbn) {
                collapser();
            }
        })


    }



    function downloadsPageExec() {
        $('.col-buttons').append('<div class="button-element"><i class="icon icon-bookmark zlibicon-flag btn-booklists" title="" data-original-title="将这本书加入你的个人主题收藏，并与你的社区分享它"></i></div>')
        ZLibrary.connect('z-booklists-browser')

        // add need resouce
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = "/resources/js/user-bookmarks.js";
        document.documentElement.appendChild(script);

        $('.icon-bookmark').on('click', function (e) {
            const book_id = $(this).closest('tr').data('item_id');
            ZLibraryContextMenu({
                node: e.target,
                center: true,
                list: [{
                    type: 'component',
                    html: `<z-booklists-browser id="${book_id}" ></z-booklists-browser>`
                }]
            });
        });
    }

    function bookDetailPageExec() {
        $(document).on('paste', function (event) {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            let file = null;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') === 0) {
                    file = items[i].getAsFile();
                    break;
                }
            }

            if (file !== null) {
                CurrentBook.suggestCover(file)
            }
        });

        function add_submit_spam() {
            let mod_buttom_html = `<div class="book-details-button" style="text-decoration: none;">   <a id="moderation" class="btn btn-danger "><i class="zlibicon-warning"></i>这本书有问题</a> </div>`
            $("div.book-actions-buttons > .book-details-button:last").after(mod_buttom_html)
            let $book = $(".book-actions-container");

            $book.on("click", "#moderation", function () {
                let submitPack = { "resolution": "decline", "decline_reason": "inappropriate_content" }
                let bookId = get_bookId()
                new ZLibraryResponse(`/papi/moderation/user-book-moderation/${bookId}`, submitPack).fetch()
                send_ok_msg("举报成功")
            })

        }

        add_submit_spam()
        setInterval(checkDownloadedStatus, 1000);
        if (userLanguage === 'zh') {
            // 等待按钮出现
            waitForEl(".btnFetchMetadata", function () {
                const $btn = $('.btnFetchMetadata');
                // 移除类
                $btn.removeClass('btnFetchMetadata');

                // 移除内联onclick事件
                $btn.removeAttr('onclick');

                // 移除jQuery绑定的事件
                $btn.off('click');

                // 绑定事件
                $btn.on('click', function (e) {
                    e.preventDefault();
                    const isbn = $(this).parents('.input-group').find('.input-isbn').val();
                    if (!isbn) return ZLibraryNotify().error('首先指定ISBN');

                    new ZLibrarySpinner($(this)).color('#666').length(3).width(2).radius(4);
                    fetchMeatByIsbnByDouban(isbn).catch(err => {
                        console.log(err);
                        send_error_msg(err);
                    });
                });
            });

            let link = "https://search.douban.com/book/subject_search?search_text==" + $('.book-title').text() + "&cat=1001"
            // 提取并打印 ISBN 13 的内容
            const isbn13Element = $('.bookProperty.property_isbn[class*="13"] .property_value');

            // 提取并打印 ISBN 13 的内容
            if (isbn13Element.length > 0) {
                const isbn13 = isbn13Element.text().trim();
                link = "https://www.douban.com/isbn/" + isbn13
            }

            $('.bookDetailsBox').append(`<div class="bookProperty property_douban_link">
                    <div class="property_label">豆瓣链接:</div>
                        <div class="property_value"> <a href="${link}" target="_blank" style="color: var(--color-blue);">查看豆瓣</a></div>
                    </div>`
            )
        }
    }

    function changeSearch() {
        const targetSelector = '#searchFieldx';
        // 等待目标元素加载
        waitForEl(targetSelector, () => {
            $(targetSelector).off('change input'); // 移除 'change' 和 'input' 事件
        });
    }

    function indexPageExec() {
        setInterval(checkDownloadedStatus, 1000);
        if (enable_lock_search) {
            changeSearch()
        }
        function close_notification() {
            let newNotificationsCount = CurrentUser?.notifications_count ?? 0;
            if (newNotificationsCount > 0) {
                new ZLibraryResponse(new Request('/papi/notification/mark-read-all', {
                    method: 'PATCH'
                }))
                    .success(() => {
                        setTimeout(() => {
                            document.querySelectorAll('.notifications-board .new').forEach(el => el.classList.remove('new'));
                            document.querySelector('.navigation-notifications .badge').innerHTML = '';
                        }, 800);
                    })
                    .fetch()
            }
        }
        if (enable_auto_close_notice) {
            close_notification()
        }
    }



    function RecommendPageExec() {
        waitForEl("[class*='RecommendationBlock__Masonry']", function () {
            checkDownloadedStatusInRecommend();
        })

        customElements.whenDefined('z-cover').then(() => {
            const bookMap = new Map();
            // 重写 fetch
            const originalFetch = window.fetch;
            unsafeWindow.fetch = function (...args) {
                return originalFetch.apply(this, args).then(response => {
                    const clonedResponse = response.clone(); // 克隆响应以便后续使用
                    clonedResponse.json().then(data => {
                        if (args[0].includes('/papi/book/recommended/mosaic/')) { // 替换为你要拦截的特定请求
                            if (!data.books) return
                            // 创建一个 Map
                            data.books.forEach(book => {
                                bookMap.set(book.id.toString(), book.isbn);
                                $(`z-cover[id="${book.id}"]`).attr('isbn', book.isbn);
                            });
                        }
                    });
                    return response;
                });
            };

            const ZCover = customElements.get('z-cover');
            const originalMethod = ZCover.prototype.render;
            ZCover.prototype.render = function () {
                this.markButton = true;
                if (bookMap.has(this.id)) {
                    this.isbn = bookMap.get(this.id);
                    this.setAttribute('isbn', this.isbn);
                }
                return originalMethod.call(this);
            }

            document.addEventListener('click', (event) => {
                // 获取事件传播路径
                const path = event.composedPath();

                // 遍历路径，查找是否包含目标按钮
                const targetButton = path.find((node) =>
                    node instanceof HTMLElement && node.matches('.mark-as-downloaded .label')
                );

                if (targetButton) {
                    event.stopPropagation(); // 阻止事件冒泡
                    event.preventDefault();  // 阻止默认行为（如 a 标签跳转）
                }
            });

        })
    }


    function makeReadAddIsbn() {
        customElements.whenDefined('z-cover').then(() => {
            CurrentUser.addDownloadedBook = function (bookId, timeout) {
                // find cur page id  attr equid bookid  z-cover element
                // <z-cover lightbox="" naturalratio="" volume="" markbutton="" id="33543716" isbn="9787568205603" author="张年松，曹兵编著" title="弹药制导与控制系统基础" class="ready">
                dispatchCustomEvent('book-downloaded', {
                    bookId
                });
                if (!this.id || !window.localStorage) {
                    return
                }
                const downloadedBooks = this.getDownloadedBooksFromStorage()
                let isbn = null
                if (downloadedBooks) {
                    const bookElement = document.getElementById(bookId);
                    if (bookElement) {
                        // get isbn and check isbn not null
                        const tmp_isbn = bookElement.getAttribute('isbn');
                        if (tmp_isbn) {
                            const isbns = tmp_isbn.split(',');
                            if (isbns.length > 0) {
                                isbn = isbns[0].trim();
                            }
                        }
                    }
                    downloadedBooks.push({
                        id: bookId,
                        isbn: isbn,
                    })

                    localStorage.setItem('downloadedBooks', JSON.stringify(downloadedBooks))
                    setTimeout(() => {
                        this.markDownloadedBooks()
                    }
                        , timeout ? 2500 : 0)
                }
            }
        })
    }

    makeReadAddIsbn();

    function booklistSort() {
        const booklist_click_key = "booklist_added_v2"
        const booklist_added = GM_getValue(booklist_click_key, []);

        customElements.whenDefined('z-booklists-browser').then(() => {
            const BooklistsBrowser = customElements.get('z-booklists-browser');
            const originalMethod = BooklistsBrowser.prototype.renderBooklists;
            BooklistsBrowser.prototype.renderBooklists = function () {
                const elementArray = this.cache.list;
                // 根据字符串数组对元素数组进行排序
                elementArray.sort(function (a, b) {
                    const textA = a.title// 获取元素的文本内容
                    const textB = b.title
                    const indexA = booklist_added.indexOf(textA); // 获取元素文本在字符串数组中的索引
                    const indexB = booklist_added.indexOf(textB);

                    // 根据索引进行排序
                    if (indexA > indexB) {
                        return -1; // 降序排列
                    } else if (indexA < indexB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });

                function insertElement(array, element) {
                    var index = array.indexOf(element);
                    if (index !== -1) {
                        array.splice(index, 1);
                    }
                    array.push(element);
                }

                const DOM = originalMethod.call(this);
                const lines = DOM.querySelectorAll('.line');
                for (let i = 0; i < lines.length; i++) {
                    lines[i].addEventListener('click', function (event) {
                        const booklist = event.target.innerText;
                        insertElement(booklist_added, booklist);
                        GM_setValue(booklist_click_key, booklist_added);
                    })
                }
                return DOM;
            }
        })
    }

    booklistSort();

    function RegisterMenuCommand() {
        // 配置所有设置项，新增设置只需在这里添加
        const settingsConfig = [
            {
                name: "filter_recommend",
                label: "filter_recommend",
                defaultValue: true
            },
            {
                name: "lock_search",
                label: "lock_search",
                defaultValue: true
            },
            {
                name: auto_close_notify,
                label: auto_close_notify,
                defaultValue: false
            },
            {
                name: collapse_same_isbn,
                label: collapse_same_isbn,
                defaultValue: false
            },
            // 可以继续添加更多设置项
        ];

        function getSettingValue(setting) {
            const key = setting.key || setting.name;
            const savedSettings = GM_getValue(config_key, {});
            return savedSettings[key] !== undefined
                ? savedSettings[key]
                : setting.defaultValue;
        }

        // 将设置项每两个分成一组，每组占一行
        function groupSettingsInPairs(settings) {
            const groups = [];
            for (let i = 0; i < settings.length; i += 2) {
                const pair = [settings[i]];
                if (i + 1 < settings.length) {
                    pair.push(settings[i + 1]);
                }
                groups.push(pair);
            }
            return groups;
        }

        function createSettingsHtml() {
            const settingGroups = groupSettingsInPairs(settingsConfig);
            let rowsHtml = '';

            settingGroups.forEach(group => {
                let itemsHtml = '';

                group.forEach((setting) => {
                    const itemWidthClass = 'col-sm-6';
                    itemsHtml += `
                <div class="${itemWidthClass}">
                    <div class="form-group">
                        <label class="control-label col-sm-5 mr-10" for="${setting.name}">
                            ${translate(setting.label)} 
                        </label>
                        <div class="col-sm-6 checkbox">
                            <input type="checkbox" 
                                   name="${setting.name}" 
                                   value="1" 
                                   ${getSettingValue(setting) ? "checked" : ""}>
                        </div>
                    </div>
                </div>`;

                });

                rowsHtml += `<div class="row" style="margin-bottom: 18px;">${itemsHtml}</div>`;
            });

            return `
        <div id="ZUE-settings-modal" class="hidden">
            <form onsubmit="return false;" id="formSetting" class="form-horizontal">
                <div class="edit-book-container">
                    ${rowsHtml}
                </div>
            </form>
        </div>`;
        }

        function settingsPage() {
            if ($("#ZUE-settings-modal").length === 0) {
                $("body").append(createSettingsHtml());
            }

            const merchantModal = new ZLibraryModal({
                element: 'ZUE-settings-modal',
                container: 'zlibrary-modal-styled',
                title: translate("Settings Page"),
                footer: `
                <div class="modal-footer"> 
                    <button class="btn btn-success" id="save-settings">${translate("Save")}</button>
                </div>`
            });

            // 使用事件委托绑定
            $(document).off('click', '#save-settings').on('click', '#save-settings', () => {
                const checkboxDict = {};

                settingsConfig.forEach(setting => {
                    const key = setting.name;
                    const element = $(`.modal-body #formSetting input[name='${setting.name}']`);
                    checkboxDict[key] = element.is(':checked');
                });

                GM_setValue(config_key, checkboxDict);
                merchantModal.hide();
                $("#ZUE-settings-modal").remove();
            });
            merchantModal.show();
        }

        const translations = {
            en: {
                settingsPage: 'Settings Page'
            },
            zh: {
                settingsPage: '设置页面'
            }
        };

        const translation = translations[userLanguage] || translations['en'];
        GM_registerMenuCommand(translation.settingsPage, settingsPage);
    }
    RegisterMenuCommand();

    if (testUrl.pathname === "/") {
        indexPageExec();
    } else if (testUrl.pathname.startsWith("/booklist/")) {
        booklistPageExec();
    } else if (testUrl.pathname.startsWith("/users/zrecommended")) {
        RecommendPageExec();
    } else if (testUrl.pathname.startsWith("/users/downloads")) {
        downloadsPageExec();
    } else if (testUrl.pathname.startsWith("/s/")) {
        searchPageExec();
    } else if (testUrl.pathname.startsWith("/book/")) {
        bookDetailPageExec();
    }
}())
