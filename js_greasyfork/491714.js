// ==UserScript==
// @name         ハーメルン　ページ幅変更時の調整
// @namespace    https://greasyfork.org/ja/users/942894
// @version      2024-04-08
// @description  画面を狭くした時、左サイドバーを隠したり小説部分の幅を維持したり
// @author       _Hiiji
// @match        *://syosetu.org/*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syosetu.org
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491714/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E3%83%9A%E3%83%BC%E3%82%B8%E5%B9%85%E5%A4%89%E6%9B%B4%E6%99%82%E3%81%AE%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/491714/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E3%83%9A%E3%83%BC%E3%82%B8%E5%B9%85%E5%A4%89%E6%9B%B4%E6%99%82%E3%81%AE%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const mediaQueryList = window.matchMedia("(min-width: 970px)"); // サイズ変更が起きる閾値
    const container = document.getElementById("container");
    const page = document.getElementById("page");
    const main = document.getElementById("main"); // 感想ページ・etc（サイドバーがあるページ）
    const maind = document.getElementById("maind"); //通常ページ・誤字報告
    const sidebar = document.getElementById("nav"); // 感想ページ・etc
    const nl_h = document.querySelectorAll("#header > ul.nl"); // 全ページ？
    const nl_f = document.querySelectorAll("#footer > ul.nl"); // 全ページ？
    const li_nl_clearFix = document.querySelectorAll("ul.nl.clearFix > li"); //全ページ？

    let ma;
    let ss;
    if(main)
    {ma = main}
    else
    {ma = maind; ss = maind.querySelectorAll("div.ss");}
    const section = ma.getElementsByClassName("section");
    const topicPath = document.querySelectorAll("ol.topicPath"); //通常ページ・感想ページ
    const header_footer_a = document.querySelectorAll("ol.topicPath > li > a"); //通常ページ・感想ページ

    const listener = (event) => {
        // リサイズ時に行う処理
        if (event.matches)
        // 以上 サイドバー表示　スクリプト不使用時の状態と同じ
        {
            container.setAttribute("style","width: 980px;");
            page.setAttribute("style","width: 950px;");
            if(main)
            {main.setAttribute("style","width: 770px;");} // サイドバーの分狭くなる
            else
            {maind.setAttribute("style","width: 950px;");
             for (const val of ss) {val.setAttribute("style","width: 665px; margin-left: auto; margin-right: auto;");}}
            if(sidebar)
            {sidebar.removeAttribute("style");}
            for (const val of nl_h) {val.setAttribute("style","width: 948px;");}
            for (const val of nl_f) {val.setAttribute("style","width: 948px;");}
            for (const val of li_nl_clearFix) {val.setAttribute("style","width: 158px;");}
            for (const val of section) {val.setAttribute("style","margin: 0 15px 2em 1.4em;");}
            for (const val of topicPath) {val.setAttribute("style","width: 950px;");}
            for (const val of header_footer_a) {val.setAttribute("style","padding-right: 9pt; padding-left: 5px;");}
        }
        else
        // 未満 サイドバーを隠して、本文とかヘッダーとかを調整
        {
            container.setAttribute("style","width: 740px;");
            page.setAttribute("style","width: 735px;");
            ma.setAttribute("style","width: 730px;");
            if(maind)
            {for (const val of ss) {val.setAttribute("style","width: 665px; margin-left: auto; margin-right: 3em;");}}
            if(sidebar)
            {sidebar.setAttribute("style","display:none;");}
            for (const val of nl_h) {val.setAttribute("style","width: 720px;");}
            for (const val of nl_f) {val.setAttribute("style","width: 720px;");}
            for (const val of li_nl_clearFix) {val.setAttribute("style","width: 120px;");}
            for (const val of section) {val.setAttribute("style","margin: 0 0.2em 1.4em;");}
            for (const val of topicPath) {val.setAttribute("style","width: 730px;");}
            for (const val of header_footer_a) {val.setAttribute("style","padding-right: 3px; padding-left: 3px;");}
        }
    }
    mediaQueryList.addEventListener("change", listener);
    listener(mediaQueryList);
})();