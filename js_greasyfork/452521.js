// ==UserScript==
// @name         Gradescope assignment expander
// @namespace    https://gist.github.com/isaacl/86d5121ede0eeac3eb6a4016555ad70e
// @version      0.1.8
// @description  Expands programming exercises with keyboard
// @author       Isaac Levy
// @match        *://*.gradescope.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452521/Gradescope%20assignment%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/452521/Gradescope%20assignment%20expander.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    'use strict';
    const UP_CODE = 38;
    const DOWN_CODE = 40;
    const X_CODE = 88; // Cycle through.
    const C_CODE = 67; // Toggle autograder.
    const ALL_CODES = [UP_CODE, DOWN_CODE, X_CODE, C_CODE];

    let expanded = 0;
    let cur_href = window.location.href;

    document.addEventListener('keydown', (e) => {
        if (!ALL_CODES.includes(e.keyCode)) return;
        if (document.activeElement?.tagName === 'TEXTAREA') return;
        if (cur_href !== window.location.href) {
            expanded = 0;
            cur_href = window.location.href;
        }
        const allToggles = document.querySelectorAll('button.fileViewerHeader--toggleButton');
        const numToggles = allToggles.length;
        switch (e.keyCode) {
            case C_CODE:
                const autograderToggle = document.querySelector('div.autograderResultsContainer button')
                if (autograderToggle !== null) autograderToggle.click();
                // Don't mess with programming expansion, return immediately.
                return;
            case DOWN_CODE:
                if (expanded < numToggles - 1) expanded++;
                break;
            case UP_CODE:
                if (expanded > 0) expanded--;
                break;
            case X_CODE:
                if (e.shiftKey) {
                    expanded = (expanded - 1 + numToggles) % numToggles;
                } else {
                    expanded = (expanded + 1) % numToggles;
                }
                break;
        }

        allToggles.forEach((e, i) => {
            const shouldExpand = expanded === i;
            const isExpanded = e.getAttribute('aria-expanded') === 'true';
            if (shouldExpand !== isExpanded) e.click();
        });
    });
})();