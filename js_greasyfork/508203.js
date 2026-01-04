// ==UserScript==
// @name         YouTube Sidebar Buttons to Bottom
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Move YouTube sidebar buttons to the bottom of the homepage
// @author       You
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508203/YouTube%20Sidebar%20Buttons%20to%20Bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/508203/YouTube%20Sidebar%20Buttons%20to%20Bottom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveSidebarButtons() {
        // Wait until the page is fully loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            // Check if we are on the YouTube homepage
            if (window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions') {
                const sidebar = document.querySelector('#end');
                const mainContent = document.querySelector('#primary');

                if (sidebar && mainContent) {
                    // Create a container for the sidebar buttons at the bottom
                    let sidebarBottomContainer = document.createElement('div');
                    sidebarBottomContainer.style.position = 'fixed';
                    sidebarBottomContainer.style.bottom = '0';
                    sidebarBottomContainer.style.left = '0';
                    sidebarBottomContainer.style.width = '100%';
                    sidebarBottomContainer.style.backgroundColor = '#fff'; // Match the background color
                    sidebarBottomContainer.style.borderTop = '1px solid #e0e0e0'; // Optional: add a border
                    sidebarBottomContainer.style.zIndex = '1000'; // Ensure it appears above other content
                    sidebarBottomContainer.style.display = 'flex';
                    sidebarBottomContainer.style.justifyContent = 'space-around';
                    sidebarBottomContainer.style.padding = '10px 0';

                    // Move sidebar buttons to the new container
                    Array.from(sidebar.children).forEach(child => {
                        sidebarBottomContainer.appendChild(child);
                    });

                    // Add the new container to the bottom of the page
                    document.body.appendChild(sidebarBottomContainer);
                }
            }
        }
    }

    // Run the function periodically as YouTube's content is dynamically loaded
    setInterval(moveSidebarButtons, 3000);
})();
