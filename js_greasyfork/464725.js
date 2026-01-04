// ==UserScript==
// @name         Open random MDN page on new tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Opens a random page on MDN when a new tab is opened
// @match        about:newtab
// @include        about:newtab
// @license      Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464725/Open%20random%20MDN%20page%20on%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/464725/Open%20random%20MDN%20page%20on%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Total number of pages on MDN
    const totalPages = 8500;

    // Generate a random page index
    const randomIndex = Math.floor(Math.random() * totalPages);

    // Open the random page on MDN
    window.open(`https://developer.mozilla.org/en-US/docs/Web/${randomIndex}`);
})();
