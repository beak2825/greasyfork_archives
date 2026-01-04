// ==UserScript==
// @name         Deathworlders Dark Mode
// @version      0.1
// @description  Change text to dark so easier to read at night
// @author       Archie Lamb
// @match        *://deathworlders.com/*
// @namespace https://greasyfork.org/users/188169
// @downloadURL https://update.greasyfork.org/scripts/368600/Deathworlders%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/368600/Deathworlders%20Dark%20Mode.meta.js
// ==/UserScript==

// Got this function from https://stackoverflow.com/a/33176845
function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    style.sheet.insertRule(css, style.sheet.rules.length);
}

//Makes darker
GM_addStyle("body {background-color: #333 !important;}");
GM_addStyle("body {color: #EEE !important;}");
GM_addStyle("#container header h1 a {color: #FFF !important;}");
GM_addStyle("#container main article pre code {color: #555 !important;}");
GM_addStyle("blockquote {color: #555 !important;}");
GM_addStyle("a {color: #bbb !important;}");

// Scroll Bar
// Makes it rounded and follow the dark theme
GM_addStyle("::-webkit-scrollbar{width: 12px;  /* for vertical scrollbars */}");
GM_addStyle("::-webkit-scrollbar-track{background: rgba(0, 0, 0, 0.1);}");
GM_addStyle("::-webkit-scrollbar-thumb{background: #666; border-radius: 10px;}");
GM_addStyle("::-webkit-scrollbar-thumb:hover {background: #aaa;}");
