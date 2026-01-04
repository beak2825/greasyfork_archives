// ==UserScript==
// @name        Claude No Auto-Scroll
// @description claude no scroll
// @match       https://claude.ai/*
// @version 0.0.1.20250316174259
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/529998/Claude%20No%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/529998/Claude%20No%20Auto-Scroll.meta.js
// ==/UserScript==

function disableElementAutoScroll(element) {
    // Remove any forced heights
    element.style.minHeight = 'auto';
    element.style.height = 'auto';
    
    // Disable scroll-into-view behavior
    element.scrollIntoView = () => {};
}

// Process existing messages
document.querySelectorAll('.group.relative').forEach(disableElementAutoScroll);

// Watch for new messages
new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach(node => {
            if(node.nodeType === 1 && node.matches('.group.relative')) {
                disableElementAutoScroll(node);
            }
        });
    });
}).observe(document.body, {
    childList: true,
    subtree: true
});