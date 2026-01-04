// ==UserScript==
// @name         T2SCHOLA Gaming CSS
// @namespace    https://t2schola.titech.ac.jp/
// @version      0.2
// @description  ナビゲーションバーを光らせます．
// @author       hayatroid
// @match        https://t2schola.titech.ac.jp/*
// @match        https://lms.s.isct.ac.jp/*
// @license      CC0-1.0 Universal
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/477247/T2SCHOLA%20Gaming%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/477247/T2SCHOLA%20Gaming%20CSS.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function () {
    // 紺色を消す
    $(".navbar .navbar-brand, .navbar .sub-nav").css({
        "background": "transparent",
    });

    // ゲーミングにする　参考：https://www.ccs1981.jp/blog/cssで色んなものを虹色に光らせる/
    $(".navbar").css({
        "background": "linear-gradient(to right, Magenta, yellow, Cyan, Magenta) 0% center/200%",
        "animation": "gaming 3s linear infinite",
    });
    $("body").append("<style>@keyframes gaming { to { background-position-x: 200%; } }</style>");

    // 文字を白色に
    $(".navbar .nav-link, .navbar .userinitials, .navbar .dropdown-toggle, .navbar-light .navbar-brand").css({
        "color": "#fff",
    });
    $(".navbar .nav-link.active").css({
        "border-bottom-color": "#fff",
    });
    $("body").append("<style>.navbar .nav-link.active::before { border-bottom-color: #fff !important; }</style>")

    // ボタンの背景を透明にし，白枠で囲う
    $(".navbar .catselector-menu, .navbar .input-group, .navbar .userinitials").css({
        "background": "transparent",
        "border": "2px solid #fff",
    });
})();
