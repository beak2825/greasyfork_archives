// ==UserScript==
// @name         Workable RTL
// @namespace    http://siavoshkc.ir/
// @version      1.1
// @description  Makes Workable comment fields Right-to-Left
// @author       siavoshkc
// @include      *workable.com*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/409680/Workable%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/409680/Workable%20RTL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var style = document.createElement("style");
        document.head.appendChild(style);
        style.sheet.insertRule("#new-comment-body { direction: rtl; }", 0);
        style.sheet.insertRule(".message-text {direction: rtl;} ", 1);
        style.sheet.insertRule(".rating-comment {direction: rtl;} ", 2);

    }, false);
})();
