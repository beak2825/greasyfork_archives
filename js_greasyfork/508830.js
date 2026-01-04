// ==UserScript==
// @name         Reddit Sticky Sidebar with Toggle
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Keep sidebar visible while scrolling, add a toggle button.
// @author       IDW
// @license MIT
// @match        https://old.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508830/Reddit%20Sticky%20Sidebar%20with%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/508830/Reddit%20Sticky%20Sidebar%20with%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sidebar = document.querySelector('.side');

    if (sidebar) {
        var stickyContainer = document.createElement('div');
        stickyContainer.id = 'sticky-sidebar-container';
        stickyContainer.style.position = 'fixed';
        stickyContainer.style.top = '100px';
        stickyContainer.style.right = '0';
        stickyContainer.style.width = sidebar.offsetWidth + 'px';
        stickyContainer.style.zIndex = '1000';

        stickyContainer.style.transition = 'transform 0.05s ease-in-out';
        stickyContainer.style.transform = 'translateX(0)';

        sidebar.parentNode.insertBefore(stickyContainer, sidebar);
        stickyContainer.appendChild(sidebar);

        var header = document.querySelector('.tabmenu');

        if (header) {
            var toggleButton = document.createElement('li');
            toggleButton.className = 'toggle-sidebar-button';

            var toggleLink = document.createElement('a');
            toggleLink.href = '#';
            toggleLink.textContent = 'I≡I';

            var sidebarVisible = true;

            toggleLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (sidebarVisible) {
                    var sidebarWidth = stickyContainer.offsetWidth;
                    stickyContainer.style.transform = 'translateX(' + (sidebarWidth + 20) + 'px)';
                } else {
                    // Afficher la sidebar
                    stickyContainer.style.transform = 'translateX(0)';
                }
                sidebarVisible = !sidebarVisible;
            });

            toggleButton.appendChild(toggleLink);
            header.appendChild(toggleButton);
        }
    }
})();