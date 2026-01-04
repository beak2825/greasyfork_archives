// ==UserScript==
// @name         Stack Overflow: Dark theme fixes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Includes some temporary fixes for some bugs in the beta Stack Overflow dark theme (found in https://stackoverflow.com/users/preferences/), before they get fixed. Suggest new fixes if you find them; I might add them.
// @author       SUM1
// @match        https://*.stackoverflow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403805/Stack%20Overflow%3A%20Dark%20theme%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/403805/Stack%20Overflow%3A%20Dark%20theme%20fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Edit answer pages
    if (/^https?:\/\/stackoverflow.com\/posts\/\d+\/edit/.test(document.URL)) {
        // Background colour of top help banner
        document.querySelector("#mainbar .s-notice").style.backgroundColor = 'var(--yellow-100)';
        // Question title colour
        document.querySelector(".post-editor > style").innerHTML = '\n            .question-hyperlink {\n                color: var(--black-800) !important;\n            }\n        ';
    }
    // Question pages
    if (/^https?:\/\/stackoverflow.com\/questions\/\d+\/.+/.test(document.URL)) {
        // Comment help background colour
        document.styleSheets[2].insertRule('.comment-help {background-color: var(--yellow-100); border-color: var(--yellow-200); }');
        // Comment help text colour
        document.styleSheets[2].insertRule('.comment-help > p {color: var(--black-800);}');
        // Comment help code colour
        document.styleSheets[2].insertRule('.comment-help > p > code {color: var(--black-800);}');
    }
})();