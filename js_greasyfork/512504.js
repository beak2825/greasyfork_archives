// ==UserScript==
// @name         Expand All Sections on Otolaryngology Core Curriculum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Expands all elements with class "expandable js-expandable" on learning module pages
// @match        https://occ.entnet.org/moduleContent.aspx*
// @grant        none
// @run-at       context-menu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512504/Expand%20All%20Sections%20on%20Otolaryngology%20Core%20Curriculum.user.js
// @updateURL https://update.greasyfork.org/scripts/512504/Expand%20All%20Sections%20on%20Otolaryngology%20Core%20Curriculum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function expandElements() {
        const expandableElements = document.querySelectorAll('.expandable.js-expandable');
        expandableElements.forEach(element => {
            element.classList.add('expanded');
        });
    }

    // Run the function immediately
    expandElements();

    // Also run the function periodically to catch dynamically added elements
    setInterval(expandElements, 2000);
})();