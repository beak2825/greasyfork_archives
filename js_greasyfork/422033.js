// ==UserScript==
// @name         hipda-search
// @namespace    https://www.hi-pda.com/forum/search.php*
// @version      0.1.2
// @description    Search enhance for HiPDA
// @author       maltoze
// @match        https://www.hi-pda.com/forum/search.php*
// @match        https://www.4d4y.com/forum/search.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/422033/hipda-search.user.js
// @updateURL https://update.greasyfork.org/scripts/422033/hipda-search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchSelectElem = document.querySelector("#wrap > form > p.searchkey > select");
    searchSelectElem.options.add(new Option("全文","fulltext"));
    searchSelectElem.options.add(new Option("标题增强","hello"));
    searchSelectElem.selectedIndex = searchSelectElem.length - 1;
})();
