// ==UserScript==
// @name         codeforces-hide-tags
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide "Problem tags" on Codeforces, a serious spoiler.
// @author       yoshrc
// @match        https://codeforces.com/contest/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400956/codeforces-hide-tags.user.js
// @updateURL https://update.greasyfork.org/scripts/400956/codeforces-hide-tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (const div of document.querySelectorAll('div.caption.titled')) {
        if (div.innerHTML.includes('Problem tags')) {
            div.parentElement.setAttribute('style', 'display: none');
        }
    }
})();
