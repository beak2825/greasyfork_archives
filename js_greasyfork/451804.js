// ==UserScript==
// @name         Tofugu Dark Mode
// @namespace    https://www.tofugu.com/*
// @version      0.1
// @description  Sets dark mode for Tofugu
// @author       Edwin
// @match        https://www.tofugu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tofugu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451804/Tofugu%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/451804/Tofugu%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = [
        "body {",
        "    color: white !important;",
        "    background-color: black !important;",
        "}",
        ".article .article-content {",
        "    background-color: black !important;",
        "}",
        "body.japanese-grammar .example-sentence {",
        "    background-color: #2a2a2a !important;",
        "}",
        ".bg-faded {",
        "    background-color: black !important;",
        "    color: white !important;",
        "}",
        ".fa {",
        "    color: white !important;",
        "}",
        ".nav-link {",
        "    color: white !important;",
        "}",
        ".navbar .nav-item.search {",
        "    background-color: black !important;",
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
})();