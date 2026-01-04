// ==UserScript==
// @name         Manhuaplus Decentizer
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @license      MIT
// @description  Hide erotic ads at the end of chapters.
// @author       myklosbotond
// @match        https://manhuaplus.com/manga/disastrous-necromancer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manhuaplus.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475406/Manhuaplus%20Decentizer.user.js
// @updateURL https://update.greasyfork.org/scripts/475406/Manhuaplus%20Decentizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

	GM_addStyle(`
.reading-content p {
  overflow: hidden;
}

.reading-content p img:last-of-type {
  margin-bottom: -280vh !important;
}
    `);
})();