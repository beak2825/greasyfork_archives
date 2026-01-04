// ==UserScript==
// @name         Hide Codeforces Problem Tags
// @namespace    https://example.com
// @version      1.0
// @description Hide "Problem tags" on Codeforces problem pages to avoid spoilers
// @match        https://codeforces.com/*
// @match        http://codeforces.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530633/Hide%20Codeforces%20Problem%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/530633/Hide%20Codeforces%20Problem%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const tagElements = document.querySelectorAll('.tag-box');
        tagElements.forEach(tag => {
            tag.style.display = 'none';
        });
    });
})();
