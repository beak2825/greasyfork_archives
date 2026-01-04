// ==UserScript==
// @name         Afteru Supplements 2
// @namespace    http://tampermonkey.net/
// @version      20240204
// @description  more Supplements for Afteru notion
// @author       Uri Chachick
// @match        https://www.notion.so/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483525/Afteru%20Supplements%202.user.js
// @updateURL https://update.greasyfork.org/scripts/483525/Afteru%20Supplements%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var AU2_addStyle =
        function(css) {
            var style = document.getElementById("AU2_addStyleBy8626") || (function() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = "AU_addStyleBy8626";
                document.head.appendChild(style);
                return style;
            })();
            var sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        };

    AU2_addStyle(".notion-collection_view-block>div[role=button]:last-child {display: none !important;}");
    AU2_addStyle(".notion-collection_view-block>div[role=button]:nth-last-child(2) {display: none !important;}");
    AU2_addStyle(".notion-calendar-view .notion-collection_view-block>div[role=button] {display: none !important;}");
    AU2_addStyle(".notion-collection-add-view {display: none !important;}");
    AU2_addStyle(".notion-collection_view-block div[role=tablist]+div {display: none !important}");
})();