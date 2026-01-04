// ==UserScript==
// @name         Reddit Sidebar Cleaner + Content Expander
// @namespace    https://greasyfork.org/en/scripts/531104-reddit-sidebar-cleaner-content-expander
// @version      1.3
// @description  Removes Reddit's right sidebar & expands main content - The perfect companion for Reddit Multi-Column
// @match        *://*.reddit.com/*
// @icon         https://i.ibb.co/6cH6j4d2/Reddit-Sidebar-Cleaner-Content-Expander.png
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531104/Reddit%20Sidebar%20Cleaner%20%2B%20Content%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/531104/Reddit%20Sidebar%20Cleaner%20%2B%20Content%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS: Hide sidebar elements on non-comment pages via a class on <html>
    const sidebarCSS = `
        html:not(.reddit-comments) #right-sidebar-container,
        html:not(.reddit-comments) .right-sidebar,
        html:not(.reddit-comments) [id^="right-sidebar"],
        html:not(.reddit-comments) [class*="sidebar-container"] {
            display: none !important;
            width: 0 !important;
            visibility: hidden !important;
            opacity: 0 !important;
            transition: none !important;
        }
        .main-container,
        [role="main"] {
            grid-template-columns: 1fr !important;
            margin-right: 0 !important;
            padding-right: 0 !important;
        }
    `;
    GM_addStyle(sidebarCSS);

    // Immediately update <html> with a flag if on a comment page.
    const updatePageClass = () => {
        if (window.location.pathname.includes('/comments/')) {
            document.documentElement.classList.add('reddit-comments');
        } else {
            document.documentElement.classList.remove('reddit-comments');
        }
    };
    updatePageClass();

    // Intercept SPA navigation by patching history methods.
    const _pushState = history.pushState;
    history.pushState = function() {
        _pushState.apply(history, arguments);
        updatePageClass();
    };
    const _replaceState = history.replaceState;
    history.replaceState = function() {
        _replaceState.apply(history, arguments);
        updatePageClass();
    };
    window.addEventListener('popstate', updatePageClass);

    // MutationObserver: If the extension injects sidebar elements later, hide them immediately.
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if the added node itself is a sidebar element.
                    if (node.matches && node.matches('#right-sidebar-container, .right-sidebar, [id^="right-sidebar"], [class*="sidebar-container"]')) {
                        node.style.display = 'none';
                    }
                    // Also check for any matching children within the added node.
                    node.querySelectorAll('#right-sidebar-container, .right-sidebar, [id^="right-sidebar"], [class*="sidebar-container"]').forEach(el => {
                        el.style.display = 'none';
                    });
                }
            });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
