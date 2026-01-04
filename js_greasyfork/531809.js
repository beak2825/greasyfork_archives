// ==UserScript==
// @name         Remove tp-modal-open on Technology Review
// @description  Removes the tp-modal-open class from <body> on load and DOM changes
// @match        https://www.technologyreview.com/*
// @version 0.0.1.20250404080811
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/531809/Remove%20tp-modal-open%20on%20Technology%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/531809/Remove%20tp-modal-open%20on%20Technology%20Review.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeOverflowFromClass = () => {
        for (const sheet of document.styleSheets) {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch (e) {
                continue; // avoid CORS-restricted stylesheets
            }

            if (!rules) continue;

            for (const rule of rules) {
                if (
                    rule.selectorText === 'body.tp-modal-open' ||
                    rule.selectorText === '.tp-modal-open' ||
                    rule.selectorText === 'body.tp-modal-open, .tp-modal-open'
                ) {
                    if (rule.style && rule.style.overflow) {
                        rule.style.removeProperty('overflow');
                    }
                }
            }
        }
    };

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeOverflowFromClass);
    } else {
        removeOverflowFromClass();
    }

    // Re-run when styles might be added dynamically
    const observer = new MutationObserver(removeOverflowFromClass);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();