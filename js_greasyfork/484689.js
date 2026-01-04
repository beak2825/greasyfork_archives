// ==UserScript==
// @name         LinkedIn Highlight Aliens
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply red color to the title if " • 1st" is not present in visually-hidden span
// @author       You
// @match        https://www.linkedin.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484689/LinkedIn%20Highlight%20Aliens.user.js
// @updateURL https://update.greasyfork.org/scripts/484689/LinkedIn%20Highlight%20Aliens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Apply red color to the title if " • 1st" is not present in visually-hidden span */
        .update-components-actor__supplementary-actor-info span.visually-hidden:not(:contains(" • 1st")) {
            color: red !important;
        }
    `);
})();
