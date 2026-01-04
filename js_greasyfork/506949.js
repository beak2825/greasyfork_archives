// ==UserScript==
// @name         urich tables fix for notion rtl
// @namespace    http://tampermonkey.net/
// @version      2024-10-06
// @description  fixing notion table RTL
// @author       You
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506949/urich%20tables%20fix%20for%20notion%20rtl.user.js
// @updateURL https://update.greasyfork.org/scripts/506949/urich%20tables%20fix%20for%20notion%20rtl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var UC_addStyle =
        function(css) {
            var style = document.getElementById("GM_addStyleBy8626") || (function() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = "GM_addStyleBy8626";
                document.head.appendChild(style);
                return style;
            })();
            var sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        };

    UC_addStyle(".notion-table-view-row { text-align: start !important; direction: rtl }");
    UC_addStyle(".notion-table-view-row * { text-align: start !important; direction: rtl }");
    UC_addStyle(".notion-list-view *[dir=ltr] { text-align: start !important; direction: rtl }");
    UC_addStyle(".notion-table-view-header-row *[dir=ltr] { text-align: start !important; direction: rtl }");
    UC_addStyle(".notion-table-view-header-row { text-align: start !important; direction: rtl }");
    // Your code here...
})();