// ==UserScript==
// @name         NHK Easy - Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Provides dark mode to NHK Easy
// @author       Edwin
// @match        https://www3.nhk.or.jp/news/easy/*
// @icon         https://www.nhk.or.jp/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451334/NHK%20Easy%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/451334/NHK%20Easy%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = [
        ".title {",
        "    color: #a4a6a5 !important;",
        "}",
        ".side-news-item__title {",
        "    color: #a4a6a5 !important;",
        "}",
        ".side-disaster-title {",
        "    color: #a4a6a5 !important;",
        "}"
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

    const tools = document.querySelectorAll("#easy-wrapper .article-main__tools");
    const caution = document.querySelectorAll("#easy-wrapper .about-word-color__caution");
    const title = document.querySelectorAll("#easy-wrapper .article-main__title");
    const rt = document.querySelectorAll("rt");
    const under = document.querySelectorAll("#easy-wrapper .dicWin");
    const box = document.querySelectorAll("#easy-wrapper .dictionary-box");

    document.body.style.background = "#2a2a2a";
    document.body.style.color = "#a4a6a5";

    for (let i = 0; i < tools.length; i++) {
        tools[i].style.background = "#2a2a2a";
    }

    for (let i = 0; i < caution.length; i++) {
        caution[i].style.background = "#2a2a2a";
    }

    for (let i = 0; i < title.length; i++) {
        title[i].style.color = "#a4a6a5";
    }

    for (let i = 0; i < rt.length; i++) {
        rt[i].style.color = "#a4a6a5";
    }

    for (let i = 0; i < under.length; i++) {
        under[i].style.textDecorationColor = "rgba(255,165,0,0.3)";
    }

    for (let i = 0; i < box.length; i++) {
        box[i].style.background = "black";
        box[i].style.color = "white";
    }

})();