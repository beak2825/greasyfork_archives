// ==UserScript==
// @name         drummyfish - remove specific patches
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Remove all patches containing a/wiki_stats.md, a/random_page.md, or a/wiki_pages.md
// @match        https://repo.or.cz/less_retarded_wiki.git/commitdiff/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/503178/drummyfish%20-%20remove%20specific%20patches.user.js
// @updateURL https://update.greasyfork.org/scripts/503178/drummyfish%20-%20remove%20specific%20patches.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all .patch elements
    const patches = document.querySelectorAll('.patch');

    patches.forEach(patch => {
        // Check if it contains the specified texts
        if (patch.innerHTML.includes('a/wiki_stats.md') ||
            patch.innerHTML.includes('a/random_page.md') ||
            patch.innerHTML.includes('a/wiki_pages.md')) {
            patch.remove();
        }
    });

    GM_addStyle(`
        body {
            font-size: unset !important;
        }
        td.pre, div.pre, div.diff {
            font-family: sans-serif !important;
            font-size: unset !important;
        }
    `);
})();
