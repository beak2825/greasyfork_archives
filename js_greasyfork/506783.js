// ==UserScript==
// @name         Hide Reddit Sidebar and Disable Style
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Hides the sidebar and disables specific CSS styles on Reddit
// @author       You
// @match        *://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506783/Hide%20Reddit%20Sidebar%20and%20Disable%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/506783/Hide%20Reddit%20Sidebar%20and%20Disable%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the sidebar
    function hideSidebar() {
        var sidebar = document.getElementById('left-sidebar-container');
        if (sidebar) {
            sidebar.style.display = 'none';
        }
    }

    // Function to inject custom CSS
    function injectCustomCSS() {
        if (document.getElementById('custom-style')) return; // Prevent multiple injections

        var style = document.createElement('style');
        style.id = 'custom-style';
        style.textContent = `
            /* Neutralize grid properties */
            .grid {
                all: unset !important;
            }

            @media (min-width: 1200px) {
                .m\\:grid-cols-\\[272px_1fr\\] {
                    grid-template-columns: auto; /* Adjust as needed */
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Run the functions once the page is fully loaded
    window.addEventListener('load', function() {
        hideSidebar();
        requestIdleCallback(injectCustomCSS); // Use requestIdleCallback to defer CSS injection
    });

    // Optional: observe for changes in case of dynamic content
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            hideSidebar(); // Hide the sidebar if it appears later
        });
    });

    // Observe changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
})();
