// ==UserScript==
// @name         Google Slides - Move Floating Toolbar to Top
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Move the right floating toolbar in Google Slides back to the top, next to the main toolbar
// @author       You
// @match        https://docs.google.com/presentation/*
// @icon         https://ssl.gstatic.com/docs/presentations/images/favicon5.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544620/Google%20Slides%20-%20Move%20Floating%20Toolbar%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/544620/Google%20Slides%20-%20Move%20Floating%20Toolbar%20to%20Top.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function moveToolbarToTop() {
        const checkInterval = setInterval(() => {
            // Select the vertical floating toolbar by its unique structure
            const verticalToolbar = document.querySelector('[aria-label][role="toolbar"][jscontroller]');
            const topToolbarContainer = document.querySelector('.punch-top-toolbar'); // Main top toolbar

            if (verticalToolbar && topToolbarContainer && !verticalToolbar.dataset.moved) {
                // Mark as moved to avoid re-moving
                verticalToolbar.dataset.moved = 'true';

                // Reset styling
                verticalToolbar.style.position = 'static';
                verticalToolbar.style.top = 'unset';
                verticalToolbar.style.left = 'unset';
                verticalToolbar.style.right = 'unset';
                verticalToolbar.style.bottom = 'unset';
                verticalToolbar.style.marginLeft = '20px';
                verticalToolbar.style.display = 'flex';
                verticalToolbar.style.flexDirection = 'row';
                verticalToolbar.style.alignItems = 'center';
                verticalToolbar.style.gap = '10px';
                verticalToolbar.style.background = 'transparent';
                verticalToolbar.style.boxShadow = 'none';

                // Move to top toolbar area
                topToolbarContainer.appendChild(verticalToolbar);

                clearInterval(checkInterval);
            }
        }, 1000);
    }

    window.addEventListener('load', moveToolbarToTop);
})();
