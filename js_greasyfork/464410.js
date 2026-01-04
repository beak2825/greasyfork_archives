// ==UserScript==
// @name         Notion Floating TOC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使Notion的目录悬浮于右上方.
// @author       非
// @require      https://cdn.jsdelivr.net/jquery/latest/jquery.min.js
// @match        https://www.notion.so/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464410/Notion%20Floating%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/464410/Notion%20Floating%20TOC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.innerHTML = ".notion-table_of_contents-block:first-of-type {"+
        "z-index: 1000 !important;\n" +
        "position: fixed;\n" +
        //"border: 1px solid red;\n" +
        "border: none;\n" +
        //"box-shadow: 0 0 10px #888888;\n" +
        "width: auto !important;\n" +
        "max-width: auto !important;\n" +
        "height: 90%;\n" +
        "overflow: auto;\n" +
        "top: 50px;\n" +
        "right: 50px;\n" +
    "}";
    document.head.appendChild(style);
})();


