// ==UserScript==
// @name         Confluence Floating TOC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使Notion的目录悬浮于右上方.
// @author       非
// @grant             GM_addStyle
// @require      https://cdn.jsdelivr.net/jquery/latest/jquery.min.js
// @match        https://*/pages/viewpage.action*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477346/Confluence%20Floating%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/477346/Confluence%20Floating%20TOC.meta.js
// ==/UserScript==

// https://community.atlassian.com/t5/Confluence-questions/Floating-table-of-contents-without-addons/qaq-p/1102910

(function() {
    'use strict';

    const TOC_STYLE = `
.toc-macro {
    z-index: 1000 !important;
    position: fixed;
    border: 1px solid #0096d6;
    float: right;
    width: 250px !important;
    max-width: auto !important;
    overflow: auto;
    top: 170px;
    right: 0px;
    background: rgba(255,255,255,0.8);
}
`
    GM_addStyle(TOC_STYLE)

})();