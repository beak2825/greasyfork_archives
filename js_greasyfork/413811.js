// ==UserScript==
// @name         Dyreitou Site DarkTheme
// @namespace    http://tampermonkey.net/
// @description  Dyreitou氏のホームページ、文字の冷凍庫のダークテーマを自分なりに作ったもの。
// @author       Hansy
// @match        https://dyreitou.com/*
// @grant        none
// @license      WTFPL
// @version      1.1
// @downloadURL https://update.greasyfork.org/scripts/413811/Dyreitou%20Site%20DarkTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/413811/Dyreitou%20Site%20DarkTheme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var set_black_BGC = function (node) { node.style.backgroundColor = "black"; };
    var set_black_BGC_name = function(name) { set_black_BGC(document.querySelector(name));};
    var set_black_BGC_name_ALL = function(name) {document.querySelectorAll(name).forEach((node)=>set_black_BGC(node));};
    var set_none = function (node) { node.style.display = "none"; };
    var set_none_name = function(name) { set_none(document.querySelector(name));};

    // Webページ全体の配色(背景と文字色)
    document.body.style.backgroundColor = "black";
    document.body.style.color = "#777";

    // Webページ上部の追従ヘッダ関連
    if(document.querySelector("ul.single-menu") != null) {
        set_black_BGC_name("ul.single-menu");
        set_black_BGC_name("div.sp-header");
        document.querySelector("body > div.sp-header > div.cp_offcm01 > label").style.color = "white";
    }

    set_none_name("div.toggle_switch");

    if(document.querySelector("ul.header-menu") != null) {
        var css = ".header-menu a:hover {background-color: #0d4d74;}"
        var style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }


    if(document.body.classList.contains("home")){
        // ヘッダー
        set_black_BGC(document.querySelector("header"));

        // containerのサイズ修正
        var container = document.querySelector("body div.container");
        container.style.maxWidth="950px"
        container.style.width = "100%";
        container.style.padding = "0 10px";

        // 記事リスト関係
        set_black_BGC_name_ALL("article.kiji-list");

        // あまりにもNoImageが多すぎるので、そもそも表示しないようにした
        document.querySelectorAll("article.kiji-list div.kiji-img").forEach(set_none);

    } else if (document.body.classList.contains("single-post")){
        // コメント欄
        var set_comment_color = function (tag) {
            tag.style.backgroundColor = "#1a1a1a";
            tag.style.color = "darkgray";
        };
        set_comment_color(document.querySelector("#comments"));
        set_comment_color(document.querySelector("#author"));
        set_comment_color(document.querySelector("#comment"));

        // GoogleAdSenseの位置を移動
        var kiji = document.querySelector('div.kiji-content');
        kiji.parentNode.insertBefore(document.querySelector('.kiji-content>div:first-child'), kiji);
        kiji.parentNode.insertBefore(document.querySelector('.kiji-content>div:last-child'), kiji.nextSibling);
    }
})();

