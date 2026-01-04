// ==UserScript==
// @name        Claude Adjustable Wide Content
// @namespace   https://claude.ai/
// @version     1.0.3
// @description Adjustably widen the contents in Claude
// @author      gtfish, MikeeI
// @match       https://claude.ai/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant       GM_addStyle
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/493930/Claude%20Adjustable%20Wide%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/493930/Claude%20Adjustable%20Wide%20Content.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Adjust these factors to change the width more precisely
    const widthFactorFor3xl = 0.7; // 90% of the viewport width
    const widthFactorFor75ch = 80; // fixed 80 characters wide
    const widthFactorFor60ch = 80; // fixed 80 characters wide

    function updateStyles() {
        GM_addStyle(`
            .max-w-3xl {
                max-width: ${Math.floor(window.innerWidth * widthFactorFor3xl)}px;
            }
            .max-w-\\[75ch\\] {
                max-width: ${widthFactorFor75ch}ch;
            }
            .max-w-\\[60ch\\] {
                max-width: ${widthFactorFor60ch}ch;
            }
        `);
    }

    updateStyles();
    window.addEventListener('resize', updateStyles);
})();