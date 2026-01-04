// ==UserScript==
// @name         CSDNDownloader
// @namespace    http://tampermonkey.net/csdn_downloader
// @version      0.1
// @description  try to take over the world!
// @author       Lei
// @match        *://download.csdn.net/download/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at      document-start

// @downloadURL https://update.greasyfork.org/scripts/375989/CSDNDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/375989/CSDNDownloader.meta.js
// ==/UserScript==

var $ = window.jQuery;

$(document).ready(function() {
    var item = $(".grey_dl_btn_null");
    unsafeWindow.$(".grey_dl_btn_null")
        .unbind("click")
        .off("click")
        .removeAttr("onclick");
    item.removeClass("grey_dl_btn_null").removeClass("book_clicks").addClass("direct_download").attr("href", "javascript:;").text("正版下载");
});