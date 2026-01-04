// ==UserScript==
// @name         Twitter UI Cleanup
// @namespace    https://github.com/Daminator4113/Twitter-UI-Cleanup
// @version      1.5
// @author       Daminator4113
// @description  Remove unwanted buttons and sections on Twitter
// @license      MIT
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @match        https://twitter.com/*
// @match        https://x.com/*
// @downloadURL https://update.greasyfork.org/scripts/522966/Twitter%20UI%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/522966/Twitter%20UI%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeParent = (selector, levels, tagName) => {
        const element = document.querySelector(selector);
        if (element) {
            let parent = element;
            for (let i = 0; i < levels; i++) {
                parent = parent.parentElement;
                if (!parent) break;
            }
            if (parent?.tagName === tagName) {
                //console.log('REMOVE',parent);
                parent.remove();
            }
        }
    };

    // The order of removal is important!
    const removeElements = () => {
        const selectors = [
            'a[href*="/i/grok"]', // Grok
            'a[data-testid="premium-signup-tab"]', // Twitter Blue
            'a[data-testid="vo-signup-tab"]', // Verified organizations
            'a[data-testid="premium-business-signup-tab"]', // Premium business
            'button[data-testid="grokImgGen"]', // "Generate Image with Grok" button.
            'div.css-175oi2r.r-1s2bzr4.r-dnmrzs.r-bnwqim', // Grok questions suggestions
            'button[aria-label="Actions Grok"]', // Grok explain tweet button
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        removeParent('a[href*="/i/premium_sign_up"]', 3, 'DIV'); // "Try Premium for free" section
        removeParent('div[data-testid="GrokDrawerHeader"]', 1, 'DIV'); // Grok Drawer → I don't know why, but removing the "GrokDrawer" div deactivate the autoplay for videos?

        const grokSVG = 'path[d="M2.205 7.423L11.745 21h4.241L6.446 7.423H2.204zm4.237 7.541L2.2 21h4.243l2.12-3.017-2.121-3.02zM16.957 0L9.624 10.435l2.122 3.02L21.2 0h-4.243zm.767 6.456V21H21.2V1.51l-3.476 4.946z"]';
        removeParent(grokSVG, 4, 'BUTTON'); // Grok profil resume
        removeParent(grokSVG, 5, 'BUTTON'); // Grok explain tweet
    };

    const observer = new MutationObserver(removeElements);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    removeElements();
})();