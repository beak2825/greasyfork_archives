// ==UserScript==
// @name         Greasyfork No Dark Mode
// @description  Disables dark mode on Greasyfork/Sleazyfork.
// @icon         https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png
// @version      1.1
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://greasyfork.org/*
// @match        https://sleazyfork.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533364/Greasyfork%20No%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/533364/Greasyfork%20No%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeDarkModeCSS() {
        for (let i = 0; i < document.styleSheets.length; i++) {
            const sheet = document.styleSheets[i];

            try {
                const rules = sheet.cssRules;
                if (!rules) continue;

                for (let j = rules.length - 1; j >= 0; j--) {
                    const rule = rules[j];
                    if (
                        rule.type === CSSRule.MEDIA_RULE &&
                        rule.conditionText.includes('prefers-color-scheme: dark')
                    ) {
                        sheet.deleteRule(j);
                    }
                }
            } catch (e) {
                continue;
            }
        }
    }

    function observeStyleChanges() {
        const observer = new MutationObserver(() => {
            removeDarkModeCSS();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    removeDarkModeCSS();
    observeStyleChanges();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeDarkModeCSS);
    } else {
        removeDarkModeCSS();
    }
})();