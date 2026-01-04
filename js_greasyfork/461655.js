// ==UserScript==
// @name         YouTube Childproofing Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  YouTube without rounded edges on images.
// @author       44nifty
// @match        https://www.youtube.com/
// @icon         https://44nifty.com/userscripts/childproof-remover.ico
// @grant    GM_addStyle
// @license MIT
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/461655/YouTube%20Childproofing%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/461655/YouTube%20Childproofing%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle ( `
    .style-scope {
        border-radius: 0 !important;
    }
` );
})();