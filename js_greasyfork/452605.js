// ==UserScript==
// @name         discord hide blocked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides blocked user messages info text
// @author       Qubi
// @match        https://discord.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452605/discord%20hide%20blocked.user.js
// @updateURL https://update.greasyfork.org/scripts/452605/discord%20hide%20blocked.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleByQQQ") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleByQQQ";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    GM_addStyle("div[class^='groupStart'] {display: none;}");
})();