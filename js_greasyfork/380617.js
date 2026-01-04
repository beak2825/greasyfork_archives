// ==UserScript==
// @name         Re-enable text selection on RMA
// @version      0.3
// @description  Forces user-select and touch-action to auto on all elements
// @match        https://www.ratemyagent.com.au/*
// @grant        none
// @namespace https://greasyfork.org/users/283642
// @downloadURL https://update.greasyfork.org/scripts/380617/Re-enable%20text%20selection%20on%20RMA.user.js
// @updateURL https://update.greasyfork.org/scripts/380617/Re-enable%20text%20selection%20on%20RMA.meta.js
// ==/UserScript==

(function() {
    'use strict';
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

    GM_addStyle('* { user-select: auto !important; touch-action: auto !important; }');
})();

