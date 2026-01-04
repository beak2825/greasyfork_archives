// ==UserScript==
// @name         微信阅读伙伴
// @namespace    betta-cyber - Overview
// @version      0.1.1
// @description  微信阅读好伙伴
// @author       betta-cyber
// @match        https://weread.qq.com/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_32h.png
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474131/%E5%BE%AE%E4%BF%A1%E9%98%85%E8%AF%BB%E4%BC%99%E4%BC%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/474131/%E5%BE%AE%E4%BF%A1%E9%98%85%E8%AF%BB%E4%BC%99%E4%BC%B4.meta.js
// ==/UserScript==

(function() {
    ("use strict");

    /* globals jQuery, $, waitForKeyElements */

    // GM_setValue("custom_font", 'fantasy');
    // todo
    // add button to set GM_setValue

    var custom_font = (GM_getValue("custom_font"));
    console.log(custom_font);
    var font_css
    if (custom_font) {
        font_css = "*{font-family: " + custom_font + ", LXGWWenKai, SourceHanSerifCN-Medium, Kaiti, STKaiti, FangSong, SimSun; !important;}";
    } else {
        font_css = "*{font-family:LXGWWenKai, SourceHanSerifCN-Medium, Kaiti, STKaiti, FangSong, SimSun; !important;}";
    }

    var css = [
        ".readerContent {",
        "    max-width: 100% !important;",
        "}",
        ".app_content  {",
        "    max-width: 100% !important;",
        "}",
        ".readerTopBar {",
        "    max-width: 100% !important;",
        "}",
        ".readerControls {",
        "    right: 0 !important;;",
        "    margin-right: 15px !important;",
        "    left: unset !important;",
        "}",
        ".reader_pdf_outline {",
        "    right: 0 !important;",
        "    left: unset !important;",
        "}",
        ".readerNotePanel {",
        "    right: 0 !important;",
        "    left: unset !important;",
        "}",
        ".readerCatalog {",
        "    right: 0 !important;",
        "    left: unset !important;",
        "}",
        // 调整字体
        font_css,
        ".readerTopBar_title {font-family: LXGWWenKai,SourceHanSerifCN-Bold; !important; font-weight:bold !important;}",
    ].join("\n");
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }

    // 隐藏topbar
    let windowTop = 0;
    $(window).scroll(() => {
        const scrollS = $(this).scrollTop();
        if (scrollS >= windowTop + 120) {
            $(".readerTopBar").fadeOut();
            windowTop = scrollS;
        }
        else if (scrollS < windowTop) {
            $(".readerTopBar").fadeIn();
            windowTop = scrollS;
        }
    });

    // 隐藏下载按钮
    $(".download").hide();
})();