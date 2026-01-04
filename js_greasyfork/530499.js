// ==UserScript==
// @name         Sticky ChatGPT Projects
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Makes the projects stick when scrolling
// @author       Noah Peterson, ChatGPT o1
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://cdn.oaistatic.com/assets/favicon-miwirzcw.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530499/Sticky%20ChatGPT%20Projects.user.js
// @updateURL https://update.greasyfork.org/scripts/530499/Sticky%20ChatGPT%20Projects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function makeSticky() {
        // 1) The heading container
        const headingContainer = document.querySelector('div.z-20.screen-arch\\:sticky');
        if (headingContainer) {
            headingContainer.style.position = 'sticky';
            headingContainer.style.top = '0';
            headingContainer.style.zIndex = '99999';

            // Remove extra padding/border so we don't see a gap
            headingContainer.style.paddingBottom = '0';
            headingContainer.style.borderBottom = 'none';
            headingContainer.style.background = 'var(--sidebar-surface-primary)';
        }

        // 2) The <aside> containing the projects
        const aside = document.querySelector('aside.flex.flex-col.gap-4.mb-0');
        if (aside) {
            aside.style.position = 'sticky';
            aside.style.zIndex = '99998';
            aside.style.background = 'var(--sidebar-surface-primary)';

            // Remove border/padding if you like, or keep them if you want a visual divider
            aside.style.paddingBottom = '12px';
            aside.style.borderBottom = '2px solid #777';

            // Dynamically measure the heading’s actual height
            const headingHeight = headingContainer ? headingContainer.offsetHeight : 0;

            // Pin the aside exactly below that heading height
            aside.style.top = headingHeight + 'px';
        }
    }

    // Run once initially
    makeSticky();

    // Observe for dynamic re-renders
    const observer = new MutationObserver(() => {
        makeSticky();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();