// ==UserScript==
// @name         Youtube Comment Count Font Size Revert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reverts the font size back to normal
// @author       TB-303
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478132/Youtube%20Comment%20Count%20Font%20Size%20Revert.user.js
// @updateURL https://update.greasyfork.org/scripts/478132/Youtube%20Comment%20Count%20Font%20Size%20Revert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle
    (`ytd-comments-header-renderer[modern-typography] .count-text.ytd-comments-header-renderer {
    font-size: 1.6rem;
    font-weight: 500;
    max-height: 2.2rem;
    }
   `);
})();