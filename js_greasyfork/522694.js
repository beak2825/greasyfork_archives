// ==UserScript==
// @name         Remove New Posts Button On X
// @namespace    https://6942020.xyz/
// @version      1.1
// @description  Remove the "... posted" button that frequently pops up on on x.com
// @author       WadeGrimridge
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522694/Remove%20New%20Posts%20Button%20On%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/522694/Remove%20New%20Posts%20Button%20On%20X.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timelineSelector = 'main[role="main"] div[aria-label="Home timeline"]';
    const buttonSelector = 'button[aria-label="New posts are available. Push the period key to go to the them."]';

    const removeButton = () => {
        const timeline = document.querySelector(timelineSelector);
        if (timeline) {
            timeline.querySelectorAll(buttonSelector).forEach(button => button.remove());
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeButton);
    } else {
        removeButton();
    }

    const observer = new MutationObserver(removeButton);
    observer.observe(document.querySelector(timelineSelector) || document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('unload', () => observer.disconnect());
})();