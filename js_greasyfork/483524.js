// ==UserScript==
// @name         Afteru Notion Supplements
// @namespace    http://tampermonkey.net/
// @version      2023-12-31_1.1
// @description  adding more adjustmants to notion
// @author       Uri Chachick
// @match        https://www.notion.so/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483524/Afteru%20Notion%20Supplements.user.js
// @updateURL https://update.greasyfork.org/scripts/483524/Afteru%20Notion%20Supplements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var AU_addStyle =
        function(css) {
            var style = document.getElementById("AU_addStyleBy8626") || (function() {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.id = "AU_addStyleBy8626";
                document.head.appendChild(style);
                return style;
            })();
            var sheet = style.sheet;
            sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
        };

    AU_addStyle(".notion-gallery-view .notion-selectable+div[role=button] { display: none !important; }");
    AU_addStyle(".layout-content {direction: rtl;}");
    
})();