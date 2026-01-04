// ==UserScript==
// @name         copy
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  11
// @author       You
// @match        *://ml.corp.kuaishou.com/label-frontend/tagging?*
// @match        *://ml.corp.kuaishou.com/label-frontend/summary?*
// @match        *://ml.corp.kuaishou.com/label-frontend/list*
// @match        *://ml.corp.kuaishou.com/label-frontend/skip?*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450193/copy.user.js
// @updateURL https://update.greasyfork.org/scripts/450193/copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function getSelectedText() {
        if (window.getSelection) return window.getSelection().toString();
        else if (document.getSelection) return document.getSelection();
        else if (document.selection) return document.selection.createRange().text;
    }
    window.onmouseup = async function () {
        let b = getSelectedText().trim();
        // b = b.replace(/[\r\n]/g, "");
        // let b = getSelectedText();
        if (b != '') {
            // document.execCommand("Copy");
            await navigator.clipboard.writeText(b);
        }
    }
})();
