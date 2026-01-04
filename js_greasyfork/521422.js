// ==UserScript==
// @name         Hide Specific Elements (Refined)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides specific elements using refined CSS selectors
// @author       Your Name
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521422/Hide%20Specific%20Elements%20%28Refined%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521422/Hide%20Specific%20Elements%20%28Refined%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS rules to hide the specific elements
    GM_addStyle(`
        .border-orange-400\\/15,
        div.text-sm.text-orange-600.border-token-border-light.bg-orange-400.bg-opacity-0.w-full.pr-5.text-right {
            display: none !important;
        }
    `);
})();
