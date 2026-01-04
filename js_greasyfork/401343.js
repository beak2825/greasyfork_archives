// ==UserScript==
// @name         Disable Google People Auto Search For
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Disable the annoying auto search for box in Google Search Page
// @author       DickyT <me@idickyt.com>
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401343/Disable%20Google%20People%20Auto%20Search%20For.user.js
// @updateURL https://update.greasyfork.org/scripts/401343/Disable%20Google%20People%20Auto%20Search%20For.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styleBlock = document.createElement('style');
    styleBlock.innerHTML = 'div[jscontroller][id][jsaction][jsdata][data-ved] div[jsname][data-ved] {display:none !important;}';
    document.head.append(styleBlock);
})();