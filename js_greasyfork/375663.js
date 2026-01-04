// ==UserScript==
// @name         Mathoverflow Design
// @namespace    http://tobiasdiez.com/
// @version      0.1
// @description  Redesign the redesign.
// @author       Tobias Diez
// @match        https://mathoverflow.net/
// @downloadURL https://update.greasyfork.org/scripts/375663/Mathoverflow%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/375663/Mathoverflow%20Design.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

(function() {
    'use strict';

    GM_addStyle('.status.unanswered { border: 1px solid transparent; border-color: #9B764F; background-color: #e6dcd3; color: #36291b;}');
    GM_addStyle('.status.unanswered .mini-counts, .status.unanswered .minicounts span { color: #36291b; }');
})();