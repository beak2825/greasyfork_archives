// ==UserScript==
// @name         E-mail reply highlighting (manual)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlights e-mail replies with different colours per quotation level in lines preceded by ">", ">>" etc.
// @author       Alexander Kriegisch
// @match        *://*/*
// @run-at       context-menu
// @grant        GM_addStyle
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://greasyfork.org/scripts/40782-library-for-e-mail-forward-highlighting/code/Library%20for%20e-mail%20forward%20highlighting.js?version=265774
// @downloadURL https://update.greasyfork.org/scripts/40784/E-mail%20reply%20highlighting%20%28manual%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40784/E-mail%20reply%20highlighting%20%28manual%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    highlightQuotes();
    // Dynamic updates for Gmail AJAX-based reader (heuristic, should be improved)
    waitForKeyElements ("pre", highlightQuotes);
    waitForKeyElements ("div.ii.gt", highlightQuotes);
})();