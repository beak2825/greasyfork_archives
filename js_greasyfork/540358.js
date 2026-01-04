// ==UserScript==
// @name         Focus & Resize Tag Field on HN User Page
// @namespace    https://news.ycombinator.com/
// @version      1.2
// @description  Focus and enlarge the "tag" input field even if it's added later
// @match        https://news.ycombinator.com/user?id=*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/540358/Focus%20%20Resize%20Tag%20Field%20on%20HN%20User%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/540358/Focus%20%20Resize%20Tag%20Field%20on%20HN%20User%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const widenAndFocusTagField = () => {
        const forms = document.querySelectorAll('form');

        for (const form of forms) {
            const inputs = form.querySelectorAll('input');
            if (
                inputs.length === 2 &&
                inputs[1].type === 'submit' &&
                inputs[1].value.toLowerCase() === 'save'
            ) {
                const tagInput = inputs[0];
                tagInput.focus();
                tagInput.style.width = '300px';  // Adjust this value as needed
                return true;
            }
        }

        return false;
    };

    // Try once immediately
    if (widenAndFocusTagField()) return;

    // Otherwise observe for DOM changes
    const observer = new MutationObserver(() => {
        if (widenAndFocusTagField()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
