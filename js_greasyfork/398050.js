// ==UserScript==
// @name         Youtube Thumbnail Adjustment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adjusts Youtube's thumbnail sizes, so that more fit on your screen
// @author       Julie K
// @match        https://www.youtube.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398050/Youtube%20Thumbnail%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/398050/Youtube%20Thumbnail%20Adjustment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

    addGlobalStyle('.ytd-rich-grid-renderer{ --ytd-rich-grid-items-per-row: 6 !important; ytd-rich-grid-items-per-row: 6 !important;}');
})();