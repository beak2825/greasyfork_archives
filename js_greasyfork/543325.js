// ==UserScript==
// @name         IMDB Expand Trivia
// @namespace    http://tampermonkey.net/
// @version      2025-07-22
// @description  Automatically expand the trivia to show all items
// @author       T-101
// @match        https://www.imdb.com/title/*/trivia/*
// @match        https://www.imdb.com/name/*/bio/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543325/IMDB%20Expand%20Trivia.user.js
// @updateURL https://update.greasyfork.org/scripts/543325/IMDB%20Expand%20Trivia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btn = document.querySelectorAll(".chained-see-more-button-uncategorized > button")[0]
    if (!btn) btn = document.querySelectorAll(".single-page-see-more-button-trivia > button")[0]
    if (btn) btn.click()
})();