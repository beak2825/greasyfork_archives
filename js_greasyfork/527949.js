// ==UserScript==
// @name         Coloured images
// @namespace    https://onlinesequencer.net/members/149323
// @author       K1ll3rB33
// @version      1.0
// @description  Colourful!
// @match        *://onlinesequencer.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527949/Coloured%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/527949/Coloured%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeFilterRule() {
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            const styleSheet = styleSheets[i];
            try {
                const rules = styleSheet.cssRules || styleSheet.rules;
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    if (rule.selectorText === '.preview .image') {
                        styleSheet.deleteRule(j);
                        console.log('Filter rule removed:', rule.cssText);
                        return;
                    }
                }
            } catch (e) {
                console.error('Error accessing stylesheet:', e);
            }
        }
    }

    removeFilterRule();

    const observer = new MutationObserver(removeFilterRule);
    observer.observe(document.body, { childList: true, subtree: true });
})();