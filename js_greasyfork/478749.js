// ==UserScript==
// @name         YoudaoDictQuickSelect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  click bold text to quick select the word
// @author       wzj042
// @match        https://dict.youdao.com/*
// @icon         https://shared-https.ydstatic.com/images/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478749/YoudaoDictQuickSelect.user.js
// @updateURL https://update.greasyfork.org/scripts/478749/YoudaoDictQuickSelect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(e) {
        if (e.target.tagName.toLowerCase() === 'b') {
            var range = document.createRange();
            range.selectNodeContents(e.target);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });
})();